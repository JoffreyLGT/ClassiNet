using Database;
using Database.Entities;
using MachineLearning.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.ML;
using Microsoft.ML.Data;
using Microsoft.ML.Transforms;
using Microsoft.ML.Transforms.Text;
using Npgsql;

internal class Program
{
    /// <summary>
    ///     For the moment, this is just a console app used to test the text pipeline without starting the API.
    ///     It'll be used to develop the model.
    /// </summary>
    /// <param name="args"></param>
    private static async Task Main(string[] args)
    {
        // Build a config object, using env vars and JSON providers.
        var config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .AddEnvironmentVariables()
            .Build();

        // Create MLContext
        var mlContext = new MLContext();

        // Create DB loader
        var loader = mlContext.Data.CreateDatabaseLoader<ModelInputProduct>();

        var dbSource = new DatabaseSource(
            NpgsqlFactory.Instance,
            config["ConnectionString"],
            "SELECT \"Designation\", \"Description\", \"ImageName\", \"CategoryId\"\nFROM \"Products\""
        );

        // Load data in a streaming fashion
        var dataView = loader.Load(dbSource);

        // Split data into training and testing sets
        var splitData = mlContext.Data.TrainTestSplit(dataView, 0.2);

        // Define the training pipeline
        var pipeline = mlContext.Transforms
            .Concatenate(
                "Text",
                "Designation", "Description")
            .Append(mlContext.Transforms.Text.NormalizeText(
                "NormalizedText",
                "Text",
                TextNormalizingEstimator.CaseMode.Lower,
                false,
                false,
                false))
            .Append(mlContext.Transforms.Text.TokenizeIntoWords(
                "Words",
                "NormalizedText"))
            .Append(mlContext.Transforms.Text.RemoveDefaultStopWords(
                "WordsWithoutFrenchStopWords",
                "Words",
                StopWordsRemovingEstimator.Language.French))
            .Append(mlContext.Transforms.Text.RemoveDefaultStopWords(
                "WordsWithoutEnglishStopWords",
                "WordsWithoutFrenchStopWords"))
            .Append(mlContext.Transforms.Text.RemoveStopWords(
                "WordsWithoutStopWords",
                "WordsWithoutEnglishStopWords", "m", "dm", "cm", "mm", "le", "n", "n\u00b0", "rc"))
            .Append(mlContext.Transforms.Text.FeaturizeText(
                "Features",
                "WordsWithoutStopWords"))
            .Append(mlContext.Transforms.Conversion.MapValueToKey(
                "Label",
                "CategoryId",
                keyOrdinality: ValueToKeyMappingEstimator.KeyOrdinality.ByValue))
            .Append(mlContext.MulticlassClassification.Trainers.SdcaMaximumEntropy())
            .Append(mlContext.Transforms.Conversion.MapKeyToValue(
                "PredictedLabel", "PredictedLabel"));

        // Add a new ClassificationModels entry in db
        var classificationModelEntity = new ClassificationModelEntity
        {
            StartDate = DateTime.Now.ToUniversalTime(),
            Status = ModelStatus.Started,
            IsActive = false
        };
        var dbContext = new AppDbContext(config);
        await dbContext.ClassificationModels.AddAsync(classificationModelEntity);
        await dbContext.SaveChangesAsync();

        // Generate the model path
        Directory.CreateDirectory(config["ModelsDirectory"]);
        var modelFileName = $"sdcaMaximumEntropyModel-{DateTime.Now.ToUniversalTime():yyyyMMddHHmmss}.zip";
        var modelFilePath = $"{config["ModelsDirectory"]}/{modelFileName}";

        // Train the model
        var model = pipeline.Fit(splitData.TrainSet);
        classificationModelEntity.EndDate = DateTime.Now.ToUniversalTime();

        // Save the model
        mlContext.Model.Save(model, splitData.TrainSet.Schema, modelFilePath);
        classificationModelEntity.Status = ModelStatus.Finished;
        classificationModelEntity.FileName = modelFileName;

        // Evaluate the model
        var transformedTestData = model.Transform(splitData.TestSet);
        var metrics = mlContext.MulticlassClassification.Evaluate(transformedTestData);

        // Map the categories
        // Note: it shouldn't be done like that but instead, the pipeline should provide the functions to
        // map the results (from 0 to 16) to the categories (from 1 to 17). However, the metadata are not
        // inserted correctly in the pipeline and I didn't find any other solution...
        // It works like that thanks to "keyOrdinality: ValueToKeyMappingEstimator.KeyOrdinality.ByValue"
        // passed as an argument to "mlContext.Transforms.Conversion.MapValueToKey", but I still find this
        // solution dirty and hope Microsoft is gonna fix the metadata spreading in the pipeline!
        var categoryIds = splitData.TrainSet.GetColumn<int>("CategoryId")
            .Distinct()
            .OrderBy(id => id)
            .ToList();
        var keyToCategoryMap = categoryIds
            .Select((categoryId, index) => new { Key = index, Value = categoryId })
            .ToDictionary(x => x.Key, x => x.Value);

        // Create the confusion matrix
        var confusionMatrix = metrics.ConfusionMatrix;
        var confusionMatrixEntity = new ConfusionMatrixEntity
        {
            NumberOfClasses = confusionMatrix.NumberOfClasses,
            PerClassPrecision = confusionMatrix.PerClassPrecision
                .Select((value, i) => new PerClassScore { Class = keyToCategoryMap[i], Score = value }).ToList(),
            PerClassRecall = confusionMatrix.PerClassRecall
                .Select((value, i) => new PerClassScore { Class = keyToCategoryMap[i], Score = value }).ToList(),
            Counts = new List<CountEntity>()
        };
        for (var i = 0; i < confusionMatrix.NumberOfClasses; i++)
        {
            var realCategory = keyToCategoryMap[i]; // Map key to original category ID
            for (var j = 0; j < confusionMatrix.NumberOfClasses; j++)
            {
                var predictedCategory = keyToCategoryMap[j]; // Map key to original category ID
                confusionMatrixEntity.Counts.Add(new CountEntity
                {
                    RealClass = realCategory, PredictedClass = predictedCategory, Count = confusionMatrix.Counts[i][j]
                });
            }
        }

        // Save data in db
        var modelStats = new ModelStatsEntity
        {
            MacroAccuracy = metrics.MacroAccuracy,
            MicroAccuracy = metrics.MicroAccuracy,
            ConfusionMatrixEntity = confusionMatrixEntity
        };
        classificationModelEntity.ModelStats = modelStats;
        await dbContext.SaveChangesAsync();

        Console.WriteLine("Done");
    }
}
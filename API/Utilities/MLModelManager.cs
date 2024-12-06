using System.Text.Json;
using API.Models;
using Database;
using Database.Entities;
using MachineLearning.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.ML;

namespace API.Utilities;

/// <summary>
///     Responsible for managing machine learning models used in the application,
///     providing functionalities such as loading models, making predictions, and
///     generating category probabilities from prediction results.
/// </summary>
public class MLModelManager
{
    private readonly ILogger<MLModelManager> _logger;
    private readonly string _modelsDirectory;
    private Dictionary<int, int>? _keyToCategoryMap;
    private PredictionEngine<InputData, PredictionResult>? _predictionEngine;

    /// <summary>
    ///     Manages machine learning models used for category prediction.
    /// </summary>
    public MLModelManager(ILogger<MLModelManager> logger, IConfiguration configuration)
    {
        _logger = logger;
        var modelsDirectory = configuration["ModelsDirectory"];
        if (modelsDirectory == null)
            _logger.LogError("Failed to load models directory, prediction feature will not work.");
        _modelsDirectory = modelsDirectory ?? "";
    }

    /// <summary>
    ///     Retrieves the active classification model from the database.
    ///     Logs errors if no active model is found or if multiple active models exist.
    /// </summary>
    /// <param name="dbContext">
    ///     The database context used to access the classification models.
    /// </param>
    /// <returns>
    ///     The active <see cref="ClassificationModelEntity" /> or null if no active model is found.
    /// </returns>
    private async Task<ClassificationModelEntity?> GetActiveModel(AppDbContext dbContext)
    {
        var models = await dbContext.ClassificationModels
            .Where(model => model.IsActive)
            .OrderByDescending(model => model.StartDate)
            .ToListAsync();

        if (models.Count == 0) _logger.LogError("No active model found.");
        if (models.Count > 1) _logger.LogError("Multiple active models found, latest one will be loaded.");

        return models.FirstOrDefault();
    }

    /// <summary>
    ///     Loads the active machine learning model from the database and prepares it for making predictions.
    ///     This includes verifying the existence of the model file, deserializing the key-to-category map,
    ///     and setting up the prediction engine using the ML.NET framework.
    /// </summary>
    /// <param name="dbContext">The database context used to retrieve the active model and its associated data.</param>
    /// <exception cref="Exception">
    ///     Thrown when no active model is found, the model file does not exist, or required data is
    ///     missing.
    /// </exception>
    private async Task LoadModel(AppDbContext dbContext)
    {
        var model = await GetActiveModel(dbContext);

        if (model == null) throw new Exception("No active model found, prediction features will not work.");
        if (model.FileName == null) throw new Exception("ClassificationModelEntity.FileName is not set.");
        var modelFilePath = Path.Combine(_modelsDirectory, model.FileName);
        if (!File.Exists(modelFilePath)) throw new Exception($"Model file does not exists.\n{modelFilePath}");

        if (model.KeyToCategoryMap == null) throw new Exception("Key to category map is not set.");
        _keyToCategoryMap = JsonSerializer.Deserialize<Dictionary<int, int>>(model.KeyToCategoryMap);

        var mlContext = new MLContext();
        var mlModel = mlContext.Model.Load(modelFilePath, out var modelInputSchema);
        _predictionEngine = mlContext.Model.CreatePredictionEngine<InputData, PredictionResult>(mlModel);
    }

    /// <summary>
    ///     Generates a list of category probabilities from the given prediction result.
    /// </summary>
    /// <param name="result">The prediction result containing scores for each category.</param>
    /// <returns>A list of <see cref="CategoryProbabilityDto" /> representing the probability of each category.</returns>
    public List<CategoryProbabilityDto> GenerateProbabilityList(PredictionResult result)
    {
        if (_keyToCategoryMap == null) throw new Exception("Key to category map is not set.");
        var probabilities = new List<CategoryProbabilityDto>();
        for (var i = 0; i < result.Scores.Length; i++)
            probabilities.Add(new CategoryProbabilityDto
                { CategoryId = _keyToCategoryMap[i], Probability = result.Scores[i] * 100 });
        return probabilities;
    }

    /// <summary>
    ///     Predicts the category based on the given designation and description.
    /// </summary>
    /// <param name="dbContext">The database context for loading the model if necessary.</param>
    /// <param name="designation">The designation associated with the input data.</param>
    /// <param name="description">The description that complements the designation for category prediction.</param>
    /// <returns>A <see cref="PredictionAnswerDto" /> containing the predicted category details and probabilities.</returns>
    public async Task<PredictionAnswerDto?> PredictCategory(AppDbContext dbContext, string designation,
        string description)
    {
        if (_predictionEngine == null) await LoadModel(dbContext);
        var result = _predictionEngine!.Predict(new InputData
            { Designation = designation, Description = description });
        return new PredictionAnswerDto
        {
            Description = description,
            Designation = designation,
            Probabilities = GenerateProbabilityList(result)
        };
    }
}
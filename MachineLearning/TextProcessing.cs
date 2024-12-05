using System.Net;
using HtmlAgilityPack;
using Microsoft.ML;
using Microsoft.ML.Data;
using Microsoft.ML.Transforms.Text;

namespace MachineLearning;

public static class TextProcessing
{
    /// <summary>
    ///     Process the provided values and update the dictionaries.
    ///     A text pipeline is implemented to:
    ///     - Remove any HTML tag
    ///     - Normalize the text
    ///     - Remove French stop words (list from Microsoft)
    ///     - Remove English stop words (list from Microsoft)
    ///     - Remove custom stop words
    /// </summary>
    /// <param name="valuesFromDb">values to process</param>
    /// <param name="processedWordCount">
    ///     Dictionary to update with the words encountered in the values after the removal of
    ///     stop words
    /// </param>
    /// <param name="wordCount">Dictionary to update with the words encounteresd in the values before the removal of stop words</param>
    public static void GetTextData(IEnumerable<string> valuesFromDb,
        ref Dictionary<string, int> processedWordCount,
        ref Dictionary<string, int> wordCount)
    {
        var mlContext = new MLContext();
        var htmlDoc = new HtmlDocument();

        var nbValues = 0;
        var dataView = mlContext.Data.LoadFromEnumerable(valuesFromDb.Select(value =>
        {
            nbValues++;
            htmlDoc.LoadHtml(value);
            return new { Text = WebUtility.HtmlDecode(htmlDoc.DocumentNode.InnerText) };
        }));

        // Normalize text => Tokenize into words => Remove French stop words => Remove English stop words
        // var textPipeline = mlContext.Transforms.Text
        //     .NormalizeText(
        //         "NormalizedText",
        //         "Text",
        //         TextNormalizingEstimator.CaseMode.Lower,
        //         false,
        //         false,
        //         false)
        //     .Append(mlContext.Transforms.Text.TokenizeIntoWords(
        //         "Words",
        //         "NormalizedText"))
        //     .Append(mlContext.Transforms.Text.RemoveDefaultStopWords(
        //         "WordsWithoutFrenchStopWords",
        //         "Words",
        //         StopWordsRemovingEstimator.Language.French))
        //     .Append(mlContext.Transforms.Text.RemoveDefaultStopWords(
        //         "WordsWithoutEnglishStopWords",
        //         "WordsWithoutFrenchStopWords"))
        //     .Append(mlContext.Transforms.Text.RemoveStopWords(
        //         "WordsWithoutStopWords",
        //         "WordsWithoutEnglishStopWords", "m", "dm", "cm", "mm", "le", "n", "n\u00b0", "rc"))
        var textPipeline = TextCleaningEstimator(mlContext).Append(mlContext.Transforms.Text.ProduceWordBags(
            "BagOfWordsWithoutStopWords",
            "WordsWithoutStopWords",
            1,
            useAllLengths: false,
            weighting: NgramExtractingEstimator.WeightingCriteria.Tf
        ));

        var transformedData = textPipeline.Fit(dataView).Transform(dataView);
        var preview = transformedData.Preview(nbValues);

        foreach (var row in preview.RowView)
        {
            var words =
                row.Values.First(v => v.Key == "Words").Value as VBuffer<ReadOnlyMemory<char>>?;
            if (words != null)
                foreach (var pair in words.Value.Items())
                    if (!string.IsNullOrEmpty(pair.ToString()) && pair.Value.ToString().Length > 1)
                        wordCount[pair.Value.ToString()] = wordCount.GetValueOrDefault(pair.Value.ToString(), 0) + 1;

            var wordsWithoutStopWords =
                row.Values.First(v => v.Key == "WordsWithoutStopWords").Value as VBuffer<ReadOnlyMemory<char>>?;
            if (wordsWithoutStopWords != null)
                foreach (var pair in wordsWithoutStopWords.Value.Items())
                    if (!string.IsNullOrEmpty(pair.ToString()) && pair.Value.ToString().Length > 1)
                        processedWordCount[pair.Value.ToString()] =
                            processedWordCount.GetValueOrDefault(pair.Value.ToString(), 0) + 1;
        }
    }

    public static EstimatorChain<CustomStopWordsRemovingTransformer> TextCleaningEstimator(MLContext mlContext)
    {
        return mlContext.Transforms.Text
            .NormalizeText(
                "NormalizedText",
                "Text",
                TextNormalizingEstimator.CaseMode.Lower,
                false,
                false,
                false)
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
                "WordsWithoutEnglishStopWords", "m", "dm", "cm", "mm", "le", "n", "n\u00b0", "rc"));
    }
}
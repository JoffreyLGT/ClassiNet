namespace API.Models;

/// <summary>
///     Represents the prediction answer data transfer object that extends the prediction request with category
///     probabilities.
///     It contains the input data for the prediction, such as designation and description, and the resulting
///     probabilities for each category that the input data may belong to.
/// </summary>
public class PredictionAnswerDto : PredictionRequestDto
{
    /// <summary>
    ///     Gets or sets the list of category probabilities associated with the prediction.
    ///     Each element in the list represents a category and its likelihood, indicating
    ///     how probable it is that the input data falls into that category.
    /// </summary>
    public List<CategoryProbabilityDto> Probabilities { get; set; }
}
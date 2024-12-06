using System.ComponentModel.DataAnnotations;

namespace API.Models;

/// <summary>
///     Represents the data transfer object for a prediction request, which contains the necessary information
///     to make a prediction. This includes the designation of the item to be categorized and an optional description.
/// </summary>
public class PredictionRequestDto
{
    /// <summary>
    ///     Represents the name or title of a product used for categorization purposes in a prediction request.
    /// </summary>
    [Required]
    [MaxLength(256)]
    public string Designation { get; set; }

    /// <summary>
    ///     Represents the description of a product used for categorization purposes in a prediction request.
    /// </summary>
    public string? Description { get; set; }
}
namespace API.Models;

/// <summary>
///     Represents the probability of a specific category.
///     This data transfer object is used to encapsulate the likelihood that a given input belongs to a particular
///     category,
///     with the category identified by an ID and the probability expressed as a floating-point value.
/// </summary>
public class CategoryProbabilityDto
{
    /// <summary>
    ///     Gets or sets the identifier for a category. This ID uniquely represents a category within the
    ///     context of the category probability data transfer object.
    /// </summary>
    public int CategoryId { get; set; }

    /// <summary>
    ///     Gets or sets the probability that an input belongs to a particular category.
    ///     Expressed as a floating-point value, this property represents the likelihood percentage
    ///     associated with the category identified by CategoryId in the <see cref="CategoryProbabilityDto" /> class.
    /// </summary>
    public float Probability { get; set; }
}
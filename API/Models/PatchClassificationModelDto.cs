using System.ComponentModel.DataAnnotations;

namespace API.Models;

/// <summary>
/// Data Transfer Object for patch classification model.
/// </summary>
public class PatchClassificationModelDto
{
    /// <summary>
    /// Gets or sets the unique identifier.
    /// </summary>
    [Key] public Guid Id { get; set; }

    public string? Name { get; set; }
    public string? Description { get; set; }

    /// <summary>
    /// Gets or sets the start date.
    /// </summary>
    public DateTime? StartDate { get; set; }

    /// <summary>
    /// Gets or sets the end date.
    /// </summary>
    public DateTime? EndDate { get; set; }

    /// <summary>
    /// Gets or sets the status.
    /// </summary>
    public int? Status { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the model is active.
    /// </summary>
    public bool? IsActive { get; set; }

    /// <summary>
    /// Gets or sets the file name.
    /// </summary>
    public string? FileName { get; set; }
}

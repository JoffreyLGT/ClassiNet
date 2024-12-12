namespace API.Models;

/// <summary>
/// Represents a data transfer object for post classification model.
/// </summary>
public class PostClassificationModelDto
{
    /// <summary>
    /// Gets or sets the start date of the classification model.
    /// </summary>
    public DateTime StartDate { get; set; }

    /// <summary>
    /// Gets or sets the end date of the classification model.
    /// </summary>
    public DateTime? EndDate { get; set; }

    /// <summary>
    /// Gets or sets the status of the classification model.
    /// </summary>
    public int Status { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the classification model is active.
    /// </summary>
    public bool IsActive { get; set; }

    /// <summary>
    /// Gets or sets the file name associated with the classification model.
    /// </summary>
    public string? FileName { get; set; }

    /// <summary>
    /// Gets or sets the model statistics.
    /// </summary>
    public int ModelStats { get; set; }

    /// <summary>
    /// Dictionary serialized into JSON for storage.
    /// </summary>
    public string? SerializedDictionary { get; set; }
}

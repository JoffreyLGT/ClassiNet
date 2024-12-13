using System.ComponentModel.DataAnnotations;

namespace Database.Entities;

/// <summary>
/// Represents a classification model entity.
/// </summary>
public class ClassificationModelEntity : BaseEntity
{
    /// <summary>
    /// Gets or sets the unique identifier for the classification model.
    /// </summary>
    [Key] public Guid Id { get; set; }

    /// <summary>
    /// Gets or sets the name of the classification model.
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// Gets or sets the description of the classification model.
    /// </summary>
    public string? Description { get; set; }

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
    public ModelStatus Status { get; set; }

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
    public ModelStatsEntity? ModelStats { get; set; }

    /// <summary>
    /// Gets or sets the dictionary serialized into JSON for storage.
    /// Use the key as the index of an element in the Scores property of PredictionResult
    /// and the Category ID as a value.
    /// </summary>
    public string? KeyToCategoryMap { get; set; }
}

/// <summary>
/// Represents the status of the classification model.
/// </summary>
public enum ModelStatus
{
    /// <summary>
    /// The classification model has started.
    /// </summary>
    Started,

    /// <summary>
    /// The classification model has finished.
    /// </summary>
    Finished,

    /// <summary>
    /// The classification model has been cancelled.
    /// </summary>
    Cancelled
}

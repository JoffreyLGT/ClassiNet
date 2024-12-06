using System.ComponentModel.DataAnnotations;

namespace Database.Entities;

public class ClassificationModelEntity : BaseEntity
{
    [Key] public Guid Id { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public ModelStatus Status { get; set; }
    public bool IsActive { get; set; }
    public string? FileName { get; set; }
    public ModelStatsEntity? ModelStats { get; set; }

    /// <summary>
    ///     Dictionary serialized into JSON for storage.
    ///     Use the key as the index of an element in the Scores property of PredictionResult
    ///     and the Category ID as a value.
    /// </summary>
    public string? KeyToCategoryMap { get; set; }
}

public enum ModelStatus
{
    Started,
    Finished,
    Cancelled
}
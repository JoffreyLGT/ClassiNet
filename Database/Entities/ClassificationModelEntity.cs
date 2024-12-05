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
}

public enum ModelStatus
{
    Started,
    Finished,
    Cancelled
}
using System.ComponentModel.DataAnnotations;

namespace Database.Entities;

public class ModelStatsEntity : BaseEntity
{
    [Key] public Guid Id { get; set; }

    public double MacroAccuracy { get; set; }
    public double MicroAccuracy { get; set; }
    public ConfusionMatrixEntity ConfusionMatrixEntity { get; set; }
}
using System.ComponentModel.DataAnnotations;

namespace Database.Entities;

public class ConfusionMatrixEntity : BaseEntity
{
    [Key] public Guid Id { get; set; }

    public int NumberOfClasses { get; set; }
    public List<CountEntity> Counts { get; set; }
    public List<PerClassScore> PerClassPrecision { get; set; }
    public List<PerClassScore> PerClassRecall { get; set; }
}
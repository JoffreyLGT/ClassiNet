using System.ComponentModel.DataAnnotations;

namespace Database.Entities;

public class CountEntity
{
    [Key] public Guid Id { get; set; }
    public int RealClass { get; set; }
    public int PredictedClass { get; set; }
    public double Count { get; set; }
}
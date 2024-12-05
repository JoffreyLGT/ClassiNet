using System.ComponentModel.DataAnnotations;

namespace Database.Entities;

/// <summary>
///     Entity used to store double values in DB.
/// </summary>
public class PerClassScore
{
    [Key] public Guid Id { get; set; }

    [Required] public int Class { get; set; }
    [Required] public double Score { get; set; }
}
using CsvHelper.Configuration.Attributes;

namespace API.Models;

/// <summary>
///     Defines the structure of each line of a CSV file containing products.
/// </summary>
public class CsvProductLine
{
    [Index(0)] public int LineNumber { get; set; }
    [Index(1)] public string Designation { get; set; }
    [Index(2)] public string? Description { get; set; }
    [Index(3)] public long ProductId { get; set; }
    [Index(4)] public long ImageId { get; set; }
    [Index(5)] public int ProductTypeCode { get; set; }
}
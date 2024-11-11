namespace API.Models;

/// <summary>
/// Product sold on an e-commerce platform.
/// </summary>
public class Product
{ 
    public int Id { get; set; }
    public string? Designation { get; set; }
    public string? Description { get; set; }
    public int? ImageId { get; set; }
}
namespace API.Models;

/// <summary>
///     Product sold on an e-commerce platform.
/// </summary>
public class Product
{
    /// <summary>
    ///     Unique identifier of the product.
    /// </summary>
    public long Id { get; set; }

    /// <summary>
    ///     Short sentence to designate the product.
    /// </summary>
    public string? Designation { get; set; }

    /// <summary>
    ///     Short description of the product.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    ///     Name of the product image file.
    /// </summary>
    public string? ImageName { get; set; }

    /// <summary>
    ///     Category of the product.
    /// </summary>
    public Category Category { get; set; }
}
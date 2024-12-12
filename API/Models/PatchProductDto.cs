using System.ComponentModel.DataAnnotations;

namespace API.Models;

/// <summary>
///     Object received from client when they want to patch a product.
/// </summary>
public class PatchProductDto
{
    /// <summary>
    ///     Unique identifier of the product.
    /// </summary>
    public long Id { get; set; }

    /// <summary>
    ///     Short sentence to designate the product.
    /// </summary>
    [MaxLength(256)]
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
    ///     Identifier of the category of the product.
    /// </summary>
    public int? CategoryId { get; set; }
}

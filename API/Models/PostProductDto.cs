using System.ComponentModel.DataAnnotations;

namespace API.Models;

/// <summary>
///     Object received from client when they want to add a product.
/// </summary>
public class PostProductDto
{
    /// <summary>
    ///     Short sentence to designate the product.
    /// </summary>
    [Required]
    [MaxLength(256)]
    public string Designation { get; set; }

    /// <summary>
    ///     Short description of the product.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    ///     Identifier of the category of the product.
    /// </summary>
    public int CategoryId { get; set; }
}
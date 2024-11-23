namespace API.Models;

/// <summary>
///     Category of a product.
/// </summary>
public class Category : BaseEntity
{
    /// <summary>
    ///     Unique identifier.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    ///     Name of the category.
    /// </summary>
    public string Name { get; set; }
}
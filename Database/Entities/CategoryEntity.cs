namespace Database.Entities;

/// <summary>
///     Category of a product.
/// </summary>
public class CategoryEntity : BaseEntity
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
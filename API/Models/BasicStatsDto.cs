namespace API.Models;

/// <summary>
///     Contains all the properties used to display basic stats.
/// </summary>
public class BasicStatsDto
{
    /// <summary>
    ///     Number of users.
    /// </summary>
    public long NbUsers { get; set; }

    /// <summary>
    ///     Number of users with validated emails.
    /// </summary>
    public long NbActiveUsers { get; set; }

    /// <summary>
    ///     Number of products.
    /// </summary>
    public long NbProducts { get; set; }

    /// <summary>
    ///     Number of new products created between now and a month ago.
    /// </summary>
    public long NbProductsCreatedLastMonth { get; set; }

    /// <summary>
    ///     Number of product categories.
    /// </summary>
    public long NbCategories { get; set; }
}
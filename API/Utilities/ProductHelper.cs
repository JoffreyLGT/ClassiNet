namespace API.Utilities;

public static class ProductHelper
{
    /// <summary>
    /// Check if the product exists in database.
    /// </summary>
    /// <param name="id">identifier of the product</param>
    /// <returns>true if it exists, false otherwise</returns>
    public static bool ProductExists(AppDbContext context, int id)
    {
        return context.Products.Any(e => e.Id == id);
        
    }
}
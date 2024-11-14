using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Database;

/// <summary>
/// Bridge between Entity Framework and Database.
/// Provides access to the database tables.
/// </summary>
/// <param name="options"></param>
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    /// <summary>
    /// Access to the Products table.
    /// </summary>
    public DbSet<Product> Products { get; set; }
    /// <summary>
    /// Access to the Users table.
    /// </summary>
    public DbSet<User> Users { get; set; }
}

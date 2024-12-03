using Database.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Database;

/// <summary>
///     Bridge between Entity Framework and Database.
///     Provides access to the database tables.
/// </summary>
public class AppDbContext : IdentityDbContext<UserEntity, RoleEntity, string>
{
    private readonly string _connectionString;
    private readonly IConfigurationSection _seededAdminSection;
    private readonly IConfigurationSection _seededUserSection;

    /// <summary>
    ///     Default constructor.
    /// </summary>
    /// <param name="configuration">app configuration</param>
    public AppDbContext(IConfiguration configuration)
    {
        _seededAdminSection = configuration.GetSection("SeededAdmin");
        _seededUserSection = configuration.GetSection("SeededUser");
        _connectionString = configuration["ConnectionString"];
    }

    /// <summary>
    ///     Access to the Category table.
    /// </summary>
    public DbSet<CategoryEntity> Categories { get; init; }

    /// <summary>
    ///     Access to the Products table.
    /// </summary>
    public DbSet<ProductEntity> Products { get; init; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(_connectionString);
    }

    /// <summary>
    ///     Automatically set CreatedDate and UpdatedDate when saving
    ///     entities inheriting BaseEntity.
    /// </summary>
    /// <returns></returns>
    public override int SaveChanges()
    {
        SetBaseEntityDates();
        return base.SaveChanges();
    }

    /// <summary>
    ///     Automatically set CreatedDate and UpdatedDate when saving
    ///     entities inheriting BaseEntity.
    /// </summary>
    /// <returns></returns>
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        SetBaseEntityDates();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void SetBaseEntityDates()
    {
        var entries = ChangeTracker
            .Entries()
            .Where(e => e.Entity is BaseEntity && (
                e.State == EntityState.Added
                || e.State == EntityState.Modified));

        foreach (var entityEntry in entries)
        {
            ((BaseEntity)entityEntry.Entity).UpdatedDate = DateTime.Now.ToUniversalTime();

            if (entityEntry.State == EntityState.Added)
                ((BaseEntity)entityEntry.Entity).CreatedDate = DateTime.Now.ToUniversalTime();
        }
    }

    /// <summary>
    ///     Seed database if it is empty.
    /// </summary>
    /// <param name="builder"></param>
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        // Generate roles and insert them in database
        var adminRole = GetAdminRole();
        var userRole = GetUserRole();
        builder.Entity<RoleEntity>().HasData(adminRole, userRole);
        // Generate the first users and insert them in database
        var adminUser = GenerateAdminUser();
        var standardUser = GenerateStandardUser();
        builder.Entity<UserEntity>().HasData(adminUser, standardUser);
        // Insert user roles in database
        builder.Entity<IdentityUserRole<string>>().HasData(
            new IdentityUserRole<string>
            {
                UserId = adminUser.Id,
                RoleId = adminRole.Id
            },
            new IdentityUserRole<string>
            {
                UserId = standardUser.Id,
                RoleId = adminRole.Id
            });

        // Generate the product categories and insert them in database
        builder.Entity<CategoryEntity>().HasData(GenerateCategories());
    }

    /// <summary>
    ///     Generate the list of categories to seed the database.
    /// </summary>
    /// <returns>list of categories</returns>
    private static List<CategoryEntity> GenerateCategories()
    {
        return new List<CategoryEntity>
        {
            new() { Id = 1, Name = "Littérature" },
            new() { Id = 2, Name = "Jeux vidéos" },
            new() { Id = 3, Name = "Produits dérivés" },
            new() { Id = 4, Name = "Cartes à collectionner" },
            new() { Id = 5, Name = "Jouets" },
            new() { Id = 6, Name = "Jouets pour enfants" },
            new() { Id = 7, Name = "Objets télécommandés" },
            new() { Id = 8, Name = "Hobbies" },
            new() { Id = 9, Name = "Activités extérieures" },
            new() { Id = 10, Name = "Jardinage" },
            new() { Id = 11, Name = "Accessoires et vêtements bas-âges" },
            new() { Id = 12, Name = "Décorations d'intérieur" },
            new() { Id = 13, Name = "Epicerie" },
            new() { Id = 14, Name = "Accessoires animaux de compagnie" },
            new() { Id = 15, Name = "Magazine" },
            new() { Id = 16, Name = "Bureautique" },
            new() { Id = 17, Name = "Piscine" }
        };
    }


    /// <summary>
    ///     Generate the first admin user based on secret data.
    /// </summary>
    /// <returns></returns>
    private UserEntity GenerateAdminUser()
    {
        var passwordHasher = new PasswordHasher<UserEntity>();
        return new UserEntity
        {
            Id = Guid.NewGuid().ToString(),
            UserName = _seededAdminSection["UserName"],
            NormalizedUserName = _seededAdminSection["UserName"]!.ToUpperInvariant(),
            Email = _seededAdminSection["Email"],
            NormalizedEmail = _seededAdminSection["Email"]!.ToUpperInvariant(),
            EmailConfirmed = true,
            PasswordHash = passwordHasher.HashPassword(null!, _seededAdminSection["Password"]!)
        };
    }

    /// <summary>
    ///     Generate the first standard user based on secret data.
    /// </summary>
    /// <returns></returns>
    private UserEntity GenerateStandardUser()
    {
        var passwordHasher = new PasswordHasher<UserEntity>();
        return new UserEntity
        {
            Id = Guid.NewGuid().ToString(),
            UserName = _seededUserSection["UserName"],
            NormalizedUserName = _seededUserSection["UserName"]!.ToUpperInvariant(),
            Email = _seededUserSection["Email"],
            NormalizedEmail = _seededUserSection["Email"]!.ToUpperInvariant(),
            EmailConfirmed = true,
            PasswordHash = passwordHasher.HashPassword(null!, _seededUserSection["Password"]!)
        };
    }

    /// <summary>
    ///     Create a Role object for the admin role.
    /// </summary>
    /// <returns>admin role object</returns>
    private RoleEntity GetAdminRole()
    {
        return new RoleEntity
        {
            Id = Guid.NewGuid().ToString(),
            Name = "Admin",
            NormalizedName = "ADMIN",
            Description = "Administrator role for the user managing the application."
        };
    }

    /// <summary>
    ///     Create a Role object for the user role.
    /// </summary>
    /// <returns>user role object</returns>
    private RoleEntity GetUserRole()
    {
        return new RoleEntity
        {
            Id = Guid.NewGuid().ToString(),
            Name = "User",
            NormalizedName = "USER",
            Description = "Basic user role."
        };
    }
}
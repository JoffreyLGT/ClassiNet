namespace API.Database;

/// <summary>
/// Provides functions to request the Users table in database.
/// </summary>
public static class UserHelper
{
    /// <summary>
    /// Check if a User with the provided id exists in database.
    /// </summary>
    /// <param name="context">database context</param>
    /// <param name="id">unique identifier of the user</param>
    /// <returns>true if a user with the id exists, false otherwise.</returns>
    public static bool UserExists(this AppDbContext context, int id)
    {
        return context.Users.Any(e => e.Id == id);
    }

    /// <summary>
    /// Check if a User with the provided email address exists in database.
    /// </summary>
    /// <param name="context">database context</param>
    /// <param name="email">user email address, unique in database</param>
    /// <returns>true if a user with the email exists, false otherwise.</returns>

    public static bool UserExists(this AppDbContext context, string email)
    {
        return context.Users.Any(e => e.Email == email);
    }
}


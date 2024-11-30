using System.ComponentModel.DataAnnotations;

namespace API.Models;

/// <summary>
///     DTO containing the properties to update a user.
/// </summary>
public class UserForPatchDto
{
    /// <summary>
    ///     User unique identifier.
    /// </summary>
    [Required]
    public string Id { get; set; }

    /// <summary>
    ///     User name, max 32 characters.
    /// </summary>
    [MaxLength(32)]
    public string? UserName { get; set; }

    /// <summary>
    ///     User company name, max 32 characters.
    /// </summary>
    [MaxLength(32)]
    public string? Company { get; set; }

    /// <summary>
    ///     User email.
    /// </summary>
    public string? Email { get; set; }

    /// <summary>
    ///     User password to log in.
    /// </summary>
    public string? Password { get; set; }

    /// <summary>
    ///     User role, default is "User".
    /// </summary>
    public string? Role { get; set; }

    /// <summary>
    ///     True to set the user as activated.
    /// </summary>
    public bool? Activated { get; set; }

    /// <summary>
    ///     True to disable the user account and block them from logging in.
    /// </summary>
    public bool? Disabled { get; set; }
}
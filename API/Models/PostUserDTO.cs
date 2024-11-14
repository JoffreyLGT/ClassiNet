using System.ComponentModel.DataAnnotations;

namespace API.Models;

/// <summary>
/// Defines the properties that must be provided when registering a new user.
/// </summary>
public class PostUserDTO
{
    /// <summary>
    /// Email of the user used to log in.
    /// </summary>
    [Required, EmailAddress]
    public string Email { get; set; }

    /// <summary>
    /// Name of the user.
    /// </summary>
    [StringLength(32, MinimumLength = 3)]
    public string? Name { get; set; }

    /// <summary>
    /// Company of the user.
    /// </summary>
    [StringLength(32, MinimumLength = 3)]
    public string? Company { get; set; }

    /// <summary>
    /// User password.
    /// </summary>
    [Required, StringLength(10, MinimumLength = 5)]
    public string? Password { get; set; }
}
using System.ComponentModel.DataAnnotations;

namespace API.Models;

/// <summary>
/// DTO for user registration.
/// </summary>
public class UserForRegistrationDto
{
    /// <summary>
    /// User name, max 32 characters.
    /// </summary>
    [Required(ErrorMessage = "UserName is required")]
    [MaxLength(32)]
    public string? UserName { get; set; }

    /// <summary>
    /// User company name, max 32 characters.
    /// </summary>
    [MaxLength(32)]
    public string? Company { get; set; }

    /// <summary>
    /// User email.
    /// </summary>
    [Required(ErrorMessage = "Email is required")]
    public string? Email { get; set; }

    /// <summary>
    /// User password to log in.
    /// </summary>
    [Required(ErrorMessage = "Password is required")]
    public string? Password { get; set; }

    /// <summary>
    /// Confirmation of the user password.
    /// </summary>
    [Compare("Password", ErrorMessage = "Passwords do not match")]
    public string? ConfirmPassword { get; set; }

    /// <summary>
    /// User role, default is "user".
    /// </summary>
    public string? Role { get; set; } = "User";
}
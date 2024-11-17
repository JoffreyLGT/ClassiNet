using System.ComponentModel.DataAnnotations;

namespace API.Models;

/// <summary>
/// DTO to get the user authentication.
/// </summary>
public class UserForAuthenticationDto
{
    /// <summary>
    /// User email to log in.
    /// </summary>
    [Required(ErrorMessage = "Email is required")]
    public string? Email { get; set; }

    /// <summary>
    /// User password to log in.
    /// </summary>
    [Required(ErrorMessage = "Password is required")]
    public string? Password { get; set; }
}
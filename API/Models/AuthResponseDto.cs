namespace API.Models;

/// <summary>
/// DTO to send an authentication response to the client.
/// </summary>
public class AuthResponseDto
{
    /// <summary>
    /// True if the authentication was successful.
    /// </summary>
    public bool IsAuthSuccessful { get; set; }

    /// <summary>
    /// Error message if the authentication failed.
    /// </summary>
    public string? ErrorMessage { get; set; }

    /// <summary>
    /// JSON Web Token to use when accessing protected routes.
    /// </summary>
    public string? Token { get; set; }

    /// <summary>
    /// User information when authenticated
    /// </summary>
    public UserDto? User { get; set; }
}
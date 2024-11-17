namespace API.Models;

/// <summary>
/// DTO to send a registration response to the client.
/// </summary>
public class RegistrationResponseDto
{
    /// <summary>
    /// True if the registration was successful.
    /// </summary>
    public bool IsSuccessfulRegistration { get; set; }

    /// <summary>
    /// Error message if the registration failed.
    /// </summary>
    public IEnumerable<string>? Errors { get; set; }
}
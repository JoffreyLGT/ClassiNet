using System.ComponentModel.DataAnnotations;

namespace API.Models;

public class UserDto
{
    [Required] public string Email { get; set; }
    public string Id { get; set; }
    public string? UserName { get; set; }
    public string? Company { get; set; }
    public string? Role { get; set; }
    public bool Activated { get; set; }
    public bool Disabled { get; set; }
    public int NumberOfLogins { get; set; }
}
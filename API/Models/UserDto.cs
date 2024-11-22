using System.ComponentModel.DataAnnotations;

namespace API.Models;

public class UserDto
{
    [Required]
    public string Email { get; set; }
    public string? Company { get; set; }
    public string? UserName { get; set; }

}
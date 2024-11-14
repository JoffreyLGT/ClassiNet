using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace API.Models;

/// <summary>
/// Define a User account object.
/// </summary>
[Index(nameof(Email), IsUnique = true)]
public class User
{
    /// <summary>
    /// Unique identifier of the user in database.
    /// </summary>
    [Required]
    public int Id { get; set; }

    /// <summary>
    /// Email of the user used to log in.
    /// </summary>
    [EmailAddress]
    public string Email { get; set; }

    /// <summary>
    /// True if the user account is usable. False for disabled accounts.
    /// </summary>
    public bool IsActive { get; set; }

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
    /// Password to log in.
    /// </summary>
    [Required, StringLength(10, MinimumLength = 5)]
    public string? Password { get; set; }

    /// <summary>
    /// Empty constructor.
    /// </summary>
    public User()
    {
    }

    /// <summary>
    /// Constructor from a PostUserDTO object.
    /// </summary>
    /// <param name="from"></param>
    public User(PostUserDTO from)
    {
        this.Email = from.Email;
        this.Company = from.Company;
        this.Name = from.Name;
        this.Password = from.Password;
    }
}
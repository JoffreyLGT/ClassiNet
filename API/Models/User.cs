using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace API.Models;

/// <summary>
/// Define a User account object.
/// </summary>
public class User : IdentityUser
{
    /// <summary>
    /// Company of the user.
    /// </summary>
    [StringLength(32, MinimumLength = 3)]
    public string? Company { get; set; }


    /// <summary>
    /// Empty constructor.
    /// </summary>
    public User()
    {
    }
}
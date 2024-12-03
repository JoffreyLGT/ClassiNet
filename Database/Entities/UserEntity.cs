using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Database.Entities;

/// <summary>
///     Define a UserEntity account object.
/// </summary>
public class UserEntity : IdentityUser
{
    /// <summary>
    ///     Empty constructor.
    /// </summary>
    public UserEntity()
    {
    }

    /// <summary>
    ///     Company of the user.
    /// </summary>
    [StringLength(32, MinimumLength = 3)]
    public string? Company { get; set; }

    /// <summary>
    ///     Number of times the user authenticated.
    /// </summary>
    public int NumberOfLogins { get; set; }
}
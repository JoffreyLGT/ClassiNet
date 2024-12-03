using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Database.Entities;

/// <summary>
///     Definition of a role in Database.
///     Inherit from IdentityRole from the Identity library and contains
///     the custom properties.
/// </summary>
public class RoleEntity : IdentityRole
{
    /// <summary>
    ///     Description of the role.
    /// </summary>
    [MaxLength(255)]
    public string? Description { get; init; }
}
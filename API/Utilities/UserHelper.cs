using API.Entity;
using API.Models;

namespace API.Utilities;

/// <summary>
///     Provides functions to request the Users table in database.
/// </summary>
public static class UserHelper
{
    /// <summary>
    ///     Map UserForRegistrationDto to UserEntity.
    /// </summary>
    /// <param name="userForRegistrationDto"></param>
    /// <returns></returns>
    public static UserEntity ToUser(this UserForRegistrationDto userForRegistrationDto)
    {
        return new UserEntity
        {
            UserName = userForRegistrationDto.UserName,
            Email = userForRegistrationDto.Email,
            Company = userForRegistrationDto.Company,
            EmailConfirmed = userForRegistrationDto.Activated,
            LockoutEnabled = userForRegistrationDto.Disabled
        };
    }

    /// <summary>
    ///     Update user properties from DTO.
    /// </summary>
    /// <param name="userForPatch"></param>
    /// <param name="user">user that will receive the updated properties</param>
    /// <returns></returns>
    public static void UpdateUserEntity(this UserForPatchDto userForPatch, ref UserEntity user)
    {
        user.Id = userForPatch.Id;

        if (!string.IsNullOrEmpty(userForPatch.UserName))
            user.UserName = userForPatch.UserName;

        if (!string.IsNullOrEmpty(userForPatch.Email))
            user.Email = userForPatch.Email;

        if (!string.IsNullOrEmpty(userForPatch.Company))
            user.Company = userForPatch.Company;

        if (userForPatch.Activated is not null)
            user.EmailConfirmed = (bool)userForPatch.Activated;

        if (userForPatch.Disabled is not null)
            user.LockoutEnabled = (bool)userForPatch.Disabled;
    }

    /// <summary>
    ///     Map UserEntity to UserDto.
    /// </summary>
    /// <param name="user">to map</param>
    /// <param name="role">to add into the Role property</param>
    /// <returns></returns>
    public static UserDto ToUserDto(this UserEntity user, string role)
    {
        return new UserDto
        {
            Id = user.Id,
            Email = user.Email!,
            UserName = user.UserName,
            Company = user.Company,
            Role = role,
            Activated = user.EmailConfirmed,
            Disabled = user.LockoutEnabled,
            NumberOfLogins = user.NumberOfLogins
        };
    }
}
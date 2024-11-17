using API.Models;

namespace API.Utilities;

/// <summary>
/// Provides functions to request the Users table in database.
/// </summary>
public static class UserHelper
{
    /// <summary>
    /// Map UserForRegistrationDto to User.
    /// </summary>
    /// <param name="userForRegistrationDto"></param>
    /// <returns></returns>
    public static User ToUser(this UserForRegistrationDto userForRegistrationDto)
    {
        return new User
        {
            UserName = userForRegistrationDto.UserName,
            Email = userForRegistrationDto.Email,
            Company = userForRegistrationDto.Company,
        };
    }
}


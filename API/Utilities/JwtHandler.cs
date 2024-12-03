using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Database.Entities;
using Microsoft.IdentityModel.Tokens;

namespace API.Utilities;

/// <summary>
///     Manages JSON Web Token creation.
/// </summary>
public class JwtHandler
{
    private readonly IConfigurationSection _jwtSettings;

    /// <summary>
    ///     Constructor setting private properties.
    /// </summary>
    /// <param name="configuration"></param>
    public JwtHandler(IConfiguration configuration)
    {
        _jwtSettings = configuration.GetSection("JwtSettings");
    }

    /// <summary>
    ///     Create a new JSON Web Token for the user.
    /// </summary>
    /// <param name="user">user information</param>
    /// <param name="roles">roles of the user</param>
    /// <returns>a JSON Web Token</returns>
    public string CreateToken(UserEntity user, IList<string> roles)
    {
        var signingCredentials = GetSigningCredentials();
        var claims = GenerateUserClaims(user, roles);
        var tokenOptions = GenerateTokenOptions(signingCredentials, claims);

        return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
    }

    /// <summary>
    ///     Get signing credentials from settings.
    /// </summary>
    /// <returns>the credentials</returns>
    private SigningCredentials GetSigningCredentials()
    {
        var key = Encoding.ASCII.GetBytes(_jwtSettings["Key"]!);
        var secret = new SymmetricSecurityKey(key);

        return new SigningCredentials(secret, SecurityAlgorithms.HmacSha256);
    }

    /// <summary>
    ///     Generate a list of claims for the user.
    /// </summary>
    /// <param name="user">user information</param>
    /// <param name="roles">roles of the user</param>
    /// <returns>the list of claims to integrate in the JWT</returns>
    private List<Claim> GenerateUserClaims(UserEntity user, IList<string> roles)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Email, user.Email!)
        };

        foreach (var role in roles) claims.Add(new Claim(ClaimTypes.Role, role));
        return claims;
    }

    /// <summary>
    ///     Generate the JWT options.
    /// </summary>
    /// <param name="signingCredentials">to sign the token</param>
    /// <param name="claims">to add to the token</param>
    /// <returns>the JWT security token object</returns>
    private JwtSecurityToken GenerateTokenOptions(SigningCredentials signingCredentials, List<Claim> claims)
    {
        return new JwtSecurityToken(
            _jwtSettings["Issuer"],
            _jwtSettings["Audience"],
            claims,
            expires: DateTime.Now.AddMinutes(Convert.ToDouble(_jwtSettings["ExpiryInMinutes"])),
            signingCredentials: signingCredentials
        );
    }
}
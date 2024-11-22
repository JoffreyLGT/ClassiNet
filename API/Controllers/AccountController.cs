using System.Net;
using System.Security.Claims;
using API.Models;
using API.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

/// <summary>
/// Controller with all the routes to manage user accounts.
/// </summary>
[ApiController]
[Route("api/accounts")]
public class AccountsController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<Role> _roleManager;
    private readonly JwtHandler _jwtHandler;

    /// <summary>
    /// Constructor gathering important objects from dependency injection.
    /// </summary>
    /// <param name="userManager">identity object to manage user in database</param>
    /// <param name="roleManager">identity object to manage roles in database</param>
    /// <param name="jwtHandler">object to create JSON Web Token</param>
    public AccountsController(UserManager<User> userManager, RoleManager<Role> roleManager, JwtHandler jwtHandler)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _jwtHandler = jwtHandler;
    }

    /// <summary>
    /// Register a new user in database.
    /// </summary>
    /// <param name="userForRegistrationDto">user data</param>
    /// <returns>A status code indicating if the user was created</returns>
    /// <response code="201">user is created</response>
    /// <response code="400">request is invalid</response>
    [HttpPost("register")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RegisterUser([FromBody] UserForRegistrationDto? userForRegistrationDto)
    {
        if (userForRegistrationDto is null)
            return BadRequest(new AuthResponseDto { ErrorMessage = "Invalid user provided" });

        if (!await _roleManager.RoleExistsAsync(userForRegistrationDto.Role!))
        {
            return BadRequest(new AuthResponseDto
            { ErrorMessage = $"Role {userForRegistrationDto.Role} does not exist" });
        }

        var user = userForRegistrationDto.ToUser();
        var result = await _userManager.CreateAsync(user, userForRegistrationDto.Password!);

        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description);
            return BadRequest(new RegistrationResponseDto { Errors = errors });
        }

        await _userManager.AddToRoleAsync(user, userForRegistrationDto.Role!);
        return StatusCode(201);
    }

    /// <summary>
    /// Authenticate user and returns a JWT token.
    /// </summary>
    /// <param name="userForAuthentication"></param>
    /// <returns></returns>
    /// <response code="200">user credentials are good</response>
    /// <response code="401">invalid authentication</response>
    [HttpPost("authenticate")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Authenticate([FromBody] UserForAuthenticationDto userForAuthentication)
    {
        var user = await _userManager.FindByEmailAsync(userForAuthentication.Email!);
        if (user is null || !await _userManager.CheckPasswordAsync(user, userForAuthentication.Password!))
        {
            return Unauthorized(new AuthResponseDto
            { IsAuthSuccessful = false, ErrorMessage = "Invalid authentication" });
        }

        var roles = await _userManager.GetRolesAsync(user);

        var token = _jwtHandler.CreateToken(user, roles);
        return Ok(new AuthResponseDto
        {
            IsAuthSuccessful = true,
            Token = token,
            User = new UserDto
            {
                UserName = user.UserName,
                Company = user.Company,
                Email = user.Email!
            }
        });
    }

    /// <summary>
    /// Fetch user's own information.
    /// </summary>
    /// <returns>Logged in user information</returns>
    /// <response code="200">user credentials are good</response>
    /// <response code="400">user not found</response>
    /// <response code="401">invalid authentication</response>
    [HttpGet("me")]
    [Authorize(Roles = "User, Admin")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetUserInfo()
    {
        var userEmail = User.Claims.Single(x => x.Type == ClaimTypes.Email).Value;
        var user = await _userManager.FindByEmailAsync(userEmail);
        if (user is not null)
        {
            return Ok(new UserDto { Email = user.Email!, Company = user.Company, UserName = user.UserName });
        }
        // Should never happen since the user is authenticated,
        // except if the user was deleted from db but still has a
        // valid JWT.
        return BadRequest();

    }
}
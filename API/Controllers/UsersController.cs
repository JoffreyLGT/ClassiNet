using System.Security.Claims;
using API.Models;
using API.Utilities;
using Database.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

// TODO: refactor the code to be closer to the code of ProductController
//  and return ProblemDetails objects.
//  https://github.com/JoffreyLGT/Product-categorization/issues/63

/// <summary>
///     Controller with all the routes to manage user accounts.
/// </summary>
[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly JwtHandler _jwtHandler;
    private readonly RoleManager<RoleEntity> _roleManager;
    private readonly UserManager<UserEntity> _userManager;

    /// <summary>
    ///     Constructor gathering important objects from dependency injection.
    /// </summary>
    /// <param name="userManager">identity object to manage user in database</param>
    /// <param name="roleManager">identity object to manage roles in database</param>
    /// <param name="jwtHandler">object to create JSON Web Token</param>
    public UsersController(UserManager<UserEntity> userManager, RoleManager<RoleEntity> roleManager,
        JwtHandler jwtHandler)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _jwtHandler = jwtHandler;
    }

    /// <summary>
    ///     Get the user with the specified id.
    /// </summary>
    /// <param name="id">identifier of the user</param>
    /// <returns>the user and its properties</returns>
    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserDto>> GetUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound();

        var roles = await _userManager.GetRolesAsync(user);
        // Since we currently have only one role per user, get the first role in the list
        return user.ToUserDto(roles[0]);
    }

    /// <summary>
    ///     Get the list of users.
    /// </summary>
    /// <remarks>
    ///     Use take and skip to manage pagination.
    ///     Get number of users and number of pages from the headers.
    /// </remarks>
    /// <param name="take">number of users to return, max 100</param>
    /// <param name="skip">number of users to skip</param>
    /// <returns>list of users in the body, paginator information in the headers</returns>
    /// <response code="200">user list is returned</response>
    /// <response code="401">user is not authorized</response>
    [HttpGet]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetUsers(
        [FromQuery] int take = 10,
        [FromQuery] int skip = 0)
    {
        if (take > 100) take = 100;
        var users = await _userManager.Users.OrderBy(user => user.Email).Skip(skip).Take(take).ToListAsync();
        var usersDto = new List<UserDto>();
        foreach (var user in users)
        {
            var role = await _userManager.GetRolesAsync(user);
            usersDto.Add(user.ToUserDto(role.First()));
        }

        var usersCount = await _userManager.Users.CountAsync();

        var pagination = new PaginatorHeader
        {
            TotalRecords = usersCount,
            TotalPages = (int)Math.Ceiling((double)usersCount / take)
        };
        HttpContext.Response.Headers.Append(PaginatorHeader.HeaderName,
            pagination.ToJson());
        return Ok(usersDto);
    }

    /// <summary>
    ///     Add a new user in database.
    /// </summary>
    /// <param name="userForRegistrationDto">user data</param>
    /// <returns>A status code indicating if the user was created</returns>
    /// <response code="201">user is created</response>
    /// <response code="400">request is invalid or email already exist in database</response>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RegisterUser([FromBody] UserForRegistrationDto userForRegistrationDto)
    {
        if (!await _roleManager.RoleExistsAsync(userForRegistrationDto.Role!))
            return BadRequest(new AuthResponseDto
                { ErrorMessage = $"RoleEntity {userForRegistrationDto.Role} does not exist" });

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
    ///     Update a user in database.
    /// </summary>
    /// <param name="propertiesToUpdate">user data</param>
    /// <returns>A status code indicating if the user was created</returns>
    /// <response code="201">user is created</response>
    /// <response code="400">request is invalid</response>
    [HttpPatch]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateUser([FromBody] UserForPatchDto propertiesToUpdate)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(user => user.Id == propertiesToUpdate.Id);
        if (user is null)
            return BadRequest(new AuthResponseDto { ErrorMessage = "Invalid user ID provided" });

        if (!await _roleManager.RoleExistsAsync(propertiesToUpdate.Role!))
            return BadRequest(new AuthResponseDto
                { ErrorMessage = $"RoleEntity {propertiesToUpdate.Role} does not exist" });

        propertiesToUpdate.UpdateUserEntity(ref user);

        if (!string.IsNullOrEmpty(propertiesToUpdate.Password))
        {
            var passwordHasher = new PasswordHasher<UserEntity>();
            user.PasswordHash = passwordHasher.HashPassword(user, propertiesToUpdate.Password);
        }

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description);
            return BadRequest(new RegistrationResponseDto { Errors = errors });
        }


        await _userManager.RemoveFromRolesAsync(user, ["Admin", "User"]);
        await _userManager.AddToRoleAsync(user, propertiesToUpdate.Role!);

        return StatusCode(201);
    }

    /// <summary>
    ///     Authenticate user and returns a JWT token.
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
            return Unauthorized(new AuthResponseDto
                { IsAuthSuccessful = false, ErrorMessage = "Invalid authentication" });

        if (user.EmailConfirmed == false || user.LockoutEnabled)
            return Unauthorized(new AuthResponseDto
                { IsAuthSuccessful = false, ErrorMessage = "User not activated or disabled!" });

        user.NumberOfLogins += 1;
        await _userManager.UpdateAsync(user);

        var roles = await _userManager.GetRolesAsync(user);

        var token = _jwtHandler.CreateToken(user, roles);
        return Ok(new AuthResponseDto
        {
            IsAuthSuccessful = true,
            Token = token,
            User = user.ToUserDto(roles.First())
        });
    }

    /// <summary>
    ///     Fetch user's own information.
    /// </summary>
    /// <returns>User's own information</returns>
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
            var roles = await _userManager.GetRolesAsync(user);
            return Ok(user.ToUserDto(roles.First()));
        }

        // Should never happen since the user is authenticated,
        // except if the user was deleted from db but still has a
        // valid JWT.
        return BadRequest();
    }
}
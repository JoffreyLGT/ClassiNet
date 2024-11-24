using System.Net.Mime;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

/// <summary>
///     Controller with all the routes to get KPI for the dashboard.
/// </summary>
[Route("api/dashboard")]
[ApiController]
[Authorize(Roles = "User, Admin")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    ///     Get basic stats to display in the dashboard.
    /// </summary>
    /// <returns>A JSON object containing the stats</returns>
    [HttpGet("basic-stats")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BasicStatsDto))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized, Type = null)]
    public async Task<ActionResult<BasicStatsDto>> GetBasicStats()
    {
        var comparisonDate = DateTime.Today.AddMonths(-1).ToUniversalTime();

        var basicStatsDto = new BasicStatsDto
        {
            NbUsers = await _context.Users.CountAsync(),
            NbActiveUsers = await _context.Users.Where(user => user.EmailConfirmed == true).CountAsync(),
            NbProducts = await _context.Products.CountAsync(),
            NbProductsCreatedLastMonth =
                await _context.Products.Where(product => product.CreatedDate >= comparisonDate).CountAsync(),
            NbCategories = await _context.Categories.CountAsync()
        };
        return Ok(basicStatsDto);
    }
}
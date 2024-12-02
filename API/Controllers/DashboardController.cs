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

    /// <summary>
    ///     Default constructor.
    /// </summary>
    /// <param name="context">Database context</param>
    public DashboardController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    ///     Get basic stats to display in the dashboard.
    /// </summary>
    /// <returns>Basic stats</returns>
    /// <response code="200">All went well</response>
    /// <response code="401">User not authorized</response>
    [HttpGet("basic-stats")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BasicStatsDto))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
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

    /// <summary>
    ///     Get stats regarding the distribution of the products per category.
    /// </summary>
    /// <returns>List of categories with their stats.</returns>
    /// <response code="200">All went well</response>
    /// <response code="401">User not authorized</response>
    [HttpGet("categories-distribution")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<CategoriesDistributionItem>> GetCategoriesDistribution()
    {
        var nbTotalProducts = await _context.Products.CountAsync();
        var rqtResult = await _context.Products
            .Include(product => product.Category)
            .GroupBy(product => product.Category)
            .Select(category => new
            {
                Category = category.Key,
                Count = category.Count()
            }).ToListAsync();

        var items = rqtResult.Select(result => new CategoriesDistributionItem
        {
            Id = result.Category.Id,
            Name = result.Category.Name,
            NbProducts = result.Count,
            Percentage = Math.Round((double)result.Count / nbTotalProducts * 100, 2)
        }).ToList();

        return Ok(items);
    }

    /// <summary>
    ///     Get stats regarding the products data completeness.
    /// </summary>
    /// <returns>List of categories with their stats.</returns>
    /// <response code="200">All went well</response>
    /// <response code="401">User not authorized</response>
    [HttpGet("data-completeness")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<DataCompletenessStats>> GetDataCompleteness()
    {
        var total = await _context.Products.CountAsync();
        var complete = await _context.Products.Where(product =>
            !string.IsNullOrEmpty(product.Designation)
            && !string.IsNullOrEmpty(product.Description)
            && !string.IsNullOrEmpty(product.ImageName)).CountAsync();

        var missingDescriptionOnly = await _context.Products.Where(product =>
            !string.IsNullOrEmpty(product.Designation)
            && string.IsNullOrEmpty(product.Description)
            && !string.IsNullOrEmpty(product.ImageName)).CountAsync();

        var missingImageOnly = await _context.Products.Where(product =>
            !string.IsNullOrEmpty(product.Designation)
            && !string.IsNullOrEmpty(product.Description)
            && string.IsNullOrEmpty(product.ImageName)).CountAsync();

        var missingDescriptionAndImage = await _context.Products.Where(product =>
            !string.IsNullOrEmpty(product.Designation)
            && string.IsNullOrEmpty(product.Description)
            && string.IsNullOrEmpty(product.ImageName)).CountAsync();

        return Ok(new DataCompletenessStats
        {
            Complete = complete,
            Incomplete = total - complete,
            MissingDescriptionOnly = missingDescriptionOnly,
            MissingImageOnly = missingImageOnly,
            MissingDescriptionAndImage = missingDescriptionAndImage
        });
    }

    /// <summary>
    ///     Get stats regarding the products data completeness.
    /// </summary>
    /// <returns>List of categories with their stats.</returns>
    /// <response code="200">All went well</response>
    /// <response code="401">User not authorized</response>
    [HttpGet("text-variable-stats/{type}")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<TextVariableStats>> GetTextVariableStats(string type)
    {
        // TODO: get real data when available
        if (type != "designation" && type != "description")
            return BadRequest(new ProblemDetails
            {
                Title = "Bad Request",
                Detail = "Type not supported, must be \"designation\" or \"description\".",
                Status = StatusCodes.Status400BadRequest,
                Instance = HttpContext.Request.Path
            });

        return Ok(new TextVariableStats
        {
            VariableName = type,
            NbWords = 23000,
            NbWordsBeforeProcessing = 40000,
            WordsCount =
            [
                new WordCount
                {
                    Word = "Produit",
                    Count = 25
                },
                new WordCount
                {
                    Word = "Hello",
                    Count = 32
                },
                new WordCount
                {
                    Word = "World",
                    Count = 10
                }
            ],
            LongestWords =
            [
                new WordCharacterCount
                {
                    Word = "ProduitProduitProduitProduitProduitProduitProduitProduitProduitProduitProduit",
                    NbChars = 8
                },
                new WordCharacterCount
                {
                    Word = "Hello",
                    NbChars = 5
                },
                new WordCharacterCount
                {
                    Word = "Sac",
                    NbChars = 3
                }
            ]
        });
    }
}
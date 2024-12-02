using API.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

/// <summary>
///     Controller with all the routes to manage the product categories.
/// </summary>
[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "User, Admin")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    /// <summary>
    ///     Constructor gathering objects from dependency injection.
    /// </summary>
    /// <param name="context"></param>
    public CategoriesController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    ///     Get the list of categories.
    /// </summary>
    /// <returns>List of categories</returns>
    /// <response code="200">All went well</response>
    /// <response code="401">User is not authorized</response>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IEnumerable<CategoryEntity>>> GetCategories()
    {
        return Ok(await _context.Categories.ToListAsync());
    }

    /// <summary>
    ///     Get the category with the provided id.
    /// </summary>
    /// <param name="id">Identifier of the category</param>
    /// <returns>Category object</returns>
    /// <response code="200">All went well</response>
    /// <response code="400">Category not found</response>
    /// <response code="401">User is not authorized</response>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<CategoryEntity>> GetCategoryEntity(int id)
    {
        var categoryEntity = await _context.Categories.FindAsync(id);

        if (categoryEntity == null)
            return BadRequest(new ProblemDetails
            {
                Title = "Not Found",
                Detail = "Category not found.",
                Status = StatusCodes.Status400BadRequest,
                Instance = HttpContext.Request.Path
            });

        return Ok(categoryEntity);
    }

    /// <summary>
    ///     Update a whole category with the one provided.
    /// </summary>
    /// <remarks>
    ///     User PATCH to update only the properties that changed.
    /// </remarks>
    /// <param name="id">Identifier of the category.</param>
    /// <param name="category">Category object with all the properties</param>
    /// <returns></returns>
    /// <response code="204">All went well</response>
    /// <response code="400">Category not found or IDs don't match</response>
    /// <response code="401">User is not authorized</response>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> PutCategoryEntity(int id, CategoryEntity category)
    {
        if (id != category.Id)
            return BadRequest(new ProblemDetails
            {
                Title = "Bad Request",
                Detail = "Id in url must match category id.",
                Status = StatusCodes.Status400BadRequest,
                Instance = HttpContext.Request.Path
            });

        _context.Entry(category).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CategoryEntityExists(id))
                return BadRequest(new ProblemDetails
                {
                    Title = "Not Found",
                    Detail = "Category not found.",
                    Status = StatusCodes.Status400BadRequest,
                    Instance = HttpContext.Request.Path
                });

            throw;
        }

        return NoContent();
    }

    /// <summary>
    ///     Add a new category in database.
    /// </summary>
    /// <param name="category">Category to add</param>
    /// <returns>The category with its properties from DB, including its ID.</returns>
    /// <response code="201">All went well</response>
    /// <response code="401">User is not authorized</response>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<CategoryEntity>> PostCategoryEntity(CategoryEntity category)
    {
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetCategoryEntity", new { id = category.Id }, category);
    }

    /// <summary>
    ///     Delete a category.
    /// </summary>
    /// <param name="id">Identifier of the category.</param>
    /// <returns>Nothing</returns>
    /// <response code="204">All went well</response>
    /// <response code="400">Category not found</response>
    /// <response code="401">User is not authorized</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> DeleteCategoryEntity(int id)
    {
        var categoryEntity = await _context.Categories.FindAsync(id);
        if (categoryEntity == null)
            return BadRequest(new ProblemDetails
            {
                Title = "Not Found",
                Detail = "Category not found.",
                Status = StatusCodes.Status400BadRequest,
                Instance = HttpContext.Request.Path
            });

        _context.Categories.Remove(categoryEntity);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool CategoryEntityExists(int id)
    {
        return _context.Categories.Any(e => e.Id == id);
    }
}
using API.Models;
using API.Utilities;
using Database;
using Database.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

/// <summary>
///     Controller with all the routes to manage products in database.
/// </summary>
[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "User, Admin")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    /// <summary>
    ///     Default constructor, store objects from dependency injection.
    /// </summary>
    /// <param name="context">Database context to communicate with database</param>
    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    ///     Get the list of products.
    /// </summary>
    /// <remarks>
    ///     Use take and skip to manage pagination.<br />
    ///     The total number of products and number of pages for your paginator are
    ///     included in the headers.<br />
    ///     Search is done into the fields:
    ///     product id, product designation, product description and category name
    /// </remarks>
    /// <param name="take">Number of products to return, max 100</param>
    /// <param name="skip">Number of products to skip</param>
    /// <param name="search">Value to search for in the product properties, see remarks</param>
    /// <returns>List of products in the body, paginator information in the headers</returns>
    /// <response code="200">All went well</response>
    /// <response code="401">User is not authorized</response>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IEnumerable<ProductEntity>>> GetProducts(
        [FromQuery] int take = 10,
        [FromQuery] int skip = 0,
        [FromQuery] string search = ""
    )
    {
        if (take > 100) take = 100;
        var cleanSearch = search.ToLower();
        var productQuery = _context.Products.OrderBy(product => product.CreatedDate).AsQueryable();

        if (!string.IsNullOrEmpty(search))
            productQuery = productQuery.Where(product =>
                product.Id.ToString().ToLower().Contains(cleanSearch)
                || product.Category.Name.ToLower().Contains(cleanSearch)
                || (product.Description != null && product.Description.ToLower().Contains(cleanSearch))
                || (product.Designation != null && product.Designation.ToLower().Contains(cleanSearch))
            );

        var productsCount = await productQuery.CountAsync();

        var products = await productQuery.Skip(skip).Take(take)
            .Include(product => product.Category).ToListAsync();

        var paginator = new PaginatorHeader
        {
            TotalRecords = productsCount,
            TotalPages = (int)Math.Ceiling((double)productsCount / take)
        };
        HttpContext.Response.Headers.Append(PaginatorHeader.HeaderName, paginator.ToJson());
        return Ok(products);
    }

    /// <summary>
    ///     Get the product with the specified id.
    /// </summary>
    /// <param name="id">Identifier of the product</param>
    /// <returns>The product and its properties</returns>
    /// <response code="200">All went well</response>
    /// <response code="400">Product not found in database</response>
    /// <response code="401">User is not authorized</response>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ProductEntity>> GetProduct(long id)
    {
        var product = await _context.Products.Include(product => product.Category)
            .FirstOrDefaultAsync(product => product.Id == id);

        if (product == null)
            return BadRequest(new ProblemDetails
            {
                Title = "Not found",
                Status = StatusCodes.Status400BadRequest,
                Detail = "Product not found.",
                Instance = HttpContext.Request.Path
            });

        return product;
    }

    /// <summary>
    ///     Update all the properties of a product.
    /// </summary>
    /// <param name="id">Identifier of the product</param>
    /// <param name="product">Product with all its properties</param>
    /// <returns>Status code indicating the operation status</returns>
    /// <response code="204">All went well</response>
    /// <response code="400">Product not found in database</response>
    /// <response code="401">User is not authorized</response>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> PutProduct(int id, ProductEntity product)
    {
        if (id != product.Id)
            return BadRequest(new ProblemDetails
            {
                Title = "Bad Request",
                Status = StatusCodes.Status400BadRequest,
                Detail = "Id provided in URL must match product id.",
                Instance = HttpContext.Request.Path
            });

        _context.Entry(product).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ProductHelper.ProductExists(_context, id)) return NotFound();

            throw;
        }

        return NoContent();
    }

    /// <summary>
    ///     Update some properties of a product.
    /// </summary>
    /// <param name="productPatches">
    ///     Product object with only the properties to update. Other properties should be null or
    ///     undefined.
    /// </param>
    /// <returns>Status code indicating the operation status</returns>
    /// <response code="204">All went well</response>
    /// <response code="400">Product or category not found in database</response>
    /// <response code="401">User is not authorized</response>
    [HttpPatch]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> PatchProduct([FromBody] PatchProductDto productPatches)
    {
        var productEntity = await _context.Products.Include(dbProduct => dbProduct.Category)
            .FirstOrDefaultAsync(dbProduct => dbProduct.Id == productPatches.Id);
        if (productEntity == null)
            return BadRequest(new ProblemDetails
            {
                Title = "Not found",
                Status = StatusCodes.Status400BadRequest,
                Detail = "Product not found.",
                Instance = HttpContext.Request.Path
            });

        // Designation cannot be empty!
        if (!string.IsNullOrEmpty(productPatches.Designation))
            productEntity.Designation = productPatches.Designation;

        productEntity.Description = productPatches.Description;

        if (productPatches.ImageName != null)
            productEntity.ImageName = productPatches.ImageName;

        if (productPatches.CategoryId != null)
        {
            var category = await _context.Categories.FindAsync(productPatches.CategoryId);
            if (category == null)
                return BadRequest(new ProblemDetails
                {
                    Title = "Not found",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = "Category not found.",
                    Instance = HttpContext.Request.Path
                });
            productEntity.Category = category;
        }

        _context.Products.Update(productEntity);
        var result = await _context.SaveChangesAsync();
        if (result != 1)
            return BadRequest(new ProblemDetails
            {
                Title = "Error updating database",
                Status = StatusCodes.Status400BadRequest,
                Detail = "Could not save changes.",
                Instance = HttpContext.Request.Path
            });

        return NoContent();
    }

    /// <summary>
    ///     Add a product.
    /// </summary>
    /// <param name="product">Product to add</param>
    /// <returns>Newly added product with its id</returns>
    /// <response code="201">All went well</response>
    /// <response code="400">Category not found in database</response>
    /// <response code="401">User is not authorized</response>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ProductEntity>> PostProduct(PostProductDto product)
    {
        var category = await _context.Categories.FindAsync(product.CategoryId);
        if (category == null)
            return BadRequest(new ProblemDetails
            {
                Title = "Not found",
                Status = StatusCodes.Status400BadRequest,
                Detail = "Category not found.",
                Instance = HttpContext.Request.Path
            });

        var newProduct = new ProductEntity
        {
            Designation = product.Designation,
            Description = product.Description,
            Category = category
        };
        _context.Products.Add(newProduct);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetProduct", new { id = newProduct.Id }, product);
    }

    /// <summary>
    ///     Delete a product.
    /// </summary>
    /// <param name="id">Identifier of the product</param>
    /// <returns>Status code indicating the operation status</returns>
    /// <response code="204">All went well</response>
    /// <response code="400">Product not found in database</response>
    /// <response code="401">User is not authorized</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> DeleteProduct(long id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return BadRequest(new ProblemDetails
            {
                Title = "Not found",
                Status = StatusCodes.Status400BadRequest,
                Detail = "Product not found.",
                Instance = HttpContext.Request.Path
            });

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
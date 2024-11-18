using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Models;
using API.Utilities;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

/// <summary>
/// Controller with all the routes to manage products in database.
/// </summary>
[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "User, Admin")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    /// <summary>
    /// Default constructor, store objects from dependency injection.
    /// </summary>
    /// <param name="context">database context to communicate with database</param>
    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get the list of products.
    /// </summary>
    /// <returns>list of products</returns>
    // GET: api/Product
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        return await _context.Products.ToListAsync();
    }

    /// <summary>
    /// Get the product with the specified id.
    /// </summary>
    /// <param name="id">identifier of the product</param>
    /// <returns>the product and its properties</returns>
    // GET: api/Product/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
        {
            return NotFound();
        }

        return product;
    }

    /// <summary>
    /// Update a product.
    /// </summary>
    /// <param name="id">identifier of the product</param>
    /// <param name="product">product information</param>
    /// <returns>a status code indicating the operation status</returns>
    // PUT: api/Product/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutProduct(int id, Product product)
    {
        if (id != product.Id)
        {
            return BadRequest();
        }

        _context.Entry(product).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ProductHelper.ProductExists(_context, id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    /// <summary>
    /// Add a new product in database.
    /// </summary>
    /// <param name="product">to add</param>
    /// <returns>product information</returns>
    // POST: api/Product
    [HttpPost]
    public async Task<ActionResult<Product>> PostProduct(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetProduct", new { id = product.Id }, product);
    }

    /// <summary>
    /// Delete a product from database.
    /// </summary>
    /// <param name="id">identifier of the product</param>
    /// <returns>a status code indicating the operation status</returns>
    // DELETE: api/Product/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }

}
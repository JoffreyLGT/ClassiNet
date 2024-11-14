using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Models;
using API.Database;

namespace API.Controllers
{
    /// <summary>
    /// Handle all the routes for User management.
    /// </summary>
    /// <remarks>
    /// Default constructor, stores context.
    /// </remarks>
    /// <param name="context"></param>
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController(AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _context = context;


        /// <summary>
        /// Get all users from database.
        /// </summary>
        /// <returns></returns>
        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        /// <summary>
        /// Get user information from their id.
        /// </summary>
        /// <param name="id">user unique identifier</param>
        /// <returns></returns>
        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        /// <summary>
        /// Update user from their id.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.UserExists(id))
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

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=212375
        /// <summary>
        /// Register a new User in database.
        /// </summary>
        /// <param name="user">to register</param>
        /// <returns>newly registered user with its properties</returns>
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(PostUserDTO user)
        {
            var newUser = new User(user);
            if (_context.UserExists(user.Email))
            {
                return BadRequest("Email already registered!");
            }
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = newUser.Id }, newUser);
        }

        /// <summary>
        /// Delete the user from their unique identifier.
        /// </summary>
        /// <param name="id">unique identifier of the user, generated when the user is created.</param>
        /// <returns></returns>
        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

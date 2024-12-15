using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Database;
using Database.Entities;
using API.Models;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    /// <summary>
    /// API controller for managing classification models.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "User, Admin")]
    public class ModelsController : ControllerBase
    {
        private readonly AppDbContext _context;

        /// <summary>
        /// Initializes a new instance of the <see cref="ModelsController"/> class.
        /// </summary>
        /// <param name="context">The database context.</param>
        public ModelsController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves a list of classification models with pagination and optional search.
        /// </summary>
        /// <param name="take">The number of records to take. Maximum is 100.</param>
        /// <param name="skip">The number of records to skip.</param>
        /// <param name="search">The search term to filter the models.</param>
        /// <returns>A list of classification models.</returns>
        /// <response code="200">All went well</response>
        /// <response code="401">User is not authorized</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<IEnumerable<ClassificationModelEntity>>> GetClassificationModels(
            [FromQuery] int take = 10,
            [FromQuery] int skip = 0,
            [FromQuery] string search = "")
        {
            if (take > 100) take = 100;
            var cleanSearch = search.ToLower();
            var query = _context.ClassificationModels
                .OrderBy(model => model.CreatedDate)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
                query = query.Where(model =>
                    model.Id.ToString().ToLower().Contains(cleanSearch)
                    || model.Name.ToLower().Contains(cleanSearch)
                    || (model.Description != null && model.Description.ToLower().Contains(cleanSearch))
                    || (model.FileName != null && model.FileName.ToLower().Contains(cleanSearch))
                    || model.StartDate.ToString().ToLower().Contains(cleanSearch)
                    || (model.EndDate != null && model.EndDate.Value.ToString().ToLower().Contains(cleanSearch))
                );

            var count = await query.CountAsync();

            var models = await query
                .Skip(skip)
                .Take(take)
                .ToListAsync();

            var paginator = new PaginatorHeader
            {
                TotalRecords = count,
                TotalPages = (int)Math.Ceiling((double)count / take)
            };
            HttpContext.Response.Headers.Append(PaginatorHeader.HeaderName, paginator.ToJson());
            return Ok(models);
        }

        /// <summary>
        /// Retrieves a classification model entity by its identifier.
        /// </summary>
        /// <param name="id">The unique identifier of the classification model entity.</param>
        /// <returns>An <see cref="ActionResult{ClassificationModelEntity}"/> containing the classification model entity if found, or a bad request response if not found.</returns>
        /// <response code="200">Returns the classification model entity.</response>
        /// <response code="400">If the classification model entity is not found.</response>
        /// <response code="401">If the user is unauthorized.</response>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<ClassificationModelEntity>> GetClassificationModelEntity(Guid id)
        {
            var classificationModelEntity = await _context.ClassificationModels
                .AsNoTracking()
                .FirstOrDefaultAsync(product => product.Id == id);

            if (classificationModelEntity == null)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Not found",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = "Model not found.",
                    Instance = HttpContext.Request.Path
                });
            }

            return classificationModelEntity;
        }



        /// <summary>
        /// Updates an existing ClassificationModelEntity.
        /// </summary>
        /// <param name="id">The ID of the ClassificationModelEntity to update.</param>
        /// <param name="classificationModelEntity">The updated ClassificationModelEntity object.</param>
        /// <returns>
        /// A status code indicating the result of the operation:
        /// - 204 No Content: The update was successful.
        /// - 400 Bad Request: The ID in the URL does not match the ID in the model.
        /// - 401 Unauthorized: The user is not authorized to perform this action.
        /// - 404 Not Found: The entity to update does not exist.
        /// </returns>
        /// <response code="204">If the update was successful.</response>
        /// <response code="400">If the ID in the URL does not match the ID in the model.</response>
        /// <response code="401">If the user is not authorized to perform this action.</response>
        /// <response code="404">If the entity to update does not exist.</response>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> PutClassificationModelEntity(Guid id, ClassificationModelEntity classificationModelEntity)
        {
            // TODO: Check if the model is set as active and if it is,
            //  check if there is a filename and a completed status.
            //  If it's the case, the previously active model must be set as inactive.
            //  If not, return a bad request response.
            if (id != classificationModelEntity.Id)
                return BadRequest(new ProblemDetails
                {
                    Title = "Bad Request",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = "Id provided in URL must match model id.",
                    Instance = HttpContext.Request.Path
                });

            _context.Entry(classificationModelEntity).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClassificationModelEntityExists(id))
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
        /// /// Creates a new classification model entity.
        /// </summary>
        /// <param name="newModel">The data transfer object containing the details of the new classification model.</param>
        /// <returns>An ActionResult containing the created classification model entity.</returns>
        /// <response code="201">Returns the newly created classification model entity.</response>
        /// <response code="400">If the status is invalid or the request is malformed.</response>
        /// <response code="401">If the user is unauthorized.</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<ClassificationModelEntity>> PostClassificationModelEntity([FromBody] PostClassificationModelDto newModel)
        {
            // TODO: Check if the model is set as active and if it is,
            //  check if there is a filename and a completed status.
            //  If it's the case, the previously active model must be set as inactive.
            //  If not, return a bad request response.
            var status = (ModelStatus)newModel.Status;
            if (!Enum.IsDefined(typeof(ModelStatus), status))
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Bad Request",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = "Invalid status.",
                    Instance = HttpContext.Request.Path
                });
            }
            var model = new ClassificationModelEntity
            {
                StartDate = newModel.StartDate,
                EndDate = newModel.EndDate,
                Status = (ModelStatus)newModel.Status,
                IsActive = newModel.IsActive ?? false,
                FileName = newModel.FileName,
                Name = newModel.Name,
                Description = newModel.Description
            };
            _context.ClassificationModels.Add(model);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetClassificationModelEntity", new { id = model.Id }, model);
        }

        /// <summary>
        ///     Deletes a classification model entity by its identifier.
        /// </summary>
        /// <param name="id">The unique identifier of the classification model entity to delete.</param>
        /// <returns>
        ///     A task that represents the asynchronous operation. The task result contains an <see cref="IActionResult" />
        ///     indicating the result of the delete operation.
        /// </returns>
        /// <response code="204">If the delete operation was successful.</response>
        /// <response code="404">If the classification model entity was not found.</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> DeleteClassificationModelEntity(Guid id)
        {
            var classificationModelEntity = await _context.ClassificationModels.FindAsync(id);
            if (classificationModelEntity == null)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Not found",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = "Model not found.",
                    Instance = HttpContext.Request.Path
                });
            }

            _context.ClassificationModels.Remove(classificationModelEntity);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Patches a classification model entity with the provided data.
        /// </summary>
        /// <param name="id">The unique identifier of the classification model entity to patch.</param>
        /// <param name="modelPatch">The data to patch the classification model entity with.</param>
        /// <returns>
        /// A <see cref="IActionResult"/> indicating the result of the operation.
        /// Returns <see cref="NoContentResult"/> if the patch is successful.
        /// Returns <see cref="BadRequestObjectResult"/> if the model is not found or if the status is invalid.
        /// Returns <see cref="UnauthorizedResult"/> if the user is not authorized.
        /// </returns>
        /// <response code="204">No content, patch successful.</response>
        /// <response code="400">Bad request, model not found or invalid status.</response>
        /// <response code="401">Unauthorized, user is not authorized.</response>
        [HttpPatch("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> PatchClassificationModelEntity(Guid id, [FromBody] PatchClassificationModelDto modelPatch)
        {
            if (id != modelPatch.Id)
                return BadRequest(new ProblemDetails
                {
                    Title = "Bad Request",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = "Id provided in URL must match model id.",
                    Instance = HttpContext.Request.Path
                });

            var modelEntity = await _context.ClassificationModels
                .FirstOrDefaultAsync(model => model.Id == modelPatch.Id);
            if (modelEntity == null)
                return BadRequest(new ProblemDetails
                {
                    Title = "Not found",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = "Model not found.",
                    Instance = HttpContext.Request.Path
                });

            if (modelPatch.Status != null)
            {
                var status = (ModelStatus)modelPatch.Status;
                if (!Enum.IsDefined(typeof(ModelStatus), status))
                {
                    return BadRequest(new ProblemDetails
                    {
                        Title = "Bad Request",
                        Status = StatusCodes.Status400BadRequest,
                        Detail = "Invalid status.",
                        Instance = HttpContext.Request.Path
                    });
                }
                modelEntity.Status = status;
            }

            if (!string.IsNullOrEmpty(modelPatch.Name))
            {
                modelEntity.Name = modelPatch.Name;
            }

            if (!string.IsNullOrEmpty(modelPatch.Description))
            {
                modelEntity.Description = modelPatch.Description;
            }


            if (modelPatch.StartDate != null)
                modelEntity.StartDate = modelPatch.StartDate.Value;

            if (modelPatch.EndDate != null)
                modelEntity.EndDate = modelPatch.EndDate.Value;

            if (modelPatch.IsActive != null)
                // TODO: Check if the model is set as active and if it is,
                //  check if there is a filename and a completed status.
                //  If it's the case, the previously active model must be set as inactive.
                //  If not, return a bad request response.
                modelEntity.IsActive = modelPatch.IsActive.Value;

            if (!string.IsNullOrEmpty(modelPatch.FileName))
            {
                modelEntity.FileName = modelPatch.FileName;
            }

            _context.ClassificationModels.Update(modelEntity);
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
        /// Sets the active model by its identifier.
        /// </summary>
        /// <param name="id">The unique identifier of the classification model entity.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains an <see cref="IActionResult" />
        /// indicating the result of the operation.
        /// </returns>
        /// <response code="204">If the operation was successful.</response>
        /// <response code="400">If the classification model entity was not found.</response>
        /// <response code="401">If the user is not authorized.</response>
        [HttpPost("{id}/set-active")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SetActiveModel(Guid id)
        {

            var model = await _context.ClassificationModels.FindAsync(id);
            if (model is null)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Not found",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = "Model not found.",
                    Instance = HttpContext.Request.Path
                });
            }
            if (model.FileName is null || model.Status != ModelStatus.Finished)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Bad Request",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = "Model must be finished and have a file name.",
                    Instance = HttpContext.Request.Path
                });
            }
            model.IsActive = true;

            // Set all other models to inactive since only one model can be active at a time
            var models = await _context.ClassificationModels.Where(model => model.IsActive == true).ToListAsync();
            foreach (var m in models)
            {
                m.IsActive = false;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }



        /// <summary>
        /// Checks if a classification model entity exists by its identifier.
        /// </summary>
        /// <param name="id">The unique identifier of the classification model entity.</param>
        /// <returns>True if the classification model entity exists, false otherwise.</returns>
        private bool ClassificationModelEntityExists(Guid id)
        {
            return _context.ClassificationModels.Any(e => e.Id == id);
        }
    }
}

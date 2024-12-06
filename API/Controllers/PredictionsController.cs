using API.Models;
using API.Utilities;
using Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

/// <summary>
///     Controller with all the routes to use the product classification model.
/// </summary>
[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "User, Admin")]
public class PredictionsController : Controller
{
    private readonly AppDbContext _context;
    private readonly MLModelManager _modelManager;

    /// <summary>
    ///     Controller managing the routes to interact with the product classification model.
    /// </summary>
    public PredictionsController(AppDbContext context, MLModelManager modelManager)
    {
        _context = context;
        _modelManager = modelManager;
    }

    /// <summary>
    ///     Predicts the category of a product based on its designation and description.
    /// </summary>
    /// <param name="product">
    ///     An instance of <see cref="PredictionRequestDto" /> containing the product's designation and
    ///     optional description.
    /// </param>
    /// <returns>
    ///     A task that represents the asynchronous operation. The task result contains an <see cref="IActionResult" />
    ///     with the predicted category details or an error message if the prediction fails.
    /// </returns>
    /// <response code="200">All went well.</response>
    /// <response code="500">Prediction result is incorrect.</response>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Predict(PredictionRequestDto product)
    {
        var predictionResult =
            await _modelManager.PredictCategory(_context, product.Designation, product.Description ?? "");
        if (predictionResult is null)
            return StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
            {
                Title = "The model was not able to predict the category",
                Detail = "Please try again later.",
                Status = StatusCodes.Status500InternalServerError,
                Instance = HttpContext.Request.Path
            });

        return Ok(predictionResult);
    }
}
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
public class PublicController:ControllerBase
{
    private readonly ILogger<PublicController> _logger;
    
    public PublicController(ILogger<PublicController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public string IsOnline()
    {
        // TODO @joffreylgt: check if the database is online and return its status
        return "Online";
    }
}
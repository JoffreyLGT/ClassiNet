using System.Net.Mime;
using System.Text;
using API.Utilities;
using Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

/// <summary>
///     Triggers all the data imports from files.
/// </summary>
[Route("api/imports")]
[ApiController]
[Authorize(Roles = "Admin")]
public class ImportsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly string _importsDirectory;
    private readonly string _importsHistoryFile;
    private readonly ILogger _logger;

    /// <summary>
    ///     Manages all data import from files.
    /// </summary>
    /// <param name="config">application's configurations</param>
    /// <param name="logger">logger object</param>
    /// <param name="context">database context</param>
    public ImportsController(IConfiguration config, ILogger<ImportsController> logger, AppDbContext context)
    {
        _logger = logger;
        _context = context;
        _importsDirectory = config.GetValue<string>("ImportsDirectory")!;
        if (string.IsNullOrWhiteSpace(_importsDirectory))
            throw new Exception("ImportsDirectory is missing from configuration. Triggering an import will result in error.");

        if (!Directory.Exists(_importsDirectory))
            throw new Exception($"ImportsDirectory doesn't exist or is not accessible. Triggering an import will result in error. Please check your configuration: ${_importsDirectory}");

        else
            _importsHistoryFile = Path.Combine(_importsDirectory, config.GetValue<string>("ImportsHistoryFileName") ?? "imports-history.txt");
    }

    /// <summary>
    ///     Import products from csv files.
    /// </summary>
    /// <remarks>
    ///     ImportsDirectory must be set in the configuration and must contain
    ///     the CSV files. <br />
    ///     The CSVs must:<br />
    ///     - be encoded in UTF-8<br />
    ///     - use a comma as delimiter<br />
    ///     - have 6 columns: line number (int), designation (string),
    ///     description (string), productId (long), imageId (long),
    ///     productTypeCode(int).
    /// </remarks>
    /// <returns>the list of files that were imported</returns>
    /// <response code="200">Some files were imported</response>
    /// <response code="204">No file was imported</response>
    /// <response code="401">User not authorized</response>
    [HttpGet("products")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<string>))]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IEnumerable<string>>> TriggerImportProducts()
    {
        var alreadyImportedFiles = System.IO.File.Exists(_importsHistoryFile)
            ? System.IO.File.ReadAllLines(_importsHistoryFile, Encoding.UTF8).ToList()
            : [];

        var filesToImport = Directory.GetFiles(_importsDirectory, "*.csv", SearchOption.TopDirectoryOnly)
            .Where(fileName => !alreadyImportedFiles.Contains(fileName));

        var importedFiles = new List<string>();
        foreach (var file in filesToImport)
        {
            var products = CsvDataImporter.ImportProductData(file, _context);
            await _context.Products.AddRangeAsync(products);
            await _context.SaveChangesAsync();
            System.IO.File.AppendAllLines(_importsHistoryFile, [file]);
            importedFiles.Add(file);
        }

        return importedFiles.Count() > 0
            ? Ok(importedFiles)
            : NoContent();
    }
}

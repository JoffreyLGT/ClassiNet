using System.Text.Json;

namespace API.Models;

/// <summary>
///     Defines the content of the custom header sent to the client
///     when they request a list of entities.
/// </summary>
public class PaginatorHeader
{
    /// <summary>
    ///     Name of the header, used as a key.
    /// </summary>
    public static string HeaderName => "X-Paginator";

    /// <summary>
    ///     Total number of requested entities.
    /// </summary>
    public long TotalRecords { get; set; }

    /// <summary>
    ///     Total number of pages (based on the take property).
    /// </summary>
    public int TotalPages { get; set; }

    /// <summary>
    ///     Serialize the object into a JSON object.
    /// </summary>
    /// <returns>JSON object</returns>
    public string ToJson()
    {
        return JsonSerializer.Serialize(this);
    }
}
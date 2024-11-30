namespace API.Entity;

/// <summary>
///     Contains properties to apply to all entities.
/// </summary>
public class BaseEntity
{
    /// <summary>
    ///     Record creation date.
    /// </summary>
    public DateTime CreatedDate { get; set; }

    /// <summary>
    ///     Record update date.
    /// </summary>
    public DateTime UpdatedDate { get; set; }
}
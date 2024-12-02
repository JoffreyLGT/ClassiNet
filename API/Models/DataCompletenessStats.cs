namespace API.Models;

public class DataCompletenessStats
{
    public long Complete { get; set; }
    public long Incomplete { get; set; }
    public long MissingDescriptionOnly { get; set; }
    public long MissingImageOnly { get; set; }
    public long MissingDescriptionAndImage { get; set; }
}
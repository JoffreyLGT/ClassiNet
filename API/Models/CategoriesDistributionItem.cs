namespace API.Models;

public class CategoriesDistributionItem
{
    public int Id { get; set; }
    public string Name { get; set; }
    public long NbProducts { get; set; }
    public double Percentage { get; set; }
}
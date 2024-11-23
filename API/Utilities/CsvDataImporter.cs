using System.Globalization;
using System.Net;
using API.Models;
using CsvHelper;
using CsvHelper.Configuration;

namespace API.Utilities;

public static class CsvDataImporter
{
    /// <summary>
    ///     Map the categories from the Products CSV file to the categories we have in DB.
    /// </summary>
    /// <returns></returns>
    private static Dictionary<int, int> CsvToDbCategories()
    {
        return new Dictionary<int, int>
        {
            { 10, 1 },
            { 2403, 1 },
            { 2705, 1 },
            { 40, 2 },
            { 50, 2 },
            { 60, 2 },
            { 2462, 2 },
            { 2905, 2 },
            { 1140, 3 },
            { 1160, 4 },
            { 1180, 5 },
            { 1281, 5 },
            { 1280, 6 },
            { 1300, 7 },
            { 1301, 8 },
            { 1302, 9 },
            { 2582, 10 },
            { 2585, 10 },
            { 1320, 11 },
            { 1560, 12 },
            { 1920, 12 },
            { 2060, 12 },
            { 1940, 13 },
            { 2220, 14 },
            { 2280, 15 },
            { 2522, 16 },
            { 2583, 17 }
        };
    }

    /// <summary>
    ///     Read the content of the CSV file and return a list of products.
    /// </summary>
    /// <param name="csvPath">path to the CSV file</param>
    /// <param name="context">database context</param>
    /// <returns>List of products in the CSV file</returns>
    /// <exception cref="ApplicationException"></exception>
    public static List<Product> ImportProductData(string csvPath, AppDbContext context)
    {
        var categories = CsvToDbCategories();

        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HeaderValidated = null,
            MissingFieldFound = null
        };
        using var reader = new StreamReader(csvPath);
        using var csv = new CsvReader(reader, config);

        var records = csv.GetRecords<CsvProductLine>();
        var products = records.Select(record => new Product
        {
            Id = record.ProductId,
            Designation = WebUtility.HtmlDecode(record.Designation),
            Description = WebUtility.HtmlDecode(record.Description),
            ImageName = $"image_{record.ImageId}_product_{record.ProductId}.jpg",
            Category = context.Categories.Find(categories[record.ProductTypeCode])
        }).ToList();
        return products;
    }
}
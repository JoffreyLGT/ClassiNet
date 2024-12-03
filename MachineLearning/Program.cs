using Database;
using MachineLearning;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

internal class Program
{
    /// <summary>
    ///     For the moment, this is just a console app used to test the text pipeline without starting the API.
    ///     It'll be used to develop the model.
    /// </summary>
    /// <param name="args"></param>
    private static async Task Main(string[] args)
    {
        // Build a config object, using env vars and JSON providers.
        var config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .AddEnvironmentVariables()
            .Build();

        var wordCount = new Dictionary<string, int>();
        var processedWordCount = new Dictionary<string, int>();
        await using (var context = new AppDbContext(config))
        {
            foreach (var batch in FetchDataInBatches(context, 1000))
                TextProcessing.GetTextData(batch, ref processedWordCount, ref wordCount);
        }

        Console.WriteLine("Done");
    }

    public static IEnumerable<List<string>> FetchDataInBatches(AppDbContext dbContext, int batchSize)
    {
        var offset = 0;
        while (true)
        {
            var batch = dbContext.Products
                .OrderBy(row => row.Id) // Ensure consistent ordering
                .Skip(offset)
                .Take(batchSize)
                .AsNoTracking()
                .Select(product => product.Designation) // Optimize memory usage
                .ToList();

            if (batch.Count == 0)
                yield break;

            yield return batch;
            offset += batchSize;
            // Console.WriteLine(offset);
        }
    }
}
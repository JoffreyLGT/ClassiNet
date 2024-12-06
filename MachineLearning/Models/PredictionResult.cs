using Microsoft.ML.Data;

namespace MachineLearning.Models;

public class PredictionResult
{
    public int PredictedCategoryId { get; set; }

    [ColumnName("Score")] public float[] Scores { get; set; }
}
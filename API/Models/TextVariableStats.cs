namespace API.Models;

public class TextVariableStats
{
    public string VariableName { get; set; }
    public long NbWordsBeforeProcessing { get; set; }
    public long NbWords { get; set; }
    public WordCharacterCount[] LongestWords { get; set; }
    public WordCount[] WordsCount { get; set; }
}
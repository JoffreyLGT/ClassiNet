export interface BasicStats {
  nbUsers: number;
  nbActiveUsers: number;
  nbProducts: number;
  nbProductsCreatedLastMonth: number;
  nbCategories: number;
}

export interface CategoriesDistributionItem {
  id: number;
  name: string;
  nbProducts: number;
  percentage: number;
}

export interface DataCompletenessStats {
  complete: number;
  incomplete: number;
  missingDescriptionOnly: number;
  missingImageOnly: number;
  missingDescriptionAndImage: number;
}

export interface TextVariableStats {
  variableName: string;
  nbWordsBeforeProcessing: number;
  nbWords: number;
  longestWords: [
    {
      word: string;
      nbChars: number;
    },
  ];
  wordsLengthStats: WordsLengthStats;
  wordsCount: WordCount[];
}

export interface WordsLengthStats {
  average: number;
  standardDeviation: number;
  minimum: number;
  maximum: number;
  quartile25: number;
  quartile50: number;
  quartile75: number;
}

export interface WordCount {
  word: string;
  count: number;
}

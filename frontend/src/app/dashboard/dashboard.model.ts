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
  wordsCount: WordCount[];
}

export interface WordCount {
  word: string;
  count: number;
}

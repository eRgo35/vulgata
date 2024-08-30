export type ParsedVulgata = {
  [book: string]: {
    [chapter: string]: {
      [verse: string]: string;
    };
  };
};

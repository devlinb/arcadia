export type TRelationship =
  | 'King'
  | 'Queen'
  | 'Older Daughter'
  | 'Younger Daughter'
  | 'Older Son'
  | 'Younger Son'
  | 'General'
  | 'Bishop'
  | 'Advisor'
  | "King's Brother"
  | "Queen's Brother"
  | "King's Newphew";

export type TSkinColorStrings = 'a' | 'c' | 'db' | 'mb';

export type TCharacter = {
  id: number;
  name: string;
  relationship: TRelationship;
  skinColor: TSkinColorStrings;
};

export type TStorySubmission = {
  kingdom: string;
  characters: Array<TCharacter>;
};

export type TCharactersEventCharacters = {
  left: Array<string>;
  eventEmoji: string; // Just the emoji
  right?: Array<string>;
};

export type TStatementCeC = {
  statement: string;
  CeC?: Array<TCharactersEventCharacters>;
};

// TODO: Do this properly, a dictionary or something.
export type TNamesToRelationship = {
  [key: string]: TRelationship;
};

export type TNamesToCharacterInfo = {
  [key: string]: {relationship: TRelationship, skinColor: TSkinColorStrings}
}


export type TSavedStory = {
  summary: string;
  storyData: TStoryData;
};

export type TStoryData = {
  characterInfo: TNamesToCharacterInfo;
  statements: TStatementCeC[];
}
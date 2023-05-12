export type TRelationship = "King" | "Queen" | "Older Daughter" | "Younger Daughter" | 
  "Older Son" | "Younger Son" | "General" | "Bishop" | "Advisor" | "King's Brother" | 
  "Queen's Brother" | "King's Newphew"

export type TPerson = {
  id: number;
  name: string;
  relationship: TRelationship;
}

export type TStorySubmission = {
  kingdom: string;
  people: Array<TPerson>;
}

export type TPeopleEventPeople = {
  left: Array<string>;
  eventEmoji: string; // Just the emoji
  right?: Array<string>;
}

export type TStatementPeP = {
  statement: string;
  PeP?: Array<TPeopleEventPeople>;
}
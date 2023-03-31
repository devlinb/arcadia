export type TRelationship = "King" | "Queen" | "Older Daughter" | "Younger Daughter" | 
  "Older Son" | "Younger Son" | "General" | "Bishop" | "Advisor" | "King's Brother" | 
  "Queen's Brother" | "King's Newphew"

export type TPerson = {
  id: number;
  name: string;
  relationship: TRelationship;
}
export type TRelationship = "King" | "Queen" | "Older Daughter" | "Younger Daughter" | 
  "Older Son" | "Younger Son" | "General" | "Bishop" | "Advisor" | "King's Brother" | 
  "Queen's Brother" | "King's Newphew"

// Loading is initial loading, 
export type TStoryState =
  | "USER_INPUT"
  | "LOADING"
  | "STREAMING" // Story is incoming
  | "AUTOPLAY_WAITING" // We've ran out of statements
  | "LOADING_SAVED"
  | "READY" // Story is fully loaded.
  | "FINISHED";

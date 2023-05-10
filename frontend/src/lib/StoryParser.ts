import type { TPerson } from "../../../shared";

export type TStatementEvent = {
  statement: string;
  event?: Array<string>; // Full event string like "(Martin 🤝 Gregory 👑 Kingdom)""
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

const parseEventsFromLine = (line: string): TStatementEvent => {
  const match = line.match(/\((.*?)\)/g); // Extract events enclosed in parentheses
  // Remove event parenthetical from the line and set the cleaned line as our statement
  const statement: TStatementEvent = {statement: line.replace(/ \((.*?)\)/g, "")};
  if (match) {
    const event = match.map(event => event.slice(1, -1)); // Remove parentheses from events
    statement.event = event;
  }
  return statement;
}

// Returns an array of paragraphs and the events that happened in the paragraph
export const parseOutEvents = (text: string): Array<TStatementEvent> => {

  text = text.replace(/\.\n\n\(/g, "\. ("); // Sometimes gpt puts a few extra newlines in there.
  const embeddedEventsRegex = /\)(\.)? (\w)/g;
  text = text.replace(embeddedEventsRegex, ')$1\n\n$2');

  const lines = text.split('\n').filter(line => line !== ''); // Split the text into lines
  const statements: Array<TStatementEvent> = [];
  // Process each line and extract events
  for (let line of lines) {
    statements.push(parseEventsFromLine(line));
  }

  return statements;
};


export const statementEventsToStatementPeps = 
  (events: Array<TStatementEvent>) : Array<TStatementPeP> => {
  const result: TStatementPeP[] = []; 
  for( const statementEvent of events ) {
    result.push(statementEventtoStatementPeP(statementEvent));
  }
  
  return result;

}


// Parses characters out of Events.
// Only worries about the first "event" emoji in a given string, E.g. for the string
// (Martin 🤔 Gregory 🤔 Henry 👑)
// this function will only be concerned about "Martin 🤔 Gregory"
// For events like (Henry 🤒) it will return Henry and 🤒 as the event.
export const statementEventtoStatementPeP = (se: TStatementEvent): TStatementPeP => {
  
  let statementPep: TStatementPeP = { statement: se.statement };
  if( se.event === undefined ) return statementPep;

  statementPep.PeP = [];
  for ( const event of se.event ) {    
    const terminalEmojis = ['🤒', '👑'];

    // Update the regex to match a broader range of emojis
    const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FAB0}-\u{1FABF}\u{1FAC0}-\u{1FACF}\u{1FAD0}-\u{1FADF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu;
    const matches = event.match(emojiRegex);

    if (!matches || matches.length === 0) {
      continue;
    }

    const eventEmoji = matches[0];
    const isTerminal = terminalEmojis.includes(eventEmoji);
    const parts = event.split(eventEmoji);

    const left = parts[0]
      .replace(/[()]/g, '')
      .split(',')
      .map(name => name.trim())
      .filter(name => name.length > 0);

    if (isTerminal || parts[1] === '') {
      statementPep.PeP.push({ left, eventEmoji });
      continue;
    }

    const right = parts[1]
      .replace(/[()]/g, '')
      .split(',')
      .map(name => name.trim())
      .filter(name => name.length > 0);
      statementPep.PeP.push({ left, eventEmoji, right });
  }
  return statementPep;
}
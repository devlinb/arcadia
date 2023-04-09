import type { TPerson } from "../../../shared";

export type TStatementEvent = {
  statement: string;
  event?: string; // Full event string like "(Martin 🤝 Gregory 👑 Kingdom)""
}

export type TPeopleEventPeople = {
  left: Array<string>;
  eventEmoji: string; // Just the emoji
  right?: Array<string>;
}

export type TStatementPeP = {
  statement: string;
  PeP?: TPeopleEventPeople;
}

// Returns an array of paragraphs and the events that happened in the paragraph, ideally
// there should only ever be one event in a paragraph.
export const parseOutEvents = (text): Array<TStatementEvent> => {

  const embeddedEventsRegex = /\)(\.)? (\w)/g;
  text = text.replace(embeddedEventsRegex, ')$1\n\n$2');

  const lines = text.split('\n').filter(line => line !== ''); // Split the text into lines
  const statements: Array<TStatementEvent> = [];
  // Process each line and extract events
  for (let line of lines) {
    
    const match = line.match(/\((.*?)\)/g); // Extract events enclosed in parentheses
    
    // Remove event parenthetical from the line and set the cleaned line as our statement
    const statement: TStatementEvent = {statement: line.replace(/ \((.*?)\)/g, "")};
    if (match) {
      const event = match.map(event => event.slice(1, -1)); // Remove parentheses from events
      statement.event = event
    }
    statements.push(statement);
  }

  return statements;
};


// Parses characters out of Events.
// Only worries about the first "event" emoji in a given string, E.g. for the string
// (Martin 🤔 Gregory 🤔 Henry 👑)
// this function will only be concerned about "Martin 🤔 Gregory"
// For events like (Henry 🤒) it will return Henry and 🤒 as the event.
export const parsePeopleFromEvents = (statementsAndEvents: Array<TStatementEvent>): Array<TStatementPeP> => {
  const statementPePs: Array<TStatementPeP> = [];
  for( const se of statementsAndEvents) {
    let statementPep: TStatementPeP = { statement: se.statement };
    statementPePs.push(statementPep);
    if( se.event === undefined ) continue;
    const str = se.event[0];
  
    const terminalEmojis = ['🤒', '👑'];

    // Update the regex to match a broader range of emojis
    const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FAB0}-\u{1FABF}\u{1FAC0}-\u{1FACF}\u{1FAD0}-\u{1FADF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu;
    const matches = str.match(emojiRegex);

    if (!matches || matches.length === 0) {
      return null;
    }

    const eventEmoji = matches[0];
    const isTerminal = terminalEmojis.includes(eventEmoji);
    const parts = str.split(eventEmoji);

    const left = parts[0]
      .replace(/[()]/g, '')
      .split(',')
      .map(name => name.trim())
      .filter(name => name.length > 0);

    if (isTerminal) {
      statementPep.PeP = { left, eventEmoji };
      continue;
    }

    const right = parts[1]
      .replace(/[()]/g, '')
      .split(',')
      .map(name => name.trim())
      .filter(name => name.length > 0);

      statementPep.PeP = { left, eventEmoji, right };
  }
  return statementPePs;
}
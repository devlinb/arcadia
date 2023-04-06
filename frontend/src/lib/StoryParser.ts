export type StatementEvent = {
  statement: string;
  event?: string;
}

// Returns an array of paragraphs and the events that happened in the paragraph, ideally
// there should only ever be one event in a paragraph.
export const parseOutEvents = (text): Array<StatementEvent> => {

  const embeddedEventsRegex = /\)(\.)? (\w)/g;
  text = text.replace(embeddedEventsRegex, ')$1\n\n$2');

  const lines = text.split('\n').filter(line => line !== ''); // Split the text into lines
  const statements: Array<StatementEvent> = [];
  // Process each line and extract events
  for (let line of lines) {
    
    const match = line.match(/\((.*?)\)/g); // Extract events enclosed in parentheses
    
    // Remove event parenthetical from the line and set the cleaned line as our statement
    const statement: StatementEvent = {statement: line.replace(/ \((.*?)\)/g, "")};
    if (match) {
      const event = match.map(event => event.slice(1, -1)); // Remove parentheses from events
      statement.event = event
    }
    statements.push(statement);
  }

  return statements;
};
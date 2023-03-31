type StatementAction = {
  statement: string;
  action: string;
}

// Returns an array of paragraphs and the events that happened in the paragraph, ideally
// there should only ever be one event in a paragraph.
export const getEvents = (text): Array<{narrative: string, events: string[]}> => {
  const events = [];

  const embeddedEventsRegex = /\)\. (\w)/;
  text = text.replace(embeddedEventsRegex, ').\n\n$1');

  const lines = text.split('\n').filter(line => line !== ''); // Split the text into lines

  // Process each line and extract events
  for (let line of lines) {
    const match = line.match(/\((.*?)\)/g); // Extract events enclosed in parentheses
    if (match) {
      const eventList = match.map(event => event.slice(1, -1)); // Remove parentheses from events
      events.push(...eventList);
    }
  }

  // Create an array of objects containing the narrative piece and events
  const story = lines.map((line, index) => {
    if (!line.includes('(')) {
      return { narrative: line, events: [] }; // If the line doesn't contain events, return empty events array
    } else {
      return { narrative: line.replace(/\((.*?)\)/g, '').trim(), events: events.filter(event => lines[index].includes(event)) };
    }
  }).filter(obj => obj.events.length > 0); // Filter out objects with empty events array

  return story;
};
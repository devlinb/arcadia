import type { TStatementPeP } from './types';

export type TStatementEvent = {
  statement: string;
  event?: Array<string>; // Full event string like "(Martin 🤝 Gregory 👑 Kingdom)""
};

const parseEventsFromLine = (line: string): TStatementEvent => {
  const match = line.match(/\((.*?)\)/g); // Extract events enclosed in parentheses
  // Remove event parenthetical from the line and set the cleaned line as our statement
  const statement: TStatementEvent = {
    statement: line.replace(/ \((.*?)\)/g, ''),
  };
  if (match) {
    const event = match.map((event) => event.slice(1, -1)); // Remove parentheses from events
    statement.event = event;
  }
  return statement;
};

// Returns an array of paragraphs and the events that happened in the paragraph
export const parseOutEvents = (text: string): Array<TStatementEvent> => {
  text = text.replace(/\.\n\n\(/g, '. ('); // Sometimes gpt puts a few extra newlines in there.
  const embeddedEventsRegex = /\)(\.)? (\w)/g;
  text = text.replace(embeddedEventsRegex, ')$1\n\n$2');

  const lines = text.split('\n').filter((line) => line !== ''); // Split the text into lines
  const statements: Array<TStatementEvent> = [];
  // Process each line and extract events
  for (const line of lines) {
    statements.push(parseEventsFromLine(line));
  }

  return statements;
};

export const statementEventsToStatementPeps = (
  events: Array<TStatementEvent>
): Array<TStatementPeP> => {
  const result: TStatementPeP[] = [];
  for (const statementEvent of events) {
    result.push(statementEventtoStatementPeP(statementEvent));
  }

  return result;
};

// Parses People out of Events.
// An such as "(Martin 🤔 Gregory 🤔 Henry 👑)" comes in, a PeP is an array of these:
// {left: ["Martin"], event: "🤔", right: ["Gregory", "Martin"] }
// Previously right was the entire string "Gregory 🤔 Henry 👑" which is higher fidelity
// but proves hard to draw with portraits.
// For events without a right sided person, like (Henry 🤒) it will return ["Henry"] and 🤒 as the event.
export const statementEventtoStatementPeP = (
  se: TStatementEvent
): TStatementPeP => {
  const statementPep: TStatementPeP = { statement: se.statement };
  if (se.event === undefined) return statementPep;

  statementPep.PeP = [];
  for (const event of se.event) {
    const terminalEmojis = ['🤒', '👑'];

    /* 
      Some emojis consist of multiple characters, an initial pictograph and a second unicode codepoint
      that means "display this as an emoji". The extended emoji regex tries to capture these multi-char emojis.
      Simpler regexs leave behind an invalid unicode string by not removing the entire 2 codepoint sequence.
      However the below sequence properly removes one or two codepoints based on need.
      https://stackoverflow.com/questions/43242440/javascript-regular-expression-for-unicode-emoji
    */
    const extendedEmojiRegex =
      /\p{RI}\p{RI}|\p{Emoji}(\p{EMod}+|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?(\u{200D}\p{Emoji}(\p{EMod}+|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?)+|\p{EPres}(\p{EMod}+|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?|\p{Emoji}(\p{EMod}+|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})/gu;

    const matches = event.match(extendedEmojiRegex);

    if (!matches || matches.length === 0) {
      continue;
    }

    const eventEmoji = matches[0];
    const isTerminal = terminalEmojis.includes(eventEmoji);
    const parts = event.split(eventEmoji);

    const left = parts[0]
      .replace(/[()]/g, '')
      .split(',')
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (isTerminal || parts[1] === '') {
      statementPep.PeP.push({ left, eventEmoji });
      continue;
    }

    // For now we are going to strip emjois from the right hand string.
    // Ideally our structure would be recursive instead, to at least 1 layer deep.
    const right = parts[1]
      .replace(/[()]/g, '')
      .replace(extendedEmojiRegex, ',')
      .split(',')
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
    statementPep.PeP.push({ left, eventEmoji, right });
  }
  return statementPep;
};

import { writable, readonly } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { TPeopleEventPeople, TStatementPeP } from '../lib/StoryParser';

/**
 * statements is the statement array of the current story
 * currentStatementStore is the non-exported store we put the current statement in
 * currentStatement is a read only store we export that other components trigger off of
 * Please rename these if you can think of better names.
 */
let statements: Array<TStatementPeP> = [];
const currentStatementStore: Writable<TStatementPeP | null> = writable(null);

export const currentStatement = readonly(currentStatementStore);

let storyProgressTimer: ReturnType<typeof setTimeout>;

let statementIndex = 0; // What statement in the array we are currently on

/**
 * Sets, or resets, the story that will be told. If in the middle of a story
 * the new story will replace the current story and the story position will be 
 * set to the beginning.
 */
export const setStory = (storyStatements: Array<TStatementPeP>) => {
  statements = storyStatements;
  statementIndex = 0;
  currentStatementStore.set(statements[statementIndex]);
}


export const playStory = () => {
  if (statements.length <= 0) throw "No story assigned to tell";
  if (statements.length - 1 <= statementIndex) return;

  storyProgressTimer = setTimeout(() => {
    currentStatementStore.set(statements[statementIndex]);
    statementIndex++;
    playStory();
  },
  readingTimeInMilliseconds(statements[statementIndex].statement)
  );
}

export const stopStory = () => {
  clearTimeout(storyProgressTimer);
}

export const resetStory = () => {
  if (statements.length < 0) throw "No story assigned to tell";

  statementIndex = 0;
  currentStatementStore.set(statements[statementIndex]);
}

export const previousStatement = () => {
  if (statementIndex > 0) {
    statementIndex--;
    currentStatementStore.set(statements[statementIndex]);
  }
}

export const nextStatement = () => {
  if (statements.length - 1 > statementIndex) {
    statementIndex++;
    currentStatementStore.set(statements[statementIndex]);
  }
}

const readingTimeInMilliseconds = (text: string): number => {
  // Average reading speed: 200 words per minute (WPM)
  // 1 minute = 60,000 milliseconds, so 200 WPM = 60,000 / 200 = 333 milliseconds per word
  const millisecondsPerWord = 333;

  // Calculate the number of words in the text
  const words = text.split(/\s+/);
  const wordCount = words.length;

  // Calculate the reading time in milliseconds
  const readingTime = wordCount * millisecondsPerWord;

  return readingTime;
}

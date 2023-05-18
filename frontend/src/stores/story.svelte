<script lang="ts" context="module">
import { writable, derived, type Readable, get } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { TCharactersEventCharacters, TRelationship, TStatementCeC } from '../../../shared';
import type { TStoryState } from '../types';

/**
 * statements is the statement array of the current story
 */
export let statements: Array<TStatementCeC> = [];

// TODO: Do this properly
type TNamesToRelationship = {
  [key: string]: TRelationship;
};
export let relationshipMap: TNamesToRelationship = {};

let statementIndex: Writable<number> = writable(0); // What statement in the array we are currently on;
let eventIndex: Writable<number> = writable(0); // What statement in the array we are currently on;
export const currentDialogueLine = derived(
  statementIndex,
  $statementIndex => statements[$statementIndex]
);

export const currentEvent: Readable<TCharactersEventCharacters> = derived(
  [statementIndex, eventIndex],
  ([$statementIndex, $eventIndex]) => {
    if (statements[$statementIndex].CeC) return statements[$statementIndex].CeC[$eventIndex];
    return null;
  }
);

export const storyState: Writable<TStoryState> = writable('USER_INPUT');

export const usePregeneratedCharacters: Writable<boolean> = writable(false);
export const usePregeneratedStory: Writable<boolean> = writable(false);

let storyProgressTimer: ReturnType<typeof setTimeout>;

/**
 * Sets, or resets, the story that will be told. If in the middle of a story
 * the new story will replace the current story and the story position will be 
 * set to the beginning.
 */
export const setStory = (storyStatements: Array<TStatementCeC>) => {
  statements = storyStatements;
  statementIndex.set(0);
  eventIndex.set(0);
}


export const playStory = () => {
  console.log('playing story');
  if (statements.length <= 0) throw "No story assigned to tell";
  if (statements.length - 1 <= get(statementIndex)) {
    setTimeout(() => {
        storyState.set('FINISHED');
      },
      readingTimeInMilliseconds(statements[get(statementIndex)].statement)
    );
    return;
  }

  storyProgressTimer = setTimeout(() => {
    const stIndex = get(statementIndex);
    const evIndex = get(eventIndex);
    if (statements[stIndex].CeC && statements[stIndex].CeC.length - 1 > evIndex) {
      eventIndex.set(evIndex + 1);
    } else {
      eventIndex.set(0);
      statementIndex.set(stIndex + 1);
    }    
    playStory();
  },
  /*
    If we have multiple events, divide estimated reading time of the paragraph by the number of events we need 
    are going to show. If only a single event, just use the estimated reading time for the paragraph.
  */
  statements[get(statementIndex)].CeC
  ? readingTimeInMilliseconds(statements[get(statementIndex)].statement) / statements[get(statementIndex)].CeC.length
  : readingTimeInMilliseconds(statements[get(statementIndex)].statement)
  );
}

export const stopStory = () => {
  clearTimeout(storyProgressTimer);
}

export const resetStory = () => {
  if (statements.length < 0) throw "No story assigned to tell";
  statementIndex.set(0);
  eventIndex.set(0);
  stopStory();
  playStory();
}

export const previousStatement = () => {
  if (get(statementIndex) > 0) {
    eventIndex.set(0);
    statementIndex.set(get(statementIndex) - 1);
  }
  stopStory();
}

export const nextStatement = () => {
  if (statements.length > get(statementIndex)) {
    eventIndex.set(0);
    statementIndex.set(get(statementIndex) + 1);
  }
  stopStory();
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
</script>
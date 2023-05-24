<script lang="ts" context="module">
  import { writable, derived, type Readable, get } from 'svelte/store';
  import type { Writable } from 'svelte/store';
  import type { TCharactersEventCharacters, TRelationship, TStatementCeC } from '../../../shared';
  import type { TStoryState } from '../types';

  /**
   * Datastore for everything story related. Important structures:
   * statements: Array of the story being told, broken down into statements that
   *             have attached characters and events
   *
   * TNamesToRelationship: A map that looksup a character's name and tells you their
   *                       relationship to the king.
   *
   * statementIndex: A store (subscribable value) tracking which statement we are on right now
   *                 Used internally to populate currentDialogLine
   *
   * eventIndex: Within the current statement, which event (the emojis and portraits) is being shown?
   *             This is used internally to populate currentEvent
   *
   * currentStatement: What statement are we currently working with? (Animating characters in, showing narration for, etc)
   *
   * currentEvent: The event currently being shown.
   *
   * storyState: Used to track if the the story is still loading, playing, or if we are finished playing it.
   *
   */

  export let statements: Array<TStatementCeC> = [];

  // TODO: Do this properly, a dictionary or something.
  type TNamesToRelationship = {
    [key: string]: TRelationship;
  };
  export let relationshipMap: TNamesToRelationship = {};

  let statementIndex: Writable<number> = writable(0); // What statement in the array we are currently on;
  let eventIndex: Writable<number> = writable(0); // What statement in the array we are currently on;
  export let completeStoryReceived = writable(false); // Only used for streaming stories.
  export const currentStatement = derived(statementIndex, ($statementIndex) => statements[$statementIndex]);

  export const currentEvent: Readable<TCharactersEventCharacters> = derived([statementIndex, eventIndex], ([$statementIndex, $eventIndex]) => {
    if (statements[$statementIndex].CeC) return statements[$statementIndex].CeC[$eventIndex];
    return null;
  });

  export const storyState: Writable<TStoryState> = writable('USER_INPUT');

  // Cancellable timer used for auto advancing the story.
  let storyProgressTimer: ReturnType<typeof setTimeout>;

  /**
   * Sets, or resets, the story that will be told. If in the middle of a story
   * the new story will replace the current story and the story position will be
   * set to the beginning.
   */
  export const setStory = (storyStatements: Array<TStatementCeC>) => {
    statements = storyStatements;
    completeStoryReceived.set(true);
    statementIndex.set(0);
    eventIndex.set(0);
  };

  export const addToStory = (storyStatement: TStatementCeC) => {
    statements.push(storyStatement);
  };

  export const playStory = () => {
    
      storyProgressTimer = setTimeout(() => {
        if (get(useAutoplay)) { nextStatement(); } // only advance if autoplay is set.
        if (get(storyState) !== 'FINISHED') {
          playStory();
        }
      },
      statements[get(statementIndex)].CeC
        ? readingTimeInMilliseconds(statements[get(statementIndex)].statement) /
          statements[get(statementIndex)].CeC.length
        : readingTimeInMilliseconds(statements[get(statementIndex)].statement)
      );
  };

  export const stopStory = () => {
    clearTimeout(storyProgressTimer);
  };

  export const resetStory = () => {
    if (statements.length < 0) throw 'No story assigned to tell';
    statementIndex.set(0);
    eventIndex.set(0);
    stopStory();
    playStory();
  };

  /**
   * Walks backwards through the sory.
   * 
   * First checks if we need to go to the previous event.
   * If not, checks if we need to go to the previous statement
   * If we go to the previous statement, checks if we need to go to 
   * the end of the events array for that statement.
   */
  export const previousStatement = () => {
    let stIndex = get(statementIndex);
    const evIndex = get(eventIndex);
    if (
      statements[stIndex].CeC &&
      statements[stIndex].CeC.length !== 0 &&
      evIndex !== 0
    ) {
      eventIndex.set(evIndex - 1);
      stopStory();
      playStory();
      return;
    }

    if (stIndex > 0) {
      stIndex--;
      statementIndex.set(stIndex);
      if (
        statements[stIndex].CeC &&
        statements[stIndex].CeC.length > 0
      ) {
        eventIndex.set(statements[stIndex].CeC.length - 1);
      }
      stopStory();
      playStory();
      return;
    }
  };

  export const nextStatement = () => {
    const stIndex = get(statementIndex);
    const evIndex = get(eventIndex);

    // If we are at the last statement, we may have more events or we may
    // be ready to be finished.
    if (stIndex === statements.length - 1) { // Either next event or finished
      if (statements[stIndex].CeC && statements[stIndex].CeC.length - 1 > evIndex) {
        eventIndex.set(evIndex + 1);
        return;
      } else {
        storyState.set("FINISHED");
      }
    }

    if (statements[stIndex].CeC &&
          statements[stIndex].CeC.length - 1 > evIndex) {
          eventIndex.set(evIndex + 1);
          return;
      } else {
        eventIndex.set(0);
        statementIndex.set(stIndex + 1);
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
  };

  export let useAutoplay: Writable<boolean> = writable(true);

  export const handleAutoplayClicked = (e) => {
    if (e.currentTarget.checked) {
      playStory();
    } else {
      stopStory();
    }
  };
</script>

<script lang="ts">
  import Characters from './lib/StoryForm.svelte';
  import { fetchStory } from './lib/StoryFetcher';
  import { parseOutEvents, parsePeopleFromEvents, type TStatementPeP } from './lib/StoryParser';
  import type { TStatementEvent } from './lib/StoryParser';
  import type { TRelationship, TPerson, TStorySubmission } from "../../shared";

  import Dialogue from './lib/Dialogue.svelte';

  let story = "";
  let events: Array<TStatementEvent> = [];

  let currentStatement = 0;

  // Contains an array of statements, and split up characters and emojis that go with each statement.
  let statementPePs: Array<TStatementPeP> = [];

  const handleCharacterSubmit = async (submission: TStorySubmission) => {
    console.log(`got the story: ${JSON.stringify(submission)}`);
    story = await fetchStory(submission);
    events = parseOutEvents(story);
    statementPePs = parsePeopleFromEvents(events);
    console.log(statementPePs);
    
    const enqueueNextLoop = () => setTimeout(() => {
      if( currentStatement < statementPePs.length - 1) {
        currentStatement++;
        enqueueNextLoop();
      }
      return;
    }, 5000);
    enqueueNextLoop();
  }
</script>

<main>
  <div class="card">
    <Characters onsubmit={handleCharacterSubmit} />
  </div>

  {#if events.length !== 0}
  <!-- Problem! Dialog animations don't kick off after loop increments, because we are using onmount in the component -->
  <Dialogue
    text={statementPePs[currentStatement].statement}
    character1={statementPePs[currentStatement].PeP.left[0]}
    character2={(statementPePs[currentStatement].PeP.right && statementPePs[currentStatement].PeP.right[0]) || ''}
    action={statementPePs[currentStatement].PeP.eventEmoji}
    delay={3000}
  />
  {/if}

  <div class="card">
    {#each events as event }
    <div style="display: flex">
      <p style="text-align: left; flex: 2;">
        {event.statement}
      </p>
      <p>—</p>
      <p style="white-space: nowrap; flex: 1; text-align: left;">
        {event.event}
      </p>
    </div>  
    {/each}
  </div>

</main>

<style>
</style>

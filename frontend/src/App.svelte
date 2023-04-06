<script lang="ts">
  import Characters from './lib/StoryForm.svelte';
  import { fetchStory } from './lib/StoryFetcher';
  import { parseOutEvents } from './lib/StoryParser';
  import type { StatementEvent } from './lib/StoryParser';
  import type { TRelationship, TPerson, TStorySubmission } from "../../shared";

  let story = "";
  let events: Array<StatementEvent> = [];


  const handleCharacterSubmit = async (submission: TStorySubmission) => {
    console.log(`got the story: ${JSON.stringify(submission)}`);
    story = await fetchStory(submission);
    events = parseOutEvents(story);
  }
</script>

<main>
  <div class="card">
    <Characters onsubmit={handleCharacterSubmit} />
  </div>

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

<script lang="ts">
  import Characters from './lib/StoryForm.svelte';
  import { fetchStory } from './lib/StoryFetcher';
  import type { TRelationship, TPerson, TStorySubmission } from "../../shared";

  let story = "";


  const handleCharacterSubmit = async (submission: TStorySubmission) => {
    console.log(`got the story: ${JSON.stringify(submission)}`);
    story = await fetchStory(submission);

  }
</script>

<main>
  <div class="card">
    <Characters onsubmit={handleCharacterSubmit} />
  </div>

  <div class="card">
    {story}
  </div>

</main>

<style>
</style>

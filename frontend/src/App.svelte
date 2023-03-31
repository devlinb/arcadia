<script lang="ts">
  import Characters from './lib/StoryForm.svelte'
  import type { TRelationship, TPerson, TStorySubmission } from "../../shared"

  let story = "";

  const postStorySubmission = async (submission: TStorySubmission) => {
    const url = `${import.meta.env.VITE_API_SERVER}${import.meta.env.VITE_PROMPT_URL}`;
    console.log(`url: ${url}`);
    const fetchOptions = {
      method: 'POST',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(submission)
    };
    const response = await fetch(url, fetchOptions);
    const result = await response.json();
    console.log(result);
    story = result.story;
  }

  const handleCharacterSubmit = (submission: TStorySubmission) => {
    console.log(`got the story: ${JSON.stringify(submission)}`);
    postStorySubmission(submission);
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

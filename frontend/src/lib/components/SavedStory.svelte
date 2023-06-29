<script lang="ts">
  import { namesToCharacterInfo, playStory, storyState, setStory } from '../../stores/story.svelte';
  import { fetchSavedStory } from '../SavedStoryFetcher';
  import type { TSavedStory } from '../../../../shared';

  export let storyId: string;
  const fetchSavedStoryPromise = fetchSavedStory(storyId);
  console.log(`storyId is: ${storyId}`);
</script>

<entirestory>
  {#await fetchSavedStoryPromise}
  <p>
    The library is fetching the tale from the Kingdom's archives.
  </p>
  {:then story}
    <p>Tonight's Story</p>
    <p>{story.summary}</p>
    <button on:click={() => {
      setStory(story.storyData.statements);
      Object.assign(namesToCharacterInfo, story.storyData.characterInfo);
      storyState.set('READY');
      playStory();
    }}>Tell this Tale</button>
  {:catch error}
    <p>Apologizes as the scroll with that tale was not to be found.</p>
    {console.error(error)}
  {/await}
</entirestory>

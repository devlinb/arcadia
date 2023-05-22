<script lang="ts">
  import Modal from 'svelte-simple-modal';
  import Characters from './lib/components/StoryForm.svelte';
  import { startStreamingStory } from './lib/StoryFetcherStreamingws';
  import { playStory, storyState } from './stores/story.svelte';
  import type { TStorySubmission } from '../../shared';
  import townSnowUrl from '../src/assets/town_square_snow.jpg';
  import townDayUrl from '../src/assets/town_square_day.jpg';
  import townDuskUrl from '../src/assets/town_square_dusk.jpg';
  import StorySummary from './lib/components/StorySummary.svelte';

  import 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
  // @ts-ignore
  const viewer = pannellum.viewer('panorama', {
    default: {
      firstScene: 'day',
      sceneFadeDuration: 1000,
      hfov: '45'
    },
    scenes: {
      snow: {
        type: 'equirectangular',
        panorama: townSnowUrl,
        autoLoad: true,
        autoRotate: true,
      },
      day: {
        type: 'equirectangular',
        panorama: townDayUrl,
        autoLoad: true,
        autoRotate: true,
      },
      dusk: {
        type: 'equirectangular',
        panorama: townDuskUrl,
        autoLoad: true,
        autoRotate: true,
      },
    },
  });

  $: {
    if ($storyState === 'FINISHED')
    viewer.loadScene('dusk');
  }
  import Dialogue from './lib/components/Dialogue.svelte';

  const handleCharacterSubmit = async (submission: TStorySubmission) => {
    await startStreamingStory(submission);
    console.log(`calling playstory`);
    playStory();

    // @ts-ignore
    viewer.loadScene('snow');
  };
</script>


<main>
  <border>
    <content>
      {#if $storyState === 'USER_INPUT'}
        <Modal><Characters onsubmit={handleCharacterSubmit} /></Modal>
      {:else if $storyState === 'LOADING'}
        <div>The bards are writing your tale</div>
      {:else if $storyState === 'READY'}
        <Dialogue/>
      {:else if $storyState === 'FINISHED'}
        <StorySummary/>
      {/if}
    </content>
  </border>
</main>

<style>
</style>

<script lang="ts">
  import { get } from 'svelte/store';
  import Characters from './lib/StoryForm.svelte';
  import { startStreamingStory } from './lib/StoryFetcherStreamingws';
  import { playStory, storyState, useAutoplay, handleAutoplayClicked } from './stores/story.svelte';
  import type { TStorySubmission } from '../../shared';
  import townSnowUrl from '../src/assets/town_square_snow.jpg';
  import townDayUrl from '../src/assets/town_square_day.jpg';
  import townDuskUrl from '../src/assets/town_square_dusk.jpg';
  import StorySummary from './lib/StorySummary.svelte';

  import 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';

  // @ts-ignore
  const viewer = pannellum.viewer('panorama', {
    default: {
      firstScene: 'day',
      sceneFadeDuration: 1000,
      hfov: '45',
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
    if ($storyState === 'FINISHED') viewer.loadScene('dusk');
  }
  import Dialogue from './lib/Dialogue.svelte';
  import { onDestroy } from 'svelte';

  let test = useAutoplay ? 'on' : '';

  const handleCharacterSubmit = async (submission: TStorySubmission) => {
    await startStreamingStory(submission);
    console.log(`calling playstory`);
    // playStory();

    // @ts-ignore
    viewer.loadScene('snow');
  };
  $: className = get(useAutoplay);
  // let apclassname = '';
  // const destroyAP = useAutoplay.subscribe((value) => (apclassname = value ? 'on' : 'off'));
  // onDestroy(destroyAP);
</script>

<main>
  <border>
    <scrolltop />
    <content>
      {#if $storyState === 'USER_INPUT'}
        <Characters onsubmit={handleCharacterSubmit} />
      {:else if $storyState === 'LOADING'}
        <div>The bards are writing your tale</div>
      {:else if $storyState === 'READY'}
        <Dialogue />
      {:else if $storyState === 'FINISHED'}
        <StorySummary />
      {/if}
    </content>
    <scrollbottom />
    {#if $storyState !== 'USER_INPUT'}
      <div class="playback-controls">
        <input id="ap-checkbox" type="checkbox" bind:checked={$useAutoplay} on:click={handleAutoplayClicked} />
        <label for="ap-checkbox">auto advance</label>
      </div>
    {/if}
  </border>
</main>

<style>
  .playback-controls {
    margin-top: -88px;
    font-weight: 400;
    display: block;
    position: absolute;
    z-index: 100;
    text-align: right;
    width: 500px;
  }
</style>

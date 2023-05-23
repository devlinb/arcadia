<script lang="ts">
  import { get } from 'svelte/store';
  import Modal from 'svelte-simple-modal';
  import Characters from './lib/components/StoryForm.svelte';
  import { startStreamingStory } from './lib/StoryFetcherStreamingws';
  import { playStory, storyState, useAutoplay, handleAutoplayClicked } from './stores/story.svelte';
  import { usePregeneratedCharacters, usePregeneratedStory, enableMusicAndSfx } from './stores/settings.svelte';

  import type { TStorySubmission } from '../../shared';
  import townSnowUrl from '../src/assets/town_square_snow.jpg';
  import townDayUrl from '../src/assets/town_square_day.jpg';
  import townDuskUrl from '../src/assets/town_square_dusk.jpg';
  import StorySummary from './lib/components/StorySummary.svelte';
  import Music from './lib/components/Music.svelte';

  import 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';

  const handleUseSoundClicked = (e) => {
    if (e.currentTarget.checked) {
    } else {
    }
  };

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
  import Dialogue from './lib/components/Dialogue.svelte';
  import { onDestroy } from 'svelte';

  let test = useAutoplay ? 'on' : '';

  const handleCharacterSubmit = async (submission: TStorySubmission) => {
    await startStreamingStory(submission);
    playStory();

    // @ts-ignore
    viewer.loadScene('snow');
  };
  $: className = get(useAutoplay);
  // let apclassname = '';
  // const destroyAP = useAutoplay.subscribe((value) => (apclassname = value ? 'on' : 'off'));
  // onDestroy(destroyAP);
</script>

<Music />
<main>
  <border>
    <scrolltop />
    <content>
      {#if $storyState === 'USER_INPUT'}
        <Modal><Characters onsubmit={handleCharacterSubmit} /></Modal>
      {:else if $storyState === 'LOADING'}
        <div>The bards are writing your tale</div>
      {:else if $storyState === 'READY' || $storyState === 'STREAMING' || $storyState === 'AUTOPLAY_WAITING'}
        <Dialogue />
      {:else if $storyState === 'FINISHED'}
        <StorySummary />
      {/if}
    </content>
    <scrollbottom />
    {#if $storyState !== 'USER_INPUT'}
      <div class="playback-controls">
        <button on:click={() => location.reload()}>Start Over</button>
        <input id="ap-checkbox" type="checkbox" bind:checked={$useAutoplay} on:click={handleAutoplayClicked} />
        <label for="ap-checkbox">auto advance</label>
        <input type="checkbox" bind:checked={$enableMusicAndSfx} id="enableMusicAndSfxCheckbox" />
        <label for="enableMusicAndSfxCheckbox">music</label>
      </div>
    {/if}
  </border>
</main>

<style>
  .playback-controls {
    margin-top: -88px;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: end;
    position: absolute;
    z-index: 100;
    text-align: right;
    width: 500px;
  }

  @media only screen and (max-width: 700px) {
    .playback-controls {
      margin-top: -31px;
    }
  }
</style>

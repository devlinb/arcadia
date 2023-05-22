<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import {
    currentStatement,
    currentEvent,
    playStory,
    stopStory,
    previousStatement,
    nextStatement,
    resetStory
  } from '../../stores/story.svelte';
  import CharacterCard from './CharacterCard.svelte';

  let key;

  // Whenever any either of the characters or if the eventEmoji changes, the key will change
  // which will cause all the divs to redraw, which will then trigger new slide in and out animations.
  // There is an edge case bug where if two lines have the same characters and the same emoji, the 
  // animation won't be repeated, but this isn't the end of the world.
  $: {
    if ($currentEvent){
      key = $currentEvent.left[0] + $currentEvent.eventEmoji + ($currentEvent.right && $currentEvent.right[0]);
    }
  }
</script>

<div class="card">
  <div class="story-line-container">
    {$currentStatement.statement}
  </div>
  {#if $currentStatement.CeC } <!-- sometimes we have a story line and no action at all-->
    <div class="dialogue-container">
      {#key key}
        <div class="characters" out:fly={{ x: 100, delay: 0, duration: 200 }}>
          <CharacterCard characters={$currentEvent.left} flyInFrom={'left'}/>
          <div in:fade={{ delay: 600 }} class="speech-bubble">
            {$currentEvent.eventEmoji}
          </div>
          {#if $currentEvent.right}
            <CharacterCard characters={$currentEvent.right} flyInFrom={'right'}/>
          {/if}
        </div>
      {/key}
    </div>
  {/if}
  <h1 id="card-header">Our story unfolds...</h1>
  <div class="playback-controls">
    <button on:click={previousStatement}>prev</button>
    <button on:click={playStory}>play</button>
    <button on:click={stopStory}>stop</button>
    <button on:click={nextStatement}>next</button>
    <button on:click={resetStory}>reset</button>
  </div>
</div>

<style>
  .dialogue-container {
    position: relative;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 130px;
    align-items: center;
    /* justify-content: center;
    align-items: center; */
    align-self: center;
    width: 100%;
    margin: 0;
    overflow: hidden;
    height: 130px;
    max-height: 130px;
  }

  .playback-controls {
    display: flex;
    justify-content: space-around;
  }

  :global(.animate-out) {
    transform: translateX(200%);
    transition: transform 0.5s;
  }

  .characters {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    grid-column: 1;
    grid-row: 1;
    height: 100px;
    width: 100%;
  }

  .speech-bubble {
    margin: 0 5;
    border-radius: 5px;
    min-width: 50px;
    max-width: 50%;
    text-align: center;
    font-size: 3rem;
  }
</style>

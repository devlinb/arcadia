<script lang="ts">
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import {
    currentDialogueLine,
    currentEvent,
    playStory,
    stopStory,
    previousStatement,
    nextStatement,
    resetStory,
    relationshipMap } from '../stores/story.svelte';
  import type { TRelationship } from '../../../shared/dist';

  
  import kingUrl from '../assets/king.jpg';
  import advisorUrl from '../assets/advisor.jpg';
  import queenUrl from '../assets/queen.jpg'
  import youngPrincessUrl from '../assets/young_princess.jpg';
  import youngPrinceUrl from '../assets/young_prince.jpg';
  import olderPrincessUrl from '../assets/older_princess.jpg';
  import olderPrinceUrl from '../assets/older_prince.jpg';
  import bishopUrl from '../assets/bishop.jpg';
  import generalUrl from '../assets/general.jpg';
  let key;
  
  const relationshipToUrl = (relationship: TRelationship): string => {
    switch (relationship) {
      case "King": return kingUrl;
      case "Queen": return queenUrl;
      case "Older Daughter": return olderPrincessUrl;
      case "Younger Daughter": return youngPrincessUrl;
      case "Older Son": return olderPrinceUrl;
      case "Younger Son": return youngPrinceUrl;
      case "General": return generalUrl;
      case "Bishop": return bishopUrl;
      case "Advisor": return advisorUrl;
      default:
        return "none";
    }
  }

  // Whenever any either of the characters or if the eventEmoji changes, the key will change
  // which will cause all the divs to redraw which then triggers new animations
  $: {
    if ($currentEvent){
      key = $currentEvent.left[0] + $currentEvent.eventEmoji + ($currentEvent.right && $currentEvent.right[0]);
    }
  }
</script>

<div class="card">
  <div class="story-line-container">
    {$currentDialogueLine.statement}
  </div>
  {#if $currentDialogueLine.PeP } <!-- sometimes we have a story line and no action at all-->
    <div class="dialogue-container">
      {#key key}
        <div class="characters" out:fly={{ x: 100, delay: 0, duration: 200 }}>
          <div class="character" in:fly={{ x: -100, delay: 300, duration: 500 }}>
            {#each $currentEvent.left as person}
            {#if relationshipMap[person] && relationshipToUrl(relationshipMap[person]) !== 'none'}
            <img class="character-portrait" src={relationshipToUrl(relationshipMap[person])} alt="king" />
            {/if}
            <div class="character-name-label">{person}</div>
            {/each}
          </div>
          <div in:fade={{ delay: 600 }} class="speech-bubble">
            {$currentEvent.eventEmoji}
          </div>
          {#if $currentEvent.right}
            <div class="character" in:fly={{ x: 100, delay: 300, duration: 500 }}>
              {#each $currentEvent.right as person}
              <div>{person}</div>
              {/each}
            </div>
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

  .character {
    width: 100px;
    height: 130px;
    border-radius: 4px;
    /* border: 1px solid rgba(0, 0, 0, 0.2); */
    box-shadow: -1px -1px 1px #ffd875;
    background: rgba(255, 255, 255, 0.8);
    /* background: linear-gradient(145deg, #ffe090, rgba(255, 255, 255, 0.5) 30px, rgba(255, 255, 255, 0.8) calc(100% - 30px), #ffe090); */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    font-size: 0.8rem;
    font-weight: 700;
  }

  .character-portrait {
    display: flex;
    max-width: 100%;
    flex: 1;
  }

  .character-name-label {
    display: flex;
    flex: 1;
    align-items: center;
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

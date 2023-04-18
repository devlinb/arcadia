<script>
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';

  export let text = '';
  export let character1 = '';
  export let character2 = '';
  export let eventEmoji = '';

  let characters;
  let key;

  // Whenever any either of the characters or if the eventEmoji changes, the key will change
  // which will cause all the divs to redraw which then triggers new animations
  $: {
    key = character1 + eventEmoji + character2;
  }
</script>

<div class="card">
  <div class="story-line-container">
    {text}
  </div>
  <div class="dialogue-container">
    {#key key}
      <div class="characters" out:fly={{ x: 100, delay: 0, duration: 200 }}>
        <div class="character" in:fly={{ x: -100, delay: 300, duration: 500 }}>{character1}</div>
        <div in:fade={{ delay: 600 }} class="speech-bubble">
          {eventEmoji}
        </div>
        {#if character2 && character2 !== ''}
          <div class="character" in:fly={{ x: 100, delay: 300, duration: 500 }}>{character2}</div>
        {/if}
      </div>
    {/key}
  </div>
  <h1 id="card-header">Our story unfolds...</h1>
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
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 700;
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

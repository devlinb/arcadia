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
    key = character1 +  eventEmoji + character2;
  }

</script>

<style>
  .dialogue-container {
    position: relative;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 200px;
    /* justify-content: center;
    align-items: center; */
    max-width: 80%;
    margin: 0 auto;
    overflow: hidden;
    height: 200px;
    max-height: 200px;
  }

  :global(.animate-out) {
    transform: translateX(200%);
    transition: transform .5s;
  }

  .characters {
    display: flex;

    justify-content: center;
    grid-column: 1;
    grid-row: 1;
    height: 100px;
  }

  .character {
    width: 100px;

    border-radius: 50%;
    background-color: #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }

  .speech-bubble {
    margin: 0 10;
    
    border-radius: 5px;
    
    min-width: 100px;
    max-width: 50%;
    text-align: center;
    font-size: 32px;
  }

  .story-line-container {
    max-width: 80em;
  }
</style>
<div>
  <div class="story-line-container">
    {text}
  </div>
  {#key key}
  <div class="dialogue-container">
    <div  class="characters">
      <div  class="character"  in:fly="{{ x: -100, delay: 300, duration: 500 }}"
      >{character1}</div>
      <div
      in:fade="{{delay: 600 }}"
        class="speech-bubble"
      >
        {eventEmoji}
      </div>
      {#if character2 && character2 !== ""}
        <div class="character" in:fly="{{ x: 100, delay: 300, duration: 500 }}">{character2}</div>
      {/if}
    </div>
  </div>
  {/key}
</div>
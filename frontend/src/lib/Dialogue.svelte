<script>
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';

  export let text = '';
  export let character1 = '';
  export let character2 = '';
  export let action = '';


  let characters;
  let key;

  // Whenever any either of the characters of if the action changes, the key will change
  // which will cause all the divs to redraw which then triggers new animations
  $: {
    key = character1 +  action + character2;
  }

</script>

<style>
  .dialogue-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 80%;
    margin: 0 auto;
    overflow: hidden;
  }

  :global(.animate-out) {
    transform: translateX(200%);
    transition: transform .5s;
  }

  .characters {
    display: flex;
    gap: 50px;
    justify-content: center;
  }

  .character {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }

  .speech-bubble {
    margin: 0 auto;
    background-color: #f9f9f9;
    border-radius: 5px;
    padding: 10px;
    min-width: 200px;
    max-width: 50%;
    text-align: center;
  }
</style>
<div>
  {text}
  {#key key}
  <div class="dialogue-container"   out:fly="{{ x: 100, delay: 0 }}">
    <div  class="characters">
      <div in:fly="{{ x: -100, delay: 100 }}" class="character">{character1}</div>
      <div
        transition:fade="{{ delay: 200 }}"
        class="speech-bubble"
      >
        {action}
      </div>
      {#if character2 && character2 !== ""}
        <div in:fly="{{ x: 100, delay: 100 }}" class="character">{character2}</div>
      {/if}
    </div>
  </div>
  {/key}
</div>
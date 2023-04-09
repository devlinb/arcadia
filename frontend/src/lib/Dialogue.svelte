<script>
  import { onMount, afterUpdate } from 'svelte';
  import { fly, fade } from 'svelte/transition';

  export let text = '';
  export let character1 = '';
  export let character2 = '';
  export let action = '';
  export let delay = 3000;

  let characters;

  function animateOut(node) {
    setTimeout(() => {
      node.classList.add('animate-out');
    }, delay);
  }

  onMount(() => {
    animateOut(characters);
  });

  afterUpdate(() => {
    animateOut(characters);
  });
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
    transition: transform 1s;
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

  <div class="dialogue-container">
    
    <div bind:this="{characters}" class="characters" use:animateOut>
      <div in:fly="{{ x: -100, delay: 100 }}" class="character">{character1}</div>
      <div
        transition:fade="{{ delay: 200 }}"
        class="speech-bubble"
      >
        {action}
      </div>
      <div in:fly="{{ x: 100, delay: 100 }}" class="character">{character2}</div>
    </div>
  </div>
</div>
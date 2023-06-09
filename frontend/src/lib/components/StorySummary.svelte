<script lang="ts">
  import { statements, relationshipMap } from '../../stores/story.svelte';
  import { fade } from "svelte/transition";
  import { saveStory } from '../StorySaver';

  let saveStoryPromise: Promise<string>;
  const handleClick = () => {
    setTimeout(() => document.getElementById('recordingTaleId').scrollIntoView(), 0)
    return saveStoryPromise = saveStory(relationshipMap, statements);
  }

  let showCopiedText = false;

  const handleCopyClicked = (storyId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/${storyId}`);
    showCopiedText = true;
    setTimeout(() => showCopiedText = false, 5000);
  }
</script>

<entirestory>
  {#each statements as statement}
  <p>
    {statement.statement}
  </p>
  {/each}
  {#if saveStoryPromise}
    {#await saveStoryPromise}
      <p id='recordingTaleId'>The bards are recording your tale <span class='dot-elastic'/></p>      
    {:then id} 
      <p>To fetch your tale ask for the story id <span class='storyId'>{id}</span></p>
      <div><button on:click={() => handleCopyClicked(id)}>Copy Link To Story</button>
      {#if showCopiedText}
        <span in:fade out:fade>Link copied to clipboard</span>
      {/if}
      </div>
      {:catch error}
      <p>{error}</p>
    {/await}
  {:else}
      <button on:click={handleClick}>Save the tail</button>
  {/if}
</entirestory>

<style>
  .storyId {
    margin-left: 2cw;
    font-size: large;
    font-weight: bold;
  }

/*!
 * three-dots - v0.3.2
 * CSS loading animations made with single element
 * https://nzbin.github.io/three-dots/
 *
 * Copyright (c) 2018 nzbin
 * Released under MIT License
 */
.dot-elastic {
  top: .5ch;
  left: 1em;
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #312300;
  color: #312300;
  animation: dot-elastic 1s infinite linear;
}
.dot-elastic::before, .dot-elastic::after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
}
.dot-elastic::before {
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #312300;
  color: #312300;
  animation: dot-elastic-before 1s infinite linear;
}
.dot-elastic::after {
  left: 30px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #312300;
  color: #312300;
  animation: dot-elastic-after 1s infinite linear;
}

@keyframes dot-elastic-before {
  0% {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(1, 1.5);
  }
  50% {
    transform: scale(1, 0.67);
  }
  75% {
    transform: scale(1, 1);
  }
  100% {
    transform: scale(1, 1);
  }
}
@keyframes dot-elastic {
  0% {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1, 1.5);
  }
  75% {
    transform: scale(1, 1);
  }
  100% {
    transform: scale(1, 1);
  }
}
@keyframes dot-elastic-after {
  0% {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1, 0.67);
  }
  75% {
    transform: scale(1, 1.5);
  }
  100% {
    transform: scale(1, 1);
  }
}
</style>
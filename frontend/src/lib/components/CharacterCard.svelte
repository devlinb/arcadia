<script lang="ts">
  import { namesToCharacterInfo } from '../../stores/story.svelte';
  import { fly } from 'svelte/transition';
  import type { TRelationship } from '../../../../shared/dist';
  import type { TSkinColorStrings } from '../../../../shared/types';
  // This is how Svelte does props!
  export let characters: string[];
  export let flyInFrom: 'left' | 'right';

  // Maps a relationship to the accompanying portrait URL, this will change soon as we will select from a random set
  // of portraits in a future version.
  const characterInfoToUrl = ({relationship, skinColor}: {relationship: TRelationship, skinColor: TSkinColorStrings}): string => {
    
    switch (relationship) {
      case "King": return `/king_${skinColor}.jpg`;
      case "Queen": return `/queen_${skinColor}.jpg`;
      case "Older Daughter": return `/older_princess_${skinColor}.jpg`;
      case "Younger Daughter": return `/young_princess_${skinColor}.jpg`;
      case "Older Son": return `/older_prince_${skinColor}.jpg`;
      case "Younger Son": return `/young_prince_${skinColor}.jpg`;
      case "General": return `/general_${skinColor}.jpg`;
      case "Bishop": return `/bishop_${skinColor}.jpg`;
      case "Advisor": return `/advisor_${skinColor}.jpg`;
      case "King's Brother": return `/kings_brother_${skinColor}.jpg`;
      case "King's Newphew": return `/kings_nephew_${skinColor}.jpg`;
      case "Queen's Brother": return `/queens_brother_${skinColor}.jpg`;
      default:
        return 'none';
    }
  };

  const flyInXVal = flyInFrom === 'left' ? -100 : 100;
</script>

<div class="character" in:fly={{ x: flyInXVal, delay: 300, duration: 500 }}>
  {#each characters as person}
    <div style="display: flex; flex-direction: column;">
      {#if namesToCharacterInfo[person.trim()] && characterInfoToUrl(namesToCharacterInfo[person.trim()]) !== 'none'}
        <img class={characters.length === 3 ? 'hidden' : characters.length === 2 ? 'two-up' : ''} src={characterInfoToUrl(namesToCharacterInfo[person.trim()])} alt="portrait of {person}" />
      {/if}
      <h3>{person.trim()}</h3>
    </div>
  {/each}
</div>

<style>
  .character {
    width: 100px;

    font-size: 0.8rem;
    font-weight: 700;
  }
  .character > div {
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.8);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center top;
    box-shadow: none;
    margin-bottom: 4px;
    overflow: hidden;
  }

  .character > div img {
    box-shadow: -1px -1px 1px #ffd875;
    max-width: 100%;
    object-fit: contain;
    object-position: top;
    background-color: rgba(52, 30, 18, 1);
  }

  .character > div img.two-up {
    height: 62px;
    width: 100px;
  }
  img.hidden {
    display:none;
  }

  .character > div > h3 {
    height: auto;
    color: #ffefc4;
    font-weight: 700;
    font-family: 'Berkshire Swash', cursive;

    background: rgba(0, 0, 0, 0.8);
    padding: 6px 4px;
    margin: 0px;
    font-size: 0.85rem;
    line-height: 100%;
  }
</style>

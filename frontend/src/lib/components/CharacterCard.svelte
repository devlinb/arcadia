<script lang="ts">
  import { relationshipMap } from '../../stores/story.svelte';
  import { fly } from 'svelte/transition';
  import type { TRelationship } from '../../../../shared/dist';
  import kingUrl from '../../assets/king.jpg';
  import advisorUrl from '../../assets/advisor.jpg';
  import queenUrl from '../../assets/queen.jpg'
  import youngPrincessUrl from '../../assets/young_princess.jpg';
  import youngPrinceUrl from '../../assets/young_prince.jpg';
  import olderPrincessUrl from '../../assets/older_princess.jpg';
  import olderPrinceUrl from '../../assets/older_prince.jpg';
  import bishopUrl from '../../assets/bishop.jpg';
  import generalUrl from '../../assets/general.jpg';
  import kingsBrotherUrl from '../../assets/kings_brother.jpg';
  import kingsNephew from '../../assets/kings_nephew.jpg';
  import queensBrother from '../../assets/queens_brother.jpg';

  // This is how Svelte does props!
  export let characters: string[];
  export let flyInFrom: 'left' | 'right';

  // Maps a relationship to the accompanying portrait URL, this will change soon as we will select from a random set
  // of portraits in a future version.
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
      case "King's Brother": return kingsBrotherUrl;
      case "King's Newphew": return kingsNephew;
      case "Queen's Brother": return queensBrother;
      default:
        return 'none';
    }
  };

  const flyInXVal = flyInFrom === 'left' ? -100 : 100;
</script>

<div class="character" in:fly={{ x: flyInXVal, delay: 300, duration: 500 }}>
  {#each characters as person}
    <div class={characters.length === 2 ? 'two-up' : ''} style="background-image: url({relationshipToUrl(relationshipMap[person.trim()])})">
      {#if relationshipMap[person.trim()] && relationshipToUrl(relationshipMap[person.trim()]) !== 'none'}
        <img class={characters.length === 2 ? 'two-up' : ''} src={relationshipToUrl(relationshipMap[person.trim()])} alt="portrait of {person}" />
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
    opacity: 0;
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

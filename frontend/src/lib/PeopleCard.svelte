<script lang="ts">
  import { relationshipMap } from '../stores/story.svelte';
  import { fly, fade } from 'svelte/transition';
  import type { TRelationship } from '../../../shared/dist';
  export let people: string[];
  export let flyInFrom: 'left' | 'right';
  import kingUrl from '../assets/king.jpg';
  import advisorUrl from '../assets/advisor.jpg';
  import queenUrl from '../assets/queen.jpg'
  import youngPrincessUrl from '../assets/young_princess.jpg';
  import youngPrinceUrl from '../assets/young_prince.jpg';
  import olderPrincessUrl from '../assets/older_princess.jpg';
  import olderPrinceUrl from '../assets/older_prince.jpg';
  import bishopUrl from '../assets/bishop.jpg';
  import generalUrl from '../assets/general.jpg';

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

  const flyInXVal = flyInFrom === 'left' ? -100 : 100;
</script>

<div class="character" in:fly={{ x:flyInXVal, delay: 300, duration: 500 }}>
  {#each people as person}
  {#if relationshipMap[person.trim()] && relationshipToUrl(relationshipMap[person.trim()]) !== 'none'}
    <img class={people.length === 2 ? "character-portrait-2-up" : "character-portrait"} src={relationshipToUrl(relationshipMap[person.trim()])} alt="portrait of {person}" />
  {/if}
  <div>{person.trim()}</div>
  {/each}
</div>

<style>
  .character {
    width: 100px;
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
    max-width: 100%;
  }

  .character-portrait-2-up {
    height: 62px;
    width: 100px;
    object-fit: cover;
    object-position: top;
  }
</style>
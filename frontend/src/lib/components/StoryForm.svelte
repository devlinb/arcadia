<script lang="ts">
  import type { TRelationship, TCharacter, TStorySubmission } from '../../../../shared';
  import { namesToCharacterInfo } from '../../stores/story.svelte';
  import { usePregeneratedCharacters, usePregeneratedStory, enableMusicAndSfx } from '../../stores/settings.svelte';
  import Credits from './Credits.svelte';
  import ColorSelector from './ColorSelector.svelte';
  import { getContext } from 'svelte';
  import { oneOf } from 'aimless.js';
  import { generateCharacters } from '../RandomCharacters';
  
  import type { Open, Close, Modal } from 'svelte-simple-modal';
  import githubLogoUrl from '../../assets/github-mark.png';
  const { open, close } = getContext('simple-modal') as { open: Open; close: Close };
  const showCredits = () => open(Credits);

  /**
   * This file collects the kingdom name and the name of all the characters. All characters have a name and a relationship
   * to the ruler, the ruler is the first character in list and is always a king or a queen.
   *
   * We use the "unusedRelationships" set to track what relationships are still available to select.
   */

  export let onsubmit: (characters: TStorySubmission) => void;
  let storyId: string;
  export let handleOnStoryIdSubmit: (storyId: string) => void;

  const skinColorChoices = [
    {value: 'db', color: '#331C16'},
    {value: 'c', color: '#E6B88A'},
    {value: 'mb', color: '#613B21'},
    {value: 'a', color: '#ECC9BD'}];

  const randSkinColor = () => oneOf(skinColorChoices).value;
  const colorLookups = {
    mb: '#613B21',
    db: '#331C16',
    c: '#E6B88A',
    a: '#ECC9BD',
  }

  const relationships: Array<TRelationship> = ['King', 'Older Daughter', 'Younger Daughter', 'Older Son', 'Younger Son', 'General', 'Queen', 'Bishop', 'Advisor', "King's Brother", "Queen's Brother", "King's Newphew"];
  const defaults: Array<TCharacter> = [
    { id: 0, name: 'Henry', relationship: 'King', skinColor: 'c' },
    { id: 1, name: 'Beth', relationship: 'Queen', skinColor: 'c' },
    { id: 2, name: 'Martin', relationship: 'Older Son', skinColor: 'c' },
    { id: 3, name: 'Shiloh', relationship: 'Bishop', skinColor: 'mb' },
    { id: 4, name: 'Gregory', relationship: 'Advisor', skinColor: 'db' },
    { id: 5, name: 'Darleen', relationship: 'Younger Daughter', skinColor: 'c' },
  ];
  let unusedRelationships: Set<TRelationship> = new Set(relationships);
  unusedRelationships.delete('King');
  let characters: Array<TCharacter> = [{ id: 0, name: '', relationship: 'King', skinColor: randSkinColor() }];
  
  let usePregen: boolean = false;

  let kingdom: string = 'Arcadia';
  const handleOnAdd = () => {
    characters.push({ id: characters.length, name: '', relationship: [...unusedRelationships][0], skinColor: randSkinColor() });
    characters = characters;
    unusedRelationships.delete([...unusedRelationships][0]);
    unusedRelationships = unusedRelationships;
  };

  // Keeping this around in case we ever decide we want to re-add variable number of characters.
  // const handleOnRemove = () => {
  //   unusedRelationships.add(characters[characters.length - 1].relationship);
  //   characters.pop();
  //   characters = characters;
  // };

  const handleOnSelectChange = (character: TCharacter, event: Event) => {
    const target = event.target as HTMLSelectElement;
    const relationship = target.value as TRelationship;

    unusedRelationships.add(character.relationship);
    character.relationship = relationship as TRelationship;
    unusedRelationships.delete(relationship);
    unusedRelationships = unusedRelationships;
  };

  const handleOnCharacterSubmit = () => {
    for (const character of characters) {
      
      namesToCharacterInfo[character.name] = { relationship: character.relationship, skinColor: character.skinColor };
    }
    onsubmit({ kingdom, characters });
  };

  const onKeyup = (e) => {
    switch (e.keyCode) {
      case 1:
        break;

      default:
        break;
    }
  };
  window.addEventListener('keyup', onKeyup);

  const storyIdValid = (storyId: string) => {
    
    return !(storyId && storyId.length >= 7 && storyId.length <= 15);
  }
  
  const handleRandomCharacters = (e) => {
    characters = generateCharacters();
    console.log(characters);
  };

  handleOnAdd();
  handleOnAdd();
  handleOnAdd();
  handleOnAdd();
  handleOnAdd();
</script>

<div class="card">
  <div class="credits-group">
    <a href="https://github.com/devlinb/arcadia/">
      <img alt="Github logo indicating link to source code" src={githubLogoUrl} width="16px" height="16px" />
    </a>
    <a href="#top" on:click={showCredits}>Credits</a>
  </div>

  <form class="storyForm" on:submit|preventDefault={handleOnCharacterSubmit}>
    <div style="font-family: 'Berkshire Swash', cursive;">Name the members in the royal house of <input type="text" style="max-width: 100px" maxlength="20" bind:value={kingdom} /></div>
    <button type="button" id="randomCharactersButton" on:click={handleRandomCharacters}>(Random names!)</button>
    {#each characters as character (character.id)}
      <nameentry>
        <input type="text" maxlength="12" bind:value={character.name} placeholder="name" disabled={usePregen} required />
        <select disabled={usePregen} value={character.relationship} on:change={(event) => handleOnSelectChange(character, event)}>
          {#if character.id === 0}
            <option value="King">King</option>
            <option value="Queen">Queen</option>
          {:else}
            {#each relationships as relationship}
              <option value={relationship} hidden={!unusedRelationships.has(relationship)}>{relationship}</option>
            {/each}
          {/if}
        </select>
          <ColorSelector bind:selectedColor={character.skinColor} colors={skinColorChoices}/>
      </nameentry>
    {/each}
    <button type="submit" disabled={characters.length < 5}>
      {#if characters.length < 5}
        At least 5 characters are needed for a story!
      {:else}Make some drama!
      {/if}
    </button>
  </form>
  <div class="playback-controls">
    <form on:submit|preventDefault={() => handleOnStoryIdSubmit(storyId)}>
      <input type="text" id="storyIdInput" bind:value={storyId} minlength="7" maxlength="15" placeholder="story id"/>
      <button type="submit">Load a saved story</button><br/>
    </form>
  </div>
</div>

<style>

  #randomCharactersButton {
    width: auto;
    border: 0;
    font-family: 'Berkshire Swash', cursive;
  }
  .credits-group {
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
  }

  select option:hover {
  background-color: inherit; /* Change to the desired background color or 'transparent' */
  color: inherit; /* Change to the desired text color */
  outline: 5px; /* Remove the outline */
  background: none;
}

select option::selection {
  background-color: inherit; /* Change to the desired background color or 'transparent' */
  color: inherit; /* Change to the desired text color */
  outline: 5px; /* Remove the outline */
}
</style>

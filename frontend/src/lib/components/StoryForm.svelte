<script lang="ts">
  import type { TRelationship, TCharacter, TStorySubmission } from '../../../../shared/dist';
  import { relationshipMap } from '../../stores/story.svelte';
  import { usePregeneratedCharacters, usePregeneratedStory, enableMusicAndSfx } from '../../stores/settings.svelte';
  import Credits from './Credits.svelte';
  import { getContext } from 'svelte';
  import type { Open, Close } from 'svelte-simple-modal';
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
  const relationships: Array<TRelationship> = ['King', 'Older Daughter', 'Younger Daughter', 'Older Son', 'Younger Son', 'General', 'Queen', 'Bishop', 'Advisor', "King's Brother", "Queen's Brother", "King's Newphew"];
  const defaults: Array<TCharacter> = [
    { id: 0, name: 'Henry', relationship: 'King' },
    { id: 1, name: 'Beth', relationship: 'Queen' },
    { id: 2, name: 'Martin', relationship: 'Older Son' },
    { id: 3, name: 'Shiloh', relationship: 'Bishop' },
    { id: 4, name: 'Gregory', relationship: 'Advisor' },
    { id: 5, name: 'Darleen', relationship: 'Younger Daughter' },
  ];
  let unusedRelationships: Set<TRelationship> = new Set(relationships);
  unusedRelationships.delete('King');
  let characters: Array<TCharacter> = [{ id: 0, name: '', relationship: 'King' }];

  let usePregen: boolean = false;

  let kingdom: string = 'Arcadia';
  const handleOnAdd = () => {
    characters.push({ id: characters.length, name: '', relationship: [...unusedRelationships][0] });
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

  const handleOnSubmit = () => {
    for (const character of characters) {
      relationshipMap[character.name] = character.relationship;
    }
    onsubmit({ kingdom, characters });
  };

  const onKeyup = (e) => {
    console.log(e.keyCode);
    switch (e.keyCode) {
      case 1:
        break;

      default:
        break;
    }
  };
  window.addEventListener('keyup', onKeyup);

  const handleOnPregenClicked = (e) => {
    if (e.currentTarget.checked) {
      characters.length = 0;
      for (const p of defaults) {
        characters.push(p);
        kingdom = 'Arcadia';
      }
    }
    characters = characters;
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

  <form class="storyForm" on:submit|preventDefault={handleOnSubmit}>
    <div>Name the members in the royal house of <input type="text" style="max-width: 100px" maxlength="20" bind:value={kingdom} /></div>
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
    <input type="checkbox" bind:checked={$usePregeneratedCharacters} id="pregenCharactersCheckbox" on:click={handleOnPregenClicked} />
    <label for="pregenCharactersCheckbox">Pregen characters</label>
    <input type="checkbox" disabled={!$usePregeneratedCharacters} bind:checked={$usePregeneratedStory} id="pregenStoryCheckbox" />
    <label class={!$usePregeneratedCharacters ? 'disabled' : ''} for="pregenStoryCheckbox">Pregen story</label>
    <input type="checkbox" bind:checked={$enableMusicAndSfx} id="enableMusicAndSfxCheckbox" />
    <label for="enableMusicAndSfxCheckbox">sound</label>
  </div>
</div>

<style>
  .credits-group {
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
  }
</style>

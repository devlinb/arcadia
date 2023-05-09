<script lang="ts">
  import type { TRelationship, TPerson, TStorySubmission } from '../../../shared/dist';
  import { usePregeneratedCharacters, usePregeneratedStory } from '../stores/story.svelte';
  export let onsubmit: (people: TStorySubmission) => void;
  const relationships: Array<TRelationship> = ['King', 'Older Daughter', 'Younger Daughter', 'Older Son', 'Younger Son', 'General', 'Queen', 'Bishop', 'Advisor', "King's Brother", "Queen's Brother", "King's Newphew"];
  const defaults: Array<TPerson> = [
    { id: 0, name: 'Henry', relationship: 'King' },
    { id: 1, name: 'Beth', relationship: 'Queen' },
    { id: 2, name: 'Martin', relationship: 'Older Son' },
    { id: 3, name: 'Shiloh', relationship: 'Bishop' },
    { id: 4, name: 'Gregory', relationship: 'Advisor' },
    { id: 5, name: 'Darleen', relationship: 'Younger Daughter' },
  ];
  let unusedRelationships: Set<TRelationship> = new Set(relationships);
  unusedRelationships.delete('King');
  let people: Array<TPerson> = [{ id: 0, name: '', relationship: 'King' }];

  let screenSize;

  type TStates = 'intro' | 'kingdom' | 'ruler' | 'relatives';
  type TStateMachine = {
    step: TStates;
    relativeCount: number;
  };

  const stateMachine: TStateMachine = {
    step: 'intro',
    relativeCount: 0,
  };

  let usePregen: boolean = false;

  let kingdom: string = 'Arcadia';
  const handleOnAdd = () => {
    people.push({ id: people.length, name: '', relationship: [...unusedRelationships][0] });
    people = people;
    unusedRelationships.delete([...unusedRelationships][0]);
    unusedRelationships = unusedRelationships;
  };

  // Keeping this around in case we ever decide we want to re-add variable number of characters.
  // const handleOnRemove = () => {
  //   unusedRelationships.add(people[people.length - 1].relationship);
  //   people.pop();
  //   people = people;
  // };

  const handleOnSelectChange = (person: TPerson, event: Event) => {
    const target = event.target as HTMLSelectElement;
    const relationship = target.value as TRelationship;

    unusedRelationships.add(person.relationship);
    person.relationship = relationship as TRelationship;
    unusedRelationships.delete(relationship);
    unusedRelationships = unusedRelationships;
  };

  const handleOnSubmit = () => {
    onsubmit({ kingdom, people });
  };

  const handleOnPregenClicked = (e) => {
    if (e.currentTarget.checked) {
      people.length = 0;
      for (const p of defaults) {
        people.push(p);
        kingdom = 'Arcadia';
      }
    }
    people = people;
  };

  const handleNextState = () => {
    switch (stateMachine.step) {
      case 'intro':
        stateMachine.step = 'kingdom';
        break;
      case 'kingdom':
        stateMachine.step = 'ruler';
        break;
      case 'ruler':
        stateMachine.step = 'relatives';
        stateMachine.relativeCount = 1;
        unusedRelationships.delete(people[0].relationship);
        handleOnAdd();
        break;
      case 'relatives':
        stateMachine.relativeCount++;
        handleOnAdd();
        break;
      default:
        break;
    }
  };

  handleOnAdd();
  handleOnAdd();
  handleOnAdd();
  handleOnAdd();
  handleOnAdd();
</script>

<svelte:window bind:innerWidth={screenSize} />
<!-- mobile -->
{#if screenSize < 500}
  <form on:submit|preventDefault={handleOnSubmit}>
    {#if stateMachine.step === 'intro'}
      <div>
        Long ago a royal family, your family, fought over the fate of a kingdom, and now it is time that history be at last written down.
        <br /><br />
        <!-- But first, credit where credit is due:<br/>
    Music is courtesy of "Death of Kings" Kevin MacLeod (incompetech.com)<br/>
    and is licensed under Creative Commons: By Attribution 4.0 License<br/>
    <a href="http://creativecommons.org/licenses/by/4.0/">http://creativecommons.org/licenses/by/4.0/</a><br/><br/>

    This website is powered by Svelte, and the background panographic is from <a href="https://www.blockadelabs.com/">Blockade Labs</a> -->
      </div>

      <button on:click={handleNextState}>Continue Forward</button>
    {:else if stateMachine.step === 'kingdom'}
      <div><label>What is the name of the Kingdom for which the aristocracy fights?<br /> <input type="text" bind:value={kingdom} disabled={usePregen} /></label></div>
      <button on:click={handleNextState}>Continue Forward</button>
    {:else if stateMachine.step === 'ruler'}
      Who is the ruler of {kingdom}?
      <div>
        <input type="text" maxlength="12" bind:value={people[0].name} placeholder="name" required />
        <select value={people[0].relationship} on:change={(event) => handleOnSelectChange(people[0], event)}>
          <option value="King">King</option>
          <option value="Queen">Queen</option>
        </select>
      </div>
      <button on:click={handleNextState} disabled={people[0].name.length < 1}>Continue Forward</button>
    {:else}
      <div>
        Name the other members of the royal house
        <input type="text" maxlength="12" bind:value={people[stateMachine.relativeCount].name} placeholder="name" required />

        <select value={people[stateMachine.relativeCount].relationship} on:change={(event) => handleOnSelectChange(people[stateMachine.relativeCount], event)}>
          {#each relationships as relationship}
            <option value={relationship} hidden={!unusedRelationships.has(relationship)}>{relationship}</option>
          {/each}
        </select>
        <button on:click={handleNextState} disabled={people[stateMachine.relativeCount].name.length < 1}>Continue Forward</button>
      </div>
      <button type="submit" disabled={people.length < 5}>
        {#if people.length < 5}
          Name at 6 members of the royal house
        {:else}Make some drama!
        {/if}
      </button>
    {/if}
  </form>

  <!-- Desktop/Tablet -->
{:else}
  <devcontrols>
    <input type="checkbox" bind:checked={$usePregeneratedCharacters} id="pregenCharactersCheckbox" on:click={handleOnPregenClicked} />
    <label for="pregenCharactersCheckbox">Pregenerated characters?</label>
    <input type="checkbox" disabled={!$usePregeneratedCharacters} bind:checked={$usePregeneratedStory} id="pregenStoryCheckbox" />
    <label for="pregenStoryCheckbox">Pregenerated story?</label>
  </devcontrols>
  <form on:submit|preventDefault={handleOnSubmit}>
    <p />
    <p />
    <div>Name the members in the royal house of <input type ="text" style="max-width: 100px" maxlength="20" bind:value={kingdom}/></div>
    <p />

    {#each people as person (person.id)}
      <div>
        <input type="text" maxlength="12" bind:value={person.name} placeholder="name" disabled={usePregen} required />
        <select disabled={usePregen} value={person.relationship} on:change={(event) => handleOnSelectChange(person, event)}>
        {#if person.id === 0}
            <option value="King">King</option>
            <option value="Queen">Queen</option>
          {:else}
            {#each relationships as relationship}
            <option value={relationship} hidden={!unusedRelationships.has(relationship)}>{relationship}</option>
            {/each}
          {/if}
        </select>
      </div>
    {/each}
    <button type="submit" disabled={people.length < 5}>
      {#if people.length < 5}
        At least 5 characters are needed for a story!
      {:else}Make some drama!
      {/if}
    </button>
  </form>
{/if}

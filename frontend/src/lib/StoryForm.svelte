<script lang="ts">
  import type { TRelationship, TPerson, TStorySubmission } from '../../../shared/dist';
  import { usePregeneratedCharacters, usePregeneratedStory, relationshipMap } from '../stores/story.svelte';
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
    for (const person of people) {
      relationshipMap[person.name] = person.relationship;
    }
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

  <!-- Desktop/Tablet -->
  <devcontrols>
    <input type="checkbox" bind:checked={$usePregeneratedCharacters} id="pregenCharactersCheckbox" on:click={handleOnPregenClicked} />
    <label for="pregenCharactersCheckbox">Pregenerated characters?</label>
    <input type="checkbox" disabled={!$usePregeneratedCharacters} bind:checked={$usePregeneratedStory} id="pregenStoryCheckbox" />
    <label for="pregenStoryCheckbox">Pregenerated story?</label>
  </devcontrols>
  <form class="storyForm" on:submit|preventDefault={handleOnSubmit}>
    <div>Name the members in the royal house of <input type ="text" style="max-width: 100px" maxlength="20" bind:value={kingdom}/></div>
    {#each people as person (person.id)}
      <nameentry>
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
      </nameentry>
    {/each}
    <button type="submit" disabled={people.length < 5}>
      {#if people.length < 5}
        At least 5 characters are needed for a story!
      {:else}Make some drama!
      {/if}
    </button>
  </form>
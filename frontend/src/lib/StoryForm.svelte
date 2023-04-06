<script lang="ts">
  import type { TRelationship, TPerson, TStorySubmission } from '../../../shared/dist';
  export let onsubmit: (people: TStorySubmission) => void;
  const relationships: Array<TRelationship> = ["King", "Queen", "Older Daughter", "Younger Daughter", 
  "Older Son", "Younger Son", "General", "Bishop", "Advisor", "King's Brother" , 
  "Queen's Brother", "King's Newphew"];
  const defaults = [
        {id:0, name:"Henry", relationship: "King"},
        {id:1, name:"Beth", relationship: "Queen"},
        {id:2, name:"Martin", relationship: "Older Son"},
        {id:3, name:"Shiloh", relationship: "Bishop"},
        {id:4, name:"Gregory", relationship: "Advisor"},
        {id:5, name:"Darleen", relationship: "Younger Daughter"}];
  let unusedRelationships: Set<TRelationship> = new Set(relationships);
  let people: Array<TPerson> = [{id: 0, name: '', relationship: 'King'}];
  unusedRelationships.delete('King');

  let kingdom: string = 'Arcadia';
  const handleOnAdd = () => {
    people.push({id: people.length, name:'', relationship: [...unusedRelationships][0]});
    people = people;
    unusedRelationships.delete([...unusedRelationships][0]);
    unusedRelationships = unusedRelationships;
  };

  const handleOnRemove = () => {
    unusedRelationships.add(people[people.length -1].relationship);
    people.pop();
    people = people;
  }

  const handleOnSelectChange = (person: TPerson, event: Event ) => {
    const target = event.target as HTMLSelectElement;
    const relationship = target.value as TRelationship;

    unusedRelationships.add(person.relationship);
    person.relationship = relationship as TRelationship;
    unusedRelationships.delete(relationship);
    unusedRelationships = unusedRelationships;
  };

  const handleOnSubmit = () => {
    onsubmit({kingdom, people});
  }

</script>

<form on:submit|preventDefault={handleOnSubmit}>
  <div><label>What is the name of the Kingdom for which the aristrocacy fights?<br/> <input type="text" bind:value={kingdom}></label></div>
  <p/>
  <p/>
  Please name the important People in the Kingdom of {kingdom}
  <p/>
  <button on:click={handleOnAdd} disabled={people.length >= 6}>Add Person</button>
  <button on:click={handleOnRemove} disabled={people.length === 1}>Remove Person</button>
  
  
  {#each people as person (person.id)}
    <div>
      <input type="text" maxlength="12" bind:value={person.name} placeholder="name"  required>
      <select disabled={person.id === 0} value={person.relationship} on:change={(event) => handleOnSelectChange(person, event)}>
        {#each relationships as relationship}
          <option value={relationship} hidden={!unusedRelationships.has(relationship)}>{relationship}</option>
        {/each}
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


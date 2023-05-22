<script lang="ts">
  import { statements } from '../../stores/story.svelte';
</script>

<entirestory>
  {#each statements as statement}
  <p>
    {statement.statement}
  </p>
  {/each}
  <button on:click={() => location.reload()}>Start Over</button>
</entirestory>

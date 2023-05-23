<script lang="ts" context="module">
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const usePregeneratedCharacters: Writable<boolean> = writable(false);
export const usePregeneratedStory: Writable<boolean> = writable(false);
export const enableMusicAndSfx: Writable<boolean> = writable(true);
</script>
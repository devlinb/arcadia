<script>
  import { storyState } from '../../stores/story.svelte';
  import { enableMusicAndSfx } from '../../stores/settings.svelte';
	import midnightTaleUrl from '../../assets/midnight-tale.mp3';
	const audio = new Audio(midnightTaleUrl);

  audio.loop = true;

  $: {
    if ($enableMusicAndSfx) {
      if($storyState === 'READY' || $storyState === 'LOADING') {
        if (audio.paused) {
          audio.play();
        }
      } else if($storyState === 'USER_INPUT') {
        if (!audio.paused)
        audio.pause();
      }
    }
  }
</script>
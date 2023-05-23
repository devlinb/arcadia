<script lang='ts'>
  import { storyState, currentEvent } from '../../stores/story.svelte';
  import { enableMusicAndSfx } from '../../stores/settings.svelte';
	import arrowSoundUrl from '../../assets/arrow.mp3';
  import coughSoundUrl from '../../assets/cough.mp3';
  import swordSoundUrl from '../../assets/sword01.mp3';
  import stabSoundUrl from '../../assets/stab.mp3';
  import thinkingSoundUrl01 from '../../assets/thinking01.mp3';
  import thinkingSoundUrl02 from '../../assets/thinking02.mp3';
  import { intRange } from 'aimless.js';
  
	const audio = new Audio();

  $: {
    if ($currentEvent && $currentEvent.eventEmoji) {
      switch ($currentEvent.eventEmoji) {
        case '🏹': {
          changeAndPlayAudio(arrowSoundUrl);
          break;
        }
        case '🤒': {
          changeAndPlayAudio(coughSoundUrl);
          break;
        }
        case '⚔️': {
          changeAndPlayAudio(swordSoundUrl);
          break;
        }
        case '🗡️': {
          changeAndPlayAudio(stabSoundUrl);
          break;
        }
        case '🤔': {
          changeAndPlayAudio(randomThinking());
          break;
        }
        default: break;
      }
    }
  }

  const changeAndPlayAudio = (audioSrcUrl: string) => {
    audio.pause();
    audio.src = audioSrcUrl;
    audio.load();
    audio.play();
  }

  const randomThinking = (): string => {
    switch (intRange(1,2)) {
      case 1: return thinkingSoundUrl01;
      case 2: return thinkingSoundUrl02;
      default: return thinkingSoundUrl01;
    }
  }

</script>

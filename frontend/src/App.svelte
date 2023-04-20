<script lang="ts">
  import Characters from './lib/StoryForm.svelte';
  import { fetchStory } from './lib/StoryFetcher';
  import { setStory, playStory } from './stores/story';
  import { parseOutEvents, parsePeopleFromEvents, type TStatementPeP } from './lib/StoryParser';
  import type { TStatementEvent } from './lib/StoryParser';
  import type { TRelationship, TPerson, TStorySubmission } from '../../shared';
  import townSnowUrl from '../src/assets/town_square_snow.jpg';
  import townDayUrl from '../src/assets/town_square_day.jpg';
  import townDuskUrl from '../src/assets/town_square_dusk.jpg';

  import 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
  // @ts-ignore
  const viewer = pannellum.viewer('panorama', {
    default: {
      firstScene: 'day',
      sceneFadeDuration: 1000,
    },
    scenes: {
      snow: {
        type: 'equirectangular',
        panorama: townSnowUrl,
        autoLoad: true,
        autoRotate: true,
      },
      day: {
        type: 'equirectangular',
        panorama: townDayUrl,
        autoLoad: true,
        autoRotate: true,
      },
      dusk: {
        type: 'equirectangular',
        panorama: townDuskUrl,
        autoLoad: true,
        autoRotate: true,
      },
    },
  });

  import Dialogue from './lib/Dialogue.svelte';

  let story = '';
  let events: Array<TStatementEvent> = [];
  let submitted = false;

  let currentStatement = 0;

  // Contains an array of statements, and split up characters and emojis that go with each statement.
  let statementPePs: Array<TStatementPeP> = [];

  const handleCharacterSubmit = async (submission: TStorySubmission) => {
    submitted = true;
    story = await fetchStory(submission);
    events = parseOutEvents(story);
    statementPePs = parsePeopleFromEvents(events);
    setStory(statementPePs);
    playStory();

    // @ts-ignore
    viewer.loadScene('snow');
  };
</script>

<main>
  <border>
    <content>
      {#if !submitted}
        <div class="card">
          <Characters onsubmit={handleCharacterSubmit} />
        </div>
      {/if}

      {#if events.length !== 0}
        <!-- Problem! Dialog animations don't kick off after loop increments, because we are using onmount in the component -->
        <Dialogue/>
      {/if}
    </content>
  </border>
</main>

<style>
</style>

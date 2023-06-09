import type { TSavedStory } from '../../../shared';

export const fetchSavedStory = async (storyId: string) => {
  const url = new URL(`${import.meta.env.VITE_API_SERVER}${import.meta.env.VITE_GET_STORY_ENDPOINT}${storyId}`);
  const resp = await fetch(url);
  if (resp.status === 200) {
    const story = await resp.json() as TSavedStory;
    return story;
  } else {
    throw 'Could not load the story';
  }
}

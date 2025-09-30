import type { TSavedStory } from '../../../shared';

export const fetchSavedStory = async (storyId: string) => {
  const basePath = import.meta.env.VITE_BASE_PATH || '/';
  const normalizedBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  const url = `${normalizedBase}/getstory/${storyId}`;
  const resp = await fetch(url);
  if (resp.status === 200) {
    const story = await resp.json() as TSavedStory;
    return story;
  } else {
    throw 'Could not load the story';
  }
}

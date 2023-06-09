import { statements } from '../stores/story.svelte';
import type { TNamesToRelationship, TStatementCeC } from '../../../shared';

export const saveStory = async (relationships: TNamesToRelationship, statements: TStatementCeC[]): Promise<string> => {
  console.log(`saving: ${JSON.stringify({relationships, statements})}`);
  const url = new URL(`${import.meta.env.VITE_API_SERVER}${import.meta.env.VITE_SAVE_STORY_ENDPOINT}`);
  const resp = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({relationships, statements})
  });

  const respJson = await resp.json();
  if (respJson.status === 'SUCCESS') {
    return respJson.id as string;
  } else {
    throw `The bards were unable to record tonight's story`;
  }
}
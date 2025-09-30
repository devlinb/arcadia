import { statements } from '../stores/story.svelte';
import type { TNamesToCharacterInfo, TNamesToRelationship, TStatementCeC } from '../../../shared';

export const saveStory = async (characterInfo: TNamesToCharacterInfo, statements: TStatementCeC[]): Promise<string> => {
  const basePath = import.meta.env.VITE_BASE_PATH || '/';
  const normalizedBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  const url = `${normalizedBase}/savestory`;
  const resp = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({characterInfo, statements})
  });

  const respJson = await resp.json();
  if (respJson.status === 'SUCCESS') {
    return respJson.id as string;
  } else {
    throw `The bards were unable to record tonight's story`;
  }
}
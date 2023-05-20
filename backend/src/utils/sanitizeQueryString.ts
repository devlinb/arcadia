import { UrlWithParsedQuery } from 'url';
import { TCharacter, TStorySubmission } from '../shared/dist';

// Never trust user input! This function truncates the Kingdom name to 20 and character
// names to 12.
export const sanitizeQueryString = (
  parsedUrl: UrlWithParsedQuery
): TStorySubmission => {
  const kingdomFull = parsedUrl.query.kingdom as string;
  const kingdom =
    kingdomFull.length > 20 ? kingdomFull.substring(0, 20) : kingdomFull;
  const characters: Array<TCharacter> = JSON.parse(
    parsedUrl.query.characters as string
  );

  // truncate all character names to length 12.
  characters.forEach(
    (character, i) =>
      (characters[i].name =
        character.name.length > 12
          ? character.name.substring(0, 12)
          : character.name)
  );

  const submission: TStorySubmission = {
    kingdom,
    characters,
  };
  return submission;
}

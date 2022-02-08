import removeDiacritics from './removeDiacritics';
import { words } from './words';

export default function getValidWord(entry: string): string | undefined {
  return words.find(word => removeDiacritics(word) === removeDiacritics(entry));
}

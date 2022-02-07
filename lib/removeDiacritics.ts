export default function removeDiacritics(word: string): string {
  return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

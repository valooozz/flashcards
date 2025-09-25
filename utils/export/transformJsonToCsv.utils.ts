import { DeckDocument } from '../../types/DeckDocument';

export const transformJsonToCsv = (deckDocument: DeckDocument): string => {
  const headers = [
    'recto',
    'verso',
  ];

  const escapeCsvValue = (value: unknown): string => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    if (/[",\n\r]/.test(stringValue)) {
      return '"' + stringValue.replace(/"/g, '""') + '"';
    }
    return stringValue;
  };

  const lines: string[] = [];
  lines.push(headers.join(','));

  deckDocument.cards.forEach((card) => {
    const row = [
      escapeCsvValue(card.recto),
      escapeCsvValue(card.verso),
    ];
    lines.push(row.join(','));
  });

  return lines.join('\n');
};


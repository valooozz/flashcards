import { transformJsonToCsv } from '../export/transformJsonToCsv.utils';
import { DeckDocument } from '../../types/DeckDocument';

describe('transformJsonToCsv', () => {
    it('outputs only headers when there are no cards', () => {
        const doc: DeckDocument = { deckName: 'Empty', cards: [] };
        const csv = transformJsonToCsv(doc);
        expect(csv).toBe('recto,verso');
    });

    it('serializes a simple list of cards', () => {
        const doc: DeckDocument = {
            deckName: 'Basics',
            cards: [
                { recto: 'Hello', verso: 'Bonjour' },
                { recto: 'Yes', verso: 'Oui' },
            ],
        };
        const csv = transformJsonToCsv(doc);
        expect(csv).toBe(['recto,verso', 'Hello,Bonjour', 'Yes,Oui'].join('\n'));
    });

    it('escapes quotes by doubling them and wraps the field in quotes', () => {
        const doc: DeckDocument = {
            deckName: 'Quotes',
            cards: [
                { recto: 'He said "Hi"', verso: 'Test' },
            ],
        };
        const csv = transformJsonToCsv(doc);
        expect(csv).toBe('recto,verso\n"He said ""Hi""",Test');
    });

    it('wraps fields containing commas or newlines in quotes', () => {
        const doc: DeckDocument = {
            deckName: 'Specials',
            cards: [
                { recto: 'a,b', verso: 'x' },
                { recto: 'line1\nline2', verso: 'y' },
                { recto: 'carriage\rreturn', verso: 'z' },
            ],
        };
        const csv = transformJsonToCsv(doc);
        expect(csv).toBe([
            'recto,verso',
            '"a,b",x',
            '"line1\nline2",y',
            '"carriage\rreturn",z',
        ].join('\n'));
    });

    it('converts null and undefined to empty strings', () => {
        const doc: DeckDocument = {
            deckName: 'Nullable',
            cards: [
                { recto: null, verso: undefined },
            ],
        };
        const csv = transformJsonToCsv(doc);
        expect(csv).toBe('recto,verso\n,');
    });
});



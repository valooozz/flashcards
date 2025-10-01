import { DeckDocument } from '../../types/DeckDocument';
import { transformJsonToCsv } from '../export/transformJsonToCsv.utils';

describe('transformJsonToCsv', () => {
    it('returns an empty string when there are no cards', () => {
        const doc: DeckDocument = { deckName: 'Empty', cards: [], changeSide: true };
        const csv = transformJsonToCsv(doc);
        expect(csv).toBe('');
    });

    it('serializes a simple list of cards', () => {
        const doc: DeckDocument = {
            deckName: 'Basics',
            cards: [
                { recto: 'Hello', verso: 'Bonjour' },
                { recto: 'Yes', verso: 'Oui' },
            ],
            changeSide: true,
        };
        const csv = transformJsonToCsv(doc);
        expect(csv).toBe(['Hello,Bonjour,,', 'Yes,Oui,,'].join('\n'));
    });

    it('escapes quotes by doubling them and wraps the field in quotes', () => {
        const doc: DeckDocument = {
            deckName: 'Quotes',
            cards: [
                { recto: 'He said "Hi"', verso: 'Test' },
            ],
            changeSide: false,
        };
        const csv = transformJsonToCsv(doc);
        expect(csv).toBe('"He said ""Hi""",Test,,');
    });

    it('wraps fields containing commas or newlines in quotes', () => {
        const doc: DeckDocument = {
            deckName: 'Specials',
            cards: [
                { recto: 'a,b', verso: 'x' },
                { recto: 'line1\nline2', verso: 'y' },
                { recto: 'carriage\rreturn', verso: 'z' },
            ],
            changeSide: false,
        };
        const csv = transformJsonToCsv(doc);
        expect(csv).toBe([
            '"a,b",x,,',
            '"line1\nline2",y,,',
            '"carriage\rreturn",z,,',
        ].join('\n'));
    });

    it('converts null and undefined to empty strings', () => {
        const doc: DeckDocument = {
            deckName: 'Nullable',
            cards: [
                { recto: null, verso: undefined },
            ],
            changeSide: true,
        };
        const csv = transformJsonToCsv(doc);
        expect(csv).toBe(',,,');
    });
});



import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { zip } from 'react-native-zip-archive';
import { DeckDocument } from '../../types/DeckDocument';
import { getCardsFromDeck } from '../database/card/get/getCardsFromDeck.utils';
import { getAllDecks } from '../database/deck/get/getAllDecks.utils';

const getExtension = (path: string): string => {
    const m = /\.([a-zA-Z0-9]+)$/.exec(path || '');
    return (m?.[1] || 'jpg').toLowerCase();
};

export const exportAllDecksBundle = async (database: any): Promise<void> => {
    const decks = await getAllDecks(database);
    const baseDir = `${FileSystem.cacheDirectory}flipo_bundle_${Date.now()}/`;
    await FileSystem.makeDirectoryAsync(baseDir, { intermediates: true });
    const imagesDir = `${baseDir}images/`;
    await FileSystem.makeDirectoryAsync(imagesDir, { intermediates: true });

    const allDecksDocument: DeckDocument[] = [];

    for (const deck of decks) {
        const deckDocument: DeckDocument = {
            deckName: deck.name,
            changeSide: Boolean(deck.changeSide),
            showName: Boolean(deck.showName),
            cards: [],
        };

        const cards = await getCardsFromDeck(database, deck.id, true);
        let index = 0;
        for (const card of cards) {
            let rectoRel: string = null;
            let versoRel: string = null;

            if (card.rectoImage) {
                const ext = getExtension(card.rectoImage);
                const rel = `deck_${deck.id}_card_${index}_recto.${ext}`;
                await FileSystem.copyAsync({ from: card.rectoImage, to: imagesDir + rel });
                rectoRel = `images/${rel}`;
            }
            if (card.versoImage) {
                const ext = getExtension(card.versoImage);
                const rel = `deck_${deck.id}_card_${index}_verso.${ext}`;
                await FileSystem.copyAsync({ from: card.versoImage, to: imagesDir + rel });
                versoRel = `images/${rel}`;
            }

            deckDocument.cards.push({
                recto: card.recto,
                verso: card.verso,
                rectoImage: rectoRel,
                versoImage: versoRel,
                rectoFirst: Boolean(card.rectoFirst),
                step: card.step,
                nextRevision: card.nextRevision,
                toLearn: Boolean(card.toLearn),
                changeSide: card.changeSide === null ? null : Boolean(card.changeSide),
            });
            index += 1;
        }

        allDecksDocument.push(deckDocument);
    }

    const jsonPath = `${baseDir}deck.json`;
    await FileSystem.writeAsStringAsync(jsonPath, JSON.stringify(allDecksDocument));

    const zipDest = `${FileSystem.cacheDirectory}FlipoBackup.flipo`;
    const zippedPath = await zip(baseDir, zipDest);
    await Sharing.shareAsync(zippedPath);
};



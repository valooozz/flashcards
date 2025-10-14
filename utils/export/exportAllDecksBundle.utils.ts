import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import JSZip from 'jszip';
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
    const filesToZip: Array<{ rel: string; abs: string }> = [];

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
                filesToZip.push({ rel: rectoRel, abs: imagesDir + rel });
            }
            if (card.versoImage) {
                const ext = getExtension(card.versoImage);
                const rel = `deck_${deck.id}_card_${index}_verso.${ext}`;
                await FileSystem.copyAsync({ from: card.versoImage, to: imagesDir + rel });
                versoRel = `images/${rel}`;
                filesToZip.push({ rel: versoRel, abs: imagesDir + rel });
            }

            deckDocument.cards.push({
                recto: card.recto,
                verso: card.verso,
                ...(rectoRel ? { rectoImage: rectoRel } : {}),
                ...(versoRel ? { versoImage: versoRel } : {}),
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
    filesToZip.push({ rel: 'deck.json', abs: jsonPath });

    const zipDest = `${FileSystem.cacheDirectory}FlipoBackup.flipo`;
    // Build zip in-memory
    const zip = new JSZip();
    for (const f of filesToZip) {
        const base64Data = await FileSystem.readAsStringAsync(f.abs, { encoding: FileSystem.EncodingType.Base64 });
        zip.file(f.rel, base64Data, { base64: true });
    }
    const zipBase64 = await zip.generateAsync({ type: 'base64' });
    await FileSystem.writeAsStringAsync(zipDest, zipBase64, { encoding: FileSystem.EncodingType.Base64 });
    await Sharing.shareAsync(zipDest);
};

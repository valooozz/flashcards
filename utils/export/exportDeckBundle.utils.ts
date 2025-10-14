import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import JSZip from 'jszip';
import { DeckDocument } from '../../types/DeckDocument';
import { getCardsFromDeck } from '../database/card/get/getCardsFromDeck.utils';

const getExtension = (path: string): string => {
    const m = /\.([a-zA-Z0-9]+)$/.exec(path || '');
    return (m?.[1] || 'jpg').toLowerCase();
};

export const exportDeckBundle = async (
    database: any,
    idDeck: string,
    deckName: string,
    changeSide: boolean,
    showName: boolean,
): Promise<void> => {

    const cards = await getCardsFromDeck(database, Number(idDeck), true);

    const deckDocument: DeckDocument = {
        deckName,
        changeSide,
        showName,
        cards: [],
    };

    const safeDeck = deckName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const baseDir = `${FileSystem.cacheDirectory}flipo_bundle_${Date.now()}_${safeDeck}/`;
    const imagesDir = `${baseDir}images/`;

    await FileSystem.makeDirectoryAsync(imagesDir, { intermediates: true });

    let index = 0;
    const filesToZip: Array<{ rel: string; abs: string }> = [];
    for (const card of cards) {
        let rectoRel: string = null;
        let versoRel: string = null;

        if (card.rectoImage) {
            const ext = getExtension(card.rectoImage);
            const rel = `card_${index}_recto.${ext}`;
            await FileSystem.copyAsync({ from: card.rectoImage, to: imagesDir + rel });
            rectoRel = `images/${rel}`;
            filesToZip.push({ rel: rectoRel, abs: imagesDir + rel });
        }
        if (card.versoImage) {
            const ext = getExtension(card.versoImage);
            const rel = `card_${index}_verso.${ext}`;
            await FileSystem.copyAsync({ from: card.versoImage, to: imagesDir + rel });
            versoRel = `images/${rel}`;
            filesToZip.push({ rel: versoRel, abs: imagesDir + rel });
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

    // Write JSON
    const jsonPath = `${baseDir}deck.json`;
    await FileSystem.writeAsStringAsync(jsonPath, JSON.stringify([deckDocument]));
    filesToZip.push({ rel: 'deck.json', abs: jsonPath });

    // Build zip in-memory with JSZip
    const zipDest = `${FileSystem.cacheDirectory}${safeDeck}.flipo`;
    try {
        const zip = new JSZip();
        for (const f of filesToZip) {
            // Read as base64 and add to zip keeping folder structure
            const base64Data = await FileSystem.readAsStringAsync(f.abs, { encoding: FileSystem.EncodingType.Base64 });
            zip.file(f.rel, base64Data, { base64: true });
        }
        const zipBase64 = await zip.generateAsync({ type: 'base64' });
        await FileSystem.writeAsStringAsync(zipDest, zipBase64, { encoding: FileSystem.EncodingType.Base64 });
        await Sharing.shareAsync(zipDest);
    } catch (error) {
        console.error('Zip/share error', error);
        throw error;
    }
};



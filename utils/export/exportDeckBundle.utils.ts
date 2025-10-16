import { Directory, File, Paths } from 'expo-file-system';
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
    showName: boolean
): Promise<void> => {
    const cards = await getCardsFromDeck(database, Number(idDeck), true);

    const deckDocument: DeckDocument = {
        deckName,
        changeSide,
        showName,
        cards: [],
    };

    const safeDeck = deckName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const baseDir = new Directory(Paths.cache, `flipo_bundle_${Date.now()}_${safeDeck}`);
    baseDir.create({ intermediates: true });

    const imagesDir = baseDir.createDirectory('images');

    let index = 0;
    const filesToZip: Array<{ rel: string; abs: string }> = [];

    for (const card of cards) {
        let rectoRel: string = null;
        let versoRel: string = null;

        if (card.rectoImage) {
            const ext = getExtension(card.rectoImage);
            const rel = `card_${index}_recto.${ext}`;
            const destFile = imagesDir.createFile(rel, null);
            const sourceFile = new File(card.rectoImage);
            const data = await sourceFile.base64();
            await destFile.write(data);
            rectoRel = `images/${rel}`;
            filesToZip.push({ rel: rectoRel, abs: destFile.uri });
        }

        if (card.versoImage) {
            const ext = getExtension(card.versoImage);
            const rel = `card_${index}_verso.${ext}`;
            const destFile = imagesDir.createFile(rel, null);
            const sourceFile = new File(card.versoImage);
            const data = await sourceFile.base64();
            await destFile.write(data);
            versoRel = `images/${rel}`;
            filesToZip.push({ rel: versoRel, abs: destFile.uri });
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

    // Création du fichier deck.json
    const jsonFile = baseDir.createFile('deck.json', 'application/json');
    await jsonFile.write(JSON.stringify([deckDocument]));
    filesToZip.push({ rel: 'deck.json', abs: jsonFile.uri });

    // Construction de l’archive ZIP
    try {
        const zip = new JSZip();

        for (const f of filesToZip) {
            const file = new File(f.abs);
            const base64Data = await file.base64();
            zip.file(f.rel, base64Data, { base64: true });
        }

        const zipBase64 = await zip.generateAsync({ type: 'base64' });
        const zipFile = new File(Paths.cache, `${safeDeck}.flipo`);
        await zipFile.write(zipBase64);

        await Sharing.shareAsync(zipFile.uri);
    } catch (error) {
        console.error('Zip/share error', error);
        throw error;
    }
};

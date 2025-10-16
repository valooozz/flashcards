import { Directory, File, Paths } from 'expo-file-system';
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

    // Crée le répertoire de base dans le cache
    const baseDir = new Directory(Paths.cache, `flipo_bundle_${Date.now()}`);
    baseDir.create({ intermediates: true });

    // Dossier images
    const imagesDir = baseDir.createDirectory('images');

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

            // Copie des images recto
            if (card.rectoImage) {
                const ext = getExtension(card.rectoImage);
                const rel = `deck_${deck.id}_card_${index}_recto.${ext}`;
                const destFile = imagesDir.createFile(rel, null);
                const sourceFile = new File(card.rectoImage);
                const data = await sourceFile.base64();
                await destFile.write(data);
                rectoRel = `images/${rel}`;
                filesToZip.push({ rel: rectoRel, abs: destFile.uri });
            }

            // Copie des images verso
            if (card.versoImage) {
                const ext = getExtension(card.versoImage);
                const rel = `deck_${deck.id}_card_${index}_verso.${ext}`;
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

        allDecksDocument.push(deckDocument);
    }

    // Création du fichier deck.json
    const jsonFile = baseDir.createFile('deck.json', 'application/json');
    await jsonFile.write(JSON.stringify(allDecksDocument));
    filesToZip.push({ rel: 'deck.json', abs: jsonFile.uri });

    // Construction de l’archive ZIP
    const zip = new JSZip();
    for (const f of filesToZip) {
        const file = new File(f.abs);
        const base64Data = await file.base64();
        zip.file(f.rel, base64Data, { base64: true });
    }

    const zipBase64 = await zip.generateAsync({ type: 'base64' });

    const zipFile = new File(Paths.cache, 'FlipoBackup.flipo');
    await zipFile.write(zipBase64);

    // Partage du fichier ZIP
    await Sharing.shareAsync(zipFile.uri);
};

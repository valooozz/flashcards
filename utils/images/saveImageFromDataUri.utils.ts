import { Directory, File, Paths } from 'expo-file-system';

const mimeToExtension: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/heic': 'heic',
};

// Vérifie qu'un répertoire existe et le crée si nécessaire
export const ensureDirExists = async (dirPath: string) => {
    const dir = new Directory(dirPath);
    if (!dir.exists) {
        await dir.create({ intermediates: true });
    }
};

// Sauvegarde une image à partir d'un data URI
export const saveImageFromDataUri = async (
    dataUri: string,
    deckName: string,
    fileBaseName: string,
): Promise<string> => {
    const match = /^data:(.*?);base64,(.*)$/.exec(dataUri);
    if (!match) {
        // Pas un data URI, on renvoie tel quel
        return dataUri;
    }

    const mime = match[1] || 'image/jpeg';
    const base64 = match[2];
    const ext = mimeToExtension[mime] ?? 'jpg';

    const safeDeck = deckName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const dirPath = `${Paths.document.uri}flipo_images/${safeDeck}/`;
    await ensureDirExists(dirPath);

    const file = new File(dirPath, `${fileBaseName}.${ext}`);
    await file.write(base64, { encoding: 'base64' });

    return file.uri;
};

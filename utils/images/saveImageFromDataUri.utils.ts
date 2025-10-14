import * as FileSystem from 'expo-file-system';

const mimeToExtension: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/heic': 'heic',
};

export const ensureDirExists = async (dir: string) => {
    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) {
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
};

export const saveImageFromDataUri = async (
    dataUri: string,
    deckName: string,
    fileBaseName: string,
): Promise<string> => {
    // data:[mime];base64,<data>
    const match = /^data:(.*?);base64,(.*)$/.exec(dataUri);
    if (!match) {
        // Not a data URI; return as-is
        return dataUri;
    }

    const mime = match[1] || 'image/jpeg';
    const base64 = match[2];
    const ext = mimeToExtension[mime] ?? 'jpg';

    const safeDeck = deckName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const dir = `${FileSystem.documentDirectory}flipo_images/${safeDeck}/`;
    await ensureDirExists(dir);

    const filePath = `${dir}${fileBaseName}.${ext}`;
    await FileSystem.writeAsStringAsync(filePath, base64, { encoding: FileSystem.EncodingType.Base64 });
    return filePath;
};



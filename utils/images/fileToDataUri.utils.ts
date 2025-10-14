import * as FileSystem from 'expo-file-system';

const extensionToMime: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    heic: 'image/heic',
};

const guessMimeFromPath = (path: string): string => {
    const match = /\.([a-zA-Z0-9]+)$/.exec(path);
    const ext = (match?.[1] || '').toLowerCase();
    return extensionToMime[ext] ?? 'application/octet-stream';
};

export const fileToDataUri = async (path: string): Promise<string> => {
    try {
        if (!path || path.startsWith('data:')) {
            return path;
        }
        const mime = guessMimeFromPath(path);
        const base64 = await FileSystem.readAsStringAsync(path, { encoding: FileSystem.EncodingType.Base64 });
        return `data:${mime};base64,${base64}`;
    } catch {
        // If the file cannot be read, return original path so export still works
        return path;
    }
};



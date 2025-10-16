import { File } from 'expo-file-system';

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

        // Nouvelle API : on instancie un File à partir du chemin
        const file = new File(path);

        // Lecture du fichier sous forme de base64
        const base64 = file.base64();

        return `data:${mime};base64,${base64}`;
    } catch (e) {
        // Si la lecture échoue, on renvoie simplement le chemin original
        return path;
    }
};

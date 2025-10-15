import { DeckType } from "../types/DeckType";

export const isDeckCloseToSearch = (deck: DeckType, search: string): boolean => {
    if (search === '') {
        return false;
    }
    const result = deck.name?.toLowerCase()?.includes(search.toLowerCase());
    if (result) {
        return true;
    }
    return false;
}
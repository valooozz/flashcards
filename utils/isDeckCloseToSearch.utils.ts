import { DeckType } from "../types/DeckType";

export const isDeckCloseToSearch = (deck: DeckType, search: string) => {
    return deck.name?.toLowerCase()?.includes(search);
}
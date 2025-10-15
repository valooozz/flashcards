import { CardType } from "../types/CardType";

export const isCardCloseToSearch = (card: CardType, search: string): boolean => {
    if (search === '') {
        return false;
    }
    const result = card.recto?.toLowerCase()?.includes(search.toLowerCase()) ||
        card.verso?.toLowerCase()?.includes(search.toLowerCase())
    if (result) {
        return true;
    }
    return false;
}
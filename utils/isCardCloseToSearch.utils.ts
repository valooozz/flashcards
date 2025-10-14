import { CardType } from "../types/CardType"

export const isCardCloseToSearch = (card: CardType, search: string) => {
    return card.recto?.toLowerCase()?.includes(search) ||
        card.verso?.toLowerCase()?.includes(search)
}
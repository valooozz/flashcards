import { mockCards } from "../../tests/mocks/cards.mock";
import { CardType } from "../../types/CardType";
import { isCardCloseToSearch } from "../isCardCloseToSearch.utils";

describe("isCardCloseToSearch", () => {
    const baseCard = mockCards[0];

    it("returns true if search text matches recto (case-insensitive)", () => {
        expect(isCardCloseToSearch(baseCard, "capital")).toBe(true);
        expect(isCardCloseToSearch(baseCard, "CAPITAL")).toBe(true);
    });

    it("returns true if search text matches verso (case-insensitive)", () => {
        expect(isCardCloseToSearch(baseCard, "paris")).toBe(true);
        expect(isCardCloseToSearch(baseCard, "PARIS")).toBe(true);
    });

    it("returns false if search text does not match recto or verso", () => {
        expect(isCardCloseToSearch(baseCard, "London")).toBe(false);
    });

    it("handles empty or undefined recto/verso gracefully", () => {
        const cardWithMissingFields: CardType = {
            ...baseCard,
            recto: undefined as any,
            verso: undefined as any,
        };

        expect(isCardCloseToSearch(cardWithMissingFields, "something")).toBe(false);
    });

    it("returns false for empty search string", () => {
        expect(isCardCloseToSearch(baseCard, "")).toBe(false);
    });
});

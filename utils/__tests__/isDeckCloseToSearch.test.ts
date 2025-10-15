import { mockDecks } from "../../tests/mocks/decks.mock";
import { DeckType } from "../../types/DeckType";
import { isDeckCloseToSearch } from "../isDeckCloseToSearch.utils";

describe("isDeckCloseToSearch", () => {
    const baseDeck = mockDecks[1];

    it("returns true if search text matches deck name (case-insensitive)", () => {
        expect(isDeckCloseToSearch(baseDeck, "science")).toBe(true);
        expect(isDeckCloseToSearch(baseDeck, "SCIENCE")).toBe(true);
        expect(isDeckCloseToSearch(baseDeck, "Nature")).toBe(true);
    });

    it("returns false if search text does not match deck name", () => {
        expect(isDeckCloseToSearch(baseDeck, "history")).toBe(false);
        expect(isDeckCloseToSearch(baseDeck, "math")).toBe(false);
    });

    it("returns false for empty search string", () => {
        expect(isDeckCloseToSearch(baseDeck, "")).toBe(false);
    });

    it("handles undefined or empty deck name gracefully", () => {
        const deckWithNoName: DeckType = { ...baseDeck, name: undefined };
        expect(isDeckCloseToSearch(deckWithNoName, "science")).toBe(false);

        const deckWithEmptyName: DeckType = { ...baseDeck, name: "" };
        expect(isDeckCloseToSearch(deckWithEmptyName, "science")).toBe(false);
    });
});

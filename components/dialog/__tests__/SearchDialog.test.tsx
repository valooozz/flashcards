import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { PaperProvider } from "react-native-paper";
import { mockCards } from "../../../tests/mocks/cards.mock";
import { mockDecks } from "../../../tests/mocks/decks.mock";
import { SearchDialog } from "../SearchDialog";

// 🧩 Mock dependencies
jest.mock("../../../hooks/useTranslation", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    })
}));

describe("SearchDialog", () => {
    const hideDialog = jest.fn();
    const openDeck = jest.fn();

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    it("renders correctly when visible", () => {
        const { getByText } = render(
            <PaperProvider>
                <SearchDialog
                    visible={true}
                    hideDialog={hideDialog}
                    allCards={mockCards}
                    allDecks={mockDecks}
                    openDeck={openDeck}
                />
            </PaperProvider>
        );

        expect(getByText("dialog.searchTitle")).toBeTruthy();
        expect(getByText("common.close")).toBeTruthy();
    });

    it("calls hideDialog when Close button is pressed", () => {
        const { getByText } = render(
            <PaperProvider>
                <SearchDialog
                    visible={true}
                    hideDialog={hideDialog}
                    allCards={mockCards}
                    allDecks={mockDecks}
                    openDeck={openDeck}
                />
            </PaperProvider>
        );

        fireEvent.press(getByText("common.close"));
        expect(hideDialog).toHaveBeenCalled();
    });

    it("resets search text when dialog visibility changes", async () => {
        const { rerender, getByPlaceholderText } = render(
            <PaperProvider>
                <SearchDialog
                    visible={true}
                    hideDialog={hideDialog}
                    allCards={mockCards}
                    allDecks={mockDecks}
                    openDeck={openDeck}
                />
            </PaperProvider>
        );

        const searchInput = getByPlaceholderText("dialog.searchCard");
        fireEvent.changeText(searchInput, "fire");

        rerender(
            <PaperProvider>
                <SearchDialog
                    visible={false}
                    hideDialog={hideDialog}
                    allCards={mockCards}
                    allDecks={mockDecks}
                    openDeck={openDeck}
                />
            </PaperProvider>
        );

        await waitFor(() => {
            expect(searchInput.props.value).toBe("");
        });
    });
});

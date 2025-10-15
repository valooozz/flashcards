import { render } from "@testing-library/react-native";
import React from "react";
import { useTheme } from "react-native-paper";
import { LoaderModal } from "../LoaderModal";

// 🧩 Mock the Paper theme hook
jest.mock("react-native-paper", () => {
    const actual = jest.requireActual("react-native-paper");
    return {
        ...actual,
        useTheme: jest.fn(),
    };
});

describe("LoaderModal", () => {
    beforeEach(() => {
        (useTheme as jest.Mock).mockReturnValue({
            colors: { onPrimary: "#ffffff" },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders nothing when visible is false", () => {
        const { queryByTestId, queryByText } = render(
            <LoaderModal visible={false} text="Loading..." />
        );

        expect(queryByTestId("loader-overlay")).toBeNull();
        expect(queryByText("Loading...")).toBeNull();
    });

    it("renders loader and text when visible is true", () => {
        const { getByText, getByTestId } = render(
            <LoaderModal visible={true} text="Please wait..." />
        );

        expect(getByText("Please wait...")).toBeTruthy();
        expect(getByTestId("loader-overlay")).toBeTruthy();
    });
});

import { styleSlice, initialState } from "../StyleSlice";

describe("StyleSlice", () => {
  it("should handle addStyles", () => {
    const action = {
      payload: {
        style1: {
          color: "red",
          size: "large",
          defaultStyles: {
            dark: { backgroundColor: "black", color: "white" },
            light: { backgroundColor: "white", color: "black" },
            shape: "round",
            borderRadius: "5px",
            borderWidth: "1px",
            selectedBorderWidth: "2px",
          },
          defaultIcons: {
            faIcon: "someIcon", // replace with actual FontAwesome icon
            faUnicode: "f042", // replace with actual FontAwesome unicode
            faClass: "someClass", // replace with actual FontAwesome class
          },
        },
      },
    };

    const state = styleSlice.reducer(
      initialState,
      styleSlice.actions.addStyles(action.payload)
    );
    expect(state.styles).toEqual(action.payload);
  });
});

import { AlertSlice, initialState } from "../AlertSlice";

describe("AlertSlice", () => {
  it("should handle dismissMessage", () => {
    const action = { payload: "test message" };
    const state = AlertSlice.reducer(
      initialState,
      AlertSlice.actions.dismissMessage(action.payload)
    );
    expect(state.messages).not.toContain(action.payload);
  });

  it("should handle addError", () => {
    const action = { payload: "test error" };
    const state = AlertSlice.reducer(
      initialState,
      AlertSlice.actions.addError(action.payload)
    );
    expect(state.messages).toContainEqual({
      severity: "error",
      message: action.payload,
    });
  });

  it("should handle addSuccess", () => {
    const action = { payload: "test success" };
    const state = AlertSlice.reducer(
      initialState,
      AlertSlice.actions.addSuccess(action.payload)
    );
    expect(state.messages).toContainEqual({
      severity: "success",
      message: action.payload,
    });
  });

  it("should handle resetMessages", () => {
    const state = AlertSlice.reducer(
      initialState,
      AlertSlice.actions.resetMessages()
    );
    expect(state.messages).toEqual([]);
  });
});

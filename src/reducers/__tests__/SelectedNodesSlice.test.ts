import { selectedNodesSlice, initialState } from "../SelectedNodesSlice";

describe("SelectedNodesSlice", () => {
  it("should handle addSelectedNodes", () => {
    const action = { payload: ["node1", "node2"] };
    const state = selectedNodesSlice.reducer(
      initialState,
      selectedNodesSlice.actions.addSelectedNodes(action.payload)
    );
    expect(state.nodeIds).toEqual(action.payload);
  });

  it("should handle addSelectedNode", () => {
    const action = { payload: "node1" };
    const state = selectedNodesSlice.reducer(
      initialState,
      selectedNodesSlice.actions.addSelectedNode(action.payload)
    );
    expect(state.nodeIds).toEqual([action.payload]);
  });
});

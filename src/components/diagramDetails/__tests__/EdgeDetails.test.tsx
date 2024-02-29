import { screen, waitFor } from "@testing-library/dom";
import { Edge, MarkerType } from "reactflow";
import EdgeDetails, { EdgeDetailsProps } from "../DiagramSelection/EdgeDetails";
import { renderWithUser } from "../../../testUtils";

const selectedEdge: Edge = {
  id: "http://ies.data.gov.uk/diagrams#EAID_C8EE24EF_889D_4e8f_96DE_CCBE47D4BE4F_EAID_6F31A75D_E2EE_463d_81FC_437746AD38DD",
  source:
    "http://ies.data.gov.uk/diagrams#EAID_C8EE24EF_889D_4e8f_96DE_CCBE47D4BE4F_EAID_E2FC3A09_EC9D_4ab9_B273_A526CB511B5A",
  target:
    "http://ies.data.gov.uk/diagrams#EAID_C8EE24EF_889D_4e8f_96DE_CCBE47D4BE4F_EAID_AF57E842_9BF7_4f6e_B180_DDEACB0F5386",
  label: "sub class of",
  type: "step",
  sourceHandle: "sub-class-source",
  targetHandle: "sub-class-target",
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "#066FD1",
    width: 16,
    height: 14,
    strokeWidth: 1.5,
  },
  updatable: true,
  style: {
    stroke: "#066FD1",
    strokeWidth: 2,
  },
  selected: true,
};

const renderSidebar = (props?: Partial<EdgeDetailsProps>) =>
  renderWithUser(
    <EdgeDetails
      data={selectedEdge}
      onChange={jest.fn()}
      remove={jest.fn()}
      {...props}
    />
  );

describe("EdgeDetails", () => {
  test("renders 4 edges which can be updated", async () => {
    const { user } = renderSidebar();
    await user.click(screen.getByRole("combobox", { name: "Edge type" }));

    expect(screen.getAllByRole("option")).toHaveLength(4);
    expect(screen.getByRole("option", { name: "Sub class of" }));
    expect(screen.getByRole("option", { name: "Sub property of" }));
    expect(screen.getByRole("option", { name: "Domain" }));
    expect(screen.getByRole("option", { name: "Range" }));
  });

  test("renders selected edge type", async () => {
    renderSidebar();

    expect(
      screen.getByRole("combobox", { name: "Edge type" })
    ).toHaveTextContent("Sub class of");
  });

  test("updates selected edge type", async () => {
    const mockedOnEdgeChanged = jest.fn();
    const { user } = renderSidebar({ onChange: mockedOnEdgeChanged });
    await user.click(screen.getByRole("combobox", { name: "Edge type" }));
    await user.click(screen.getByRole("option", { name: "Domain" }));

    expect(
      screen.getByRole("combobox", { name: "Edge type" })
    ).toHaveTextContent("Domain");
    expect(mockedOnEdgeChanged).toHaveBeenCalledWith(selectedEdge.id, {
      id: "http://ies.data.gov.uk/diagrams#EAID_C8EE24EF_889D_4e8f_96DE_CCBE47D4BE4F_EAID_6F31A75D_E2EE_463d_81FC_437746AD38DD",
      source:
        "http://ies.data.gov.uk/diagrams#EAID_C8EE24EF_889D_4e8f_96DE_CCBE47D4BE4F_EAID_E2FC3A09_EC9D_4ab9_B273_A526CB511B5A",
      target:
        "http://ies.data.gov.uk/diagrams#EAID_C8EE24EF_889D_4e8f_96DE_CCBE47D4BE4F_EAID_AF57E842_9BF7_4f6e_B180_DDEACB0F5386",
      label: "domain",
      type: "step",
      sourceHandle: "handle-left",
      targetHandle: "handle-right",
      markerEnd: {
        type: "arrow",
        color: "#949494",
        width: 16,
        height: 14,
        strokeWidth: 1.5,
      },
      updatable: true,
      style: { stroke: "#949494", strokeWidth: 2 },
      selected: true,
    });
  });

  test("renders alert when delete is clicked", async () => {
    const { user } = renderSidebar();
    await user.click(screen.getByRole("button", { name: "Delete edge" }));

    expect(screen.getByRole("dialog")).toBeVisible();
  });

  test("does NOT render alert when delete action is dismissed/cancelled", async () => {
    const { user } = renderSidebar();
    await user.click(screen.getByRole("button", { name: "Delete edge" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("dialog")).not.toBeVisible();
  });

  test("deletes edge", async () => {
    const mockedRemoveEdge = jest.fn();

    const { user } = renderSidebar({ remove: mockedRemoveEdge });
    await user.click(screen.getByRole("button", { name: "Delete edge" }));
    await user.click(screen.getByRole("button", { name: "OK" }));

    await waitFor(() => {
      expect(mockedRemoveEdge).toHaveBeenCalledWith(selectedEdge.id);
    });
  });
});

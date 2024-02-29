import { screen } from "@testing-library/react";
import { Node, Position } from "reactflow";

import NodeListEntry, { NodeListEntryProps } from "../sidebars/panels/NodeListPanel/NodeListEntry";
import { renderWithUser } from "../../testUtils";

const renterNode: Node<Required<NodeData>> = {
  width: 160,
  height: 65,
  id: "http://ies.data.gov.uk/diagrams#EAID_C8EE24EF_889D_4e8f_96DE_CCBE47D4BE4F_EAID_E2FC3A09_EC9D_4ab9_B273_A526CB511B5A",
  type: "class",
  position: {
    x: 412,
    y: 399.66666666666674,
  },
  data: {
    uri: "http://ies.data.gov.uk/ontology/ies4#Renter",
    label: "Renter",
    namespace: "http://ies.data.gov.uk/ontology/ies4#",
    backgroundColor: "#0F0024",
    color: "#BA85FF",
    iconClass: "fa-solid fa-pause",
    created: false,
  },
  targetPosition: Position.Left,
  sourcePosition: Position.Right,
  positionAbsolute: {
    x: 412,
    y: 399.66666666666674,
  },
  selected: true,
};

const renderEntry = (props?: Partial<NodeListEntryProps>) =>
  renderWithUser(
    <NodeListEntry
      selected
      node={renterNode}
      selectNode={jest.fn()}
      {...props}
    />
  );

describe("Node list entry component", () => {
  test("render node label", () => {
    renderEntry();

    expect(screen.getByText(renterNode.data.label)).toBeVisible();
  });

  test("calls selectNode when clicked", async () => {
    const mockSelectNode = jest.fn();
    const { user } = renderEntry({ selectNode: mockSelectNode });
    await user.click(screen.getByText(renterNode.data.label));

    expect(mockSelectNode).toHaveBeenCalledWith(renterNode.id);
  });
});

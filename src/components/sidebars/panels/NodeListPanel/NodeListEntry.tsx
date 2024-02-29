import React from "react";
import { Node } from "reactflow";
import { TeliListItemButton } from "@telicent-oss/ds";

interface NodeListEntryProps {
  node: Node<NodeData>;
  selected: boolean;
  selectNode: (nodeId: string) => void;
}

const NodeListEntry: React.FC<NodeListEntryProps> = ({
  node,
  selectNode,
  selected,
}) => {
  const handleListItemClick = () => {
    selectNode(node.id);
  };

  return (
    <TeliListItemButton selected={selected} onClick={handleListItemClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 12 12"
        fill={node.data?.backgroundColor ?? "#FFFFFF"}
        className="mr-2 h-3 w-3 flex-shrink-0"
      >
        <rect width="12" height="12" />
      </svg>
      {node.data.label}
    </TeliListItemButton>
  );
};

export default NodeListEntry;
export type { NodeListEntryProps };

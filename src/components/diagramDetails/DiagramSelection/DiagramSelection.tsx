/* eslint-disable @typescript-eslint/indent */
import React, { useState } from "react";
import { Edge, Node, useOnSelectionChange, useEdgesState } from "reactflow";

import EdgeDetails from "./EdgeDetails";
import NodeDetails from "./NodeDetails";
import { useAppDispatch } from "../../../hooks";
import { addSelectedNodes } from "../../../reducers/SelectedNodesSlice";

interface DiagramSelectionProps {
  onEdgesChange: (edgeId: string, newData: Edge) => void;
  removeEdge: (edgeId: string) => void;
  onNodesChange: (nodeId: string, newData: Required<NodeData>) => void;
  removeNode: (nodeId: string) => void;
}

const DiagramSelection: React.FC<DiagramSelectionProps> = ({
  onEdgesChange,
  removeEdge,
  onNodesChange,
  removeNode,
}) => {
  const dispatch = useAppDispatch();
  // eslint-disable @typescript-eslint/indent is disabled for this line. It's
  // conflicting with prettier
  const [selectedNodes, setSelectedNodes] = useState<
    Node<Required<NodeData>>[]
  >([]);

  const [selectedEdges, setSelectedEdges] = useState<Edge[]>([]);
  // const [edges, setEdges, onChangeEdges] = useEdgesState([]);
  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      setSelectedNodes(nodes);
      // odd
      dispatch(addSelectedNodes(nodes.map((node) => node.id)));
      setSelectedEdges(edges);
    },
  });

  if (selectedEdges.length === 0 && selectedNodes.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-0 right-0 bottom-0 flex flex-col bg-black-200 max-w-[20rem]">
      {selectedNodes.map((selectedNode) => (
        <NodeDetails
          key={selectedNode.id}
          data={selectedNode}
          onChange={onNodesChange}
          remove={removeNode}
        />
      ))}
      {selectedEdges.map((selectedEdge) => (
        <EdgeDetails
          key={selectedEdge.id}
          data={selectedEdge}
          onChange={onEdgesChange}
          remove={removeEdge}
        />
      ))}
    </div>
  );
};

export default DiagramSelection;

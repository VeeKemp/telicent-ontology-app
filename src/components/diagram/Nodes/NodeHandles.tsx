import React from "react";
import { Handle, Position } from "reactflow";

type NodeHandlesProps = {
  hide: boolean;
};

const NodeHandles: React.FC<Partial<NodeHandlesProps>> = ({ hide = false }) => {
  if (hide) return null;

  return (
    <>
      <Handle
        id="handle-top"
        type="source"
        position={Position.Top}
        style={{ top: -6 }}
      />
      <Handle
        id="handle-bottom"
        type="source"
        position={Position.Bottom}
        style={{ bottom: -6 }}
      />
      <Handle
        id="handle-left"
        type="source"
        position={Position.Left}
        style={{ bottom: -6 }}
      />
      <Handle
        id="handle-right"
        type="source"
        position={Position.Right}
        style={{ bottom: -6 }}
      />
    </>
  );
};

export default NodeHandles;

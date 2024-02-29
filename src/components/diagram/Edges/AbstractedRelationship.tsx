import React from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
} from "reactflow";
import { ObjectPropertyNode } from "../Nodes";

const AbstractedRelationship: React.FC<EdgeProps> = ({
  id,
  label,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{ ...style, strokeDasharray: 8, strokeLinecap: "round" }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            backgroundColor: "#1e1e1e",
            fontSize: 12,
          }}
          className="nodrag nopan flex justify-center items-center gap-x-2 font-body"
        >
          <ObjectPropertyNode data={{}} hideHandles hideLabel size="small" />
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default AbstractedRelationship;

import React from "react";
import { ConnectionLineComponentProps, getStraightPath } from "reactflow";

const CustomConnectionLine: React.FC<ConnectionLineComponentProps> = ({
  fromX,
  fromY,
  toX,
  toY,
}) => {
  const [edgePath] = getStraightPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
  });

  return (
    <g>
      <path fill="none" stroke="#D0D0D0" strokeWidth={2} d={edgePath} />
      <circle
        cx={toX}
        cy={toY}
        fill="black"
        r={3}
        stroke="#909090"
        strokeWidth={1.5}
      />
    </g>
  );
};

export default CustomConnectionLine;

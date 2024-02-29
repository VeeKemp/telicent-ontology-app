import React from "react";

type NodeTypeProps = {
  hide?: boolean;
  label: "class" | "object property" | "data type property";
};

const NodeType: React.FC<NodeTypeProps> = ({ hide = false, label }) => {
  if (hide) return null;

  return (
    <p className="text-xs opacity-70 text-center">&lt;&lt; {label} &gt;&gt;</p>
  );
};

export default NodeType;

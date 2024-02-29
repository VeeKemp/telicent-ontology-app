import React, { DragEvent } from "react";
import NodeType from "./NodeType";
import NodeHandles from "./NodeHandles";
import "./node.css";
import classNames from "classnames";

type ClassNodeData = {
  backgroundColor: string;
  color: string;
  iconClass: string;
  label: string;
};

type ClassNodeProps = {
  data: Partial<ClassNodeData>;
  size?: "small";
  hideHandles?: boolean;
  hideType?: boolean;
  hide?: boolean;
  draggable?: boolean;
  onDragStart?: (event: DragEvent<HTMLDivElement>) => void;
};
const ClassNode: React.FC<ClassNodeProps> = ({
  data,
  size,
  hideHandles = false,
  hideType = false,
  draggable = false,
  onDragStart,
  hide = false,
}) => {
  const {
    backgroundColor = "#121212",
    color = "#f5f5f5",
    iconClass = "fa-solid fa-question",
    label = "Class",
  } = data;

  if (hide) return null;

  return (
    <>
      <NodeHandles hide={hideHandles} />
      <div
        className={classNames(
          "class-node px-14 py-4 font-body rounded-xl border",
          size,
          { "translate-x-0 translate-y-0 w-[195px]": draggable }
        )}
        style={{ backgroundColor, color, borderColor: color }}
        onDragStart={onDragStart}
        draggable={draggable}
      >
        <NodeType label="class" hide={hideType} />
        <div className="flex justify-center gap-x-2">
          <i className={`${iconClass} text-sm pt-1`} />
          <p className="node-label">{label}</p>
        </div>
      </div>
    </>
  );
};

export default ClassNode;

import React, { DragEvent } from "react";
import NodeType from "./NodeType";
import NodeHandles from "./NodeHandles";
import "./node.css";
import classNames from "classnames";

type DataTypePropertyNodeProps = {
  data: Partial<DataTypePropertyNodeData>;
  size?: "small";
  hideHandles?: boolean;
  hideType?: boolean;
  hide?: boolean;
  draggable?: boolean;
  onDragStart?: (event: DragEvent<HTMLDivElement>) => void;
};

type DataTypePropertyNodeData = {
  label: string;
};

const DataTypePropertyNode: React.FC<DataTypePropertyNodeProps> = ({
  data,
  size,
  hideHandles = false,
  hideType = false,
  draggable = false,
  onDragStart,
  hide = false,
}) => {
  const { label = "Data type property" } = data;

  if (hide) return null;

  return (
    <>
      <NodeHandles hide={hideHandles} />
      <div
        className={classNames(
          "flex data-type-property",
          { small: size === "small" },
          { "translate-x-0 translate-y-0 h-7 mt-0.5": draggable }
        )}
        onDragStart={onDragStart}
        draggable={draggable}
      >
        <div className="triangle-topright" />
        <div className="node px-2 py-1 flex flex-col justify-center">
          <NodeType label="data type property" hide={hideType} />
          <p>{label}</p>
        </div>
        <div className="triangle-topleft" />
      </div>
    </>
  );
};

export default DataTypePropertyNode;

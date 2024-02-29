import React, { DragEvent } from "react";
import classnames from "classnames";
import NodeType from "./NodeType";
import NodeHandles from "./NodeHandles";
import "./node.css";

type ObjectPropertyNodeProps = {
  data: Partial<ObjectPropertyNodeData>;
  hideType?: boolean;
  hideHandles?: boolean;
  hide?: boolean;
  size?: "small";
  hideLabel?: boolean;
  draggable?: boolean;
  onDragStart?: (event: DragEvent<HTMLDivElement>) => void;
};

type ObjectPropertyNodeData = {
  label: string;
};

type LabelProps = {
  label: string;
  hideLabel: boolean;
  hideType: boolean;
  draggable?: boolean;
};

const Label: React.FC<Partial<LabelProps>> = ({
  label,
  hideLabel,
  hideType,
  draggable = false,
}) => {
  if (hideLabel) return null;

  return (
    <div
      className={classnames("node px-2 py-1 flex flex-col justify-center ", {
        "w-[171px]": draggable,
      })}
    >
      <NodeType label="object property" hide={hideType} />
      <p className="text-center">{label}</p>
    </div>
  );
};

const ObjectPropertyNode: React.FC<ObjectPropertyNodeProps> = ({
  data,
  hideHandles = false,
  hideType = false,
  size,
  draggable = false,
  onDragStart,
  hide = false,
  hideLabel = false,
}) => {
  const { label = "Object property" } = data;

  if (hide) return null;

  return (
    <>
      <NodeHandles hide={hideHandles} />
      <div
        className={classnames("object-property-node flex", size, {
          "translate-x-0 translate-y-0 h-[24px] mt-0.5": draggable,
        })}
        onDragStart={onDragStart}
        draggable={draggable}
      >
        <div className="triangle-left" />
        <Label
          hideType={hideType}
          label={label}
          hideLabel={hideLabel}
          draggable={draggable}
        />
        <div className="triangle-right" />
      </div>
    </>
  );
};

export default ObjectPropertyNode;

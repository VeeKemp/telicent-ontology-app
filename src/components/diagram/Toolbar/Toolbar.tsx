import React, { DragEvent, useState } from "react";
import ToolbarButtons from "./Buttons/ToolbarButtons";
import SelectNode from "./SelectNode";
import {
  ClassNode,
  DataTypePropertyNode,
  ObjectPropertyNode,
} from "../../diagram/Nodes";

interface ToolbarProps {
  panOnDrag: boolean;
  setPanOnDrag: () => void;
  selectionOnDrag: boolean;
  setSelectionOnDrag: () => void;
}

export type NodeTemplate = {
  nodeShape: NodeShape;
  label: string;
  namespace: string;
};

const Toolbar: React.FC<ToolbarProps> = ({
  panOnDrag,
  setPanOnDrag,
  selectionOnDrag,
  setSelectionOnDrag,
}) => {
  const [menuOption, setMenuOption] = useState("class");
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const createSetDataNodeTemplateString = (
    nodeShape: NodeShape,
    label: string
  ) => {
    return JSON.stringify({
      nodeShape,
      label,
      namespace: "http://example.io/",
    });
  };

  const handleMenuClick = (label: React.SetStateAction<string>) => {
    setMenuOption(label);
    setMenuIsOpen(false);
  };

  const handleToggle = () => {
    setMenuIsOpen((prev) => !prev);
  };

  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragClassNode = (event: DragEvent<HTMLDivElement>) => {
    onDragStart(
      event,
      createSetDataNodeTemplateString("roundrectangle", "Class")
    );
  };

  const handleDragDataTypePropertyNode = (event: DragEvent<HTMLDivElement>) => {
    onDragStart(
      event,
      createSetDataNodeTemplateString("parallelogram", "Data type property")
    );
  };

  const handleDragObjectPropertyNode = (event: DragEvent<HTMLDivElement>) => {
    onDragStart(
      event,
      createSetDataNodeTemplateString("diamond", "Object property")
    );
  };

  return (
    <div className="flex justify-center">
      <div className="relative flex justify-center gap-x-1 align-middle p-2 border rounded-lg border-whiteSmoke-700 bg-black w-fit">
        <ToolbarButtons
          panOnDrag={panOnDrag}
          setPanOnDrag={setPanOnDrag}
          selectionOnDrag={selectionOnDrag}
          setSelectionOnDrag={setSelectionOnDrag}
        />
        <Divider />
        <div className="px-1 cursor-not-allowed">
          <ClassNode
            data={{}}
            hideHandles
            size="small"
            hideType
            hide={menuOption !== "class"}
            onDragStart={handleDragClassNode}
            draggable={false}
          />
          <DataTypePropertyNode
            data={{}}
            hideHandles
            size="small"
            hideType
            hide={menuOption !== "dataTypeProperty"}
            onDragStart={handleDragDataTypePropertyNode}
            draggable={false}
          />
          <ObjectPropertyNode
            data={{}}
            hideHandles
            hideType
            size="small"
            hide={menuOption !== "objectProperty"}
            onDragStart={handleDragObjectPropertyNode}
            draggable={false}
          />
        </div>

        <div className="absolute -top-10 right-2">
          <SelectNode
            handleMenuClick={handleMenuClick}
            menuIsOpen={menuIsOpen}
          />
        </div>
        <button onClick={handleToggle} disabled className="cursor-not-allowed">
          <i className="ri-arrow-up-s-line text-xl" />
        </button>
      </div>
    </div>
  );
};

const Divider = () => <div className="h-8 w-[1px] bg-whiteSmoke-600 mx-1" />;

export default Toolbar;

import React from "react";
import ScreenshotButton from "./ScreenshotButton";
import PanButton from "./PanButton";
import SelectButton from "./SelectButton";

interface ToolbarButtons {
  panOnDrag: boolean;
  setPanOnDrag: () => void;
  selectionOnDrag: boolean;
  setSelectionOnDrag: () => void;
}

const ToolbarButtons: React.FC<ToolbarButtons> = ({
  panOnDrag,
  setPanOnDrag,
  selectionOnDrag,
  setSelectionOnDrag,
}) => (
  <div className="flex gap-x-1">
    <ScreenshotButton />
    <PanButton active={panOnDrag} onClick={setPanOnDrag} />
    <SelectButton active={selectionOnDrag} onClick={setSelectionOnDrag} />
  </div>
);

export default ToolbarButtons;

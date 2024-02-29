import { useState } from "react";
import { SelectionMode } from "reactflow";

enum FlowControlMode {
  Default = "default",
  FigmaLike = "figma-like",
}

/**
 * Refer to https://reactflow.dev/learn/concepts/the-viewport for Zoom and Pan
 * controls
 */

const useFlowControls = () => {
  const [controlMode, setControlMode] = useState<FlowControlMode>(
    FlowControlMode.Default
  );
  const [panOnDrag, setPanOnDrag] = useState<boolean | number[]>(true);
  const [panOnScroll, setPanOnScroll] = useState(false);
  const [selectionOnDrag, setSelectionOnDrag] = useState(false);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>(
    SelectionMode.Full
  );

  /**
   * Drag mouse to pan
   * Scroll to zoom
   * Shift + drag mouse to create a selection
   */
  const setDefaultControls = () => {
    setPanOnDrag(true);
    setPanOnScroll(false);
    setSelectionOnDrag(false);
    setSelectionMode(SelectionMode.Full);
    setControlMode(FlowControlMode.Default);
  };

  /**
   * Scroll, space + drag mouse, middle or right mouse to pan
   * Pitch or cmd + scroll to zoom
   * Drag mouse to create a selection
   */
  const setFigmaLikeControls = () => {
    setPanOnScroll(true);
    setSelectionOnDrag(true);
    setPanOnDrag([1, 2]);
    setSelectionMode(SelectionMode.Partial);
    setControlMode(FlowControlMode.FigmaLike);
  };

  return {
    controlMode,
    panOnDrag,
    panOnScroll,
    selectionMode,
    selectionOnDrag,
    setDefaultControls,
    setFigmaLikeControls,
  };
};

export default useFlowControls;
export { FlowControlMode };

import React, { FC } from "react";

import { AppViewModes } from "../../../types";

interface ViewSelectorProps {
  onSetActiveView: (view: AppViewModes) => void;
  activeView: AppViewModes;
}

const ViewSelector: FC<ViewSelectorProps> = ({
  onSetActiveView,
  activeView,
}) => {
  const toggleView = () => {
    const newView =
      activeView === AppViewModes.Ontology
        ? AppViewModes.Instance
        : AppViewModes.Ontology;
    onSetActiveView(newView);
  };

  return (
    <div className="p-2">
      <h2 className="text-lg">View Selector</h2>
      <button onClick={toggleView}>
        {activeView === AppViewModes.Instance
          ? "Switch to Ontology View"
          : "Switch to Instance View"}
      </button>
    </div>
  );
};

export default ViewSelector;

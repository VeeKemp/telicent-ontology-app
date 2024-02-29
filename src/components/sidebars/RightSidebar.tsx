import React from "react";
import Terminal from "../DiagramCreator/Terminal/Terminal";
import "./Sidebar.css";
import RdfPanel, { RdfPanelProps } from "../DiagramCreator/Terminal/Terminal";

export default function RightSidebar(props: RdfPanelProps) {
  const { handleRdfInput } = props;
  //  const onDragStart = (event, nodeType) => {
  //    event.dataTransfer.setData('application/reactflow', nodeType);
  //    event.dataTransfer.effectAllowed = 'move';
  //  };

  return (
    <aside id="right-sidebar" className="sidebar">
      <Terminal handleRdfInput={handleRdfInput} />
    </aside>
  );
}

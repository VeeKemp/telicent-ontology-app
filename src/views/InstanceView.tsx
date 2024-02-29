import React, { FC } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  ConnectionMode,
} from "reactflow";
import { AppViewModes } from "../types";

import { INSTANCE_NODE_TYPES } from "../components/diagram/Nodes";
import EDGE_TYPES from "../components/diagram/Edges";

import CustomConnectionLine from "../components/diagram/Edges/CustomConnectionLine";
import useDrawGraph from "../components/DiagramCreator/hooks/useDrawGraph";
import ViewSidebar from "../components/sidebars/ViewSidebar";
import RightSidebar from "../components/sidebars/RightSidebar";

const connectionLineStyle = {
  strokeWidth: 3,
  stroke: "black",
};

interface InstanceViewProps {
  onSetActiveView: (view: AppViewModes) => void;
}

const InstanceView: FC<InstanceViewProps> = ({ onSetActiveView }) => {
  const handleSetActiveView = (view: AppViewModes) => {
    onSetActiveView(view);
  };

  const { hookProps, sidebarProps } = useDrawGraph();
  const {
    reactFlowWrapper,
    handleSetRelationship,
    setDragData,
    handleRdfInput,
  } = sidebarProps;

  return (
    <div className="dndflow h-full">
      <ViewSidebar
        onSetActiveView={handleSetActiveView}
        activeView={AppViewModes.Instance}
        onSetDragData={(data: any) => {
          setDragData(data);
        }}
        onSetRelationship={handleSetRelationship}
      />
      <div
        className="reactflow-wrapper"
        ref={reactFlowWrapper}
        style={{ width: "100%", height: "100%" }}
      >
        <ReactFlow
          {...hookProps}
          fitView
          nodeTypes={INSTANCE_NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          connectionLineComponent={CustomConnectionLine}
          connectionLineStyle={connectionLineStyle}
          panOnDrag={true}
          connectionMode={ConnectionMode.Loose}
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
      <RightSidebar handleRdfInput={handleRdfInput} />
    </div>
  );
};

export default InstanceView;

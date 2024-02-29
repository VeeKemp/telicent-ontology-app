import React, { useCallback, useRef } from "react";

import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  ConnectionMode,
  Controls as ControlsRaw,
  Edge,
  MiniMap as MiniMapRaw,
  Node,
  OnEdgesChange,
  OnInit,
  OnNodesChange,
  SelectionMode,
  updateEdge,
  useReactFlow,
} from "reactflow";

import CustomConnectionLine from "../Edges/CustomConnectionLine";
import useFlowControls, { FlowControlMode } from "./useFlowControls";
import Diagram from "../../../models/diagram";
import NODE_TYPES from "../Nodes";
import EDGE_TYPES from "../Edges";
import Toolbar, { NodeTemplate } from "../Toolbar/Toolbar";

type FlowProps = {
  className?: string;
  edges?: Edge[];
  hideControls?: boolean;
  hideMiniMap?: boolean;
  id: string;
  nodes?: Node<NodeData>[];
  onEdgeConnect: (edge: Edge) => void;
  onEdgesChange: OnEdgesChange;
  onEdgeUpdate: (edges: Edge[]) => void;
  onInit?: OnInit;
  onNodeDrop: (node: Node<NodeData>) => void;
  onNodeDropRaw?: (event: React.DragEvent<HTMLDivElement>) => void;
  onNodesChange: OnNodesChange;
  panOnDrag?: boolean | number[];
  panOnScroll?: boolean;
  selectionMode?: SelectionMode;
  selectionOnDrag?: boolean;
};

const Flow: React.FC<FlowProps> = ({
  className,
  edges = [],
  hideControls = false,
  hideMiniMap = false,
  id,
  nodes = [],
  onEdgeConnect,
  onEdgesChange,
  onEdgeUpdate,
  onInit,
  onNodeDrop,
  onNodesChange,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();

  const flowControls = useFlowControls();

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleNodeDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (reactFlowWrapper?.current === null) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const data = event.dataTransfer.getData("application/reactflow");

      if (!data) {
        return; // or handle this case appropriately
      }

      const { nodeShape, label } = JSON.parse(data) as NodeTemplate;

      // check if the dropped element is valid
      if (typeof nodeShape === "undefined" || !nodeShape) {
        return;
      }

      if (reactFlowInstance != null) {
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const emptyNode = Diagram.createNodeFromDefaultOptions({
          label,
          style: {
            colour: "black",
            bgColour: "white",
            shape: nodeShape,
            x: position.x,
            y: position.y,
          },
        });

        onNodeDrop(emptyNode);
      }
    },
    [reactFlowInstance]
  );

  const handleEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      const updatedEdges = updateEdge(oldEdge, newConnection, edges);
      onEdgeUpdate(updatedEdges);
    },
    [edges]
  );

  const handleEdgeConnect = useCallback(({ source, target }: Connection) => {
    if (source && target) {
      const edge = Diagram.createEdge("", {
        source,
        target,
        relationship: "http://www.w3.org/2000/01/rdf-schema#subClassOf",
      });
      onEdgeConnect(edge);
    }
  }, []);

  return (
    <div
      id={id}
      ref={reactFlowWrapper}
      className={className}
      data-component="Flow"
    >
      <ReactFlow
        connectionLineComponent={CustomConnectionLine}
        connectionMode={ConnectionMode.Loose}
        edges={edges}
        edgeTypes={EDGE_TYPES}
        nodes={nodes}
        nodeTypes={NODE_TYPES}
        onConnect={handleEdgeConnect}
        onDragOver={handleDragOver}
        onDrop={handleNodeDrop}
        onEdgesChange={onEdgesChange}
        onEdgeUpdate={handleEdgeUpdate}
        onInit={onInit}
        onNodesChange={onNodesChange}
        panOnDrag={flowControls.panOnDrag}
        panOnScroll={flowControls.panOnScroll}
        selectionMode={flowControls.selectionMode}
        selectionOnDrag={flowControls.selectionOnDrag}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
          style={{ opacity: 0.5 }}
        />
        <div className="absolute bottom-1 w-full z-10">
          <Toolbar
            panOnDrag={flowControls.controlMode === FlowControlMode.Default}
            selectionOnDrag={
              flowControls.controlMode === FlowControlMode.FigmaLike
            }
            setPanOnDrag={flowControls.setDefaultControls}
            setSelectionOnDrag={flowControls.setFigmaLikeControls}
          />
        </div>
      </ReactFlow>
      <MiniMap hide={hideMiniMap} />
      <Controls hide={hideControls} />
    </div>
  );
};

const MiniMap: React.FC<{ hide: boolean }> = ({ hide }) => {
  if (hide) return null;
  return (
    <MiniMapRaw
      nodeColor={(node: Node<NodeData>) => node.data?.color || "#444444"}
      nodeStrokeWidth={3}
      nodeStrokeColor="#000"
      position="top-left"
      zoomable
      pannable
    />
  );
};

const Controls: React.FC<{ hide: boolean }> = ({ hide }) => {
  if (hide) return null;
  return <ControlsRaw />;
};

export default Flow;

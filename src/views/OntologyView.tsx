import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Edge,
  Node,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import { LinearProgress } from "@mui/material";
import NodeListPanel from "../components/sidebars/panels/NodeListPanel/NodeListPanel";
import { DiagramSummary, fetchDiagramSummaries } from "../services/ApiManager";
import { getDiagramNodesAndEdges } from "../services/NodeEdgeManager";
import ViewSidebar from "../components/sidebars/ViewSidebar";
import DiagramSelection from "../components/diagramDetails/DiagramSelection/DiagramSelection";
import ErrorMessage from "../components/ErrorMessage";
import Flow from "../components/diagram/Flow/Flow";
import { AppViewModes } from "../types";

interface OntologyViewProps {
  onSetActiveView: (view: AppViewModes) => void;
}

const OntologyView: React.FC<OntologyViewProps> = ({ onSetActiveView }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const isInitializedRef = useRef<boolean | null>(false);
  const reactFlowInstance = useReactFlow();

  const [diagrams, setDiagrams] = useState<DiagramSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const { fitView } = reactFlowInstance;
  const [diagramError, setDiagramError] = useState("");
  const [activeView, setActiveView] = useState(AppViewModes.Ontology);

  const handleEdgeUpdate = (updatedEdges: Edge[]) => {
    setEdges(updatedEdges);
  };

  const handleEdgeConnect = (edge: Edge) => {
    setEdges((prevEdges) => [...prevEdges, edge]);
  };

  const handleNodeDrop = (node: Node<NodeData>) => {
    setNodes((prevNodes) => [...prevNodes, node]);
  };

  const handleDiagramSelection = async (clickId: string) => {
    setLoading(true);
    try {
      const { diagramNodes, diagramEdges } = await getDiagramNodesAndEdges(clickId);
      isInitializedRef.current = false;
      setNodes(diagramNodes);
      setEdges(diagramEdges.filter(Boolean));
      setLoading(false); // TODO delete when have error UI
    } catch (error) {
      throw error
    } finally {
      // setLoading(false); // TODO enable whe have error UI
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const diagramList = await fetchDiagramSummaries();

        // get first item in list and set it to be the default selected view
        if (diagramList && diagramList.length > 0 && "uri" in diagramList[0]) {
          if (nodes.length === 0) {
            handleDiagramSelection(diagramList[0].uri);
          }
          setDiagrams(diagramList);
        }
      } catch (error) {
        setDiagramError("There was an error loading the diagrams");
      }
    };
    fetchData();
  }, []);

  const handleNodeDataChange = (nodeId: string, data: Required<NodeData>) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data,
          };
        }
        return node;
      })
    );
  };

  const removeNode = (nodeId: string) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
  };

  const handleEdgeDataChange = (edgeId: string, newData: Edge) => {
    setEdges((prevEdges) =>
      prevEdges.map((edge) => {
        if (edge.id === edgeId) {
          return {
            ...edge,
            ...newData,
          };
        }
        return edge;
      })
    );
  };

  const removeEdge = (edgeId: string) => {
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== edgeId));
  };

  const handleSetActiveView = (view: AppViewModes) => {
    onSetActiveView(view);
    setActiveView(view);
  };

  if (diagramError) return <ErrorMessage message={diagramError} />;

  return (
    <>
      <div className="absolute top-10 right-[20vw] z-[9999] max-w-md">
        <NodeListPanel nodes={nodes} setNodes={setNodes} />
      </div>
      <div className="dndflow">
        {loading && <LinearProgress className="progressBar" />}

        <ViewSidebar
          diagrams={diagrams}
          handleItemClick={handleDiagramSelection}
          onSetActiveView={handleSetActiveView}
          activeView={AppViewModes.Ontology}
        />
        <Flow
          id="ontology-view"
          className="absolute left-60 right-0 top-0 bottom-0"
          nodes={nodes}
          edges={edges}
          onEdgeConnect={handleEdgeConnect}
          onEdgesChange={onEdgesChange}
          onEdgeUpdate={handleEdgeUpdate}
          onNodesChange={onNodesChange}
          onNodeDrop={handleNodeDrop}
        />
        <DiagramSelection
          onNodesChange={handleNodeDataChange}
          removeNode={removeNode}
          onEdgesChange={handleEdgeDataChange}
          removeEdge={removeEdge}
        />
      </div>
    </>
  );
};

export default OntologyView;

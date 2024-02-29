import { Instance, Node, OnConnectStartParams, XYPosition } from "reactflow";
import { Quad } from "@rdfjs/types";

import { FlowEdge, FlowNode, RDF } from "../../../models";

const getTargetHandleId = (handleId: string | null) => {
  if (handleId === "handle-bottom") {
    return { sourceHandle: handleId, targetHandle: "handle-top" };
  }

  if (handleId === "handle-top") {
    return { sourceHandle: handleId, targetHandle: "handle-bottom" };
  }

  if (handleId === "handle-left") {
    return { sourceHandle: handleId, targetHandle: "handle-right" };
  }

  if (handleId === "handle-right") {
    return { sourceHandle: handleId, targetHandle: "handle-left" };
  }
};

type OffsetScreenPosition = {
  x: number;
  y: number;
  handleId: string | null;
};
const offsetScreenPosition = ({ x, y, handleId }: OffsetScreenPosition) => {
  if (handleId === "handle-bottom") {
    return { x: x - 155, y };
  }

  if (handleId === "handle-top") {
    return { x: x - 155, y: y - 100 };
  }

  if (handleId === "handle-right") {
    return { x, y: y - 60 };
  }

  if (handleId === "handle-left") {
    return { x: x - 325, y: y - 60 };
  }

  return { x, y };
};

type CreateNodeWithEdgeOptions = {
  node: {
    label?: string;
    position?: XYPosition;
    sourceHandleId?: string | null;
  };
  edge: {
    label: string;
    sourceNodeId: string;
  };
};

export const createTextNodeWithEdge = (options: CreateNodeWithEdgeOptions) => {
  const node = new FlowNode<TextNodeData>({
    idPrefix: "textNode",
    position: options.node.position,
    data: { label: options.node.label ?? "", rdfTriple: [] },
  })
    .setType("text")
    .createNode();

  const handle = getTargetHandleId(options.node?.sourceHandleId ?? null);

  const edge = new FlowEdge({
    source: options.edge.sourceNodeId,
    target: node.id,
  })
    .setSourceHandle(handle?.sourceHandle)
    .setTargetHandle(handle?.targetHandle)
    .setLabel(options.edge.label)
    .createEdge();

  const rdfTriple = RDF.createTripleOnNewLine({
    subject: `data:${edge.source}`,
    predicate: `${edge.label}`,
    object: `${RDF.createLiteral(node.data.label)}`,
  }).triple;

  node.data = {
    ...node.data,
    rdfTriple,
  };

  return { node, edge };
};

type CreateTextNodesWithEdgesFromTriplesOptions = {
  triples: Quad[];
  nodes: Node[];
  getNode: Instance.GetNode<TextNodeData>;
};
export const createTextNodesWithEdgesFromTriples = (
  options: CreateTextNodesWithEdgesFromTriplesOptions
) => {
  const textNodesWithEdges = options.triples.map((triple) => {
    const subject = triple.subject.value;
    const predicate = triple.predicate.value;
    const object = triple.object.value;
    const sourceNode = options.getNode(subject);

    let position = sourceNode && {
      x: sourceNode.position.x + 380,
      y: sourceNode.position.y,
    };

    return createTextNodeWithEdge({
      node: {
        position,
        sourceHandleId: "handle-right",
        label: object,
      },
      edge: {
        label: predicate.split("#")[1],
        sourceNodeId: subject,
      },
    });
  });

  const nodes = textNodesWithEdges.map(
    (textNodesWithEdge) => textNodesWithEdge.node
  );
  const edges = textNodesWithEdges.map(
    (textNodesWithEdge) => textNodesWithEdge.edge
  );

  return { nodes, edges };
};

type CreateTextNodeWithEdgesFlowOptions = {
  event: MouseEvent;
  connectingNodeId: OnConnectStartParams | null;
  screenToFlowPosition: (position: XYPosition) => XYPosition;
  edgeLabel: string;
};
export const createTextNodeWithEdgesFromFlow = (
  options: CreateTextNodeWithEdgesFlowOptions
) => {
  // Checking if connection is established
  if (!options.connectingNodeId) return;

  const evt = options.event as MouseEvent;
  const target = options.event.target as HTMLDivElement;
  const { handleId: sourceHandleId, nodeId: sourceNodeId } =
    options.connectingNodeId;

  const targetIsPane = target.classList.contains("react-flow__pane");
  const position = offsetScreenPosition({
    x: evt.clientX,
    y: evt.clientY,
    handleId: sourceHandleId,
  });

  if (targetIsPane) {
    return createTextNodeWithEdge({
      node: {
        sourceHandleId,
        position: options.screenToFlowPosition({
          x: position.x,
          y: position.y,
        }),
      },
      edge: {
        label: options.edgeLabel,
        sourceNodeId: sourceNodeId as string,
      },
    });
  }
};

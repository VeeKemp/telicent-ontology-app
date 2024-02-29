import { Edge, Node } from "reactflow";

import Diagram from "../models/diagram";
import { fetchDiagram } from "./ApiManager";

export const getDiagramNodesAndEdges = async (diagramId: string) => {
  const nodes = await fetchDiagram(diagramId);

  const diagramNodes = Object.keys(nodes.diagramElements).map((uri) =>
    Diagram.createNodeFromDetails(uri, nodes.diagramElements[uri])
  );

  const diagramEdges = Object.entries(nodes.diagramRelationships).map(
    ([uri, relationship]) => Diagram.createEdge(uri, relationship)
  );

  return { diagramEdges, diagramNodes };
};

const generateShortGUID = () => {
  const buffer = new Uint8Array(16);
  window.crypto.getRandomValues(buffer);
  return Array.from(buffer)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .substring(0, 8);
};

export const createInstanceNodesEdges = (ontologyNodes: Node[]) => {
  ontologyNodes.forEach((node) => {
    const guid = generateShortGUID();
    node.data.label = node.data.label.substring(0, 2); //`${node.data.label.toLowerCase()}_${guid}`
    // make a new id which is namespace + class name + short guid
    node.id = `http://telicent.io/data/${node.id.split("#")[1]}_${guid}`;
    // Alecs: Commenting this out for now as I'm not sure what it suppose to
    // happen. Getting lots of type errors :(. Also can't find where
    // ResizableCircleNode custom node lives. I don't think this fuctionality is
    // completely done yet.
    // const { backgroundColor } = node.style;
    // node.style.borderColor = backgroundColor;
    // node.style.color = backgroundColor;
    // node.style.backgroundColor = "black";
    // node.style.borderWidth = 5;
    node.type = "ResizableCircleNode";
  });
  const edgesToRender: Edge[] = [];
  return { nodes: ontologyNodes, edges: edgesToRender };
};

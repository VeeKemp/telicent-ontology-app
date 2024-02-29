type DiagramEdge = {
  uri: string;
  representedRelationship: string;
  source: string;
  target: string;
  inDiagram: string; // What is this used for?
};

type DiagramNode = {
  uri: string;
  representedElement: string;
  inDiagram: string;
  abacLabels: string;
  style: DiagramNodeStyle;
};

type DiagramNodeStyle = {
  shape: NodeShape;
  x: number;
  y: number;
  bgColour: string;
  colour: string;
} & Partial<{
  borderColour: string;
  icon: string;
  height: number;
  width: number;
}>;

type NodeShape = "diamond" | "roundrectangle" | "parallelogram";
type NodeType = "class" | "objectProperty" | "dataTypeProperty";

type NodeData = {
  uri: string;
  label: string;
  namespace?: string;
  backgroundColor?: string;
  color?: string;
  iconClass?: string;
  created: boolean;
};

type TextNodeData = {
  label: string;
  rdfTriple: string[];
};

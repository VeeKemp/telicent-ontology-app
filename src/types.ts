/* eslint-disable @typescript-eslint/no-explicit-any */
import { CSSProperties } from "react";
import { MarkerType } from "reactflow";
import { Element, Relationship } from "./services/ApiManager";

export interface OntologyNodeData {
  label: string;
  fa: string;
  style: {
    backgroundColor: string;
    color: string;
  };
}

interface RelationType {
  type: MarkerType;
  lineStyle: string;
  color: string;
  width: number;
  height: number;
}

const RelTypeToMarkerMap: Record<string, RelationType> = {
  "http://www.w3.org/2000/01/rdf-schema#subClassOf": {
    type: MarkerType.ArrowClosed,
    lineStyle: "step",
    color: "#0000FF",
    width: 20,
    height: 20,
  },
  "http://www.w3.org/2000/01/rdf-schema#subPropertyOf": {
    type: MarkerType.ArrowClosed,
    lineStyle: "step",
    color: "#00008B",
    width: 20,
    height: 20,
  },
  "http://www.w3.org/2000/01/rdf-schema#domain": {
    type: MarkerType.Arrow,
    lineStyle: "floating",
    color: "#555",
    width: 20,
    height: 20,
  },
  "http://www.w3.org/2000/01/rdf-schema#range": {
    type: MarkerType.Arrow,
    lineStyle: "floating",
    color: "#555",
    width: 20,
    height: 20,
  },
};

const RelationTypes = Object.keys(RelTypeToMarkerMap).map((key) => [
  key,
  key.split("#")[1],
]);

enum AppViewModes {
  Ontology,
  Instance,
}


class InstanceNode {
  uri: string;
  id: string;
  position: { x: number; y: number };
  data: { label: string };
  style: any;
  type: string;
  rdfType: string = '';
  icon: { fa: string };
  constructor(options: any) {
    const style = JSON.parse(options.elemStyle);
    const { x, y, bgColour, colour, borderColour, height, width, icon } = style;
    this.uri = options.representedElement;
    this.id = options.id;
    this.position = {
      x: x,
      y: y,
    };
    this.data = {
      label: options.diagElem,
    };
    this.style = {
      backgroundColor: bgColour || "#000",
      color: colour || "#000",
      borderColor: borderColour || "#000",
      border: "solid",
      height: height,
      width: width,
      borderWidth: 3,
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      alignContent: "center",
      justifyContent: "center",
    };
    this.type = "ResizableSquareNode";
    this.icon = {
      fa: icon || "fa-solid fa-cube",
    };
  }
}

class InstanceEdge {
  id: string;
  uri: string;
  source: string;
  target: string;
  label: string;
  type: string;
  markerEnd: {
    type: MarkerType;
    color?: string;
    width: number;
    height: number;
  };
  style: { stroke: string; strokeWidth: number };
  updatable: boolean;
  interactionWidth: number;
  constructor(options) {
    this.id = options.diagRel;
    this.source = options.source;
    this.target = options.target;
    this.uri = options.representedRelationship;
    this.label = options.representedRelationship.split("#")[1];
    this.type =
      RelTypeToMarkerMap[options.representedRelationship]?.lineStyle ||
      "floating";
    (this.markerEnd = RelTypeToMarkerMap[options.representedRelationship]),
      (this.style = {
        stroke: RelTypeToMarkerMap[options.representedRelationship]?.color,
        strokeWidth: 2,
      });
    (this.updatable = true), (this.interactionWidth = 150);
  }
}

export {
  InstanceNode,
  InstanceEdge,
  RelationTypes,
  RelTypeToMarkerMap,
  AppViewModes,
};

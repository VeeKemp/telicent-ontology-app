import React, { useCallback, useContext, useRef, useState } from "react";
import {
  useNodesState,
  useEdgesState,
  updateEdge,
  Connection,
  Node,
  addEdge,
  useReactFlow,
  OnConnectStart,
  OnConnectEnd,
  OnConnectStartParams,
  Edge,
} from "reactflow";
import { Readable } from "readable-stream";
import { Quad } from "@rdfjs/types";
import rdfParser from "rdf-parse";
import { useDispatch, useSelector } from "react-redux";

import {
  selectAttribute,
  addRDFCode,
  writeRDFCode,
  deleteRDFCodeLine,
  updateRDFPrefix,
} from "../../../reducers/InstanceViewSlice";
import { FlowNode, Diagram, Namespace, RDF } from "../../../models";
import { GlobalContext, StringKeyObject } from "../../../context/GlobalContext";

import iesClassStylesMap from "./ies_class_styles.json";
import {
  createTextNodeWithEdgesFromFlow,
  createTextNodesWithEdgesFromTriples,
} from "./create-text-node-with-edge";

export const getId = () =>
  `node_${Math.random().toString(36).substring(2, 18)}`;

interface ClassStyle {
  [key: string]: unknown;
  name: string;
  diagID: string;
  uri: string;
  abbreviation: string;
  style: {
    shape: string;
    colour: string;
    bgColour: string;
    borderColour: string;
    icon: string;
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

const useDrawGraph = () => {
  const dispatch = useDispatch();
  const attribute = useSelector(selectAttribute);
  const reactFlowWrapper = useRef<any>(null);
  const connectingNodeId = useRef<OnConnectStartParams | null>(null); // Used for connecting edges on drop
  const { screenToFlowPosition, getNode } = useReactFlow();

  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const { relationships } = useContext(GlobalContext);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectionOnDrag, setSelectionOnDrag] = useState(true);
  const [dragData, setDragData] = useState<string | null>(null);
  const [relationship, setRelationship] = useState(
    Object.keys(relationships).sort()[0]
  );

  const onEdgeConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) {
        console.warn("onEdgeConnect -> missing source or target");
        return;
      }

      if (params.sourceHandle && params.targetHandle) {
        const edgeData = {
          source: params.source,
          relationship,
          target: params.target,
          sourceHandle: params.sourceHandle,
          targetHandle: params.targetHandle,
        };

        // reset connection
        connectingNodeId.current = null;

        const newEdge = Diagram.createEdge(getId(), edgeData);
        setEdges((eds) => addEdge(newEdge, eds));
      }

      /*
       * When writing text into the RDF editor, it switches the prefix for the full URI.
       * Just to get the app working consistently for now, a manual check looks to see if
       * it is a URI or not.
       */

      let subject = Namespace.stripUri(params.source) ?? params.source;
      let object = Namespace.stripUri(params.target) ?? params.target;
      let rdf = RDF.createTripleOnNewLine({
        subject: `data:${subject}`,
        predicate: relationship,
        object: `data:${object}`,
      }).convertToString();

      if (object.startsWith("textNode_")) {
        rdf = RDF.createTripleOnNewLine({
          subject: `data:${subject}`,
          predicate: relationship,
          object: RDF.createLiteral(getNode(params.target)?.data.label),
        }).convertToString();
      }

      if (subject.startsWith("textNode_")) {
        rdf = RDF.createTripleOnNewLine({
          subject: RDF.createLiteral(getNode(params.source)?.data.label),
          predicate: relationship,
          object: `data:${object}`,
        }).convertToString();
      }

      dispatch(addRDFCode(rdf));
    },
    [relationship, setEdges]
  );

  const onEdgeUpdate = useCallback((oldEdge: any, newConnection: any) => {
    setEdges((eds) => updateEdge(oldEdge, newConnection, eds));
  }, []);

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onNodeDrop = (event: React.DragEvent) => {
    if (!dragData) {
      return;
    }

    event.preventDefault();
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const data = JSON.parse(dragData);
    if (!data) {
      return;
    }

    const label = data.label;

    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    // TODO there must be a better way
    const { style } =
      (iesClassStylesMap[
        label as keyof typeof iesClassStylesMap
      ] as ClassStyle) ||
      (iesClassStylesMap["Entity"] as ClassStyle) ||
      {};

    const nodeStyle: DiagramNodeStyle = {
      shape: "roundrectangle",
      colour: "white",
      bgColour: style.bgColour,
      borderColour: "white",
      x: position.x,
      y: position.y,
      height: 43,
      width: 107,
    };

    const newNode = Diagram.createNodeFromDefaultOptions({
      label,
      style: nodeStyle,
    });

    setNodes((nodes) => nodes.concat(newNode));
    dispatch(
      addRDFCode(
        RDF.createTripleOnNewLine({
          subject: `data:${newNode.id}`,
          predicate: "a",
          object: `ies:${label}`,
        }).convertToString()
      )
    );
  };

  const handleSetRelationship = (r: string) => {
    setRelationship(r);
  };

  const handleRdfInput = (rdfInput?: string) => {
    if (!rdfInput) return;

    dispatch(writeRDFCode(rdfInput));

    // @ts-expect-error
    const input = Readable.from([rdfInput]);
    const nodeQuads: Quad[] = [];
    const edgeQuads: Quad[] = [];
    const textQuads: Quad[] = [];
    // const output = formats.parsers.import("text/turtle", input);
    rdfParser
      .parse(input, { contentType: "text/turtle" })
      .on("prefix", (prefix, namespace) =>
        dispatch(updateRDFPrefix({ prefix, value: namespace.id }))
      )
      .on("data", (triple) => {
        if (triple.object.termType === "Literal") {
          textQuads.push(triple);
          return;
        }

        if (Object.values(relationships).includes(triple.predicate.value)) {
          edgeQuads.push(triple);
        } else {
          nodeQuads.push(triple);
        }
      })
      .on("end", () => {
        /*
         * Note: we redraw every node each time because
         * if the user removes the corresponding code about a node
         * we want it to disappear from the diagram.
         * But we want positions to persist so we find them each time.
         */
        const stagedNodes = nodeQuads.map((triple) => {
          const value = triple.object.value;

          let namespace = "";
          let label = "";
          if (value.includes("#")) {
            [namespace, label] = value.split("#");
          } else {
            const i = value.lastIndexOf("/") + 1;
            namespace = value.substring(0, i);
            label = value.substring(i);
          }

          const iesClassStyle =
            iesClassStylesMap[label as keyof typeof iesClassStylesMap];

          const matchingNode = nodes.find((n) => {
            return n.id === triple.subject.value;
          });

          const position = { x: 100, y: 100 }; //TODO work out how to position nodes from text
          const nodeStyle: DiagramNodeStyle = {
            shape: "roundrectangle",
            colour: "white",
            bgColour: iesClassStyle?.style?.bgColour ?? "black",
            borderColour: "white",
            x: matchingNode?.position.x ?? position.x,
            y: matchingNode?.position.y ?? position.y,
            height: 43,
            width: 107,
          };

          const newNode = Diagram.createNodeFromDetails(triple.subject.value, {
            style: nodeStyle,
            namespace,
            element: triple.object.value,
          });
          return newNode;
        });

        const stagedEdges = edgeQuads.map((triple) => {
          const target = triple.object.value;
          const source = triple.subject.value;
          const relationship = triple.predicate.value;
          const id = getId();

          return Diagram.createEdge(id, { source, target, relationship });
        });

        const { nodes: textNodes, edges: textNodeEdges } =
          createTextNodesWithEdgesFromTriples({
            triples: textQuads,
            nodes,
            getNode,
          });

        setNodes([...stagedNodes, ...textNodes]);
        setEdges([...stagedEdges, ...textNodeEdges]);
      });
  };

  const onNodesDelete = (nodes: Node[]) => {
    nodes.forEach((node) => {
      if (FlowNode.isTextNode(node)) {
        const data = node.data as TextNodeData;
        dispatch(deleteRDFCodeLine({ rdfCodeLine: data.rdfTriple }));
      } else dispatch(deleteRDFCodeLine({ nodeId: node.id }));
    });
  };

  const onConnectStart: OnConnectStart = useCallback((_, params) => {
    connectingNodeId.current = params;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const textNodeWithEdge = createTextNodeWithEdgesFromFlow({
        event: event as MouseEvent,
        connectingNodeId: connectingNodeId.current,
        screenToFlowPosition,
        edgeLabel: attribute,
      });
      if (textNodeWithEdge) {
        setNodes((nodes) => [...nodes, textNodeWithEdge.node]);
        setEdges((edges) => addEdge(textNodeWithEdge.edge, edges));
        dispatch(
          addRDFCode(RDF.convertToString(textNodeWithEdge.node.data.rdfTriple))
        );
      }
    },
    [attribute]
  );

  const onEdgesDelete = (edges: Edge[]) => {
    edges.forEach((edge) => {
      dispatch(deleteRDFCodeLine({ source: edge.source, target: edge.target }));
    });
  };

  return {
    hookProps: {
      nodes,
      edges,
      onNodesChange,
      onConnect: onEdgeConnect,
      onEdgeUpdate,
      onEdgesChange,
      onDrop: onNodeDrop,
      onDragOver,
      onInit: setReactFlowInstance,
      selectionOnDrag,
      onNodesDelete,
      onConnectStart,
      onConnectEnd,
      onEdgesDelete,
    },
    sidebarProps: {
      handleSetRelationship,
      handleRdfInput,
      reactFlowWrapper,
      setDragData,
    },
  };
};

export default useDrawGraph;

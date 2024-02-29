import { lowerCase, upperFirst } from "lodash";
import { Edge, EdgeMarker, MarkerType, Node } from "reactflow";
import { getId } from "../components/DiagramCreator/hooks/useDrawGraph";

type NodeDefaultOptions = {
  label: string;
  style: DiagramNodeStyle;
};

export type NodeDetails = {
  element: string;
  namespace?: string;
  style: DiagramNodeStyle;
};

type EdgeDefaultOptions = {
  source: string;
  target: string;
};

class Diagram {
  static updateableEdges = [
    "http://www.w3.org/2000/01/rdf-schema#subClassOf",
    "http://www.w3.org/2000/01/rdf-schema#subPropertyOf",
    "http://www.w3.org/2000/01/rdf-schema#domain",
    "http://www.w3.org/2000/01/rdf-schema#range",
  ];

  static createNodeFromDetails(
    uri: string,
    details: NodeDetails
  ): Node<NodeData> {
    const { element, namespace, style } = details;
    const nodeLabel = this.getURLFragment(element ?? "");
    const type = this.findNodeType(style.shape);
    const nodeStyles = this.createNodeStyles(type, style);

    return {
      id: uri,
      type,
      position: { x: style.x, y: style.y },
      data: {
        uri: element,
        namespace,
        created: false, //TODO: what does this mean?
        label: this.getUserFriendlyLabel(nodeLabel),
        ...nodeStyles,
      },
    };
  }

  static createNodeFromDefaultOptions(
    defaultOptions: Partial<NodeDefaultOptions>
  ): Node<NodeData> {
    const id = getId();
    const shape = defaultOptions?.style?.shape ?? "roundrectangle";
    const position = {
      x: defaultOptions?.style?.x ?? 0,
      y: defaultOptions?.style?.y ?? 0,
    };
    const optionsStyle = defaultOptions?.style
      ? this.createNodeStyles(
          this.findNodeType(defaultOptions?.style.shape),
          defaultOptions?.style
        )
      : {};
    const type = this.findNodeType(shape);
    const label = defaultOptions?.label ?? "Class";

    return {
      id,
      type,
      position: { x: position?.x ?? 0, y: position?.y ?? 0 },
      data: {
        label: defaultOptions?.label ?? "Class",
        uri: label,
        namespace: "",
        created: false,
        ...optionsStyle,
      },
    };
  }

  static createEdge(
    uri: string,
    details: {
      source: string;
      target: string;
      relationship: string;
      sourceHandle?: string;
      targetHandle?: string;
    },
    defaultOptions?: EdgeDefaultOptions
  ): Edge {
    const id = uri;
    const { relationship, target, source } = details;
    const configuredEdge = Diagram.configureEdge(
      relationship,
      details.sourceHandle,
      details.targetHandle
    );

    if (!source || !target) {
      // eslint-disable-next-line no-console
      console.warn(
        "Unable to create edge. Provide source and target node default options"
      );
    }

    return {
      id,
      source: source ?? "",
      target: target ?? "",
      ...configuredEdge,
    };
  }

  updateEdge(representedRelationship: string, edge: Edge) {
    const configuredEdge = Diagram.configureEdge(representedRelationship);
    return { ...edge, ...configuredEdge };
  }

  get updateableEdges() {
    return Diagram.updateableEdges;
  }

  get updateableEdgeOptions() {
    return Diagram.updateableEdges.map((representedRelationship) => {
      const label = Diagram.getURLFragment(representedRelationship);

      return {
        label: Diagram.getUserFriendlyLabel(label),
        value: representedRelationship,
      };
    });
  }

  static getURLFragment(uri: string) {
    if (uri.startsWith("http") && uri.includes("#")) {
      return uri.split("#")[1];
    }
    return uri;
  }

  static getUserFriendlyLabel(label: string) {
    return upperFirst(lowerCase(label));
  }

  static findNodeType(shape?: string) {
    if (shape === "diamond") {
      return "objectProperty";
    }

    if (shape === "parallelogram") {
      return "dataTypeProperty";
    }

    return "class";
  }

  static createNodeStyles(type: NodeType, style: DiagramNodeStyle) {
    if (type === "class") {
      const newStyles = Diagram.getNewClassStyle(style.bgColour, style.colour);
      return {
        ...newStyles,
        iconClass: style.icon,
      };
    }
  }

  /**
   * Temporary function which returns updated IES color styles. It can be removed
   * when the ontology server is updated
   * @param bgColour Background color from ontology server
   * @param color Color from ontology server
   */
  static getNewClassStyle(bgColour: string, color: string) {
    // Events
    if (bgColour === "#FF8AD8") {
      return {
        backgroundColor: "#1F0418",
        color: "#F092D5",
      };
    }

    // Participants
    if (bgColour === "#8f34eb") {
      return {
        backgroundColor: "#0F0024",
        color: "#BA85FF",
      };
    }

    // Entity
    if (bgColour === "#FFFF00") {
      return {
        backgroundColor: "#242400",
        color: "#E9E829",
      };
    }

    // Classes
    if (bgColour === "#00B0F0") {
      return {
        backgroundColor: "#05151F",
        color: "#5EB3E7",
      };
    }

    // Period of time
    if (bgColour === "#FF7F50") {
      return {
        backgroundColor: "#1F0F05",
        color: "#DF8244",
      };
    }

    // State
    if (bgColour === "#FFC000") {
      return {
        backgroundColor: "#221801",
        color: "#F6C143",
      };
    }

    if (bgColour === "#909090") {
      return {
        backgroundColor: "#121212",
        color: "#f5f5f5",
      };
    }

    return {
      backgroundColor: bgColour,
      color: color,
    };
  }

  static configureEdge(
    representedRelationship: string,
    sourceHandle?: string,
    targetHandle?: string
  ) {
    const label = Diagram.getURLFragment(representedRelationship);
    const edgeProperties = Diagram.getEdgeProperties(representedRelationship);

    const markerEnd: EdgeMarker = {
      type: edgeProperties.markerEndType,
      color: edgeProperties.color,
      width: 16,
      height: 14,
      strokeWidth: 1.5,
    };

    return {
      label: Diagram.getUserFriendlyLabel(label).toLowerCase(),
      type: edgeProperties.edgeType,
      sourceHandle: sourceHandle ?? edgeProperties.sourceHandle,
      targetHandle: targetHandle ?? edgeProperties.targetHandle,
      markerEnd,
      updatable: edgeProperties.isUpdatable,
      style: {
        stroke: edgeProperties.color,
        strokeWidth: 2,
      },
    };
  }

  static getEdgeProperties(representedRelationship: string) {
    /**
     * Note: sourceHandle and targetHandle should have the value as the id in
     * <NodeHandles />
     */

    const isSubClass =
      representedRelationship ===
        "http://www.w3.org/2000/01/rdf-schema#subClassOf" ||
      representedRelationship ===
        "http://www.w3.org/2000/01/rdf-schema#subPropertyOf";

    const isDomainOrRange =
      representedRelationship ===
        "http://www.w3.org/2000/01/rdf-schema#domain" ||
      representedRelationship === "http://www.w3.org/2000/01/rdf-schema#range";

    const domainOrRangeEdgeProps = {
      edgeType: "step",
      isUpdatable: true,
      markerEndType: MarkerType.Arrow,
      color: "#949494",
      sourceHandle: "handle-left",
      targetHandle: "handle-right",
    };

    if (isSubClass) {
      return {
        ...domainOrRangeEdgeProps,
        markerEndType: MarkerType.ArrowClosed,
        color: "#066FD1",
        sourceHandle: "handle-top",
        targetHandle: "handle-bottom",
      };
    }

    if (isDomainOrRange) {
      return domainOrRangeEdgeProps;
    }

    return {
      ...domainOrRangeEdgeProps,
      isUpdatable: false,
      edgeType: "abstractedRelationship",
    };
  }
}

export default Diagram;

import { Edge, MarkerType } from "reactflow";

type EdgeConfig = { source: string; target: string } & Partial<{ id: string }>;

class FlowEdge {
  private id: string;
  private source: string;
  private target: string;

  private markerType: MarkerType = MarkerType.Arrow;
  private color: string = "#949494";
  private type: string = "smoothstep";

  private label?: string;
  private sourceHandle?: string;
  private targetHandle?: string;

  constructor(config: EdgeConfig) {
    this.source = config.source;
    this.target = config.target;
    this.id = config?.id ?? crypto.randomUUID();
  }

  setLabel(label: string) {
    this.label = label;
    return this;
  }

  setType(type: string) {
    this.type = type;
    return this;
  }

  setSourceHandle(sourceHandle?: string) {
    this.sourceHandle = sourceHandle;
    return this;
  }

  setTargetHandle(targetHandle?: string) {
    this.targetHandle = targetHandle;
    return this;
  }

  setColor(color: string) {
    this.color = color;
    return this;
  }

  setMarkerType(type: MarkerType) {
    this.markerType = type;
    return this;
  }

  createEdge(): Edge {
    return {
      id: this.id,
      source: this.source,
      target: this.target,
      type: this.type,
      label: this.label,
      sourceHandle: this.sourceHandle,
      targetHandle: this.targetHandle,
      markerEnd: {
        type: this.markerType,
        color: this.color,
        width: 16,
        height: 14,
        strokeWidth: 1.5,
      },
      style: {
        stroke: this.color,
        strokeWidth: 2,
      },
    };
  }
}

export default FlowEdge;

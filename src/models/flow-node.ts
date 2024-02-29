import { Node, XYPosition } from "reactflow";

type NodeConfig<Data> = Partial<{
  id: string;
  idPrefix: string;
  position: XYPosition;
  data: Data;
}>;

class FlowNode<Data = any> {
  private id: string;
  private idPrefix: string;
  private position: XYPosition;
  private data: Data;

  private type: string = "class";

  constructor(config: NodeConfig<Data> = {}) {
    this.idPrefix = config?.idPrefix ?? "node";
    this.id = config?.id ?? `${this.idPrefix}_${crypto.randomUUID()}`;
    this.position = config?.position ?? { x: 0, y: 80 };
    this.data = config?.data ?? ({} as Data);
  }

  setType(type: string) {
    this.type = type;
    return this;
  }

  createNode(): Node<Data> {
    return {
      id: this.id,
      type: this.type,
      position: this.position,
      data: this.data,
    };
  }

  static isTextNode(node: Node) {
    return node.type === "text";
  }
}

export default FlowNode;

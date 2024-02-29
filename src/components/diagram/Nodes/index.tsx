import { NodeProps } from "reactflow";

import ClassNode from "./ClassNode";
import DataTypePropertyNode from "./DataTypePropertyNode";
import ObjectPropertyNode from "./ObjectPropertyNode";
import TextNode from "./TextNode";

const InstanceClassNode: React.FC<NodeProps> = ({ data }) => (
  <ClassNode hideType data={data} />
);

const NODE_TYPES = {
  class: ClassNode,
  objectProperty: ObjectPropertyNode,
  dataTypeProperty: DataTypePropertyNode,
};

const INSTANCE_NODE_TYPES = {
  class: InstanceClassNode,
  text: TextNode,
};

export default NODE_TYPES;
export {
  ClassNode,
  DataTypePropertyNode,
  ObjectPropertyNode,
  INSTANCE_NODE_TYPES,
};

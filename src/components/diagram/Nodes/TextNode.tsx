import React, { useState } from "react";
import { TeliInput } from "@telicent-oss/ds";
import { NodeProps, useReactFlow } from "reactflow";
import { useDispatch } from "react-redux";
import classNames from "classnames";

import { replaceRDFCodeLine } from "../../../reducers/InstanceViewSlice";
import NodeHandles from "./NodeHandles";

const escapeDoubleQuotes = (value: string) => {
  return value.replace(/"/g, '\\"');
};

const InstanceTextNode: React.FC<NodeProps<TextNodeData>> = ({
  id,
  selected,
  data,
}) => {
  const dispatch = useDispatch();
  const { setNodes } = useReactFlow<TextNodeData>();
  const [isEditable, setIsEditable] = useState(false);
  const [comment, setComment] = useState(data.label);

  const handleEnableEditing = () => {
    setIsEditable(true);
  };

  const handleDisableEditing = () => {
    setIsEditable(false);
  };

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const enteredComment = event.target.value;

    setComment(enteredComment);

    if (!data.rdfTriple) {
      console.error(`RDF Triple is not set for node ${id}`);
      return;
    }

    const updatedRdfTriple = [...data.rdfTriple];
    updatedRdfTriple[2] = `"${escapeDoubleQuotes(enteredComment)}"`;

    setNodes((nodes) => {
      return nodes.map((node) => {
        if (node.id === id) {
          node.data = {
            ...node.data,
            label: enteredComment,
            rdfTriple: updatedRdfTriple,
          };
        }
        return node;
      });
    });

    dispatch(
      replaceRDFCodeLine({
        rdfLine: data.rdfTriple,
        updatedRdfLine: updatedRdfTriple,
      })
    );
  };

  return (
    <>
      <NodeHandles />
      <div
        className={classNames(
          "bg-black-200 p-2 rounded-xl border flex justify-center items-center hover:border-whiteSmoke-300",
          {
            "border-whiteSmoke-600": !isEditable || !selected,
            "border-whiteSmoke-300": isEditable || selected,
          }
        )}
        style={{ width: 160, minHeight: 54 }}
      >
        <TeliInput
          multiline
          placeholder="Add text"
          cursor={isEditable ? "text" : "pointer"}
          textAlign="center"
          className={classNames({ nodrag: isEditable })}
          value={comment}
          onChange={handleCommentChange}
          onClick={handleEnableEditing}
          onBlur={handleDisableEditing}
        />
      </div>
    </>
  );
};

export default InstanceTextNode;

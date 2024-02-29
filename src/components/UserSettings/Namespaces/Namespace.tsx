import React, { useState } from "react";
import { TeliButton, TeliDeleteIcon, TeliEditIcon } from "@telicent-oss/ds";

import { useAppDispatch } from "../../../hooks";
import {
  deleteNamespace,
  updateNamespace,
} from "../../../reducers/NamespaceSlice";
import NamespaceForm from "./NamespaceForm";

type NamespaceProps = NamespaceObject;

const Namespace: React.FC<NamespaceProps> = ({ active, id, prefix, uri }) => {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);

  const handleEditNamespace = () => {
    setEditing(true);
  };

  const handleDismissEditing = () => {
    setEditing(false);
  };

  const handleSaveEditedChanges = (
    updatedNamespace: Pick<NamespaceObject, "prefix" | "uri">
  ) => {
    dispatch(updateNamespace({ id, active, ...updatedNamespace }));
    setEditing(false);
  };

  const handleNamespaceDeletion = () => {
    dispatch(deleteNamespace({ id }));
  };

  if (editing) {
    return (
      <NamespaceForm
        validate
        prefix={prefix}
        uri={uri}
        onCancel={handleDismissEditing}
        onSave={handleSaveEditedChanges}
      />
    );
  }

  return (
    <li aria-label={prefix} className="flex gap-x-3 justify-between">
      <div>
        <h3>{prefix}</h3>
        <p className="text-sm">{uri}</p>
      </div>
      <div className="flex gap-x-3 h-fit">
        <TeliButton aria-label="Edit namespace" onClick={handleEditNamespace}>
          <TeliEditIcon />
        </TeliButton>
        <TeliButton
          aria-label="Delete namespace"
          onClick={handleNamespaceDeletion}
          disabled={active}
        >
          <TeliDeleteIcon />
        </TeliButton>
      </div>
    </li>
  );
};

export default Namespace;
export type { NamespaceProps };

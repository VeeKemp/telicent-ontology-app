import React from "react";
import { TeliAddIcon, TeliButton } from "@telicent-oss/ds";

type NamespaceActionsProps = {
  onAdd: () => void;
};

const NamespaceActions: React.FC<NamespaceActionsProps> = ({ onAdd }) => {
  return (
    <ul aria-label="Namespace toolbar" className="flex justify-end">
      <li>
        <TeliButton aria-label="Add new namespace" onClick={onAdd}>
          <TeliAddIcon />
        </TeliButton>
      </li>
    </ul>
  );
};

export default NamespaceActions;

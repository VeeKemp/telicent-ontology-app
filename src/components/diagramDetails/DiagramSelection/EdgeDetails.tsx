import React, { useState } from "react";
import { Edge } from "reactflow";
import {
  TeliButton,
  TeliDeleteIcon,
  TeliSelect,
} from "@telicent-oss/ds";

import AlertDialog from "../../AlertDialog/AlertDialog";
import { deleteRelationship } from "../../../services/ApiManager";
import Diagram from "../../../models/diagram";
import { SelectChangeEvent } from "@mui/material";

type EdgeDetailsProps = {
  data: Edge;
  onChange: (edgeId: string, newData: Edge) => void;
  remove: (nodeId: string) => void;
};

const EdgeDetails: React.FC<EdgeDetailsProps> = ({
  data,
  onChange,
  remove,
}) => {
  // only used if one edge is selected
  const { id, source } = data;
  const diagram = new Diagram();
  const egdeOptions = diagram.updateableEdgeOptions;
  const selectedEdgeValue = egdeOptions.find(
    (option) => option.label.toLowerCase() === data.label
  )?.value;

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedOption, setSelectedOption] = useState(selectedEdgeValue);

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteAccept = async () => {
    setShowDeleteDialog(false);
    await deleteRelationship(id, source);
    /**
     * CRITCAL
     * - remove -> onRemove
     * - parent.onRemove includes deleteRelationship call
     */
    remove(id);
  };

  const handleDataInputChange = (event: SelectChangeEvent) => {
    const { value: representedRelationship } = event.target;
    if (representedRelationship) {
      const updatedEgde = diagram.updateEdge(representedRelationship, data);
      onChange(id, updatedEgde);
      setSelectedOption(representedRelationship);
    }
  };

  return (
    <div className="flex flex-col relative p-2 overflow-y-auto">
      <div className="flex items-center px-2">
        <h2 className="description text-lg pb-2 flex-grow">Edge Detail</h2>
        <TeliButton
          aria-label="Delete edge"
          onClick={handleDelete}
          size="small"
        >
          <TeliDeleteIcon />
        </TeliButton>
      </div>
      <TeliSelect
        id="edge-selection"
        label="Edge type"
        value={selectedOption}
        onChange={handleDataInputChange}
        options={egdeOptions}
      />
      <AlertDialog
        open={showDeleteDialog}
        title="Delete this relationship"
        content="Deleting this relationship will remove it from the ontology"
        onAccept={handleDeleteAccept}
        onClose={() => setShowDeleteDialog(false)}
      />
    </div>
  );
};

export default EdgeDetails;
export type { EdgeDetailsProps };

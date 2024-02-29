import React, { FC, SyntheticEvent, useState, useContext } from "react";
import { TeliAutocomplete } from "@telicent-oss/ds";

import { GlobalContext } from "../../../context/GlobalContext";

const RelationshipPicker: FC<{
  onSetRelationship: (relationship: string) => void;
}> = ({ onSetRelationship }) => {
  const { relationships } = useContext(GlobalContext);
  const relationshipShortUris = Object.keys(relationships).sort();
  const [activeRelationship, setActiveRelationship] = useState(
    relationshipShortUris[0] ?? ""
  );
  const [inputValue, setInputValue] = useState("");

  const handleRelationshipChange = (
    event: SyntheticEvent<Element, Event>,
    value: string | null
  ) => {
    if (value != null) {
      setActiveRelationship(value);
      onSetRelationship(value);
    }
  };

  const handleInputChange = (
    event: SyntheticEvent<Element, Event>,
    newInputValue: string
  ) => {
    setInputValue(newInputValue);
  };

  return (
    <div className="p-4 flex-grow">
      <TeliAutocomplete
        options={relationshipShortUris}
        value={activeRelationship}
        onChange={handleRelationshipChange}
        onInputChange={handleInputChange}
        inputValue={inputValue}
        fullWidth
      />
    </div>
  );
};

export default RelationshipPicker;

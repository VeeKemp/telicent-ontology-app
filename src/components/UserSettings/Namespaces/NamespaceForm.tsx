import React, { useState } from "react";
import { TeliButton, TeliTextField } from "@telicent-oss/ds";
import { useSelector } from "react-redux";

import { selectNamespaces } from "../../../reducers/NamespaceSlice";
import { findError, validateForm } from "./namespace-utils";

type NamespaceFormProps = Partial<Pick<NamespaceObject, "prefix" | "uri">> & {
  hide?: boolean;
  onCancel: () => void;
  onSave: (namespace: Pick<NamespaceObject, "prefix" | "uri">) => void;
  validate?: boolean;
};

type NamespaceFormLabel = "prefix" | "uri";

type NamespaceFormError = {
  formLabel: NamespaceFormLabel;
  error: boolean;
  helperText: string;
};

const NamespaceForm: React.FC<NamespaceFormProps> = ({
  hide = false,
  onCancel,
  onSave,
  prefix = "",
  uri = "",
}) => {
  const namespaces = useSelector(selectNamespaces);
  const [prefixValue, setPrefixValue] = useState(prefix);
  const [uriValue, setUriValue] = useState(uri);
  const [errors, setErrors] = useState<NamespaceFormError[]>([]);

  const editedPrefix = prefix !== prefixValue;
  const editedUri = uri !== uriValue;
  const edited = editedPrefix || editedUri;
  const emptyValues = !Boolean(uriValue.trim()) || !Boolean(prefixValue.trim());

  const prefixError = findError(errors, "prefix");
  const uriError = findError(errors, "uri");

  const handlePrefixChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrefixValue(event.target.value);
  };

  const handleUriChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUriValue(event.target.value);
  };

  const resetForm = () => {
    setPrefixValue("");
    setUriValue("");
    setErrors([]);
  };

  const handleSaveChanges = () => {
    const { hasErrors, errors } = validateForm({
      namespaces,
      prefix: { edited: editedPrefix, value: prefixValue },
      uri: { edited: editedUri, value: uriValue },
    });

    if (hasErrors) {
      setErrors(errors);
      return;
    }

    onSave({ prefix: prefixValue, uri: uriValue });
    resetForm();
  };

  const handleCancel = () => {
    onCancel();
    resetForm();
  };

  if (hide) return null;

  return (
    <form
      id="namespace-info"
      aria-label="Namespace information"
      className="space-y-5"
    >
      <TeliTextField
        fullWidth
        label="Prefix"
        value={prefixValue}
        onChange={handlePrefixChange}
        error={prefixError?.error}
        helperText={prefixError?.helperText}
      />
      <TeliTextField
        fullWidth
        label="Uri"
        value={uriValue}
        onChange={handleUriChange}
        error={uriError?.error}
        helperText={uriError?.helperText}
      />
      <div className="flex gap-x-3 justify-end">
        <TeliButton size="small" variant="secondary" onClick={handleCancel}>
          Cancel
        </TeliButton>
        <TeliButton
          size="small"
          variant="primary"
          onClick={handleSaveChanges}
          disabled={emptyValues || !edited}
        >
          Apply
        </TeliButton>
      </div>
    </form>
  );
};

export default NamespaceForm;
export type { NamespaceFormProps, NamespaceFormError, NamespaceFormLabel };

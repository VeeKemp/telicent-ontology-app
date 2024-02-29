import { NamespaceFormLabel, NamespaceFormError } from "./NamespaceForm";

type ValidateForm = {
  namespaces: NamespaceObject[];
  prefix: {
    edited: boolean;
    value: string;
  };
  uri: {
    edited: boolean;
    value: string;
  };
};

type EditedValue = {
  label: NamespaceFormLabel;
  value: string;
};

export const findError = (
  errors: NamespaceFormError[],
  key: NamespaceFormLabel
) => errors.find((formField) => formField.formLabel === key);

export const validateForm = ({ namespaces, prefix, uri }: ValidateForm) => {
  const editedValues: EditedValue[] = [];

  if (prefix.edited) {
    editedValues.push({ label: "prefix", value: prefix.value });
  }

  if (uri.edited) {
    editedValues.push({ label: "uri", value: uri.value });
  }

  const existingValueErrors: NamespaceFormError[] = editedValues
    .filter((editedValue) => {
      const existingNamespaceValue = namespaces.some(
        (namespace) => namespace[editedValue.label] === editedValue.value
      );
      return existingNamespaceValue;
    })
    .map((editedValue) => ({
      formLabel: editedValue.label,
      error: true,
      helperText: `This ${editedValue.label} already exists`,
    }));

  const errors = existingValueErrors;

  const hasErrors = errors.some((error) => error.error);

  return { hasErrors, errors };
};

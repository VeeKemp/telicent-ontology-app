import React, { useEffect, useState } from "react";
import { TeliAutocomplete } from "@telicent-oss/ds";
import { useDispatch } from "react-redux";

import useAllOwlDTPs, { Attribute } from "../../services/getDataTypeProperties";
import { setAttribute } from "../../reducers/InstanceViewSlice";

const Attributes: React.FC = () => {
  const dispatch = useDispatch();
  const { attributes, loading, error } = useAllOwlDTPs();
  const [value, setValue] = useState<any>(null);

  useEffect(() => {
    if (!loading && !value) {
      setValue(attributes[0]);
      dispatch(setAttribute(attributes[0].label));
    }
  }, [loading, value]);

  const handleAttributeChange = (
    event: React.SyntheticEvent,
    value: Attribute | null
  ) => {
    if (value) {
      setValue(value);
      dispatch(setAttribute(value.label));
    }
  };

  return (
    <TeliAutocomplete
      fullWidth
      className="px-4"
      label="Attribute"
      options={attributes}
      value={value}
      loading={loading}
      error={Boolean(error)}
      helperText={error}
      onChange={handleAttributeChange}
      getOptionKey={(option) => option.uri}
      isOptionEqualToValue={(option, value) => option.label === value.label}
    />
  );
};

export default Attributes;

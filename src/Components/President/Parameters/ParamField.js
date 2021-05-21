import React from "react";
import { TextField } from "@material-ui/core";

function ParamField(props) {
  const { value, onChange } = props;
  return (
    <div style={{ flex: "1 1 49%" }}>
      <TextField
        key={value}
        label={value}
        defaultValue={value}
        fullWidth
        variant="outlined"
        onChange={onChange}
      />
    </div>
  );
}

export default ParamField;

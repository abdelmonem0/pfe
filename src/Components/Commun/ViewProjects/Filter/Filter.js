import { Checkbox, Typography } from "@material-ui/core";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import React, { useState } from "react";

function Filter(props) {
  const { text, onFilter } = props;
  const [ascending, setAscending] = useState(0);

  const handleClick = () => {
    const i = ascending + 1;
    if (i > 2) {
      setAscending(0);
      return;
    }
    setAscending(ascending + 1);
  };

  return (
    <div className="horizontal-list pointer no-selection" onClick={handleClick}>
      <Typography color={ascending ? "primary" : "colorPrimary"}>
        {text}
      </Typography>
      {ascending === 1 ? (
        <ArrowUpward color={ascending ? "primary" : "colorPrimary"} />
      ) : ascending === 2 ? (
        <ArrowDownward color={ascending ? "primary" : "colorPrimary"} />
      ) : null}
    </div>
  );
}

export default Filter;

import { Typography } from "@material-ui/core";
import React from "react";

function Section(props) {
  const { title } = props;
  return (
    <div key={title}>
      <Typography variant="h6" color="primary" paragraph>
        {title}
      </Typography>
      <div className="horizontal-list wrap" style={{ flex: 1, gap: "1rem" }}>
        {props.children}
      </div>
    </div>
  );
}

export default Section;

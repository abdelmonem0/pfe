import { Chip, Tooltip, useTheme } from "@material-ui/core";
import React from "react";
import { getProjectStateForChip } from "../Constraints";

export default function StateChip(props) {
  const { project } = props;
  const theme = useTheme();
  const projectState = getProjectStateForChip(project, theme);
  const { color, borderColor, backgroundColor } = projectState
    ? projectState.colors
    : {};

  return projectState ? (
    <Tooltip title={projectState.tooltip}>
      <Chip
        label={projectState.state}
        variant={borderColor === "transparent" ? "default" : "outlined"}
        style={{ color, borderColor, backgroundColor }}
        size="small"
      />
    </Tooltip>
  ) : null;
}

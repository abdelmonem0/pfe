import { Chip, Tooltip, useTheme } from "@material-ui/core";
import React from "react";
import { Project_States } from "../../../Constants";
import { getProjectByID } from "../../Enseignant/Candidatures/logic";
import { canSeeCahierState, getCahierState } from "./logic";

export default function CahierState(props) {
  var { project } = props;
  const _project = getProjectByID(project.id_sujet) || project;
  const theme = useTheme();
  const cahierState = getCahierState(_project, theme);
  const { color, state } = cahierState;

  return _project && cahierState && canSeeCahierState(_project) ? (
    <Chip
      label={state}
      variant="outlined"
      style={{ color, borderColor: color }}
      size="small"
    />
  ) : null;
}

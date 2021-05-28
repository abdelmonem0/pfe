import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProjectByID } from "../../../Enseignant/Candidatures/logic";

function ProjectChooser(props) {
  const { soutenance } = props;
  const { values, soutenances } = useSelector((state) => state.soutenance);
  const dispatch = useDispatch();
  const affected = soutenances.map((s) => s.id_sujet);
  const projects = values.selectedProjects
    .map((s) => getProjectByID(s))
    .filter((el) => el)
    .sort((a, b) =>
      affected.indexOf(a) === affected.indexOf(b)
        ? 0
        : affected.indexOf(a) > -1
        ? -1
        : 1
    );

  const onChange = (e, v) => {
    dispatch({
      type: "UPDATE_SOUTENANCE",
      payload: { ...soutenance, id_sujet: v.id_sujet },
    });
  };

  return (
    <Autocomplete
      options={projects}
      onChange={onChange}
      getOptionLabel={(option) => option.titre}
      getOptionDisabled={(option) => affected.indexOf(option.id_sujet) > -1}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choisir un sujet"
          variant="outlined"
          size="small"
        />
      )}
    />
  );
}

export default ProjectChooser;

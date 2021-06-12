import { Typography, Paper } from "@material-ui/core";
import React from "react";

function Infos(props) {
  const {
    sales,
    maxCrenaux,
    selectedTeachers,
    selectedProjects,
    presidents,
    projects,
    teachers,
  } = props;
  return (
    <Paper
      className="horizontal-list wrap"
      style={{ margin: "0.5rem 0", padding: "0.5rem" }}
    >
      <div className="horizontal-list wrap" style={{ flex: "1  1 49%" }}>
        <Typography variant="h6">Sales:</Typography>

        {sales
          .replace(" ", "")
          .split(",")
          .map((s) => (
            <Typography variant="h6" key={s} color="primary">
              {s}
            </Typography>
          ))}

        <Typography>
          ({sales.replace(" ", "").split(",").length} sales)
        </Typography>
      </div>
      <div className="horizontal-list wrap" style={{ flex: "1  1 49%" }}>
        <Typography variant="h6">
          Nombre des crénaux maximales par jour:
        </Typography>
        <Typography variant="h6" color="primary">
          {maxCrenaux}
        </Typography>
      </div>
      <div className="horizontal-list wrap" style={{ flex: "1  1 49%" }}>
        <Typography variant="h6">Nombre des sujets séléctionnés:</Typography>
        <Typography variant="h6" color="primary">
          {selectedProjects.length}
        </Typography>
        <Typography variant="h6">/ {projects.length}</Typography>
      </div>
      <div className="horizontal-list wrap" style={{ flex: "1  1 49%" }}>
        <Typography variant="h6">Enseignants séléctionnés:</Typography>
        <Typography variant="h6" color="primary">
          {selectedTeachers.length}
        </Typography>
        <Typography variant="h6"> / {teachers.length}</Typography>
        <Typography variant="h6">
          {" "}
          ( {presidents.length} présidents )
        </Typography>
      </div>
    </Paper>
  );
}

export default Infos;

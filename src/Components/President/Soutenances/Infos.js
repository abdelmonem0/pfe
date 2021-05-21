import { Typography } from "@material-ui/core";
import React from "react";

function Infos(props) {
  const {
    startDate,
    endDate,
    sales,
    maxCrenaux,
    selectedTeachers,
    selectedProjects,
    presidents,
    projects,
    teachers,
  } = props;
  return (
    <div>
      <Typography gutterBottom variant="h5" color="primary">
        Infos
      </Typography>
      <div className="horizontal-list space-between">
        <div className="horizontal-list">
          <Typography variant="h6">Date de debut:</Typography>
          <Typography variant="h6" color="primary">
            {new Date(startDate).toLocaleDateString("fr-FR")}
          </Typography>
        </div>
        <div
          style={{
            height: "1px",
            margin: "0 0.2rem",
            backgroundColor: "lightgray",
            flex: "1",
          }}
        />
        <div className="horizontal-list">
          <Typography variant="h6">Date de fin:</Typography>
          <Typography variant="h6" color="primary">
            {new Date(endDate).toLocaleDateString("fr-FR")}
          </Typography>
        </div>
      </div>
      <div className="horizontal-list">
        <Typography variant="h6">Sales:</Typography>

        {sales
          .replace(" ", "")
          .split(",")
          .map((s) => (
            <Typography key={s} variant="h6" color="primary">
              {s}
            </Typography>
          ))}

        <Typography variant="h6">
          ({sales.replace(" ", "").split(",").length} sales)
        </Typography>
      </div>
      <div className="horizontal-list">
        <Typography variant="h6">
          Nombre des crénaux maximales par jour:
        </Typography>
        <Typography variant="h6" color="primary">
          {maxCrenaux}
        </Typography>
      </div>
      <div className="horizontal-list">
        <Typography variant="h6">Nombre des sujets séléctionnés:</Typography>
        <Typography variant="h6" color="primary">
          {selectedProjects.length}
        </Typography>
        <Typography variant="h6">/ {projects.length}</Typography>
      </div>
      <div className="horizontal-list">
        <Typography variant="h6">
          Nombre des enseignants séléctionnés:
        </Typography>
        <Typography variant="h6" color="primary">
          {selectedTeachers.length}
        </Typography>
        <Typography variant="h6"> / {teachers.length}</Typography>
        <Typography variant="h6">
          {" "}
          (dont {presidents.length} présidents)
        </Typography>
      </div>
    </div>
  );
}

export default Infos;

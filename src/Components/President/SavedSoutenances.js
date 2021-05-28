import { Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import Infos from "./Soutenances/Infos";
import SoutenanceHolder from "./Soutenances/SoutenanceHolder";

export default function SavedSoutenances(props) {
  const savedValues = useSelector((state) => state.savedSoutenance.values);
  const soutenances = useSelector((state) => state.savedSoutenance.soutenances);
  const projects = useSelector((state) => state.projects.dataArray);
  const teachers = useSelector((state) => state.users.all).filter(
    (u) => u.role === "enseignant" || u.role === "membre"
  );

  var sales = "";
  for (let s of savedValues.sales) sales += s + ",";
  sales = sales.substring(0, sales.length - 1);
  return (
    <div style={{ flex: 1 }}>
      <Typography variant="h4" paragraph>
        Soutenances enregistrés
      </Typography>
      <Infos
        startDate={savedValues.startDate}
        endDate={savedValues.endDate}
        sales={sales}
        maxCrenaux={savedValues.maxCrenaux}
        selectedTeachers={savedValues.selectedTeachers}
        selectedProjects={savedValues.selectedProjects}
        presidents={savedValues.presidents}
        projects={projects}
        teachers={teachers}
      />
      <SoutenanceHolder
        saved={true}
        soutenances={soutenances}
        values={savedValues}
      />
    </div>
  );
}

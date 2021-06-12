import { Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import Infos from "./Soutenances/Infos";
import SoutenanceHolder from "./Soutenances/SoutenanceHolder";
import { load_saved_soutenances } from "./Soutenances/SoutenanceLogic";

export default function SavedSoutenances(props) {
  const savedValues = useSelector((state) => state.savedSoutenance.savedValues);
  const soutenances = useSelector((state) => state.savedSoutenance.soutenances);
  const projects = useSelector((state) => state.projects.dataArray);
  const teachers = useSelector((state) => state.users.all).filter(
    (u) => u.role === "enseignant" || u.role === "membre" || u.role === "membre"
  );

  React.useEffect(() => {
    if (!savedValues && soutenances) load_saved_soutenances(soutenances);
    console.log(savedValues);
    console.log(soutenances);
  }, []);
  return (
    (savedValues && soutenances && (
      <div style={{ flex: 1 }}>
        <Typography variant="h4" paragraph>
          Soutenances enregistrés
        </Typography>
        <Infos
          startDate={savedValues.startDate}
          endDate={savedValues.endDate}
          sales={savedValues.sales}
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
    )) || <div>shit</div>
  );
}

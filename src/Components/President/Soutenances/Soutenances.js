import { Button, Typography } from "@material-ui/core";
import React, { useState } from "react";
import Infos from "./Infos";
import {
  assignTeachersToProjects,
  createSoutenances,
  getProject,
  getUser,
} from "./SoutenanceLogic";

function Soutenances(props) {
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
  const [data, setData] = useState({ soutenances: [], teachers: [] });

  const _projects = projects.filter(
    (p) => selectedProjects.indexOf(p.id_sujet) > -1
  );
  const _teachers = teachers.filter(
    (u) => selectedTeachers.indexOf(u.id_utilisateur) > -1
  );

  const combinedProjectsTeachers = assignTeachersToProjects(
    { projects: _projects, teachers: _teachers },
    false
  );

  console.log(combinedProjectsTeachers);

  return (
    <div>
      <Infos
        startDate={startDate}
        endDate={endDate}
        sales={sales}
        maxCrenaux={maxCrenaux}
        selectedTeachers={selectedTeachers}
        selectedProjects={selectedProjects}
        presidents={presidents}
        projects={projects}
        teachers={teachers}
      />
      <Button
        onClick={() =>
          setData(
            createSoutenances({
              selectedTeachers,
              selectedProjects: combinedProjectsTeachers,
              startDate,
              endDate,
              maxCrenaux,
              sales,
              presidents,
            })
          )
        }
      >
        Test
      </Button>
      <div
        className="horizontal-list"
        style={{ flexWrap: "wrap", alignItems: "flex-start" }}
      >
        {data.soutenances.map((sout) => (
          <div
            style={{
              flex: "1 1 45%",
              padding: "1rem",
              border: "1px solid gray",
            }}
          >
            <Typography gutterBottom variant="h6">
              {getProject(sout.sujet.id_sujet).titre}
            </Typography>
            <div calssName="horizontal-list">
              <Typography>Date: {sout.date}</Typography>
              <Typography>Sale: {sout.sale}</Typography>
              <Typography>Crenau: {sout.crenau}</Typography>
            </div>
            <div className="horizontal-list" style={{ flexWrap: "wrap" }}>
              {sout.invite.map((invite) => (
                <div
                  className="horizontal-list"
                  style={{
                    padding: "0.5rem",
                    border: "1px solid lightgay",
                  }}
                >
                  <Typography>{getUser(invite.id_utilisateur).nom}</Typography>
                  <Typography>{invite.role}</Typography>
                </div>
              ))}
            </div>
          </div>
        ))}
        {data.teachers.map((teach) => (
          <div className="horizontal-list">
            <Typography>{teach.soutenances.length}</Typography>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Soutenances;

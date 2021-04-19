import React, { useState, useEffect } from "react";
import { Paper, Typography } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";

import "../../../App.css";
import ProjectDetail from "../../Commun/ProjectDetail";
import Candidature from "./Candidature";
import { getCandidatures, getProjects } from "../../../functions";
import { Candidature_States } from "../../../Constants";

function Candidatures() {
  const users = useSelector((state) => state.users);
  const projects = useSelector((state) => state.projects);
  const dispatch = useDispatch();
  const candidatures = useSelector((state) => state.candidatures);

  const [openProject, setOpenProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState(undefined);

  useEffect(() => {
    getProjects()
      .then((result) =>
        dispatch({ type: "SET_PROJECTS", payload: result.data })
      )
      .then(() =>
        getCandidatures(users.current.id_utilisateur).then((result) =>
          dispatch({ type: "SET_CANDIDATURES", payload: result.data })
        )
      );
  }, []);

  return (
    <Paper elevation={0}>
      {selectedProject && (
        <ProjectDetail
          open={openProject}
          project={selectedProject}
          closeProject={setOpenProject}
        />
      )}
      <Paper elevation={0}>
        <Typography variant="h4" paragraph>
          Candidatures
        </Typography>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {candidatures &&
            candidatures
              .filter((el1) => {
                return (
                  el1.etat != Candidature_States.waiting_for_student &&
                  el1.etat != Candidature_States.refused_by_student
                );
              })
              .map((el) => (
                <Candidature
                  candidature={el}
                  project={
                    projects.filter((object) => {
                      return object.id_sujet === el.id_sujet;
                    })[0]
                  }
                  users={users}
                  openProject={setOpenProject}
                  setSelectedProject={setSelectedProject}
                />
              ))}
        </div>
      </Paper>
    </Paper>
  );
}

export default Candidatures;

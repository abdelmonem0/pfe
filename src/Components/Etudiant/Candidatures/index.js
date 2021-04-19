import React, { useState, useEffect } from "react";
import { Paper, Typography } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";

import "../../../App.css";
import ProjectDetail from "../../Commun/ProjectDetail";
import Candidature from "./Candidature";
import { getCandidatures, getProjects } from "../../../functions";

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
    <div>
      {selectedProject && (
        <ProjectDetail
          open={openProject}
          project={selectedProject}
          closeProject={setOpenProject}
        />
      )}
      <div>
        <Paper elevation={0}>
          <Typography variant="h4" paragraph>
            Mes candidatures
          </Typography>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* Info candidatures - Etudiants */}
            {users.current.role === "etudiant" &&
              (candidatures.length >= 3 ? (
                <Typography variant="h6" style={{ color: "red" }}>
                  Vous ne pouvez candidater que pour 3 sujets à la fois, une
                  fois une candidature est refusée, vous pourrez candidater de
                  nouveau.
                </Typography>
              ) : candidatures.length != 0 ? (
                <Typography variant="h6" style={{ color: "orange" }}>
                  Vous avez candidater pour {candidatures.length} sujets, vous
                  pouvez encore candidater pour {3 - candidatures.length}{" "}
                  sujets. Une fois une candidature est refusée, vous pourrez
                  candidater de nouveau.
                </Typography>
              ) : (
                <Typography variant="h6">
                  Vous n'avez pas des candidatures.
                </Typography>
              ))}
            {candidatures &&
              candidatures.map((el) => (
                <Candidature
                  candidature={el}
                  project={projects.filter((object) => {
                    return object.id_sujet === el.id_sujet;
                  })}
                  users={users}
                  openProject={setOpenProject}
                  setSelectedProject={setSelectedProject}
                />
              ))}
          </div>
        </Paper>
      </div>
    </div>
  );
}

export default Candidatures;

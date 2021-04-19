import { React, useEffect, useState } from "react";
import { Button, IconButton, Paper, Typography } from "@material-ui/core";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

import "./style.css";
import ProjectCard from "./ProjectCard";
import ProjectDetail from "../ProjectDetail";
import AddCandidature from "../../Etudiant/AddCandidature";
import { getCandidatures, getProjects } from "../../../functions";
import FiltreProjects from "./FiltreProjects";
import CardView from "./Views/CardView";
import TableView from "./Views/TableView";
import { ViewAgenda, ViewHeadline } from "@material-ui/icons";

function ViewProjects() {
  const current = useSelector((state) => state.users.current);
  const projects = useSelector((state) => state.projects);
  const dispatch = useDispatch();

  const [dialog, setDialog] = useState(false);
  const [addCandidature, setAddCandidature] = useState(false);
  const [selectedProject, setSelectedProject] = useState(undefined);
  const [cardView, setCardView] = useState(true);

  useEffect(() => {
    getProjects()
      .then((result) => {
        dispatch({ type: "SET_PROJECTS", payload: result.data });
      })
      .then(() => {
        console.log("Entered");
        getCandidatures(current.id_utilisateur).then((result) =>
          dispatch({ type: "SET_CANDIDATURES", payload: result.data })
        );
      });
  }, []);

  function openProject(project) {
    setSelectedProject(project);
    setDialog(true);
  }

  function closeProject() {
    setDialog(false);
  }

  return (
    projects &&
    projects.length > 0 && (
      <>
        {selectedProject && (
          <ProjectDetail
            open={dialog}
            closeProject={closeProject}
            project={selectedProject}
            setSelectedProject={setSelectedProject}
            openCandidature={setAddCandidature}
          />
        )}

        {selectedProject && current.role === "etudiant" && (
          <AddCandidature
            open={addCandidature}
            closeCandidature={setAddCandidature}
            project={selectedProject}
          />
        )}

        <Paper
          elevation={0}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Typography variant="h4" paragraph>
              List des sujets
            </Typography>
            <SwitchView cardView={cardView} setCardView={setCardView} />
          </div>
          {/* <FiltreProjects /> */}

          {cardView ? (
            <CardView
              projects={projects}
              openProject={openProject}
              setSelectedProject={setSelectedProject}
              openCandidature={setAddCandidature}
            />
          ) : (
            <TableView
              projects={projects}
              openProject={openProject}
              current={current}
            />
          )}
        </Paper>
      </>
    )
  );
}

export default ViewProjects;

const SwitchView = (props) => {
  const { cardView, setCardView } = props;

  const handleClick = (isViewCard) => {
    setCardView(isViewCard);
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <Button
        color="primary"
        disabled={cardView}
        onClick={() => handleClick(true)}
      >
        <ViewAgenda />
      </Button>
      <Button
        color="primary"
        disabled={!cardView}
        onClick={() => handleClick(false)}
      >
        <ViewHeadline />
      </Button>
    </div>
  );
};

import {
  ButtonBase,
  Divider,
  Paper,
  Typography,
  useTheme,
} from "@material-ui/core";
import React from "react";
import { canCandidate, leftCandidaturesText } from "../../Commun/Constraints";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProjectDetail from "../../Commun/ProjectDetail";
import StateChip from "../../Commun/ViewProjects/StateChip";
import { NewReleases } from "@material-ui/icons";

function Candidature(props) {
  const theme = useTheme();
  const projects = useSelector((state) => state.projects.dataArray);
  const current = useSelector((state) => state.users.current);
  const project =
    useSelector((state) => state.projects.dataArray).filter(
      (p) => p.id_sujet === current.sujet_affecte
    )[0] || undefined;

  function getLastProjects() {
    const temp = [...projects];
    return temp
      .sort((a, b) => new Date(a.date_creation) < new Date(b.date_creation))
      .splice(0, 3);
  }

  return !project ? (
    <Paper
      style={{
        flex: "1",
        maxWidth: "40rem",
        minWidth: "16rem",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        ...props.style,
      }}
    >
      <Typography gutterBottom variant="h5">
        Pas de sujet affecté
      </Typography>
      <Divider />
      <Paper variant="outlined" style={{ padding: "0.5rem" }}>
        <Typography variant="h6" gutterBottom>
          {leftCandidaturesText()}
        </Typography>
        {canCandidate(undefined) && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Typography>
              <ButtonBase
                style={{
                  textTransform: "none",
                  fontWeight: "bold",
                  color: theme.palette.primary.light,
                  textDecoration: "none",
                }}
                component={Link}
                to="/sujets"
              >
                Consulter les sujets
              </ButtonBase>{" "}
              pour postuler ou{" "}
              <ButtonBase
                style={{
                  textTransform: "none",
                  fontWeight: "bold",
                  color: theme.palette.primary.light,
                  textDecoration: "none",
                }}
                component={Link}
                to="/ajouter"
              >
                proposer un sujet externe
              </ButtonBase>
            </Typography>
          </div>
        )}
        <Divider />
        <Paper
          elevation={0}
          style={{ padding: "0.5rem 0", margin: "0.5rem 0" }}
        >
          <Typography gutterBottom>
            {" "}
            <NewReleases /> Derniers sujets ajoutés
          </Typography>
          <div>
            {" "}
            {getLastProjects().map((p) => (
              <LastProject project={p} />
            ))}{" "}
          </div>
        </Paper>
      </Paper>
    </Paper>
  ) : null;
}

export default Candidature;

const LastProject = (props) => {
  const { project } = props;

  return (
    <Paper
      key={project.id_sujet}
      variant="outlined"
      style={{ padding: "0.5rem", margin: "0.5rem 0" }}
    >
      <ProjectDetail project={project}>
        <StateChip project={project} />
        <div style={{ margin: "0.25rem 0" }} />
        <Typography>{project.titre}</Typography>
      </ProjectDetail>
    </Paper>
  );
};

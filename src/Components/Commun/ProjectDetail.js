import React, { useState } from "react";
import {
  Typography,
  Button,
  Tooltip,
  Dialog,
  DialogActions,
  Paper,
  useTheme,
  useMediaQuery,
  Hidden,
  Chip,
  CardHeader,
  Card,
  CardContent,
} from "@material-ui/core";
import {
  Schedule,
  Settings,
  Person,
  LocationOn,
  Apartment,
} from "@material-ui/icons";
import { useSelector } from "react-redux";
import ViewComments from "./ViewComments";
import Slide from "@material-ui/core/Slide";
import PresidentProjectActions from "../President/PresidentProjectActions";
import MembreProjectActions from "../Membre/MembreProjectActions";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ProjectDetail(props) {
  const current = useSelector((state) => state.users.current);
  const candidatures = useSelector((state) => state.candidatures);
  const projects = useSelector((state) => state.projects);

  const project = projects.filter((object) => {
    return object.id_sujet === props.project.id_sujet;
  })[0];

  const canViewComments =
    current.role === "enseignant"
      ? project.enc_prim === current.id_utilisateur ||
        project.enc_sec === current.id_utilisateur
        ? true
        : false
      : true;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  function alreadyCandidat() {
    for (var el of candidatures) {
      if (project.id_sujet === el.id_sujet) {
        if (el.id_etudiant === current.id_utilisateur) return 1;
        if (el.id_etudiant_2 === current.id_utilisateur) {
          if (el.etat === "attente de reponse") return 1;
          else return 2;
        }
      }
    }
    return 0;
  }

  var title =
    candidatures.length < 3
      ? "Il vous reste " + (3 - candidatures.length) + " candidatures."
      : "Vous ne pouvez plus candidater.";
  title =
    alreadyCandidat() != 0
      ? alreadyCandidat() === 1
        ? "Vous avez déjà candidater pour ce projet."
        : "Vous êtes invité a ce projet, consulter vos candidatures pour le confirmer ou réjéter."
      : title;

  return (
    <Dialog
      open={props.open}
      TransitionComponent={Transition}
      fullWidth
      maxWidth={"lg"}
      onClose={() => props.closeProject()}
      fullScreen={fullScreen}
    >
      <Paper elevation={0} style={{ display: "flex", overflowY: "hidden" }}>
        <Paper elevation={0} style={{ flex: "1 1 60%", overflowY: "scroll" }}>
          <Card elevation={0}>
            <CardHeader
              title={project.titre}
              subheader={
                <div style={{ display: "flex", gap: "1rem" }}>
                  <Typography variant="body2" color="textSecondary">
                    <Person /> {project.encadrants[0].nom}{" "}
                    {project.encadrants.length > 1 &&
                      " - " + project.encadrants[1].nom}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <Schedule />
                    {" " + project.date_creation}
                  </Typography>
                </div>
              }
            />
            <CardContent>
              <Paper
                elevation={0}
                style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
              >
                <Settings color="primary" />
                {project.tags.map((p) => (
                  <Chip
                    label={p.id_tag}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                ))}
              </Paper>
              <Paper
                elevation={0}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  margin: "0.5rem 0",
                }}
              >
                <Paper elevation={0} style={{ display: "flex" }}>
                  <LocationOn color="primary" />
                  <Typography variant="body1">
                    {project.interne ? "Interne" : "Externe"}
                  </Typography>
                </Paper>
                {!project.interne && (
                  <Paper elevation={0} style={{ display: "flex" }}>
                    <Apartment color="primary" />
                    <Typography variant="body1">{project.lieu}</Typography>
                  </Paper>
                )}
                {!project.interne && (
                  <Paper elevation={0} style={{ display: "flex" }}>
                    <Typography variant="subtitle2">
                      Encadrant externe: {project.enc_ext}
                    </Typography>
                  </Paper>
                )}
              </Paper>
              <Typography variant="h6" color="primary">
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {project.description}
              </Typography>
              <Typography variant="h6" color="primary">
                Travail demandé
              </Typography>
              <Typography variant="body1" paragraph>
                {project.travail}
              </Typography>

              {canViewComments && (
                <Hidden mdUp>
                  <Typography variant="h6" color="primary">
                    Commentaires
                  </Typography>
                  <ViewComments
                    addComment={props.addComment}
                    project={project}
                  />
                </Hidden>
              )}
            </CardContent>
          </Card>
        </Paper>
        {canViewComments && (
          <Hidden smDown>
            <Paper
              elevation={0}
              style={{ flex: "1 1 40%", overflowY: "scroll" }}
            >
              <Card elevation={0}>
                <CardContent>
                  <ViewComments
                    addComment={props.addComment}
                    project={project}
                  />
                </CardContent>
              </Card>
            </Paper>
          </Hidden>
        )}
      </Paper>

      <DialogActions>
        {current.role === "president" && (
          <PresidentProjectActions project={project} current={current} />
        )}
        {current.role === "membre" && (
          <MembreProjectActions project={project} current={current} />
        )}
        {current.role === "etudiant" &&
          alreadyCandidat() === 0 &&
          candidatures.length < 3 &&
          project.affecte_a.length === 0 && (
            <CandidatButton
              setSelectedProject={props.setSelectedProject}
              openCandidature={() => props.openCandidature(true)}
              candidatures={candidatures}
              project={project}
              title={title}
              alreadyCandidat={alreadyCandidat()}
            />
          )}
        {current.role === "etudiant" && (
          <Typography variant="subtitle2" color="error">
            {title}
          </Typography>
        )}
        <div style={{ flex: 1 }} />
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => props.closeProject()}
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProjectDetail;

const CandidatButton = (props) => {
  return (
    <Tooltip title={props.title}>
      <div>
        <Button
          disabled={
            props.candidatures.length >= 3 || props.alreadyCandidat != 0
          }
          variant={
            props.candidatures.length >= 3 || props.alreadyCandidat != 0
              ? "outlined"
              : "contained"
          }
          color="primary"
          disableElevation
          onClick={() => {
            props.setSelectedProject(props.project);
            props.openCandidature(true);
          }}
        >
          Postuler
        </Button>
      </div>
    </Tooltip>
  );
};

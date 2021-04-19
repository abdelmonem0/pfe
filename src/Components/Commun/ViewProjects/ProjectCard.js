import { React, useState } from "react";
import {
  Card,
  CardActionArea,
  CardHeader,
  Typography,
  CardContent,
  CardActions,
  Button,
  Collapse,
  Tooltip,
  Hidden,
  Chip,
} from "@material-ui/core";
import { Person, CommentRounded, Settings } from "@material-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import ViewComments from "../ViewComments";
import MembreProjectActions from "../../Membre/MembreProjectActions";
import LikeButton from "../LikeButton";
import PresidentProjectActions from "../../President/PresidentProjectActions";
import { Candidature_States } from "../../../Constants";
import CandidatButton from "./CandidatButton";

function ProjectCard(props) {
  const current = useSelector((state) => state.users.current);
  const users = useSelector((state) => state.users);
  const candidatures = useSelector((state) => state.candidatures);
  const gotAcceptedCand =
    candidatures.filter((el) => {
      return el.etat === Candidature_States.accepted;
    }).length > 0;

  const [expanded, setExpanded] = useState(undefined);

  const project = props.project;

  const canViewComments =
    current.role === "enseignant"
      ? project.enc_prim === current.id_utilisateur ||
        project.enc_sec === current.id_utilisateur
        ? true
        : false
      : true;
  const canCandidate =
    current.role === "etudiant" &&
    project.affecte_a.length === 0 &&
    !gotAcceptedCand;

  function expand(project) {
    setExpanded(expanded === project.id_sujet ? undefined : project.id_sujet);
  }

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

  return (
    <Card
      key={props.key}
      elevation={0}
      variant="outlined"
      style={{
        borderColor: project.affecte_a.length > 0 ? "greenyellow" : "lightgray",
      }}
    >
      <AffectedBadge affecte_a={project.affecte_a} users={users} />
      <CardActionArea onClick={() => props.openProject(project)}>
        <CardHeader
          title={
            <div>
              <Typography variant="h6">{project.titre}</Typography>
            </div>
          }
          subheader={
            <div style={{ display: "flex", gap: "1rem" }}>
              <Typography variant="body2" color="textSecondary">
                <Person size="small" /> {project.encadrants[0].nom}{" "}
                {project.encadrants.length > 1 &&
                  " - " + project.encadrants[1].nom}
              </Typography>
            </div>
          }
        />
        <Hidden xsDown>
          <CardContent>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                marginBottom: "0.5rem",
              }}
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
            </div>
            <Typography variant="body1" color="primary">
              Description
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {project.description}
            </Typography>
          </CardContent>
        </Hidden>
      </CardActionArea>
      <CardActions>
        <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
          <LikeButton project={project} current={current} />
          {canCandidate && (
            <CandidatButton
              setSelectedProject={props.setSelectedProject}
              openCandidature={props.openCandidature}
              candidatures={candidatures}
              project={project}
            />
          )}

          {/* <Tooltip title="Afficher le projet">
            <Button
              style={{ textTransform: "none" }}
              onClick={() => props.openProject(project)}
            >
              plus...
            </Button>
          </Tooltip> */}
          {current.role === "president" && (
            <PresidentProjectActions
              size="small"
              project={project}
              current={current}
            />
          )}
          {current.role === "membre" && (
            <MembreProjectActions project={project} current={current} />
          )}
          <div style={{ flex: 1 }} />

          {/* Comments button */}
          {canViewComments && (
            <Tooltip title="Commentaires">
              <Button
                variant="outlined"
                size="small"
                startIcon={<CommentRounded />}
                onClick={() => expand(project)}
              >
                {project.commentaires.length}
              </Button>
            </Tooltip>
          )}
        </div>
      </CardActions>

      <Collapse in={expanded === project.id_sujet} timeout="auto" unmountOnExit>
        <CardContent>
          <ViewComments project={project} />
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default ProjectCard;

const AffectedBadge = (props) => {
  const { affecte_a, users } = props;

  return (
    affecte_a.length > 0 && (
      <div
        style={{
          display: "flex",
          gap: "0.7rem",
          alignItems: "center",
          padding: "0.25rem",
          backgroundColor: "greenyellow",
        }}
      >
        <Typography variant="body1">Affecté à</Typography>
        {affecte_a.map((el) => {
          return (
            <Typography variant="body1" style={{ fontWeight: "bold" }}>
              {
                users.all.filter((user) => {
                  return user.id_utilisateur === el.id_utilisateur;
                })[0].nom
              }
            </Typography>
          );
        })}
      </div>
    )
  );
};

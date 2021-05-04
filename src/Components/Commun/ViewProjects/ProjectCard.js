import { React, useState } from "react";
import {
  Card,
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
import { useSelector } from "react-redux";
import ViewComments from "../ViewComments";
import MembreProjectActions from "../../Membre/MembreProjectActions";
import LikeButton from "../LikeButton";
import PresidentProjectActions from "../../President/PresidentProjectActions";
import { Candidature_States } from "../../../Constants";
import CandidatButton from "./CandidatButton";
import { useTheme } from "@material-ui/core/styles";
import ProjectDetail from "../ProjectDetail";

function ProjectCard(props) {
  const { project } = props;
  const theme = useTheme();
  const current = useSelector((state) => state.users.current);
  const candidatures = useSelector((state) => state.candidatures);
  const gotAcceptedCand =
    candidatures.filter((el) => {
      return el.etat === Candidature_States.accepted;
    }).length > 0;

  const [expanded, setExpanded] = useState(undefined);

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

  return (
    <Card
      key={project.id_sujet}
      elevation={0}
      variant="outlined"
      style={{
        borderColor:
          project.affecte_a.length > 0
            ? theme.palette.success.main
            : theme.palette.grey[900],
      }}
    >
      <ProjectDetail project={project}>
        <CardHeader
          title={<Typography variant="h6">{project.titre}</Typography>}
          subheader={
            project.encadrants[0] && (
              <div style={{ display: "flex", gap: "1rem" }}>
                <Typography variant="body2" color="textSecondary">
                  <Person size="small" /> {project.encadrants[0].nom}{" "}
                  {project.encadrants.length > 1 &&
                    " - " + project.encadrants[1].nom}
                </Typography>
              </div>
            )
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
      </ProjectDetail>
      <CardActions>
        <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
          <LikeButton project={project} current={current} />
          <CandidatButton project={project} />
          <PresidentProjectActions project={project} />
          <MembreProjectActions project={project} current={current} />
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

import React, { useState } from "react";
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
  Divider,
  Badge,
  IconButton,
} from "@material-ui/core";
import {
  Person,
  CommentRounded,
  Settings,
  School,
  Schedule,
} from "@material-ui/icons";
import { useSelector } from "react-redux";
import ViewComments from "../ViewComments";
import MembreProjectActions from "../../Membre/MembreProjectActions";
import LikeButton from "../LikeButton";
import PresidentProjectActions from "../../President/PresidentProjectActions";
import { Candidature_States } from "../../../Constants";
import CandidatButton from "./CandidatButton";
import { useTheme } from "@material-ui/core/styles";
import AttachementButton from "./AttachementButton";
import StateChip from "./StateChip";
import CahierState from "./CahierState";
import { getUserByID } from "../Candidature.js/CandidatureLogic";
import TeacherProjectAction from "../../Enseignant/TeacherProjectActions";
import { canEditProject } from "./logic";
import { Link } from "react-router-dom";
import { getNextQuery, get_visible_comments } from "../ProjectDetail/logic";

export function can_view_comments(project, current) {
  return (
    project.id_etudiant === current.id_utilisateur ||
    project.id_etudiant_2 === current.id_utilisateur ||
    project.enc_prim === current.id_utilisateur ||
    project.enc_sec === current.id_utilisateur ||
    current.role === "president" ||
    current.role === "membre"
  );
}

function ProjectCard(props) {
  const { project } = props;
  const theme = useTheme();
  const current = useSelector((state) => state.users.current);
  const comments = get_visible_comments(project);

  const [expanded, setExpanded] = useState(undefined);

  const canViewComments = can_view_comments(project, current);

  function expand(project) {
    setExpanded(expanded === project.id_sujet ? undefined : project.id_sujet);
  }

  return (
    (project && (
      <Card key={project.id_sujet} elevation={0} variant="outlined">
        <Link className="link-style" to={`?pid=${project.id_sujet}`}>
          <CardHeader
            title={<Typography variant="h6">{project.titre}</Typography>}
            subheader={
              <div className="horizontal-list wrap">
                <StateChip project={project} />
                <CahierState project={project} />
                {project.encadrants[0] && (
                  <Tooltip title="Encadrant">
                    <Typography variant="body2" color="textSecondary">
                      <School size="small" /> {project.encadrants[0].nom}{" "}
                      {project.encadrants.length > 1 &&
                        " - " + project.encadrants[1].nom}
                    </Typography>
                  </Tooltip>
                )}
                {project.id_etudiant && (
                  <Tooltip title="Etudiant">
                    <Typography variant="body2" color="textSecondary">
                      <Person size="small" />{" "}
                      {getUserByID(project.id_etudiant)?.nom || ""}{" "}
                      {(project.id_etudiant_2 &&
                        " - " + getUserByID(project.id_etudiant_2)?.nom) ||
                        ""}
                    </Typography>
                  </Tooltip>
                )}
                <Tooltip title="Date d'ajout">
                  <Typography variant="body2" color="textSecondary">
                    <Schedule />
                    {" " +
                      new Date(project.date_creation).toLocaleDateString(
                        "fr-FR"
                      )}
                  </Typography>
                </Tooltip>
              </div>
            }
          />
          <Hidden xsDown>
            <CardContent>
              {project.tags && project.tags.length > 0 && (
                <Tooltip title="Technologies">
                  <div className="horizontal-list">
                    <Settings color="primary" />
                    {project.tags.map((tag, i) => (
                      <React.Fragment key={tag.id_tag}>
                        <Typography color="primary">{tag.id_tag}</Typography>
                        {i < project.tags.length - 1 && (
                          <Divider orientation="vertical" flexItem />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </Tooltip>
              )}
              <Typography variant="body1" color="primary">
                Description
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {project.description}
              </Typography>
            </CardContent>
          </Hidden>
        </Link>
        <CardActions>
          <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
            <LikeButton project={project} current={current} />
            <CandidatButton project={project} />
            <PresidentProjectActions project={project} />
            <TeacherProjectAction project={project} />
            <MembreProjectActions project={project} />
            <AttachementButton project={project} />
            <div style={{ flex: 1 }} />

            {canEditProject(project) && (
              <Button
                component={Link}
                size="small"
                variant="outlined"
                to={getNextQuery("modifier", "id", project.id_sujet)}
              >
                Modifier
              </Button>
            )}
            {/* Comments button */}
            {canViewComments && (
              <Tooltip title="Commentaires">
                <IconButton size="small" onClick={() => expand(project)}>
                  <Badge badgeContent={comments.length} color="secondary">
                    <CommentRounded />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}
          </div>
        </CardActions>

        <Collapse
          in={expanded === project.id_sujet}
          timeout="auto"
          unmountOnExit
        >
          <CardContent>
            <ViewComments project={project} />
          </CardContent>
        </Collapse>
      </Card>
    )) || <div>no project</div>
  );
}

export default ProjectCard;

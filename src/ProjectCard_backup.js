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
  TextField,
  IconButton,
  ButtonGroup,
  Tooltip,
} from "@material-ui/core";
import {
  ThumbUp,
  ThumbDown,
  Schedule,
  FavoriteBorderOutlined,
  CommentRounded,
} from "@material-ui/icons";
import Comment from "./Comment";
import { useSelector, useDispatch } from "react-redux";
import { Enseignant } from "./Bottom";

function ProjectCard(props) {
  const currentUser = useSelector((state) => state.users.current);
  const candidatures = useSelector((state) => state.candidatures);
  const dispatch = useDispatch();

  const [expanded, setExpanded] = useState(undefined);
  const [values, setValues] = useState({ comment: "" });

  const project = props.project;

  function expand(project) {
    setExpanded(expanded === project.id_sujet ? undefined : project.id_sujet);
  }

  function alreadyCandidat() {
    for (var el of candidatures) {
      if (project.id_sujet === el.id_sujet) {
        if (el.id_etudiant === currentUser.id_utilisateur) return 1;
        if (el.id_etudiant_2 === currentUser.id_utilisateur) {
          if (el.etat === "attente de reponse") return 1;
          else return 2;
        }
      }
    }
    return 0;
  }



  return (
    <Card elevation={5} style={{ margin: "1rem 0" }}>
      <CardActionArea onClick={() => props.openProject(project)}>
        <CardHeader
          title={
            <Typography variant="h6">
              {/* {project.titre.length > 160
                  ? project.titre.substring(0, 120) + "..."
                  : project.titre} */}
              {project.titre}
            </Typography>
          }
          subheader={
            <Typography style={{ color: "gray", fontSize: "0.8rem" }}>
              {project.encadrants.length === 1 ? "Encadrant" : "Encadrants"}
              {` • ${project.encadrants[0].nom} ${
                project.encadrants[1]?.nom
                  ? " • " + project.encadrants[1].nom
                  : ""
              }`}
            </Typography>
          }
        />
        <CardContent style={{ padding: "1" }}>
          <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
            Description:
          </span>
          <Typography style={{ color: "gray", fontSize: "0.9rem" }}>
            {project.description.length > 30050
              ? project.description.substring(0, 30050) + "..."
              : project.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
          {currentUser.role === "etudiant" && (
            <CandidatButton
              setSelectedProject={props.setSelectedProject}
              openCandidature={props.openCandidature}
              candidatures={candidatures}
              project={project}
              alreadyCandidat={alreadyCandidat()}
            />
          )}
          <Tooltip title="Afficher le projet">
            <Button
              style={{ textTransform: "none" }}
              onClick={() => props.openProject(project)}
            >
              plus...
            </Button>
          </Tooltip>
          <div style={{ flexGrow: 1 }}></div>

          <ButtonGroup size="small" variant="outlined" color="primary">
            {currentUser.role === "membre" && (
              <Tooltip title="Avis positif">
                <Button startIcon={<ThumbUp />}></Button>
              </Tooltip>
            )}
            {currentUser.role === "membre" && (
              <Tooltip title="Avis négatif">
                <Button startIcon={<ThumbDown />}></Button>
              </Tooltip>
            )}
            <Tooltip title="Commentaires">
              <Button
                startIcon={<CommentRounded />}
                onClick={() => expand(project)}
              >
                {project.commentaires.length}
              </Button>
            </Tooltip>
          </ButtonGroup>
        </div>
      </CardActions>

      <Collapse in={expanded === project.id_sujet} timeout="auto" unmountOnExit>
        <CardContent>
          <div>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "end",
                justifyContent: "space-between",
              }}
            >
              <TextField
                value={values.comment}
                multiline
                variant="outlined"
                size="small"
                label="Ajouter un commentaire"
                fullWidth
                onChange={(e) =>
                  setValues({ ...values, comment: e.target.value })
                }
              />
              <Button
                variant="outlined"
                color="primary"
                size="small"
                disabled={values.comment === ""}
                onClick={() => {
                  props.addComment(project.id_sujet, values.comment);
                  setValues({ ...values, comment: "" });
                }}
              >
                Ajouter
              </Button>
            </div>
            <div>
              {project.commentaires &&
                project.commentaires.map((comment) => (
                  <Comment comment={comment} />
                ))}
            </div>
          </div>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default ProjectCard;

const CandidatButton = (props) => {
  var title =
    props.candidatures.length < 3
      ? "Il vous reste " + (3 - props.candidatures.length) + " candidatures."
      : "Vous ne pouvez plus candidater.";

  title =
    props.alreadyCandidat != 0
      ? props.alreadyCandidat === 1
        ? "Vous avez déjà candidater pour ce projet."
        : "Vous êtes invité a ce projet, consulter vos candidatures pour le confirmer ou réjéter."
      : title;
  return (
    <Tooltip title={title}>
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

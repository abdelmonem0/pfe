import React, { useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  Paper,
  useTheme,
  useMediaQuery,
  Hidden,
  CardHeader,
  Card,
  CardContent,
  Divider,
  Tooltip,
} from "@material-ui/core";
import { Link, useHistory, useLocation } from "react-router-dom";
import {
  Schedule,
  Settings,
  Person,
  LocationOn,
  Apartment,
  School,
} from "@material-ui/icons";
import { useSelector } from "react-redux";
import ViewComments from "../ViewComments";
import Slide from "@material-ui/core/Slide";
import PresidentProjectActions from "../../President/PresidentProjectActions";
import MembreProjectActions from "../../Membre/MembreProjectActions";
import AttachedFiles from "../AttachedFiles";
import CandidatButton from "../ViewProjects/CandidatButton";
import LikeButton from "../LikeButton";
import { canEditProject } from "../ViewProjects/logic";
import { getNextQuery } from "../ProjectDetail/logic";
import StateChip from "../ViewProjects/StateChip";
import CahierState from "../ViewProjects/CahierState";
import { getUserByID } from "../Candidature.js/CandidatureLogic";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function ProjectDetail(props) {
  const project = props.project;
  const current = useSelector((state) => state.users.current);
  const [open, setOpen] = useState(false);

  const canViewComments = can_view_comments(project, current);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const handleClose = () => {
    setOpen(!open);
  };

  return (
    <>
      <div style={{ cursor: "pointer" }} onClick={handleClose}>
        {props.children}
      </div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        fullWidth
        maxWidth={canViewComments ? "lg" : "md"}
        onClose={handleClose}
        fullScreen={fullScreen}
      >
        <Paper elevation={0} style={{ display: "flex", overflowY: "hidden" }}>
          <Paper elevation={0} style={{ flex: "1 1 60%", overflowY: "scroll" }}>
            <Card elevation={0}>
              <CardHeader
                title={project.titre}
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
                          {getUserByID(project.id_etudiant).nom}{" "}
                          {project.id_etudiant_2 &&
                            " - " + getUserByID(project.id_etudiant_2).nom}
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
              <CardContent>
                <div
                  className="horizontal-list wrap"
                  style={{ columnGap: "2rem" }}
                >
                  <div className="horizontal-list">
                    <LocationOn color="primary" />
                    <Typography variant="body1">
                      {project.interne ? "Interne" : "Externe"}
                    </Typography>
                  </div>
                  {!project.interne && (
                    <div className="horizontal-list">
                      <Apartment color="primary" />
                      <Typography variant="body1">{project.lieu}</Typography>
                    </div>
                  )}
                  {!project.interne && (
                    <div>
                      <Typography variant="subtitle2">
                        Encadrant externe: {project.enc_ext}
                      </Typography>
                    </div>
                  )}
                  {project.tags && project.tags.length > 0 && (
                    <Tooltip title="Technologies">
                      <div className="horizontal-list">
                        <Settings color="primary" />
                        {project.tags.map((tag, i) => (
                          <React.Fragment key={tag.id_tag}>
                            <Typography color="primary">
                              {tag.id_tag}
                            </Typography>
                            {i < project.tags.length - 1 && (
                              <Divider orientation="vertical" flexItem />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </Tooltip>
                  )}
                </div>
                <AttachedFiles project={project} />
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
          <LikeButton project={project} />
          <CandidatButton project={project} />
          <PresidentProjectActions project={project} />
          <MembreProjectActions project={project} />

          <div style={{ flex: 1 }} />
          {canEditProject(project) && (
            <Button
              size="small"
              variant="outlined"
              component={Link}
              to={getNextQuery("modifier", "id", project.id_sujet)}
            >
              Modifier
            </Button>
          )}
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ProjectDetail;

function can_view_comments(project, current) {
  return (
    project.id_etudiant === current.id_utilisateur ||
    project.id_etudiant_2 === current.id_utilisateur ||
    project.enc_prim === current.id_utilisateur ||
    project.enc_sec === current.id_utilisateur ||
    current.role === "president" ||
    current.role === "membre"
  );
}

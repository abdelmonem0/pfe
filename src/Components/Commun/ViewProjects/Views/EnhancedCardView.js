import React, { useState } from "react";
import Pagination from "@material-ui/lab/Pagination";
import ProjectCard from "../ProjectCard";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Hidden,
  Button,
  Tooltip,
  Paper,
  Typography,
  useTheme,
} from "@material-ui/core";
import LikeButton from "../../LikeButton";
import CandidatButton from "../CandidatButton";
import PresidentProjectActions from "../../../President/PresidentProjectActions";
import MembreProjectActions from "../../../Membre/MembreProjectActions";
import { canEditProject } from "../logic";
import { getNextQuery } from "../../ProjectDetail/logic";
import { Link } from "react-router-dom";
import AttachedFiles from "../../AttachedFiles";
import {
  Apartment,
  LocationOn,
  Person,
  Schedule,
  School,
  Settings,
} from "@material-ui/icons";
import { getUserByID } from "../../Candidature.js/CandidatureLogic";
import CahierState from "../CahierState";
import StateChip from "../StateChip";
import EnhancedProjectCard from "./EnhancedProjectCard";
import ViewComments from "../../ViewComments";
import { useSelector } from "react-redux";
import { can_view_comments } from "../ProjectCard";

function CardView(props) {
  const { projects } = props;

  const [page, setPage] = useState(1);
  const [elPerPage, setElPerPage] = useState(20);
  const [commentView, setCommentView] = useState(false);
  const [project, setProject] = useState(projects[0]);
  const pagesCount = Math.ceil(projects.length / elPerPage);
  const current = useSelector((state) => state.users.current);

  const canViewComments = can_view_comments(project, current);

  const handleSetProject = (project) => {
    setProject(project);
    setCommentView(false);
  };

  const sliceStart = (page - 1) * elPerPage;
  const sliceEnd = sliceStart + elPerPage;

  const handlePageChange = (e, v) => {
    setPage(v);
    window.scrollTo(0, 0);
  };
  const theme = useTheme();
  return (
    <>
      <Pagination
        count={pagesCount}
        defaultPage={1}
        page={page}
        color="primary"
        onChange={handlePageChange}
      />
      <div className="horizontal-list" style={{ alignItems: "flex-start" }}>
        <div className="vertical-list" style={{ flex: "1 1 49%" }}>
          {projects.slice(sliceStart, sliceEnd).map((pr) => (
            <React.Fragment key={pr.id_sujet}>
              <EnhancedProjectCard
                project={pr}
                setProject={handleSetProject}
                selected={project}
              />
            </React.Fragment>
          ))}
        </div>
        {project && (
          <Paper
            variant="outlined"
            style={{
              flex: "1 1 49%",
              position: "sticky",
              top: "4.5rem",
              height: "calc(100vh - 5rem)",
              overflow: "hidden",
            }}
          >
            <div
              elevation={0}
              className="vertical-list"
              style={{
                minHeight: "calc(100vh - 5rem)",
                maxHeight: "calc(100vh - 5rem)",
                overflowY: "scroll",
              }}
            >
              {!commentView && (
                <>
                  <CardHeader
                    title={project.titre}
                    subheader={
                      <div className="horizontal-list wrap">
                        <StateChip project={project} />
                        <CahierState project={project} />
                        {project.encadrants[0] && (
                          <Tooltip title="Encadrant">
                            <Typography variant="body2" color="textSecondary">
                              <School size="small" />{" "}
                              {project.encadrants[0].nom}{" "}
                              {(project.encadrants.length > 1 &&
                                " - " + project.encadrants[1].nom) ||
                                ""}
                            </Typography>
                          </Tooltip>
                        )}
                        {project.id_etudiant && (
                          <Tooltip title="Etudiant">
                            <Typography variant="body2" color="textSecondary">
                              <Person size="small" />{" "}
                              {getUserByID(project.id_etudiant)?.nom || ""}{" "}
                              {project.id_etudiant_2 &&
                                " - " +
                                  (getUserByID(project.id_etudiant_2)?.nom ||
                                    "")}
                            </Typography>
                          </Tooltip>
                        )}
                        <Tooltip title="Date d'ajout">
                          <Typography variant="body2" color="textSecondary">
                            <Schedule />
                            {" " +
                              new Date(
                                project.date_creation
                              ).toLocaleDateString("fr-FR")}
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
                          <Typography variant="body1">
                            {project.lieu}
                          </Typography>
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
                  </CardContent>
                </>
              )}
              {commentView && (
                <div
                  style={{ padding: "0.5rem 0.5rem", paddingBottom: "5rem" }}
                >
                  <ViewComments project={project} />
                </div>
              )}

              <div style={{ flex: 1 }} />

              <CardActions
                style={{
                  position: "sticky",
                  bottom: "0",
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <LikeButton project={project} />
                <CandidatButton project={project} />
                <PresidentProjectActions project={project} />
                <MembreProjectActions project={project} />

                <div style={{ flex: 1 }} />
                {canViewComments && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setCommentView(!commentView)}
                  >
                    {commentView ? "Sujet" : "Commentaires"}
                  </Button>
                )}
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
              </CardActions>
            </div>
          </Paper>
        )}
      </div>
      <Pagination
        count={pagesCount}
        defaultPage={1}
        page={page}
        color="primary"
        onChange={handlePageChange}
      />
    </>
  );
}

export default CardView;

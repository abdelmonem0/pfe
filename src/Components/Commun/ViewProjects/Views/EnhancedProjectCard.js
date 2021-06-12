import React, { useState } from "react";
import {
  Card,
  CardHeader,
  Typography,
  Tooltip,
  CardActionArea,
  useTheme,
} from "@material-ui/core";
import { Person, School, Schedule } from "@material-ui/icons";
import StateChip from "../StateChip";
import CahierState from "../CahierState";
import { getUserByID } from "../../Candidature.js/CandidatureLogic";

function EnhancedProjectCard(props) {
  const { project } = props;
  const theme = useTheme();
  return (
    (project && (
      <Card
        key={project.id_sujet}
        elevation={0}
        variant="outlined"
        style={{
          backgroundColor:
            props.selected.id_sujet === project.id_sujet
              ? theme.palette.background.default
              : theme.palette.background.paper,
        }}
      >
        {/* // <Link className="link-style" to={`?pid=${project.id_sujet}`}> */}
        <CardActionArea onClick={() => props.setProject(project)}>
          <div
            className="vertical-list"
            style={{ padding: "0.5rem", gap: "0.8rem" }}
          >
            <Typography variant="h6">{project.titre}</Typography>
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
                    new Date(project.date_creation).toLocaleDateString("fr-FR")}
                </Typography>
              </Tooltip>
            </div>
          </div>
        </CardActionArea>
        {/* </Link> */}
      </Card>
    )) || <div>no project</div>
  );
}

export default EnhancedProjectCard;

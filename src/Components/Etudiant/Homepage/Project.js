import {
  Button,
  Divider,
  Paper,
  Tooltip,
  Typography,
  useTheme,
} from "@material-ui/core";
import {
  CheckCircleOutlined,
  HourglassEmpty,
  Person,
  School,
  SupervisorAccount,
  Warning,
} from "@material-ui/icons";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { File_States } from "../../../Constants";
import AttachedFiles from "../../Commun/AttachedFiles";
import { getUserByID } from "../../Commun/Candidature.js/CandidatureLogic";
import UploadFile from "../../UploadFile";
import { saveCahierDeCharge, willRenderUploadCahier } from "./logic";

function Projects(props) {
  const theme = useTheme();
  const files = useSelector((state) => state.files);
  const users = useSelector((state) => state.users.all);
  const current = useSelector((state) => state.users.current);
  const project = useSelector((state) => state.projects.dataArray).find(
    (p) => p.id_sujet === current.sujet_affecte
  );

  return project ? (
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
      <Typography
        gutterBottom
        variant="h5"
        style={{ color: theme.palette.success.main }}
      >
        <CheckCircleOutlined />
        {"  "}
        Sujet affecté
      </Typography>
      <Divider />
      <Paper style={{ padding: "0.5rem" }} variant="outlined">
        <Link className="link-style" to={`?pid=${project.id_sujet}`}>
          <Typography variant="h6">{project.titre}</Typography>
        </Link>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Tooltip title="Encadrant">
            <div className="horizontal-list space-between wrap">
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
            </div>
          </Tooltip>
        </div>
      </Paper>
      <Upload project={project} theme={theme} files={files} />
      {project.fichiers.length > 0 && (
        <Paper style={{ padding: "0.5rem" }} variant="outlined">
          <Typography gutterBottom color="primary">
            Fichiers attachés
          </Typography>
          <AttachedFiles showState project={project} />
        </Paper>
      )}
      <Paper style={{ padding: "0.5rem" }} variant="outlined">
        <Typography gutterBottom>
          <HourglassEmpty />
          {"  "} Aucune soutenance n'est affectée au sujet
        </Typography>
      </Paper>
    </Paper>
  ) : null;
}

export default Projects;

const Upload = ({ project, theme, files }) => {
  return (
    willRenderUploadCahier(project) && (
      <Paper style={{ padding: "0.5rem" }} variant="outlined">
        <Typography gutterBottom style={{ color: theme.palette.warning.main }}>
          <Warning />
          {"  "} Vous devez ajouter une cahier de charge
        </Typography>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <UploadFile fileProp="Cahier de charge" />
          <div style={{ flex: "1" }} />
          {files.length > 0 && (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                console.log("saving file...");
                saveCahierDeCharge(project);
              }}
            >
              Enregistrer
            </Button>
          )}
        </div>
      </Paper>
    )
  );
};

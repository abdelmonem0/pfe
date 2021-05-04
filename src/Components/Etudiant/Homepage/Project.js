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
  School,
  SupervisorAccount,
  Warning,
} from "@material-ui/icons";
import React from "react";
import { useSelector } from "react-redux";
import AttachedFiles from "../../Commun/AttachedFiles";
import ProjectDetail from "../../Commun/ProjectDetail";
import UploadFile from "../../UploadFile";
import { saveCahierDeCharge, willRenderUploadCahier } from "./logic";

function Projects(props) {
  const theme = useTheme();
  const files = useSelector((state) => state.files);
  const users = useSelector((state) => state.users.all);
  const current = useSelector((state) => state.users.current);
  const project =
    useSelector((state) => state.projects.dataArray).filter(
      (p) => p.id_sujet === current.sujet_affecte
    )[0] || undefined;

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
        Sujet accepté
      </Typography>
      <Divider />
      <Paper style={{ padding: "0.5rem" }} variant="outlined">
        <ProjectDetail project={project}>
          <Typography variant="h6">{project.titre}</Typography>
        </ProjectDetail>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {project.affecte_a.length > 1 && (
            <>
              <SupervisorAccount />
              <Tooltip title="Partenair">
                <Typography variant="body2">
                  {
                    project.affecte_a.filter(
                      (u) => u.id_utilisateur !== current.id_utilisateur
                    )[0].nom
                  }
                </Typography>
              </Tooltip>
            </>
          )}
          <div style={{ flex: "1" }} />
          <Tooltip title="Encadrant">
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <School />
              <Typography variant="body2">
                {
                  users.filter((u) => u.id_utilisateur === project.enc_prim)[0]
                    .nom
                }
              </Typography>
              {project.enc_sec ? (
                <Typography variant="body2">
                  {
                    users.filter((u) => u.id_utilisateur === project.enc_sec)[0]
                      .nom
                  }
                </Typography>
              ) : null}
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
          <AttachedFiles fichiers={project.fichiers} />
        </Paper>
      )}
      <Paper style={{ padding: "0.5rem" }} variant="outlined">
        <Typography gutterBottom>
          <HourglassEmpty />
          {"  "} Aucune soutenance n'est encore affectée au sujet
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

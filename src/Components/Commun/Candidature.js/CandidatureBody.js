import {
  CardContent,
  Collapse,
  Paper,
  Typography,
  Tooltip,
  Button,
  useTheme,
} from "@material-ui/core";
import { DateRange } from "@material-ui/icons";
import React, { useState } from "react";
import AttachedFiles from "../AttachedFiles";
import ProjectDetail from "../ProjectDetail";
import { getProject, getUserByID, withAttachments } from "./CandidatureLogic";

function CandidatureBody(props) {
  const { candidature } = props;
  const project = getProject(candidature);
  return (
    <div className="vertical-list">
      <Paper variant="outlined" style={{ padding: "0.5rem" }}>
        <ProjectDetail project={project}>
          <Typography variant="h6">{project.titre}</Typography>
        </ProjectDetail>
      </Paper>
      {withAttachments(candidature) && (
        <Attachments candidature={candidature} />
      )}
    </div>
  );
}

export default CandidatureBody;

const Attachments = (props) => {
  const theme = useTheme();
  const { candidature } = props;
  const [open, setOpen] = useState(false);

  const student1Files = candidature.fichiers.filter(
    (f) => f.id_utilisateur === candidature.id_etudiant
  );
  const student2Files = candidature.fichiers.filter(
    (f) => f.id_utilisateur === candidature.id_etudiant_2
  );
  const comment1 = candidature.commentaires;
  const comment2 = candidature.commentaire_2;

  console.log(student1Files);

  return (
    <Paper
      variant="outlined"
      style={{ padding: "0.5rem", margin: "1rem 0.5rem 0 0" }}
    >
      <div className="horizontal-list" style={{ alignItems: "flex-start" }}>
        {(comment1 || student1Files.length > 0) && (
          <Paper
            style={{ padding: "0.25rem", flex: "1 1 49%" }}
            variant="outlined"
          >
            <Typography gutterBottom variant="subtitle2" color="textSecondary">
              {getUserByID(candidature.id_etudiant).nom}
            </Typography>
            {comment1 && (
              <Typography>
                Commentaire:{" " + candidature.commentaires}
              </Typography>
            )}
            <AttachedFiles fichiers={student1Files} />
          </Paper>
        )}
        {(comment2 || student2Files.length > 0) && (
          <Paper
            style={{ padding: "0.25rem", flex: "1 1 49%" }}
            variant="outlined"
          >
            <Typography gutterBottom variant="subtitle2" color="textSecondary">
              {getUserByID(candidature.id_etudiant_2).nom}
            </Typography>
            {comment2 && (
              <Typography>
                Commentaire:{" " + candidature.commentaire_2}
              </Typography>
            )}
            <AttachedFiles fichiers={student2Files} />
          </Paper>
        )}
      </div>
    </Paper>
  );
};

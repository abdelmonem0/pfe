import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  addFileToDatabase,
  send2ndCandidatureComment,
} from "../../../functions";
import UploadFile from "../../UploadFile";

function SecondStudent(props) {
  const { candidature, send2ndStudentFiles } = props;
  const [dialog, setDialog] = useState(false);
  const [comment, setComment] = useState("");
  const [textField, setTextField] = useState("");

  const files = useSelector((state) => state.files);
  const users = useSelector((state) => state.users);

  function sendFiles() {
    var fichiers = [];
    for (let file of files) {
      let fichier = [
        file.path,
        users.current.id_utilisateur,
        candidature.id_candidature,
        "candidature",
      ];
      fichiers.push(fichier);
    }
    if (fichiers.length > 0)
      addFileToDatabase(fichiers).catch((err) => console.error(err));
    if (comment.length > 0)
      send2ndCandidatureComment(
        candidature.id_candidature,
        comment
      ).catch((err) => console.error(err));
  }

  useEffect(() => {
    if (send2ndStudentFiles) {
      sendFiles();
    }
  }, [send2ndStudentFiles]);

  return (
    <div
      style={{
        marginTop: "1rem",
        padding: "0.5rem",
        border: "1px solid royalblue",
        borderRadius: "5px",
        display: "flex",
        gap: "0.5rem",
        flexWrap: "wrap",
      }}
    >
      <Typography gutterBottom color="primary" style={{ flex: "1 1 100%" }}>
        Vous pouvez attacher des fichiers ou ajouter un commentaire avant la
        confirmation de la candidature.
      </Typography>
      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {comment !== ""
            ? "Modifier le commentaire"
            : "Ajouter un commentaire"}
        </DialogTitle>
        <DialogContent>
          <TextField
            variant="outlined"
            label="Commentaire"
            multiline
            value={textField}
            autoFocus
            fullWidth
            placeholder="Ceci est optionnel"
            onChange={(e) => setTextField(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setComment(textField);
              setDialog(false);
            }}
          >
            Ajouter
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setDialog(false)}
          >
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
      <div style={{ flex: "1 1 100%" }}>
        <UploadFile
          fileProp="Attacher de fichiers"
          attache_a={candidature.id_candidature}
          type="candidature"
        />
      </div>
      <Button
        size="small"
        variant="outlined"
        color="primary"
        onClick={() => setDialog(true)}
      >
        {comment !== "" ? "Modifier le commentaire" : "Ajouter un commentaire"}
      </Button>
      {comment && (
        <Typography variant="body2" color="textSecondary">
          Votre commentaire: {comment}
        </Typography>
      )}
    </div>
  );
}

export default SecondStudent;

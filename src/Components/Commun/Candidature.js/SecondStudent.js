import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
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
  const { candidature, setAlreadySent, onClose } = props;
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

    setAlreadySent(true);
    onClose();
  }

  return (
    <>
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
      <Card>
        <CardHeader
          title={
            <Typography color="primary">
              Vous pouvez attacher des fichiers ou ajouter un commentaire avant
              la confirmation de la candidature.
            </Typography>
          }
        />

        <CardContent>
          <UploadFile fileProp="Attacher de fichiers" />
          <Divider style={{ margin: "1rem 0" }} />
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => setDialog(true)}
          >
            {comment !== ""
              ? "Modifier le commentaire"
              : "Ajouter un commentaire"}
          </Button>
          {comment && (
            <Typography variant="body2" color="textSecondary">
              Votre commentaire: {comment}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <div style={{ flex: "1" }} />
          <Button color="primary" onClick={() => sendFiles()}>
            Envoyer
          </Button>
          <Button color="secondary" onClick={() => onClose()}>
            Annuler
          </Button>
        </CardActions>
      </Card>
    </>
  );
}

export default SecondStudent;

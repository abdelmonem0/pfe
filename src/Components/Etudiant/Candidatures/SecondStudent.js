import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import UploadFile from "../../UploadFile";

function SecondStudent(props) {
  const candidature = props.candidature;
  const [dialog, setDialog] = useState(false);
  const [comment, setComment] = useState("");
  const [textField, setTextField] = useState("");
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

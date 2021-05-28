import React, { useEffect } from "react";
import {
  Typography,
  IconButton,
  Paper,
  Button,
  Divider,
} from "@material-ui/core";
import { Attachment, Delete } from "@material-ui/icons";
import {
  deleteFileFromDatabase,
  downloadFile,
  getProjects,
} from "../../functions";
import download from "js-file-download";
import { useDispatch, useSelector } from "react-redux";
import EvaluateCahier from "../President/EvaluateCahier";
import ConfirmDialog from "./ConfirmDialog";
import { canSeeCahierState } from "./ViewProjects/logic";
import { getProjectByID } from "../Enseignant/Candidatures/logic";

function AttachedFiles(props) {
  const dispatch = useDispatch();
  const { project, canDelete } = props;
  var _project = getProjectByID(project.id_sujet);
  const canSee = canSeeCahierState(_project);
  return (
    (_project.fichiers.length > 0 && canSee && (
      <Paper
        elevation={0}
        style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
      >
        <Attachment />
        {_project.fichiers.map((file) => (
          <File file={file} canDelete={canDelete} dispatch={dispatch} />
        ))}
      </Paper>
    )) ||
    null
  );
}

export default AttachedFiles;

const File = (props) => {
  const { dispatch, file } = props;
  const current = useSelector((state) => state.users.current);
  const canDelete = props.canDelete || current.role === "president";
  var fileName = file.id_fichier;
  fileName = fileName.substring(fileName.indexOf("_") + 1, fileName.length);

  const _downloadFile = () => {
    downloadFile(file.id_fichier)
      .then((result) => {
        download(result.data, fileName);
      })
      .catch((err) => console.error(err));
  };

  const _deleteFile = () => {
    deleteFileFromDatabase(file.id_fichier)
      .then(() =>
        getProjects().then(() => {
          dispatch({ type: "DELETE_FILE", payload: file });
        })
      )
      .catch((err) => console.log(err));
  };

  return (
    <div key={file.id_fichier} className="horizontal-list wrap">
      <Button
        size="small"
        variant="outlined"
        onClick={_downloadFile}
        style={{ textTransform: "none" }}
      >
        <div className="horizontal-list wrap">
          <Typography>{file.type}</Typography>
          <Divider orientation="vertical" flexItem />
          {fileName}
        </div>
      </Button>
      {canDelete && (
        <ConfirmDialog
          title="Confirmer suppression"
          body="Voulez-vous vraiment supprimer ce fichier?"
          onConfirm={_deleteFile}
        >
          <IconButton size="small">
            <Delete />
          </IconButton>
        </ConfirmDialog>
      )}
      <EvaluateCahier file={file} />
    </div>
  );
};

import React from "react";
import { Button, Paper, Tooltip, Typography } from "@material-ui/core";
import { Attachment } from "@material-ui/icons";
import { useSelector } from "react-redux";
import { downloadFile } from "../../functions";
import download from "js-file-download";

function AttachedFiles(props) {
  const files = props.fichiers;
  return (
    <Paper
      elevation={0}
      style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
    >
      <Attachment />
      {files.map((file) => {
        return <File file={file} />;
      })}
    </Paper>
  );
}

export default AttachedFiles;

const File = (props) => {
  var fileName = props.file.id_fichier;
  fileName = fileName.substring(fileName.indexOf("_") + 1, fileName.length);

  const users = useSelector((state) => state.users.all);
  const user = users.filter((el) => {
    return el.id_utilisateur === props.file.id_utilisateur;
  })[0];

  const _downloadFile = () => {
    downloadFile(props.file.id_fichier)
      .then((result) => {
        download(result.data, fileName);
      })
      .catch((err) => console.error(err));
  };

  return (
    <Tooltip title={"Attaché par: " + user.nom}>
      <div>
        <Button
          size="small"
          disableElevetion
          variant="outlined"
          color="primary"
          style={{ textTransform: "none" }}
          onClick={_downloadFile}
        >
          {fileName}
        </Button>
      </div>
    </Tooltip>
  );
};

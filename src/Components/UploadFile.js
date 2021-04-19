import React, { useState, useEffect } from "react";
import { Button, Paper, CircularProgress, Chip } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { CloudUpload } from "@material-ui/icons";
import axios from "axios";
import { deleteFileFromDatabase, uploadFile } from "../functions";
import { useDispatch } from "react-redux";

function UploadFile(props) {
  const fileProp = props.fileProp ? props.fileProp : "Fichier";

  const [files, setFiles] = useState([]);

  const dispatch = useDispatch();

  const handleDelete = (path) => {
    deleteFileFromDatabase(path).then(() => {
      var remainingFiles = files.filter((file) => {
        return file.path !== path;
      });
      setFiles(remainingFiles);
      dispatch({ type: "SET_FILES", remainingFiles });
    });
  };

  function setFilePath(index, path) {
    let allFiles = files;
    allFiles[index].path = path;
    setFiles(allFiles);
    dispatch({ type: "SET_FILES", payload: allFiles });
  }

  useEffect(() => {
    return function () {
      dispatch({ type: "CLEAR_FILES" });
    };
  }, []);

  return (
    <Paper
      elevation={0}
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Button
        component="label"
        variant="contained"
        color="primary"
        startIcon={<CloudUpload />}
      >
        <input
          type="file"
          hidden
          multiple
          onChange={(event) => {
            let _files = [];
            for (var i = 0; i < event.target.files.length; i++)
              _files.push({ file: event.target.files[i], path: "" });
            setFiles(files.concat(_files));
          }}
        />
        {fileProp}
      </Button>

      {files.length > 0 &&
        files.map((object, index) => {
          return (
            <File
              object={object}
              index={index}
              handleDelete={handleDelete}
              setFilePath={setFilePath}
            />
          );
        })}
    </Paper>
  );
}

export default UploadFile;

const File = (props) => {
  const file = props.object.file;
  const [progress, setProgress] = useState(0);

  useEffect(() => submitHandler(), []);

  function handleFileUploaded(_fileName) {
    props.setFilePath(props.index, _fileName);
  }

  function handleDelete() {
    props.handleDelete(props.object.path);
  }

  const submitHandler = () => {
    let formData = new FormData();

    formData.append("file", file);

    axios
      .post(uploadFile, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },

        onUploadProgress: (data) => {
          //Set the progress value to show the progress bar

          let _progress = Math.round((100 * data.loaded) / data.total);
          if (_progress === 100) _progress = -1;
          setProgress(_progress);
        },
      })
      .then((response) => {
        handleFileUploaded(response.data.fileName);
      });
  };

  return (
    <div>
      <Chip
        label={file.name}
        style={{ backgroundColor: progress === -1 ? green[500] : "lightgray" }}
        icon={
          progress !== -1 && (
            <CircularProgress
              size={24}
              variant="determinate"
              value={progress}
              style={{ color: green[700] }}
            />
          )
        }
        onDelete={progress === -1 ? () => handleDelete() : undefined}
      />
    </div>
  );
};

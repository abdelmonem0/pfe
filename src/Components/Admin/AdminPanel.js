import { React, useState } from "react";
import { Button, Divider, Typography } from "@material-ui/core";
import { CloudUpload, InsertDriveFile } from "@material-ui/icons";
import { DataGrid } from "@material-ui/data-grid";
import { useDispatch } from "react-redux";
import { fillDatabaseFromUploadedFile, uploadExcelFile } from "../../functions";
import ConfirmDialog from "../Commun/ConfirmDialog";

function AdminPanel() {
  const [filePath, setFilePath] = useState(null);
  const [fetchedUsers, setFetchedUsers] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const dispatch = useDispatch();

  const clear = () => {
    setFetchedUsers(null);
    setFilePath(null);
    setStatistics(null);
  };

  const uploadFileToServer = (file) => {
    const formData = new FormData();
    formData.append("file", file, file.name);
    uploadExcelFile(formData)
      .then((result) => {
        if (result.data.status === "success") {
          setFetchedUsers(result.data.fetchedUsers);
          setStatistics(result.data.statistics);
          setFilePath(result.data.fileName);
          dispatch({
            type: "OPEN_SNACK",
            payload: {
              type: "success",
              message: "Fichier téléchargé su le serveur.",
            },
          });
        }
      })
      .catch((error) => console.error(error));
  };

  const fillDatabase = () => {
    fillDatabaseFromUploadedFile(filePath)
      .then((result) => console.log(result.data))
      .catch((error) => console.error(error));
  };
  return (
    <>
      <div className="vertical-list" style={{ flex: 1 }}>
        <Typography variant="h5" color="secondary">
          Le fichier Excel doit contenir les champs suivants: [id, nom, prenom,
          email, role]
        </Typography>
        <div className="horizontal-list wrap">
          {(filePath && fetchedUsers && statistics && (
            <>
              <ConfirmDialog
                title="Importer"
                body="Inserer ces données cans la base de données? Toutes données précédentes vont être supprimer!"
                onConfirm={fillDatabase}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  endIcon={<CloudUpload fontSize="large" />}
                >
                  Inserer
                </Button>
              </ConfirmDialog>
              <Button
                variant="outlined"
                color="primary"
                component="label"
                size="small"
              >
                Choisir un autre fichier
                <input
                  type="file"
                  hidden
                  onChange={(event) => {
                    clear();
                    setFilePath(event.target.files[0]);
                    uploadFileToServer(event.target.files[0]);
                  }}
                />
              </Button>

              <Divider orientation="vertical" flexItem />

              <Typography color="textSecondary">Fichier choisit:</Typography>
              <Typography color="primary">{filePath.name}</Typography>
              <div style={{ flex: "1 1 100%" }} />
              <Typography>Statistiques: </Typography>
              <Typography>Total: {statistics.total}</Typography>
              <Typography>Etudiants: {statistics.etudiants}</Typography>
              <Typography>Enseignants: {statistics.enseignants}</Typography>
              <Typography>Membres: {statistics.membres}</Typography>
            </>
          )) || (
            <Button
              variant="outlined"
              color="primary"
              component="label"
              endIcon={<InsertDriveFile />}
            >
              Choisir un fichier
              <input
                type="file"
                hidden
                onChange={(event) => {
                  console.log(event.target.files);
                  setFilePath(event.target.files[0]);
                  uploadFileToServer(event.target.files[0]);
                }}
              />
            </Button>
          )}
        </div>
        {fetchedUsers && <UsersTable users={fetchedUsers} />}
      </div>
    </>
  );
}

export default AdminPanel;

const UsersTable = (props) => {
  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "nom", headerName: "Nom", width: 150 },
    { field: "prenom", headerName: "Prenom", width: 150 },
    { field: "email", headerName: "Email", width: 300 },
    { field: "role", headerName: "Role", width: 160 },
  ];

  const rows = props.users;

  return (
    <div style={{ height: 500 }}>
      <DataGrid rows={rows} columns={columns} pageSize={25} />
    </div>
  );
};

import { React, useState } from "react";
import axios from "axios";
import { Button, AppBar, Toolbar, Typography } from "@material-ui/core";
import { CloudUpload, InsertDriveFile } from "@material-ui/icons";
import { DataGrid } from "@material-ui/data-grid";

function Admin() {
  const [filePath, setFilePath] = useState(null);
  const [fetchedUsers, setFetchedUsers] = useState(null);
  const [statistics, setStatistics] = useState(null);

  const uploadFileToServer = (file) => {
    const formData = new FormData();
    formData.append("filePath", file, file.name);
    console.log(formData);
    axios
      .post("http://localhost:5000/importing/upload", formData)
      .then((result) => {
        if (result.data.success) {
          setFetchedUsers(result.data.fetchedUsers);
          setStatistics(result.data.statistics);
        }
      })
      .catch((error) => console.error(error));
  };

  const fillDatabase = () => {
    axios
      .get("http://localhost:5000/importing/fill")
      .then((result) => console.log(result.data))
      .catch((error) => console.error(error));
  };
  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography style={{ flexGrow: 1 }} variant="h5" edge="start">
            Importer des utilisateurs
          </Typography>
          <Button variant="contained" color="secondary">
            deconnexion
          </Button>
        </Toolbar>
      </AppBar>
      <div style={{ margin: "2rem" }}>
        <h5 style={{ color: "red" }}>
          ** Le fichier Excel doit contenir les champs suivants: [id, nom,
          prenom, email, type, classe] **
        </h5>
        <div
          style={{ display: "flex", flexDirection: "row", margin: "1rem 0" }}
        >
          <div
            class="col-sm-3"
            style={{ display: "flex", flexDirection: "column" }}
          >
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
                  setFilePath(event.target.files[0]);
                  uploadFileToServer(event.target.files[0]);
                }}
              />
            </Button>
            {filePath && fetchedUsers && (
              <Button
                variant="contained"
                color="primary"
                endIcon={<CloudUpload fontSize="large" />}
                style={{ margin: "1rem 0", backgroundColor: "green" }}
                onClick={fillDatabase}
              >
                Importer
              </Button>
            )}
          </div>
          {filePath && fetchedUsers && statistics && (
            <div class="col-sm-9" style={{ borderLeft: "gray solid 1px" }}>
              <h5>
                Fichier choisit:{" "}
                <span style={{ color: "royalblue" }}>{filePath.name}</span>
              </h5>
              <span>Statistiques: </span>
              <span
                style={{
                  padding: "0 1rem",
                  borderRight: "lightgray solid 1px",
                }}
              >
                Total: {statistics.total}
              </span>
              <span
                style={{
                  padding: "0 1rem",
                  borderRight: "lightgray solid 1px",
                }}
              >
                Etudiants: {statistics.etudiants}
              </span>
              <span
                style={{
                  padding: "0 1rem",
                  borderRight: "lightgray solid 1px",
                }}
              >
                Enseignants: {statistics.enseignants}
              </span>
              <span style={{ padding: "0 1rem" }}>
                Membres: {statistics.membres}
              </span>
            </div>
          )}
        </div>
        {fetchedUsers && <UsersTable users={fetchedUsers} />}
      </div>
    </>
  );
}

export default Admin;

const UsersTable = (props) => {
  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "nom", headerName: "Nom", width: 150 },
    { field: "prenom", headerName: "Prenom", width: 150 },
    { field: "email", headerName: "Email", width: 300 },
    { field: "type", headerName: "Role", width: 160 },
    { field: "classe", headerName: "Classe", width: 160 },
  ];

  const rows = props.users;

  return (
    <div style={{ height: 500 }}>
      <DataGrid rows={rows} columns={columns} pageSize={25} />
    </div>
  );
};

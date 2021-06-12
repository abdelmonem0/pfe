import { React, useState } from "react";
import { Button, TextField, Typography, useTheme } from "@material-ui/core";
import moment from "moment";
import "moment/locale/fr";
import { useDispatch, useSelector } from "react-redux";
import UploadFile from "../../UploadFile";
import {
  initialErrors,
  validateProposal,
  updateProjectToDatabase,
} from "./logic";
import { useHistory, useLocation } from "react-router";
import AttachedFiles from "../../Commun/AttachedFiles";
import ConfirmDialog from "../../Commun/ConfirmDialog";
import { getProjectData } from "../../Enseignant/ProjectForm/logic";
import { getProjectByID } from "../../Enseignant/Candidatures/logic";
import { File_States, Project_States } from "../../../Constants";

moment.locale("fr");

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function EditProject(props) {
  const theme = useTheme();
  var query = useQuery();
  const dispatch = useDispatch();
  const [projectId, setProjectId] = useState(query.get("id"));
  const project = getProjectByID(projectId);
  const current = useSelector((state) => state.users.current);
  const history = useHistory();

  const [errors, setErrors] = useState(initialErrors);
  const [form, setForm] = useState(getProjectData(projectId));
  const [values, setValues] = useState({
    encSec: form.enc_sec,
    interne: form.interne,
  });

  const onTextChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const update = () => {
    const { isValidated, errors } = validateProposal(form);
    if (!isValidated) {
      setErrors(errors);
      return;
    }
    dispatch({ type: "OPEN_BACKDROP" });
    updateProjectToDatabase(
      form,
      projectId,
      Project_States.proposed_by_student_for_teacher,
      File_States.cahier_de_charge_en_instance,
      project.fichiers
    )
      .then(() => {
        dispatch({ type: "CLOSE_BACKDROP" });
        dispatch({
          type: "OPEN_SNACK",
          payload: {
            open: true,
            message: "Projet est mis à jour.",
            type: "success",
          },
        });
        history.push("/sujets/mes");
      })
      .catch((err) => console.error(err));
  };

  const toggleEncSec = () => {
    var temp = !values.encSec;
    setValues((values) => ({ ...values, encSec: !values.encSec }));
    if (!temp) {
      setForm({ ...form, enc_sec: null });
    }
  };

  // React.useEffect(() => {}, []);

  return (
    <div
      style={{
        minHeight: "80vh",
        gap: "1.5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        elevation={0}
        style={{
          gap: "0.5rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        <Typography variant="h4" paragraph style={{ flex: "1 1 100%" }}>
          Modifier un sujet
        </Typography>

        <TextField
          onChange={onTextChange}
          label="Titre"
          id="titre"
          value={form.titre}
          placeholder="Le titre du sujet"
          variant="outlined"
          error={errors.titre.length > 0}
          helperText={errors.titre}
          style={{ flex: "1 1 65%" }}
        />
        <TextField
          onChange={onTextChange}
          label="Description"
          id="description"
          value={form.description}
          placeholder="La description du sujet"
          variant="outlined"
          multiline
          error={errors.description.length > 0}
          helperText={errors.description}
          style={{ flex: "1 1 45%", minWidth: "16rem" }}
          inputProps={{
            style: {
              minHeight: "4rem",
            },
          }}
        />
        <TextField
          onChange={onTextChange}
          label="Travail"
          id="travail"
          value={form.travail}
          placeholder="Le travail demandé
          "
          variant="outlined"
          multiline
          error={errors.travail.length > 0}
          helperText={errors.travail}
          style={{ flex: "1 1 45%", minWidth: "16rem" }}
          inputProps={{
            style: {
              minHeight: "4rem",
            },
          }}
        />

        <TextField
          variant="outlined"
          color="primary"
          label="Technologies/outils"
          defaultValue={form.tags.toString()}
          multiline
          error={errors.tags.length > 0}
          helperText={errors.tags}
          placeholder='Separer les elements par un virgule. ex: "NodeJS, ReactJS, mySQL"'
          onChange={(e) => {
            setForm({
              ...form,
              tags: e.target.value.split(","),
            });
          }}
          style={{ flex: "1 1 100%" }}
        />
        {project.fichiers.length ? (
          <AttachedFiles project={project} canDelete />
        ) : (
          <UploadFile size="large" fileProp="Cahier de charge" />
        )}
      </div>
      <div
        elevation={0}
        style={{
          display: "flex",
          gap: "0.5rem",
          position: "sticky",
          bottom: "0.5rem",
          zIndex: 1000,
          padding: "0.5rem, 0",
        }}
      >
        <ConfirmDialog
          title="Mise à jour"
          body="Confimer la mise à jour du sujet"
          onConfirm={update}
        >
          <Button color="primary" variant="contained">
            Mettre à jour
          </Button>
        </ConfirmDialog>
      </div>
    </div>
  );
}
export default EditProject;

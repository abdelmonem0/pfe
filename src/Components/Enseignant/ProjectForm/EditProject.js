import { React, useState } from "react";
import {
  Button,
  TextField,
  Checkbox,
  ButtonGroup,
  Typography,
  Paper,
  Collapse,
  useTheme,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import moment from "moment";
import "moment/locale/fr";
import { useDispatch, useSelector } from "react-redux";
import UploadFile from "../../UploadFile";
import {
  initialErrors,
  deleteProjectFromDatabase,
  validate,
  getProjectData,
  updateProjectToDatabase,
} from "./logic";
import { useHistory, useLocation } from "react-router";
import AttachedFiles from "../../Commun/AttachedFiles";
import { getProjectByID } from "../Candidatures/logic";
import ConfirmDialog from "../../Commun/ConfirmDialog";

moment.locale("fr");

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function EditProject(props) {
  const theme = useTheme();
  var query = useQuery();
  const history = useHistory();
  const [projectId, setProjectId] = useState(query.get("id"));
  const project = getProjectByID(projectId);
  if (!project) {
    alert("Sujet introuvable");
    history.replace("/sujets");
  }
  const current = useSelector((state) => state.users.current);
  const users = useSelector((state) => state.users.all)
    .filter(
      (object) =>
        object.role === "enseignant" &&
        object.id_utilisateur !== current.id_utilisateur
    )
    .sort((a, b) => a.nom.localeCompare(b.nom));

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

  const onAutocompleteChange = (e, option, prop) => {
    var id_utilisateur = option?.id_utilisateur || null;
    setForm({ ...form, [prop]: id_utilisateur });
  };

  const update = () => {
    const { isValidated, errors } = validate(form, {
      ...values,
      files: project.fichiers,
    });
    if (!isValidated) {
      setErrors(errors);
      return;
    }

    updateProjectToDatabase(
      form,
      projectId,
      project.etat,
      "Fiche externe",
      project.fichiers
    ).then(() => {
      if (current.role === "president")
        history.push("/sujets?pid=" + project.id_sujet);
      else history.push("/sujets/mes?id_sujet=" + project.id_sujet);
    });
  };

  const _delete = () => {
    deleteProjectFromDatabase(project.id_sujet)
      .then(() => history.replace("/sujets"))
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
    (project && (
      <div
        style={{
          minHeight: "80vh",
          gap: "1.5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Paper
          elevation={0}
          style={{
            gap: "0.5rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <Typography variant="h4" paragraph style={{ flex: "1 1 100%" }}>
            Proposer un sujet
          </Typography>
          {current.role !== "etudiant" && (
            <ButtonGroup
              size="large"
              style={{
                flex: "1 1 30%",
              }}
              disableElevation
            >
              <Button
                color={form.interne ? "primary" : "default"}
                variant={form.interne ? "contained" : "outlined"}
                style={{ flex: "1 1 45%", fontSize: "1.2rem" }}
                onClick={() => {
                  setForm({ ...form, interne: true });
                }}
              >
                Interne
              </Button>
              <Button
                color={!form.interne ? "primary" : "default"}
                variant={!form.interne ? "contained" : "outlined"}
                style={{ flex: "1 1 45%", fontSize: "1.2rem" }}
                onClick={() => setForm({ ...form, interne: false })}
              >
                Externe
              </Button>
            </ButtonGroup>
          )}
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

          <Autocomplete
            onChange={(e, op) => onAutocompleteChange(e, op, "enc_prim")}
            id="enc_prim"
            options={users}
            getOptionLabel={(option) => option.nom}
            disabled={current.role !== "president"}
            defaultValue={
              current.role !== "president"
                ? current
                : users.find((u) => u.id_utilisateur === form.enc_prim)
            }
            value={users.find((u) => u.id_utilisateur === form.enc_prim)}
            getOptionSelected={(option, value) =>
              value && option.id_utilisateur === value.id_utilisateur
            }
            groupBy={(option) => option.nom.charAt(0)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Encadrant primair"
                variant="outlined"
                placeholder="Séléctionner l'encadrant pour ce sujet."
                error={errors.enc_sec.length > 0}
                helperText={errors.enc_sec}
              />
            )}
            style={{ flex: "1 1 45%", minWidth: "16rem" }}
          />
          <div style={{ display: "flex", flex: "1 1 45%", minWidth: "16rem" }}>
            <Checkbox
              checked={form.enc_sec || values.encSec}
              color="primary"
              onChange={() => toggleEncSec()}
            />
            <Autocomplete
              onChange={(e, op) => onAutocompleteChange(e, op, "enc_sec")}
              id="enc_sec"
              options={users}
              getOptionLabel={(option) => option.nom}
              disabled={!values.encSec ? true : !form.enc_sec}
              value={users.find((u) => u.id_utilisateur === form.enc_sec)}
              getOptionSelected={(option, value) =>
                value && option.id_utilisateur === value.id_utilisateur
              }
              groupBy={(option) => option.nom.charAt(0)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Encadrant secondair"
                  variant="outlined"
                  placeholder="Séléctionner l'encadrant pour ce sujet."
                  error={errors.enc_sec.length > 0}
                  helperText={errors.enc_sec}
                />
              )}
              style={{ flex: "1" }}
            />
          </div>
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
          <Collapse
            unmountOnExit
            in={!form.interne}
            style={{ flex: "1 1 100%" }}
          >
            <div
              style={{
                gap: "0.5rem",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
              }}
            >
              <TextField
                onChange={(e) =>
                  setForm({ ...form, [e.target.id]: e.target.value })
                }
                label="Lieu (Societé)"
                id="lieu"
                value={form.lieu}
                variant="outlined"
                error={errors.lieu.length > 0}
                helperText={errors.lieu}
                style={{ flex: "1 1 49%", minWidth: "16rem" }}
              />
              <TextField
                onChange={(e, value) =>
                  setForm({ ...form, [e.target.id]: e.target.value })
                }
                id="enc_ext"
                label="Encadrant externe"
                value={form.enc_ext}
                variant="outlined"
                placeholder="Séléctionner l'encadrant pour ce sujet."
                error={errors.enc_ext.length > 0}
                helperText={errors.enc_ext}
                style={{ flex: "1 1 49%", minWidth: "16rem" }}
              />
              {project.fichiers.length ? (
                <AttachedFiles project={project} canDelete />
              ) : (
                <UploadFile size="large" fileProp="Fiche externe" />
              )}
            </div>
          </Collapse>
        </Paper>
        <Paper
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
          <ConfirmDialog
            title="Supprimer le sujet"
            body="Confimer la suppression du sujet"
            onConfirm={() => _delete()}
          >
            <Button
              style={{
                backgroundColor: theme.palette.error.main,
                color: "white",
              }}
              variant="contained"
            >
              Supprimer
            </Button>
          </ConfirmDialog>
        </Paper>
      </div>
    )) ||
    null
  );
}
export default EditProject;

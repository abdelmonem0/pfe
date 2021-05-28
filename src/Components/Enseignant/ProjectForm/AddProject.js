import { React, useState } from "react";
import {
  Button,
  TextField,
  Checkbox,
  ButtonGroup,
  Typography,
  Collapse,
  useTheme,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import moment from "moment";
import "moment/locale/fr";
import { useSelector, useDispatch } from "react-redux";
import UploadFile from "../../UploadFile";
import {
  initialErrors,
  initialForm,
  validate,
  addProjectToDatabase,
} from "./logic";
import { Project_States } from "../../../Constants";

moment.locale("fr");

function AddProject(props) {
  const theme = useTheme();
  const current = useSelector((state) => state.users.current);
  const users = useSelector((state) => state.users.all)
    .filter(
      (object) =>
        object.role === "enseignant" &&
        object.id_utilisateur !== current.id_utilisateur
    )
    .sort((a, b) => a.nom.localeCompare(b.nom));
  const [values, setValues] = useState({
    encSec: false,
  });
  const [errors, setErrors] = useState(initialErrors);
  const [form, setForm] = useState(initialForm);

  const onTextChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const onAutocompleteChange = (e, option) => {
    var id_utilisateur = option?.id_utilisateur || null;
    setForm({ ...form, enc_sec: id_utilisateur });
  };

  const sendData = () => {
    const { isValidated, errors } = validate(form, values);
    if (!isValidated) {
      setErrors(errors);
      return;
    }
    addProjectToDatabase({ ...form, etat: Project_States.waiting });
  };

  const toggleEncSec = () => {
    var temp = !values.encSec;
    setValues((values) => ({ ...values, encSec: !values.encSec }));
    if (!temp) {
      setForm({ ...form, enc_sec: null });
    }
  };

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
          label="Encadrant primair"
          variant="outlined"
          value={current.nom}
          disabled
          style={{ flex: "1 1 45%", minWidth: "16rem" }}
        />
        <div style={{ display: "flex", flex: "1 1 45%", minWidth: "16rem" }}>
          <Checkbox color="primary" onChange={() => toggleEncSec()} />
          <Autocomplete
            onChange={onAutocompleteChange}
            id="enc_sec"
            options={users}
            getOptionLabel={(option) => option.nom}
            disabled={values.encSec ? false : true}
            //getOptionDisabled={(option) => option.includes("m")}
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
          multiline
          error={errors.tags.length > 0}
          helperText={errors.tags}
          placeholder='Separer les elements par un virgule. ex: "NodeJS, ReactJS, mySQL"'
          onChange={(e) => {
            setForm({
              ...form,
              tags: e.target.value.replace(/\s/g, "").split(","),
            });
          }}
          style={{ flex: "1 1 100%" }}
        />
        <Collapse unmountOnExit in={!form.interne} style={{ flex: "1 1 100%" }}>
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
              variant="outlined"
              placeholder="Séléctionner l'encadrant pour ce sujet."
              error={errors.enc_ext.length > 0}
              helperText={errors.enc_ext}
              style={{ flex: "1 1 49%", minWidth: "16rem" }}
            />
            <UploadFile size="large" fileProp="Fiche externe" />
          </div>
        </Collapse>
      </div>
      <div
        className="horizontal-list"
        style={{
          backgroundColor: theme.palette.background.default,
          flex: 1,
          position: "sticky",
          bottom: "0rem",
          zIndex: 1000,
          padding: "0.5rem 0",
        }}
      >
        <Button color="primary" variant="contained" onClick={() => sendData()}>
          Envoyer
        </Button>
      </div>
    </div>
  );
}
export default AddProject;

import { React, useState } from "react";
import {
  Button,
  TextField,
  Checkbox,
  ButtonGroup,
  Typography,
  Paper,
  Collapse,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import moment from "moment";
import "moment/locale/fr";
import { useSelector, useDispatch } from "react-redux";
import { addFileToDatabase, addProject } from "../../functions";
import UploadFile from "../UploadFile";
import { v4 as uuid } from "uuid";
import { useHistory } from "react-router";

moment.locale("fr");

function AddProject(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const files = useSelector((state) => state.files);
  const users = useSelector((state) => state.users.all);
  const current = useSelector((state) => state.users.current);
  const [techs, setTechs] = useState("");
  const [secondStudent, setSecondStudent] = useState(false);
  const [errors, setErrors] = useState({
    titre: "",
    description: "",
    travail: "",
    techs: "",
    lieu: "",
    enc_ext: "",
    id_etudiant_2: "",
  });
  const [form, setForm] = useState({
    titre: "",
    description: "",
    travail: "",
    interne: false,
    id_etudiant: current.id_utilisateur,
    date: new Date(),
  });

  const students = users.filter(
    (us) =>
      us.role === "etudiant" &&
      us.id_utilisateur !== current.id_utilisateur &&
      !us.sujet_affecte
  );

  const onTextChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const sendData = () => {
    const id_sujet = uuid();
    if (!validate()) return;

    const object = { sujet: { ...form, id_sujet }, tags: techs };
    dispatch({ type: "OPEN_BACKDROP" });
    addProject(object)
      .then((res) => {
        const file = [
          files[0].path,
          current.id_utilisateur,
          id_sujet,
          "fiche externe",
        ];
        addFileToDatabase([file]);
        dispatch({ type: "CLOSE_BACKDROP" });
        dispatch({
          type: "OPEN_SNACK",
          payload: {
            open: true,
            message: "Projet ajouté avec succès.",
            type: "success",
          },
        });
        dispatch({ type: "REMOVE_PAGE", payload: "Ajouter" });
        history.replace("/sujets");
      })
      .catch((err) => console.error(err));
  };

  const toggleSecondStudent = () => {
    var temp = !secondStudent;
    setSecondStudent(!secondStudent);
    if (!temp) {
      setForm({ ...form, id_etudiant_2: null });
    }
  };

  const onAutocompleteChange = (e, option) => {
    var id_utilisateur = option?.id_utilisateur || null;
    setForm({ ...form, id_etudiant_2: id_utilisateur });
  };

  const validate = () => {
    var temp = {};
    temp.titre =
      form.titre.length > 0
        ? form.titre.length < 255
          ? ""
          : "Le titre ne doit pas depasser 255 charactères."
        : "Ce champs est obligatoire.";
    temp.description =
      form.description.length > 0
        ? form.description.length < 21844
          ? ""
          : "Ce n'est qu'une description, vous n'êtes pas censé écrire un livre ici!"
        : "Ce champs est obligatoire.";
    temp.travail =
      form.travail.length > 0
        ? form.travail.length < 21844
          ? ""
          : "Ce n'est qu'une description, vous n'êtes pas censé écrire un livre ici!"
        : "Ce champs est obligatoire.";

    temp.techs =
      techs.length > 0
        ? techs.length > 20
          ? "Ce champs ne peut pas contenir plus que 20 technologies."
          : techs.filter((el) => el.length > 100).length > 0
          ? "Chaque technologie ne doit pas comporter plus que 100 charactères."
          : ""
        : "Ce champs est obligatoir.";
    temp.lieu =
      !form.lieu || form.lieu.length === 0
        ? "Tant que le projet est externe, ce champs est obligatoir."
        : form.lieu.length > 100
        ? "Ce champs ne peut pas comporter plus que 100 charactères."
        : "";
    temp.enc_ext =
      !form.enc_ext || form.enc_ext.length === 0
        ? "Tant que le projet est externe, ce champs est obligatoir."
        : form.enc_ext.length > 36
        ? "Ce champs ne peut pas comporter plus que 36 charactères."
        : "";
    temp.id_etudiant_2 = secondStudent
      ? !form.id_etudiant_2 || form.id_etudiant_2.length === 0
        ? "Vous avez coucher l'option deuxieme étudiant, vous devez le specifier!"
        : ""
      : "";

    setErrors(temp);

    if (Object.values(temp).every((el) => el.length === 0)) {
      if (files.length === 0) {
        dispatch({
          type: "OPEN_SNACK",
          payload: {
            type: "error",
            message: "Ajouter une fiche externe!",
            open: true,
          },
        });
        return false;
      }
      return true;
    } else {
      dispatch({
        type: "OPEN_SNACK",
        payload: {
          type: "error",
          message: "Remplire tout les champs",
          open: true,
        },
      });
      return false;
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
          variant="outlined"
          color="primary"
          label="Technologies/outils"
          multiline
          error={errors.techs.length > 0}
          helperText={errors.techs}
          placeholder='Separer les elements par un virgule. ex: "NodeJS, ReactJS, mySQL"'
          onChange={(e) => {
            setTechs(e.target.value.replace(/\s/g, "").split(","));
          }}
          style={{ flex: "1 1 100%" }}
        />
        <Paper
          elevation={0}
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
            style={{ flex: "1 1 32%", minWidth: "16rem" }}
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
            style={{ flex: "1 1 32%", minWidth: "16rem" }}
          />
          <div style={{ display: "flex", flex: "1 1 32%", minWidth: "16rem" }}>
            <Checkbox color="primary" onChange={() => toggleSecondStudent()} />
            <Autocomplete
              onChange={onAutocompleteChange}
              id="id_etudiant_2"
              options={students}
              getOptionLabel={(option) => option.nom}
              disabled={secondStudent ? false : true}
              //getOptionDisabled={(option) => option.includes("m")}
              groupBy={(option) => option.nom.charAt(0)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Partenaire"
                  variant="outlined"
                  placeholder="Séléctionner un partenaire."
                  error={errors.id_etudiant_2.length > 0}
                  helperText={errors.id_etudiant_2}
                />
              )}
              style={{ flex: "1" }}
            />
          </div>
          <UploadFile size="large" fileProp="Fiche externe" />
        </Paper>
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
        <Button color="primary" variant="contained" onClick={() => sendData()}>
          Envoyer
        </Button>
      </Paper>
    </div>
  );
}
export default AddProject;

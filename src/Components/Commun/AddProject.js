import { React, useState } from "react";
import axios from "axios";
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
import { AttachFile } from "@material-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import { addProject } from "../../functions";

moment.locale("fr");

function AddProject(props) {
  const dispatch = useDispatch();

  const current = useSelector((state) => state.users.current);
  const users = useSelector((state) => state.users.all)
    .filter((object) => {
      return object.role === "enseignant";
    })
    .sort((a, b) => a.nom.localeCompare(b.nom));

  const [techs, setTechs] = useState();
  const [values, setValues] = useState({
    encSec: false,
    interne: current.role === "etudiant" ? false : true,
  });
  const [form, setForm] = useState({
    interne: current.role === "etudiant" ? false : true,
    date: new Date(),
  });

  const onTextChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const onAutocompleteChange = (e, option) => {
    var name = e.target.id;
    name = name.substring(0, name.indexOf("-"));
    var id_utilisateur = option === null ? null : option.id_utilisateur;
    setForm({ ...form, [name]: id_utilisateur });
  };

  const sendData = () => {
    dispatch({ type: "OPEN_BACKDROP" });
    const object = { sujet: form, tags: techs };
    addProject(object)
      .then((res) => {
        dispatch({ type: "CLOSE_BACKDROP" });
        dispatch({
          type: "OPEN_SNACK",
          payload: {
            open: true,
            message: "Projet ajouté avec succès.",
            type: "success",
          },
        });
      })
      .catch((err) => console.error(err));
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
        }}
      >
        <Typography variant="h4" paragraph style={{ flex: "1 1 100%" }}>
          Proposer un sujet
        </Typography>
        {!current.role === "etudiant" && (
          <ButtonGroup
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
          style={{ flex: "1 1 65%" }}
        />
        <TextField
          onChange={onTextChange}
          label="Description"
          id="description"
          placeholder="La description du sujet"
          variant="outlined"
          multiline
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
          style={{ flex: "1 1 45%", minWidth: "16rem" }}
          inputProps={{
            style: {
              minHeight: "4rem",
            },
          }}
        />
        <Autocomplete
          onChange={onAutocompleteChange}
          id="enc_prim"
          options={users}
          getOptionLabel={(option) => option.nom}
          //getOptionDisabled={(option) => option.includes("m")}
          groupBy={(option) => option.nom.charAt(0)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Encadreur primair"
              variant="outlined"
              placeholder="Séléctionner l'encadreur pour ce sujet."
            />
          )}
          style={{ flex: "1 1 45%", minWidth: "16rem" }}
        />
        <div style={{ display: "flex", flex: "1 1 45%", minWidth: "16rem" }}>
          <Checkbox
            color="primary"
            onChange={() => setValues({ encSec: !values.encSec })}
          />
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
                label="Encadreur secondair"
                variant="outlined"
                placeholder="Séléctionner l'encadreur pour ce sujet."
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
          placeholder='Separer les elements par un virgule. ex: "NodeJS, ReactJS, mySQL"'
          onChange={(e) => {
            setTechs(e.target.value.replace(/\s/g, " ").split(","));
          }}
          style={{ flex: "1 1 100%" }}
        />
        <Collapse in={!form.interne} style={{ flex: "1 1 100%" }}>
          <Paper
            elevation={0}
            style={{
              gap: "0.5rem",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <Button
              color="primary"
              variant="outlined"
              style={{
                flex: "1 1 32%",
                minWidth: "16rem",
                fontSize: "1.2rem",
                textTransform: "none",
              }}
              onClick={() => {}}
              startIcon={<AttachFile />}
            >
              Fiche externe
            </Button>
            <TextField
              onChange={(e) =>
                setForm({ ...form, [e.target.id]: e.target.value })
              }
              label="Lieu (Societé)"
              id="lieu"
              variant="outlined"
              style={{ flex: "1 1 32%", minWidth: "16rem" }}
            />
            <TextField
              onChange={(e, value) =>
                setForm({ ...form, [e.target.id]: e.target.value })
              }
              id="enc_ext"
              label="Encadreur externe"
              variant="outlined"
              placeholder="Séléctionner l'encadreur pour ce sujet."
              style={{ flex: "1 1 32%", minWidth: "16rem" }}
            />
          </Paper>
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
        <Button color="primary" variant="contained" onClick={() => sendData()}>
          Envoyer
        </Button>
        <Button color="warning" variant="outlined">
          Brouillon
        </Button>
      </Paper>
    </div>
  );
}
export default AddProject;

{
  /* <MuiPickersUtilsProvider
            libInstance={moment}
            utils={MomentUtils}
            local="fr"
          >
            <DatePicker
              id="date"
              label="Date du projet"
              allowKeyboardControl
              disablePast
              inputVariant="outlined"
              variant="inline"
              autoOk={true}
              value={form.date}
              onChange={(date) =>
                setForm({ ...form, date: date.toISOString() })
              }
              style={{ flex: "1 1 30%" }}
            />
    </MuiPickersUtilsProvider> */
}

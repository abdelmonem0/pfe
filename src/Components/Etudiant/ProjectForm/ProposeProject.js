import { React, useState } from "react";
import { Button, TextField, Typography, useTheme } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import moment from "moment";
import "moment/locale/fr";
import { useSelector } from "react-redux";
import UploadFile from "../../UploadFile";
import {
  initialProposalErrors,
  initialForm,
  addProjectToDatabase,
  validateProposal,
} from "./logic";
import { File_States, Project_States } from "../../../Constants";

moment.locale("fr");

function ProposeProject(props) {
  const theme = useTheme();
  const current = useSelector((state) => state.users.current);
  const users = useSelector((state) => state.users.all)
    .filter((object) => object.role === "enseignant")
    .sort((a, b) => a.nom.localeCompare(b.nom));
  const [values, setValues] = useState({ secondStudent: false });
  const [errors, setErrors] = useState(initialProposalErrors);
  const [form, setForm] = useState({
    ...initialForm,
    interne: true,
    id_etudiant: current.id_utilisateur,
  });

  const onTextChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const onAutocompleteChange = (e, option) => {
    var id_utilisateur = option?.id_utilisateur || null;
    setForm({ ...form, enc_prim: id_utilisateur });
    setErrors({ ...errors, enc_prim: "" });
  };

  const sendData = () => {
    const { isValidated, errors } = validateProposal(form);
    if (!isValidated) {
      setErrors(errors);
      return;
    }
    addProjectToDatabase(
      { ...form, etat: Project_States.proposed_by_student_for_teacher },
      null,
      [],
      Project_States.proposed_by_student_for_teacher,
      File_States.cahier_de_charge_en_instance
    );
    window.location.reload();
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
        elevation={0}
        style={{
          gap: "0.5rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        <Typography variant="h4" paragraph style={{ flex: "1 1 100%" }}>
          Proposer un sujet à un enseignant
        </Typography>

        <TextField
          onChange={onTextChange}
          label="Description"
          id="description"
          placeholder="La description du sujet"
          variant="outlined"
          multiline
          error={errors.description.length > 0}
          helperText={errors.description}
          style={{ flex: "1 1 100%", minWidth: "16rem" }}
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
              label="Enseignant"
              variant="outlined"
              placeholder="Enseignant auqel vous proposerez ce sujet"
              error={errors.enc_prim.length > 0}
              helperText={errors.enc_prim}
            />
          )}
          style={{ flex: "1 1 100%" }}
        />
        <TextField
          variant="outlined"
          color="primary"
          label="Technologies/outils (optionel)"
          multiline
          placeholder='Separer les elements par un virgule. ex: "NodeJS, ReactJS, mySQL"'
          onChange={(e) => {
            setForm({
              ...form,
              tags: e.target.value.replace(/\s/g, "").split(","),
            });
          }}
          style={{ flex: "1 1 100%" }}
        />
        <TextField
          onChange={onTextChange}
          label="Titre (optionel)"
          id="titre"
          placeholder="Le titre du sujet (optionel)"
          variant="outlined"
          style={{ flex: "1 1 100%" }}
        />

        <TextField
          onChange={onTextChange}
          label="Travail (optionel)"
          id="travail"
          placeholder="Le travail demandé (optionel)"
          variant="outlined"
          multiline
          style={{ flex: "1 1 100%", minWidth: "16rem" }}
        />
        <div className="horizontal-list wrap" style={{ flex: 1 }}>
          <UploadFile size="large" fileProp="Cahier de charge" /> (optionel)
        </div>
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
        <Button
          color="primary"
          variant="contained"
          onClick={() => sendData()}
          style={{ textTransform: "none" }}
        >
          Envoyer
        </Button>
      </div>
    </div>
  );
}
export default ProposeProject;

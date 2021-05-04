import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  DialogActions,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { Person } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { v4 as uuid } from "uuid";
import UploadFile from "../UploadFile";
import {
  addCandidature,
  addFileToDatabase,
  getCandidatures,
} from "../../functions";
import { Candidature_States } from "../../Constants";
import Slide from "@material-ui/core/Slide";
import { getCandidaturePartner } from "../Commun/Constraints";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AddCandidature(props) {
  const { project, dialog, openDialog } = props;

  const [values, setValues] = useState({ commentaires: "", partner: false });
  const users = useSelector((state) => state.users);
  const etudiants = getCandidaturePartner();
  const files = useSelector((state) => state.files);
  const dispatch = useDispatch();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const id_candidature = uuid();

  const onChange = (e) => {
    setValues({ ...values, commentaires: e.target.value });
  };

  const sendCandidature = () => {
    dispatch({ type: "OPEN_BACKDROP" });
    const candidature = {
      id_candidature: id_candidature,
      etudiant_1: users.current.id_utilisateur,
      enc_prim: project.enc_prim,
      enc_sec: project.enc_sec,
      id_sujet: project.id_sujet,
      commentaires: values.commentaires,
      etudiant_2: values.etudiant_2 || null,
      etat: values.etudiant_2
        ? Candidature_States.waiting_for_student
        : Candidature_States.waiting_for_response,
    };

    var fichiers = [];
    for (let file of files) {
      let fichier = [
        file.path,
        users.current.id_utilisateur,
        id_candidature,
        "candidature",
      ];
      fichiers.push(fichier);
    }

    addCandidature(candidature)
      .then((result) => {
        if (result.status === 200)
          dispatch({
            type: "OPEN_SNACK",
            payload: {
              type: "success",
              message: result.data,
            },
          });
        else throw new Error(result.data);
      })
      .then(() => {
        if (fichiers.length > 0)
          addFileToDatabase(fichiers).then(() => {
            dispatch({ type: "CLEAR_FILES" });
          });
      })
      .then(() => {
        openDialog(false);
        getCandidatures(users.current.id_utilisateur).then((result) => {
          dispatch({ type: "SET_CANDIDATURES", payload: result.data });
        });
      })
      .catch((err) =>
        dispatch({
          type: "OPEN_SNACK",
          payload: {
            type: "error",
            message: err,
          },
        })
      );
  };

  return (
    <Dialog
      open={dialog}
      fullWidth
      fullScreen={fullScreen}
      maxWidth={"sm"}
      TransitionComponent={Transition}
      onClose={() => openDialog(false)}
    >
      <DialogTitle>
        <Typography variant="h6">Candidater</Typography>
      </DialogTitle>
      <DialogContent
        style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
      >
        <Typography>{project.titre}</Typography>
        {project.encadrants.length > 0 && (
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Typography color="textSecondary">
              <Person />
            </Typography>

            {project.encadrants.map((e) => (
              <Typography
                key={e.id_utilisateur}
                variant="subtitle2"
                color="textSecondary"
              >
                {e.nom}
              </Typography>
            ))}
          </div>
        )}
        <Divider />
        <TextField
          label="Commentaires"
          placeholder="optionel"
          multiline
          variant="outlined"
          fullWidth
          onChange={onChange}
        />
        <UploadFile fileProp="CV" attache_a="55669988" type="candidature" />
        <div style={{ display: "flex" }}>
          {!values.partner && (
            <Button
              variant="outlined"
              color="primary"
              disableElevation
              startIcon={<Person />}
              onClick={() => setValues({ ...values, partner: true })}
            >
              Ajouter un partenaire
            </Button>
          )}
          {values.partner && (
            <div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                <Autocomplete
                  options={etudiants.sort((a, b) => a.nom.localeCompare(b.nom))}
                  getOptionLabel={(option) => option.nom}
                  groupBy={(option) => option.nom.charAt(0)}
                  onChange={(e, v) =>
                    v && setValues({ ...values, etudiant_2: v.id_utilisateur })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Partenaire (étudiant)"
                      style={{ flex: "1 1 25%", minWidth: "16rem" }}
                      size="small"
                    />
                  )}
                />
                <Button
                  onClick={() => setValues({ ...values, partner: false })}
                  variant="outlined"
                >
                  Annuler
                </Button>
              </div>
              <Typography
                variant="subtitle2"
                style={{
                  flex: "1 1 60%",
                  minWidth: "18rem",
                  color: "orange",
                }}
              >
                En ajoutant un partenaire, un e-mail sera envoyé à ce dernier et
                la candidature ne sera pas transmise à l'encadrant que lorsque
                l'autre étudiant se connecte à son compte et vérifie la
                candidature.
              </Typography>
            </div>
          )}
        </div>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="primary" onClick={sendCandidature}>
          Postuler
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => openDialog(false)}
        >
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddCandidature;

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Candidature_States } from "../../../Constants";
import { acceptCandidatureEtudiant, getCandidatures } from "../../../functions";
import SecondStudent from "./SecondStudent";

const Student = (props) => {
  const { candidature } = props;
  const current = useSelector((state) => state.users.current);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [alreadySent, setAlreadySent] = useState(false);

  function setOpenConfirm(accepted) {
    setDialog(true);
    setAccepted(accepted);
  }

  const acceptCand = (isAccepted) => {
    acceptCandidatureEtudiant(
      current.id_utilisateur,
      candidature.id_candidature,
      isAccepted
        ? Candidature_States.waiting_for_response
        : Candidature_States.refused_by_student
    ).then(() =>
      getCandidatures(current.id_utilisateur).then((result) => {
        dispatch({ type: "SET_CANDIDATURES", payload: result.data });
      })
    );
  };

  return (
    current.id_utilisateur === candidature.id_etudiant_2 &&
    candidature.etat === Candidature_States.waiting_for_student && (
      <>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <SecondStudent
            candidature={candidature}
            setAlreadySent={setAlreadySent}
            onClose={() => setOpen(false)}
          />
        </Dialog>

        <Dialog open={dialog} onClose={() => setDialog(false)}>
          <DialogTitle>Confirmer le choix</DialogTitle>
          <DialogContent>
            Confirmer {accepted ? " l'acceptation " : " le refus"}, ce choix est
            definitif.
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={() => acceptCand(accepted)}>
              Confirmer
            </Button>
            <Button color="secondary" onClick={() => setDialog(false)}>
              Annuler
            </Button>
          </DialogActions>
        </Dialog>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenConfirm(true)}
        >
          Confirmer
        </Button>
        {!alreadySent &&
          candidature.commentaire_2 &&
          candidature.fichiers.filter(
            (f) => f.id_utilisateur === current.id_utilisateur
          ).length === 0 && (
            <Button
              color="primary"
              onClick={() => setOpen(true)}
              style={{ textTransform: "none" }}
            >
              Ajouter commentaire ou fichiers
            </Button>
          )}
      </>
    )
  );
};

export default Student;

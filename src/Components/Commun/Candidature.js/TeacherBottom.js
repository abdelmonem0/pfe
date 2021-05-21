import {
  Button,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Candidature_States } from "../../../Constants";
import {
  acceptCandidatureEnseignant,
  getCandidatures,
} from "../../../functions";
import { teacherCandidatureDecision } from "../../Enseignant/Candidatures/logic";
import { getProject } from "./CandidatureLogic";

const Teacher = (props) => {
  const { candidature } = props;
  const users = useSelector((state) => state.users);
  const [dialog, setDialog] = useState(false);
  const [decision, setDecision] = useState(false);
  const project = getProject(candidature);
  const willBeShown =
    candidature.etat === Candidature_States.waiting_for_response ||
    (candidature.etat === Candidature_States.accepted_by_teacher_partner &&
      !(
        candidature.etat === Candidature_States.accepted_by_teacher_partner &&
        users.current.id_utilisateur === candidature.premier_accept
      ));
  const otherEnc = project.enc_sec
    ? users.current.id_utilisateur === project.enc_sec
      ? project.enc_prim
      : project.enc_sec
    : null;

  function acceptCand(isAccepted) {
    teacherCandidatureDecision(candidature, isAccepted);
  }

  return (
    willBeShown && (
      <>
        <ConfirmDialog
          open={dialog}
          accept={acceptCand}
          close={setDialog}
          decision={decision}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setDecision(true);
            setDialog(true);
          }}
        >
          Accepter
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setDecision(false);
            setDialog(true);
          }}
        >
          Refuser
        </Button>
      </>
    )
  );
};

export default Teacher;

const ConfirmDialog = (props) => {
  const { accept, open, close, decision } = props;
  return (
    <Dialog open={open} onClose={() => close(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        Confirmer {decision ? "l'acceptation" : "le refus"}
      </DialogTitle>
      <DialogContent>
        Voulez-vous confirmer {decision ? "l'acceptation" : "le refus"} de la
        candidature?
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={() => accept(decision)}>
          Confirmer
        </Button>
        <Button color="secondary" onClick={() => close(false)}>
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
};

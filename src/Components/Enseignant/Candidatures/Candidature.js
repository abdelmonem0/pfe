import { React, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import AttachedFiles from "../../Commun/AttachedFiles";
import { Candidature_States } from "../../../Constants";

const Candidature = (props) => {
  const { users, project } = props;
  const candidature = useSelector((state) => state.candidatures).filter(
    (el) => {
      return el.id_candidature === props.candidature.id_candidature;
    }
  )[0];
  const otherEnc = project.enc_sec
    ? users.current.id_utilisateur === project.enc_sec
      ? project.enc_prim
      : project.enc_sec
    : null;

  const dispatch = useDispatch();
  const [dialog, setDialog] = useState(false);
  const [decision, setDecision] = useState(false);
  const openDialog = (_decision) => {
    setDecision(_decision);
    setDialog(true);
  };

  return (
    <>
      <ConfirmDialog
        open={dialog}
        accept={acceptCand}
        close={setDialog}
        decision={decision}
      />
      <Card variant="outlined" style={{ flex: "1" }}>
        <CardHeader
          title={
            <Header
              candidature={candidature}
              users={users}
              otherEnc={otherEnc}
            />
          }
          subheader={
            <SubHeader
              candidature={candidature}
              users={users}
              otherEnc={otherEnc}
            />
          }
        />
        <CardContent>
          <Typography gutterBottom>{project.titre}</Typography>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <StudentStuff candidature={candidature} />
          </div>
        </CardContent>
        <Bottom
          candidature={candidature}
          openDialog={openDialog}
          users={users}
        />
      </Card>
    </>
  );
};

const Header = (props) => {
  const { candidature, users, otherEnc } = props;
  const prefixe =
    candidature.etat === Candidature_States.accepted_by_teacher_partner
      ? users.current.id_utilisateur === candidature.premier_accept
        ? " vous, en attente de la reponse de <strong>" + otherEnc + "."
        : " " + otherEnc + ", en attente de votre reponse."
      : "";
  const etat = candidature.etat + prefixe;

  return <Typography variant="h6">{etat}</Typography>;
};

const SubHeader = (props) => {
  const { candidature, users, otherEnc } = props;
  const candidats = users.all.filter((el) => {
    return (
      el.id_utilisateur === candidature.id_etudiant ||
      el.id_utilisateur === candidature.id_etudiant_2
    );
  });

  return (
    <>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Typography>
          {candidats.length === 1 ? "Candidat" : "Candidats"}
        </Typography>
        {candidats.map((el) => (
          <Typography style={{ fontWeight: "bold" }}>{el.nom}</Typography>
        ))}
      </div>
      {otherEnc && <Typography>En collaboration avec {otherEnc}</Typography>}
    </>
  );
};

const Bottom = (props) => {
  const { openDialog, candidature, users } = props;
  const willBeShown =
    candidature.etat === Candidature_States.waiting_for_response ||
    (candidature.etat === Candidature_States.accepted_by_teacher_partner &&
      !(
        candidature.etat === Candidature_States.accepted_by_teacher_partner &&
        users.current.id_utilisateur === candidature.premier_accept
      ));

  return (
    willBeShown && (
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => openDialog(true)}
        >
          Accepter
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => openDialog(false)}
        >
          Refuser
        </Button>
      </CardActions>
    )
  );
};

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

export default Candidature;

const StudentStuff = ({ candidature }) => {
  const s1_files = candidature.fichiers.filter(
    (f) => f.id_utilisateur === candidature.id_etudiant
  );
  const s2_files = candidature.fichiers.filter(
    (f) => f.id_utilisateur === candidature.id_etudiant_2
  );

  const users = useSelector((state) => state.users.all).filter((el) => {
    return (
      el.id_utilisateur === candidature.id_etudiant ||
      el.id_utilisateur === candidature.id_etudiant_2
    );
  });

  return (
    <>
      {!candidature.commentaires && s1_files.length === 0 ? null : (
        <Paper
          variant="outlined"
          style={{ flex: "1 1 49%", padding: "0.5rem", minWidth: "16rem" }}
        >
          {users.length > 1 && (
            <Typography gutterBottom variant="subtitle2">
              {users[0].nom}
            </Typography>
          )}
          <Typography variant="subtitle2" color="textSecondary">
            {candidature.commentaires
              ? "Commentaire: " + candidature.commentaires
              : "Pas de commentaire."}
          </Typography>
          <AttachedFiles fichiers={s1_files} />
        </Paper>
      )}
      {!candidature.commentaire_2 && s2_files.length === 0 ? null : (
        <Paper
          variant="outlined"
          style={{ flex: "1 1 49%", padding: "0.5rem", minWidth: "16rem" }}
        >
          <Typography gutterBottom variant="subtitle2">
            {users[1].nom}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {candidature.commentaire_2
              ? "Commentaire: " + candidature.commentaire_2
              : "Pas de commentaire."}
          </Typography>
          <AttachedFiles fichiers={s2_files} />
        </Paper>
      )}
    </>
  );
};

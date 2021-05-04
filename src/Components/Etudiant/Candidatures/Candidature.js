import { React, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  useTheme,
} from "@material-ui/core";
import { Person, Schedule } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";

import { acceptCandidatureEtudiant, getCandidatures } from "../../../functions";
import AttachedFiles from "../../Commun/AttachedFiles";
import SecondStudent from "./SecondStudent";
import { Candidature_States } from "../../../Constants";
import ProjectDetail from "../../Commun/ProjectDetail";

const Candidature = (props) => {
  const theme = useTheme();
  const candidature = props.candidature;
  const users = useSelector((state) => state.users);
  const project = useSelector((state) => state.projects).filter(
    (p) => p.id_sujet === candidature.id_sujet
  )[0];

  const [send2ndStudentFiles, setSend2ndStudentFiles] = useState(false);

  const dispatch = useDispatch();

  const files = candidature.fichiers;

  const bg = bgColor(candidature.etat, theme);
  const encadrants = users.all.filter((user) => {
    return (
      user.id_utilisateur === project.enc_prim ||
      user.id_utilisateur === project.enc_sec
    );
  });

  function acceptCand(isAccepted) {
    setSend2ndStudentFiles(true);
    acceptCandidatureEtudiant(
      users.current.id_utilisateur,
      candidature.id_candidature,
      isAccepted
        ? Candidature_States.waiting_for_response
        : Candidature_States.refused_by_student
    ).then(() =>
      getCandidatures(users.current.id_utilisateur).then((result) => {
        dispatch({ type: "SET_CANDIDATURES", payload: result.data });
        setSend2ndStudentFiles(true);
      })
    );
  }

  useEffect(() => {
    console.log(encadrants);
  }, []);
  return (
    <Card variant="outlined">
      <CardHeader
        style={{ backgroundColor: bg }}
        title={
          <Typography
            style={{
              flex: "1 1 25%",
              color: bg,
              fontWeight: "bold",
              color: "white",
            }}
          >
            {candidature.etat}
          </Typography>
        }
        subheader={<Header users={users} candidature={candidature} />}
      />
      <CardContent>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Typography variant="body2" color="textSecondary">
            <Person /> {encadrants[0].nom}{" "}
            {encadrants.length > 1 && " - " + encadrants[1].nom}
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            <Schedule />
            {" " + new Date(candidature.date).toLocaleDateString()}
          </Typography>
        </div>

        {/* Titre - Consulter sujet */}
        <ProjectDetail project={project}>{project.titre}</ProjectDetail>
        <Typography
          variant="body2"
          color="textSecondary"
          style={{ fontStyle: "italic" }}
          paragraph
        >
          Commentaires: {'"' + candidature.commentaires + '"'}
        </Typography>
        {candidature.commentaire_2 && (
          <Typography
            variant="body2"
            color="textSecondary"
            style={{ fontStyle: "italic" }}
            paragraph
          >
            Commentaires: {'"' + candidature.commentaire_2 + '"'}
          </Typography>
        )}
        <AttachedFiles fichiers={candidature.fichiers} />
        {candidature.id_etudiant_2 === users.current.id_utilisateur &&
          candidature.etat === Candidature_States.waiting_for_student && (
            <SecondStudent
              candidature={candidature}
              send2ndStudentFiles={send2ndStudentFiles}
            />
          )}
      </CardContent>

      <CardActions>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {users.current.id_utilisateur === candidature.id_etudiant_2 &&
            candidature.etat === Candidature_States.waiting_for_student && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => acceptCand(true)}
                >
                  Confirmer
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => acceptCand(false)}
                >
                  Supprimer
                </Button>
              </>
            )}
        </div>
      </CardActions>
    </Card>
  );
};

function bgColor(state, theme) {
  if (state === Candidature_States.waiting_for_student)
    return theme.palette.warning.main;
  if (state === Candidature_States.accepted) return theme.palette.success.main;
  if (state === Candidature_States.refused) return theme.palette.error.dark;
  return "#54B5D2";
}

export default Candidature;

const Header = (props) => {
  function getUser(id) {
    var user = null;
    var BreakException = {};
    try {
      props.users.all.forEach((element) => {
        if (element.id_utilisateur === id) {
          user = element;
          throw BreakException;
        }
      });
    } catch (e) {
      if (e !== BreakException) throw e;
    }
    return user;
  }

  if (props.candidature.id_etudiant_2 != null)
    return (
      <div style={{ display: "flex", gap: "1rem" }}>
        <Typography variant="subtitle2" color="textPrimary">
          En collaboration avec:
        </Typography>
        <Typography
          variant="subtitle2"
          color="textPrimary"
          style={{ fontWeight: "bold" }}
        >
          {props.users.current.id_utilisateur ===
          props.candidature.id_etudiant_2
            ? getUser(props.candidature.id_etudiant).nom
            : getUser(props.candidature.id_etudiant_2).nom}
        </Typography>
      </div>
    );
  else return null;
};

import { React, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  Tooltip,
  CardActionArea,
} from "@material-ui/core";
import { Person, Schedule } from "@material-ui/icons";
import { useDispatch } from "react-redux";

import { acceptCandidatureEtudiant, getCandidatures } from "../../../functions";
import AttachedFiles from "../../Commun/AttachedFiles";
import SecondStudent from "./SecondStudent";
import { Candidature_States } from "../../../Constants";

const Candidature = (props) => {
  const candidature = props.candidature;
  const users = props.users;

  const dispatch = useDispatch();

  const files = candidature.fichiers;

  const bg = bgColor(candidature.etat);
  const encadrants = users.all.filter((user) => {
    return (
      user.id_utilisateur === props.project[0].enc_prim ||
      user.id_utilisateur === props.project[0].enc_sec
    );
  });

  function acceptCand(isAccepted) {
    acceptCandidatureEtudiant(
      users.current.id_utilisateur,
      candidature.id_candidature,
      isAccepted
        ? Candidature_States.waiting_for_response
        : Candidature_States.refused_by_student
    ).then(() =>
      getCandidatures(users.current.id_utilisateur).then((result) =>
        dispatch({ type: "SET_CANDIDATURES", payload: result.data })
      )
    );
  }

  useEffect(() => {
    console.log(encadrants);
  }, []);
  return (
    <Card elevation={10}>
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
            {" " + candidature.date}
          </Typography>
        </div>

        {/* Titre - Consulter sujet */}
        <CardActionArea
          onClick={() => {
            props.setSelectedProject(props.project[0]);
            props.openProject(true);
          }}
        >
          <Tooltip title="Consulter le sujet">
            <Typography
              className="candidature-project-title"
              paragraph
              variant="h6"
            >
              {props.project[0].titre}
            </Typography>
          </Tooltip>
        </CardActionArea>
        <Typography
          variant="body2"
          color="textSecondary"
          style={{ fontStyle: "italic" }}
          paragraph
        >
          Commentaires: {'"' + candidature.commentaires + '"'}
        </Typography>
        {candidature.fichiers && candidature.fichiers.length > 0 && (
          <AttachedFiles fichiers={candidature.fichiers} />
        )}
        {candidature.id_etudiant_2 === users.current.id_utilisateur &&
          candidature.etat === Candidature_States.waiting_for_student && (
            <SecondStudent candidature={candidature} />
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

function bgColor(state) {
  if (state === Candidature_States.waiting_for_student) return "#FFAD00";
  if (state === Candidature_States.accepted) return "#33CA00";
  if (state === Candidature_States.refused) return "#EE4C52";
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

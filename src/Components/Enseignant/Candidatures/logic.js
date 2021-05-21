import { store } from "../../..";
import { Candidature_States, Notifications_Types } from "../../../Constants";
import {
  acceptCandidatureEnseignant,
  getCandidatures,
  sendEmail,
  sendNotifications,
} from "../../../functions";
import { getUserByID } from "../../Commun/Candidature.js/CandidatureLogic";

export function teacherCandidatureDecision(candidature, isAccepted) {
  const state = store.getState();
  const current = state.users.current;
  const project = getProjectByID(candidature.id_sujet);
  const partner = getProjectPartner(project);

  const etat = isAccepted
    ? partner
      ? candidature.etat === Candidature_States.waiting_for_response
        ? Candidature_States.accepted_by_teacher_partner
        : Candidature_States.accepted
      : Candidature_States.accepted
    : Candidature_States.inactive;

  acceptCandidatureEnseignant(
    current.id_utilisateur,
    candidature.id_candidature,
    etat
  )
    .then((result) => {
      if (result.status === 200) {
        store.dispatch({
          type: "OPEN_SNACK",
          payload: {
            open: true,
            message: result.data,
            type: "success",
          },
        });
      } else throw new Error(result.data);
    })
    .then(() =>
      getCandidatures(current.id_utilisateur).then((result) => {
        store.dispatch({ type: "SET_CANDIDATURES", payload: result.data });
      })
    )
    .then(() => {
      sendCandidatureEmail(etat, [
        candidature.id_etudiant,
        candidature.id_etudiant_2,
      ]);
      sendCandidatureNotification(etat, candidature, [
        candidature.id_etudiant,
        candidature.id_etudiant_2,
        partner.id_utilisateur,
      ]);
    })
    .catch((err) =>
      store.dispatch({
        type: "OPEN_SNACK",
        payload: {
          open: true,
          message: err.toString(),
          type: "error",
        },
      })
    );
}

function sendCandidatureEmail(etatCandidature, studentsIDs) {
  var emails = [];
  if (etatCandidature === Candidature_States.accepted) {
    for (let studentID of studentsIDs)
      if (studentID) {
        const student = getUserByID(studentID);
        const subject = "Réponse pour une candidature";
        const text = `Bonjour ${student.nom}.\n
            Vous avez eu une acceptation pour votre candidature. Veuillez consulter la platforme pour la vérifier.\n
            Cordialement."`;
        const to = "mon3omlevrai@gmail.com";

        emails.push({ subject, text, to });
      }
  }
  if (emails.length > 0) sendEmail(emails).catch((err) => console.error(err));
}

function sendCandidatureNotification(
  etatCandidature,
  candidature,
  destinations
) {
  const state = store.getState();
  const current = state.users.current;
  const notifications = [];
  const type = getNotificationType(etatCandidature);

  for (let id_destination of destinations)
    if (id_destination) {
      const id_source = current.id_utilisateur;

      const id_object = candidature.id_sujet;
      notifications.push({ id_destination, id_source, id_object, type });
    }

  sendNotifications(notifications).catch((err) => console.error(err));
}

function getNotificationType(etatCandidature) {
  var notificationType = "";
  switch (etatCandidature) {
    case Candidature_States.accepted:
      notificationType = Notifications_Types.candidature_accepted_by_teachers;
      break;
    case Candidature_States.accepted_by_teacher_partner:
      notificationType =
        Notifications_Types.candidature_accepted_by_first_teacher;
      break;
    default:
      notificationType = Notifications_Types.candidature_inactive;
      break;
  }
  return notificationType;
}

export function getProjectPartner(project, isTeacher = true) {
  const state = store.getState();
  const users = state.users;
  if (isTeacher) {
    if (users.current.id_utilisateur === project.enc_prim) {
      if (project.enc_sec)
        return users.all.find((u) => u.id_utilisateur === project.enc_sec);
    } else return users.all.find((u) => u.id_utilisateur === project.enc_prim);
  }

  return false;
}

export function getProjectByID(id) {
  const state = store.getState();
  return state.projects.dataArray.find((p) => p.id_sujet === id);
}

export function getCandidatureByID(id) {
  const state = store.getState();
  return state.candidatures.find((c) => c.id_sujet === id);
}

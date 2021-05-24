import { Notifications_Types, Project_States } from "./Constants";
import { sendNotifications } from "./functions";

export function sendCommentNotifications(current, project) {
  const creatorCommented =
    current.id_utilisateur === project.enc_prim ||
    current.id_utilisateur === project.enc_sec;

  var notDestination = [];
  if (creatorCommented)
    for (let comment of project.commentaires) {
      var id_utilisateur = comment.id_utilisateur;
      if (
        notDestination.indexOf(id_utilisateur) === -1 &&
        id_utilisateur != project.enc_prim &&
        id_utilisateur != project.enc_sec
      )
        notDestination.push(id_utilisateur);
    }
  else {
    notDestination = [project.enc_prim, project.enc_sec];
  }

  var notifications = [];
  for (let not of notDestination) {
    var n = {
      id_source: current.id_utilisateur,
      id_destination: not,
      type: Notifications_Types.comment,
    };
    notifications.push(n);
  }

  return sendNotifications(notifications);
}

export function sendSoutenanceDatesNotifications(users, updated) {
  const destinations = users.all.filter((el) => el.role === "enseignant");
  var notifications = [];
  for (let not of destinations) {
    var n = {
      id_source: users.current.id_utilisateur,
      id_destination: not.id_utilisateur,
      type: updated
        ? Notifications_Types.president_update_dates
        : Notifications_Types.president_set_dates,
    };
    notifications.push(n);
  }

  return sendNotifications(notifications);
}

export function sendReminderForTeachersNotifications(
  current,
  destinations,
  isForTags
) {
  var notifications = [];
  for (let not of destinations) {
    var n = {
      id_source: current.id_utilisateur,
      id_destination: not,
      type: isForTags
        ? Notifications_Types.president_notify_teachers_for_tags
        : Notifications_Types.president_notify_teachers_for_dates,
    };
    notifications.push(n);
  }

  return sendNotifications(notifications);
}

export function send_project_action_notification(project, accepted) {
  var destinations = [];
  destinations.push(project.enc_prim);
  destinations.push(project.enc_sec);
  destinations.push(project.id_etudiant);
  destinations.push(project.id_etudiant_2);
  destinations = destinations.filter((d) => d != null);

  var notifications = [];
  for (let not of destinations) {
    var n = {
      id_source: null,
      id_destination: not,
      id_objet: project.id_sujet,
      type: accepted
        ? Notifications_Types.project_accepted
        : Notifications_Types.project_refused,
    };
    notifications.push(n);
  }
  console.log(notifications);
  return sendNotifications(notifications);
}

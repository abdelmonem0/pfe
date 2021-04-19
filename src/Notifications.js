import { Notifications_Types } from "./Constants";
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

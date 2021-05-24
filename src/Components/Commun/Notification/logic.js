import { Notifications_Types } from "../../../Constants";
import {
  getProjectByID,
  getCandidatureByID,
  getProjectPartner,
} from "../../Enseignant/Candidatures/logic";
import { getUserByID } from "../Candidature.js/CandidatureLogic";

export function getNotificationText(notification) {
  var suffixe = "",
    prefixe = "";

  switch (notification.type) {
    case Notifications_Types.comment:
      prefixe = getUserByID(notification.id_source).nom;
      suffixe = " a ajouté un commentaire dans un sujet que vous suivez.";

      break;
    case Notifications_Types.president_set_dates:
      prefixe = "Le president de la commission ";
      suffixe = "a mis les dates des soutenances.";
      break;
    case Notifications_Types.president_update_dates:
      prefixe = "Le president de la commission ";
      suffixe = "a modifié les dates des soutenances.";
      break;
    case Notifications_Types.president_notify_teachers_for_tags:
      prefixe = "Le president de la commission ";
      suffixe = "vous invite pour spécifier vos spécialités.";
      break;
    case Notifications_Types.president_notify_teachers_for_dates:
      prefixe = "Le president de la commission ";
      suffixe = "vous invite pour spécifier les dates de disponibilité.";
      break;
    case Notifications_Types.candidature_accepted_by_teachers:
      suffixe = "Un sujet est affecté à vous.";
      break;
    case Notifications_Types.candidature_inactive:
      prefixe = `Votre candidature pour le sujet "${
        getProjectByID(notification.id_object)
          ? getProjectByID(notification.id_object).titre.slice(0, 15) + "..."
          : "@sujet non disponible@"
      }" est désormais non active.`;
      break;
    case Notifications_Types.candidature_accepted_by_first_teacher:
      try {
        const candidature = getCandidatureByID(notification.id_object);
        const project = getProjectByID(candidature.id_sujet);
        const partner = getProjectPartner(project);
        prefixe = `Votre partenaire ${partner.nom} a accepté une candidature, veuillez consulter la rubrique Candidatures pour la vérifier.`;
      } catch (e) {
        prefixe = "candidature supprimée";
      }
      break;
    case Notifications_Types.cahier_de_charge_accepte:
      suffixe = Notifications_Types.cahier_de_charge_accepte;
      break;
    case Notifications_Types.cahier_de_charge_refuse:
      suffixe =
        Notifications_Types.cahier_de_charge_refuse +
        ", veuillez ajouter un autre cahier.";
      break;
    case Notifications_Types.project_accepted:
      prefixe =
        "Félicitation, le sujet que vous avez proposé est accepté par la commission.";
      suffixe = ` Sujet: ${
        getProjectByID(notification.id_object)
          ? getProjectByID(notification.id_object).titre.slice(0, 15) + "..."
          : "@sujet non disponible@"
      }`;
      break;
    case Notifications_Types.project_refused:
      prefixe = "Le sujet que vous avez proposé est réfusé par la commission.";
      suffixe = ` Sujet: ${
        getProjectByID(notification.id_object)
          ? getProjectByID(notification.id_object).titre.slice(0, 15) + "..."
          : "@sujet non disponible@"
      }`;
      break;
    default:
      prefixe = "not handlet yet, check it";
      break;
  }

  return prefixe + suffixe;
}

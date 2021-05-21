import { store } from "../..";
import { File_States } from "../../Constants";
import { sendNotifications, updateFile } from "../../functions";

export function updateFileAndSendNotifications(file, decision) {
  const type = decision
    ? File_States.cahier_de_charge_accepte
    : File_States.cahier_de_charge_refuse;

  store.dispatch({ type: "OPEN_BACKDROP" });
  updateFile(file.id_fichier, type)
    .then(() =>
      store.dispatch({
        type: "UPDATE_CAHIER",
        payload: { ...file, type: type },
      })
    )
    .then(() => {
      store.dispatch({
        type: "OPEN_SNACK",
        payload: {
          message: `Le cahier de charge est desormais ${
            decision ? "accepté" : "réfusé"
          }.`,
          type: "success",
        },
      });
    })
    .then(() => {
      const nots = getFileActionNotifications({ ...file, type: type });
      sendNotifications(nots);
    });
}

function getFileActionNotifications(file) {
  const state = store.getState();
  const project = state.projects.dataArray.find(
    (p) => p.id_sujet === file.attache_a
  );
  var notifications = [];
  for (let student of project.affecte_a)
    notifications.push({
      id_destination: student.id_utilisateur,
      id_source: null,
      type: file.type,
      id_object: file.attache_a,
    });

  return notifications;
}

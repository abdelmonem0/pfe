import { store } from "../../..";
import { File_States } from "../../../Constants";
import { addFileToDatabase } from "../../../functions";

export function saveCahierDeCharge(project) {
  const state = store.getState();
  const file = state.files[0];
  const fichier = [
    file.path,
    state.users.current.id_utilisateur,
    project.id_sujet,
    File_States.cahier_de_charge,
  ];
  addFileToDatabase([fichier]).then(() => {
    store.dispatch({
      type: "SET_CAHIER",
      payload: {
        id_fichier: file.path,
        id_utilisateur: state.users.current.id_utilisateur,
        attache_a: project.id_sujet,
        type: File_States.cahier_de_charge,
      },
    });
    store.dispatch({
      type: "OPEN_SNACK",
      payload: { message: "Cahier de charge ajouté", type: "success" },
    });
  });
}

export function willRenderUploadCahier(project) {
  for (let file of project.fichiers)
    if (file.type === File_States.cahier_de_charge) return false;
  return true;
}

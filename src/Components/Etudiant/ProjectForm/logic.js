import { store } from "../../..";
import { addProject, addFileToDatabase } from "../../../functions";
import { v4 as uuid } from "uuid";
import { Project_States } from "../../../Constants";

export function validate(form, values) {
  const state = store.getState();
  const files = state.files;
  var errors = {};
  errors.titre =
    form.titre.length > 0
      ? form.titre.length < 255
        ? ""
        : "Le titre ne doit pas depasser 255 charactères."
      : "Ce champs est obligatoire.";
  errors.description =
    form.description.length > 0
      ? form.description.length < 21844
        ? ""
        : "Ce n'est qu'une description, vous n'êtes pas censé écrire un livre ici!"
      : "Ce champs est obligatoire.";
  errors.travail =
    form.travail.length > 0
      ? form.travail.length < 21844
        ? ""
        : "Ce n'est qu'une description, vous n'êtes pas censé écrire un livre ici!"
      : "Ce champs est obligatoire.";
  errors.id_etudiant_2 = values.secondStudent
    ? !form.id_etudiant_2 || form.id_etudiant_2.length === 0
      ? "Vous avez coucher l'option deuxieme etudiant, vous devez le specifier!"
      : ""
    : "";
  errors.tags =
    form.tags.length > 0
      ? form.tags.length > 20
        ? "Ce champs ne peut pas contenir plus que 20 technologies."
        : form.tags.filter((el) => el.length > 100).length > 0
        ? "Chaque technologie ne doit pas comporter plus que 100 charactères."
        : ""
      : "Ce champs est obligatoir.";
  errors.lieu =
    form.lieu.length === 0
      ? "Ce champs est obligatoir."
      : form.lieu.length > 100
      ? "Ce champs ne peut pas comporter plus que 100 charactères."
      : "";

  errors.enc_ext =
    form.enc_ext.length === 0
      ? "Ce champs est obligatoir."
      : form.enc_ext.length > 36
      ? "Ce champs ne peut pas comporter plus que 36 charactères."
      : "";

  var isValidated = false;
  if (Object.values(errors).every((el) => el.length === 0)) {
    if (files.length === 0) {
      store.dispatch({
        type: "OPEN_SNACK",
        payload: {
          type: "error",
          message: "Ajouter une fiche externe!",
          open: true,
        },
      });
    } else isValidated = true;
  } else {
    store.dispatch({
      type: "OPEN_SNACK",
      payload: {
        type: "error",
        message: "Remplire tout les champs",
        open: true,
      },
    });
  }

  return { isValidated, errors };
}

export const addProjectToDatabase = (form, projectId = null, newFiles = []) => {
  const state = store.getState();
  const current = state.users.current;
  const id_sujet = projectId || uuid();
  const files = [];
  const fileSource = newFiles.length > 0 ? newFiles : state.files;
  for (let f of fileSource)
    files.push([
      f.path || f.id_fichier,
      current.id_utilisateur,
      id_sujet,
      "fiche externe",
    ]);

  const object = { sujet: { ...form, id_sujet } };
  store.dispatch({ type: "OPEN_BACKDROP" });
  addProject(object, projectId)
    .then((res) => {
      if (files.length > 0) {
        addFileToDatabase(files);
      }
      store.dispatch({ type: "CLOSE_BACKDROP" });
      store.dispatch({
        type: "OPEN_SNACK",
        payload: {
          open: true,
          message: !projectId
            ? "Projet ajouté avec succès."
            : "Projet mis à jour avec succès.",
          type: "success",
        },
      });
    })
    .catch((err) => console.error(err));
};

export const initialForm = () => {
  const state = store.getState();
  const current = state.users.current;

  return {
    titre: "",
    description: "",
    travail: "",
    interne: current.role === "etudiant" ? false : true,
    id_etudiant: current.id_utilisateur,
    tags: "",
    lieu: "",
    enc_ext: "",
    date: new Date(),
  };
};

export const initialErrors = {
  titre: "",
  description: "",
  travail: "",
  tags: "",
  enc_sec: "",
  lieu: "",
  enc_ext: "",
  id_etudiant_2: "",
};

export function updateProject(form, projectId, files) {
  addProjectToDatabase(form, projectId, files);
}

export function getStudentsForPartnership() {
  const state = store.getState();
  const users = state.users;
  const projects = state.projects.dataArray;
  return users.all.filter(
    (u) =>
      u.role === "etudiant" &&
      u.sujet_affecte == null &&
      u.id_utilisateur !== users.current.id_utilisateur &&
      projects.filter(
        (p) =>
          (p.etat === Project_States.accepted ||
            p.etat === Project_States.waiting_for_second_student ||
            p.etat === Project_States.waiting) &&
          (p.id_etudiant === u.id_utilisateur ||
            p.id_etudiant_2 === u.id_utilisateur)
      ).length < 1
  );
}

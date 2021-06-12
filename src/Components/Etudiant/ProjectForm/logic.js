import { store } from "../../..";
import {
  addProject,
  addFileToDatabase,
  getProjects,
  updateProject,
} from "../../../functions";
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

export function validateProposal(form) {
  const state = store.getState();
  const files = state.files;
  var errors = {};

  errors.description =
    form.description.length > 0
      ? form.description.length < 21844
        ? ""
        : "Ce n'est qu'une description, vous n'êtes pas censé écrire un livre ici!"
      : "Ce champs est obligatoire.";

  errors.enc_prim = !form.enc_prim ? "Ce champs est obligatoire." : "";

  const isValidated = errors.description === "" && errors.enc_prim === "";

  return { isValidated, errors };
}

export const addProjectToDatabase = (
  form,
  etat = Project_States.waiting,
  file_type = "fiche externe"
) => {
  const state = store.getState();
  const current = state.users.current;
  const id_sujet = uuid();

  var files = [];
  for (let f of state.files)
    files.push([f.path, current.id_utilisateur, id_sujet, file_type]);
  var object = { sujet: { ...form, id_sujet, etat } };

  store.dispatch({ type: "OPEN_BACKDROP" });

  return addProject(object)
    .then(() => {
      if (files.length > 0) {
        addFileToDatabase(files);
      }

      store.dispatch({ type: "CLOSE_BACKDROP" });
      store.dispatch({
        type: "OPEN_SNACK",
        payload: {
          open: true,
          message: "Projet ajouté avec succès.",
          type: "success",
        },
      });
    })
    .then(() =>
      getProjects().then((result) => {
        store.dispatch({ type: "SET_PROJECTS", payload: result.data });
      })
    )
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
    id_etudiant_2: "",
    tags: "",
    lieu: "",
    enc_ext: "",
    date_creation: new Date(),
    etat: Project_States.waiting,
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

export const initialProposalErrors = {
  description: "",
  enc_prim: "",
};

export const updateProjectToDatabase = (
  form,
  id,
  etat = "En instance",
  file_type = "fiche externe",
  _files
) => {
  const state = store.getState();
  const current = state.users.current;
  const id_sujet = id;

  var files = [];
  if (_files.length > 0) {
    for (let file of _files) {
      var _file = [];
      for (let key of Object.keys(file)) _file.push(file[key]);
      files.push(_file);
    }
  } else {
    for (let f of state.files)
      files.push([f.path, current.id_utilisateur, id_sujet, file_type]);
  }
  console.log(files);
  var object = { sujet: { ...form, id_sujet, etat } };

  console.log(object);
  console.log(files);
  store.dispatch({ type: "OPEN_BACKDROP" });

  return updateProject(object)
    .then(() => {
      if (files.length > 0) {
        addFileToDatabase(files);
      }

      store.dispatch({ type: "CLOSE_BACKDROP" });
      store.dispatch({
        type: "OPEN_SNACK",
        payload: {
          open: true,
          message: "Projet mis à jour avec succès.",
          type: "success",
        },
      });
    })
    .then(() =>
      getProjects().then((result) => {
        store.dispatch({ type: "SET_PROJECTS", payload: result.data });
      })
    )
    .catch((err) => console.error(err));
};

export function getStudentsForPartnership() {
  const state = store.getState();
  const users = state.users;
  const projects = state.projects.dataArray;
  return users.all
    .filter(
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
    )
    .sort((a, b) => a.nom.localeCompare(b.nom));
}

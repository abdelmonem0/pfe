import { store } from "../../..";
import {
  addProject,
  addFileToDatabase,
  updateProject,
  getProjects,
  deleteProject,
} from "../../../functions";
import { v4 as uuid } from "uuid";
import { getProjectByID } from "../Candidatures/logic";

export function validate(form, values) {
  const state = store.getState();
  const files = values.files || state.files;
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
  errors.enc_sec = values.encSec
    ? !form.enc_sec || form.enc_sec.length === 0
      ? "Vous avez coucher l'option deuxieme encadrant, vous devez le specifier!"
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
  errors.lieu = !form.interne
    ? !form.lieu || form.lieu.length === 0
      ? "Tant que le projet est externe, ce champs est obligatoir."
      : form.lieu.length > 100
      ? "Ce champs ne peut pas comporter plus que 100 charactères."
      : ""
    : "";
  errors.enc_ext = !form.interne
    ? !form.enc_ext || form.enc_ext.length === 0
      ? "Tant que le projet est externe, ce champs est obligatoir."
      : form.enc_ext.length > 36
      ? "Ce champs ne peut pas comporter plus que 36 charactères."
      : ""
    : "";

  var isValidated = false;
  if (Object.values(errors).every((el) => el.length === 0)) {
    if (!form.interne && files.length === 0) {
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

export const addProjectToDatabase = (
  form,
  etat = "En instance",
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
    interne: true,
    enc_prim: current.id_utilisateur,
    enc_sec: null,
    tags: "",
    date_creation: new Date(),
  };
};

export const getProjectData = (id) => {
  const project = getProjectByID(id);
  if (!project) return initialForm;

  var tagsString = "";
  for (let tag of project.tags) tagsString += tag.id_tag + ", ";
  return {
    titre: project.titre,
    description: project.description,
    travail: project.travail,
    interne: project.interne,
    enc_prim: project.enc_prim,
    enc_sec: project.enc_sec,
    id_etudiant: project.id_etudiant,
    id_etudiant_2: project.id_etudiant_2,
    date_creation: new Date(project.date_creation),
    lieu: project.lieu,
    enc_ext: project.enc_ext,
    tags: project.tags.map((tag) => tag.id_tag),
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

  var object = { sujet: { ...form, id_sujet, etat } };

  console.log(object);
  console.log(files);
  store.dispatch({ type: "OPEN_BACKDROP" });

  return updateProject(object)
    .then(() =>
      addFileToDatabase(files)
        .then(() => {
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
    )
    .catch((err) => console.error(err));
};

export function deleteProjectFromDatabase(id_sujet) {
  return deleteProject(id_sujet)
    .then(() => {
      store.dispatch({
        type: "OPEN_SNACK",
        payload: { message: "Le sujet est supprimé.", type: "success" },
      });
    })
    .then(() =>
      getProjects().then((result) => {
        store.dispatch({ type: "SET_PROJECTS", payload: result.data });
      })
    )
    .catch((err) => console.error(err));
}

import { store } from "../../..";
import { addProject, addFileToDatabase } from "../../../functions";
import { v4 as uuid } from "uuid";

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
    enc_prim: current.role === "enseignant" ? current.id_utilisateur : null,
    enc_sec: null,
    interne: current.role === "etudiant" ? false : true,
    tags: "",
    date: new Date(),
  };
};

export const getProjectData = (id) => {
  const state = store.getState();
  const project = state.projects.dataArray.find((p) => p.id_sujet === id);
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
    tags: "",
    date: new Date(project.date),
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

export function updateProject(form, projectId, files) {
  addProjectToDatabase(form, projectId, files);
}

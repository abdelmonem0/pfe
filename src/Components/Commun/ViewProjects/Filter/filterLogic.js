import { store } from "../../../..";
import { Project_States } from "../../../../Constants";
import { getUserByID } from "../../Candidature.js/CandidatureLogic";

export const handle_filter_button = (
  event,
  setProjects,
  fetchedProjects,
  currentFilter,
  setCurrentFilter,
  filters
) => {
  const state = store.getState();
  const current = state.users.current;
  const filter = event ? event : "";
  var filtered = fetchedProjects;
  var _filters = [...currentFilter];
  if (_filters.indexOf(filter) < 0) _filters = [...currentFilter, filter];
  else _filters = currentFilter.filter((f) => f !== filter);
  setCurrentFilter(_filters);

  if (_filters.indexOf(filters.with_cahier) > -1)
    filtered = filtered.filter(
      (project) =>
        project.fichiers.length > 0 &&
        project.fichiers.filter(
          (f) => f.type.toLowerCase().indexOf("cahier") > -1
        ).length > 0
    );

  if (_filters.indexOf(filters.affected) > -1)
    filtered = filtered.filter((project) => project.affecte_a.length > 0);

  if (_filters.indexOf(filters.not_affected) > -1)
    filtered = filtered.filter((project) => project.affecte_a.length === 0);

  if (_filters.indexOf(filters.accepted) > -1)
    filtered = filtered.filter(
      (project) =>
        project.etat === Project_States.accepted && project.affecte_a.length < 1
    );

  if (_filters.indexOf(filters.refused) > -1)
    filtered = filtered.filter(
      (project) => project.etat === Project_States.refused
    );

  if (_filters.indexOf(filters.waiting) > -1)
    filtered = filtered.filter(
      (project) => project.etat === Project_States.waiting
    );

  if (_filters.indexOf(filters.without_encadrant) > -1)
    filtered = filtered.filter(
      (project) => !project.enc_prim && !project.enc_sec
    );

  if (_filters.indexOf(filters.liked) > -1) {
    const personalLiked = get_personal_liked_projects();
    filtered = filtered.filter(
      (project) => personalLiked.indexOf(project.id_sujet) > -1
    );
  }

  if (_filters.indexOf(filters.personal) > -1)
    filtered = filtered.filter(
      (el) =>
        el.enc_prim === current.id_utilisateur ||
        el.enc_sec === current.id_utilisateur ||
        el.id_etudiant === current.id_utilisateur ||
        el.id_etudiant_2 === current.id_utilisateur
    );

  setProjects(filtered);
};

export const getFilters = () => {
  const state = store.getState();
  const role = state.users.current.role;
  return {
    liked: role === "etudiant" ? "Sujets aimés" : "",
    personal: role === "etudiant" || role === "enseignant" ? "Mes sujets" : "",
    with_cahier: role === "president" ? "Sujets avec cahier de charge" : "",
    affected: "Sujets affectés",
    accepted: "Sujets validés",
    refused: role === "president" ? "Sujets réfusées" : "",
    waiting: "Sujets en instance",
    without_encadrant: role === "president" ? "Sans encadreur interne" : "",
  };
};

export const sortByDate = (projects, setProjects, asc) => {
  const temp = [...projects];
  temp.sort((a, b) => {
    if (asc === 1) {
      return new Date(a.date_creation) - new Date(b.date_creation);
    }
    if (asc === 2) {
      return new Date(b.date_creation) - new Date(a.date_creation);
    }
  });
  setProjects(temp);
};

export function get_matched_search_projects(projects, searchValue) {
  var matched = [];
  for (let i = 0; i < projects.length; i++) {
    if (
      projects[i].titre.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
    ) {
      matched.push(projects[i]);
      continue;
    }
    if (
      projects[i].description.toLowerCase().indexOf(searchValue.toLowerCase()) >
      -1
    ) {
      matched.push(projects[i]);
      continue;
    }
    if (
      projects[i].travail.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
    ) {
      matched.push(projects[i]);
      continue;
    }

    const array = projects[i].affecte_a
      .concat([
        getUserByID(projects[i].id_etudiant),
        getUserByID(projects[i].id_etudiant_2),
      ])
      .concat([
        getUserByID(projects[i].enc_prim),
        getUserByID(projects[i].enc_sec),
      ])
      .filter((el) => el != null)
      .map((el) => el.nom)
      .concat(projects[i].enc_ext)
      .filter((el) => el != null);

    for (let j = 0; j < array.length; j++) {
      if (
        searchValue.toLowerCase().indexOf(array[j].toLowerCase()) > -1 ||
        array[j].toLowerCase().indexOf(searchValue.toLowerCase()) > -1
      ) {
        matched.push(projects[i]);
        break;
      }
    }

    for (let j = 0; j < projects[i].tags.length; j++) {
      if (
        projects[i].tags[j].id_tag.length > 1 &&
        searchValue
          .toLowerCase()
          .indexOf(projects[i].tags[j].id_tag.toLowerCase()) > -1
      ) {
        matched.push(projects[i]);
        break;
      }
    }
  }

  return matched;
}

function get_personal_liked_projects() {
  const state = store.getState();
  const current = state.users.current;
  const liked = state.likes
    .filter((like) => like.id_utilisateur === current.id_utilisateur)
    .map((like) => like.id_sujet);

  return liked;
}

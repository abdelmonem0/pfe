import { store } from "../../../..";
import { Project_States } from "../../../../Constants";

export const handle_filter_button = (
  event,
  setProjects,
  fetchedProjects,
  currentFilter,
  setCurrentFilter,
  filters
) => {
  const filter = event ? event.target.innerHTML : "";
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
      (project) => project.etat === Project_States.accepted
    );

  if (_filters.indexOf(filters.refused) > -1)
    filtered = filtered.filter(
      (project) => project.etat === Project_States.refused
    );

  if (_filters.indexOf(filters.waiting) > -1)
    filtered = filtered.filter(
      (project) => project.etat === Project_States.waiting
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
    not_affected: "Sujets non affectés",
    accepted: "Sujets acceptés",
    refused: role === "president" ? "Sujets réfusées" : "",
    waiting: "Sujets en instance",
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
      .map((el) => el.nom)
      .concat(projects[i].encadrants.map((el) => el.nom));
    for (let j = 0; j < array.length; j++) {
      if (
        array[i] &&
        (searchValue.toLowerCase().indexOf(array[i].toLowerCase()) > -1 ||
          array[i].toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
      ) {
        matched.push(projects[i]);
        break;
      }
    }

    for (let j = 0; j < projects[i].tags.length; j++) {
      if (
        searchValue
          .toLowerCase()
          .indexOf(projects[i].tags[j].id_tag.toLowerCase()) > -1 ||
        projects[i].tags[j].id_tag
          .toLowerCase()
          .indexOf(searchValue.toLowerCase()) > -1
      ) {
        matched.push(projects[i]);
        break;
      }
    }
  }

  return matched;
}

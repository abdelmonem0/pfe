import { canAddProject } from "./Commun/Constraints";
import { store } from "../index";
import { getUserByID } from "./Commun/Candidature.js/CandidatureLogic";
import { load_saved_soutenances } from "./President/Soutenances/SoutenanceLogic";
import { Project_States } from "../Constants";

export const setPages = (role) => {
  const state = store.getState();
  const soutenances = state.savedSoutenance.soutenances;
  const self_projects = state.projects.self || [];
  const proposed_projects = state.projects.proposed || [];

  var pages = [];
  pages.push(makePage("Accueil", ""));
  switch (role) {
    case "etudiant":
      pages.push(makePage("Sujets", "/sujets"));
      if (self_projects.length > 0)
        pages.push(
          makeNestedPage(
            "Mes sujets",
            "/sujets/mes",
            "/sujets",
            self_projects.length
          )
        );
      if (canAddProject()) pages.push(makePage("Ajouter", "/ajouter"));
      pages.push(makePage("Proposer", "/proposer"));
      pages.push(makePage("Candidatures", "/candidatures"));

      break;
    case "enseignant":
      pages.push(makePage("Sujets", "/sujets"));
      pages.push(makePage("Ajouter", "/ajouter"));
      if (self_projects.length > 0)
        pages.push(
          makeNestedPage(
            "Mes sujets",
            "/sujets/mes",
            "/sujets",
            self_projects.length
          )
        );
      if (proposed_projects.length > 0)
        pages.push(
          makeNestedPage(
            "Sujets proposés",
            "/sujets/proposes",
            "/sujets",
            proposed_projects.length
          )
        );
      pages.push(makePage("Candidatures", "/candidatures"));
      pages.push(makePage("Préférences", "/preferences"));

      break;
    case "membre":
      pages.push(makePage("Ajouter", "/ajouter"));
      pages.push(makePage("Sujets", "/sujets"));
      pages.push(makePage("Candidatures", "/candidatures"));
      pages.push(makePage("Préférences", "/preferences"));

      break;
    case "president":
      pages.push(makePage("Sujets", "/sujets"));
      pages.push(makePage("Soutenances", "/soutenances"));
      if (soutenances && soutenances.length > 0)
        pages.push(
          makeNestedPage(
            "Enregistrés",
            "/soutenances/enregistres",
            "/soutenances"
          )
        );
      pages.push(makePage("Dates", "/dates"));
      pages.push(makePage("Enseignants", "/enseignants"));
      pages.push(makePage("Etudiants", "/etudiants"));

      // pages.push(makePage("Paramètres", "/parametres"));

      break;
    default:
      break;
  }
  pages.push(makePage("Profile", "/profile"));
  store.dispatch({ type: "SET_PAGES", payload: pages });
};

function makePage(text, link) {
  return { text, link };
}

function makeNestedPage(text, link, parent, count = 0) {
  return { text, link, parent, count };
}

export function setupSoutenances(data) {
  var soutenances = data.soutenances;
  const fetchedInvite = data.invite;

  for (let i = 0; i < soutenances.length; i++) {
    var invite = [];
    for (let inv of fetchedInvite)
      if (
        inv.id_soutenance === soutenances[i].id_soutenance &&
        invite.map((el) => el.id_utilisateur).indexOf(inv.id_utilisateur) < 0
      ) {
        const user = getUserByID(inv.id_utilisateur);
        invite.push({ ...user, role: inv.role });
      }
    soutenances[i] = {
      ...soutenances[i],
      invite,
      date: new Date(soutenances[i].date).toLocaleDateString(),
    };
  }

  store.dispatch({ type: "SET_SAVED_SOUTENANCES", payload: soutenances });
  load_saved_soutenances(soutenances);
}

export function filterPrivateProjects(_projects, current) {
  var projects = [..._projects];

  if (current.role === "etudiant")
    projects = projects.filter((p) => p.etat !== Project_States.refused);

  var _public = projects.filter(
    (el) =>
      el.etat !== Project_States.proposed_by_student_for_teacher &&
      el.etat !== Project_States.refused_by_teacher
  );

  var _private = projects.filter(
    (el) =>
      (el.etat === Project_States.proposed_by_student_for_teacher ||
        el.etat === Project_States.refused_by_teacher) &&
      (el.enc_prim === current.id_utilisateur ||
        el.id_etudiant === current.id_utilisateur)
  );
  var _proposed_by_user = projects.filter(
    (el) =>
      el.etat !== Project_States.proposed_by_student_for_teacher &&
      el.etat !== Project_States.refused_by_teacher &&
      (el.enc_prim === current.id_utilisateur ||
        el.enc_sec === current.id_utilisateur)
  );
  store.dispatch({ type: "SET_PROJECTS", payload: _public });

  if (current.role !== "etudiant") {
    store.dispatch({
      type: "SET_PROPOSED_PROJECTS",
      payload: _private,
    });
    store.dispatch({ type: "SET_SELF_PROJECTS", payload: _proposed_by_user });
  } else {
    store.dispatch({ type: "SET_SELF_PROJECTS", payload: _private });
  }
}

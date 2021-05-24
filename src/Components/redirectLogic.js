import { canAddProject } from "./Commun/Constraints";
import { store } from "../index";
import { getUserByID } from "./Commun/Candidature.js/CandidatureLogic";
import { load_saved_soutenances } from "./President/Soutenances/SoutenanceLogic";

export const setPages = (role) => {
  const state = store.getState();
  const soutenances = state.savedSoutenance.soutenances;

  var pages = [];
  pages.push(makePage("Accueil", ""));
  switch (role) {
    case "etudiant":
      pages.push(makePage("Sujets", "/sujets"));
      if (canAddProject()) pages.push(makePage("Ajouter", "/ajouter"));
      pages.push(makePage("Candidatures", "/candidatures"));

      break;
    case "enseignant":
      pages.push(makePage("Sujets", "/sujets"));
      pages.push(makePage("Ajouter", "/ajouter"));
      pages.push(makeNestedPage("Mes sujets", "/sujets/current", "/sujets"));
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
      pages.push(makePage("Enseignants", "/enseignants"));
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

function makeNestedPage(text, link, parent) {
  return { text, link, parent };
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

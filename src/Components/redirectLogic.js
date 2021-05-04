import { canAddProject } from "./Commun/Constraints";
import { store } from "../index";

export const setPages = (role) => {
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
      pages.push(makePage("Enseignants", "/enseignants"));

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

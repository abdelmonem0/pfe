import { store } from "../../..";
import { File_States } from "../../../Constants";

export function canEditProject(project) {
  const state = store.getState();
  const current = state.users.current;

  return (
    project.enc_prim === current.id_utilisateur ||
    project.enc_sec === current.id_utilisateur ||
    current.role === "president"
  );
}

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

export function canSeeCahierState(project) {
  const state = store.getState();
  const current = state.users.current;
  if (
    project.enc_prim === current.id_utilisateur ||
    project.enc_sec === current.id_utilisateur ||
    project.id_etudiant === current.id_utilisateur ||
    project.id_etudiant_2 === current.id_utilisateur ||
    project.affecte_a.find(
      (p) => p.id_utilisateur === current.id_utilisateur
    ) ||
    current.role === "president" ||
    current.role === "membre"
  )
    return true;
  return false;
}

export function getCahierState(project, theme) {
  for (let f of project.fichiers) {
    if (f.type === File_States.cahier_de_charge_accepte)
      return {
        state: File_States.cahier_de_charge_accepte,
        color: theme.palette.success.main,
      };
    if (f.type === File_States.cahier_de_charge_en_instance)
      return {
        state: File_States.cahier_de_charge_en_instance,
        color: theme.palette.primary.main,
      };
    if (f.type === File_States.cahier_de_charge_refuse)
      return {
        state: File_States.cahier_de_charge_refuse,
        color: theme.palette.error.main,
      };
  }
  return { state: "Pas de cahier de charge", color: "default" };
}

import { store } from "../../..";
import { File_States, Project_States } from "../../../Constants";

export function canEditProject(project) {
  const state = store.getState();
  const current = state.users.current;

  return (
    ((project.enc_prim === current.id_utilisateur ||
      project.enc_sec === current.id_utilisateur) &&
      (project.etat === Project_States.waiting ||
        project.etat === Project_States.proposed_by_student_for_teacher)) ||
    ((project.id_etudiant === current.id_utilisateur ||
      project.id_etudiant_2 === current.id_utilisateur) &&
      project.etat === Project_States.proposed_by_student_for_teacher) ||
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
  var canSee = false;

  if (project.enc_prim === current.id_utilisateur) canSee = true;
  if (project.enc_sec === current.id_utilisateur) canSee = true;
  if (project.id_etudiant === current.id_utilisateur) canSee = true;
  if (project.id_etudiant_2 === current.id_utilisateu) canSee = true;
  if (
    project.affecte_a.filter((p) => p.id_utilisateur === current.id_utilisateur)
      .length > 0
  )
    canSee = true;
  if (current.role === "president") canSee = true;
  if (current.role === "membre") canSee = true;

  return canSee;
}

export function getCahierState(project, theme) {
  if (!project) return { state: "Pas de cahier de charge", color: "default" };

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

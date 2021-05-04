import { store } from "../..";
import { Candidature_States, Project_States } from "../../Constants";

export function canCandidate(project = undefined, user = undefined) {
  const state = store.getState();
  const current = typeof user !== "undefined" ? user : state.users.current;

  //user is not student
  if (current.role !== "etudiant") return false;

  //user has proposed a project
  if (
    state.projects.dataArray.filter(
      (p) =>
        (p.id_etudiant === current.id_utilisateur ||
          p.id_etudiant_2 === current.id_utilisateur) &&
        (p.etat === Project_States.accepted ||
          p.etat === Project_States.waiting)
    ).length > 0
  )
    return false;

  //user has 3 or more cands
  if (
    state.candidatures.filter(
      (c) =>
        c.etat === Candidature_States.accepted_by_teacher_partner ||
        c.etat === Candidature_States.waiting_for_response ||
        c.etat === Candidature_States.waiting_for_student
    ).length >= 3
  )
    return false;

  //user can generally candidate
  if (!project) return true;
  //user has affected project OR project is affected OR project is externe OR project is not accepted OR project is proposed
  if (
    current.sujet_affecte ||
    project.affecte_a.length > 0 ||
    !project.interne ||
    project.etat !== Project_States.accepted
  )
    return false;

  //user already candidated OR invited to this specific project
  if (
    state.candidatures.filter((c) => c.id_sujet === project.id_sujet).length > 0
  )
    return false;
  return true;
}

export function leftCandidaturesText() {
  const state = store.getState();
  const left = state.candidatures.filter(
    (c) =>
      c.etat === Candidature_States.accepted_by_teacher_partner ||
      c.etat === Candidature_States.waiting_for_response ||
      c.etat === Candidature_States.waiting_for_student
  ).length;
  return `Candidatures: ${left}/3`;
}

export function getProjectStateForChip(project, theme) {
  const state = store.getState();
  const currentRole = state.users.current.role;
  var temp;

  if (currentRole === "etudiant" || currentRole === "enseignant") {
    if (project.etat === Project_States.accepted)
      temp = {
        state: "En instance",

        colors: {
          color: "white",
          borderColor: "transparent",
          backgroundColor: theme.palette.primary.main,
        },
        tooltip: "Accepté par la commission, pas encore affecté",
      };
    else if (project.etat === Project_States.waiting)
      temp = {
        state: "En instance",

        colors: {
          color: theme.palette.warning.main,
          borderColor: theme.palette.warning.main,
          backgroundColor: "transparent",
        },
        tooltip: "En attente de la reponse de la commission",
      };

    if (project.affecte_a.length > 0) {
      temp = {
        state: "Affecté",

        colors: {
          color: "white",
          borderColor: "transparent",
          backgroundColor: theme.palette.success.main,
        },
      };
      var affecte_a = "Affecté à " + project.affecte_a[0].nom;
      if (project.affecte_a.length > 1)
        affecte_a += " et " + project.affecte_a[1].nom;
      temp.tooltip = affecte_a;
    }
  } else {
    if (project.etat === Project_States.accepted)
      temp = {
        state: "Accepté",

        colors: {
          color: "white",
          borderColor: "transparent",
          backgroundColor: theme.palette.success.main,
        },
        tooltip: "Accepté par la commission, pas encore affecté",
      };
    else if (project.etat === Project_States.waiting)
      temp = {
        state: "En instance",

        colors: {
          color: theme.palette.warning.main,
          borderColor: theme.palette.warning.main,
          backgroundColor: "transparent",
        },
        tooltip: "En attente de la reponse de la commission",
      };
    else
      temp = {
        state: "Réfusé",
        colors: {
          color: "white",
          borderColor: "transparent",
          backgroundColor: theme.palette.error.main,
        },
        tooltip: "Réfusé par la commission.",
      };

    if (project.affecte_a.length > 0) {
      temp = {
        state: "Affecté",

        colors: {
          color: theme.palette.success.main,
          borderColor: theme.palette.success.main,
          backgroundColor: "transparent",
        },
      };
      var affecte_a = "Affecté à " + project.affecte_a[0].nom;
      if (project.affecte_a.length > 1)
        affecte_a += " et " + project.affecte_a[1].nom;
      temp.tooltip = affecte_a;
    }
  }

  return temp;
}

export function canAddProject() {
  const state = store.getState();
  const current = state.users.current;

  //student got affected project
  if (current.sujet_affecte) return false;

  //student got active proposed project
  if (
    state.projects.dataArray.filter(
      (p) =>
        (p.id_etudiant === current.id_utilisateur ||
          p.id_etudiant_2 === current.id_utilisateur) &&
        p.etat !== Project_States.refused
    ).length > 0
  )
    return false;

  //student has more than 3 active candidatures
  if (
    state.candidatures.filter(
      (c) =>
        c.etat === Candidature_States.accepted_by_teacher_partner ||
        c.etat === Candidature_States.waiting_for_response ||
        c.etat === Candidature_States.waiting_for_student
    ).length >= 3
  )
    return false;

  return true;
}

export function canViewAttachement(project) {
  const state = store.getState();
  const current = state.users.current;

  //project dont have attachments
  if (project.fichiers.length < 1) return false;

  //user is involved in project
  if (
    [
      project.enc_prim,
      project.enc_sec,
      project.id_etudiant,
      project.id_etudiant_2,
    ].indexOf(current.id_utilisateur) > -1 ||
    project.affecte_a.indexOf(current.id_utilisateur) > -1
  )
    return true;

  //user is not commission membre
  if (current.role !== "membre" && current.role !== "president") return false;

  return true;
}

export function getCandidaturePartner() {
  const state = store.getState();
  const current = state.users.current;
  const students = state.users.all.filter(
    (user) =>
      !user.sujet_affecte &&
      user.id_utilisateur != current.id_utilisateur &&
      canCandidate(undefined, user)
  );

  console.log(students);
  return students;
}
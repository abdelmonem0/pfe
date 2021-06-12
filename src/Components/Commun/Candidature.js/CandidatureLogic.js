import { Candidature_States } from "../../../Constants";
import { store } from "../../../index";

export function getUsernameByID(candidature) {
  const state = store.getState();
  const users = state.users;

  const project = state.projects.dataArray.filter(
    (p) => p.id_sujet === candidature.id_sujet
  )[0];
  if (!project) {
    alert(candidature.id_candidature);
    return { partner: [""], others: [""] };
  }
  var partner = [],
    others = [];

  if (users.current.role === "etudiant") {
    others = users.all
      .filter(
        (u) =>
          u.id_utilisateur === project.enc_prim ||
          u.id_utilisateur === project.enc_sec
      )
      .map((u) => u.nom);
    partner = users.all
      .filter(
        (u) =>
          u.id_utilisateur !== users.current.id_utilisateur &&
          (u.id_utilisateur === candidature.id_etudiant ||
            u.id_utilisateur === candidature.id_etudiant_2)
      )
      .map((u) => u.nom);
  } else {
    others = users.all
      .filter(
        (u) =>
          u.id_utilisateur === candidature.id_etudiant ||
          u.id_utilisateur === candidature.id_etudiant_2
      )
      .map((u) => u.nom);
    partner = users.all
      .filter(
        (u) =>
          u.id_utilisateur !== users.current.id_utilisateur &&
          (u.id_utilisateur === project.enc_prim ||
            u.id_utilisateur === project.enc_sec)
      )
      .map((u) => u.nom);
  }

  const type =
    users.current.role === "etudiant"
      ? others.length === 1
        ? "Encadrant"
        : "Encadrants"
      : others.length === 1
      ? "Candidat"
      : "Candidats";
  return { partner, others, type };
}

export function getCandidatureState(candidature, theme) {
  const state = store.getState();
  const role = state.users.current.role;
  const etat = candidature.etat;
  var data = {};

  if (role === "etudiant") {
    switch (etat) {
      case Candidature_States.waiting_for_response:
        data = { ...data, color: theme.palette.primary.main };
        break;
      case Candidature_States.accepted_by_teacher_partner:
        data = { ...data, color: theme.palette.primary.main };
        break;
      case Candidature_States.waiting_for_student:
        data = { ...data, color: theme.palette.warning.main };
        break;
      case Candidature_States.accepted:
        data = { ...data, color: theme.palette.success.main };
        break;
      case Candidature_States.inactive:
        data = { ...data, color: theme.palette.text.secondary };
        break;
    }
  } else {
    switch (etat) {
      case Candidature_States.waiting_for_response:
        data = { ...data, color: theme.palette.primary.main };
        break;
      case Candidature_States.accepted_by_teacher_partner:
        data = { ...data, color: theme.palette.warning.main };
        break;
      case Candidature_States.accepted:
        data = { ...data, color: theme.palette.success.main };
        break;
      case Candidature_States.inactive:
        data = { ...data, color: theme.palette.text.secondary };
        break;
    }
  }

  return { ...data, etat };
}

export function getProject(candidature) {
  const state = store.getState();
  const project = state.projects.dataArray.filter(
    (p) => p.id_sujet === candidature.id_sujet
  )[0];

  return project;
}

export function getUserByID(id) {
  const state = store.getState();
  return state.users.all.find((u) => u.id_utilisateur === id) || null;
}

export function withAttachments(candidature) {
  return (
    (candidature.commentaires != null && candidature.commentaires !== "") ||
    (candidature.commentaire_2 != null && candidature.commentaire_2 !== "") ||
    candidature.fichiers.length > 0
  );
}

export function getProjectsWithCandidatures() {
  const state = store.getState();
  const current = state.users.current;
  var projects = state.projects.dataArray.filter(
    (proj) =>
      proj.enc_prim === current.id_utilisateur ||
      proj.enc_sec === current.id_utilisateur
  );
  const candidatures = state.candidatures;
  for (let proj of projects) {
    proj.candidatures = candidatures.filter(
      (cand) => cand.id_sujet === proj.id_sujet
    );
  }

  projects.sort((a, b) => b.candidatures.length - a.candidatures.length);

  console.log(projects);
  return projects;
}

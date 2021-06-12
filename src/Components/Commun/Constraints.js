import { store } from "../..";
import { Candidature_States, Project_States } from "../../Constants";

export function canCandidate(project = undefined, user = undefined) {
  const state = store.getState();
  const current = typeof user !== "undefined" ? user : state.users.current;
  var _canCandidate = true;
  var raison = "";

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
  ) {
    _canCandidate = false;
    raison = "Vous avez proposé un sujet externe.";
  }

  //user has 3 or more cands
  if (
    state.candidatures.filter(
      (c) =>
        c.etat === Candidature_States.accepted_by_teacher_partner ||
        c.etat === Candidature_States.waiting_for_response ||
        c.etat === Candidature_States.waiting_for_student
    ).length >= 3
  ) {
    _canCandidate = false;
    raison = "Vous avez 3 candidatures non active.";
  }

  //user can generally candidate
  if (!project) return { canCandidate: true, raison: "" };
  //user has affected
  if (current.sujet_affecte) {
    _canCandidate = false;
    raison = "Vous avez déjà un sujet affecté.";
  }
  //project is affected
  if (project.affecte_a.length > 0) {
    _canCandidate = false;
    raison = "Sujet affecté.";
  }
  //project is externe
  if (!project.interne) {
    _canCandidate = false;
    raison = "Sujet externe.";
  }
  //project not accepted OR project is proposed
  if (project.etat !== Project_States.accepted) {
    _canCandidate = false;
    raison = "En traitement par la commission.";
  }

  //user already candidated OR invited to this specific project
  if (
    state.candidatures.filter((c) => c.id_sujet === project.id_sujet).length > 0
  ) {
    _canCandidate = false;
    const candidature = state.candidatures.find(
      (c) => c.id_sujet === project.id_sujet
    );
    raison =
      candidature.id_etudiant === user.id_utilisateur
        ? "Vous avez postulé pour ce sujet."
        : "Vous êtes invité pour ce sujet.";
  }

  return { canCandidate: _canCandidate, raison };
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
        state: "Validé",
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
    else if (project.etat === Project_States.proposed_by_student_for_teacher)
      temp = {
        state: "Proposition",

        colors: {
          color: theme.palette.error.light,
          borderColor: theme.palette.error.dark,
          backgroundColor: "transparent",
        },
        tooltip:
          currentRole === "etudiant"
            ? "Proposé par vous à un enseignant"
            : "Proposé à vous par un étudiant",
      };
    else if (project.etat === Project_States.refused_by_teacher)
      temp = {
        state: "Refusé",

        colors: {
          color: "white",
          borderColor: "transparent",
          backgroundColor: theme.palette.error.main,
        },
        tooltip: Project_States.refused_by_teacher,
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
    else if (project.etat === Project_States.proposed_by_student_for_teacher)
      temp = {
        state: "Proposition",

        colors: {
          color: theme.palette.error.light,
          borderColor: theme.palette.error.dark,
          backgroundColor: "transparent",
        },
        tooltip: "Proposé par un étudiant à un enseignant",
      };
    else if (project.etat === Project_States.refused_by_teacher)
      temp = {
        state: "Refusé",

        colors: {
          color: "white",
          borderColor: "transparent",
          backgroundColor: theme.palette.error.main,
        },
        tooltip: Project_States.refused_by_teacher,
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
  if (current.role === "enseignant") return true;

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

  return students;
}

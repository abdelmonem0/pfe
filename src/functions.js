import axios from "axios";

// https://pfe-abdelmonem.herokuapp.com

export function loginUser(id_utilisateur, mot_de_passe) {
  return axios.post("https://pfe-abdelmonem.herokuapp.com/api/login", {
    id_utilisateur,
    mot_de_passe,
  });
}

export function getUsers() {
  return axios.get("https://pfe-abdelmonem.herokuapp.com/api/get-users");
}

export function getCandidatures(id) {
  return axios.post(
    "https://pfe-abdelmonem.herokuapp.com/api/candidature/get-candidatures",
    {
      id,
    }
  );
}

export function getProjects() {
  return axios.get(
    "https://pfe-abdelmonem.herokuapp.com/api/project/get-projects"
  );
}

export function addCandidature(candidature) {
  return axios.post(
    "https://pfe-abdelmonem.herokuapp.com/api/candidature/add-candidature",
    candidature
  );
}

export function acceptCandidatureEtudiant(
  id_utilisateur,
  id_candidature,
  etat
) {
  return axios.post(
    "https://pfe-abdelmonem.herokuapp.com/api/candidature/accept-candidature-etudiant",
    {
      id_utilisateur,
      id_candidature,
      etat,
    }
  );
}

export function acceptCandidatureEnseignant(
  id_utilisateur,
  id_candidature,
  etat
) {
  return axios.post(
    "https://pfe-abdelmonem.herokuapp.com/api/candidature/accept-candidature-enseignant",
    {
      id_utilisateur,
      id_candidature,
      etat,
    }
  );
}

export function addFileToDatabase(files) {
  return axios.post("https://pfe-abdelmonem.herokuapp.com/api/add-file", files);
}

export function deleteFileFromDatabase(id_fichier) {
  return axios.post("https://pfe-abdelmonem.herokuapp.com/api/delete-file", {
    id_fichier,
  });
}

export function downloadFile(path) {
  return axios.post(
    "https://pfe-abdelmonem.herokuapp.com/api/download-file",
    { path },
    { responseType: "arraybuffer" }
  );
}

export function addAvis(id_utilisateur, id_sujet, avis_favorable, _delete) {
  return axios.post(
    "https://pfe-abdelmonem.herokuapp.com/api/comment/add-avis",
    {
      id_utilisateur,
      id_sujet,
      avis_favorable,
      _delete,
    }
  );
}

export function getAvis() {
  return axios.get("https://pfe-abdelmonem.herokuapp.com/api/comment/get-avis");
}

export function addLike(id_sujet, id_utilisateur) {
  return axios.post("https://pfe-abdelmonem.herokuapp.com/api/add-like", {
    id_sujet,
    id_utilisateur,
  });
}

export function getLikes(id_utilisateur) {
  return axios.post("https://pfe-abdelmonem.herokuapp.com/api/get-likes", {
    id_utilisateur,
  });
}

export function acceptProject(id_sujet, etat) {
  return axios.post(
    "https://pfe-abdelmonem.herokuapp.com/api/project/accept-project",
    {
      id_sujet,
      etat,
    }
  );
}

export function addComment(id_utilisateur, id_sujet, commentaire) {
  return axios.post(
    "https://pfe-abdelmonem.herokuapp.com/api/comment/add-comment",
    {
      id_utilisateur,
      id_sujet,
      commentaire,
    }
  );
}

export function deleteComment(id_commentaire) {
  return axios.post(
    "https://pfe-abdelmonem.herokuapp.com/api/comment/delete-comment",
    {
      id_commentaire,
    }
  );
}

export function modifyComment(id_commentaire, commentaire) {
  return axios.post(
    "https://pfe-abdelmonem.herokuapp.com/api/comment/modify-comment",
    {
      id_commentaire,
      commentaire,
    }
  );
}

export function addTeacherTags(id_utilisateur, tags) {
  return axios.post(
    "https://pfe-abdelmonem.herokuapp.com/api/soutenance/add-tags",
    {
      id_utilisateur,
      tags,
    }
  );
}

export function getTeacherTags(id_utilisateur) {
  return axios.post(
    "https://pfe-abdelmonem.herokuapp.com/api/soutenance/get-tags",
    {
      id_utilisateur,
    }
  );
}

export function deleteTeacherTag(associe_a, id_tag) {
  return axios.post(
    "https://pfe-abdelmonem.herokuapp.com/api/soutenance/delete-tag",
    {
      associe_a,
      id_tag,
    }
  );
}

export function getAllTags() {
  return axios.get(
    "https://pfe-abdelmonem.herokuapp.com/api/soutenance/get-all-tags"
  );
}

export function saveSoutenanceDates(date_debut, date_fin) {
  return axios.post(
    "https://pfe-abdelmonem.herokuapp.com/api/soutenance/save-soutenance-dates",
    {
      date_debut,
      date_fin,
    }
  );
}

export function getSoutenancesDates() {
  return axios.get(
    "https://pfe-abdelmonem.herokuapp.com/api/soutenance/get-soutenances-dates"
  );
}

export function saveTeacherDates(id_utilisateur, dates) {
  return axios.post(
    "https://pfe-abdelmonem.herokuapp.com/api/soutenance/save-teacher-dates",
    {
      id_utilisateur,
      dates,
    }
  );
}

export function getTeacherDates(id_utilisateur) {
  return axios.post(
    "https://pfe-abdelmonem.herokuapp.com/api/soutenance/get-teacher-dates",
    {
      id_utilisateur,
    }
  );
}

export function getAllTeachersDates() {
  return axios.get(
    "https://pfe-abdelmonem.herokuapp.com/api/soutenance/get-all-teachers-dates"
  );
}

export function addProject(project, update) {
  return axios.post(
    "https://pfe-abdelmonem.herokuapp.com/api/project/add-project",
    {
      project,
      update,
    }
  );
}

export function sendNotifications(notifications) {
  return axios.post(
    "https://pfe-abdelmonem.herokuapp.com/api/notification/send-notifications",
    notifications
  );
}

export function getNotifications(id_utilisateur) {
  return axios.post(
    "https://pfe-abdelmonem.herokuapp.com/api/notification/get-notifications",
    {
      id_utilisateur,
    }
  );
}

export function checkNotification(id_notification) {
  return axios.post(
    "https://pfe-abdelmonem.herokuapp.com/api/notification/check-notifications",
    {
      id_notification,
    }
  );
}

export function send2ndCandidatureComment(id_candidature, commentaire) {
  return axios.post(
    "https://pfe-abdelmonem.herokuapp.com/api/candidature/add-2nd-comment",
    {
      id_candidature,
      commentaire,
    }
  );
}

export function sendEmail(emails) {
  return axios.post("https://pfe-abdelmonem.herokuapp.com/send-email", emails);
}

export function saveParameter(params) {
  return axios.post(
    "https://pfe-abdelmonem.herokuapp.com/api/parameters/save",
    params
  );
}

export function updateFile(id_fichier, type) {
  return axios.post("https://pfe-abdelmonem.herokuapp.com/api/update-file", {
    id_fichier,
    type,
  });
}

export function saveSoutenances(soutenances, invite) {
  return axios.post(
    "https://pfe-abdelmonem.herokuapp.com/api/soutenance/save-soutenances",
    {
      soutenances,
      invite,
    }
  );
}

export function getSoutenances() {
  return axios.get(
    "https://pfe-abdelmonem.herokuapp.com/api/soutenance/get-soutenances"
  );
}

export const uploadFile = "https://pfe-abdelmonem.herokuapp.com/upload-file";

// export async function loadAllData(id_utilisateur) {
//   var allData = {};
//   return getProjects().then((projects) => {
//     console.log("getting projects")
//     allData.projects = projects.data;
//     getCandidatures(id_utilisateur).then((candidatures) => {
//       console.log("getting candidatures")
//       allData.candidatures = candidatures.data;
//       return allData;
//     });
//   });
// }

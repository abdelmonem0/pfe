import axios from "axios";

// https://pfe-abdelmonem.herokuapp.com

export function loginUser(id_utilisateur, mot_de_passe) {
  return axios.post("http://localhost:5000/api/login", {
    id_utilisateur,
    mot_de_passe,
  });
}

export function getUsers() {
  return axios.get("http://localhost:5000/api/get-users");
}

export function getCandidatures(id) {
  return axios.post("http://localhost:5000/api/candidature/get-candidatures", {
    id,
  });
}

export function getProjects() {
  return axios.get("http://localhost:5000/api/project/get-projects");
}

export function addCandidature(candidature) {
  return axios.post(
    "http://localhost:5000/api/candidature/add-candidature",
    candidature
  );
}

export function acceptCandidatureEtudiant(
  id_utilisateur,
  id_candidature,
  etat
) {
  return axios.post(
    "http://localhost:5000/api/candidature/accept-candidature-etudiant",
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
    "http://localhost:5000/api/candidature/accept-candidature-enseignant",
    {
      id_utilisateur,
      id_candidature,
      etat,
    }
  );
}

export function addFileToDatabase(files) {
  return axios.post("http://localhost:5000/api/add-file", files);
}

export function deleteFileFromDatabase(id_fichier) {
  return axios.post("http://localhost:5000/api/delete-file", {
    id_fichier,
  });
}

export function downloadFile(path) {
  return axios.post(
    "http://localhost:5000/api/download-file",
    { path },
    { responseType: "arraybuffer" }
  );
}

export function addAvis(id_utilisateur, id_sujet, avis_favorable, _delete) {
  return axios.post("http://localhost:5000/api/comment/add-avis", {
    id_utilisateur,
    id_sujet,
    avis_favorable,
    _delete,
  });
}

export function getAvis() {
  return axios.get("http://localhost:5000/api/comment/get-avis");
}

export function addLike(id_sujet, id_utilisateur) {
  return axios.post("http://localhost:5000/api/add-like", {
    id_sujet,
    id_utilisateur,
  });
}

export function getLikes(id_utilisateur) {
  return axios.post("http://localhost:5000/api/get-likes", {
    id_utilisateur,
  });
}

export function acceptProject(id_sujet, etat) {
  return axios.post("http://localhost:5000/api/project/accept-project", {
    id_sujet,
    etat,
  });
}

export function addComment(comment) {
  return axios.post("http://localhost:5000/api/comment/add-comment", comment);
}

export function deleteComment(id_commentaire) {
  return axios.post("http://localhost:5000/api/comment/delete-comment", {
    id_commentaire,
  });
}

export function modifyComment(comment) {
  return axios.post(
    "http://localhost:5000/api/comment/modify-comment",
    comment
  );
}

export function getComments() {
  return axios.get("http://localhost:5000/api/comment/get-comments");
}

export function addTeacherTags(id_utilisateur, tags) {
  return axios.post("http://localhost:5000/api/soutenance/add-tags", {
    id_utilisateur,
    tags,
  });
}

export function getTeacherTags(id_utilisateur) {
  return axios.post("http://localhost:5000/api/soutenance/get-tags", {
    id_utilisateur,
  });
}

export function deleteTeacherTag(associe_a, id_tag) {
  return axios.post("http://localhost:5000/api/soutenance/delete-tag", {
    associe_a,
    id_tag,
  });
}

export function getAllTags() {
  return axios.get("http://localhost:5000/api/soutenance/get-all-tags");
}

export function saveSoutenanceDates(date_debut, date_fin) {
  return axios.post(
    "http://localhost:5000/api/soutenance/save-soutenance-dates",
    {
      date_debut,
      date_fin,
    }
  );
}

export function getSoutenancesDates() {
  return axios.get(
    "http://localhost:5000/api/soutenance/get-soutenances-dates"
  );
}

export function saveTeacherDates(id_utilisateur, dates) {
  return axios.post("http://localhost:5000/api/soutenance/save-teacher-dates", {
    id_utilisateur,
    dates,
  });
}

export function getTeacherDates(id_utilisateur) {
  return axios.post("http://localhost:5000/api/soutenance/get-teacher-dates", {
    id_utilisateur,
  });
}

export function getAllTeachersDates() {
  return axios.get(
    "http://localhost:5000/api/soutenance/get-all-teachers-dates"
  );
}

export function addProject(project, update) {
  return axios.post("http://localhost:5000/api/project/add-project", {
    project,
    update,
  });
}

export function sendNotifications(notifications) {
  return axios.post(
    "http://localhost:5000/api/notification/send-notifications",
    notifications
  );
}

export function getNotifications(id_utilisateur) {
  return axios.post(
    "http://localhost:5000/api/notification/get-notifications",
    {
      id_utilisateur,
    }
  );
}

export function checkNotification(notifications) {
  return axios.post(
    "http://localhost:5000/api/notification/check-notifications",
    notifications
  );
}

export function send2ndCandidatureComment(id_candidature, commentaire) {
  return axios.post("http://localhost:5000/api/candidature/add-2nd-comment", {
    id_candidature,
    commentaire,
  });
}

export function saveParameter(params) {
  return axios.post("http://localhost:5000/api/parameters/save", params);
}

export function updateFile(id_fichier, type) {
  return axios.post("http://localhost:5000/api/update-file", {
    id_fichier,
    type,
  });
}

export function saveSoutenances(soutenances, invite) {
  return axios.post("http://localhost:5000/api/soutenance/save-soutenances", {
    soutenances,
    invite,
  });
}

export function getSoutenances() {
  return axios.get("http://localhost:5000/api/soutenance/get-soutenances");
}

export function updatePassword({
  id_utilisateur,
  current_password,
  new_password,
}) {
  return axios.post("http://localhost:5000/api/update-password", {
    id_utilisateur,
    current_password,
    new_password,
  });
}

export function saveDates(date) {
  return axios.post("http://localhost:5000/api/save-dates", date);
}

export function getDates() {
  return axios.get("http://localhost:5000/api/get-dates");
}

export const uploadFile = "http://localhost:5000/upload-file";

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

import { store } from "../../../index";
import { getUserByID } from "../../Commun/Candidature.js/CandidatureLogic";
import { v4 as uuid } from "uuid";
import { getProjectByID } from "../../Enseignant/Candidatures/logic";
import { saveSoutenances as saveToDatabase } from "../../../functions";

//
//
//Steps logic

export function getStepToShow(current) {
  const state = store.getState();
  const values = state.soutenance.values;
  var step = 0;
  var raison = "success";

  if (
    new Date(values.endDate).getDate() !== new Date().getDate() &&
    values.sales !== "" &&
    values.crenaux !== 1
  )
    step = 1;
  else {
    raison =
      "Il faut que la date de fin des soutenances soit supérieure à celle de début, les sales soient remplis et le nombre de crenaux maximale soit superieur à 0.";
    return { step, raison };
  }

  if (values.selectedProjects.length > 0) step = 2;
  else {
    raison = "Il faut choisir des projets.";
    return { step, raison };
  }

  if (values.selectedTeachers.length > 0 && values.presidents.length > 0)
    step = 3;
  else {
    raison = "Il faut choisir des enseignants et au des présidents.";
    return { step, raison };
  }

  return { step, raison: "success" };
}

export function willInitSoutenanceValues() {
  const state = store.getState();
  if (
    (state.soutenance && Object.keys(state.soutenance).length === 0) ||
    (state.soutenance.values &&
      Object.keys(state.soutenance.values).length === 0)
  )
    return true;
  return false;
}

//
//
//Steps logic

//Important
//
//
export function assignDatesToTeachers() {
  const state = store.getState();
  var teachers = state.users.all.filter(
    (t) => t.role === "enseignant" || t.role === "membre"
  );
  const dates = state.soutenance.dates;
  for (let teacher of teachers) {
    var _dates = [];
    for (let date of dates) {
      if (date.id_utilisateur === teacher.id_utilisateur)
        _dates.push({ date: date.jour, crenaux: date.crenaux });
    }
    teacher.dates = _dates;
  }
  return teachers;
}

export function assignTagsToTeachers() {
  const state = store.getState();
  var teachers = state.users.all.filter(
    (t) => t.role === "enseignant" || t.role === "membre"
  );
  const tags = state.soutenance.tags;
  for (let teacher of teachers) {
    var _tags = [];
    for (let tag of tags) {
      if (tag.associe_a === teacher.id_utilisateur) _tags.push(tag);
    }
    teacher.tags = _tags;
  }
  return teachers;
}
//
//
//Important

export function presidentCheckBox(selected, setSelected, id) {
  var _selected = [...selected];
  if (_selected.indexOf(id) < 0) _selected.push(id);
  else _selected = _selected.filter((el) => el !== id);

  setSelected(_selected);
}

export function isPresident(selected, id) {
  return selected.indexOf(id) > -1;
}

export function projectCheckBox(selected, setSelected, id) {
  var _selected = [...selected];
  if (_selected.indexOf(id) < 0) _selected.push(id);
  else _selected = _selected.filter((el) => el !== id);

  setSelected(_selected);
}

export function isProjectSel(selected, id) {
  return selected.indexOf(id) > -1;
}

export function selectAllProjects(selected, setSelected, projects) {
  if (selected.length > 0) setSelected([]);
  else setSelected(projects.map((el) => el.id_sujet));
}

function getAssignedProjects() {
  const state = store.getState();
  const projects = state.projects.dataArray;
  const assigned = projects.filter((p) => p.affecte_a.length > 0);

  return assigned;
}

export function createSoutenances(data) {
  console.log("soutenancesLogic" + "createSoutenances");
  var projects = [...data.selectedProjects];
  const { startDate, endDate, maxCrenaux, sales, presidents } = data;
  var soutenances = [];

  //Creating soutenances
  for (let p of projects) {
    const project = getProject(p);
    var invite = [{ ...getUserByID(project.enc_prim), role: "encadrant" }];
    if (project.enc_sec)
      invite.push({ ...getUserByID(project.enc_sec), role: "encadrant" });

    const sout = {
      id_soutenance: uuid(),
      id_sujet: p,
      date: "",
      crenau: 0,
      invite,
    };
    soutenances.push(sout);
  }

  soutenances = assignSalesToSoutenances(
    soutenances,
    sales,
    maxCrenaux,
    startDate,
    endDate
  );
  // soutenances = assignTeachers(soutenances);
  return soutenances;
}

function assignSalesToSoutenances(
  soutenances,
  sales,
  maxCrenaux,
  startDate,
  endDate
) {
  console.log("soutenancesLogic" + "assignSalesToTechaers");

  const _sales = sales.replace(" ", "").split(",");
  var currentDate = new Date(startDate);
  var _endDate = new Date(endDate);
  var currentCrenau = 1;
  var currentSale = 0;
  var soutenances = [...soutenances];
  for (let s of soutenances) {
    s.sale = _sales[currentSale];
    s.date = currentDate.toLocaleDateString();
    s.crenau = currentCrenau;

    currentSale++;
    if (currentSale === _sales.length) {
      currentSale = 0;
      currentCrenau++;
      if (currentCrenau > maxCrenaux) {
        currentCrenau = 1;
        currentDate.setDate(currentDate.getDate() + 1);
        if (currentDate.getDate() > _endDate.getDate()) {
          alert("Dates insuffisants");
          return soutenances;
        }
      }
    }
  }

  alert("sales assigned");
  return soutenances;
}

export function getUser(id) {
  const state = store.getState();
  const user = state.users.all.find((u) => u.id_utilisateur === id);
  return user;
}

export function getProject(id) {
  const state = store.getState();
  const project = state.projects.dataArray.find((p) => p.id_sujet === id);
  return project;
}

export function getDays(soutenances) {
  const state = store.getState();
  const { startDate, maxCrenaux } = state.soutenance.values;

  var days = [];
  for (var i = 0; i < soutenances.length / maxCrenaux; i++) {
    var date = new Date(startDate);
    date.setDate(date.getDate() + i);
    days.push(date.toLocaleDateString());
  }
  return days;
}

export function getCrenaux(soutenances) {
  var crenaux = [];
  for (let s of soutenances)
    if (crenaux.indexOf(s.crenau) < 0) crenaux.push(s.crenau);

  return crenaux;
}

export function getSoutenanceAvailable(soutenance) {
  console.log("soutenancesLogic" + " getSoutenanceAvailable");
  const state = store.getState();
  var soutenances = [...state.soutenance.soutenances];
  var teachers = state.soutenance.teachers;
  const selected = state.soutenance.values.selectedTeachers;
  const presidents = state.soutenance.values.presidents;
  teachers = teachers.filter((t) => selected.indexOf(t.id_utilisateur) > -1);

  var notAvailable = [];
  var _teachers = [];

  for (let s of soutenances) {
    if (s.date === soutenance.date && s.crenau === soutenance.crenau)
      for (let i of s.invite)
        if (notAvailable.indexOf(i.id_utilisateur) < 0)
          notAvailable.push(i.id_utilisateur);
  }
  for (let t of teachers) {
    //check if teacher has matched tags
    t = { ...t, matched: getMatchedTags(soutenance.id_sujet, t) };
    //check if teacher has matched date
    t = { ...t, matchedDate: getMatchedDates(soutenance, t) };
    //check if teacher can be president
    if (presidents.indexOf(t.id_utilisateur) > -1)
      t = { ...t, president: true };
    if (notAvailable.indexOf(t.id_utilisateur) > -1)
      _teachers.push({ ...t, isAvailable: false });
    else {
      _teachers.push({ ...t, isAvailable: true });
    }
  }

  return _teachers;
}

function getMatchedTags(projectId, teacher) {
  const project = getProjectByID(projectId);
  var matched = [];

  for (let tTag of teacher.tags)
    for (let pTag of project.tags)
      if (
        matched.indexOf(tTag.id_tag) < 0 &&
        (tTag.id_tag.toLowerCase().indexOf(pTag.id_tag.toLowerCase()) > -1 ||
          pTag.id_tag.toLowerCase().indexOf(tTag.id_tag.toLowerCase()) > -1)
      )
        matched.push(tTag.id_tag);

  return matched;
}

function getMatchedDates(soutenance, teacher) {
  var matchedDate = false;
  for (let i = 0; i < teacher.dates.length; i++) {
    const dates = teacher.dates;
    const tDate = new Date(dates[i].date).toLocaleDateString();
    const sDate = new Date(soutenance.date).toLocaleDateString();
    const crenaux = dates[i].crenaux
      ? dates[i].crenaux.split(",").map((c) => Number(c))
      : [];
    console.log("----------");
    console.log(tDate);
    console.log(sDate);
    console.log(crenaux);
    if (tDate === sDate && crenaux.indexOf(soutenance.crenau) > -1) {
      matchedDate = true;
      console.log(soutenance.date + " -- " + soutenance.crenau);
      break;
    }
  }
  return matchedDate;
}

export const assignTeachers = (strictTags, strictDates) => {
  console.log("soutenancesLogic" + " assignTeachers");
  const state = store.getState();
  var soutenances = [...state.soutenance.soutenances];
  var teachers = state.soutenance.teachers;
  const presidents = state.soutenance.values.presidents;
  const selected = state.soutenance.values.selectedTeachers;
  teachers = teachers.filter((t) => selected.indexOf(t.id_utilisateur) > -1);

  var feedback = [];
  for (let s of soutenances) {
    //for feedback
    var missing = [];

    //assign president
    if (!s.invite.find((invite) => invite.role === "président")) {
      var available = getSoutenanceAvailable(s);
      // apply filters here
      if (strictTags)
        available = available.filter((av) => av.matched.length > 0);
      if (strictDates) available = available.filter((av) => av.matchedDate);
      // end filters
      for (let i = 0; i < available.length; i++) {
        if (
          available[i].isAvailable &&
          presidents.indexOf(available[i].id_utilisateur) > -1
        ) {
          s.invite.push({ ...available[i], role: "président" });
          break;
        } else {
          if (i === available.length - 1) missing.push(1);
        }
      }
    }
    //assign rapporteur
    if (!s.invite.find((invite) => invite.role === "rapporteur")) {
      var available = getSoutenanceAvailable(s);
      // apply filters here
      if (strictTags)
        available = available.filter((av) => av.matched.length > 0);
      if (strictDates) available = available.filter((av) => av.matchedDate);
      // end filters
      for (let i = 0; i < available.length; i++) {
        if (available[i].isAvailable) {
          s.invite.push({ ...available[i], role: "rapporteur" });
          break;
        } else {
          if (i === available.length - 1) missing.push(2);
        }
      }
    }

    //feedback
    if (missing.length > 0) {
      feedback.push({ soutenance: s, missing });
    }
  }

  store.dispatch({ type: "SET_SOUTENANCES", payload: soutenances });
  return feedback;
};

export function assignSingleTeacher(
  soutenance,
  teacher,
  role,
  calledByUser = true
) {
  console.log("soutenancesLogic" + "assignSingleTeacher");
  if (calledByUser) {
    var sout = { ...soutenance };
    sout.invite = sout.invite.filter((u) => u.role !== role);
    sout.invite = [...sout.invite, { ...teacher, role }];
    store.dispatch({ type: "UPDATE_SOUTENANCE", payload: sout });
  }
}

export function equalizeCrenaux() {
  const state = store.getState();
  var soutenances = state.soutenance.soutenances;
  var lastCrenau = 0;
  var days = {};

  for (let s of soutenances)
    days = { ...days, [s.date]: days[s.date] + 1 || 1 };

  for (let i = 0; i < Object.keys(days).length; i++)
    console.log("soutenancesLogic" + days);
}

export function filterByDates(byDaysOnly = false) {
  const state = store.getState();
  var soutenances = [...state.soutenance.soutenances];
  var dates = state.soutenance.dates;

  for (let soutenance of soutenances) {
    if (byDaysOnly)
      soutenance = {
        ...soutenance,
        available: soutenance.available.map(
          (el) =>
            (el = {
              ...el,
              isAvailable:
                dates.filter(
                  (date) =>
                    el.id_utilisateur === date.id_utilisateur &&
                    new Date(date.jour).toLocaleDateString() ===
                      new Date(soutenance.date).toLocaleDateString()
                ).length > 0,
            })
        ),
      };
    else
      soutenance = {
        ...soutenance,
        available: soutenance.available.map(
          (el) =>
            (el = {
              ...el,
              isAvailable:
                dates.filter(
                  (date) =>
                    el.id_utilisateur === date.id_utilisateur &&
                    new Date(date.jour).toLocaleDateString() ===
                      new Date(soutenance.date).toLocaleDateString() &&
                    date.crenaux
                      .replace(" ", "")
                      .split(",")
                      .indexOf(soutenance.crenau.toString()) > -1
                ).length > 0,
            })
        ),
      };
    store.dispatch({ type: "UPDATE_SOUTENANCE", payload: soutenance });
  }
}

export function filterByTagsDates(byDaysOnly = false) {
  const state = store.getState();
  var soutenances = [...state.soutenance.soutenances];
  var tags = state.soutenance.tags;

  for (let soutenance of soutenances) {
    if (byDaysOnly)
      soutenance = {
        ...soutenance,
        available: soutenance.available.map(
          (el) =>
            (el = {
              ...el,
              isAvailable:
                tags.filter(
                  (tag) =>
                    el.id_utilisateur === tag.associe_a &&
                    getProject(soutenance.id_sujet).tags.filter((t) =>
                      t.id_tag.toLowerCase().indexOf(tag.toLowerCase())
                    ).length > 0
                ).length > 0,
            })
        ),
      };
    store.dispatch({ type: "UPDATE_SOUTENANCE", payload: soutenance });
  }
}

export function checkSoutenanceValid(soutenance) {
  return (
    soutenance.invite.filter(
      (i) => i.role === "président" || i.role === "rapporteur"
    ).length > 1
  );
}

export function checkMultipleSoutenanceValid(soutenances) {
  for (let s of soutenances) {
    var length =
      s.invite.filter((i) => i.role === "président" || i.role === "rapporteur")
        .length > 1;
    if (!length) return false;
  }
  return true;
}

export function setSoutenanceInvited(soutenance) {
  const project = getProject(soutenance.id_sujet);
  var temp = soutenance;
  if (project.enc_prim)
    temp.invite = [
      ...temp.invite,
      { ...getUserByID(project.enc_prim), role: "encadrant" },
    ];
  if (project.enc_sec)
    temp.invite = [
      ...temp.invite,
      { ...getUserByID(project.enc_sec), role: "encadrant" },
    ];
  if (project.id_etudiant)
    temp.invite = [
      ...temp.invite,
      { ...getUserByID(project.entudiant), role: "etudiant" },
    ];
  if (project.id_etudiant_2)
    temp.invite = [
      ...temp.invite,
      { ...getUserByID(project.etudiant_2), role: "etudiant" },
    ];
  for (let aff of project.affecte_a)
    temp.invite = [
      ...temp.invite,
      { ...getUserByID(aff.id_utilisateur), role: "etudiant" },
    ];

  store.dispatch({ type: "UPDATE_SOUTENANCE", payload: temp });
}

export function setSoutenanceSale(soutenance, sale = null) {
  const state = store.getState();
  var soutenances = state.soutenance.soutenances;
  var sales = state.soutenance.values.sales.replace(" ", "").split(",");
  var temp = soutenance;

  if (sale) {
    var neighbors = soutenances.filter(
      (s) => s.date === temp.date && s.crenau === temp.crenau
    );
    for (let s of neighbors) {
      if (s.sale === sale) s.sale = "";
      store.dispatch({ type: "UPDATE_SOUTENANCE", payload: s });
    }

    temp.sale = sale;
    store.dispatch({ type: "UPDATE_SOUTENANCE", payload: temp });
  }
}

export const teachersStatistics = () => {
  const state = store.getState();
  const soutenances = state.soutenance.soutenances;
  var teachers = {};

  for (let s of soutenances)
    for (let i of s.invite)
      teachers = { ...teachers, [i.nom]: teachers[i.nom] + 1 || 1 };

  console.log(teachers);
};

export function saveSoutenances() {
  store.dispatch({ type: "OPEN_BACKDROP" });
  const state = store.getState();
  const soutenances = state.soutenance.soutenances;
  var inviteForDB = [];
  var soutenanceForDB = [];
  for (let s of soutenances) {
    for (let i of s.invite)
      inviteForDB.push({
        id_utilisateur: i.id_utilisateur,
        id_soutenance: s.id_soutenance,
        role: i.role,
      });
    soutenanceForDB.push({
      id_soutenance: s.id_soutenance,
      id_sujet: s.id_sujet,
      date: s.date,
      crenau: s.crenau,
      sale: s.sale,
    });
  }

  saveToDatabase(soutenanceForDB, inviteForDB)
    .then((res) => {
      if (res.status === 200) {
        store.dispatch({
          type: "OPEN_SNACK",
          payload: { message: "Soutenances enrégistrées", type: "success" },
        });
      }
    })
    .catch((err) => console.error(err));
}

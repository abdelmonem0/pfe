import { store } from "../../../index";

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
        _dates.push({ date: date.id_date, crenaux: date.crenaux });
    }
    teacher.dates = _dates;
  }
  return teachers;
}

export function assignTeachersToProjects(data, strictMatch) {
  console.log(data);
  var projects = [...data.projects];
  var teachers = [...data.teachers];

  var combined = [];
  for (let proj of projects) {
    proj.potential = [];
    var encadrants = [proj.enc_prim];
    if (proj.enc_sec) encadrants.push(proj.enc_sec);

    for (let teach of teachers) {
      var matched = [];
      for (let tagP of proj.tags) {
        const pTag = tagP.id_tag.toLowerCase().replace(" ", "");
        for (let tagT of teach.tags) {
          const tTag = tagT.id_tag.toLowerCase().replace(" ", "");
          // get matched tags by index of
          if (!strictMatch) {
            if (
              (pTag.indexOf(tTag) > -1 || tTag.indexOf(pTag)) > -1 &&
              matched.indexOf(pTag) < 0
            )
              matched.push(pTag);
          } // get matched tags by STRICT equality
          else {
            if (pTag === tTag && matched.indexOf(pTag) < 0) matched.push(pTag);
          }
        }
      }
      if (matched.length > 0) {
        proj = {
          ...proj,
          potential: [
            ...proj.potential,
            { id_utilisateur: teach.id_utilisateur, tags: matched },
          ],
        };
      }
    }
    // if (proj.potential.length > 0)
    combined.push({
      id_sujet: proj.id_sujet,
      encadrants,
      potential: proj.potential,
    });
  }

  return combined;
}

export function assignTeachersToCrenaux(teachers) {
  const state = store.getState();
  const dates = state.soutenance.dates;

  for (let teach of teachers) {
    teach.dates = [];
    for (let date of dates) {
      if (date.id_utilisateur === teach.id_utilisateur)
        teach.dates = [...teach.dates, date];
    }
  }

  var combined = [];
  for (let teach1 of teachers) {
    var matched = [];
    teach1.matched = [];

    for (let teach2 of teachers) {
      var days = [];
      if (teach1.id_utilisateur !== teach2.id_utilisateur) {
        // check matched date
        for (let date1 of teach1.dates) {
          var crenaux = [];
          for (let date2 of teach2.dates) {
            if (date1.jour === date2.jour) {
              //check matched crenaux

              for (let c1 of date1.crenaux.split(",")) {
                for (let c2 of date2.crenaux.split(",")) {
                  if (c1 === c2 && c1 !== "" && crenaux.indexOf(c1) < 0) {
                    crenaux.push(c1);
                  }
                }
              }
            }
          }
          if (crenaux.length > 0) {
            days.push({ day: date1.jour, crenaux });
          }
        }
        if (days.length > 0) {
          matched.push({ id_utilisateur: teach2.id_utilisateur, days });
        }
      }
    }
    if (matched.length > 0) {
      teach1 = { ...teach1, matched: matched };
      combined.push(teach1);
    }
  }

  console.log(combined);
  return combined;
}

export function createSoutenances(data) {
  var teachers = [...data.selectedTeachers];
  var projects = [...data.selectedProjects];
  const { startDate, endDate, maxCrenaux, sales, presidents } = data;
  var soutenances = [];

  //Creating soutenances
  for (let p of projects) {
    const sout = {
      sujet: p,
      date: "",
      crenau: 0,
      invite: p.encadrants.map((enc) => {
        return { id_utilisateur: enc, role: "encadrant" };
      }),
    };
    soutenances.push(sout);
  }
  alert(
    "projects: " + projects.length + " - soutenances: " + soutenances.length
  );

  soutenances = assignSalesToSoutenances(
    soutenances,
    sales,
    maxCrenaux,
    startDate,
    endDate
  );
  soutenances = assignePresidentsToSoutenance(
    soutenances,
    teachers,
    presidents
  );

  return soutenances;
}

function assignSalesToSoutenances(
  soutenances,
  sales,
  maxCrenaux,
  startDate,
  endDate
) {
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
        alert(currentDate.toLocaleDateString());
        if (currentDate.getDate() > _endDate.getDate()) {
          alert("Dates insuffisants");
          return soutenances;
        }
      }
    }
  }

  console.log(soutenances);
  return soutenances;
}

function assignePresidentsToSoutenance(soutenances, teachers, presidents) {
  var _teachers = teachers.map((id) => {
    return { id_utilisateur: id, soutenances: [] };
  });
  var _soutenances = [...soutenances];

  for (let s of _soutenances) {
    // assign the soutenance to encadrants
    for (let t of _teachers) {
      if (s.sujet.encadrants.indexOf(t.id_utilisateur) > -1)
        t.soutenances = [...t.soutenances, s];
    }
    assignPresident(s, _teachers, presidents);
    assignRapporteur(s, _teachers, presidents);
  }

  console.log(_teachers);
  console.log(_soutenances.map((s) => s.invite));
  return { soutenances: _soutenances, teachers: _teachers };
}

// function assignSoutToTeacher(id, teachers) {
//   var teacher = teachers.find((t) => t.id_utilisateur === id);
//   teacher.soutenances = teacher.soutenances + 1 || 1;
// }

//function choosePresident(teachers, presidents) {}

function canBeAssigned(teacher, soutenance) {
  // teacher is not encadrant
  for (let invite of soutenance.invite)
    if (invite && invite.id_utilisateur === teacher.id_utilisateur)
      return false;

  //teacher is assigned in the same date and crenau
  const currentCrenau = soutenance.crenau;
  const currentDate = soutenance.date;
  for (let s of teacher.soutenances) {
    if (
      new Date(s.date).getDate() === new Date(currentDate).getDate() &&
      s.crenau === currentCrenau
    )
      return false;
  }
  return true;
}

function canBeAssignedAsPresident(teacher, presidents) {
  return presidents.indexOf(teacher.id_utilisateur) > -1;
}

function canBeAssignedAsRapporteur(teacher, presidents = []) {
  if (presidents.length > 0)
    return presidents.indexOf(teacher.id_utilisateur) < 0;

  return true;
}

function assignPresident(soutenance, teachers, presidents) {
  var president = undefined;
  for (let teach of soutenance.sujet.potential) {
    var _teacher = teachers.find(
      (t) => t.id_utilisateur === teach.id_utilisateur
    );
    if (
      canBeAssigned(_teacher, soutenance) &&
      canBeAssignedAsPresident(_teacher, presidents)
    ) {
      soutenance.invite = [
        ...soutenance.invite,
        { id_utilisateur: teach.id_utilisateur, role: "président" },
      ];
      president = teachers.find(
        (t) => t.id_utilisateur === teach.id_utilisateur
      );
      president.soutenances = [...president.soutenances, soutenance];
      return;
    }
  }
  var soutNumber = teachers[0].soutenances.length;
  for (let teach of teachers) {
    var _teacher = teachers.find(
      (t) => t.id_utilisateur === teach.id_utilisateur
    );
    if (teach.soutenances.length <= soutNumber)
      if (
        canBeAssigned(_teacher, soutenance) &&
        canBeAssignedAsPresident(_teacher, presidents)
      ) {
        president = teach;
        soutNumber = _teacher.soutenances.length;
      }
  }
  if (president) {
    soutenance.invite = [
      ...soutenance.invite,
      { id_utilisateur: president.id_utilisateur, role: "président" },
    ];
    president = teachers.find(
      (t) => t.id_utilisateur === president.id_utilisateur
    );
    president.soutenances = [...president.soutenances, soutenance];
  } else alert("nombre des enseignants insuffisant (president)");
}

function assignRapporteur(soutenance, teachers, presidents) {
  var president = undefined;
  for (let teach of soutenance.sujet.potential) {
    var _teacher = teachers.find(
      (t) => t.id_utilisateur === teach.id_utilisateur
    );
    if (
      canBeAssigned(_teacher, soutenance) &&
      canBeAssignedAsRapporteur(_teacher, presidents)
    ) {
      soutenance.invite = [
        ...soutenance.invite,
        { id_utilisateur: teach.id_utilisateur, role: "rapporteur" },
      ];
      president = teachers.find(
        (t) => t.id_utilisateur === teach.id_utilisateur
      );
      president.soutenances = [...president.soutenances, soutenance];
      return;
    }
  }
  var soutNumber = teachers[0].soutenances.length;
  for (let teach of teachers) {
    var _teacher = teachers.find(
      (t) => t.id_utilisateur === teach.id_utilisateur
    );
    if (teach.soutenances.length <= soutNumber)
      if (
        canBeAssigned(_teacher, soutenance) &&
        canBeAssignedAsRapporteur(_teacher)
      ) {
        president = teach;
        soutNumber = _teacher.soutenances.length;
      }
  }
  if (president) {
    soutenance.invite = [
      ...soutenance.invite,
      { id_utilisateur: president.id_utilisateur, role: "rapporteur" },
    ];
    president = teachers.find(
      (t) => t.id_utilisateur === president.id_utilisateur
    );
    president.soutenances = [...president.soutenances, soutenance];
  } else alert("nombre des enseignants insuffisant (rapporteur)");
}

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
  if (step > current) return { step, raison: "success" };

  if (values.selectedProjects.length > 0) step = 2;
  else {
    raison = "Il faut choisir des projets.";
    return { step, raison };
  }
  if (step > current) return { step, raison: "success" };

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

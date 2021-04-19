import React from "react";
import { useDispatch, useSelector } from "react-redux";

export function assignTagsToTeachers(listTeachers, listTags) {
  var _teachers = listTeachers;
  for (let teacher of _teachers) {
    var _tags = [];
    for (let tag of listTags) {
      if (teacher.id_utilisateur === tag.associe_a) _tags.push(tag);
    }
    teacher.tags = _tags;
  }

  return _teachers;
}
export function assignDatesToTeachers(teachers, dates) {
  var _teachs = [...teachers];
  for (let t of _teachs) {
    var prefs = [];
    for (let p of dates)
      if (t.id_utilisateur === p.id_utilisateur) prefs.push(p);
    t.dates = prefs;
  }
  return _teachs;
}

function Data(props) {
  const dispatch = useDispatch();
  var projects = useSelector((state) => state.projects);
  const users = useSelector((state) => state.users.all);
  const tags = useSelector((state) => state.soutenance.tags);
  const preferences = useSelector((state) => state.soutenance.preferences);
  var teachers = users.filter((el) => {
    return el.role === "enseignant";
  });

  function assignStudentsToProjects() {
    for (let proj of projects) {
      var etudiants = [];
      for (let user of users) {
        if (user.sujet_affecte === proj.id_sujet) etudiants.push(user);
      }
      proj.etudiants = etudiants;
    }
    projects = projects.filter((proj) => {
      return proj.etudiants.length > 0;
    });

    dispatch({ type: "SET_SOUTENANCE_PROJECTS", payload: projects });
    return projects;
  }

  function assignPotentialTeacherToProjects() {
    for (let project of projects) {
      var potential = [];
      for (let teacher of teachers) {
        var matched_tags = [];
        for (let project_tag of project.tags) {
          for (let teacher_tag of teacher.tags) {
            var p_TagNormalized = project_tag.id_tag
              .replace(" ", "")
              .toLowerCase();
            var t_TagNormalized = teacher_tag.id_tag
              .replace(" ", "")
              .toLowerCase();
            //matched tags
            if (
              p_TagNormalized === t_TagNormalized ||
              p_TagNormalized.indexOf(t_TagNormalized) != -1 ||
              t_TagNormalized.indexOf(p_TagNormalized) != -1
            ) {
              //set matched tags
              matched_tags.push(teacher_tag.id_tag);
            }
          }
        }
        //check if the teacher got a matched tag
        if (matched_tags.length > 0) potential.push({ teacher, matched_tags });
      }
      project.potential = potential;
    }
    console.log(projects);
    return projects;
  }

  projects = assignStudentsToProjects();
  teachers = assignTagsToTeachers(teachers, tags);
  projects = assignPotentialTeacherToProjects();
  return <div></div>;
}

export default Data;

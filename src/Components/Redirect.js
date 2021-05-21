import React, { useState } from "react";
import Etudiant from "./Etudiant";
import Enseignant from "./Enseignant";
import Membre from "./Membre";
import Admin from "./Admin";
import {
  getAllTags,
  getAllTeachersDates,
  getAvis,
  getCandidatures,
  getNotifications,
  getProjects,
  getTeacherDates,
  getUsers,
  getSoutenances,
} from "../functions";
import { useDispatch, useSelector } from "react-redux";
import President from "./President";
import { Project_States } from "../Constants";
import {
  assignTagsToTeachers,
  assignDatesToTeachers,
  willInitSoutenanceValues,
} from "./President/Soutenances/SoutenanceLogic";
import { setPages, setupSoutenances } from "./redirectLogic";

function Redirect(props) {
  const current = props.current;
  const role = current.role;
  const tags = useSelector((state) => state.soutenance.tags);
  const dates = useSelector((state) => state.soutenance.dates);
  const [allDone, setAllDone] = useState(false);
  const dispatch = useDispatch();

  const loadAllData = () => {
    getProjects()
      .then((res1) => {
        if (role === "etudiant") {
          const filtered = res1.data.filter(
            (p) => p.etat !== Project_States.refused
          );
          dispatch({ type: "SET_PROJECTS", payload: filtered });
        } else dispatch({ type: "SET_PROJECTS", payload: res1.data });
      })
      .then(() =>
        getCandidatures(props.current.id_utilisateur).then((res2) =>
          dispatch({ type: "SET_CANDIDATURES", payload: res2.data })
        )
      )
      .then(() =>
        getUsers().then((res3) =>
          dispatch({ type: "SET_USERS", payload: res3.data })
        )
      )
      .then(() => {
        if (role === "president") {
          if (willInitSoutenanceValues()) dispatch({ type: "SET_VALUES" });
          getAllTags()
            .then((result) =>
              dispatch({ type: "SET_TEACHERS_TAGS", payload: result.data })
            )
            .then(() =>
              getAllTeachersDates()
                .then((result) =>
                  dispatch({
                    type: "SET_TEACHERS_DATES",
                    payload: result.data,
                  })
                )
                .then(() => {
                  if (tags && dates) {
                    var teachers = assignTagsToTeachers();
                    teachers = assignDatesToTeachers();
                    dispatch({ type: "SET_TEACHERS", payload: teachers });
                  }
                })
            )
            .then(() =>
              getSoutenances().then((result) => setupSoutenances(result.data))
            );
        }
      })
      .then(() => {
        if (role === "membre" || role === "president")
          getAvis().then((result) =>
            dispatch({ type: "SET_AVIS", payload: result.data })
          );
      })
      .then(() =>
        getTeacherDates(props.current.id_utilisateur).then((result) =>
          dispatch({ type: "SET_DATES", payload: result.data })
        )
      )
      .then(() =>
        getNotifications(props.current.id_utilisateur).then((result) =>
          dispatch({ type: "SET_NOTIFICATIONS", payload: result.data })
        )
      )
      .then(() => {
        dispatch({ type: "CLOSE_BACKDROP" });
        setAllDone(true);
      })
      .catch((err) => console.error(err));
  };

  React.useEffect(() => {
    console.log("refetching");
    loadAllData();
    if (allDone) setPages(role);
  }, [allDone]);

  return allDone ? <UserType role={role} /> : <div>!allDone (Redirect.js)</div>;
}

const UserType = React.memo((props) => {
  switch (props.role) {
    case "etudiant":
      return <Etudiant />;
    case "enseignant":
      return <Enseignant />;
    case "membre":
      return <Membre />;
    case "admin":
      return <Admin />;
    case "president":
      return <President />;
    default:
      return <div>Default case from UserType (Redirect.js)</div>;
  }
});

export default Redirect;

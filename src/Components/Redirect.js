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
  getComments,
  getDates,
} from "../functions";
import { useDispatch, useSelector } from "react-redux";
import President from "./President";
import { Project_States } from "../Constants";
import {
  assignTagsToTeachers,
  assignDatesToTeachers,
  willInitSoutenanceValues,
} from "./President/Soutenances/SoutenanceLogic";
import {
  setPages,
  setupSoutenances,
  filterPrivateProjects,
} from "./redirectLogic";
import Loading from "./Loading";

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
        var filtered = res1.data;

        //dispatches projects
        filterPrivateProjects(filtered, current);
      })
      .then(() =>
        getComments().then((result) =>
          dispatch({ type: "SET_COMMENTS", payload: result.data })
        )
      )
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
      .then(() =>
        getDates().then((result) => {
          var temp = {};
          for (let date of result.data)
            temp = { ...temp, [date.id_date]: date.date };
          dispatch({ type: "SET_SAVED_DATES", payload: temp });
        })
      )
      .then(() =>
        getSoutenances().then((result) => setupSoutenances(result.data))
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

  return allDone ? <UserType role={role} /> : <Loading />;
}

const UserType = React.memo((props) => {
  switch (props.role) {
    case "etudiant":
      return <Etudiant />;
    case "enseignant":
      return <Enseignant />;
    case "membre":
      return <Enseignant />;
    case "admin":
      return <Admin />;
    case "president":
      return <President />;
    default:
      return <div>Default case from UserType (Redirect.js)</div>;
  }
});

export default Redirect;

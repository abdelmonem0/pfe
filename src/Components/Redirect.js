import React, { useState } from "react";
import Etudiant from "./Etudiant";
import Enseignant from "./Enseignant";
import Membre from "./Membre";
import Admin from "./Admin";
import {
  getAllTags,
  getCandidatures,
  getNotifications,
  getProjects,
  getUsers,
} from "../functions";
import { useDispatch } from "react-redux";
import President from "./President";

function Redirect(props) {
  const role = props.current.role;
  const [allDone, setAllDone] = useState(false);
  const dispatch = useDispatch();

  const loadAllData = () => {
    getProjects()
      .then((res1) => dispatch({ type: "SET_PROJECTS", payload: res1.data }))
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
        if (role === "president")
          getAllTags().then((result) =>
            dispatch({ type: "SET_TAGS", payload: result.data })
          );
      })
      .then(() =>
        getNotifications(props.current.id_utilisateur).then((result) =>
          dispatch({ type: "SET_NOTIFICATIONS", payload: result.data })
        )
      )
      .then(() => {
        dispatch({ type: "CLOSE_BACKDROP" });
        setAllDone(true);
      });
  };

  const setPages = () => {
    switch (role) {
      case "etudiant":
        dispatch({
          type: "SET_PAGES",
          payload: [
            { text: "Ajouter", link: "/ajouter" },
            { text: "Sujets", link: "/sujets" },
            { text: "Candidatures", link: "/candidatures" },
            { text: "Profile", link: "/profile" },
          ],
        });
        break;
      case "enseignant":
        dispatch({
          type: "SET_PAGES",
          payload: [
            { text: "Ajouter", link: "/ajouter" },
            { text: "Sujets", link: "/sujets" },
            { text: "Candidatures", link: "/candidatures" },
            { text: "Préférences", link: "/preferences" },
            { text: "Profile", link: "/profile" },
          ],
        });
        break;
      case "membre":
        dispatch({
          type: "SET_PAGES",
          payload: [
            { text: "Sujets", link: "/sujets" },
            { text: "Profile", link: "/profile" },
          ],
        });
        break;
      case "admin":
        dispatch({ type: "SET_PAGES", payload: [] });
        break;
      case "president":
        dispatch({
          type: "SET_PAGES",
          payload: [
            { text: "Sujets", link: "/sujets" },
            { text: "Profile", link: "/profile" },
            { text: "Soutenances", link: "/soutenances" },
            { text: "Enseignants", link: "/enseignants" },
          ],
        });
        break;
      default:
        break;
    }
  };

  const UserType = () => {
    switch (role) {
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
        return null;
    }
  };

  React.useEffect(() => {
    loadAllData();
    setPages();
  }, []);

  return allDone && <UserType />;
}

export default Redirect;

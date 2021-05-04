import React from "react";
import Teacher from "./TeacherBottom";
import Student from "./StudentBottom";
import { CardActions } from "@material-ui/core";
import { useSelector } from "react-redux";

function CandidatureBottom(props) {
  const { candidature } = props;
  const current = useSelector((state) => state.users.current);

  return (
    <div className="horizontal-list">
      {current.role === "etudiant" ? (
        <Student candidature={candidature} />
      ) : (
        <Teacher candidature={candidature} />
      )}
    </div>
  );
}

export default CandidatureBottom;

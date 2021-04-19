import { Button, Chip, TextField, Typography } from "@material-ui/core";
import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTeacherTags,
  deleteTeacherTag,
  getTeacherTags,
} from "../../../functions";

function Tags(props) {
  const [tagsValue, setTags] = useState("");
  const current = useSelector((state) => state.users.current);
  const tags = useSelector((state) => state.tags);
  const dispatch = useDispatch();

  const handletagsChange = (e) => {
    setTags(e.target.value);
  };

  function sendTags() {
    addTeacherTags(current.id_utilisateur, tagsValue.split(",")).then(() =>
      getTeacherTags(current.id_utilisateur).then((result) =>
        dispatch({ type: "SET_TAGS", payload: result.data })
      )
    );
  }

  useEffect(
    () =>
      getTeacherTags(current.id_utilisateur).then((result) =>
        dispatch({ type: "SET_TAGS", payload: result.data })
      ),
    []
  );

  function deleteTag(tag) {
    deleteTeacherTag(current.id_utilisateur, tag).then(() =>
      getTeacherTags(current.id_utilisateur).then((result) =>
        dispatch({ type: "SET_TAGS", payload: result.data })
      )
    );
  }

  return (
    <div style={{ display: "flex", flex: "1 1 100%" }}>
      <div style={{ flex: "1 1 50%" }}>
        <Typography>Ajouter des tags</Typography>
        <TextField
          fullWidth
          variant="outlined"
          label="tags"
          placeholder=""
          onChange={(e) => handletagsChange(e)}
        />
        <Typography>{tagsValue}</Typography>
        <Button variant="outlined" color="primary" onClick={() => sendTags()}>
          Ajouter
        </Button>
      </div>
      <div style={{ flex: "1 1 50%" }}>
        <Typography>Vos spacialités</Typography>
        <ViewTags tags={tags} deleteTag={deleteTag} />
      </div>
    </div>
  );
}

export default Tags;

const ViewTags = (props) => {
  const { tags, deleteTag } = props;
  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      {tags.map((tag) => (
        <Chip label={tag.id_tag} onDelete={() => deleteTag(tag.id_tag)} />
      ))}
    </div>
  );
};

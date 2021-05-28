import { Button, Chip, TextField, Typography } from "@material-ui/core";
import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTeacherTags,
  deleteTeacherTag,
  getAllTags,
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

  const sendTags = () => {
    var tags_ = tagsValue
      .split(",")
      .map((t) => t.trim().replace(/\s/g, " "))
      .filter((t) => t.length > 0);

    for (let st of tags) {
      for (let nt of tags_)
        if (
          st.id_tag.toLowerCase().replace(/\s/g, "") ===
          nt.toLowerCase().replace(/\s/g, "")
        )
          tags_ = tags_.filter(
            (t) =>
              t.toLowerCase().replace(/\s/g, "") !==
              st.id_tag.toLowerCase().replace(/\s/g, "")
          );
    }
    if (tags_.length === 0) {
      dispatch({
        type: "OPEN_SNACK",
        payload: {
          message: "Pas de nouveaux tags à ajouter.",
          type: "warning",
        },
      });
      setTags("");
      return;
    }

    addTeacherTags(current.id_utilisateur, tags_).then(() =>
      getTeacherTags(current.id_utilisateur).then((result) => {
        dispatch({ type: "SET_TAGS", payload: result.data });
        dispatch({
          type: "OPEN_SNACK",
          payload: {
            message: tags_.length + " tags enrégistrés avec succès.",
            type: "success",
          },
        });
      })
    );
    setTags("");
  };

  useEffect(
    () =>
      getTeacherTags(current.id_utilisateur).then((result) =>
        dispatch({ type: "SET_TAGS", payload: result.data })
      ),
    []
  );

  function deleteTag(tag) {
    deleteTeacherTag(current.id_utilisateur, tag).then(() =>
      getTeacherTags(current.id_utilisateur).then((result) => {
        dispatch({ type: "SET_TAGS", payload: result.data });
        dispatch({
          type: "OPEN_SNACK",
          payload: { message: "Tag supprimé", type: "success" },
        });
      })
    );
  }

  return (
    <>
      <div className="vertical-list">
        <div>
          <Typography>Ajouter des tags</Typography>
          <div
            className="horizontal-list wrap"
            style={{ alignItems: "flex-start" }}
          >
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              label="Tags"
              value={tagsValue}
              placeholder="Séparez chaque tag par un virgule. Un tag ne peut pas dépasser 100 characères."
              onChange={(e) => handletagsChange(e)}
              helperText={
                (tagsValue.length > 0 &&
                  tagsValue
                    .replace(/\s/g, "")
                    .split(",")
                    .filter((t) => t.length > 0).length + " tag") ||
                ""
              }
            />
            <Button variant="outlined" color="primary" onClick={sendTags}>
              Ajouter
            </Button>
          </div>
        </div>
        {(tags.length > 0 && (
          <>
            <Typography>Vos spacialités</Typography>
            <div className="horizontal-list wrap">
              <ViewTags tags={tags} deleteTag={deleteTag} />
            </div>
          </>
        )) || (
          <Typography color="textSecondary">
            Vous n'avez pas des tags enrégistrés.
          </Typography>
        )}
      </div>
      {/* <TagsScroll /> */}
    </>
  );
}

export default Tags;

const ViewTags = (props) => {
  const { tags, deleteTag } = props;
  return (
    <div className="horizontal-list wrap">
      {tags.map((tag) => (
        <Chip label={tag.id_tag} onDelete={() => deleteTag(tag.id_tag)} />
      ))}
    </div>
  );
};

const TagsScroll = () => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    getAllTags().then((result) => setTags(result.data));
  });

  return (
    <div className="horizontal-list scrolling-tag">
      {tags.map((tag, index) => (
        <Chip label={tag.id_tag} key={index} />
      ))}
    </div>
  );
};

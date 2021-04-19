import {
  Chip,
  Collapse,
  IconButton,
  Paper,
  Typography,
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function FiltreProjects(props) {
  const [expand, setExpand] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const projects = useSelector((state) => state.projects);
  var initProjects = undefined;

  const dispatch = useDispatch();

  function getTags() {
    var tagsArray = [];
    projects.forEach((proj) => (tagsArray = tagsArray.concat(proj.tags)));
    return tagsArray;
  }
  const tags = getTags();

  function handleTagClick(tag) {
    if (selectedTags.indexOf(tag) === -1)
      setSelectedTags([...selectedTags, tag.id_tag]);
    else
      setSelectedTags(
        selectedTags.filter((el) => {
          return el !== tag.id_tag;
        })
      );

    filterByTag();
  }

  function tagIsSelected(tag) {
    return selectedTags.indexOf(tag) !== -1;
  }

  function filterByTag() {
    var filtered = initProjects.filter((el) => {
      return (
        el.tags.filter((el1) => {
          return selectedTags.indexOf(el1.id_tag) !== -1;
        }).length > 0
      );
    });

    if (filtered.length > 0)
      dispatch({ type: "SET_PROJECTS", payload: filtered });
  }

  return (
    <Paper>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Typography variant="h6">Filtrer les sujets</Typography>
        <IconButton onClick={() => setExpand(!expand)}>
          {expand ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </div>
      <Collapse in={expand}>
        <div>
          <Typography>Par categories</Typography>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {tags.map((tag) => (
              <Chip
                color={tagIsSelected(tag.id_tag) ? "primary" : "default"}
                variant={tagIsSelected(tag.id_tag) ? "default" : "outlined"}
                onClick={() => handleTagClick(tag)}
                size="small"
                label={tag.id_tag}
              />
            ))}
          </div>
        </div>
      </Collapse>
    </Paper>
  );
}

export default FiltreProjects;

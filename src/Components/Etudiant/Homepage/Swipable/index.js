import { Paper, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Swipable(props) {
  const projects = useSelector((state) => state.projects.dataArray);
  const [index, setIndex] = useState(0);

  const handleIndex = () => {
    var i = index + 1;
    if (i === projects.length) i = 0;
    setIndex(i);
  };

  function load() {
    for (var i = 1; i < 10; i++)
      setTimeout(() => {
        handleIndex();
        load();
        if (i === 10) i = 1;
      }, i * 3000);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Paper style={{ ...props.style }}>
      <Typography>{projects[index].titre}</Typography>
    </Paper>
  );
}

export default Swipable;

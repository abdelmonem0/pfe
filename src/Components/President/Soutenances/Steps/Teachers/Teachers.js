import {
  Checkbox,
  Chip,
  Collapse,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendReminderForTeachersNotifications } from "../../../../../Notifications";
import { isPresident, presidentCheckBox } from "../../SoutenanceLogic";
import TableToolbar from "./TableToolbar";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function Teachers(props) {
  const {
    selectedTeachers,
    setSelectedTeachers,
    presidents,
    setPresidents,
  } = props;
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  var teachers = useSelector((state) => state.soutenance.teachers);
  const tags = useSelector((state) => state.soutenance.tags);
  const dates = useSelector((state) => state.soutenance.dates);
  const [showTags, setShowTags] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const classes = useRowStyles();

  const sliceStart =
    page * rowsPerPage < teachers.length ? page * rowsPerPage : 0;
  const sliceEnd =
    page * rowsPerPage + rowsPerPage < teachers.length
      ? page * rowsPerPage + rowsPerPage
      : teachers.length;

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSelectTeacher = (id) => {
    if (selectedTeachers.indexOf(id) === -1) {
      setSelectedTeachers([...selectedTeachers, id]);
    } else {
      setSelectedTeachers(selectedTeachers.filter((st) => st !== id));
    }
  };

  const handlePresidentCheckBox = (id) => {
    const temp = presidentCheckBox(selectedTeachers, id);
    setSelectedTeachers(temp);
  };

  const handleSelectAllTeachers = () => {
    if (selectedTeachers.length === teachers.length) {
      setSelectedTeachers([]);
      return;
    }
    var selected = [];
    for (let teacher of teachers) selected.push(teacher.id_utilisateur);

    setSelectedTeachers(selected);
  };

  const selectTeachersWithoutTags = () => {
    var _selected = [];
    for (let t of teachers)
      if (t.tags.length < 1 && selectedTeachers.indexOf(t) < 0)
        _selected.push(t.id_utilisateur);

    setSelectedTeachers(_selected);
  };

  const selectTeachersWithoutDates = () => {
    var _selected = [];
    for (let t of teachers)
      if (t.dates.length < 1 && selectedTeachers.indexOf(t) < 0)
        _selected.push(t.id_utilisateur);

    setSelectedTeachers(_selected);
  };

  function notify(isForTags) {
    sendReminderForTeachersNotifications(
      users.current,
      selectedTeachers,
      isForTags
    )
      .then(() => {
        var message = isForTags
          ? "Notifications pour spécialités envoyés"
          : "Notifications pour dates envoyés";
        dispatch({
          type: "OPEN_SNACK",
          payload: { open: true, message, type: "success" },
        });
      })
      .catch((err) => console.error(err));
  }

  return (
    <div style={{ flex: "1" }}>
      <TableContainer component="div">
        <TableToolbar
          notify={notify}
          selected={selectedTeachers}
          presidents={presidents}
          setShowTags={setShowTags}
          showTags={showTags}
          selectTeachersWithoutTags={selectTeachersWithoutTags}
          selectTeachersWithoutDates={selectTeachersWithoutDates}
          setSelectedTeachers={setSelectedTeachers}
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedTeachers.length > 0 &&
                    selectedTeachers.length < teachers.length
                  }
                  checked={
                    teachers.length > 0 &&
                    selectedTeachers.length === teachers.length
                  }
                  onChange={() => handleSelectAllTeachers()}
                />
              </TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Président</TableCell>
              <TableCell># spécialités</TableCell>
              <TableCell>Préférances</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.slice(sliceStart, sliceEnd).map((teacher) => (
              <React.Fragment>
                <TableRow className={classes.root} role="checkbox">
                  <TableCell padding="checkbox">
                    <Checkbox
                      onChange={() =>
                        handleSelectTeacher(teacher.id_utilisateur)
                      }
                      checked={
                        selectedTeachers.indexOf(teacher.id_utilisateur) > -1
                      }
                    />
                  </TableCell>
                  <TableCell
                    onClick={() => handleSelectTeacher(teacher.id_utilisateur)}
                  >
                    {teacher.nom}
                  </TableCell>
                  <TableCell style={{ paddingTop: 0, paddingBottom: 0 }}>
                    <Checkbox
                      checked={isPresident(presidents, teacher.id_utilisateur)}
                      onChange={() => {
                        presidentCheckBox(
                          presidents,
                          setPresidents,
                          teacher.id_utilisateur
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {teacher.tags.length > 0 ? (
                      <Chip
                        size="small"
                        variant="outlined"
                        color="primary"
                        label={"Validé (" + teacher.tags.length + ")"}
                      />
                    ) : (
                      <Chip
                        size="small"
                        color="secondary"
                        label="Non definit"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {teacher.dates.length > 0 ? (
                      <Chip
                        size="small"
                        variant="outlined"
                        color="primary"
                        label={"Validé (" + teacher.dates.length + ")"}
                      />
                    ) : (
                      <Chip
                        size="small"
                        color="secondary"
                        label="Non definit"
                      />
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell padding="checkbox" />
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={5}
                  >
                    <Collapse in={showTags}>
                      <div
                        style={{
                          paddingBottom: "1rem",
                          display: "flex",
                          gap: "0.5rem",
                        }}
                      >
                        {teacher.tags.map((tag) => (
                          <Chip
                            variant="outlined"
                            size="small"
                            label={tag.id_tag}
                          />
                        ))}
                      </div>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[6, 10, 20, 50]}
        component="div"
        count={teachers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default Teachers;

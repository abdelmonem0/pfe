import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSoutenancesDates,
  getTeacherDates,
  saveTeacherDates,
} from "../../../functions";
import {
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@material-ui/core";

const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

function Dates(props) {
  const dispatch = useDispatch();
  const current = useSelector((state) => state.users.current);
  const fetchedDates = useSelector((state) => state.dates);
  const [dates, setDates] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [selectedDates, setSelectedDates] = useState(
    normalizeFetchedDates(fetchedDates, options) || []
  );
  const [datesSaved, setDatesSaved] = useState(fetchedDates.length > 0);

  const sliceStart = page * rowsPerPage < dates.length ? page * rowsPerPage : 0;
  const sliceEnd =
    page * rowsPerPage + rowsPerPage < dates.length
      ? page * rowsPerPage + rowsPerPage
      : dates.length;

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSelectDate = (iso) => {
    for (let sd of selectedDates)
      if (sd.iso === iso) {
        setSelectedDates(selectedDates.filter((el) => el.iso !== iso));
        return;
      }

    setSelectedDates([...selectedDates, { iso, crenaux: [] }]);
  };

  const handleSelectAllDates = () => {
    if (selectedDates.length >= dates.filter((d) => !d.isWeekend).length) {
      setSelectedDates([]);
      return;
    }
    var selected = [];
    for (let date of dates)
      if (!date.isWeekend) selected.push({ iso: date.iso, crenaux: [] });

    setSelectedDates(selected);
  };

  const handleCrenauxChecked = (iso, crenaux) => {
    var all = selectedDates;
    for (let sd of all)
      if (sd.iso === iso) {
        if (sd.crenaux.indexOf(crenaux) > -1)
          sd.crenaux = sd.crenaux.filter((c) => c !== crenaux);
        else sd.crenaux = [...sd.crenaux, crenaux];
        setSelectedDates((selectedDates) => [
          ...selectedDates.filter((el) => el.iso !== iso),
          sd,
        ]);
        return;
      }
  };

  function isDateSelected(iso) {
    for (let sd of selectedDates) if (sd.iso === iso) return true;
    return false;
  }

  function isCrenauxSelected(iso, crenaux) {
    for (let sd of selectedDates) {
      if (sd.iso === iso) {
        if (sd.crenaux.indexOf(crenaux) > -1) {
          return true;
        }
      }
    }
    return false;
  }

  function saveDates() {
    if (selectedDates.length === 0) {
      dispatch({
        type: "OPEN_SNACK",
        payload: {
          open: true,
          message: "Aucun date séléctionné!",
          type: "error",
        },
      });
      return;
    }

    for (let d of selectedDates)
      if (d.crenaux.length < 1) {
        dispatch({
          type: "OPEN_SNACK",
          payload: {
            open: true,
            message:
              new Date(d.iso).toLocaleDateString("fr-FR", options) +
              ": aucun crénaux séléctionné!",
            type: "error",
          },
        });
        return;
      }

    dispatch({ type: "OPEN_BACKDROP" });
    saveTeacherDates(current.id_utilisateur, selectedDates)
      .then(() => {
        dispatch({ type: "CLOSE_BACKDROP" });
        dispatch({
          type: "OPEN_SNACK",
          payload: {
            open: true,
            message: "Dates enrégistrées",
            type: "success",
          },
        });
        setDatesSaved(true);
      })
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    getSoutenancesDates()
      .then((result) => setDates(getDays(result.data, options)))
      .then(() => {
        if (!datesSaved && fetchedDates.length === 0) {
          getTeacherDates(current.id_utilisateur).then((result) => {
            var newDates = normalizeFetchedDates(result.data, options);
            if (newDates.length > 0) {
              if (selectedDates.length > 0) {
                setDatesSaved(true);
                return;
              }
              setSelectedDates(newDates);
              setDatesSaved(true);
            }
          });
        }
      });
  }, []);

  return dates.length > 0 ? (
    <Paper style={{ flex: "1" }}>
      {datesSaved && (
        <Typography variant="h6" color="primary">
          Vous avez des préférences enregistrés, vous pouvez les modifier en
          modifiant le tableau suivant.
        </Typography>
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          columnGap: "2rem",
        }}
      >
        <Typography variant="h6">Début: {dates[0].day}</Typography>
        <Typography variant="h6">Fin: {dates[dates.length - 1].day}</Typography>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedDates.length > 0 &&
                    selectedDates.length < dates.length
                  }
                  checked={
                    dates.length > 0 && selectedDates.length === dates.length
                  }
                  onChange={() => handleSelectAllDates()}
                />
              </TableCell>
              <TableCell>Jour</TableCell>
              <TableCell>Crénaux 1</TableCell>
              <TableCell>Crénaux 2</TableCell>
              <TableCell>Crénaux 3</TableCell>
              <TableCell>Crénaux 4</TableCell>
              <TableCell>Crénaux 5</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dates.slice(sliceStart, sliceEnd).map((el) => (
              <TableRow key={el.iso}>
                <TableCell padding="checkbox">
                  {!el.isWeekend && (
                    <Checkbox
                      checked={isDateSelected(el.iso)}
                      onChange={() => handleSelectDate(el.iso)}
                    />
                  )}
                </TableCell>
                <TableCell
                  colSpan={isDateSelected(el.iso) ? 1 : 6}
                  onClick={() =>
                    el.isWeekend ? undefined : handleSelectDate(el.iso)
                  }
                >
                  {el.day}
                </TableCell>
                {isDateSelected(el.iso) && (
                  <TableCell>
                    <Checkbox
                      onChange={() => handleCrenauxChecked(el.iso, 1)}
                      checked={isCrenauxSelected(el.iso, 1)}
                      style={{ padding: "0" }}
                    />
                  </TableCell>
                )}
                {isDateSelected(el.iso) && (
                  <TableCell>
                    <Checkbox
                      onChange={() => handleCrenauxChecked(el.iso, 2)}
                      checked={isCrenauxSelected(el.iso, 2)}
                      style={{ padding: "0" }}
                    />
                  </TableCell>
                )}
                {isDateSelected(el.iso) && (
                  <TableCell>
                    <Checkbox
                      onChange={() => handleCrenauxChecked(el.iso, 3)}
                      checked={isCrenauxSelected(el.iso, 3)}
                      style={{ padding: "0" }}
                    />
                  </TableCell>
                )}
                {isDateSelected(el.iso) && (
                  <TableCell>
                    <Checkbox
                      onChange={() => handleCrenauxChecked(el.iso, 4)}
                      checked={isCrenauxSelected(el.iso, 4)}
                      style={{ padding: "0" }}
                    />
                  </TableCell>
                )}
                {isDateSelected(el.iso) && (
                  <TableCell>
                    <Checkbox
                      onChange={() => handleCrenauxChecked(el.iso, 5)}
                      checked={isCrenauxSelected(el.iso, 5)}
                      style={{ padding: "0" }}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[7, dates.length]}
        component="div"
        count={dates.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      <Button variant="contained" color="primary" onClick={() => saveDates()}>
        Enregistrer
      </Button>
    </Paper>
  ) : null;
}

export default Dates;

function getDays(dates, options) {
  var days = [];
  const endDate = new Date(dates.date_fin);
  for (var i = 0; i < 100; i++) {
    var day = new Date(
      new Date().setDate(new Date(dates.date_debut).getDate() + i)
    );
    days.push({
      day: day.toLocaleDateString("fr-FR", options),
      isWeekend: [0, 6].indexOf(day.getDay()) < 0 ? false : true,
      iso: day.toDateString(),
    });
    if (
      day.getDate() === endDate.getDate() &&
      day.getDay() === endDate.getDay()
    )
      return days;
  }

  return days;
}

function normalizeFetchedDates(dates, options) {
  var normalized = [];
  for (let date of dates) {
    var day = new Date(date.jour);
    var crenaux = [];
    for (let c of date.crenaux.split(",")) {
      var number = parseInt(c);
      if (!isNaN(number)) crenaux.push(number);
    }
    normalized.push({ iso: day.toDateString(), crenaux });
  }
  return normalized;
}

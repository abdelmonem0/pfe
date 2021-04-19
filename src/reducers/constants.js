const constantsReducer = (
  state = { snackbar: { open: false }, backdrop: { open: false } },
  action
) => {
  switch (action.type) {
    case "OPEN_SNACK":
      state = {
        ...state,
        snackbar: {
          open: true,
          message: action.payload.message,
          type: action.payload.type,
        },
        backdrop: { open: false },
      };
      return state;
    case "CLOSE_SNACK":
      state = { ...state, snackbar: { open: false } };
      return state;
    case "OPEN_BACKDROP":
      state = { ...state, backdrop: { open: true } };
      return state;
    case "CLOSE_BACKDROP":
      state = { ...state, backdrop: { open: false } };
      return state;
    default:
      return state;
  }
};

export default constantsReducer;

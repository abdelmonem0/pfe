const constantsReducer = (
  state = { snackbar: { open: false }, backdrop: { open: false } },
  action
) => {
  switch (action.type) {
    case "SET_THEME":
      state = { ...state, theme: action.payload };
      return state;
    case "SET_CAN_SWITCH":
      state = { ...state, canSwitch: true };
      return state;
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
      state = { ...state, snackbar: { ...state.snackbar, open: false } };
      return state;
    case "OPEN_BACKDROP":
      state = { ...state, backdrop: { open: true } };
      return state;
    case "CLOSE_BACKDROP":
      state = { ...state, backdrop: { open: false } };
      return state;
    case "PURGE":
      state = { ...state, canSwitch: false };
      return state;
    default:
      return state;
  }
};

export default constantsReducer;

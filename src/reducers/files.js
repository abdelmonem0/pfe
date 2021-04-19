const filesReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_FILES":
      state = action.payload;
      return state || [];
    case "CLEAR_FILES":
      state = [];
      return state;
    default:
      return state;
  }
};

export default filesReducer;

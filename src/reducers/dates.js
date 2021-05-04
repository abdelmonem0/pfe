const datesReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_DATES":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export default datesReducer;

const savedDatesReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_SAVED_DATES":
      state = action.payload;
      return state;
    case "SET_SINGLE_DATE":
      state = {
        ...state,
        [action.payload[0].key]: action.payload[0].value,
        [action.payload[1].key]: action.payload[1].value,
      };
      return state;
    default:
      return state;
  }
};

export default savedDatesReducer;

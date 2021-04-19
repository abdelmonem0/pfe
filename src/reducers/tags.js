const tagsReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_TAGS":
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export default tagsReducer;

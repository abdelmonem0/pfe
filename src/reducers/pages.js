const pagesReducer = (state = { pages: [] }, action) => {
  switch (action.type) {
    case "SET_PAGES":
      return { ...state, pages: action.payload };
    case "REMOVE_PAGE":
      return {
        ...state,
        pages: state.pages.filter((p) => p.text !== action.payload),
      };
    default:
      return state;
  }
};

export default pagesReducer;

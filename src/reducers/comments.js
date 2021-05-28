const commentsReducer = (state = { comments: [] }, action) => {
  var _comments = [];
  switch (action.type) {
    case "SET_COMMENTS":
      state = { ...state, comments: action.payload };
      return state;
    case "ADD_COMMENT":
      state = { ...state, comments: [...state.comments, action.payload] };

      return state;
    case "DELETE_COMMENT":
      _comments = [...state.comments].filter(
        (c) => c.id_commentaire !== action.payload
      );

      return { ...state, comments: _comments };
    case "UPDATE_COMMENT":
      console.log(
        state.comments.find(
          (c) => c.id_commentaire === action.payload.id_commentaire
        )
      );
      _comments = [...state.comments]
        .filter((c) => c.id_commentaire !== action.payload.id_commentaire)
        .concat(action.payload);
      console.log(
        _comments.find(
          (c) => c.id_commentaire === action.payload.id_commentaire
        )
      );
      return { ...state, comments: _comments };
    default:
      return state;
  }
};

export default commentsReducer;

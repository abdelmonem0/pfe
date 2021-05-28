import usersReducer from "./users";
import projectsReducer from "./projects";
import pagesReducer from "./pages";
import candidaturesReducer from "./candidatures";

import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import filesReducer from "./files";
import likesReducer from "./likes";
import constantsReducer from "./constants";
import tagsReducer from "./tags";
import soutenanceReducer from "./soutenance";
import notificationsReducer from "./notifications";
import datesReducer from "./dates";
import avisReducer from "./avis";
import parametersReducer from "./parameters";
import savedSoutenanceReducer from "./savedSoutenance";
import commentsReducer from "./comments";
import savedDatesReducer from "./savedDates";

const persistConfig = {
  key: "root",
  storage,
  whiteliste: [
    "users",
    "parameters",
    "projects",
    "candidatures",
    "soutenance",
    "likes",
    "tags",
    "notifications",
  ],
};

const allReducers = combineReducers({
  users: usersReducer,
  projects: projectsReducer,
  pages: pagesReducer,
  candidatures: candidaturesReducer,
  files: filesReducer,
  constants: constantsReducer,
  avis: avisReducer,
  likes: likesReducer,
  tags: tagsReducer,
  soutenance: soutenanceReducer,
  savedSoutenance: savedSoutenanceReducer,
  notifications: notificationsReducer,
  dates: datesReducer,
  parameters: parametersReducer,
  comments: commentsReducer,
  savedDates: savedDatesReducer,
});

export default persistReducer(persistConfig, allReducers);

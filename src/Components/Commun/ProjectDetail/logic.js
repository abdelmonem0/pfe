import { store } from "../../..";
import { get_comment_visibility } from "../ViewComments";

export function getNextQuery(pathname, query, param) {
  const newPath = `/${pathname}?${query}=${param}`;
  return newPath;
}

export function get_visible_comments(project) {
  const state = store.getState();
  const role = state.users.current.role;
  const comments = state.comments.comments.filter(
    (c) => c.id_sujet === project.id_sujet
  );

  var temp = [];
  for (let c of comments)
    if (get_comment_visibility(project, role) === c.visible_par) temp.push(c);

  return temp;
}

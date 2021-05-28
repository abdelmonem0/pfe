import { store } from "../../..";

export function getUserSoutenances() {
  const state = store.getState();
  const soutenances = state.savedSoutenance.soutenances;
  const current = state.users.current;
  var userSout = [];

  for (let s of soutenances) {
    if (s.id_sujet === current.sujet_affecte) userSout.push(s);
    if (
      s.invite.map((el) => el.id_utilisateur).indexOf(current.id_utilisateur) >
      -1
    )
      userSout.push(s);
  }

  console.log(userSout);
  return userSout;
}

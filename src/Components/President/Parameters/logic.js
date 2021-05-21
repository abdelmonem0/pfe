export function getLastUpdateDate(list) {
  if (list.length === 0) return "Pas definit encore";
  const temp = [...list];
  temp.sort((a, b) => new Date(a.date) - new Date(b.date));
  return `Dernier mise à jour: ${new Date(temp[0].date).toLocaleString(
    "fr-FR"
  )}`;
}

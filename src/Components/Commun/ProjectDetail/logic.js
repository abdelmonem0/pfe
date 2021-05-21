export function getNextQuery(pathname, query, param) {
  const newPath = `${pathname}?${query}=${param}`;
  return newPath;
}

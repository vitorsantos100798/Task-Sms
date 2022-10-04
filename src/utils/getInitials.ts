export default (string = '') => {
  let name = '';
  const newName = string.split(' ');

  if (newName[0]) {
    name += newName[0].charAt(0);
  }
  if (newName[1]) {
    name += newName[1].charAt(0);
  }
  name = String(name).toUpperCase();

  return name;
};

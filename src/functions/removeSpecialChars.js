export default function removeSpecialCharacters(inputString) {
  const pattern = /[^a-zA-Z0-9_()'" ]/g;
  const resultString = inputString.replace(pattern, "").replace(/\s+/g, " ");
  return resultString.trim();
}

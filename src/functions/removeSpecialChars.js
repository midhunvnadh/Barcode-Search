export default function removeSpecialCharacters(inputString) {
  const pattern = /[^a-zA-Z0-9_() ]/g;
  const resultString = inputString.replace(pattern, "");
  return resultString.trim();
}

import path from "path";
import fs from "fs";
export default function writeFile(filePath, content) {
  const currentPath = path.resolve(__dirname);
  const savePath = path.join(currentPath, filePath);
  fs.writeFile(savePath, content, "utf8", (err) => {
    if (err) {
      console.error("Error writing to the file:", err);
    } else {
      console.log("File has been successfully written to " + savePath);
    }
  });
}

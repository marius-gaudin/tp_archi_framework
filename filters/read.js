// Ce filter prend en entré un chemin d’un fichier et retourne son contenu
var fs = require("fs");
module.exports = (input) => {
  let content = fs.readFileSync(input[0], "utf-8");
  console.log(content);
  return content;
};

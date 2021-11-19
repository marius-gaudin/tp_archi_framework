// Ce filter prend du texte et un chemin en entré et écrit le contenu dans un fichier
var fs = require("fs");
module.exports = (input) => {
  let text = input[0];
  let path = input[1];
  fs.writeFile(path, text, function (err) {
    if (err) return console.log(err);
    console.log(path + " > " + text);
  });
};

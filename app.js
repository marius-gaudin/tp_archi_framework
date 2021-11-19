var fs = require("fs");

const start = () => {
  if (checkFilters()) {
    showFilters();
  }
};

const checkFilters = () => {
  let isValid = true;
  fs.readdirSync("./filters/").forEach((file) => {
    let fc = require(`./filters/${file}`);

    if (typeof fc != "function") {
      console.error(`Le module du filtre "${file}" doit renvoyer une fonction`);
      isValid = false;
      return false;
    }

    if (fc.length != 1) {
      console.error(
        `La fonction du filtre "${file}" doit contenir un seul argument input`
      );
      isValid = false;
      return false;
    }
  });

  return isValid;
};

const showFilters = () => {
  console.log("filters : ");
  fs.readdirSync("./filters/").forEach((file) => {
    console.log(file);
  });
};

start();

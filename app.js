const fs = require("fs");
const chalk = require("chalk");

const start = () => {
  if (checkFilters()) {
    showFilters();
    if (checkConfig()) {
      executeFilters();
    }
  }
};

// Vérifie que la signature de chaque filter placé dans le dossier /filters est valide (que le module retourne bien une fonction)
const checkFilters = () => {
  let isValid = true;
  fs.readdirSync("./filters/").forEach((file) => {
    let fc = require(`./filters/${file}`);

    if (typeof fc != "function") {
      console.error(chalk.red.bold(`\nLe module du filtre "${file}" doit renvoyer une fonction`));
      isValid = false;
      return false;
    }

    if (fc.length != 1) {
      console.error(chalk.red.bold(`\nLa fonction du filtre "${file}" doit contenir un seul argument input`));
      isValid = false;
      return false;
    }
  });

  return isValid;
};

//Vérifie que le fichier config-filters est correct
const checkConfig = () => {
  try {
    let ficConfig = fs.readFileSync("config-filters.json");
    let config = JSON.parse(ficConfig);

    if (config.hasOwnProperty("steps") && typeof config.steps == "object") {
      for (const step in config.steps) {
        if (step && step != "") {
          if (!config.steps[step].hasOwnProperty("filter")) {
            throw "Chaque step doit avoir un identifiant";
          }

          if (config.steps[step].hasOwnProperty("params")) {
            if (!Array.isArray(config.steps[step].params))
              throw `Le champ params de la step "${step}"" doit être un array`;
          }

          if (config.steps[step].hasOwnProperty("next")) {
            if (
              config.steps != step &&
              !config.steps.hasOwnProperty(config.steps[step].next)
            )
              throw `Le paramètre next de la step "${step}" doit corespondre à un identifiant d'une autre step`;
          }

          return true;
        } else {
          throw "Chaque step doit avoir un identifiant";
        }
      }
    } else {
      throw "Dans le fichier config-filters.json il manque la propriété steps de type Object";
    }
  } catch (e) {
    if (e.code == "ENOENT") {
      console.error(
        chalk.red.bold("\nLe fichier config-filters.json n'existe pas ! il faut obligatoirement le définir")
      );
    } else {
      console.error(
        chalk.red.bold("\nUn problème est survenu dans le fichier config-filters.json : ")
      );
      console.error(e);
    }
    return false;
  }
};

const showFilters = () => {
  console.log("liste des filters : ");
  fs.readdirSync("./filters/").forEach((file) => {
    console.log("- " + file);
  });
  console.log();
};

//  Exécute les filters dans l’ordre défini dans le fichier de configuration par le développeur
const executeFilters = () => {
  fs.readFile("./config-filters.json", "utf8", function read(err, data) {
    if (err) {
      console.error(chalk.red.bold("\nUne Erreur est survenu lié à la lecture du fichier !"))
      console.error(err);
    }
    let steps = JSON.parse(data).steps;
    const goToNextFilter = (nextStep, previousParams) => {
      let fc = require("./filters/" + steps[nextStep].filter + ".js");
      let res;

      console.log("--------------------------");
      console.log("Execution de " + steps[nextStep].filter);
      console.log("--------------------------");

      try {
        if (previousParams) {
          if (steps[nextStep].hasOwnProperty("params")) {
            res = fc(Array(previousParams).concat(steps[nextStep].params));
          } else {
            res = fc(Array(previousParams));
          }
        } else {
          res = fc(steps[nextStep].params);
        }
      } catch (e) {
        console.error(chalk.red.bold(`\nL'execution de la step "${steps[nextStep].filter}" a échoué : `));
        console.error(e);
      }

      console.log();

      if (steps[nextStep].hasOwnProperty("next")) {
        goToNextFilter(steps[nextStep].next, res);
      }
    };

    goToNextFilter(Object.keys(steps)[0]);
  });
};

start();

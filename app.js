const express = require("express");
const app = express();
var fs = require("fs");
var path = require("path");

app.listen(3000, () => {
  console.log("Server up and running on port 3000");
});

const start = () => {
  console.log("filters : ");
  fs.readdirSync("./filters/").forEach((file) => {
    console.log(file);
  });
};

start();

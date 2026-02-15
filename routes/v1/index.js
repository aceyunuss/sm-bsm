var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const { auth } = require("../../middleware/auth");

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
  })
  .forEach((fname) => {
    const file = require("./" + fname);
    const var_file = fname.replace(".js", "");
    if (var_file === "login") {
      router.use("/" + var_file, file);
    } else {
      router.use("/" + var_file, auth, file);
    }
  });

module.exports = router;

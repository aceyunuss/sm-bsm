var express = require("express");
var router = express.Router();
const login = require("../../modules/login");

router.post("/", login.check);

module.exports = router;

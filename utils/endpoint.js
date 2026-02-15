var express = require("express");
var router = express.Router();

const method = ["get", "post", "delete", "patch", "put"];

method.forEach((mtd) => {
  router[mtd]("/*splat", function (req, res) {
    res.status(404).json({ message: "This endpoint is not available 🙀" });
  });
});

module.exports = router;
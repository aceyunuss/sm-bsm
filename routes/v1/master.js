var express = require("express");
var router = express.Router();
const role = require("../../modules/role");

router.get("/role/:role_id", role.getRole);
router.get("/role", role.getAllRole);
router.patch("/role/:role_id", role.updateRole);

module.exports = router;

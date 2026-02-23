var express = require("express");
var router = express.Router();
const user = require("../../modules/user");

router.get("/tenant/:tenant_id", user.getUserByTenant);
router.get("/sub-tenant/:sub_tenant_id", user.getUserBySubTenant);
router.get("/:user_id", user.getUser);
router.get("/", user.getAllUser);
router.post("/", user.insertUser);
router.put("/:user_id", user.updateUser);

module.exports = router;

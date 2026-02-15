var express = require("express");
var router = express.Router();
const role = require("../../modules/role");
const tenant = require("../../modules/tenant");
const subtenant = require("../../modules/subtenant");

router.get("/role/:role_id", role.getRole);
router.get("/role", role.getAllRole);
router.put("/role/:role_id", role.updateRole);

router.get("/tenant/:tenant_id", tenant.getTenant);
router.get("/tenant", tenant.getAllTenant);
router.put("/tenant/:tenant_id", tenant.updateTenant);
router.post("/tenant", tenant.insertTenant);

router.get("/subtenant/:sub_tenant_id", subtenant.getSubTenant);
router.get("/subtenant", subtenant.getAllSubTenant);
router.put("/subtenant/:sub_tenant_id", subtenant.updateSubTenant);
router.post("/subtenant", subtenant.insertSubTenant);

module.exports = router;

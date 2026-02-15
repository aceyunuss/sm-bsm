var express = require("express");
var router = express.Router();
const visit = require("../../modules/visit");
const createUploader = require("../../middleware/upload");

const uploadVisit = createUploader("visit");

router.post(
  "/checkin",
  ...uploadVisit(
    [
      { name: "photo", maxCount: 1 },
      { name: "attachment", maxCount: 1 },
    ],
    ["photo"],
  ),
  visit.checkIn,
);

router.post(
  "/checkout",
  ...uploadVisit(
    [
      { name: "photo1", maxCount: 1 },
      { name: "attachment1", maxCount: 1 },
    ],
    ["photo1"],
  ),
  visit.checkOut,
);

router.get("/photo/:visit_id", visit.getPhoto);
router.get("/attachment/:visit_id", visit.getAttachment);

router.get("/history/:visit_id", visit.getHistory);
router.get("/history-by-user/:user_id", visit.getHistoryUser);
router.get("/history-by-tenant/:tenant_id", visit.getHistoryTenant);
router.get("/history-by-sub-tenant/:sub_tenant_id", visit.getHistorySubTenant);

module.exports = router;

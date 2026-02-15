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

module.exports = router;

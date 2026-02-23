var express = require("express");
var router = express.Router();
const visit = require("../../modules/visit");

router.get("/photo-in/:visit_id", visit.getPhotoIn);
router.get("/photo-out/:visit_id", visit.getPhotoOut);
router.get("/attachment-in/:visit_id", visit.getAttachmentIn);
router.get("/attachment-out/:visit_id", visit.getAttachmentOut);

module.exports = router;

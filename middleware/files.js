const multer = require("multer");
const sharp = require("sharp");
const { wins } = require("../service/log");

const reduceImg = async (files) => {
  const max = 1024 * 1024 * 3; // 3 MB max file HCP
  let new_file = [];
  for (const f of files) {
    if (f.mimetype.includes("image") && f.size >= max) {
      const buff = await sharp(f.buffer).jpeg({ quality: 50 }).toBuffer();
      f.mimetype = "image/jpeg";
      f.buffer = buff;
      f.size = buff.length;
    }
    new_file.push(f);
  }
  return new_file;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
const noupload = multer({});

const fileUpload = upload.any();
const file = (req, res, next) => {
  noupload.any()(req, res, async (err) => {
    const req_data = {
      endpoint: req.baseUrl,
      header: req.headers,
      body: req.body,
      files: await reduceImg(req.files),
      param: req.params,
      query: req.query,
    };
    wins.info(req_data);
    return next();
  });
};

module.exports = { file, fileUpload };

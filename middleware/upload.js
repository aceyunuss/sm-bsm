const multer = require("multer");
const path = require("path");
const fs = require("fs");

// mime type global
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const createUploader = (baseFolder, requiredFields = []) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); 
      const folder = `uploads/${baseFolder}/${year}${month}`;

      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }

      cb(null, folder);
    },

    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
      cb(null, uniqueName);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("File type not allowed"), false);
    }
  };

  const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter,
  });

  return (fieldsConfig) => {
    return [
      upload.fields(fieldsConfig),
      (req, res, next) => {
        for (const field of requiredFields) {
          if (!req.files || !req.files[field] || req.files[field].length === 0) {
            return res.status(400).json({
              success: false,
              message: `${field} is required`,
            });
          }
        }
        next();
      },
    ];
  };
};

module.exports = createUploader;

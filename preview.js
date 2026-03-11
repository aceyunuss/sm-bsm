const express = require("express");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const preview = express.Router();

const SECRET_KEY = "kkkkkkkkkkkkkffffffffffffffffffffffuuuuuuuuuuuuuuuuu";

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(SECRET_KEY.padEnd(32).slice(0, 32)),
    Buffer.alloc(16, 0),
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

const decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(SECRET_KEY.padEnd(32).slice(0, 32)),
    Buffer.alloc(16, 0),
  );
  let decrypted = decipher.update(hash, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

preview.encrypt = encrypt;

preview.get("/:hash", (req, res) => {
  try {
    const filePath = decrypt(req.params.hash);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json("File not found");
    }

    const ext = path.extname(filePath).toLowerCase();
    const imageExt = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const pdfExt = [".pdf"];

    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".pdf": "application/pdf",
    };

    if (imageExt.includes(ext) && !req.query.raw) {
      const rawUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}?raw=1`;
      return res.send(`<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body { background:#000; display:flex; justify-content:center; align-items:center; min-height:100vh; }
      img { max-width:100%; max-height:100vh; object-fit:contain; }
    </style>
  </head>
  <body>
    <img src="${rawUrl}" />
  </body>
</html>`);
    }

    if (pdfExt.includes(ext)) {
      const fileName = path.basename(filePath);
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      res.setHeader("Content-Type", "application/pdf");
      return res.sendFile(path.resolve(filePath));
    }

    if (imageExt.includes(ext)) {
      const mimeType = mimeTypes[ext];
      res.setHeader("Content-Type", mimeType);
      res.setHeader("Content-Disposition", "inline");
      res.setHeader("X-Content-Type-Options", "nosniff");
      return res.sendFile(path.resolve(filePath));
    }

    const fileName = path.basename(filePath);
    res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    return res.sendFile(path.resolve(filePath));
  } catch (error) {
    return res.status(400).json("Error");
  }
});

module.exports = preview;

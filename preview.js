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

    res.type(ext);

    if (imageExt.includes(ext)) {
      res.setHeader("Content-Disposition", "inline");
      return res.sendFile(path.resolve(filePath));
    } else {
      return res.download(path.resolve(filePath));
    }
  } catch (error) {
    return res.status(400).json("Error");
  }
});

module.exports = preview;

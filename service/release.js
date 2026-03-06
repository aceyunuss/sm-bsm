var express = require("express");
var router = express.Router();
var path = require("path");

const AppRelease = require("../models/AppRelease");

router.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, "..", "release", filename);

  res.download(filepath, filename, (err) => {
    if (err) res.status(404).json({ message: "File not found" });
  });
});

router.get("/", async (req, res) => {
  const app = await AppRelease.get();
  if (!app.success) return res.status(500).send("Failed to fetch data");
  const rows = app.data
    .map(
      (v, i) => `
      <tr>
        <td>${v.version}</td>
        <td>${v.date}</td>
        <td><a href="/release/download/${v.filename}" download>Download</a></td>
      </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>App Release</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      display: flex;
      justify-content: center;
      padding: 60px 20px;
      min-height: 100vh;
    }
    @media (max-width: 480px) {
      body { padding: 30px 8px; }
    }
    .container { width: 100%; max-width: 600px; }
    h1 {
      font-size: 1.4rem;
      font-weight: 600;
      margin-bottom: 20px;
      color: #94a3b8;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: #1e293b;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0,0,0,0.4);
    }
    thead { background: #334155; }
    th {
      padding: 14px 20px;
      text-align: left;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #94a3b8;
    }
    td {
      padding: 14px 20px;
      font-size: 0.9rem;
      border-top: 1px solid #334155;
      color: #cbd5e1;
    }
    tr:hover td { background: #253347; }
    td:nth-child(1) {
      font-family: 'Courier New', monospace;
      font-weight: 800;
    }

    /* Mobile */
    @media (max-width: 480px) {
      body { padding: 30px 16px; }
      h1 { font-size: 1.1rem; margin-bottom: 16px; }
      th {
        padding: 12px 14px;
        font-size: 0.8rem;
      }
      td {
        padding: 12px 14px;
        font-size: 0.9rem;
      }
    }
    td a {
      color: #38bdf8;
      text-decoration: none;
      font-weight: 600;
    }
    td a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>App Release</h1>
    <table>
      <thead>
        <tr>
          <th>App Version</th>
          <th>Release</th>
          <th>File</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
});

module.exports = router;

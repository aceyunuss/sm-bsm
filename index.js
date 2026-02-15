var express = require("express");
var dotenv = require("dotenv");
var cors = require("cors");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var routes = require("./routes/v1");
var log = require("./service/log");
var no_endpoint = require("./utils/endpoint");

dotenv.config();
const PORT = process.env.PORT;
const app = express();

const morg = log.morg();
app.use(morgan(morg.format, { stream: morg.logstream }));

app.use(bodyParser.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  }),
);

app.use("/api/v1/", routes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is up 😸" });
});

app.get("/health", async (req, res) => {
  res.status(200).json("ok");
});

app.use(no_endpoint);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

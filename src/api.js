const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const app = express();
app.set("view engine", "ejs");
app.set("views", "app/views");
app.use(cors());

const router = express.Router();

let timeout = null;

const espDevices = ["00AA70E2"];
const eventOptions = ["click", "hold"];
const event = {};
espDevices.forEach((item) => {
  event[item] = "";
});

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/devices/event", (req, res) => {
  const deviceId = req.query.device_id;
  if (!espDevices.includes(deviceId)) {
    res.status(400).send("");
    return;
  }
  res.status(200).send(event[deviceId]);
  event[deviceId] = "";
});

router.get("/devices/event/:deviceId", (req, res) => {
  const deviceId = req.params.deviceId;
  const newEvent = req.query.event;
  const isExistDevice = espDevices.includes(deviceId);
  const isValidEvent = eventOptions.includes(newEvent);

  if (!isExistDevice || !isValidEvent) {
    res.status(400).send("");
    return;
  }

  event[deviceId] = newEvent;

  res.status(200).send({ status: "done" });

  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(() => {
    event[deviceId] = "";
  }, 3 * 60 * 1000);
});

// router.get("/", (req, res) => {
//   res.json({
//     hello: "hi!",
//   });
// });

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
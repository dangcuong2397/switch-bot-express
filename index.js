require("dotenv/config");
const cors = require("cors");
const express = require("express");
const app = express();
const port = 3001;

app.set("view engine", "ejs");
app.set("views", "app/views");
app.use(cors());
app.use(express.static("app/public"));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

let timeout = null;

const espDevices = ["00AA70E2"];
const eventOptions = ["click", "hold"];
const event = {};
espDevices.forEach((item) => {
  event[item] = "sdfsd";
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/devices/event", (req, res) => {
  const deviceId = req.query.device_id;
  if (!espDevices.includes(deviceId)) {
    res.status(400).send("");
    return;
  }
  res.status(200).send(event[deviceId]);
  event[deviceId] = "";
});

app.patch("/devices/event/:deviceId", (req, res) => {
  const deviceId = req.params.deviceId;
  const newEvent = req.body.event;
  const isExistDevice = espDevices.includes(deviceId);
  const isValidEvent = eventOptions.includes(newEvent);

  if (!isExistDevice || !isValidEvent) {
    res.status(400).send("");
    return;
  }

  event[deviceId] = newEvent;

  res.status(200).send();

  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(() => {
    event[deviceId] = "";
  }, 3 * 60 * 1000);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

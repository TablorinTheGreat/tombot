require("dotenv").config();
const schedule = require("node-schedule");
const loadReminders = require("./src/schedueller/loadReminders");

const express = require("express");
const { bot } = require("./src/bot");
const secretPathComponent = require("./src/bot/secretPathComponent");
const closeRequest = require("./src/requests/closeRequest");
const { TodoistId2Request } = require("./src/db/actions");
const { updateTomer } = require("./src/bot/utils/Telegram");

const expressApp = express();

const hookPath = `telegraf/${secretPathComponent()}`;
expressApp.use(bot.webhookCallback(`/${hookPath}`));
bot.telegram.setWebhook(`${process.env.URL}${hookPath}`);

loadReminders(bot);
expressApp.use(express.json());
expressApp.post("/closeRequest", (req, res) => {
  let event = req.body.event_data;
  TodoistId2Request(event.id)
    .then(({ rows }) => {
      closeRequest(rows[0], 1320316049, updateTomer);
    })
    .catch((err) => {
      console.log(err);
      updateTomer("הייתה בעיה בסגירת המשימה");
    });
  res.end();
});

expressApp.get("/", (req, res) => {
  res.send("hello :)");
});

expressApp.listen(process.env.PORT);

// Enable graceful stop
process.once("SIGINT", () => {
  bot.stop("SIGINT");
  schedule.gracefulShutdown();
});
process.once("SIGTERM", () => bot.stop("SIGTERM"));

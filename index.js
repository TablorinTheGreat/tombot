require("dotenv").config();
const schedule = require("node-schedule");
const loadReminders = require("./src/schedueller/loadReminders");

const express = require("express");
const { bot } = require("./src/bot");
const secretPathComponent = require("./src/bot/secretPathComponent");

const expressApp = express();

const hookPath = `telegraf/${secretPathComponent()}`;
expressApp.use(bot.webhookCallback(`/${hookPath}`));
bot.telegram.setWebhook(`${process.env.URL}${hookPath}`);

loadReminders(bot);

expressApp.get("/", (req, res) => {
  res.send("Hello World!");
});

expressApp.listen(process.env.PORT);

// Enable graceful stop
process.once("SIGINT", () => {
  bot.stop("SIGINT");
  schedule.gracefulShutdown();
});
process.once("SIGTERM", () => bot.stop("SIGTERM"));

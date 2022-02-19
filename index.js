require("dotenv").config();
const express = require("express");
const { bot } = require("./src/bot");
const secretPathComponent = require("./src/bot/secretPathComponent");

const expressApp = express();

const hookPath = `/telegraf/${secretPathComponent()}`;
expressApp.use(bot.webhookCallback(hookPath));
bot.telegram.setWebhook(`${process.env.URL}${hookPath}`);

expressApp.get("/", (req, res) => {
  res.send("Hello World!");
});

expressApp.listen(process.env.PORT);

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

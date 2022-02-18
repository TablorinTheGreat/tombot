require("dotenv").config();
const schedule = require("node-schedule");
const loadReminders = require("./schedueller/loadReminders");
const { bot } = require("./bot");

loadReminders(bot);

bot.launch({
  webhook: {
    domain: process.env.URL,
    port: process.env.PORT,
  },
});

// Enable graceful stop
process.once("SIGINT", () => {
  bot.stop("SIGINT");
  schedule.gracefulShutdown();
});
process.once("SIGTERM", () => bot.stop("SIGTERM"));

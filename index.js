require("dotenv").config();

const { bot } = require("./bot");

bot.launch({
  webhook: {
    domain: process.env.URL,
    port: process.env.PORT,
  },
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

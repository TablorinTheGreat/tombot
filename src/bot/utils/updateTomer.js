const { Telegram } = require("telegraf");

module.exports = (...args) => {
  new Telegram(process.env.BOT_TOKEN).sendMessage(1320316049, ...args);
};

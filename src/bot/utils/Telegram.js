const { Telegram } = require("telegraf");

var telegram = new Telegram(process.env.BOT_TOKEN);
const updateTomer = (...args) => {
  telegram.sendMessage(1320316049, ...args);
};

module.exports = {
  updateTomer,
  sendMessage: (...args) => telegram.sendMessage(...args),
};

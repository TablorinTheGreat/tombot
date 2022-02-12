const { Telegraf, Scenes, session, Markup, Composer } = require("telegraf");
require("dotenv").config();
const { newRequest, id } = require("./scenes/newRequest");

const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Scenes.Stage([newRequest]);

bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => {
  ctx.reply(`הי ${ctx.message.from.first_name}! מה קורה?`);
  ctx.scene.enter(id);
});

module.exports = { bot };

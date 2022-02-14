const { Telegraf, Scenes, session, Markup, Composer } = require("telegraf");
const { getRequestsByUser } = require("../db/actions");
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

bot.command("/getRequests", (ctx) => {
  getRequestsByUser(ctx.update.message.from.id)
    .then(({ rows }) => {
      let content = rows.map((row) => row.content).join("\n");
      ctx.reply(content);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = { bot };

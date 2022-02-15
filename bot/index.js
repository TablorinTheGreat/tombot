const { Telegraf, Scenes, session, Markup, Composer } = require("telegraf");
const { getRequestsByUser, closeRequest } = require("../db/actions");
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

bot.command("/getrequests", (ctx) => {
  getRequestsByUser(ctx.update.message.from.id)
    .then(({ rows }) => {
      ctx.replyWithMarkdown(
        "לחץ לסגירת בקשה",
        Markup.inlineKeyboard(
          rows.map((row) => Markup.button.callback(row.content, `${row.id}`)),
          { columns: 1 }
        )
      );
    })
    .catch((err) => {
      console.log(err);
    });
});

bot.action(/\d+/, (ctx) => {
  closeRequest(parseInt(ctx.match[0]), ctx.update.callback_query.from.id)
    .then((res) => {
      if (res.rowCount) ctx.reply("הבקשה נסגרה בהצלחה");
      else throw "row count is 0";
    })
    .catch((err) => {
      ctx.reply("הייתה בעיה בסגירת הבקשה");
    });
});

module.exports = { bot };

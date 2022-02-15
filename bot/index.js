const { Telegraf, Scenes, session, Markup, Composer } = require("telegraf");
const {
  getRequestsByUser,
  closeRequest,
  getAllRequests,
} = require("../db/actions");
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
  if (ctx.update.message.from.id === 1320316049) {
    getAllRequests()
      .then(({ rows }) => {
        ctx.session.rows = rows;
        ctx.replyWithMarkdown(
          "לחץ לסגירת בקשה",
          Markup.inlineKeyboard(
            rows.map((row) =>
              Markup.button.callback(
                `${row.first_name} - ${row.content}`,
                `${row.id}`
              )
            ),
            { columns: 1 }
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    getRequestsByUser(ctx.update.message.from.id)
      .then(({ rows }) => {
        ctx.session.rows = rows;
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
  }
});

bot.action(/\d+/, (ctx) => {
  let requestid = parseInt(ctx.match[0]);
  closeRequest(requestid, ctx.update.callback_query.from.id)
    .then((res) => {
      if (res.rowCount) {
        ctx.reply("הבקשה נסגרה בהצלחה");
        console.log(ctx.session.rows);
        if (ctx.session.rows) {
          let request = ctx.session.rows.find((row) => (row.id = requestid));
          if (ctx.update.callback_query.from.id != 1320316049)
            request.user_id = 1320316049;
          bot.telegram.sendMessage(
            request.user_id,
            `הבקשה ${request.content} בוצעה`
          );
        }
      } else throw "row count is 0";
    })
    .catch((err) => {
      ctx.reply("הייתה בעיה בסגירת הבקשה");
    });
});

module.exports = { bot };

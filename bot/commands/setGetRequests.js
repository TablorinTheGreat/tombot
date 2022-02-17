const { Markup } = require("telegraf");
const {
  getRequestsByUser,
  closeRequest,
  getAllRequests,
} = require("../../db/actions");

const setGetRequests = (bot) => {
  bot.command("/getrequests", (ctx) => {
    let getRequests, buttonUi;
    if (ctx.update.message.from.id === 1320316049) {
      getRequests = getAllRequests;
      buttonUi = (request) =>
        `${request.first_name} - ${request.content} ${request.urgency} ${
          request.urgency_reason ? request.urgency_reason : ""
        }`;
    } else {
      getRequests = getRequestsByUser;
      buttonUi = (request) => request.content;
    }

    getRequests()
      .then(({ rows }) => {
        if (rows.length) {
          ctx.session.rows = rows;
          ctx.replyWithMarkdown(
            "לחץ לסגירת בקשה",
            Markup.inlineKeyboard(
              rows.map((row) =>
                Markup.button.callback(buttonUi(row), `${row.id}`)
              ),
              { columns: 1 }
            )
          );
        } else ctx.reply("אין בקשות");
      })
      .catch((err) => {
        console.log(err);
      });
  });

  bot.action(/\d+/, (ctx) => {
    let requestid = parseInt(ctx.match[0]);
    closeRequest(requestid, ctx.update.callback_query.from.id)
      .then((res) => {
        if (res.rowCount) {
          ctx.reply("הבקשה נסגרה בהצלחה");
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
};

module.exports = setGetRequests;

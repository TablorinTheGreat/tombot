const { Markup } = require("telegraf");
const { getRequestsByUser, getAllRequests } = require("../../db/actions");
const closeRequest = require("../../requests/closeRequest");

const setGetRequests = (bot) => {
  bot.command("/getrequests", (ctx) => {
    let getRequests, buttonUi;
    if (ctx.update.message.from.id === 1320316049) {
      getRequests = getAllRequests;
      buttonUi = (request) =>
        `${request.first_name} - ${request.content} ${request.urgency} ${
          request.urgent_reason ? request.urgent_reason : ""
        }`;
    } else {
      getRequests = getRequestsByUser;
      buttonUi = (request) => request.content;
    }

    getRequests(ctx.update.message.from.id)
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
    let request = ctx.session.rows.find((row) => (row.id = requestid));

    closeRequest(
      request,
      ctx.update.callback_query.from.id,
      (content) => ctx.reply(content),
      true
    );
  });
};

module.exports = setGetRequests;

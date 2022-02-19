const { Telegraf, Scenes, session, Markup, Composer } = require("telegraf");
const { addUser } = require("../db/actions");
const { addReminders, count } = require("../schedueller/reminders");
const setGetRequests = require("./commands/setGetRequests");
const setNewRequest = require("./commands/setNewRequest");

require("dotenv").config();
const { newRequest } = require("./scenes/newRequest");

const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Scenes.Stage([newRequest]);

bot.use(session());
bot.use(stage.middleware());

setGetRequests(bot);
setNewRequest(bot);

bot.start((ctx) => {
  addUser(ctx.from);
  ctx.reply(
    "שלום!!\n אני בוט שנועד לעזור לתומר לנהל בקשות, פניות, תזכורות, שיחות וכו\n כדי לראות מה אני יכול לעשות תלחצו למטה לראות את רשימת הפעולות שלי"
  );
});

module.exports = { bot };

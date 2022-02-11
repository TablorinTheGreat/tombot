// const { Telegraf, Scenes, session, Markup, Composer } = require("telegraf");
require("dotenv").config();
console.log(process.env.URL);
console.log(process.env.PORT);
console.log(process.env.BOT_TOKEN);

const bot = new Telegraf(process.env.BOT_TOKEN);
const urgencyStepHandler = new Composer();
const intervalStepHandler = new Composer();

const intervalReply = (ctx) => {
  ctx.reply("כל כמה זמן תרצה לתזכר אותי?", {
    parse_mode: "HTML",
    ...Markup.inlineKeyboard([
      Markup.button.callback("30 דקות", "_30min"),
      Markup.button.callback("שעה", "_hour"),
      Markup.button.callback("שעתיים", "_2hours"),
      Markup.button.callback("יום", "_day"),
    ]),
  });
};

urgencyStepHandler.action(/_\w+/, (ctx) => {
  ctx.session.request.urgency = ctx.match[0];
  if (ctx.match[0] === "_urgent") {
    ctx.reply("למה זה דחוף?");
    return ctx.wizard.next();
  }

  intervalReply(ctx);
  return ctx.wizard.selectStep(ctx.wizard.cursor + 2);
});

intervalStepHandler.action(/_\w+/, (ctx) => {
  ctx.session.request.timeInterval = ctx.match[0];
  ctx.reply(JSON.stringify(ctx.session.request));
  return ctx.scene.leave();
});

const requestWizard = new Scenes.WizardScene(
  "NEW_REQUEST_WIZARD",
  (ctx) => {
    ctx.reply("מה את/ה צריך?");
    ctx.session.request = {};
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.session.request.content = ctx.message.text;
    ctx.reply("כמה זה דחוף?", {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        Markup.button.callback("דחוף!", "_urgent"),
        Markup.button.callback("ככה ככה", "_medium"),
        Markup.button.callback("לא דחוף", "_minor"),
      ]),
    });
    return ctx.wizard.next();
  },
  urgencyStepHandler,
  (ctx) => {
    ctx.session.request.urgentReason = ctx.message.text;
    intervalReply(ctx);
    return ctx.wizard.next();
  },
  intervalStepHandler
);
const stage = new Scenes.Stage([requestWizard]);

bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => {
  ctx.reply(`הי ${ctx.message.from.first_name}! מה קורה?`);
  ctx.scene.enter("NEW_REQUEST_WIZARD");
});

bot.launch({
  webhook: {
    domain: process.env.URL || "https://996f-109-64-168-218.ngrok.io",
    port: process.env.PORT || 3000,
  },
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

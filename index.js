const { Telegraf, Scenes, session, Markup, Composer } = require("telegraf");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const stepHandler = new Composer();

stepHandler.action(/_\w+/, (ctx) => {
  ctx.session.request.urgency = ctx.match[0];
  if (ctx.match[0] === "_urgent") {
    ctx.reply("למה זה דחוף?");
    return ctx.wizard.next();
  }

  ctx.reply("כל כמה זמן תרצה לתזכר אותי?");
  return ctx.wizard.selectStep(ctx.wizard.cursor + 2);
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
  stepHandler,
  (ctx) => {
    ctx.session.request.urgentReason = ctx.message.text;
    ctx.reply("כל כמה זמן תרצה לתזכר אותי?");
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.session.request.timeInterval = ctx.message.text;
    ctx.reply(JSON.stringify(ctx.session.request));
    return ctx.scene.leave();
  }
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
    domain: "https://95b2-80-246-137-63.ngrok.io",
    port: 8888,
  },
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

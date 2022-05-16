const { Scenes } = require("telegraf");
const { updateTomer } = require("../utils/Telegram");

const id = "ANONYMUS_WIZARD";

const anonymus = new Scenes.WizardScene(
  id,
  (ctx) => {
    ctx.reply("ההודעה הבאה שתשלח/י ישלחו לתומר בעילום שם");
    return ctx.wizard.next();
  },
  (ctx) => {
    updateTomer(`הודעה אנונימית\n${ctx.message.text}`);
    ctx.reply("ההודעה נשלחה");
    return ctx.scene.leave();
  }
);

module.exports = { anonymus, id };

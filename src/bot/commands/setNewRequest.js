const { id } = require("../scenes/newRequest");

const setNewRequest = (bot) => {
  bot.command("/newrequest", (ctx) => {
    ctx.reply(`הי ${ctx.message.from.first_name}!`);
    ctx.scene.enter(id);
  });
};
module.exports = setNewRequest;

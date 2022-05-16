const { id } = require("../scenes/anonymus");

module.exports = (bot) =>
  bot.command("/anonymus", (ctx) => {
    ctx.scene.enter(id);
  });

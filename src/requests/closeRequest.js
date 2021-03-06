const { updateTomer, sendMessage } = require("../bot/utils/Telegram");
const { closeRequest } = require("../db/actions");
const { switchReminderOff } = require("../schedueller/reminders");
const { completeItem } = require("../todoist/completeItem");

module.exports = (request, closingUserId, reply, closeTodoist = false) => {
  closeRequest(request.id, closingUserId)
    .then((res) => {
      if (res.rowCount) {
        reply("הבקשה נסגרה בהצלחה");
        switchReminderOff(request.id);
        if (request) {
          if (closeTodoist) {
            completeItem(request.id);
          }
          let content = `הבקשה ${request.content} בוצעה`;
          closingUserId != 1320316049
            ? updateTomer(content)
            : sendMessage(request.user_id, content);
        }
      } else reply("הבקשה כבר סגורה");
    })
    .catch((err) => {
      console.log(err);
      reply("הייתה בעיה בסגירת הבקשה");
    });
};

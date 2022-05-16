const { sendMessage, updateTomer } = require("../bot/utils/Telegram");
const { TodoistId2Request } = require("../db/actions");
const closeRequest = require("../requests/closeRequest");
const { completedItems } = require("./completeItem");

module.exports = (eventId) => {
  let index = completedItems.indexOf(eventId);
  if (index == -1) {
    TodoistId2Request(eventId)
      .then(({ rows }) => {
        closeRequest(rows[0], 1320316049, (content) =>
          sendMessage(1320316049, content)
        );
      })
      .catch((err) => {
        console.log(err);
        updateTomer("הייתה בעיה בסגירת המשימה");
      });
  } else {
    completedItems.splice(index, 1);
  }
};

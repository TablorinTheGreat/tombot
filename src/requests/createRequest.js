const { createRequest, saveTodoistId } = require("../db/actions");
const { addReminder } = require("../schedueller/reminders");
const addItem = require("../todoist/addItem");

module.exports = (request, sendMessage) => {
  createRequest(request) //save request to db
    .then(({ rows }) => {
      if (rows.length) {
        let request = rows[0];

        addItem(request) // save request to todoist
          .then((task) => {
            // save todoist id to db
            saveTodoistId(request.id, task.id).then(() => {
              addReminder(request);
              sendMessage("!בקשה נוספה בהצלחה");
            });
          })
          .catch(() => sendMessage("הייתה בעיה בהוספת משימה לtodoist"));
      } else throw "error";
    })
    .catch((err) => {
      console.log(err);
      sendMessage("הייתה בעיה בשמירת הנתונים");
    });
};

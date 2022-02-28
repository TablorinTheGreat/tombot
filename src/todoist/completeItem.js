const { getTodoistId } = require("../db/actions");
const TodoistApi = require("./TodoistApi");

var completedItems = [];
const completeItem = (requestId) => {
  getTodoistId(requestId)
    .then(({ rows }) => {
      let id = parseInt(rows[0].todoist_id);
      TodoistApi.closeTask(id).catch(console.log);
      completedItems.push(id);
    })
    .catch(console.log);
};
module.exports = { completeItem, completedItems };

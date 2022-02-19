const { getTodoistId } = require("../db/actions");
const TodoistApi = require("./TodoistApi");

module.exports = (requestId) => {
  getTodoistId(requestId)
    .then(({ rows }) => {
      TodoistApi.closeTask(parseInt(rows[0].todoist_id)).catch(console.log);
    })
    .catch(console.log);
};

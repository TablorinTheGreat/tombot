const { TodoistApi } = require("@doist/todoist-api-typescript");
module.exports = new TodoistApi(process.env.TODOIST_TOKEN);

const TodoistApi = require("./TodoistApi");

module.exports = (request) =>
  TodoistApi.addTask({
    content: request.content,
    description: `${request.first_name} ביקש/ה \n${request.content}\n ${
      request.urgency
    } ${request.urgent_reason ? request.urgent_reason : ""}`,
    project_id: process.env.TOMBOT_TODOIST_PROJECT,
  });

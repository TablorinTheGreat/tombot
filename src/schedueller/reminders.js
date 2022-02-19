const schedule = require("node-schedule");
const updateTomer = require("../bot/utils/updateTomer");
const cronDict = require("./cronDict");

var reminders = {};

const addReminder = (request) => {
  const remind = () => {
    updateTomer(
      `תזכורת\n${request.first_name} ביקש/ה \n${request.content}\n ${
        request.urgency
      } ${request.urgent_reason ? request.urgent_reason : ""}`
    );
  };

  reminders[request.id] = schedule.scheduleJob(
    cronDict[request.time_interval.toISOString()],
    remind
  );
  remind();
};

const switchReminderOff = (id) => {
  reminders[id].cancel();
  delete reminders[id];
};

module.exports = {
  addReminder,
  switchReminderOff,
};

const schedule = require("node-schedule");
const cronDict = require("./cronDict");

var reminders = {};

const addReminder = (request, bot) => {
  const remind = () => {
    bot.telegram.sendMessage(
      1320316049,
      `תזכורת\n${request.first_name} ביקש/ה \n${request.content}\n ${
        request.urgency
      } ${request.urgency_reason ? request.urgency_reason : ""}`
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

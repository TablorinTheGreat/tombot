const { getReminders, getCronDict } = require("../db/actions");
const cronDict = require("./cronDict");
const { addReminder } = require("./reminders");

const loadCronDict = () =>
  getCronDict().then(({ rows }) => {
    rows.forEach((row) => (cronDict[row.interval.toISOString()] = row.cron));
  });

const loadReminders = (bot) => {
  loadCronDict().then(() =>
    getReminders()
      .then(({ rows }) => rows.forEach((row) => addReminder(row, bot)))
      .catch((err) => console.log(err))
  );
};

module.exports = loadReminders;

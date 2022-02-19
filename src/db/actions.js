const connection = require("./connection");

const TodoistId2Request = (todoist_id) => {
  return connection.query(
    `SELECT id, user_id, content, urgency, urgent_reason, time_interval
    from todoist_request
    inner join requests on id = request_id
    where todoist_id = ${todoist_id}`
  );
};

const getTodoistId = (requestId) => {
  return connection.query(
    `SELECT todoist_id from todoist_request where request_id = ${requestId}`
  );
};

const saveTodoistId = (requestId, todoistId) => {
  return connection.query(
    "INSERT INTO todoist_request(request_id,todoist_id) VALUES($1,$2)",
    [requestId, todoistId]
  );
};

const createRequest = (request) =>
  new Promise((resolve, reject) => {
    connection
      .query(
        `INSERT INTO requests(user_id, content, urgency, urgent_reason, time_interval, created_on)
   VALUES($1,$2,$3,$4,$5,$6) RETURNING id`,
        [
          request.user_id,
          request.content,
          request.urgency,
          request.urgent_reason,
          request.time_interval,
          new Date(),
        ]
      )
      .then(({ rows }) => {
        if (!rows.length) throw "no rows in createRequest";
        let requestId = rows[0].id;
        connection
          .query(
            `SELECT r.id, first_name, content, urgency, urgent_reason, time_interval
          FROM requests as r 
          INNER JOIN users as u on r.user_id = u.id
          where r.id = ${requestId}`
          )
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  });

const addUser = async (user) => {
  // add User If Doesnt Exist
  connection.query(
    `INSERT INTO users(id, first_name, last_name)
     SELECT ${user.id}, '${user.first_name}', '${user.last_name}'
      WHERE NOT EXISTS (SELECT 1 FROM users WHERE id=${user.id});`
  );
};
const getRequestsByUser = (userid) => {
  return connection.query(
    "SELECT id, content, created_on FROM requests WHERE user_id = $1 AND closed_by is null",
    [userid]
  );
};

const getAllRequests = () => {
  return connection.query(
    `SELECT r.id, user_id, first_name, content, urgency, urgent_reason, created_on
    FROM requests as r 
    INNER JOIN users as u on r.user_id = u.id
    WHERE closed_by is null`
  );
};

const closeRequest = (requestId, userid) => {
  return connection.query(
    "update requests set closed_by = $2, closed_on = $3 WHERE id = $1 and closed_by is null",
    [requestId, userid, new Date()]
  );
};

const getReminders = () => {
  return connection.query(
    `SELECT r.id, first_name, content, urgency, urgent_reason, time_interval
    FROM requests as r 
    INNER JOIN users as u on r.user_id = u.id
    where closed_by is null`
  );
};

const getCronDict = () => {
  return connection.query("select * from interval_to_cron");
};

module.exports = {
  createRequest,
  getRequestsByUser,
  closeRequest,
  getAllRequests,
  getReminders,
  getCronDict,
  addUser,
  saveTodoistId,
  getTodoistId,
  TodoistId2Request,
};

const SQLBuilder = require("json-sql-builder2");
const connection = require("./connection");
var sql = new SQLBuilder("PostgreSQL");

const createRequest = (request, user) =>
  new Promise((resolve, reject) => {
    addUserIfDoesntExist(user).catch((err) => reject(err));

    const query = sql.$insert({
      $table: "requests",
      $documents: {
        ...request,
        user_id: user.id,
        created_on: new Date(),
      },
    });
    connection
      .query(query.sql, query.values)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });

const addUserIfDoesntExist = async (user) => {
  connection.query(
    `INSERT INTO users(id, first_name, last_name)
     SELECT ${user.id}, '${user.first_name}', '${user.last_name}'
      WHERE NOT EXISTS (SELECT 1 FROM users WHERE id=${user.id});`
  );
};
const getRequestsByUser = (userid) => {
  if (userid === 1320316049) {
    return getAllRequests();
  }

  return connection.query(
    "SELECT id, content, created_on FROM requests WHERE user_id = $1 AND closed_by is null",
    [userid]
  );
};

const getAllRequests = () => {
  return connection.query(
    `SELECT r.id, first_name, last_name, content, urgency, urgent_reason, created_on 
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

module.exports = {
  createRequest,
  addUserIfDoesntExist,
  getRequestsByUser,
  closeRequest,
};

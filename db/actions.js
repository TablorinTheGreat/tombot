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
  return connection.query(
    "SELECT content, urgency, urgent_reason, created_on FROM requests WHERE user_id = $1 AND closed_by is null",
    [userid]
  );
};
const closeRequest = () => {};

module.exports = {
  createRequest,
  addUserIfDoesntExist,
  getRequestsByUser,
  closeRequest,
};

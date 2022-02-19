const { createHash } = require("crypto");

module.exports = () => {
  return createHash("sha3-256")
    .update(process.env.BOT_TOKEN)
    .update(process.version) // salt
    .digest("hex");
};

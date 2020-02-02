const { AuthenticateUser } = require("../controllers/auth");

module.exports = async fastify => {
  fastify.post("/login", AuthenticateUser);
};

const { getUser, createTestUser } = require("../controllers/user");

module.exports = async fastify => {

  // GET: Retrieve authenticated user information
  fastify.get("/me", {
    preValidation: [fastify.authenticate]
  }, getUser);

  // POST: Create a test User
  fastify.post("/user/test", createTestUser);

};

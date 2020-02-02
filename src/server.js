const process = require("process");
const jwt = require("fastify-jwt");
const _fastify = require("fastify");

const buildFastify = () => {

  let loggerOptions = { prettyPrint: true };

  if (process.env.NODE_ENV === "testing") {
    loggerOptions = false;
  }

  const fastify = _fastify({
    logger: loggerOptions
  });

  // Register Plugins
  fastify.register(require("./middleware/authenticate"));
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET
  });

  // Register Routes
  fastify.register(require("./routes/auth"), { prefix: "/api/v1" });
  fastify.register(require("./routes/task"), { prefix: "/api/v1" });
  fastify.register(require("./routes/user"), { prefix: "/api/v1" });

  return fastify;
};

module.exports = buildFastify; // Used for testing

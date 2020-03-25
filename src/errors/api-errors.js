const httpStatusCodes = require("http-status-codes");

class UniqueResourceError extends Error {
  constructor(message = "Resource already exists") {
    super(message);

    this.statusCode = httpStatusCodes.CONFLICT;
  }
}

module.exports = { UniqueResourceError };

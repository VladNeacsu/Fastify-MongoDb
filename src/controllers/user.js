const UserModel = require("../models/user");
const httpStatusCodes = require("http-status-codes");
const { UniqueResourceError } = require("../errors/api-errors");

const UserController = {
  async getUser(req, reply) {
    return UserModel.findOne({
      _id: req.user._id
    }).populate("tasks");
  },

  async createTestUser(req, reply) {
    try {
      const newUser = new UserModel({
        name: "Johnny Test",
        email: "test@test.com",
        password: "testing"
      });

      await newUser.save();

      return reply.code(httpStatusCodes.CREATED).send(newUser);
    } catch (err) {
      if (err.errors && err.errors.email && err.errors.email.properties && err.errors.email.properties.type === "unique") {
        return new UniqueResourceError();
      }

      throw err;
    }
  }
};

module.exports = UserController;

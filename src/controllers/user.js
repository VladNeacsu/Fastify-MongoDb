const UserModel = require("../models/user");
const httpStatusCodes = require("http-status-codes");

const UserController = {
  async getUser(req, res) {
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
      throw err;
    }
  }
};

module.exports = UserController;

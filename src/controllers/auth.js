const UserModel = require("../models/user");
const httpStatus = require("http-status-codes");

const AuthController = {

  async AuthenticateUser(req, reply) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new Error("No email or password supplied");
      }

      const user = await UserModel.findOne({
        email
      });

      if (!user) {
        throw new Error("Cannot find user");
      }

      const isValidPassword = await user.checkPassword(password);

      if (!isValidPassword) {
        return reply.code(httpStatus.UNAUTHORIZED).send({
          message: "Password is incorect"
        });
      }

      // this is automatically bound to the Fastify instance
      const token = this.jwt.sign(user.toObject());

      return {
        token
      };
    } catch (err) {
      throw err;
    }
  }

};

module.exports = AuthController;

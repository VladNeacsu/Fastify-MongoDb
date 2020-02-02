const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("mongoose-validator");
const TaskModel = require("./task");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate: validator({
      validator: "isEmail"
    })
  },
  password: {
    type: String,
    set(password) {
      return password || this.password;
    }
  },
  tasks: [{ type: Schema.Types.ObjectId, ref: TaskModel }]
}, {
  timestamps: true
});

UserSchema.set("autoIndex", false);

// Hooks
UserSchema.pre("save", async function (next) {
  const user = this;

  if (user.password && user.isModified("password")) {
    const bcryptSalt = await bcrypt.genSalt(Number(process.env.PASSWORD_SALT_ROUNDS));
    user.password = await bcrypt.hash(user.password, bcryptSalt);
  }

  return next();
});

// Methods
UserSchema.methods = {
  async checkPassword(password) {
    return await bcrypt.compare(password, this.password);
  }
};

module.exports = model("User", UserSchema);

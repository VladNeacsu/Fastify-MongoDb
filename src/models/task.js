const { Schema, model } = require("mongoose");
// const validator = require("mongoose-validator");

const TaskSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date
  },
  remindDate: {
    type: Date
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
}, {
  timestamps: true
});

module.exports = model("Task", TaskSchema);

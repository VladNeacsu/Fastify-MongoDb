const TaskModel = require("../models/task");
const UserModel = require("../models/user");

const TaskController = {
  async getTaskById(req, reply) {
    try {
      return TaskModel.findById(req.params.id);
    } catch (err) {
      throw err;
    }
  },

  async createTask(req, reply) {
    try {
      const body = req.body;
      const userId = req.user._id;

      if (!body) {
        throw new Error("Request body is empty");
      }

      const newTask = new TaskModel(body);
      newTask.createdBy = userId;
      await newTask.save();

      const user = await UserModel.findById(userId);
      user.tasks.push(newTask);
      await user.save();

      return newTask;
    } catch (err) {
      throw err;
    }
  },

  async updateTask(req, reply) {
    try {
      const taskId = req.params.id;

      const updatedTask = await TaskModel.findByIdAndUpdate(taskId, req.body, { new: true, useFindAndModify: false });

      if (updatedTask) {
        return updatedTask;
      } else {
        throw new Error("Could not find task based on the supplied id.");
      }

    } catch (err) {
      throw err;
    }
  },

  async deleteTask(req, reply) {
    try {
      const taskId = req.params.id;

      const deletedTask = await TaskModel.findByIdAndDelete(taskId, { useFindAndModify: false });

      if (deletedTask) {
        return deletedTask;
      } else {
        throw new Error("Could not find task based on the supplied id.");
      }
    } catch (err) {
      throw err;
    }
  }

};

module.exports = TaskController;

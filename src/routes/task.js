const { getTaskById, createTask, updateTask, deleteTask } = require("../controllers/task");

const taskRoutes = async fastify => {

  fastify.get("/task/:id", {
    preValidation: [fastify.authenticate]
  }, getTaskById);

  fastify.post("/task", {
    preValidation: [fastify.authenticate]
  }, createTask);

  fastify.patch("/task/:id", {
    preValidation: [fastify.authenticate]
  }, updateTask);

  fastify.delete("/task/:id", {
    preValidation: [fastify.authenticate]
  }, deleteTask);

};

module.exports = taskRoutes;

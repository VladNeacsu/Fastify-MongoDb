const buildFastify = require("./src/server");
const mongoose = require("mongoose");

require("dotenv").config();

const defaultListenAddress = 1337;
const LISTEN_ADDR = process.env.LISTEN_ADDR || defaultListenAddress;

const fastify = buildFastify();

mongoose.connect("mongodb://localhost/optilyz", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => fastify.log.info("MongoDB connected..."))
  .catch(err => fastify.log.error(err));

fastify.listen(LISTEN_ADDR, (err, address) => {
  if (err) throw err;
});

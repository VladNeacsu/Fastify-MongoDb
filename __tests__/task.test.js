const httpStatusCodes = require("http-status-codes");
const buildFastify = require("../src/server");
const mongoose = require("mongoose");

const mongoUrlTestDb = "mongodb://localhost/testdb";

process.env.NODE_ENV = "testing";
process.env.JWT_SECRET = "the crystal method";

describe("Test Login Endpoint", () => {
  const fastify = buildFastify();

  beforeAll(async done => {
    await mongoose.connect(mongoUrlTestDb, { useNewUrlParser: true, useUnifiedTopology: true });
    done();
  });

  afterAll(async done => {
    // Cleanup and Disconnect
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();

    await fastify.close();

    done();
  });

  beforeEach(async done => {
    await fastify.ready();
    done();
  });

  it("Should create a test User", async done => {
    const res = await fastify.inject({
      method: "POST",
      url: "/api/v1/user/test"
    });

    const jsonResponse = JSON.parse(res.body);

    expect(res.statusCode).toBe(httpStatusCodes.CREATED);
    expect(jsonResponse.email).toBe("test@test.com");
    done();
  });

  it("Should Login User and return jwt token", async done => {
    const res = await fastify.inject({
      method: "POST",
      url: "/api/v1/login",
      payload: {
        email: "test@test.com",
        password: "testing"
      }
    });

    const jsonResponse = JSON.parse(res.body);

    expect(res.statusCode).toBe(httpStatusCodes.OK);
    expect(jsonResponse).toHaveProperty("token");
    done();
  });

});

describe("Test Task Endpoints", () => {
  const fastify = buildFastify();

  // After login set the Authorization header
  const authHeader = {};

  // Task ID to be used for all the tests
  let taskId;

  beforeAll(async done => {
    await mongoose.connect(mongoUrlTestDb, { useNewUrlParser: true, useUnifiedTopology: true });

    // Create the user that will be used to login in the API
    const createUserResponse = await fastify.inject({
      method: "POST",
      url: "/api/v1/user/test"
    });

    const { email } = JSON.parse(createUserResponse.body);

    // Login user and set Authorization header
    const loginResponse = await fastify.inject({
      method: "POST",
      url: "/api/v1/login",
      payload: {
        email,
        password: "testing" // Plain text password
      }
    });

    const { token } = JSON.parse(loginResponse.body);

    authHeader.Authorization = `Bearer ${token}`;

    done();
  });

  afterAll(async done => {
    // Cleanup and Disconnect
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();

    await fastify.close();

    done();
  });

  it("Should create a Task", async() => {
    const title = "Refactor Code";

    const res = await fastify.inject({
      method: "POST",
      url: "/api/v1/task",
      headers: authHeader,
      payload: {
        title,
        description: "Code always needs refactoring",
        dueDate: "2020-02-10",
        remindDate: "2020-02-10"
      }
    });

    const jsonResponse = JSON.parse(res.body);

    // We will use this Task ID to test other endpoints
    taskId = jsonResponse._id;

    expect(jsonResponse.title).toBe(title);
    expect(res.statusCode).toBe(httpStatusCodes.CREATED);
  });

  it("Should retrieve created Task", async() => {

    const res = await fastify.inject({
      method: "GET",
      url: `/api/v1/task/${taskId}`,
      headers: authHeader
    });

    const jsonResponse = JSON.parse(res.body);

    expect(jsonResponse._id).toBe(taskId);
    expect(res.statusCode).toBe(httpStatusCodes.OK);
  });

  it("Should update Task", async() => {
    const title = "Remove Code Smell";

    const res = await fastify.inject({
      method: "PATCH",
      url: `/api/v1/task/${taskId}`,
      headers: authHeader,
      payload: {
        title
      }
    });

    const jsonResponse = JSON.parse(res.body);

    expect(jsonResponse.title).toBe(title);
    expect(jsonResponse._id).toBe(taskId);
    expect(res.statusCode).toBe(httpStatusCodes.OK);
  });

  it("Should delete Task", async() => {
    const title = "Remove Code Smell";

    const res = await fastify.inject({
      method: "DELETE",
      url: `/api/v1/task/${taskId}`,
      headers: authHeader
    });

    const jsonResponse = JSON.parse(res.body);

    expect(jsonResponse.title).toBe(title);
    expect(jsonResponse._id).toBe(taskId);
    expect(res.statusCode).toBe(httpStatusCodes.OK);
  });

});

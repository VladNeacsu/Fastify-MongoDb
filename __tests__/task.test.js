const httpStatusCodes = require("http-status-codes");
const buildFastify = require("../src/server");
// const mongoose = require("mongoose");
// const supertest = require("supertest");

// process.env.NODE_ENV = "testing";
process.env.JWT_SECRET = "the joker";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YXNrcyI6WyI1ZTM1NDZjZDc3MDc0ZDBlOTc2MGMxZWQiLCI1ZTM1NDg1ZWUzZDk0MTBmMzcxOTc5ZWEiLCI1ZTM1YWFiMzBhMmE4NDFmNjQ3ZTE4NWQiXSwiX2lkIjoiNWUzNTQ2NDA3NzA3NGQwZTk3NjBjMWViIiwibmFtZSI6IkpvaG5ueSBUZXN0IiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwicGFzc3dvcmQiOiIkMmIkMDQkWXBlcUlxNXhqMWlHZTRLUEZkQUlvLkVpNnhlTFQvQlFwNVNkTjl5dUlsTjZVRXY0NnltQTYiLCJjcmVhdGVkQXQiOiIyMDIwLTAyLTAxVDA5OjM0OjU2Ljc1MloiLCJ1cGRhdGVkQXQiOiIyMDIwLTAyLTAxVDE2OjQzOjMxLjgyMFoiLCJfX3YiOjMsImlhdCI6MTU4MDU3ODk0Mn0.5p_f0Mkx9MOHm5FY0fgktHoxdSFS_524Jeu4YCo20uc";

describe("Task Endpoints", () => {
  const fastify = buildFastify();

  beforeEach(async done => {
    await fastify.ready();
    done();
  });

  afterEach(async done => {
    await fastify.close();
    done();
  });

  it("Should Login User and return jwt token", async done => {

    const res = await fastify.inject({
      method: "POST",
      url: "/api/v1/login",
      headers: {
        Authorization: `Bearer ${token}`
      },
      payload: {
        email: "test@test.com",
        passowrd: "testing"
      }
    });

    expect(res.statusCode).toBe(httpStatusCodes.OK);
    done();
  });

});

"use strict";

const mysql2 = require("mysql2");
const { login } = require("../scripts/authentication-handlers");

var mockRequest = {};
var mockResponse = {
  sendStatus: jest.fn(),
  send: jest.fn(),
};

jest.mock("mysql2", function () {
  const mockConnection = {
    connect: jest.fn(),
    query: jest.fn(),
  };
  return {
    createConnection: jest.fn(function () {
      return mockConnection;
    }),
  };
});

describe("Login", function () {
  mockRequest.body = { login: "renatoreis", password: "123456" };
  mockRequest.session = {};

  it("Login Successfully", async function () {
    const user = {
      id: 1,
      userName: "renatoreis",
      name: "Alcirio Reis",
      email: "renato@gmail.com",
      roleCode: "A",
      roleDescription: "Administrator",
    };

    mysql2
      .createConnection()
      .query.mockImplementation((query, values, callback) => {
        callback(null, [user]);
      });

    await login(mockRequest, mockResponse);

    expect(mockRequest.session.User).toEqual(user);
    expect(mockResponse.send).toHaveBeenCalledWith(JSON.stringify(user));
  });

  it("Login With User Not Found", async function () {
    mysql2
      .createConnection()
      .query.mockImplementation((query, values, callback) => {
        callback(null, []);
      });

    await login(mockRequest, mockResponse);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(401);
  });

  it("Login Error", async function () {
    mysql2
      .createConnection()
      .query.mockImplementation((query, values, callback) => {
        callback(new Error("Database error"));
      });

    await login(mockRequest, mockResponse);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(500);
  });
});
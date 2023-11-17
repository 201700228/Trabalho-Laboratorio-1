"use strict";

const { logout } = require("../scripts/globalHandlers");

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

describe("Logout", function () {
  var mockRequest = {
    session: {
      User: "SomeUser",
    },
  };
  var mockResponse = {
    sendStatus: jest.fn(),
  };

  it("Logout Successfully", async function () {
    await logout(mockRequest, mockResponse);

    expect(mockRequest.session.User).toBe(undefined);
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(200);
  });
});

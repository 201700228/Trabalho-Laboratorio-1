"use strict";

const mysql = require("mysql2");
const {
  getUsers,
  createUser,
  editUser,
  deleteUser,
} = require("../scripts/users-handlers");

const mockRequest = {};
const mockResponse = {
  json: jest.fn(),
  sendStatus: jest.fn(),
};

jest.mock("mysql2", () => {
  const mockConnection = {
    connect: jest.fn(),
    query: jest.fn(),
  };

  return {
    createConnection: jest.fn(() => mockConnection),
  };
});

describe("getUsers", () => {
  it("should fetch users successfully", async () => {
    const mockRows = [];

    mysql.createConnection().query.mockImplementation((query, callback) => {
      callback(null, mockRows);
    });

    await getUsers(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith({ users: mockRows });
  });

  it("should handle errors when fetching users", async () => {
    mysql.createConnection().query.mockImplementation((query, callback) => {
      callback(new Error("Database error"));
    });

    await getUsers(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith({ users: [] });
  });
});

describe("createUser", () => {
  it("should create a new user successfully", async () => {
    mysql
      .createConnection()
      .query.mockImplementation((query, values, callback) => {
        callback(null);
      });

    const mockRequestBody = {
      name: "John Doe",
      userName: "johndoe",
      email: "john@example.com",
      password: "password123",
      role: "user",
    };

    await createUser({ body: mockRequestBody }, mockResponse);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(200);
  });

  it("should handle errors when creating a user", async () => {
    mysql
      .createConnection()
      .query.mockImplementation((query, values, callback) => {
        callback(new Error("Database error"));
      });

    const mockRequestBody = {};

    await createUser({ body: mockRequestBody }, mockResponse);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(500);
  });
});

describe("editUser", () => {
  it("should edit a user successfully", async () => {
    mysql
      .createConnection()
      .query.mockImplementation((query, values, callback) => {
        callback(null);
      });

    const mockRequestBody = {};

    await editUser({ body: mockRequestBody }, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith({ success: true });
  });

  it("should handle errors when editing a user", async () => {
    mysql
      .createConnection()
      .query.mockImplementation((query, values, callback) => {
        callback(new Error("Database error"));
      });

    const mockRequestBody = {};

    await editUser({ body: mockRequestBody }, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith({ success: false });
  });
});

describe("deleteUser", () => {
  it("should delete a user successfully", async () => {
    mysql
      .createConnection()
      .query.mockImplementation((query, values, callback) => {
        callback(null);
      });

    await deleteUser({ params: { id: 1 } }, mockResponse);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(200);
  });

  it("should handle errors when deleting a user", async () => {
    mysql
      .createConnection()
      .query.mockImplementation((query, values, callback) => {
        callback(new Error("Database error"));
      });

    await deleteUser({ params: { id: 1 } }, mockResponse);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(500);
  });
});

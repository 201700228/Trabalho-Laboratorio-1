"use strict";

const mysql2 = require("mysql2");
const {
  loadWebSocketSettings,
  messagingInsertNew,
  loadWebSocketMessages,
} = require("../scripts/messaging-handlers");

var mockRequest = {};
var mockResponse = {
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

describe("loadWebSocketSettings", () => {
  it("should load WebSocket settings successfully", async () => {
    const mockRequest = {
      body: {
        id: 123,
      },
    };

    const mockResponse = {
      json: jest.fn(),
    };

    const mockResults = [];

    mysql2
      .createConnection()
      .query.mockImplementation((query, values, callback) => {
        callback(null, mockResults);
      });

    await loadWebSocketSettings(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith(mockResults);
  });

  it("should handle errors when loading WebSocket settings", async () => {
    const mockRequest = {
      body: {
        id: 123,
      },
    };

    const mockResponse = {
      json: jest.fn(),
    };

    mysql2
      .createConnection()
      .query.mockImplementation((query, values, callback) => {
        callback(new Error("Database error"));
      });

    await loadWebSocketSettings(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith([]);
  });
});

describe("messagingInsertNew", () => {
  it("should insert a new message successfully", async () => {
    const mockMessage = {
      from: 123,
      to: 456,
      message: "Test message",
      seen: false,
    };

    const mockCallback = jest.fn();

    mysql2
      .createConnection()
      .query.mockImplementation((query, values, callback) => {
        callback(null, { insertId: 789 });
      });

    await messagingInsertNew(mockMessage, mockCallback);

    expect(mockCallback).toHaveBeenCalledWith(789);
  });

  it("should handle errors when inserting a new message", async () => {
    const mockMessage = {
      from: 123,
      to: 456,
      message: "Test message",
      seen: false,
    };

    const mockCallback = jest.fn();

    mysql2
      .createConnection()
      .query.mockImplementation((query, values, callback) => {
        callback(new Error("Database error"));
      });

    await messagingInsertNew(mockMessage, mockCallback);

    expect(mockCallback).toHaveBeenCalledWith(-1);
  });
});

describe("loadWebSocketMessages", () => {
  it("should load WebSocket messages successfully", async () => {
    const mockRequest = {
      body: {
        id: 123,
      },
    };

    const mockResponse = {
      json: jest.fn(),
    };

    const mockResults = [];

    mysql2
      .createConnection()
      .query.mockImplementation((query, values, callback) => {
        callback(null, mockResults);
      });

    await loadWebSocketMessages(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith(mockResults);
  });

  it("should handle errors when loading WebSocket messages", async () => {
    const mockRequest = {
      body: {
        id: 123,
      },
    };

    const mockResponse = {
      json: jest.fn(),
    };

    mysql2
      .createConnection()
      .query.mockImplementation((query, values, callback) => {
        callback(new Error("Database error"));
      });

    await loadWebSocketMessages(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith([]);
  });
});

"use strict";

const mysql2 = require("mysql2");
const {
  getListJobs,
  getUserInfoInitState,
  editJobInfo,
  createJob,
  reopenJob,
  editOrderPriority,
} = require("../scripts/jobs-handlers");

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

describe("Get List of Jobs", function () {
  it("Get List of Jobs Successfully", async function () {
    const rows = [
      { job_id: 1, user_id_created: 1 },
      { job_id: 2, user_id_created: 2 },
    ];

    mockRequest.body = { type: "ME", identifier: "example_identifier" }; // Provide necessary request body

    mysql2
      .createConnection()
      .query.mockImplementation((query, values, callback) => {
        callback(null, rows);
      });

    await getListJobs(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith({ jobs: rows });
  });

  it("Get List of Jobs Error", async function () {
    mockRequest.body = { type: "INVALID_TYPE" }; // Provide necessary request body

    mysql2
      .createConnection()
      .query.mockImplementation((query, values, callback) => {
        callback(new Error("Database error"));
      });

    await getListJobs(mockRequest, mockResponse);
    expect(mockResponse.json).toHaveBeenCalledWith({ jobs: [] });
  });
});

describe("Get User Info Initial State", function () {
  it("Get User Info Initial State Successfully", async () => {
    const mockResults = [
      { id: 1, domain: "JOB_STATUS" },
      { id: 2, domain: "JOB_EQUIPMENT" },
      { id: 3, domain: "JOB_EQUIPEMENT_PROCEDURE" },
      { id: 4, domain: "JOB_BRAND" },
      { id: 5, name: "Client A" },
      { id: 6, domain: "JOB_PRIORITY" },
    ];

    const mockQuery = jest.fn();
    mockQuery.mockImplementation((query, callback) => {
      callback(null, mockResults);
    });

    mysql2.createConnection().query = mockQuery;

    const mockRequest = {};
    const mockResponse = {
      json: jest.fn(),
    };

    await getUserInfoInitState(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith({
      initPageState: [
        { id: 1, domain: "JOB_STATUS" },
        { id: 2, domain: "JOB_EQUIPMENT" },
        { id: 3, domain: "JOB_EQUIPEMENT_PROCEDURE" },
        { id: 4, domain: "JOB_BRAND" },
        { id: 5, name: "Client A" },
        { id: 6, domain: "JOB_PRIORITY" },
      ],
    });
  });

  it("Get User Info Initial State Error", async function () {
    const error = new Error("Database error");
    const mockQuery = jest.fn().mockImplementation((query, callback) => {
      callback(error, null);
    });

    mysql2.createConnection().query = mockQuery;

    const mockRequest = {};
    const mockResponse = {
      json: jest.fn(),
    };

    await getUserInfoInitState(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith({ initPageState: [] });
  });
});

describe("Edit Job Info", function () {
  it("Edit Job Info Successfully", async function () {
    const mockRequest = {
      body: {
        id: 1,
        userId: 123,
        status: "Completed",
        equipmentType: "Type A",
      },
    };

    const mockResponse = {
      sendStatus: jest.fn(),
    };

    const mockResult = [{ PRIORITY_NUMBER: 1, TOTAL_JOBS: 5 }];

    mysql2
      .createConnection()
      .query.mockImplementation((query, parameters, callback) => {
        callback(null, mockResult);
      });

    await editJobInfo(mockRequest, mockResponse);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(200);
  });

  it("Edit Job Info Error", async function () {
    const mockRequest = {
      body: {
        id: 1,
        userId: 2,
      },
    };

    const mockResponse = {
      sendStatus: jest.fn(),
    };

    const error = new Error("Database error");

    mysql2
      .createConnection()
      .query.mockImplementation((query, parameters, callback) => {
        callback(error, null);
      });

    await editJobInfo(mockRequest, mockResponse);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(500);
  });
});

describe("Create Job", function () {
  it("Create Job Successfully", async function () {
    const mockRequest = {
      body: {
        userId: 1,
        userIdClient: 2,
        status: "Pending",
        equipmentType: "Type A",
      },
    };

    const mockResponse = {
      sendStatus: jest.fn(),
    };

    const mockResult = [{ PRIORITY_NUMBER: 1, TOTAL_JOBS: 5 }];

    mysql2
      .createConnection()
      .query.mockImplementation((query, parameters, callback) => {
        callback(null, mockResult);
      });

    await createJob(mockRequest, mockResponse);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(200);
  });

  it("Create Job Error", async function () {
    const mockRequest = {
      body: {
        userId: 1,
        userIdClient: 2,
        status: "Pending",
        equipmentType: "Type A",
      },
    };

    const mockResponse = {
      sendStatus: jest.fn(),
    };

    const error = new Error("Database error");

    mysql2
      .createConnection()
      .query.mockImplementation((query, parameters, callback) => {
        callback(error, null);
      });

    await createJob(mockRequest, mockResponse);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(500);
  });
});

describe("Reopen Job", function () {
  it("Reopen Job Successfully", async function () {
    const mockRequest = {
      body: {
        JobId: 1,
      },
    };

    const mockResponse = {
      sendStatus: jest.fn(),
    };

    const mockResult = [];

    mysql2
      .createConnection()
      .query.mockImplementation((query, parameters, callback) => {
        callback(null, mockResult);
      });

    await reopenJob(mockRequest, mockResponse);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(200);
  });

  it("Reopen Job Error", async function () {
    const mockRequest = {
      body: {
        JobId: 1,
      },
    };

    const mockResponse = {
      sendStatus: jest.fn(),
    };

    const error = new Error("Database error");

    mysql2
      .createConnection()
      .query.mockImplementation((query, parameters, callback) => {
        callback(error, null);
      });

    await reopenJob(mockRequest, mockResponse);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(500);
  });
});

describe("Edit Order Priority", function () {
  it("Edit Order Priority Successfully", async function () {
    const mockRequest = {
      body: {
        startRowInfo: {
          id: 1,
          priorityWork: 2,
        },
        endRowInfo: {
          id: 2,
          priorityWork: 1,
        },
      },
    };

    const mockResponse = {
      sendStatus: jest.fn(),
    };

    const mockResult = [];

    mysql2
      .createConnection()
      .query.mockImplementation((query, parameters, callback) => {
        callback(null, mockResult);
      });

    await editOrderPriority(mockRequest, mockResponse);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(200);
  });

  it("Edit Order Priority Error", async function () {
    const mockRequest = {
      body: {
        startRowInfo: {
          id: 1,
          priorityWork: 2,
        },
        endRowInfo: {
          id: 2,
          priorityWork: 1,
        },
      },
    };

    const mockResponse = {
      sendStatus: jest.fn(),
    };

    const error = new Error("Database error");

    mysql2
      .createConnection()
      .query.mockImplementation((query, parameters, callback) => {
        callback(error, null);
      });

    await editOrderPriority(mockRequest, mockResponse);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(500);
  });
});

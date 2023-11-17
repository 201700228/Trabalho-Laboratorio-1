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

describe("Get List of Jobs", function () {
  it("Get List of Jobs Successfully", async function () {
    const rows = [{ job_id: 1, user_id_created: 1 }, { job_id: 2, user_id_created: 2 }];
    
    mockRequest.body = { type: "ME", identifier: "example_identifier" }; // Provide necessary request body

    mysql2.createConnection().query.mockImplementation((query, values, callback) => {
      callback(null, rows);
    });

    await getListJobs(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith({ jobs: rows });
  });

  it("Get List of Jobs Error", async function () {
    mockRequest.body = { type: "INVALID_TYPE" }; // Provide necessary request body

    mysql2.createConnection().query.mockImplementation((query, values, callback) => {
      callback(new Error("Database error"));
    });

    await getListJobs(mockRequest, mockResponse);
    expect(mockResponse.json).toHaveBeenCalledWith({ jobs: [] });
  });
});

describe("Get User Info Initial State", function () {
  it("Get User Info Initial State Successfully", async function () {
    const mockResults = [
      [{ id: 1, domain: "JOB_STATUS" }],
      [{ id: 2, domain: "JOB_EQUIPMENT" }],
      [{ id: 3, domain: "JOB_EQUIPEMENT_PROCEDURE" }],
      [{ id: 4, domain: "JOB_BRAND" }],
      [{ id: 5, name: "Client A" }],
      [{ id: 6, domain: "JOB_PRIORITY" }],
    ];

    console.log(mockResults);

    const mockQuery = jest.fn();
    mockQuery.mockReturnValueOnce(mockResults[0])
             .mockReturnValueOnce(mockResults[1])
             .mockReturnValueOnce(mockResults[2])
             .mockReturnValueOnce(mockResults[3])
             .mockReturnValueOnce(mockResults[4])
             .mockReturnValueOnce(mockResults[5]);

    mysql2.createConnection().query = mockQuery;

    const mockRequest = {}; // Defina os dados de requisição necessários para a função
    const mockResponse = {
      json: jest.fn(),
    };

    await getUserInfoInitState(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith({ initPageState: mockResults });
  });

  it("Get User Info Initial State Error", async function () {
    const error = new Error("Database error");
    const mockQuery = jest.fn().mockImplementation((query, values, callback) => {
      callback(error);
    });

    mysql2.createConnection().query = mockQuery;

    const mockRequest = {}; // Defina os dados de requisição necessários para a função
    const mockResponse = {
      json: jest.fn(),
    };

    await getUserInfoInitState(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith({ initPageState: [] });
  });
});

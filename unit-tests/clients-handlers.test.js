"use strict";

const mysql2 = require("mysql2");
const {
  getClients,
  editClient,
  deleteClient,
  createClient,
} = require("../scripts/clients-handlers");

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

describe("Get Clients", function () {
  it("Get Clients Successfully", async function () {
    const rows = [
      { id: 1, name: "Client A" },
      { id: 2, name: "Client B" },
    ];

    mysql2.createConnection().query.mockImplementation((query, callback) => {
      callback(null, rows);
    });

    await getClients(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith({ clients: rows });
  });

  it("Get Clients Error", async function () {
    mysql2.createConnection().query.mockImplementation((query, callback) => {
      callback(new Error("Database error"));
    });
    await getClients(mockRequest, mockResponse);
    expect(mockResponse.json).toHaveBeenCalledWith({ clients: [] });
  });
});

describe("Edit Client", function () {
  var mockRequest = {
    body: {
      name: "Exemplo de Nome",
      address: "Exemplo de Endereço",
      postCode: "12345",
      email: "exemplo@exemplo.com",
      nif: "123456789",
      id: 1,
    },
  };

  it("Edit Client Successfully", async function () {
    var updatedClient = {
      name: "Nome Atualizado",
      address: "Endereço Atualizado",
      postCode: "54321",
      email: "atualizado@exemplo.com",
      nif: "987654321",
      id: 1,
    };

    mysql2
      .createConnection()
      .query.mockImplementation((query, values, callback) => {
        callback(null, updatedClient);
      });

    await editClient(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith({ success: true });
  });

  it("Edit Client Error", async function () {
    mysql2
      .createConnection()
      .query.mockImplementation((query, values, callback) => {
        callback(new Error("Database error"));
      });

    await editClient(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith({ success: false });
  });
});

describe("Delete Client", function () {
  var mockRequest = {
    params: {
      id: 1,
    },
  };

  it("Delete Client Successfully", async function () {
    mysql2
      .createConnection()
      .query.mockImplementation((query, values, callback) => {
        callback(null);
      });

    await deleteClient(mockRequest, mockResponse);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(200);
  });

  it("Delete Client Error", async function () {
    mysql2
      .createConnection()
      .query.mockImplementation((query, values, callback) => {
        callback(new Error("Database error"));
      });

    await deleteClient(mockRequest, mockResponse);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(500);
  });
});

describe('Create Client', function () {
    var mockRequest = {
        body: {
            name: 'Nome do Cliente',
            address: 'Endereço do Cliente',
            postCode: '12345',
            email: 'cliente@exemplo.com',
            nif: '123456789'
        }
    };
    
    it('Create Client Successfully', async function () {
        mysql2.createConnection().query.mockImplementation((query, values, callback) => {
            callback(null);
        });

        await createClient(mockRequest, mockResponse);

        expect(mockResponse.sendStatus).toHaveBeenCalledWith(200);
    });

    it('Create Client Error', async function () {
        mysql2.createConnection().query.mockImplementation((query, values, callback) => {

            callback(new Error('Database error'));
        });

        await createClient(mockRequest, mockResponse);
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(500);
    });
});

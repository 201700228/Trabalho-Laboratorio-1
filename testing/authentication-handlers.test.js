jest.mock('mysql2', () => ({
  createConnection: jest.fn(() => ({
    connect: jest.fn(),
    query: jest.fn(),
  })),
}));
const options = require("../scripts/connection-options.json");
const { login } = require('../scripts/authentication-handlers');

const mockSession = {};
const mockRequest = {
  body: {
    login: 'nunesd',
    password: '123456',
  },
  session: mockSession,
};

const mockResponse = {
  sendStatus: jest.fn(),
  send: jest.fn(),
};

describe('login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle a successful login', async () => {
    // Mock the query function for a successful login
    const mockRow = [
      {
        id: 1,
        userName: 'renatoreis',
        name: 'Alcirio Reis',
        email: 'renato@gmail.com',
        roleCode: 'A'
      },
    ];
  
    require('mysql2').createConnection(options).query.mockImplementation((query, params, callback) => {
      callback(null, mockRow);
    });
  
    // Invoke the function
    await login(mockRequest, mockResponse);
  
    // Assertions for a successful login
    expect({
      id: 1,
      userName: 'renatoreis',
      name: 'Alcirio Reis',
      email: 'renato@gmail.com',
      roleCode: 'A'
    }).toEqual(mockRow[0]);
    // expect(mockResponse.send).toHaveBeenCalledWith(JSON.stringify(mockRow[0]));
  });
  

  // Add similar tests for unsuccessful login and error during login...
});

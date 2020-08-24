import { createEjsResponder } from '../src';

const MOCK_VIEW_FILE_PATH = './mock-views/index.ejs';

const mockResponse: any = {
  writeHead: jest.fn(() => mockResponse),
  end: jest.fn(),
};

beforeEach(() => {
  mockResponse.writeHead.mockClear();
  mockResponse.end.mockClear();
});

/**
 * createEjsResponder()
 */

describe('Calling createEjsResponder()', () => {
  test('returns a function named \'ejsResponder\'', () => {
    const result = createEjsResponder();
    expect(typeof result).toBe('function');
    expect(result.name).toBe('ejsResponder');
  });
});

/**
 * ejsResponder()
 */

describe('When passed a response object', () => {
  describe('that is empty', () => {
    test('returns that response object', async () => {
      const ejsResponder = createEjsResponder();
      const tuftResponse = {};
      const result = ejsResponder(tuftResponse, mockResponse);
      expect(result).resolves.toBe(tuftResponse);
    });
  });

  describe('that contains a \'render\' property set to an empty object', () => {
    test('returns that response object', async () => {
      const ejsResponder = createEjsResponder();
      const tuftResponse = { render: {} };
      const result = ejsResponder(tuftResponse, mockResponse);
      expect(result).resolves.toBe(tuftResponse);
    });
  });
});

describe('When passed a response object with a \'render\' property', () => {
  describe('which is set to an object containing a \'template\' property', () => {
    test('calls the expected response methods', async () => {
      const ejsResponder = createEjsResponder();
      const tuftResponse = {
        render: {
          template: `<!DOCTYPE html>
<html>
  <body>
    <h1><%= title %></h1>
    <p>Welcome to <%= title %></p>
  </body>
</html>`,
          data: { title: 'Tuft' },
        },
      };

      const expectedBody = `<!DOCTYPE html>
<html>
  <body>
    <h1>Tuft</h1>
    <p>Welcome to Tuft</p>
  </body>
</html>`;

      const result = ejsResponder(tuftResponse, mockResponse);
      await expect(result).resolves.toBeUndefined();
      expect(mockResponse.writeHead).toHaveBeenCalledWith(200, {
        ['content-type']: 'text/html; charset=UTF-8',
        ['content-length']: expectedBody.length,
      });
      expect(mockResponse.end).toHaveBeenCalledWith(expectedBody);
    });
  });

  describe('which is set to an object containing a \'filename\' property', () => {
    test('calls the expected response methods', async () => {
      const ejsResponder = createEjsResponder();
      const tuftResponse = {
        render: {
          filename: MOCK_VIEW_FILE_PATH,
          data: { title: 'Tuft' },
        },
      };
      const result = ejsResponder(tuftResponse, mockResponse);

      const expectedBody = `<!DOCTYPE html>
<html>
  <head>
  <title>Tuft</title>
</head>

  <body>
    <h1>Tuft</h1>
    <p>Welcome to Tuft</p>
  </body>
</html>
`;

      await expect(result).resolves.toBeUndefined();
      expect(mockResponse.writeHead).toHaveBeenCalledWith(200, {
        ['content-type']: 'text/html; charset=UTF-8',
        ['content-length']: expectedBody.length,
      });
      expect(mockResponse.end).toHaveBeenCalledWith(expectedBody);
    });
  });
});

describe('When passed a response object with \'render\' and \'status\' properties', () => {
  test('calls the expected response methods', async () => {
    const ejsResponder = createEjsResponder();
    const tuftResponse = {
      status: 200,
      render: { template: '<h1>Hello, world!</h1>' },
    };
    const result = ejsResponder(tuftResponse, mockResponse);
    await expect(result).resolves.toBeUndefined();
    expect(mockResponse.writeHead).toHaveBeenCalledWith(tuftResponse.status, {
      ['content-type']: 'text/html; charset=UTF-8',
      ['content-length']: tuftResponse.render.template.length,
    });
    expect(mockResponse.end).toHaveBeenCalledWith(tuftResponse.render.template);
  });
});

const crypto = require('crypto');

// TODO: Remove
// const users = {};

const folios = {
  'Haskell B. Curry': {
    name: 'Haskell B. Curry',
    title: 'Game Design and Development (BS)',
    email: 'haskell@cs.rit.edu',
    portfolio: 'https://en.wikipedia.org/wiki/Haskell_Curry',
    interests: ['Web Dev', 'Android', 'Game Dev', 'Animation'],
  },
  'Cailin Li': {
    name: 'Cailin Li',
    title: 'New Media Interactive Development (BS)',
    email: 'cxl2467@rit.edu',
    portfolio: 'http://cailinli.me',
    interests: ['Web Dev', 'Mobile Dev', 'iOS', 'Front-End Dev', 'UI/UX Design'],
  },
  'Junie B. Jones': {
    name: 'Junie B. Jones',
    title: 'New Media Design (MFA)',
    email: 'test123@gmail.com',
    portfolio: 'http://creativity.cias.rit.edu/',
    interests: ['Visual Design', 'Mobile Design', 'Project Management'],
  },
};

let etag = crypto.createHash('sha1').update(JSON.stringify(folios));
let digest = etag.digest('hex');

const updateDigest = () => {
  etag = crypto.createHash('sha1').update(JSON.stringify(folios));
  digest = etag.digest('hex');
};

const sendResponse = (request, response, status, obj) => {
  response.writeHead(status, {
    'Content-Type': 'application/json',
    etag: digest,
  });

  response.write(JSON.stringify(obj));
  response.end();
};

const sendResponseHead = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
    etag: digest,
  };

  response.writeHead(status, headers);
  response.end();
};

const addFolio = (request, response, body) => {
  const responseJSON = {
    message: 'Name, title, interests, email and portfolio link are all required',
  };

  const { name, title, interests, email, portfolio } = body;

  if (!name || !title || !interests || !email || !portfolio) {
    responseJSON.id = 'missingParams';
    return sendResponse(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (folios[name]) {
    responseCode = 204;
  } else {
    folios[name] = {};
  }

  folios[name] = { name, title, interests, email, portfolio };

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return sendResponse(request, response, responseCode, responseJSON);
  }

  return sendResponseHead(request, response, responseCode);
};

// const getUsers = (request, response) => {
//   updateDigest();
//
//   if (request.headers['if-none-match'] === digest) {
//     return sendResponseHead(request, response, 304);
//   }
//
//   return sendResponse(request, response, 200, { users });
// };

const getFolios = (request, response) => {
  console.log('get char api hit');
  sendResponse(request, response, 200, folios);
};

const getUsersHead = (request, response) => {
  updateDigest();

  if (request.headers['if-none-match'] === digest) {
    return sendResponseHead(request, response, 304);
  }

  return sendResponseHead(request, response, 200);
};

const notFound = (request, response) => {
  const resjson = {
    message: 'The page you are looking for was not found.',
    id: 'notReal',
  };

  sendResponse(request, response, 404, resjson);
};

const notFoundHead = (request, response) => {
  sendResponseHead(request, response, 404);
};

module.exports = {
  addFolio,
  getFolios,
  getUsersHead,
  notFound,
  notFoundHead,
};

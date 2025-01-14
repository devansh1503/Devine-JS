const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const { method, url } = req;

  if (method === 'GET' && url === '/users') {
    // Handle GET /users
    const users = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
    ];
    res.statusCode = 200;
    res.end(JSON.stringify(users));
  } else if (method === 'POST' && url === '/users') {
    // Handle POST /users
    let body = '';

    req.on('data', chunk => {
      body += chunk; // Collect chunks of data
    });

    req.on('end', () => {
      const user = JSON.parse(body); // Parse JSON body
      res.statusCode = 201;
      res.end(JSON.stringify({ message: 'User created', user }));
    });
  } else if (method === 'PUT' && url.startsWith('/users/')) {
    // Handle PUT /users/:id
    const userId = url.split('/')[2]; // Extract user ID from URL
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      const updatedUser = JSON.parse(body);
      res.statusCode = 200;
      res.end(JSON.stringify({ message: `User ${userId} updated`, updatedUser }));
    });
  } else if (method === 'PATCH' && url.startsWith('/users/')) {
    // Handle PATCH /users/:id
    const userId = url.split('/')[2];
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      const updatedFields = JSON.parse(body);
      res.statusCode = 200;
      res.end(JSON.stringify({ message: `User ${userId} patched`, updatedFields }));
    });
  } else {
    // Handle 404 Not Found
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

// Start the server
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

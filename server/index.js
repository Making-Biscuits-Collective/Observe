require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { auth } = require('express-oauth2-jwt-bearer');
const { auth: expressOidcAuth } = require('express-openid-connect'); 

const clientOriginUrl = process.env.CLIENT_ORIGIN_URL || 'http://localhost:3000';
const auth0IssuerBaseUrl = process.env.AUTH0_ISSUER_BASE_URL || 'https://dev-ci6ig3efqzbsxrl7.us.auth0.com';
const auth0Audience = process.env.AUTH0_AUDIENCE || 'https://observe.culturehouse.cc';

// Input Validation
if (!auth0IssuerBaseUrl || !auth0Audience || !clientOriginUrl) {
    console.error("Error: Make sure AUTH0_ISSUER_BASE_URL, AUTH0_AUDIENCE, and CLIENT_ORIGIN_URL are set in the .env file.");
    process.exit(1);
}

// Authorization middleware. When used, checks access token in Authorization header
// and verifies it against the Auth0 issuer and audience.
const checkJwt = auth({
    audience: auth0Audience,
    issuerBaseURL: auth0IssuerBaseUrl,
    tokenSigningAlg: 'RS256' // Default, but explicit is good
});

// Middleware
app.use(cors({ origin: clientOriginUrl }))
// app.use(expressOidcAuth({
//   authRequired: false, 
//   auth0Logout: true,
// }))

// Endpoints
app.get('/', (req, res) => {
    res.send('Hello from our server!')
})

app.get('/private', checkJwt, (req, res) => {
    // If the token is valid, req.auth will contain payload information
    // console.log('Authenticated user:', req.auth.payload.sub); // Log the user ID (sub claim)
    res.json({
      message: 'Hello from a private endpoint! You need to be authenticated to see this.',
      user: req.auth.payload // Send back the token payload (contains user info)
    });
  });
  
  // Optional: Catch unauthorized errors from checkJwt middleware
  app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      console.error("UnauthorizedError:", err.message);
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    // Handle other errors
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
  });

app.listen(8080, () => {
      console.log('server listening on port 8080')
      console.log(auth0IssuerBaseUrl)
})
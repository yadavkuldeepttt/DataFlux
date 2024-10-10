const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const axios  = require("axios");
const { OAuth2Client } = require("google-auth-library");
const routes = require("./routes/participantRoutes.js");
const  participantDB  = require("./database/participantDB.js");
const admin = require('firebase-admin');

const CLIENT_ID = '903421820217-b6482d9nsronpftg0srsv172nhfuni2u.apps.googleusercontent.com.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


participantDB(); //database call



// Initialize Firebase Admin SDK
// const serviceAccount = require('./serviceAccountKey.json');   //add your service account key
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });



// generate jwt token
app.post('/generate-token', (req, res) => {
  console.log('Received request:', req.body); // Log the incoming request

  const { secret, payload } = req.body;

  // Validate input
  if (!secret || typeof secret !== 'string') {
    return res.status(400).json({ error: 'A valid secret is required' });
  }

  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ error: 'A valid payload is required' });
  }

  // const options = {
  //   expiresIn: '1h',
  //   issuer: 'your_issuer',
  // };

  try {
    const token = jwt.sign(payload, secret);
    res.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// verify jwt token
app.post('/verify-token', async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    res.json({ decodedToken });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(400).json({ error: 'Invalid token' });
  }
});


//for generating OAuth2.0 token 
app.post('/github/callback', async (req, res) => {
  const { client_id, client_secret, code, redirect_uri } = req.body;
   

  console.log(req.body); // Debug log to check the received data

  const data = {
    client_id,
    client_secret,
    code,
    redirect_uri,
  };
  console.log(data,"data");

  try {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      new URLSearchParams(data),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
      }
    );

    const result = response.data;
    console.log('Result from GitHub:', result); // Debug log to check the result
   // Check if the response is a query string
   const params = new URLSearchParams(result);
   const accessToken = params.get('access_token') || result.access_token;
   console.log('Access Token:', accessToken); // Debug log to check the access token

   if (accessToken) {
     res.redirect(`/auth?access_token=${accessToken}`);
   } else {
     res.status(400).json(result);
   }
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//for redirecting after authorize oauth2.0
app.get('/auth', (req, res) => {
  const accessToken = req.query.access_token;
  res.send(`<h1>Your Access Token</h1><p>${accessToken}</p>`);
});

app.use('/api', routes);

// Endpoint to handle the sign-in token
app.post('/api/tokensignin', async (req, res) => {
  const token = req.body.id_token;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const userid = payload['sub'];
    console.log('User ID:', userid);
    console.log('User Payload:', payload);

    // You can now use the payload to create or update the user in your database
    // and create a session or generate a JWT for your application

    res.status(200).send({ message: 'User authenticated', payload });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(400).send({ message: 'Invalid token' });
  }
})



const server = app.listen(process.env.PORT || 5050, () => {
  console.log(`Server started on ${process.env.PORT || 5050}`);
});

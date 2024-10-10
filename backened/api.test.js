const axios = require("axios");
const request = require("supertest");
const dotenv = require("dotenv");
const { JSDOM } = require("jsdom");
const jwt = require("jsonwebtoken");
const express = require("express");
dotenv.config();

// Create a mock express app
const app = express();
app.use(express.json());

describe('GitHub Callback Endpoint', () => {
  it('should return an access token', async () => {
    const url = 'http://localhost:5050/github/callback';
    const data = {
      client_id: process.env.client_id,
      client_secret:process.env.client_secret,
      code: process.env.code,      //change everytime
      redirect_uri: process.env.redirect_uri
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/html'
        }
      });

      const dom = new JSDOM(response.data);
      const accessToken = dom.window.document.querySelector('p').textContent;

      console.log('Access Token:', accessToken);

     await expect(accessToken).toMatch(/^gho_/); // Check if the access token starts with 'gho_'
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      throw error;
    }
  });
});

describe("Token Generation and Verification", () => {
  let generatedToken;

  it("should generate a token", async () => {
    const url = "http://localhost:5050/generate-token";
    const data = {
    secret:process.env.secret,
    payload:{
      uid:process.env.uid,
      email:process.env.email
    }
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "text/html",
        },
      });

      // Check if the response has a token
      await expect(response.data).toHaveProperty("token");

      generatedToken = response.data.token; // Store the generated token for verification
      console.log("generated Token:", generatedToken);
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  });

  it("should verify the generated token", async () => {
    const url = "http://localhost:5050/verify-token";
    const data = {
      token: generatedToken,
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "text/html",
        },
      });

      // verify response
      console.log(response, "response");

      // Check if the response has a token
      await expect(response.status).toBe(200);
      await expect(response.body).toHaveProperty("decodedToken");
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  });
});
  
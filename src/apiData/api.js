import * as C from "./config.js";

var doCall = {
  upload: async function (input) {
    try {
      let url = C.default.objDetails.basePath + input.path;
      console.log(url);
      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input.body),
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return await response.json();
    } catch (error) {
      console.error("Error occurred during upload:", error);
      throw error;
    }
  },

  apiCall: async function (input) {
    try {
      let url = C.default.objDetails.basePath + input.path;
      let options = {
        method: "GET",
        headers: input.headers || {},
        body: input.body ? JSON.stringify(input.body) : null,
      };

      // Add content type header for POST requests
      if (options.method === "POST") {
        options.headers["Content-Type"] = "application/json";
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      if (input.responseTypeNeeded === "json") {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error("Error occurred during API call:", error);
      return null;
    }
  },
};

export default doCall;

export let apiProjects = [
  {
    id: 1,
    objDetails: {
      name: "My Project",
      type: "HTTP",
      language: "English",
      includingExamples: false,
      icon: "https://assets.apidog.com/app/project-icon/builtin/15.jpg",
    },
    apis: [
      {
        id: 1,
        objDetails: {
          name: "Overview",
          description: "Overview of the project",
          icon: `
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.03v13m0-13c-2.819-.831-4.715-1.076-8.029-1.023A.99.99 0 0 0 3 6v11c0 .563.466 1.014 1.03 1.007 3.122-.043 5.018.212 7.97 1.023m0-13c2.819-.831 4.715-1.076 8.029-1.023A.99.99 0 0 1 21 6v11c0 .563-.466 1.014-1.03 1.007-3.122-.043-5.018.212-7.97 1.023"/>
`,
          endpoints: 5,
          cases: 10,
          docs: 1,
          schemas: 3,
          testScenarios: 1,
        },
      },
      {
        id: 2,
        objDetails: {
          name: "Endpoints",
          description: "List of API endpoints.",
          icon: `
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11v5m0 0 2-2m-2 2-2-2M3 6v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1Zm2 2v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8H5Z"/>
`,
          totalCollections: 1,
          collections: [
            {
              id: 10,
              objDetails: {
                name: "Sample APIs",
                icon: `
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 8H4m0-2v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-5.032a1 1 0 0 1-.768-.36l-1.9-2.28a1 1 0 0 0-.768-.36H5a1 1 0 0 0-1 1Z"/>
`,
                endpoints: [
                  {
                    id: 21,
                    label: "endpoint",
                    name: "Find Pet By ID",
                    path: "/pet/{petId}",
                    method: "GET",
                    description: "Retrieve information about a specific user.",
                    created: "June 20, 2024",
                    lastUpdated: "7 days ago",
                    updatedBy: "John Doe",
                    createdBy: "John Doe",
                    maintainer: "",
                    folder: "Sample APIs",
                    status: "Developing",
                    tags: "Pet",
                    service: "Inherit from Parents",
                    jsonBody: "{}",
                    rawBody: "{}",
                    parameters: [
                      {
                        name: "petId",
                        in: "path",
                        required: true,
                        type: "string",
                        description: "pet ID ",
                        example: "1",
                      },
                    ],
                    headers: [
                      {
                        name: "Authorization",
                        type: "string",
                        required: true,
                        description: "Bearer token for authentication",
                        example: "",
                      },
                      {
                        name: "Content-Type",
                        type: "string",
                        required: true,
                        description: "Content type of the request",
                        example: "application/json",
                      },
                    ],
                    auth: [
                      {
                        type: "Bearer Token",
                        description: "Bearer token for authentication",
                        example: "Bearer <token>",
                        value: "",
                      },
                      {
                        type: "API Key",
                        description: "API key for authentication",
                        name: "apiKey",
                        in: "header", // could be 'header' or 'query'
                        example: "apiKey <key>",
                        value: "",
                      },
                      {
                        type: "Basic Auth",
                        description:
                          "Basic authentication with username and password",
                        example: "Basic <base64encoded(username:password)>",
                        username: "",
                        password: "",
                      },
                      {
                        type: "JWT",
                        secret: "",
                        in: "headers", // Default to "headers"
                        payload: "",
                        algorithm:"",
                      },
                      {
                        type: "OAuth 1.0",
                        accessToken: "",
                        oauthTokenSecret: "",
                        consumerKey: "",
                        consumerSecret: "",
                      }, // OAuth 1.0
                      {
                        type: "OAuth 2.0",
                        token:"",
                        tokenType: "Access token",
                        grantType:"Authorization code",
                        authUrl:"https://github.com/login/oauth/authorize",
                        accessTokenUrl:"https://github.com/login/oauth/access_token",
                        clientId: "",
                        clientSecret: "",
                        redirectUri: "http://localhost:5050/auth",
                      }, // OAuth 2.0
                   
                      {
                        type: "Digest Auth",
                        username: "",
                        password: "",
                        realm: "",
                      }, // Digest Auth
                      {
                        type: "No Auth",
                        description: "No authentication required",
                      },
                    ],
                    responses: [
                      {
                        id: 40,
                        status: 200,
                        description: "Pets on sale",
                        schemas: [
                          {
                            name: "id",
                            type: "integer<int64>",
                            description: "Pet ID",
                            mock: "",
                            required: true,
                          },
                          {
                            name: "category",
                            type: "Category",
                            mock: "group",
                            description: "",
                          },
                          {
                            name: "name",
                            type: "string",
                            mock: "name",
                            description: "",
                            required: true,
                          },
                          {
                            name: "photoUrls",
                            type: "array",
                            mock: "image URL",
                            description: "",
                            required: true,
                            items: [
                              {
                                name: "Items",
                                type: "string",
                                mock: "image URL",
                                description: "",
                              },
                            ],
                          },
                        ],
                        examples: [
                          {
                            id: 123456,
                            category: {
                              id: 1,
                              name: "Dogs",
                            },
                            name: "Rover",
                            photoUrls: [
                              "http://example.com/photos/rover.jpg",
                              "http://example.com/photos/rover2.jpg",
                            ],
                          },
                        ],
                      },
                      {
                        id: 41,
                        status: 400,
                        description: "Record not found",
                        schemas: [
                          {
                            name: "code",
                            type: "integer<int64>",
                            description: "code",
                            mock: "",
                            required: true,
                          },
                          {
                            name: "message",
                            type: "string",
                            description: "Pet not found",
                            mock: "",
                            required: true,
                          },
                        ],
                        examples: [
                          {
                            code: 0,
                            message: "string",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      },
      {
        id: 3,
        objDetails: {
          name: "Schemas",
          description: "Schema definitions.",
          icon: `  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"/>
`,
          totalCollections: 1,
          collections: [
            {
              id: 20,
              objDetails: {
                name: "Sample Schemas",
                icon: `  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 8H4m0-2v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-5.032a1 1 0 0 1-.768-.36l-1.9-2.28a1 1 0 0 0-.768-.36H5a1 1 0 0 0-1 1Z"/>
`,
                schemas: [
                  {
                    id: 31,
                    label: "schema",
                    name: "Pet",
                    description: "This is a sample schema",
                    fields: [
                      {
                        name: "id",
                        type: "integer<int64>",
                        description: "Pet ID",
                        mock: "",
                      },
                      {
                        name: "category",
                        type: "Category",
                        mock: "group",
                        description: "",
                      },
                      {
                        name: "name",
                        type: "string",
                        mock: "name",
                        description: "",
                      },
                      {
                        name: "photoUrls",
                        type: "array",
                        mock: "image URL",
                        description: "",
                        items: [
                          {
                            name: "Items",
                            type: "string",
                            mock: "image URL",
                            description: "",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      },
      {
        id: 4,
        objDetails: {
          name: "Components",
          description: "Reusable components.",
          icon: `
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.005 11.19V12l6.998 4.042L19 12v-.81M5 16.15v.81L11.997 21l6.998-4.042v-.81M12.003 3 5.005 7.042l6.998 4.042L19 7.042 12.003 3Z"/>

`,
        },
      },
      {
        id: 5,
        objDetails: {
          name: "Requests",
          description: "Example API requests.",
          icon: `
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 8v8m0-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V9a3 3 0 0 0-3-3h-3m1.5-2-2 2 2 2"/>
`,
        },
      },
      {
        id: 6,
        objDetails: {
          name: "Trash",
          description: "Items moved to trash.",
          icon: `
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>

`,
        },
      },
    ],
    Tests: [
      { id: 1, name: "Unit Tests", description: "Description for Unit Tests" },
      {
        id: 2,
        name: "Integration Tests",
        description: "Description for Integration Tests",
      },
    ],
  },
  {
    id: "2",
    objDetails: {
      name: "Abc Project",
      type: "grPC",
      language: "English",
      includingExamples: false,
      icon: "https://assets.apidog.com/app/project-icon/builtin/20.jpg",
    },
  },
];

export const globalEnvironment = [
  {
    id: 1,
    name: "Global Variables",
    variables: [
      {
        variable: "",
        initialValue: "",
        currentValue: "",
        description: "",
      },
    ],
  },
  {
    id: 2,
    name: "Global Params",
    headers: [
      {
        name: "",
        type: "String",
        value: "",
        description: "",
      },
    ],
    cookies: [
      {
        name: "",
        type: "String",
        value: "",
        description: "",
      },
    ],
    query: [
      {
        name: "",
        type: "String",
        value: "",
        description: "",
      },
    ],
    body: [
      {
        name: "",
        type: "String",
        value: "",
        description: "",
      },
    ],
  },
];

export const apiEnvironment = [
  {
    name: "Develop Env",
    type: "Environment",
    serviceName: "Default Server",
    baseUrl: "https://dev.your-api-server.com",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer YOUR_ACCESS_TOKEN",
    },
    variables: [
      {
        variable: "",
        initialValue: "",
        currentValue: "",
        description: "",
      },
    ],
  },
  {
    name: "Testing Env",
    type: "Environment",
    serviceName: "Default Server",
    baseUrl: "https://dev.your-api-server.com",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer YOUR_ACCESS_TOKEN",
    },
    variables: [
      {
        variable: "",
        initialValue: "",
        currentValue: "",
        description: "",
      },
    ],
  },
];

<script>
  import {
    apiEnvironment,
    globalEnvironment,
  } from "./../../../apiData/apiProjects.js";
  import { onMount } from "svelte";
  import Toast from "../toast.svelte";
  import axios from "axios";

  // variable we are getting from postmanHome for hiding sidemenu on middle screen
  export let apiSectionProjects;

  // variables
  let projects = apiSectionProjects[0];

  // default active menu apis
  let activeMenu = "APIs";
  // submenu
  let showSubmenu = {};
  // schemas list
  let showSchemas = {};

  //  variable to show subitem
  let showItem = {};

  // variable for endpoints list
  let showEndpoints = {};

  // variable for endpoint responses list
  let showEndpointsResponses = {};
  // current tab
  let currentTab = "api";

  let showToast = false;
  let toastMessage = "";
  let toastType = "success";

  // adding new folder in endpoints
  let newCollectionFolder = false;

  // adding new folder in schemas
  let newCollectionFolderSchemas = false;

  // new folder name
  let newFolderName = "";
  let newSchemaFolderName = ""; // new schema folder name
  let chooseParentFolder = ""; // choose parent folder where want to add new endpoint
  let chooseParentFolderSchemas = ""; // choose parent folder where want to add new schema
  let showNameInput = false;
  let endpointData = {}; //object for saving the new endpoint data
  let schemaData = {}; //object for saving the new schema data
  let newResponseName = ""; //add new response tab name
  let newResponseType = ""; //add new response tab type
  let newResponseStatus; //add new response tab status
  let selectedAuthType = "Inherit from parent"; //selected auth type

  //toggle show filter button
  let filterButton = false;
  function showFilterButton() {
    filterButton = !filterButton;
  }

  let searchApiQuery = ""; //search query for apis menu
  let selectedFilters = []; //empty array to store selected filters
  let filteredEndpoints = []; // Initialize an array to store filtered endpoints
  let filteredProjects = [...projects.apis]; //filtered Projects

  onMount(() => {
    filteredEndpoints = filteredProjects.flatMap((api) =>
      (api.objDetails.collections || []).flatMap(
        (collection) => collection.objDetails.endpoints || []
      )
    );

    console.log(filteredEndpoints, "filteredEndpoints");
  });

  // filter options
  let filterOptions = [
    "Status",
    "Tags",
    "Maintainer",
    "Creator",
    "Last modified by",
  ];

  // function to handle filter change
  function handleFilterChange(filter) {
    if (selectedFilters.includes(filter)) {
      selectedFilters = selectedFilters.filter((f) => f !== filter);
      selectedFilters = [...selectedFilters];
      console.log(selectedFilters);
    } else {
      selectedFilters = [...selectedFilters, filter];
      console.log(selectedFilters);
    }
  }

  // get filter label
  function getFilterButtonLabel(filter) {
    return filter;
  }

  // dropdown content on each filter button
  function getDropdownContent(filter) {
    switch (filter) {
      case "Status":
        return ["Released", "Developing", "Testing"];
      case "Tags":
        return ["Pet"];
      case "Maintainer":
        return ["John Doe"];
      case "Creator":
        return ["John Doe"];
      case "Last modified by":
        return ["John Doe"];
      default:
        return [];
    }
  }

  // handle search apis menu

  function handleSearchApisMenu() {
    // Convert the search query to lowercase for case-insensitive comparison
    const query = searchApiQuery.toLowerCase();

    // Filter the projects.apis array based on the search query
    filteredProjects = projects.apis.filter((api) => {
      // Check if the API name matches the search query
      const apiNameMatches = api.objDetails.name.toLowerCase().includes(query);
      console.log("API Name Matches:", apiNameMatches);

      // Check if any collection within the API matches the search query
      const collectionsMatch =
        api.objDetails.collections &&
        api.objDetails.collections.some((collection) => {
          // Check if the collection name matches the search query
          const collectionNameMatches = collection.objDetails.name
            .toLowerCase()
            .includes(query);
          console.log("Collection Name Matches:", collectionNameMatches);

          // Check if any endpoint within the collection matches the search query
          const endpointsMatch =
            collection.objDetails.endpoints &&
            collection.objDetails.endpoints.some((endpoint) =>
              endpoint.name.toLowerCase().includes(query)
            );
          console.log("Endpoints Match:", endpointsMatch);

          // Check if any schema within the collection matches the search query
          const schemasMatch =
            collection.objDetails.schemas &&
            collection.objDetails.schemas.some((schema) =>
              schema.name.toLowerCase().includes(query)
            );
          console.log("Schemas Match:", schemasMatch);

          // Return true if either the collection name, any endpoint name, or any schema name matches the search query
          return collectionNameMatches || endpointsMatch || schemasMatch;
        });

      // Return true if either the API name or any collection (including its endpoints or schemas) matches the search query
      return apiNameMatches || collectionsMatch;
    });
  }

  // Function to handle dropdown content selection
  function handleDropdownContentSelection(filter, value) {
    // Filter endpoints based on selected filter and value
    filteredEndpoints = filteredProjects.flatMap((api) =>
      (api.objDetails.collections || []).flatMap((collection) =>
        (collection.objDetails.endpoints || []).filter(
          (endpoint) =>
            // Add filtering logic here based on the filter type and value
            (filter === "Status" && endpoint.status === value) ||
            (filter === "Tags" &&
              endpoint.tags &&
              endpoint.tags.includes(value)) ||
            (filter === "Maintainer" && endpoint.maintainer === value) ||
            (filter === "Creator" && endpoint.createdBy === value) ||
            (filter === "Last modified by" && endpoint.updatedBy === value)
        )
      )
    );

    console.log(filteredEndpoints);
  }

  // Function to handle filter removal
  function removeFilter(filter) {
    selectedFilters = selectedFilters.filter((f) => f !== filter);
    console.log(selectedFilters);

    // Reset filteredEndpoints based on remaining filters
    if (selectedFilters.length > 0) {
      filteredEndpoints = filteredProjects.flatMap((api) =>
        (api.objDetails.collections || []).flatMap((collection) =>
          (collection.objDetails.endpoints || []).filter((endpoint) =>
            // Apply remaining filters
            selectedFilters.every((filter) => {
              switch (filter) {
                case "Status":
                  return endpoint.status === value; // Replace 'value' with actual status value
                case "Tags":
                  return endpoint.tags && endpoint.tags.includes(value); // Replace 'value' with actual tag value
                case "Maintainer":
                  return endpoint.maintainer === value; // Replace 'value' with actual maintainer value
                case "Creator":
                  return endpoint.createdBy === value; // Replace 'value' with actual creator value
                case "Last modified by":
                  return endpoint.updatedBy === value; // Replace 'value' with actual lastModifiedBy value
                default:
                  return true;
              }
            })
          )
        )
      );
    } else {
      filteredEndpoints = []; // Reset filteredEndpoints if no filters are selected
    }

    console.log(filteredEndpoints);
  }

  // active button for mock tab switch between expectations and script
  let activeButton = "Expectations";
  function switchButton(button) {
    activeButton = button;
  }

  // set menu to active
  function setActiveMenu(menu) {
    activeMenu = menu;
  }

  function showSubItem(index) {
    showItem[index] = !showItem[index];
  }

  // menu items
  const menuItems = [
    {
      name: "APIs",
      icon: `
              <path
                fill-rule="evenodd"
                d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7.414A2 2 0 0 0 20.414 6L18 3.586A2 2 0 0 0 16.586 3H5Zm10 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7V5h8v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1Z"
                clip-rule="evenodd"
              />
            `,
    },
    {
      name: "Tests",
      icon: `
              <path
                fill-rule="evenodd"
                d="M5 5a2 2 0 0 0-2 2v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7a2 2 0 0 0-2-2H5Zm9 2a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H14Zm3 0a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17ZM3 17v-3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm11-2a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H14Zm3 0a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z"
                clip-rule="evenodd"
              />
            `,
    },
    {
      name: "Share Docs",
      icon: `
          <path d="M17.5 3a3.5 3.5 0 0 0-3.456 4.06L8.143 9.704a3.5 3.5 0 1 0-.01 4.6l5.91 2.65a3.5 3.5 0 1 0 .863-1.805l-5.94-2.662a3.53 3.53 0 0 0 .002-.961l5.948-2.667A3.5 3.5 0 1 0 17.5 3Z"/>

            `,
    },
    {
      name: "History",
      icon: `
        <path fill-rule="evenodd" d="M20 10H4v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8ZM9 13v-1h6v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>
        <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 1 1 0 4H4a2 2 0 0 1-2-2Z"/>
            `,
    },
    {
      name: "Settings",
      icon: `
        <path fill-rule="evenodd" d="M17 10v1.126c.367.095.714.24 1.032.428l.796-.797 1.415 1.415-.797.796c.188.318.333.665.428 1.032H21v2h-1.126c-.095.367-.24.714-.428 1.032l.797.796-1.415 1.415-.796-.797a3.979 3.979 0 0 1-1.032.428V20h-2v-1.126a3.977 3.977 0 0 1-1.032-.428l-.796.797-1.415-1.415.797-.796A3.975 3.975 0 0 1 12.126 16H11v-2h1.126c.095-.367.24-.714.428-1.032l-.797-.796 1.415-1.415.796.797A3.977 3.977 0 0 1 15 11.126V10h2Zm.406 3.578.016.016c.354.358.574.85.578 1.392v.028a2 2 0 0 1-3.409 1.406l-.01-.012a2 2 0 0 1 2.826-2.83ZM5 8a4 4 0 1 1 7.938.703 7.029 7.029 0 0 0-3.235 3.235A4 4 0 0 1 5 8Zm4.29 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h6.101A6.979 6.979 0 0 1 9 15c0-.695.101-1.366.29-2Z" clip-rule="evenodd"/>
          `,
    },
  ];

  // tabs
  let tabs = [];
  let activeTab = "Overview"; //active tab
  let newTab = false; // new tab

  onMount(() => {
    tabs = [filteredProjects[0]]; //default tab overview
  });

  //   set overview tab as active
  function setActiveTabOverview() {
    tabs = [filteredProjects[0]];
    activeTab = "Overview";
  }

  //   add new blank tab
  function addNewTab() {
    newTab = true;
  }

  // for setting the active response
  let tabApiResponse = {};

  // new endpoint
  let newEndpoint = {
    id: Date.now().toString(),
    label: "newEndpoint",
    name: "New Endpoint",
    path: "",
    method: "",
    description: "",
    created: Date.now().toString(),
    lastUpdated: "",
    updatedBy: "",
    createdBy: "",
    maintainer: "",
    status: "Developing",
    tags: "",
    service: "Inherit from Parents",
    folder: chooseParentFolder,
    jsonBody: "{}",
    rawBody: "{}",
    auth: [
      {
        type: "Bearer Token",
        description: "",
        example: "",
        value: "",
      },
    ],
    parameters: [
      {
        name: "",
        in: "",
        required: false,
        type: "",
        description: "",
        example: "",
      },
    ],
    headers: [
      {
        name: "",
        type: "string",
        required: false,
        description: "",
      },
    ],
    responses: [
      {
        id: 31,
        status: 200,
        description: "Success",
        schemas: [
          {
            name: "",
            type: "",
            description: "",
            mock: "",
            required: false,
            items: [
              {
                name: "",
                type: "",
                description: "",
                mock: "",
              },
            ],
          },
        ],
        examples: [
          {
            id: null,
            category: {
              id: null,
              name: "",
            },
            name: "",
            photoUrls: [""],
          },
        ],
      },
    ],
  };

  //  new schema add
  let newSchema = {
    id: Date.now().toString(),
    label: "newSchema",
    name: "New Schema",
    description: "",
    fields: [
      {
        name: "",
        type: "",
        description: "",
        mock: "",
        items: [
          {
            name: "",
            type: "",
            mock: "",
            description: "",
          },
        ],
      },
    ],
  };

  // add tab
  function addTab(api, response) {
    tabApiResponse = response;

    //  check if api object is valid or not
    if (!api && !api.objDetails) {
      console.error("Invalid API object:", api);
      return;
    }

    // find specfic tab
    if (!tabs.find((tab) => tab.id === api.id)) {
      tabs = [...tabs, api];
    }

    // check if tab name is overview
    if (
      tabs.length > 0 &&
      tabs[0].objDetails &&
      tabs[0].objDetails.name === "Overview" &&
      api.objDetails
    ) {
      activeTab = api.objDetails.name;
    } else {
      activeTab = api.name;
    }

    console.log(tabs, "tabs");
    console.log(activeTab, "active tab");
  }

  //  new endpoint add to tab
  function handleNewEndpointClick() {
    addTab(newEndpoint, {});
  }

  //  new schema add to tab
  function handleNewSchemaClick() {
    addTab(newSchema, {});
  }

  // handle show api sub menu
  function handleShowSubmenu(apiId) {
    showSubmenu = {
      ...showSubmenu,
      [apiId]: !showSubmenu[apiId],
    };
  }

  // handle show schemas list
  function handleShowSchemas(collectionId) {
    showSchemas = {
      ...showSchemas,
      [collectionId]: !showSchemas[collectionId],
    };
  }
  // handle show endpoints list
  function handleShowEndpoints(collectionId) {
    showEndpoints = {
      ...showEndpoints,
      [collectionId]: !showEndpoints[collectionId],
    };
  }
  // open endpoints responses list
  function openEndpointResponses(endpointName) {
    showEndpointsResponses = {
      ...showEndpointsResponses,
      [endpointName]: !showEndpointsResponses[endpointName],
    };
  }

  // add new row for schemas
  function addField(tab, index) {
    console.log(tab, "field");
    const newField = {
      name: "",
      type: "string",
      mock: "",
      description: "",
      items: [],
    };

    if (tab.fields) {
      tab.fields.splice(index + 1, 0, newField);
    } else if (tab.schemas) {
      tab.schemas.splice(index + 1, 0, newField);
    } else {
      console.error("Neither fields nor schemas exist on the tab object.");
      return;
    }

    tabs = [...tabs]; // Ensure reactivity or state update
  }

  // remove row for schemas
  function removeField(tab, index) {
    if (tab.fields) {
      tab.fields.splice(index, 1);
    } else if (tab.schemas) {
      tab.schemas.splice(index, 1);
    }
    tabs = [...tabs];
  }

  // add schemas item if field is an array
  function addItem(field) {
    field.items.push({
      name: "",
      type: "string",
      mock: "",
      description: "",
    });
    tabs = [...tabs];
  }

  // remove schemas item if field is an array
  function removeItem(field, index) {
    field.items.splice(index, 1);
    tabs = [...tabs];
  }

  // preview schemas
  let previewContent = "";

  function previewTab(tab) {
    previewContent = JSON.stringify(tab, null, 2);
    document.getElementById("my_modal_32").showModal();
  }

  // syntax higlighter json
  function syntaxHighlight(json) {
    if (json === undefined) {
      console.error("Error: JSON is undefined");
      return;
    }
    if (typeof json !== "string") {
      json = JSON.stringify(json, undefined, 2);
    }
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:\s*)?|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        let cls = "number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "key";
          } else {
            cls = "string";
          }
        } else if (/true|false/.test(match)) {
          cls = "boolean";
        } else if (/null/.test(match)) {
          cls = "null";
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  }

  // switch to run tab when click no run button
  function switchToRunTab() {
    currentTab = "run";
  }

  //export
  function exportCollectionPostman(collection) {
    // Convert the collection to Postman format
    const postmanCollection = convertToPostmanFormat(collection);
    // Export the collection as a JSON file
    exportAsJsonFile(postmanCollection, "collection-postman.json");
  }

  function exportCollectionSwagger(collection) {
    // Convert the collection to Swagger format
    const swaggerCollection = convertToSwaggerFormat(collection);
    // Export the collection as a JSON file
    exportAsJsonFile(swaggerCollection, "collection-swagger.json");
  }

  // convert collection to postman format
  function convertToPostmanFormat(collection) {
    // Implement the logic to convert the collection to Postman format
    // This is a placeholder, the actual implementation will depend on the structure of your Postman collection
    return {
      info: {
        name: collection.objDetails.name,
        schema:
          "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
      },
      item: collection.objDetails.endpoints.map((endpoint) => ({
        name: endpoint.name,
        request: {
          method: endpoint.method,
          url: {
            raw: `{{baseUrl}}${endpoint.path}`,
            host: ["{{baseUrl}}"],
            path: endpoint.path.split("/").filter(Boolean),
            variable: endpoint.parameters
              .filter((param) => param.in === "path")
              .map((param) => ({
                key: param.name,
                description: param.description,
                type: param.type,
                example: param.example,
              })),
          },
          description: endpoint.description,
        },
        response: endpoint.responses.map((response) => ({
          name: `${endpoint.name} - ${response.status}`,
          originalRequest: {
            method: endpoint.method,
            url: {
              raw: `{{baseUrl}}${endpoint.path}`,
              host: ["{{baseUrl}}"],
              path: endpoint.path.split("/").filter(Boolean),
              variable: endpoint.parameters
                .filter((param) => param.in === "path")
                .map((param) => ({
                  key: param.name,
                  description: param.description,
                  type: param.type,
                  example: param.example,
                })),
            },
          },
          status: response.status,
          code: response.status,
          body: JSON.stringify(response.examples[0], null, 2),
        })),
      })),
    };
  }

  // convert collection to swagger format
  function convertToSwaggerFormat(collection) {
    // Implement the logic to convert the collection to Swagger format
    // This is a placeholder, the actual implementation will depend on the structure of your Swagger collection
    return {
      swagger: "2.0",
      info: {
        title: collection.objDetails.name,
        version: "1.0.0",
      },
      paths: collection.objDetails.endpoints.reduce((paths, endpoint) => {
        paths[endpoint.path] = {
          [endpoint.method.toLowerCase()]: {
            summary: endpoint.name,
            description: endpoint.description,
            parameters: endpoint.parameters.map((param) => ({
              name: param.name,
              in: param.in,
              required: param.required,
              type: param.type,
              description: param.description,
              example: param.example,
            })),
            responses: endpoint.responses.reduce((responses, response) => {
              responses[response.status] = {
                description: response.description,
                schema: {
                  type: "object",
                  properties: response.schemas.reduce((props, schema) => {
                    props[schema.name] = {
                      type: schema.type,
                      description: schema.description,
                      example: schema.mock,
                    };
                    return props;
                  }, {}),
                },
              };
              return responses;
            }, {}),
          },
        };
        return paths;
      }, {}),
    };
  }

  // export converted collection as a json file
  function exportAsJsonFile(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // import collection

  // Function to handle importing collection as Postman
  async function importCollectionPostman(event) {
    const file = event.target.files[0];
    if (file) {
      const content = await file.text();
      try {
        const postmanCollection = JSON.parse(content);
        console.log("Imported Postman Collection:", postmanCollection);
        const convertedCollection = convertToAppFormat(
          postmanCollection,
          "postman"
        );
        addCollectionToApis(convertedCollection);
      } catch (error) {
        console.error("Error parsing Postman collection:", error);
      }
    }
  }

  // Function to handle importing collection as Swagger
  async function importCollectionSwagger(event) {
    const file = event.target.files[0];
    if (file) {
      const content = await file.text();
      try {
        const swaggerCollection = JSON.parse(content);
        console.log("Imported Swagger Collection:", swaggerCollection);
        const convertedCollection = convertToAppFormat(
          swaggerCollection,
          "swagger"
        );
        addCollectionToApis(convertedCollection);
      } catch (error) {
        console.error("Error parsing Swagger collection:", error);
      }
    }
  }

  // Function to convert imported collection to the app's format
  function convertToAppFormat(collection, format) {
    let convertedCollection;
    if (format === "postman") {
      // Conversion logic for Postman
      convertedCollection = {
        id: Date.now().toString(),
        objDetails: {
          name: collection.info.name,
          icon: `<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 8H4m0-2v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-5.032a1 1 0 0 1-.768-.36l-1.9-2.28a1 1 0 0 0-.768-.36H5a1 1 0 0 0-1 1Z"/>
`, // Add appropriate icon conversion logic
          endpoints: collection.item.map((endpoint) => ({
            id: Date.now().toString(),
            label: "endpoint",
            name: endpoint.name,
            path: endpoint.request.url.raw,
            method: endpoint.request.method,
            description: endpoint.request.description,
            created: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            updatedBy: "Imported",
            createdBy: "Imported",
            maintainer: "",
            folder: collection.info.name,
            parameters: endpoint.request.url.variable.map((param) => ({
              name: param.key,
              in: "path",
              required: true,
              type: "string",
              description: param.description,
              example: param.example,
            })),
            responses: endpoint.response.map((response) => ({
              id: Date.now().toString(),
              status: response.code,
              description: response.name,
              schemas: [], // Add appropriate schema conversion logic
              examples: [response.body],
            })),
          })),
        },
      };
    } else if (format === "swagger") {
      // Conversion logic for Swagger
      convertedCollection = {
        id: Date.now().toString(),
        objDetails: {
          name: collection.info.title,
          icon: `
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 8H4m0-2v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-5.032a1 1 0 0 1-.768-.36l-1.9-2.28a1 1 0 0 0-.768-.36H5a1 1 0 0 0-1 1Z"/>
`, // Add appropriate icon conversion logic
          endpoints: Object.keys(collection.paths)
            .map((path) => {
              const methods = collection.paths[path];
              return Object.keys(methods).map((method) => ({
                id: Date.now().toString(),
                label: "endpoint",
                name: methods[method].summary,
                path,
                method: method.toUpperCase(),
                description: methods[method].description,
                created: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
                updatedBy: "Imported",
                createdBy: "Imported",
                maintainer: "",
                folder: collection.info.title,
                parameters: methods[method].parameters.map((param) => ({
                  name: param.name,
                  in: param.in,
                  required: param.required,
                  type: param.type,
                  description: param.description,
                  example: param.example,
                })),
                responses: Object.keys(methods[method].responses).map(
                  (status) => ({
                    id: Date.now().toString(),
                    status: parseInt(status),
                    description: methods[method].responses[status].description,
                    schemas: [], // Add appropriate schema conversion logic
                    examples: [], // Add appropriate examples conversion logic
                  })
                ),
              }));
            })
            .flat(),
        },
      };
    }
    return convertedCollection;
  }

  // Function to add converted collection to the apis array
  function addCollectionToApis(collection) {
    const apiIndex = filteredProjects.findIndex((api) => api.id === 2);
    if (apiIndex !== -1) {
      filteredProjects[apiIndex].objDetails.collections.push(collection);
      filteredProjects[apiIndex].objDetails.totalCollections += 1;
      filteredProjects = [...filteredProjects];
      console.log(filteredProjects, "new collection added");
    }
  }

  // Function to trigger file input click
  function triggerFileInput(id) {
    document.getElementById(id).click();
  }

  // function to save edited api data and show success message
  function saveEditedApiData(data) {
    if (data) {
      showToast = true;
      toastMessage = "Saved successfully";
      toastType = "success";
      setTimeout(() => {
        showToast = false;
      }, 3000);
      console.log(data, "edited api data");
    }
    filteredProjects = [...filteredProjects];
  }

  // Check if the selected parent folder is from endpoints collections
  $: showNameInput = chooseParentFolder === "Endpoints";

  // Check if the selected parent folder is from endpoints collections
  $: showNameInput = chooseParentFolderSchemas === "Schemas";

  // save new schemas and show success message
  async function saveSchemasTab(tab) {
    if (tab) {
      newCollectionFolderSchemas = true;
      schemaData = tab;
      // Call addNewFolderForSchema with the schema data and wait for its completion
      await addNewFolderForSchema();
      console.log(JSON.stringify(tab, null, 2), "schema new tab");
    }
  }

  // Add new folder where you want to save the schema
  async function addNewFolderForSchema() {
    // If chosen parent folder is endpoints
    if (chooseParentFolderSchemas === "Schemas") {
      let api = filteredProjects[2]; // Get schemas API object

      // Check if schemaData is valid
      if (typeof schemaData !== "object" || Array.isArray(schemaData)) {
        console.error("Invalid schema data:", schemaData);
        return;
      }

      schemaData.label = "schema"; //set the label to schema

      // New folder object
      let newFolder = {
        id: Date.now().toString(), // Generate a unique ID using the current timestamp
        objDetails: {
          name: newSchemaFolderName, // Set the name of the new folder
          icon: `
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 8H4m0-2v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-5.032a1 1 0 0 1-.768-.36l-1.9-2.28a1 1 0 0 0-.768-.36H5a1 1 0 0 0-1 1Z"/>`,
          schemas: [schemaData],
        },
      };
      api.objDetails.collections.push(newFolder); //push new folder api collections
      filteredProjects = [...filteredProjects]; //update projects

      console.log(filteredProjects, "apis"); //debugging purpose
      newCollectionFolderSchemas = false;
      //   Show toast success message
      showToast = true;
      toastMessage = "Saved successfully";
      toastType = "success";
      setTimeout(() => {
        showToast = false;
      }, 3000);
    }
    // else{
    //             let api = projects.apis[2]; // Get endpoints API object
    //     api.objDetails.collections.forEach((collection)=>{
    //         if(collection.objDetails.name === chooseParentFolderSchemas){
    //             collection.objDetails.schemas.push(schemaData);  //push new endpoint to exisiting collection
    //         }
    //     })
    //     projects.apis = [...projects.apis]; //update projects
    //     newCollectionFolderSchemas = false;
    //   // Show toast success message
    //   showToast = true;
    //   toastMessage = "Saved successfully";
    //   toastType = "success";
    //   setTimeout(() => {
    //     showToast = false;
    //   }, 3000);

    // }
    return Promise.resolve(); // Return a resolved Promise to allow async/await usage
  }

  // function to save new API endpoint data and show success message
  async function saveNewEndpoint(data) {
    if (data) {
      newCollectionFolder = true;
      endpointData = data;
      // Call addNewFolderForEndpoint with the endpoint data and wait for its completion
      await addNewFolderForEndpoint();
      console.log(data, "saved endpoint data");
    }
  }

  // Add new folder where you want to save the endpoint
  async function addNewFolderForEndpoint() {
    if (chooseParentFolder === "Endpoints") {
      // If chosen parent folder is endpoints
      let api = filteredProjects[1]; // Get endpoints API object

      // Check if endpointData is valid
      if (typeof endpointData !== "object" || Array.isArray(endpointData)) {
        console.error("Invalid endpoint data:", endpointData);
        return;
      }

      endpointData.label = "endpoint";

      // New folder object
      let newFolder = {
        id: Date.now().toString(), // Generate a unique ID using the current timestamp
        objDetails: {
          name: newFolderName, // Set the name of the new folder
          icon: `
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 8H4m0-2v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-5.032a1 1 0 0 1-.768-.36l-1.9-2.28a1 1 0 0 0-.768-.36H5a1 1 0 0 0-1 1Z"/>`,
          endpoints: [endpointData],
        },
      };
      api.objDetails.collections.push(newFolder); //push new folder api collections
      filteredProjects = [...filteredProjects]; //update projects
      console.log("Executing");
      console.log(filteredProjects, "apis"); //debugging purpose
      console.log("Executing");
      newCollectionFolder = false;
      //   Show toast success message
      console.log("Executing");

      showToast = true;
      console.log("Executing");

      toastMessage = "Saved successfully";
      toastType = "success";
      setTimeout(() => {
        showToast = false;
      }, 3000);
    }
    //  if(chooseParentFolder !== "Endpoints"){
    //     let api = filteredProjects[1]; // Get endpoints API object
    //     api.objDetails.collections.forEach((collection)=>{
    //         if(collection.objDetails.name === chooseParentFolder){
    //             collection.objDetails.endpoints.push(endpointData);  //push new endpoint to exisiting collection
    //         }
    //     })
    //     filteredProjects = [...filteredProjects]; //update projects
    //     newCollectionFolder = false;
    //   // Show toast success message
    //   showToast = true;
    //   toastMessage = "Saved successfully";
    //   toastType = "success";
    //   setTimeout(() => {
    //     showToast = false;
    //   }, 3000);

    // }
    return Promise.resolve(); // Return a resolved Promise to allow async/await usage
  }

  // add new folder for adding the new endpoint in endpoints menu
  function addNewFolder() {
    let api = filteredProjects[1]; // Get endpoints API object
    // New folder object
    let newFolder = {
      id: Date.now().toString(), // Generate a unique ID using the current timestamp
      objDetails: {
        name: newFolderName, // Set the name of the new folder
        icon: `
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 8H4m0-2v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-5.032a1 1 0 0 1-.768-.36l-1.9-2.28a1 1 0 0 0-.768-.36H5a1 1 0 0 0-1 1Z"/>`,
        endpoints: [],
      },
    };
    api.objDetails.collections.push(newFolder); //push new folder api collections
    filteredProjects = [...filteredProjects]; //update projects

    console.log(filteredProjects, "apis"); //debugging purpose
  }

  // add new folder for adding the new schema in schemas menu
  function addNewFolderInSchemas() {
    let api = filteredProjects[2]; // Get schemas API object
    // New folder object
    let newFolder = {
      id: Date.now().toString(), // Generate a unique ID using the current timestamp
      objDetails: {
        name: newFolderName, // Set the name of the new folder
        icon: `
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 8H4m0-2v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-5.032a1 1 0 0 1-.768-.36l-1.9-2.28a1 1 0 0 0-.768-.36H5a1 1 0 0 0-1 1Z"/>`,
        schemas: [],
      },
    };
    api.objDetails.collections.push(newFolder); //push new folder api collections
    filteredProjects = [...filteredProjects]; //update projects

    console.log(filteredProjects, "apis"); //debugging purpose
  }

  // send request
  // send request to backened, postman
  //  response variable for saving the response
  let response = "";
  let headers = ""; //for saving headers

  async function sendRequest(tabContent) {
    console.log(tabContent); // Log the tab content for debugging purposes
    try {
      // Extract the raw body from the tab content
      const requestBody = JSON.parse(tabContent.rawBody);
      console.log(requestBody, "request body"); // Log the request body for debugging purposes

      // Define the request options object, setting the method and headers
      let requestOptions = {
        method: tabContent.method.trim(),
        headers: {
          "Content-Type": "application/json", // Default content type header
        },
      };

      console.log(requestOptions);

      // Add the request body to the options if the method is POST
      if (tabContent.method.trim() === "POST") {
        requestOptions.body = JSON.stringify(requestBody);
      } else if (tabContent.method.trim() === "GET") {
        console.log("Products fetched Successfully"); // Log message for GET requests
      } else if (tabContent.method.trim() === "DELETE") {
        console.log("Deleted Successfully"); // Log message for DELETE requests
      } else {
        // Throw an error for unsupported methods
        throw new Error("Error in method");
      }

      // Add authentication headers based on the selected auth type
      switch (selectedAuthType) {
        case "Bearer Token":
          if (tabContent.auth[0].value.trim() !== "") {
            requestOptions.headers.Authorization = `Bearer ${tabContent.auth[0].value.trim()}`;
            console.log(requestOptions, "request options");
          } else {
            throw new Error("Bearer Token is required.");
          }
          break;
        case "API Key":
          if (tabContent.auth[1].value.trim() !== "") {
            requestOptions.headers["x-api-key"] =
              tabContent.auth[1].value.trim();
            console.log(requestOptions, "request options");
          } else {
            throw new Error("API Key is required.");
          }
          break;
        case "Basic Auth":
          const username = tabContent.auth[2].username.trim();
          const password = tabContent.auth[2].password.trim();
          if (username !== "" && password !== "") {
            requestOptions.headers.Authorization = `Basic ${btoa(`${username}:${password}`)}`;
            console.log(requestOptions, "request options");
          } else {
            throw new Error(
              "Username and Password are required for Basic Auth."
            );
          }
          break;
        case "JWT":
          if (tabContent.auth[3].secret.trim() !== "") {
            const payloadInput =
              document.getElementById("mockjwtPayload").value;
            let payload;
            try {
              console.log(payloadInput, "payload");
              payload = JSON.parse(payloadInput); // Parse the JSON from textarea
              console.log(payload, "payload");
            } catch (error) {
              console.error("Invalid JSON payload:", error);
              return; // Exit if the JSON is invalid
            }

            generateJWTToken(tabContent.auth[3].secret, payload).then(
              (token) => {
                console.log(token, "generated token");
                if (tabContent.auth[3].addTo === "headers") {
                  requestOptions.headers.Authorization = `Bearer ${token}`;
                } else if (tabContent.auth[3].addTo === "params") {
                  requestOptions.params = requestOptions.params || {};
                  requestOptions.params.token = token;
                }
                console.log(requestOptions, "request options");
              }
            );
          } else {
            throw new Error("JWT Secret is required.");
          }
          break;
        case "OAuth 1.0":
          if (tabContent.auth[4].accesstoken.trim() !== "") {
            requestOptions.headers.Authorization = `OAuth ${tabContent.auth[4].accesstoken.trim()}`;
            console.log(requestOptions, "request options");
          } else {
            throw new Error("OAuth 1.0 Token is required.");
          }
          break;

        case "OAuth 2.0":
          if (tabContent.auth[5].token.trim() !== "") {
            requestOptions.headers.Authorization = `Bearer ${tabContent.auth[5].token.trim()}`;
            console.log(requestOptions, "request options");
          } else {
            throw new Error("OAuth 2.0 Token is required.");
          }
          break;

        case "Digest Auth":
          const digestUsername = tabContent.auth[6].username.trim();
          const digestPassword = tabContent.auth[6].password.trim();
          console.log(digestPassword, digestUsername);
          if (digestUsername !== "" && digestPassword !== "") {
            // Example usage:
            const method = "GET"; // HTTP method
            const uri = "/digest-auth"; // Request URI
            const realm = "Users";
            const nonce = "D1OSlmcOGFSRV4ANxlSi9ZAplGXnaJG8";

            const digestHeader = generateDigestHeader(
              digestUsername,
              digestPassword,
              method,
              uri,
              realm,
              nonce
            );

            requestOptions.headers.Authorization = digestHeader;
            console.log(requestOptions, "request options");
          } else {
            throw new Error(
              "Username and Password are required for Digest Auth."
            );
          }
          break;
        case "No Auth":
          // No additional headers needed
          break;
        default:
          break;
      }

      //generate digest header
      function generateDigestHeader(
        username,
        password,
        method,
        uri,
        realm,
        nonce
      ) {
        // Calculate MD5 hashes and construct the response
        // You need to implement this part based on the Digest authentication algorithm
        // Calculate MD5 hashes and construct the response
        // const HA1 = crypto
        //   .createHash("md5")
        //   .update(`${username}:${realm}:${password}`)
        //   .digest("hex");
        // const HA2 = crypto
        //   .createHash("md5")
        //   .update(`${method}:${uri}`)
        //   .digest("hex");
        // const response = crypto
        //   .createHash("md5")
        //   .update(`${HA1}:${nonce}:00000001:abcdef01:${nonce}:auth:${HA2}`)
        //   .digest("hex");

        // Construct the Digest header
        return `Digest username="${username}", realm="${realm}", nonce="${nonce}", uri="${uri}", response="${response}"`;
      }

      // Fetch data from the specified path with the request options
      const res = await fetch(tabContent.path, requestOptions);

      // Parse the JSON response
      const data = await res.json();
      response = JSON.stringify(data, null, 2); // Format the response as a pretty-printed JSON string
      headers = res.headers; //save the response headers for further use
      console.log(headers, "headers");
      console.log("Response data:", response); // Log the response data for debugging purposes

      // Update the textarea with the response
      const responseTextarea = document.querySelector(
        '[data-testid="response"]'
      );
      responseTextarea.value = response;

      console.log(tabContent); // Log the tab content again for debugging purposes
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      // response = "Error occurred while sending request";

      // Display an error message in the response textarea
      const responseTextarea = document.querySelector(
        '[data-testid="response"]'
      );
      responseTextarea.value = "Error occurred while sending request";
    }
  }

  // generate Oauth2 token
  async function generateOAuthToken(tab) {
    event.preventDefault();
    const authUrl = `${tab.auth[5].authUrl}?client_id=${tab.auth[5].clientId}&redirect_uri=${tab.auth[5].redirectUri}&response_type=code&scope=repo`;
    console.log(authUrl, "authUrl");
    window.open(authUrl, "_blank"); // Opens the URL in a new tab
    handleCallback(tab);
  }

  // handle callback for Oauth2.0
  async function handleCallback(tab) {
    console.log("Executing handleCallback");

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (!code) {
      console.log("No code found in URL parameters");
      return;
    }
    console.log(code, "code");
    const data = {
      client_id: tab.auth[5].clientId,
      client_secret: tab.auth[5].clientSecret,
      code: code,
      redirect_uri: tab.auth[5].redirectUri,
    };
    console.log(data, "data");

    try {
      const response = await axios.post(
        `http://localhost:5050/github/callback`,
        new URLSearchParams(data),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
        }
      );

      const result = response.data;
      console.log(result, "result of token");
      if (result.access_token) {
        tab.auth[5].token = result.access_token;
      } else {
        console.error("Error fetching access token:", result);
      }
    } catch (error) {
      console.error("Error during token fetch:", error);
    }
  }

  //generate jwt token
  async function generateJWTToken(secret, payload) {
    const response = await fetch("http://localhost:5050/generate-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ secret, payload }),
    });
    const data = await response.json();
    console.log(data, "data");
    const jwtToken = data.token;

    console.log("Generated JWT:", jwtToken);
    return jwtToken;
  }

  // delete endpoints collection
  function deleteCollection(collectionId, api) {
    console.log(api);
    // const api = filteredProjects[1];
    const collectionIndex = api.objDetails.collections.findIndex(
      (collection) => collection.id === collectionId
    );

    if (collectionIndex !== -1) {
      api.objDetails.collections.splice(collectionIndex, 1);
      filteredProjects = [...filteredProjects];
      console.log("Collection deleted", collectionId);
    } else {
      console.error("Collection not found", collectionId);
    }
  }

  let selectedTabId = 31; // Variable to track the selected tab ID

  //add new response tab in endpoints
  function addNewResponseTab(tab) {
    console.log(tab, "tab");
    // new object
    let newObjectResponseTab = {
      id: Date.now().toString(),
      status: Number(newResponseStatus),
      description: newResponseName,
      schemas: [
        {
          name: "",
          type: "String",
          description: "",
          mock: "",
          required: false,
        },
      ],
      examples: [],
    };
    console.log(newObjectResponseTab, "new object response");
    //  newEndpoint.responses.push(newObjectResponseTab);
    newEndpoint.responses = [...newEndpoint.responses, newObjectResponseTab];
    tabs = [...tabs];
    console.log(tabs, "tabs");
    console.log(newEndpoint, "newEndpoint");

    // Initialize the selectedTabId with the new response's id if not already set
    if (!selectedTabId) {
      selectedTabId = newObjectResponseTab.id;
    }
  }

  function handleTabClick(responseId) {
    selectedTabId = responseId;
  }

  //   handle environment modal
  let envModal = false;
  function handleEnvModal() {
    envModal = true;
  }

  // State variables to track selected items
  let selectedGlobal = null;
  let selectedGlobalName = "Global Variables";
  let selectedEnvironment = null;
  let selectedEnvironmentType = "";

  // Functions to handle item clicks
  function handleGlobalClick(global) {
    selectedGlobal = global;
    selectedGlobalName = selectedGlobal.name;

    selectedEnvironment = null;
  }

  function handleEnvironmentClick(env) {
    selectedEnvironment = env; //asign env to selected environment
    selectedEnvironmentType = selectedEnvironment.type;
    selectedGlobal = null;
    selectedGlobalName = "";
  }
  // add new environment

  function addNewEnvironment() {
    let env = apiEnvironment;
    const newEnvironment = {
      name: "",
      type: "New Environment",
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
    };
    apiEnvironment.push(newEnvironment); //push new environment to api environment

    env = [...env];
    selectedEnvironment = newEnvironment;
    selectedEnvironmentType = newEnvironment.type;

    selectedGlobal = null;
    selectedGlobalName = "";

    console.log(apiEnvironment);
  }

  // Variable to store the search query
  let searchQuery = "";

  // Reactive statement to filter environments based on search query
  $: filteredEnvironments = apiEnvironment.filter((env) =>
    env.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // close all tabs
  function closeAllTabs() {
    tabs = [];
    activeTab = null;
  }

  // close selected tab
  function closeSelectedTab() {
    console.log(activeTab, "active tab");
    console.log(tabs, "tabs");
    tabs = tabs.filter((tab) => tab.name !== activeTab); // Filter out the active tab
    console.log(tabs, "tabs after close");

    // If there are still tabs open, set the active tab to the first one
    if (tabs.length > 0) {
      activeTab = tabs[0].objDetails.name;
      console.log(activeTab); //debugging purpose
    } else {
      activeTab = null; // No tabs left
    }
    console.log(activeTab); //debugging purpose
  }
</script>

<!-- toast message -->
{#if showToast}
  <Toast message={toastMessage} type={toastType} />
{/if}

<div class="flex">
  <!-- menu -->
  <div
    class="w-[6vw] lg:w-[8vw] md:w-[8vw] pt-3 bg-gray-100 text-xs flex flex-col items-center gap-4"
  >
    <div>
      <img
        src={projects.objDetails.icon}
        alt=""
        height="35"
        width="35"
        class="rounded-xl"
      />
    </div>
    {#each menuItems as item}
      <div
        on:click={() => setActiveMenu(item.name)}
        class="menu-item flex flex-col items-center gap-1 cursor-pointer"
      >
        <svg
          class="w-6 h-6 {activeMenu === item.name
            ? 'text-violet-500 '
            : 'text-gray-500 hover:text-violet-700'} dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          {@html item.icon}
        </svg>
        <span
          class="tracking-[0.04rem] text-xs font-semibold {activeMenu ===
          item.name
            ? 'text-violet-600 '
            : 'text-gray-500 hover:text-violet-800'}"
        >
          {item.name}
        </span>
      </div>
    {/each}
  </div>
  <!-- main content -->
  <!-- main content sidebar -->
  {#if activeMenu === "APIs"}
    <div class="w-[18vw] lg:w-[19.5vw] md:w-[20vw] bg-base-100 border-r p-1">
      <div class="flex justify-between items-center">
        <span
          class=" text-gray-600 ms-2 inline-block"
          style="font-size: 17px;font-weight:600">{activeMenu}</span
        >
        <!-- main button dropdown -->
        <details class="dropdown">
          <summary class="m-1 btn"
            >main <i class="fa-solid fa-chevron-down" style="font-size: 9px;"
            ></i></summary
          >
          <ul
            class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52"
          >
            <li><a>Item 1</a></li>
            <li><a>Item 2</a></li>
          </ul>
        </details>
      </div>
      <div class="mt-2 flex gap-1">
        <!-- search apis menu -->
        <form class="max-w-md">
          <label
            for="default-search"
            class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >Search</label
          >
          <div class="relative">
            <div
              class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
            >
              <svg
                class="w-3 h-3 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>

            <input
              type="search"
              id="default-search"
              class="block py-2 pl-10 w-[11vw] tracking-[0.05rem] text-xs text-gray-900 border-1 border-gray-100 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder=""
              required
              bind:value={searchApiQuery}
              on:input={handleSearchApisMenu}
            />
          </div>
        </form>
        <!-- filter button -->
        <button
          on:click={showFilterButton}
          class="bg-base-100 border-1 border-gray-100 py-1 px-2.5 rounded-md hover:bg-gray-50"
          ><svg
            class="w-4 h-4 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="2"
              d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z"
            />
          </svg>
        </button>
        <!-- import button -->
        <button
          data-testid="handleImport"
          class="bg-violet-500 border-1 border-violet-100 px-2.5 rounded-md hover:bg-violet-700"
        >
          <div class="dropdown">
            <div
              tabindex="0"
              role="button"
              class="btn p-0 hover:bg-transparent bg-transparent text-xs border-0 shadow-none m-0"
              style="height:0rem!important;max-height:0rem!important"
            >
              <svg
                class="w-4 h-4 text-white dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 12h14m-7 7V5"
                />
              </svg>
            </div>
            <ul
              tabindex="0"
              class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <a
                  onclick="my_modal_21.showModal()"
                  data-testid="importApiButton">Import</a
                >
              </li>
            </ul>
          </div>
        </button>
      </div>

      <!-- show filter button -->
      {#if filterButton}
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn m-1">
            <i class="fa-solid text-xs fa-plus text-gray-500"></i>
            <span class="text-gray-500" style="font-weight:500">Filter</span>
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            {#each filterOptions as filter}
              <li>
                <a>
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(filter)}
                    class="checkbox checkbox-xs checkbox-primary"
                    on:change={() => handleFilterChange(filter)}
                  />
                  {filter}
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      {#each selectedFilters as filter}
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn m-1">
            <span
              class="text-gray-500 grid place-items-center"
              style="font-weight:500">{getFilterButtonLabel(filter)}</span
            >
            <i
              class="fa-solid fa-times text-gray-500 text-xs cursor-pointer"
              on:click={() => removeFilter(filter)}
            ></i>
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            {#each getDropdownContent(filter) as item}
              <li>
                <a on:click={() => handleDropdownContentSelection(filter, item)}
                  >{item}</a
                >
              </li>
            {/each}
          </ul>
        </div>
      {/each}
      <!-- import modal start -->
      <dialog id="my_modal_21" class="modal">
        <div class="modal-box">
          <h3 class="text-lg font-bold">Import Data</h3>

          <div class="flex mt-3 flex-wrap items-center gap-3">
            <!-- import as postman -->
            <button
              on:click={() => triggerFileInput("postman-file-input")}
              class="border shadow-sm cursor-pointer flex justify-center items-center gap-2 px-3 py-2 rounded-md focus:text-white hover:text-white hover:bg-violet-600 focus:bg-violet-600"
            >
              <img
                src="https://assets.apidog.com/app/static/brand/postman.png"
                height="22"
                width="22"
                class="rounded-md"
                alt=""
              />
              <span
                >Postman <input
                  id="postman-file-input"
                  type="file"
                  accept=".json"
                  class="hidden"
                  on:change={importCollectionPostman}
                />
              </span>
            </button>
            <!-- import as swagger -->
            <button
              on:click={() => triggerFileInput("swagger-file-input")}
              class="border shadow-sm flex justify-center items-center gap-2 cursor-pointer px-3 py-2 rounded-md hover:text-white focus:text-white hover:bg-violet-600 focus:bg-violet-600"
            >
              <img
                src="https://assets.apidog.com/app/static/brand/openapi.png"
                height="22"
                width="22"
                class="rounded-md"
                alt=""
              />
              <span
                >Swagger <input
                  id="swagger-file-input"
                  type="file"
                  accept=".json"
                  class="hidden"
                  on:change={importCollectionSwagger}
                />
              </span>
            </button>
          </div>
          <div class="modal-action">
            <form method="dialog">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <!-- import modal end -->

      <!-- apis menu -->
      <div class="mt-2">
        <ul class="list-style-none cursor-pointer py-2" data-testid="apisMenu">
          {#each filteredProjects as api}
            <li
              class="py-2 listhover text-gray-500 tracking-[0.04rem] px-2 rounded-md flex justify-between items-center hover:bg-gray-50"
            >
              <div
                data-testid={`apiMenuList${api.id}`}
                class="flex gap-2 items-center"
                on:click={() =>
                  api.objDetails.collections
                    ? handleShowSubmenu(api.id)
                    : addTab(api)}
              >
                <svg
                  class="w-4 h-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  {@html api.objDetails.icon}
                </svg>
                <span>
                  {#if api.objDetails.collections}
                    {api.objDetails.name}
                    <i
                      class="fa-solid {showSubmenu[api.id]
                        ? 'fa-caret-down'
                        : 'fa-caret-right'} "
                      style="font-size: 10px;"
                    ></i>
                  {:else}
                    {api.objDetails.name}
                  {/if}
                </span>
              </div>
              {#if api.objDetails.name === "Endpoints" || api.objDetails.name === "Schemas"}
                <span class="hoveredContent">
                  <div class="dropdown">
                    <div
                      tabindex="0"
                      role="button"
                      class=" p-0 hover:bg-transparent bg-transparent text-xs border-0 shadow-none m-0"
                      style="height:0rem!important;max-height:0rem!important"
                    >
                      <i class="fa-solid fa-text-xs fa-plus text-gray-500"></i>
                    </div>
                    {#if api.objDetails.name === "Endpoints"}
                      <ul
                        tabindex="0"
                        class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                      >
                        <li><a>New Endpoint</a></li>
                        <li><a>New Markdown</a></li>
                        <li><a>New WebSocket</a></li>
                        <li>
                          <a onclick="my_modal_22.showModal()">New Folder</a>
                        </li>
                      </ul>
                    {:else}
                      <ul
                        tabindex="0"
                        class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                      >
                        <li><a>New Schema</a></li>
                        <li>
                          <a onclick="my_modal_23.showModal()">New Folder</a>
                        </li>
                      </ul>
                    {/if}
                  </div>
                </span>
              {/if}
            </li>

            {#if showSubmenu[api.id]}
              {#if api.objDetails.collections}
                {#each api.objDetails.collections as collection}
                  <ul class="list-style-none">
                    <li
                      class="py-1 text-gray-500 text-sm tracking-[0.04rem] ps-3 rounded-md flex justify-between gap-1 items-center hover:bg-gray-50"
                    >
                      <div
                        data-testid={`showSubmenu${collection.id}`}
                        on:click={() =>
                          collection.objDetails.schemas
                            ? handleShowSchemas(collection.id)
                            : handleShowEndpoints(collection.id)}
                        class="flex gap-1 items-center"
                      >
                        {#if collection.objDetails.endpoints || collection.objDetails.schemas}
                          <i
                            class="fa-solid {showSchemas[collection.id]
                              ? 'fa-chevron-down'
                              : 'fa-chevron-right'}"
                            style="font-size: 9px;"
                          ></i>
                        {/if}

                        <svg
                          class="w-4 h-4 text-gray-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {@html collection.objDetails.icon}
                        </svg>
                        <span>
                          {collection.objDetails.name}
                          <span class="text-gray-400">
                            ({collection.objDetails.endpoints
                              ? collection.objDetails.endpoints.length
                              : collection.objDetails.schemas.length})
                          </span>
                        </span>
                      </div>
                      <span>
                        <i
                          class="fa-solid fa-plus text-xs"
                          on:click={api.objDetails.name === "Endpoints"
                            ? handleNewEndpointClick
                            : handleNewSchemaClick}
                        ></i>
                        <details class="dropdown">
                          <summary
                            class="btn hover:bg-transparent py-0 px-1 bg-transparent border-0 shadow-none m-0"
                            style="height:0rem!important;max-height:0rem!important;min-height:1rem!important"
                          >
                            <i class="fa-solid fa-ellipsis text-xs"></i>
                          </summary>
                          <ul
                            class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                          >
                            <details class="dropdown dropdown-right">
                              <summary
                                class="btn hover:bg-transparent p-0 bg-transparent border-0 shadow-none m-0 w-full"
                                style="height:0rem!important;max-height:0rem!important"
                              >
                                <li class="w-full text-gray-500">
                                  <a>Export</a>
                                </li>
                              </summary>
                              <ul
                                class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                              >
                                <li>
                                  <a
                                    on:click={() =>
                                      exportCollectionPostman(collection)}
                                    >Export as Postman</a
                                  >
                                </li>
                                <li>
                                  <a
                                    on:click={() =>
                                      exportCollectionSwagger(collection)}
                                    >Export as Swagger</a
                                  >
                                </li>
                              </ul>
                            </details>
                            <li class="w-full">
                              <a
                                on:click={() =>
                                  deleteCollection(collection.id, api)}
                                >Delete</a
                              >
                            </li>
                          </ul>
                        </details>
                      </span>
                    </li>
                    {#if showEndpoints[collection.id]}
                      {#if filteredEndpoints.length > 0}
                        {#each filteredEndpoints as endpoint}
                          <ul
                            class="list-style-none"
                            data-testid={`showEndpoints${collection.id}`}
                          >
                            <li
                              on:click={() =>
                                openEndpointResponses(endpoint.id)}
                              class="py-1 text-gray-500 text-sm tracking-[0.04rem] ps-5 rounded-md flex gap-1 items-center hover:bg-gray-50"
                            >
                              {#if endpoint.responses.length > 0}
                                <i
                                  style="font-size: 9px;"
                                  class="fa-solid {showEndpointsResponses[
                                    endpoint.id
                                  ]
                                    ? 'fa-chevron-down'
                                    : 'fa-chevron-right'}"
                                ></i>
                              {/if}
                              <span
                                class="ps-1 font-bold text-xs {endpoint.method ===
                                'GET'
                                  ? 'text-green-600'
                                  : ''}">{endpoint.method}</span
                              >
                              <span
                                class=" ps-1"
                                style="font-size: 12px;"
                                data-testid={`addEndpointToTab${endpoint.id}`}
                                on:click={() => addTab(endpoint)}
                                >{endpoint.name}
                                ({endpoint.responses.length})</span
                              >
                            </li>

                            {#if showEndpointsResponses[endpoint.id] && endpoint.responses.length > 0}
                              {#each endpoint.responses as response}
                                <ul
                                  class="list-style-none ps-1"
                                  data-testid={`showEndpointResponses${endpoint.id}`}
                                >
                                  <li
                                    class="py-1 text-gray-500 text-xs tracking-[0.04rem] ps-5 rounded-md flex gap-1 items-center hover:bg-gray-50"
                                  >
                                    <svg
                                      class="w-4 h-4 text-violet-600 dark:text-white"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z"
                                      />
                                      <path
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                                      />
                                    </svg>

                                    <span
                                      on:click={() =>
                                        addTab(endpoint, response)}
                                      >{response.description}</span
                                    >
                                  </li>
                                </ul>
                              {/each}
                            {/if}
                          </ul>
                        {/each}
                      {/if}
                    {/if}
                    {#if showSchemas[collection.id]}
                      {#each collection.objDetails.schemas as schema}
                        <ul class="list-style-none">
                          <li
                            class="py-1 text-gray-500 text-sm tracking-[0.04rem] ps-5 rounded-md flex gap-1 items-center hover:bg-gray-50"
                          >
                            <svg
                              class="w-4 h-4 text-violet-600 dark:text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z"
                              />
                              <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                              />
                            </svg>

                            <span on:click={() => addTab(schema)}
                              >{schema.name}</span
                            >
                          </li>
                        </ul>
                      {/each}
                    {/if}
                  </ul>
                {/each}
              {/if}
            {/if}
          {/each}
        </ul>
      </div>
    </div>

    <!-- new folder modal for endpoints -->
    <dialog id="my_modal_22" class="modal">
      <div class="modal-box">
        <span class="tracking-[0.06rem]" style="font-weight:520;font-size:15px"
          >New Folder</span
        >

        <div class="flex flex-col items-center mt-4">
          <form class="mx-auto w-full">
            <label
              for="name"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Name*</label
            >
            <input
              type="text"
              id="name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-violet-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder=""
              required
              bind:value={newFolderName}
            />
          </form>
          <form class="w-full mx-auto mt-2">
            <label
              for="countries"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Parent Folder</label
            >
            <select
              id="countries"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              bind:value={chooseParentFolder}
            >
              {#if filteredProjects.length > 0}
                {#each filteredProjects as api}
                  {#if api.objDetails.name === "Endpoints"}
                    <option value={api.objDetails.name}
                      >{api.objDetails.name}</option
                    >
                  {/if}
                {/each}
              {/if}
            </select>
          </form>
        </div>
        <div class="modal-action">
          <form method="dialog" class="flex gap-2 items-center">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn">Close</button>
            <button
              type="button"
              class="rounded-md px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold mx-2"
              on:click={addNewFolder}>Ok</button
            >
          </form>
        </div>
      </div>
    </dialog>

    <!-- new folder modal for schemas -->
    <dialog id="my_modal_23" class="modal">
      <div class="modal-box">
        <span class="tracking-[0.06rem]" style="font-weight:520;font-size:15px"
          >New Folder</span
        >

        <div class="flex flex-col items-center mt-4">
          <form class="mx-auto w-full">
            <label
              for="name"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Name*</label
            >
            <input
              type="text"
              id="name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-violet-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder=""
              required
              bind:value={newFolderName}
            />
          </form>
          <form class="w-full mx-auto mt-2">
            <label
              for="countries"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Parent Folder</label
            >
            <select
              id="countries"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              bind:value={chooseParentFolder}
            >
              {#if filteredProjects.length > 0}
                {#each filteredProjects as api}
                  {#if api.objDetails.name === "Schemas"}
                    <option value={api.objDetails.name}
                      >{api.objDetails.name}</option
                    >
                  {/if}
                {/each}
              {/if}
            </select>
          </form>
        </div>
        <div class="modal-action">
          <form method="dialog" class="flex gap-2 items-center">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn">Close</button>
            <button
              type="button"
              class="rounded-md px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold mx-2"
              on:click={addNewFolderInSchemas}>Ok</button
            >
          </form>
        </div>
      </div>
    </dialog>

    <div class="mt-2 mx-2 relative">
      {#if activeTab}
        <div class="flex items-start w-[68vw]">
          <div role="tablist" class="tabs tabs-lifted">
            {#if tabs.length > 0}
              {#each tabs as tab}
                <input
                  data-testid={activeTab}
                  type="radio"
                  name="my_tabs_2"
                  role="tab"
                  checked={activeTab}
                  style="width: 8vw!important;"
                  class="relative tab bg-base-100 tracking-[0.05rem] text-xs truncate checked:bg-gray-100 checked:text-gray-600 px-3 checked:font-semibold flex justify-center"
                  aria-label={tab.name || tab.objDetails.name}
                />
                <div
                  role="tabpanel"
                  class="tab-content bg-gray-100 border-base-300 rounded-box p-3 lg:w-[63vw] w-[68vw]"
                >
                  <!-- schema tab  -->
                  {#if tab.label === "schema"}
                    <div class="flex justify-between items-center">
                      <span class="text-lg font-medium text-gray-500"
                        >{tab.name ? tab.name : tab.objDetails.name}</span
                      >
                      <div>
                        <button
                          on:click={() => saveSchemasTab(tab)}
                          type="button"
                          class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-3 py-2 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                          >Save</button
                        >
                        <button
                          type="button"
                          class="py-2 px-3 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                          >Delete</button
                        >
                      </div>
                    </div>

                    <div class="my-3">
                      <div class="flex justify-between items-center">
                        <div></div>
                        <div class="flex items-center gap-1">
                          <button
                            on:click={() => previewTab(tab)}
                            class="bg-gray-50 py-1 px-3 hover:bg-gray-100 border border-gray-300 cursor-pointer text-xs"
                            >Preview</button
                          >
                          <button
                            class="bg-gray-50 py-1 px-3 hover:bg-gray-100 border border-gray-300 cursor-pointer text-xs flex items-center gap-1"
                            ><svg
                              class="w-4 h-4 text-gray-800 dark:text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="m8 8-4 4 4 4m8 0 4-4-4-4m-2-3-4 14"
                              />
                            </svg>
                            Generate Code</button
                          >
                          <button
                            class="bg-gray-50 py-1 px-3 hover:bg-gray-100 border border-gray-300 cursor-pointer text-xs"
                            >Json Schema</button
                          >
                        </div>
                      </div>

                      <dialog id="my_modal_32" class="modal">
                        <div class="modal-box">
                          <h3 class="text-lg font-bold">Preview</h3>
                          <textarea
                            class="w-full h-64 p-2 border border-gray-300"
                            readonly
                            bind:value={previewContent}
                          ></textarea>
                        </div>
                        <form method="dialog" class="modal-backdrop">
                          <button class="btn">Close</button>
                        </form>
                      </dialog>

                      <div class="relative overflow-x-auto">
                        <table
                          class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          <thead
                            class="text-xs text-gray-900 uppercase dark:text-gray-400"
                          >
                            <tr>
                              <th
                                scope="col"
                                class="px-4 py-2 border text-violet-600 font-semibold border-gray-300"
                                >Root</th
                              >
                              <th
                                scope="col"
                                class="px-4 py-2 border border-gray-300"
                                >Object</th
                              >
                              <th
                                scope="col"
                                class="px-4 py-2 border border-gray-300"
                                >Mock</th
                              >
                              <th
                                scope="col"
                                class="px-4 py-2 border border-gray-300"
                                >Description</th
                              >
                              <th
                                scope="col"
                                class="px-4 py-2 border border-gray-300"
                              ></th>
                            </tr>
                          </thead>
                          <tbody>
                            {#each tab.fields as field, index}
                              <tr class="bg-white dark:bg-gray-800">
                                <td
                                  class="px-4 py-2 border border-gray-300 flex items-center"
                                >
                                  {#if field.type === "array" && field.items}
                                    <i
                                      class="fa-solid fa-caret-right"
                                      style="font-size: 9px;"
                                      on:click={() => showSubItem(index)}
                                    ></i>
                                  {/if}
                                  <input
                                    type="text"
                                    bind:value={field.name}
                                    class=" text-sm w-full py-1 border-none bg-transparent focus:outline-none"
                                  />
                                </td>
                                <td
                                  class="px-4 py-2 border border-gray-300 text-green-600"
                                >
                                  <select
                                    bind:value={field.type}
                                    class="w-full py-1 text-sm border-none bg-transparent focus:outline-none text-green-600"
                                  >
                                    <option value="integer<int64>"
                                      >integer<int64></int64></option
                                    >
                                    <option value="Category">Category</option>
                                    <option value="string">string</option>
                                    <option value="array">array</option>
                                    <!-- Add more options as needed -->
                                  </select>
                                </td>
                                <td class="px-4 py-2 border border-gray-300">
                                  <input
                                    type="text"
                                    bind:value={field.mock}
                                    class="w-full py-1 text-sm border-none bg-transparent focus:outline-none"
                                  />
                                </td>
                                <td class="px-4 py-2 border border-gray-300">
                                  <input
                                    type="text"
                                    bind:value={field.description}
                                    class="w-full py-1 border-none text-sm bg-transparent focus:outline-none"
                                  />
                                </td>
                                <td class=" border border-gray-300">
                                  <div class="flex items-center gap-1 px-2">
                                    <i
                                      on:click={() => addField(tab, index)}
                                      class="fa-solid fa-plus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-green-600"
                                    ></i>
                                    <i
                                      on:click={() => removeField(tab, index)}
                                      class="fa-solid fa-minus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-violet-600"
                                    ></i>
                                  </div>
                                </td>
                              </tr>
                              {#if field.type === "array" && field.items && showItem[index]}
                                {#each field.items as item, itemIndex}
                                  <tr class="bg-gray-50 dark:bg-gray-700">
                                    <td
                                      class="px-5 py-2 border border-gray-300"
                                    >
                                      <input
                                        type="text"
                                        bind:value={item.name}
                                        class="w-full py-1 text-xs border-none bg-transparent focus:outline-none"
                                      />
                                    </td>
                                    <td
                                      class="px-4 py-2 text-xs border border-gray-300 text-green-600"
                                    >
                                      <select
                                        bind:value={item.type}
                                        class="w-full text-xs border-none bg-transparent focus:outline-none text-green-600"
                                      >
                                        <option value="integer<int64>"
                                          >integer<int64></int64></option
                                        >
                                        <option value="Category"
                                          >Category</option
                                        >
                                        <option value="string">string</option>
                                        <option value="array">array</option>
                                        <!-- Add more options as needed -->
                                      </select>
                                    </td>
                                    <td
                                      class="px-4 py-2 text-xs border border-gray-300"
                                    >
                                      <input
                                        type="text"
                                        bind:value={item.mock}
                                        class="w-full py-1 text-xs border-none bg-transparent focus:outline-none"
                                      />
                                    </td>
                                    <td
                                      class="px-4 py-2 text-xs border border-gray-300"
                                    >
                                      <input
                                        type="text"
                                        bind:value={item.description}
                                        class="w-full py-1 border-none text-xs bg-transparent focus:outline-none"
                                      />
                                    </td>
                                    <td
                                      class="px-4 py-2 border border-gray-300 flex gap-1"
                                      colspan="3"
                                    >
                                      <i
                                        class="fa-solid fa-plus w-5 h-5 flex justify-center items-center border border-gray-300 bg-gray-50 rounded-full text-xs text-green-600"
                                        on:click={() => addItem(field)}
                                      ></i>
                                      <i
                                        class="fa-solid fa-minus w-5 h-5 flex justify-center items-center border border-gray-300 bg-gray-50 rounded-full text-xs text-violet-600"
                                        on:click={() =>
                                          removeItem(field, itemIndex)}
                                      ></i>
                                    </td>
                                  </tr>
                                {/each}
                              {/if}
                            {/each}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  {/if}

                  <!-- new schema tab -->
                  {#if tab.label === "newSchema"}
                    <div class="flex gap-1 items-center mt-3">
                      <div class=" w-full">
                        <input
                          type="text"
                          style="font-weight: 520;"
                          class="py-1.5 rounded-md text-sm px-2 w-full border-1 border-gray-100 focus:border-violet-300 tracking-[0.06rem]"
                          placeholder=""
                          bind:value={tab.name}
                        />
                      </div>
                      <button
                        on:click={() => saveSchemasTab(tab)}
                        type="button"
                        class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                        >Save</button
                      >
                    </div>
                    <div class=" w-full my-3">
                      <textarea
                        rows="3"
                        style="font-weight: 520;"
                        class="py-1.5 rounded-md text-sm px-2 w-full border-1 border-gray-100 focus:border-violet-300 tracking-[0.06rem] placeholder:text-sm"
                        placeholder="Add an easy-to-understand schema description"
                        bind:value={tab.description}
                      />
                    </div>

                    {#if newCollectionFolderSchemas}
                      <div
                        class="absolute z-50 border border-gray-200 shadow-xl top-[19%] left-[13%] w-[30vw] max-w-[40vw] rounded-lg bg-base-100 p-3"
                      >
                        <div class="flex justify-between items-center">
                          <span
                            class="tracking-[0.06rem]"
                            style="font-weight:520;font-size:15px"
                            >Save Schema</span
                          >
                          <i
                            class="fa-solid fa-times text-gray-500 cursor-pointer text-sm"
                            on:click={() =>
                              (newCollectionFolderSchemas = false)}
                          ></i>
                        </div>
                        <div class="flex flex-col items-center mt-4">
                          <form class="w-full mx-auto mb-3">
                            <label
                              for="countries"
                              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >Parent Folder</label
                            >
                            <select
                              id="countries"
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              bind:value={chooseParentFolderSchemas}
                            >
                              {#if filteredProjects.length > 0}
                                {#each filteredProjects as api}
                                  {#if api.objDetails.name === "Schemas"}
                                    <option value={api.objDetails.name}
                                      >{api.objDetails.name}</option
                                    >
                                    {#if api.objDetails.collections}
                                      {#each api.objDetails.collections as collection}
                                        <option
                                          value={collection.objDetails.name}
                                          >{collection.objDetails.name}</option
                                        >
                                      {/each}
                                    {/if}
                                  {/if}
                                {/each}
                              {/if}
                            </select>
                          </form>
                          {#if showNameInput}
                            <form class="mx-auto w-full mb-5">
                              <label
                                for="name"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >Name*</label
                              >
                              <input
                                type="text"
                                id="name"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-violet-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder=""
                                required
                                bind:value={newSchemaFolderName}
                              />
                            </form>
                          {/if}
                        </div>
                        <div class="modal-action">
                          <form method="dialog" class="flex">
                            <!-- if there is a button in form, it will close the modal -->
                            <button
                              type="button"
                              class="rounded-md px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-500 text-xs font-semibold"
                              on:click={() =>
                                (newCollectionFolderSchemas = false)}
                              >Cancel</button
                            >
                            <button
                              type="button"
                              class="rounded-md px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold mx-2"
                              on:click={addNewFolderForSchema}>Ok</button
                            >
                          </form>
                        </div>
                      </div>
                    {/if}

                    <div class="my-3">
                      <div class="flex justify-between items-center">
                        <div></div>
                        <div class="flex items-center gap-1">
                          <button
                            on:click={() => previewTab(tab)}
                            class="bg-gray-50 py-1 px-3 hover:bg-gray-100 border border-gray-300 cursor-pointer text-xs"
                            >Preview</button
                          >
                          <button
                            class="bg-gray-50 py-1 px-3 hover:bg-gray-100 border border-gray-300 cursor-pointer text-xs flex items-center gap-1"
                            ><svg
                              class="w-4 h-4 text-gray-800 dark:text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="m8 8-4 4 4 4m8 0 4-4-4-4m-2-3-4 14"
                              />
                            </svg>
                            Generate Code</button
                          >
                          <button
                            class="bg-gray-50 py-1 px-3 hover:bg-gray-100 border border-gray-300 cursor-pointer text-xs"
                            >Json Schema</button
                          >
                        </div>
                      </div>

                      <dialog id="my_modal_32" class="modal">
                        <div class="modal-box">
                          <h3 class="text-lg font-bold">Preview</h3>
                          <textarea
                            class="w-full h-64 p-2 border border-gray-300"
                            readonly
                            bind:value={previewContent}
                          ></textarea>
                        </div>
                        <form method="dialog" class="modal-backdrop">
                          <button class="btn">Close</button>
                        </form>
                      </dialog>

                      <div class="relative overflow-x-auto">
                        <table
                          class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          <thead
                            class="text-xs text-gray-900 uppercase dark:text-gray-400"
                          >
                            <tr>
                              <th
                                scope="col"
                                class="px-4 py-2 border text-violet-600 font-semibold border-gray-300"
                                >Root</th
                              >
                              <th
                                scope="col"
                                class="px-4 py-2 border border-gray-300"
                                >Object</th
                              >
                              <th
                                scope="col"
                                class="px-4 py-2 border border-gray-300"
                                >Mock</th
                              >
                              <th
                                scope="col"
                                class="px-4 py-2 border border-gray-300"
                                >Description</th
                              >
                              <th
                                scope="col"
                                class="px-4 py-2 border border-gray-300"
                              ></th>
                            </tr>
                          </thead>
                          <tbody>
                            {#each tab.fields as field, index}
                              <tr class="bg-white dark:bg-gray-800">
                                <td
                                  class="px-4 py-2 border border-gray-300 flex items-center"
                                >
                                  {#if field.type === "array" && field.items}
                                    <i
                                      class="fa-solid fa-caret-right"
                                      style="font-size: 9px;"
                                      on:click={() => showSubItem(index)}
                                    ></i>
                                  {/if}
                                  <input
                                    type="text"
                                    bind:value={field.name}
                                    class=" text-sm w-full py-1 border-none bg-transparent focus:outline-none"
                                  />
                                </td>
                                <td
                                  class=" border border-gray-300 text-green-600"
                                >
                                  <select
                                    bind:value={field.type}
                                    class="w-full px-4 py-2 h-full shadow-none text-sm border-none bg-transparent focus:outline-none text-green-600"
                                  >
                                    <option value="" selected disabled
                                      >choose type<int64></int64></option
                                    >

                                    <option value="integer<int64>"
                                      >integer<int64></int64></option
                                    >
                                    <option value="Category">Category</option>
                                    <option value="string">string</option>
                                    <option value="array">array</option>
                                    <!-- Add more options as needed -->
                                  </select>
                                </td>
                                <td class="px-4 py-2 border border-gray-300">
                                  <input
                                    type="text"
                                    bind:value={field.mock}
                                    class="w-full py-1 text-sm border-none bg-transparent focus:outline-none"
                                  />
                                </td>
                                <td class="px-4 py-2 border border-gray-300">
                                  <input
                                    type="text"
                                    bind:value={field.description}
                                    class="w-full py-1 border-none text-sm bg-transparent focus:outline-none"
                                  />
                                </td>
                                <td class=" border border-gray-300">
                                  <div class="flex items-center gap-1 px-2">
                                    <i
                                      on:click={() => addField(tab, index)}
                                      class="fa-solid fa-plus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-green-600"
                                    ></i>
                                    <i
                                      on:click={() => removeField(tab, index)}
                                      class="fa-solid fa-minus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-violet-600"
                                    ></i>
                                  </div>
                                </td>
                              </tr>
                              {#if field.type === "array" && field.items && showItem[index]}
                                {#each field.items as item, itemIndex}
                                  <tr class="bg-gray-50 dark:bg-gray-700">
                                    <td
                                      class="px-5 py-2 border border-gray-300"
                                    >
                                      <input
                                        type="text"
                                        bind:value={item.name}
                                        class="w-full py-1 text-xs border-none bg-transparent focus:outline-none"
                                      />
                                    </td>
                                    <td
                                      class="px-4 py-2 text-xs border border-gray-300 text-green-600"
                                    >
                                      <select
                                        bind:value={item.type}
                                        class="w-full text-xs border-none bg-transparent focus:outline-none text-green-600"
                                      >
                                        <option value="integer<int64>"
                                          >integer<int64></int64></option
                                        >
                                        <option value="Category"
                                          >Category</option
                                        >
                                        <option value="string">string</option>
                                        <option value="array">array</option>
                                        <!-- Add more options as needed -->
                                      </select>
                                    </td>
                                    <td
                                      class="px-4 py-2 text-xs border border-gray-300"
                                    >
                                      <input
                                        type="text"
                                        bind:value={item.mock}
                                        class="w-full py-1 text-xs border-none bg-transparent focus:outline-none"
                                      />
                                    </td>
                                    <td
                                      class="px-4 py-2 text-xs border border-gray-300"
                                    >
                                      <input
                                        type="text"
                                        bind:value={item.description}
                                        class="w-full py-1 border-none text-xs bg-transparent focus:outline-none"
                                      />
                                    </td>
                                    <td
                                      class="px-4 py-2 border border-gray-300 flex gap-1"
                                      colspan="3"
                                    >
                                      <i
                                        class="fa-solid fa-plus w-5 h-5 flex justify-center items-center border border-gray-300 bg-gray-50 rounded-full text-xs text-green-600"
                                        on:click={() => addItem(field)}
                                      ></i>
                                      <i
                                        class="fa-solid fa-minus w-5 h-5 flex justify-center items-center border border-gray-300 bg-gray-50 rounded-full text-xs text-violet-600"
                                        on:click={() =>
                                          removeItem(field, itemIndex)}
                                      ></i>
                                    </td>
                                  </tr>
                                {/each}
                              {/if}
                            {/each}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  {/if}

                  <!-- overview tab -->
                  {#if tab.objDetails && tab.objDetails.name === "Overview"}
                    <div class="my-2">
                      <div
                        class="border p-3 border-gray-300 rounded-md flex justify-between items-center"
                      >
                        <div class="flex flex-col gap-1 items-center">
                          <span class="text-xl font-semibold"
                            >{tab.objDetails.endpoints}</span
                          >
                          <span class="text-xs">Endpoints</span>
                        </div>
                        <div class="flex flex-col gap-1 items-center">
                          <span class="text-xl font-semibold"
                            >{tab.objDetails.cases}</span
                          >
                          <span class="text-xs">Cases</span>
                        </div>
                        <div class="flex flex-col gap-1 items-center">
                          <span class="text-xl font-semibold"
                            >{tab.objDetails.docs}</span
                          >
                          <span class="text-xs">Docs</span>
                        </div>
                        <div class="flex flex-col gap-1 items-center">
                          <span class="text-xl font-semibold"
                            >{tab.objDetails.schemas}</span
                          >
                          <span class="text-xs">Schemas</span>
                        </div>
                        <div class="flex flex-col gap-1 items-center">
                          <span class="text-xl font-semibold"
                            >{tab.objDetails.testScenarios}</span
                          >
                          <span class="text-xs">Test Scenarios</span>
                        </div>
                      </div>
                    </div>
                  {/if}

                  <!-- if tab.id is endpoint open the endpoint tab -->
                  {#if tab.label === "endpoint"}
                    {#if tabApiResponse && tabApiResponse.description}
                      <div class="flex justify-between items-center">
                        <span
                          class="text-sm font-medium tracking-[0.06rem] text-violet-700"
                          >{tab.name}&nbsp;<span class="text-gray-800"
                            >({tabApiResponse.description})</span
                          ></span
                        >
                        <div class="flex gap-1 items-center">
                          <button
                            class="py-2 tracking-[0.05rem] px-3 text-white border border-violet-600 bg-violet-600 hover:bg-violet-800 rounded-md text-xs"
                            >Send</button
                          >
                          <button
                            class="py-2 tracking-[0.05rem] px-2 border border-gray-300 bg-base-100 hover:bg-gray-100 rounded-md text-xs"
                            >Save</button
                          >
                          <button
                            class="py-2 border border-gray-300 tracking-[0.05rem] px-2 bg-base-100 hover:bg-gray-100 rounded-md text-xs"
                            >Delete
                          </button>
                        </div>
                      </div>
                      <!-- api method and path -->
                      <div class="mt-2 flex items-center gap-1 w-full">
                        <select
                          name=""
                          id=""
                          class="py-1.5 rounded-md px-2 border-gray-200 text-xs tracking-[0.06rem] w-fit"
                          bind:value={tab.method}
                        >
                          <option
                            value="GET"
                            class="text-green-600 font-semibold"
                            selected>GET</option
                          >
                          <option
                            value="POST"
                            class="text-violet-600 font-semibold">POST</option
                          >
                          <option
                            value="DELETE "
                            class="text-red-600 font-semibold">DELETE</option
                          >
                        </select>
                        <input
                          type="text"
                          class="py-1.5 rounded-md text-xs px-2 w-full border-gray-200 tracking-[0.06rem]"
                          placeholder=""
                          bind:value={tab.path}
                        />
                      </div>

                      <!-- request tabs -->
                      <div role="tablist" class="tabs tabs-lifted mt-3">
                        <!-- params tab -->
                        <input
                          type="radio"
                          name="my_tabs_15"
                          role="tab"
                          aria-label="Params"
                          class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                          checked
                        />
                        <div
                          role="tabpanel"
                          class="tab-content bg-base-100 border-base-300 rounded-box p-3"
                        >
                          <span class="text-gray-400" style="font-weight: 600;"
                            >Query Params</span
                          >
                          <div class="relative overflow-x-auto mt-1">
                            <table
                              class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              <thead
                                class="text-xs text-gray-900 uppercase dark:text-gray-400"
                              >
                                <tr>
                                  <th
                                    scope="col"
                                    class="px-4 py-2 border border-gray-300 text-gray-600"
                                  >
                                    Name
                                  </th>
                                  <th
                                    scope="col"
                                    class="px-4 py-2 border border-gray-300"
                                  >
                                    Type</th
                                  >
                                  <th
                                    scope="col"
                                    class="px-4 py-2 border border-gray-300"
                                  >
                                    Example
                                  </th>
                                  <th
                                    scope="col"
                                    class="px-4 py-2 border border-gray-300"
                                  >
                                    Description
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr class="bg-white dark:bg-gray-800">
                                  <td class=" border border-gray-300">
                                    <input
                                      type="text"
                                      class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                      placeholder="Add a new param"
                                    />
                                  </td>
                                  <td class=" border border-gray-300">
                                    <input
                                      type="text"
                                      class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                    />
                                  </td>
                                  <td class=" border border-gray-300">
                                    <input
                                      type="text"
                                      class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                    />
                                  </td>
                                  <td class=" border border-gray-300">
                                    <input
                                      type="text"
                                      class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <span
                            class="text-gray-400 mt-2 inline-block"
                            style="font-weight: 600;">Path Params</span
                          >
                          <div class="relative overflow-x-auto mt-1">
                            <table
                              class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              <thead
                                class="text-xs text-gray-900 uppercase dark:text-gray-400"
                              >
                                <tr>
                                  <th
                                    scope="col"
                                    class="px-4 py-2 border border-gray-300 text-gray-600"
                                  >
                                    Name
                                  </th>
                                  <th
                                    scope="col"
                                    class="px-4 py-2 border border-gray-300"
                                  >
                                    Type</th
                                  >
                                  <th
                                    scope="col"
                                    class="px-4 py-2 border border-gray-300"
                                  >
                                    Example
                                  </th>
                                  <th
                                    scope="col"
                                    class="px-4 py-2 border border-gray-300"
                                  >
                                    Description
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr class="bg-white dark:bg-gray-800">
                                  <td class=" border border-gray-300">
                                    <input
                                      type="text"
                                      class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                      placeholder="Add a new param"
                                    />
                                  </td>
                                  <td class=" border border-gray-300">
                                    <input
                                      type="text"
                                      class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                    />
                                  </td>
                                  <td class=" border border-gray-300">
                                    <input
                                      type="text"
                                      class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                    />
                                  </td>
                                  <td class=" border border-gray-300">
                                    <input
                                      type="text"
                                      class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <!-- body tab -->
                        <input
                          type="radio"
                          name="my_tabs_15"
                          role="tab"
                          aria-label="Body"
                          class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                        />
                        <div
                          role="tabpanel"
                          class="tab-content bg-base-100 border-base-300 rounded-box p-3"
                        >
                          <div role="tablist" class="tabs tabs-lifted mt-2">
                            <!-- none tab -->
                            <input
                              type="radio"
                              name="my_tabs_16"
                              role="tab"
                              aria-label="none"
                              class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                              checked
                            />
                            <div
                              role="tabpanel"
                              class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
                            >
                              <div
                                class="flex justify-center items-center h-[8vh] text-xs tracking-[0.06rem] text-gray-500"
                              >
                                This request has no body parameters.
                              </div>
                            </div>

                            <!-- form-data -->
                            <input
                              type="radio"
                              name="my_tabs_16"
                              role="tab"
                              aria-label="form-data"
                              style="width:9vw!important"
                              class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                            />
                            <div
                              role="tabpanel"
                              class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
                            >
                              <div class="relative overflow-x-auto mt-1">
                                <table
                                  class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                >
                                  <thead
                                    class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                  >
                                    <tr>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300 text-gray-600"
                                      >
                                        Name
                                      </th>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                        Type</th
                                      >
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                        Example
                                      </th>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                        Description
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr class="bg-white dark:bg-gray-800">
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          placeholder="Add a new param"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <!-- x-www-form -->
                            <input
                              type="radio"
                              name="my_tabs_16"
                              role="tab"
                              style="width:9vw!important"
                              aria-label="x-www-form"
                              class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                            />
                            <div
                              role="tabpanel"
                              class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
                            >
                              <div class="relative overflow-x-auto mt-1">
                                <table
                                  class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                >
                                  <thead
                                    class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                  >
                                    <tr>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300 text-gray-600"
                                      >
                                        Name
                                      </th>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                        Type</th
                                      >
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                        Example
                                      </th>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                        Description
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr class="bg-white dark:bg-gray-800">
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          placeholder="Add a new param"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <!-- json -->
                            <input
                              type="radio"
                              name="my_tabs_16"
                              role="tab"
                              aria-label="json"
                              class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                            />
                            <div
                              role="tabpanel"
                              class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
                            >
                              <div class="relative overflow-x-auto mt-1">
                                <table
                                  class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                >
                                  <thead
                                    sd
                                    class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                  >
                                    <tr>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                        style="color: rgb(124,58,237);"
                                      >
                                        Root
                                      </th>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                        style="color:blue"
                                      >
                                        Object</th
                                      >
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                        Mock
                                      </th>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                        Description
                                      </th>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr class="bg-white dark:bg-gray-800">
                                      <td class=" border border-gray-300">
                                        <select
                                          name=""
                                          id=""
                                          class="px-1 py-2 w-full h-full text-xs shadow-none text-gray-600 tracking-[0.06rem] border-0 focus:outline-none placeholder:text-gray-400 placeholder:text-sm"
                                        >
                                          <option value="" disabled selected
                                            >Choose Fields</option
                                          >
                                        </select>
                                      </td>
                                      <td class=" border border-gray-300">
                                        <select
                                          name=""
                                          id=""
                                          class="px-3 py-2 w-full h-full text-xs shadow-none text-gray-600 tracking-[0.06rem] border-0 focus:outline-none placeholder:text-gray-400 placeholder:text-sm"
                                        >
                                          <option value="" selected
                                            >String</option
                                          >
                                        </select>
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-3 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          placeholder="Mock"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-3 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <div
                                          class="flex items-center gap-1 px-2"
                                        >
                                          <i
                                            on:click={() =>
                                              addField(tab, index)}
                                            class="fa-solid fa-plus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-green-600"
                                          ></i>
                                          <i
                                            on:click={() =>
                                              removeField(tab, index)}
                                            class="fa-solid fa-minus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-violet-600"
                                          ></i>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <!--xml -->
                            <input
                              type="radio"
                              name="my_tabs_16"
                              role="tab"
                              aria-label="xml"
                              class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                            />
                            <div
                              role="tabpanel"
                              class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
                            >
                              <div class="relative overflow-x-auto mt-1">
                                <table
                                  class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                >
                                  <thead
                                    class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                  >
                                    <tr>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                        style="color: rgb(124,58,237);"
                                      >
                                        Root
                                      </th>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                        style="color:blue"
                                      >
                                        Object</th
                                      >
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                        Mock
                                      </th>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                        Description
                                      </th>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr class="bg-white dark:bg-gray-800">
                                      <td class=" border border-gray-300">
                                        <select
                                          name=""
                                          id=""
                                          class="px-1 py-2 w-full h-full text-xs shadow-none text-gray-600 tracking-[0.06rem] border-0 focus:outline-none placeholder:text-gray-400 placeholder:text-sm"
                                        >
                                          <option value="" disabled selected
                                            >Choose Fields</option
                                          >
                                        </select>
                                      </td>
                                      <td class=" border border-gray-300">
                                        <select
                                          name=""
                                          id=""
                                          class="px-3 py-2 w-full h-full text-xs shadow-none text-gray-600 tracking-[0.06rem] border-0 focus:outline-none placeholder:text-gray-400 placeholder:text-sm"
                                        >
                                          <option value="" selected
                                            >String</option
                                          >
                                        </select>
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-3 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          placeholder="Mock"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-3 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <div
                                          class="flex items-center gap-1 px-2"
                                        >
                                          <i
                                            on:click={() =>
                                              addField(tab, index)}
                                            class="fa-solid fa-plus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-green-600"
                                          ></i>
                                          <i
                                            on:click={() =>
                                              removeField(tab, index)}
                                            class="fa-solid fa-minus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-violet-600"
                                          ></i>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <!-- raw -->
                            <input
                              type="radio"
                              name="my_tabs_16"
                              role="tab"
                              aria-label="raw"
                              class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                            />
                            <div
                              role="tabpanel"
                              class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
                            >
                              <div class="w-[27vw] h-[37vh] mx-auto">
                                <div>
                                  <div
                                    class="text-center p-1 bg-gray-50 rounded-md"
                                  >
                                    Media Type: text/plain
                                  </div>
                                  <div class="mt-2">
                                    <span class="text-sm">Example</span>
                                    <div class=" mt-1">
                                      <textarea
                                        name=""
                                        id=""
                                        rows="3"
                                        class="w-full border border-gray-200 rounded-md p-2 focus:border-violet-600"
                                      ></textarea>
                                    </div>
                                  </div>
                                  <div class="mt-2">
                                    <span class="text-sm">Description</span>
                                    <div class=" mt-1">
                                      <textarea
                                        name=""
                                        id=""
                                        rows="1"
                                        class="w-full border border-gray-200 rounded-md p-2 focus:border-violet-600 placeholder:text-gray-400"
                                        placeholder="Support Markdown"
                                      ></textarea>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <!-- binary -->
                            <input
                              type="radio"
                              name="my_tabs_16"
                              role="tab"
                              aria-label="binary"
                              class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                            />
                            <div
                              role="tabpanel"
                              class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
                            >
                              <div class="w-[27vw] h-[15vh] mx-auto">
                                <div>
                                  <div
                                    class="text-center p-1 bg-gray-50 rounded-md"
                                  >
                                    Media Type: application/octet-stream
                                  </div>
                                  <div class="mt-2">
                                    <div class=" mt-1">
                                      <div
                                        class="flex items-center justify-center w-full"
                                      >
                                        <label
                                          for="dropzone-file"
                                          class="flex flex-col items-center justify-center w-full border-2 border-gray-200 rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                        >
                                          <div
                                            class="flex items-center gap-1 pt-2 pb-2"
                                          >
                                            <svg
                                              class="w-6 h-6 text-gray-500 dark:text-gray-400"
                                              aria-hidden="true"
                                              xmlns="http://www.w3.org/2000/svg"
                                              fill="none"
                                              viewBox="0 0 20 16"
                                            >
                                              <path
                                                stroke="currentColor"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                              />
                                            </svg>
                                            <span
                                              class="text-sm text-gray-500 dark:text-gray-400"
                                              ><span class="font-semibold"
                                                >Upload</span
                                              ></span
                                            >
                                          </div>
                                          <input
                                            id="dropzone-file"
                                            type="file"
                                            class="hidden"
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <!-- graphql -->
                            <input
                              type="radio"
                              name="my_tabs_16"
                              role="tab"
                              aria-label="GraphQl"
                              class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                            />
                            <div
                              role="tabpanel"
                              class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
                            >
                              <div
                                class="flex justify-center items-center h-[8vh] text-xs tracking-[0.06rem] text-gray-500"
                              >
                                No need to define the Body
                              </div>
                            </div>
                            <!-- mgspack -->
                            <input
                              type="radio"
                              name="my_tabs_16"
                              role="tab"
                              aria-label="mgspack"
                              class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                            />
                            <div
                              role="tabpanel"
                              class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
                            >
                              <div class="relative overflow-x-auto mt-1">
                                <table
                                  class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                >
                                  <thead
                                    class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                  >
                                    <tr>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                        style="color: rgb(124,58,237);"
                                      >
                                        Root
                                      </th>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                        style="color:blue"
                                      >
                                        Object</th
                                      >
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                        Mock
                                      </th>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                        Description
                                      </th>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr class="bg-white dark:bg-gray-800">
                                      <td class=" border border-gray-300">
                                        <select
                                          name=""
                                          id=""
                                          class="px-1 py-2 w-full h-full text-xs shadow-none text-gray-600 tracking-[0.06rem] border-0 focus:outline-none placeholder:text-gray-400 placeholder:text-sm"
                                        >
                                          <option value="" disabled selected
                                            >Choose Fields</option
                                          >
                                        </select>
                                      </td>
                                      <td class=" border border-gray-300">
                                        <select
                                          name=""
                                          id=""
                                          class="px-3 py-2 w-full h-full text-xs shadow-none text-gray-600 tracking-[0.06rem] border-0 focus:outline-none placeholder:text-gray-400 placeholder:text-sm"
                                        >
                                          <option value="" selected
                                            >String</option
                                          >
                                        </select>
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-3 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          placeholder="Mock"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-3 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <div
                                          class="flex items-center gap-1 px-2"
                                        >
                                          <i
                                            on:click={() =>
                                              addField(tab, index)}
                                            class="fa-solid fa-plus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-green-600"
                                          ></i>
                                          <i
                                            on:click={() =>
                                              removeField(tab, index)}
                                            class="fa-solid fa-minus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-violet-600"
                                          ></i>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- headers tab -->
                        <input
                          type="radio"
                          name="my_tabs_15"
                          role="tab"
                          aria-label="Headers"
                          class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                        />
                        <div
                          role="tabpanel"
                          class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                        >
                          <span class="text-gray-400" style="font-weight: 600;"
                            >Headers</span
                          >
                          <div class="relative overflow-x-auto mt-1">
                            <table
                              class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              <thead
                                class="text-xs text-gray-900 uppercase dark:text-gray-400"
                              >
                                <tr>
                                  <th
                                    scope="col"
                                    class="px-4 py-2 border border-gray-300 text-gray-600"
                                  >
                                    Name
                                  </th>
                                  <th
                                    scope="col"
                                    class="px-4 py-2 border border-gray-300"
                                  >
                                    Type</th
                                  >
                                  <th
                                    scope="col"
                                    class="px-4 py-2 border border-gray-300"
                                  >
                                    Example
                                  </th>
                                  <th
                                    scope="col"
                                    class="px-4 py-2 border border-gray-300"
                                  >
                                    Description
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr class="bg-white dark:bg-gray-800">
                                  <td class=" border border-gray-300">
                                    <input
                                      type="text"
                                      class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                      placeholder="Add a new param"
                                    />
                                  </td>
                                  <td class=" border border-gray-300">
                                    <input
                                      type="text"
                                      class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                    />
                                  </td>
                                  <td class=" border border-gray-300">
                                    <input
                                      type="text"
                                      class="px-1 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                    />
                                  </td>
                                  <td class=" border border-gray-300">
                                    <input
                                      type="text"
                                      class="px-1 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <!-- cookies tab -->
                        <input
                          type="radio"
                          name="my_tabs_15"
                          role="tab"
                          aria-label="Cookies"
                          class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                        />
                        <div
                          role="tabpanel"
                          class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                        >
                          <div class="relative overflow-x-auto mt-1">
                            <table
                              class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              <thead
                                class="text-xs text-gray-900 uppercase dark:text-gray-400"
                              >
                                <tr>
                                  <th
                                    scope="col"
                                    class="px-4 py-2 border border-gray-300 text-gray-600"
                                  >
                                    Name
                                  </th>
                                  <th
                                    scope="col"
                                    class="px-4 py-2 border border-gray-300"
                                  >
                                    Type</th
                                  >
                                  <th
                                    scope="col"
                                    class="px-4 py-2 border border-gray-300"
                                  >
                                    Example
                                  </th>
                                  <th
                                    scope="col"
                                    class="px-4 py-2 border border-gray-300"
                                  >
                                    Description
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr class="bg-white dark:bg-gray-800">
                                  <td class=" border border-gray-300">
                                    <input
                                      type="text"
                                      class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                      placeholder="Add a new param"
                                    />
                                  </td>
                                  <td class=" border border-gray-300">
                                    <input
                                      type="text"
                                      class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                    />
                                  </td>
                                  <td class=" border border-gray-300">
                                    <input
                                      type="text"
                                      class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                    />
                                  </td>
                                  <td class=" border border-gray-300">
                                    <input
                                      type="text"
                                      class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <!-- auth tab -->
                        <input
                          type="radio"
                          name="my_tabs_15"
                          role="tab"
                          aria-label="Auth"
                          class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                        />
                        <div
                          role="tabpanel"
                          class="tab-content bg-base-100 border-base-300 rounded-box p-3"
                          style="overflow-y: auto; max-height: calc(100vh - 50px);"
                        >
                          <form class="max-w-sm me-auto">
                            <label
                              for="countries"
                              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >Type</label
                            >
                            <select
                              id="auths"
                              bind:value={selectedAuthType}
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                              <option selected>Inherit from parent</option>
                              {#each tab.auth as auth}
                                <option value={auth.type}>{auth.type}</option>
                              {/each}
                            </select>

                            {#if selectedAuthType === "Bearer Token"}
                              <div class="mt-4">
                                <label
                                  for="bearerToken"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  >Bearer Token</label
                                >
                                <input
                                  type="text"
                                  id="bearerToken"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="Enter Bearer Token"
                                  bind:value={tab.auth[0].value}
                                />
                              </div>
                            {/if}

                            {#if selectedAuthType === "API Key"}
                              <div class="mt-4">
                                <label
                                  for="apiKey"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  >API Key</label
                                >
                                <input
                                  type="text"
                                  id="apiKey"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="Enter API Key"
                                  bind:value={tab.auth[1].value}
                                />
                              </div>
                            {/if}

                            {#if selectedAuthType === "Basic Auth"}
                              <div class="mt-4">
                                <label
                                  for="username"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  >Username</label
                                >
                                <input
                                  type="text"
                                  id="usernameAuth"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="Enter Username"
                                  bind:value={tab.auth[2].username}
                                />
                                <label
                                  for="password"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  >Password</label
                                >
                                <input
                                  type="password"
                                  id="passwordAuth"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="Enter Password"
                                  bind:value={tab.auth[2].password}
                                />
                              </div>
                            {/if}
                            {#if selectedAuthType === "JWT"}
                              <div class="mt-4">
                                <label
                                  for="jwtSecret"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  JWT Secret
                                </label>
                                <input
                                  type="text"
                                  id="jwtSecret"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="Enter JWT Secret"
                                  bind:value={tab.auth[3].secret}
                                />
                              </div>

                              <div class="mt-4">
                                <label
                                  for="jwtAddTo"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Add JWT to
                                </label>
                                <select
                                  id="jwtAddTo"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  bind:value={tab.auth[3].addTo}
                                >
                                  <option value="headers">Headers</option>
                                  <option value="params">Params</option>
                                </select>
                              </div>

                              <div class="mt-4">
                                <label
                                  for="jwtPayload"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  JWT Payload
                                </label>
                                <textarea
                                  id="jwtPayload"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="Enter JWT Payload"
                                  bind:value={tab.auth[3].payload}
                                ></textarea>
                              </div>
                            {/if}
                            {#if selectedAuthType === "OAuth 1.0"}
                              <div class="mt-4">
                                <label
                                  for="oauth1Token"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  OAuth 1.0 Token
                                </label>
                                <input
                                  type="text"
                                  id="oauth1Token"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="Enter OAuth 1.0 Token"
                                  bind:value={tab.auth[4].token}
                                />
                              </div>

                              <div class="mt-4">
                                <label
                                  for="oauth1OauthToken"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  OAuth Token
                                </label>
                                <input
                                  type="text"
                                  id="oauth1OauthToken"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="Enter OAuth Token"
                                  bind:value={tab.auth[4].oauthToken}
                                />
                              </div>

                              <div class="mt-4">
                                <label
                                  for="oauth1OauthTokenSecret"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  OAuth Token Secret
                                </label>
                                <input
                                  type="text"
                                  id="oauth1OauthTokenSecret"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="Enter OAuth Token Secret"
                                  bind:value={tab.auth[4].oauthTokenSecret}
                                />
                              </div>

                              <div class="mt-4">
                                <label
                                  for="oauth1ConsumerKey"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Consumer Key
                                </label>
                                <input
                                  type="text"
                                  id="oauth1ConsumerKey"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="Enter Consumer Key"
                                  bind:value={tab.auth[4].consumerKey}
                                />
                              </div>

                              <div class="mt-4">
                                <label
                                  for="oauth1ConsumerSecret"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Consumer Secret
                                </label>
                                <input
                                  type="text"
                                  id="oauth1ConsumerSecret"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="Enter Consumer Secret"
                                  bind:value={tab.auth[4].consumerSecret}
                                />
                              </div>
                            {/if}

                            {#if selectedAuthType === "OAuth 2.0"}
                              <div class="mt-4">
                                <label
                                  for="oauth2Token"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  OAuth 2.0 Token
                                </label>
                                <input
                                  type="text"
                                  id="oauth2Token"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="Enter OAuth 2.0 Token"
                                  bind:value={tab.auth[5].token}
                                />
                              </div>

                              <div class="mt-4">
                                <label
                                  for="oauth2ClientId"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Client ID
                                </label>
                                <input
                                  type="text"
                                  id="oauth2ClientId"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="Enter Client ID"
                                  bind:value={tab.auth[5].clientId}
                                />
                              </div>

                              <div class="mt-4">
                                <label
                                  for="oauth2ClientSecret"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Client Secret
                                </label>
                                <input
                                  type="text"
                                  id="oauth2ClientSecret"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="Enter Client Secret"
                                  bind:value={tab.auth[5].clientSecret}
                                />
                              </div>

                              <div class="mt-4">
                                <label
                                  for="oauth2RedirectUri"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Redirect URI
                                </label>
                                <input
                                  type="text"
                                  id="oauth2RedirectUri"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="Enter Redirect URI"
                                  bind:value={tab.auth[5].redirectUri}
                                />
                              </div>
                            {/if}

                            {#if selectedAuthType === "Digest Auth"}
                              <!-- Digest Auth -->
                              <div class="mt-4">
                                <label
                                  for="digestUsername"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Username
                                </label>
                                <input
                                  type="text"
                                  id="digestUsername"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="Enter Username"
                                  bind:value={tab.auth[6].username}
                                />
                                <label
                                  for="digestPassword"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Password
                                </label>
                                <input
                                  type="password"
                                  id="digestPassword"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="Enter Password"
                                  bind:value={tab.auth[6].password}
                                />
                              </div>
                            {/if}

                            {#if selectedAuthType === "No Auth"}
                              <div class="mt-4">
                                <p
                                  class="text-sm text-gray-900 dark:text-white"
                                >
                                  No authentication required for this endpoint.
                                </p>
                              </div>
                            {/if}
                          </form>
                        </div>
                        <!-- pre processors tab -->
                        <input
                          type="radio"
                          name="my_tabs_15"
                          role="tab"
                          aria-label="Pre"
                          class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                        />
                        <div
                          role="tabpanel"
                          class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                        ></div>
                        <!-- post processors tab -->
                        <input
                          type="radio"
                          name="my_tabs_15"
                          role="tab"
                          aria-label="Post"
                          class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                        />
                        <div
                          role="tabpanel"
                          class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                        ></div>
                        <!-- settings -->
                        <input
                          type="radio"
                          name="my_tabs_15"
                          role="tab"
                          aria-label="Settings"
                          class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                        />
                        <div
                          role="tabpanel"
                          class="tab-content bg-gray-100 border-base-300 rounded-box p-6"
                        ></div>
                      </div>
                    {:else}
                      <!-- endpoints tab -->
                      <div role="tablist" class="tabs tabs-lifted">
                        <!-- api tab -->
                        <input
                          type="radio"
                          name={`my_tabs_${tab.id}`}
                          role="tab"
                          aria-label="API"
                          class="tab hover:text-violet-700 bg-gray-100 checked:bg-checked-white text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                          checked={currentTab === "api"}
                          on:change={() => (currentTab = "api")}
                        />
                        <div
                          role="tabpanel"
                          class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                          style="overflow-y: auto; max-height: calc(100vh - 50px);"
                        >
                          <div class="">
                            <div class="flex justify-between items-center">
                              <span
                                class="text-sm font-medium tracking-[0.06rem]"
                                >{tab.name}</span
                              >
                              <div class="flex gap-1 items-center">
                                <button
                                  data-testid="switchToRunTab"
                                  class="py-2 tracking-[0.05rem] px-3 text-white border border-violet-600 bg-violet-600 hover:bg-violet-800 rounded-md text-xs"
                                  on:click={switchToRunTab}>Run</button
                                >
                                <button
                                  class="py-2 tracking-[0.05rem] px-2 border border-gray-300 bg-base-100 hover:bg-gray-100 rounded-md text-xs"
                                  >Generate Code</button
                                >
                                <button
                                  class="py-2 border border-gray-300 tracking-[0.05rem] px-2 bg-base-100 hover:bg-gray-100 rounded-md text-xs"
                                  >Delete
                                </button>
                              </div>
                            </div>
                            <!-- api method and path -->
                            <div class="flex gap-1 items-center mt-2">
                              <span
                                class="rounded-md px-2 py-1 font-semibold text-white bg-green-600"
                                >{tab.method}</span
                              >
                              <span class="tracking-[0.05rem] inline-block"
                                >{tab.path}</span
                              >
                            </div>

                            <!-- details of user  -->
                            <div class="my-3 flex gap-3 flex-wrap items-center">
                              <span
                                class="text-gray-400 text-xs tracking-[0.06rem]"
                                >Created &nbsp;<span class="text-gray-600"
                                  >{tab.created}</span
                                ></span
                              >
                              <span
                                class="text-gray-400 text-xs tracking-[0.06rem]"
                                >Updated &nbsp;<span class="text-gray-600"
                                  >{tab.lastUpdated}</span
                                ></span
                              >
                              <span
                                class="text-gray-400 text-xs tracking-[0.06rem]"
                                >Updated by &nbsp;<span class="text-gray-600"
                                  >{tab.updatedBy}</span
                                ></span
                              >
                              <span
                                class="text-gray-400 text-xs tracking-[0.06rem]"
                                >Creator &nbsp;<span class="text-gray-600"
                                  >{tab.createdBy}</span
                                ></span
                              >
                              <span
                                class="text-gray-400 text-xs tracking-[0.06rem]"
                                >Maintainer &nbsp;<span class="text-gray-600">
                                  {tab.maintainer === ""
                                    ? "Not Configured"
                                    : tab.maintainer}
                                </span></span
                              >
                              <span
                                class="text-gray-400 text-xs tracking-[0.06rem]"
                                >Folder &nbsp;<span class="text-gray-600"
                                  >{tab.folder}</span
                                ></span
                              >
                            </div>

                            <!-- request api -->
                            <div class="mt-4">
                              <span
                                class="   tracking-[0.06rem]"
                                style="font-size: 17px;font-weight:600;color:rgba(0,0,0,0.6)"
                                >Request</span
                              >
                              <div
                                class="border rounded-md mt-2 border-gray-300"
                              >
                                <div class="flex justify-between px-3 py-2">
                                  <span
                                    class="font-semibold text-gray-500 tracking-[0.06rem]"
                                    >Path Params</span
                                  >
                                  <button
                                    class="py-1 tracking-[0.05rem] px-2 border border-gray-300 bg-gray-100 hover:bg-gray-50 rounded-md text-xs"
                                    >Generate Code</button
                                  >
                                </div>
                                <div class="p-3">
                                  {#if tab.parameters[0].name}
                                    {#each tab.parameters as parameter}
                                      <div
                                        class="flex justify-between items-center tracking-[0.06rem]"
                                      >
                                        <div>
                                          <span
                                            class="bg-blue-100 text-blue-700 px-2 py-1 tracking-[0.06rem] rounded-md"
                                            >{parameter.name}</span
                                          >
                                          <span>{parameter.type}</span>
                                        </div>
                                        <span
                                          class="text-red-600 tracking-[0.06rem]"
                                          >{parameter.required
                                            ? "required"
                                            : ""}</span
                                        >
                                      </div>
                                      <div
                                        class="my-2 text-xs tracking-[0.06rem]"
                                      >
                                        {parameter.description}
                                      </div>
                                      <div
                                        class="text-xs tracking-[0.06rem] text-gray-500 flex gap-2 items-center"
                                      >
                                        <span> Example: </span>
                                        <span
                                          class="w-5 h-5 flex justify-center rounded-md items-center bg-slate-100"
                                          >{parameter.example}</span
                                        >
                                      </div>
                                    {/each}
                                  {:else}
                                    <div
                                      class=" py-2 text-center text-xs tracking-[0.06rem] text-gray-500"
                                    >
                                      There are no parameters
                                    </div>
                                  {/if}
                                </div>
                              </div>
                            </div>

                            <!-- response api -->
                            <div class="mt-4 mb-5 pb-5">
                              <span
                                class="   tracking-[0.06rem]"
                                style="font-size: 17px;font-weight:600;color:rgba(0,0,0,0.6)"
                                >Responses</span
                              >
                              <!-- response tabs -->
                              <div role="tablist" class="tabs tabs-lifted mt-2">
                                <!-- response code -->
                                {#each tab.responses as response}
                                  <input
                                    type="radio"
                                    name="my_tabs_5"
                                    role="tab"
                                    checked
                                    style="width: 12vw!important;"
                                    class="relative tab bg-base-100 tracking-[0.05rem] text-xs truncate checked:bg-gray-100 checked:text-gray-600 px-3 checked:font-semibold flex justify-center"
                                    aria-label="{response.description}({response.status})"
                                  />
                                  <div
                                    role="tabpanel"
                                    class="tab-content bg-gray-100 border-base-300 rounded-box w-full"
                                  >
                                    <div
                                      class="flex items-center gap-4 p-3 border-b border-gray-200"
                                    >
                                      <span class="text-gray-500"
                                        >HTTP Status Code : <span
                                          class="text-gray-800"
                                          >{response.status}</span
                                        >
                                      </span>
                                      <span class="text-gray-500"
                                        >Content Type : <span
                                          class="text-gray-800">JSON</span
                                        ></span
                                      >
                                    </div>
                                    <div class="flex w-full">
                                      <div
                                        class="w-[60%] border-e border-gray-200"
                                      >
                                        <div
                                          class="font-medium tracking-[0.06rem] px-3 py-2 border-b w-full"
                                        >
                                          Data Schema
                                        </div>
                                        <ul class="list-style-none mt-2">
                                          {#if response.schemas[0].name}
                                            {#each response.schemas as schema}
                                              <li
                                                class=" px-2 py-2 hover:bg-gray-50 flex justify-between items-center"
                                              >
                                                <div class="flex gap-2">
                                                  <span
                                                    class="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-semibold text-xs tracking-[0.06rem]"
                                                    >{schema.name}</span
                                                  >
                                                  <span>{schema.type}</span>
                                                </div>
                                                <span
                                                  class={schema.required
                                                    ? "text-red-600"
                                                    : "text-gray-500"}
                                                  >{schema.required
                                                    ? "required"
                                                    : "optional"}</span
                                                >
                                              </li>
                                              <!-- if schema type array then show its data -->
                                              {#if schema.type === "array" || schema.type === "array"}
                                                <ul
                                                  class="list-style-none mt-2 ms-3 border-s border-gray-200"
                                                >
                                                  {#each schema.items as item}
                                                    <li
                                                      class=" px-2 py-2 hover:bg-gray-50 flex justify-between items-center"
                                                    >
                                                      <div class="flex gap-2">
                                                        <span
                                                          class="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-semibold text-xs tracking-[0.06rem]"
                                                          >{item.name}</span
                                                        >
                                                        <span>{item.type}</span>
                                                      </div>
                                                      <span
                                                        class={item.required
                                                          ? "text-red-600"
                                                          : "text-gray-500"}
                                                        >{item.required
                                                          ? "required"
                                                          : "optional"}</span
                                                      >
                                                    </li>
                                                  {/each}
                                                </ul>
                                              {/if}
                                            {/each}
                                          {:else}
                                            <div
                                              class=" py-2 text-center text-xs tracking-[0.06rem] text-gray-500"
                                            >
                                              There are no schemas
                                            </div>
                                          {/if}
                                        </ul>
                                      </div>
                                      <div class="w-[40%]">
                                        <div
                                          class="font-medium tracking-[0.06rem] px-3 py-2 border-b w-full"
                                        >
                                          Examples
                                        </div>
                                        <!-- responses example -->

                                        <div
                                          class="text-xs p-1 tracking-[0.05rem]"
                                        >
                                          {#if response.examples && response.examples.length > 0}
                                            <pre
                                              class="json-example">{@html syntaxHighlight(
                                                JSON.stringify(
                                                  response.examples[0],
                                                  null,
                                                  2
                                                )
                                              ) || ""}</pre>
                                          {:else}
                                            <p class="p-2 text-center">
                                              No examples
                                            </p>
                                          {/if}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                {/each}
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- edit tab -->
                        <input
                          type="radio"
                          name={`my_tabs_${tab.id}`}
                          role="tab"
                          class="tab hover:text-violet-700 bg-gray-100 checked:bg-checked-white text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                          aria-label="Edit"
                          checked={currentTab === "edit"}
                          on:change={() => (currentTab = "edit")}
                        />
                        <div
                          role="tabpanel"
                          class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                          style="overflow-y: auto; max-height: calc(100vh - 50px);"
                        >
                          <!-- edit api path and method -->
                          <div class="mt-2 flex items-center gap-1 w-full">
                            <div class="flex items-center w-full gap-1">
                              <select
                                name=""
                                id=""
                                class="py-1.5 rounded-md px-2 border-gray-200 text-xs tracking-[0.06rem] w-fit"
                                bind:value={tab.method}
                              >
                                <option
                                  value="GET"
                                  class="text-green-600 font-semibold"
                                  selected>GET</option
                                >
                                <option
                                  value="POST"
                                  class="text-violet-600 font-semibold"
                                  >POST</option
                                >
                                <option
                                  value="DELETE "
                                  class="text-red-600 font-semibold"
                                  >DELETE</option
                                >
                              </select>
                              <input
                                type="text"
                                class="py-1.5 rounded-md text-xs px-2 w-full border-gray-200 tracking-[0.06rem]"
                                placeholder=""
                                bind:value={tab.path}
                              />
                            </div>
                            <button
                              class="py-2 tracking-[0.05rem] px-3 text-white border border-violet-600 bg-violet-600 hover:bg-violet-800 rounded-md text-xs"
                              on:click={() => saveEditedApiData(tab)}
                              >Save</button
                            >
                            <button
                              class="py-2 tracking-[0.05rem] px-2 border border-gray-300 bg-base-100 hover:bg-gray-100 rounded-md text-xs"
                              on:click={switchToRunTab}>Run</button
                            >
                            <button
                              class="py-2 border border-gray-300 tracking-[0.05rem] px-2 bg-base-100 hover:bg-gray-100 rounded-md text-xs"
                              >Delete
                            </button>
                          </div>
                          <!-- edit api details -->
                          <div class="mt-3 w-full">
                            <input
                              type="text"
                              style="font-weight: 520;"
                              class="py-1.5 rounded-md text-sm px-2 w-full border-1 border-gray-100 focus:border-violet-300 tracking-[0.06rem]"
                              placeholder=""
                              bind:value={tab.name}
                            />
                          </div>
                          <div class="mt-3 flex items-center w-full gap-2">
                            <div class="flex flex-col w-full">
                              <form class="w-full">
                                <label
                                  for="status"
                                  class="block mb-1 text-sm font-medium text-gray-700 dark:text-white"
                                  >Status*</label
                                >
                                <select
                                  id="status"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  bind:value={tab.status}
                                >
                                  <option selected>Released</option>
                                  <option value="US">Testing</option>
                                  <option value="CA">Deprecated</option>
                                  <option value="FR">Developing</option>
                                </select>
                              </form>
                            </div>
                            <div class="flex flex-col w-full">
                              <form class="w-full">
                                <label
                                  for="maintainer"
                                  class="block mb-1 text-sm font-medium text-gray-700 dark:text-white"
                                  >Maintainer</label
                                >
                                <input
                                  type="text"
                                  id="maintainer"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  bind:value={tab.maintainer}
                                />
                              </form>
                            </div>
                            <div class="flex flex-col w-full">
                              <form class="w-full">
                                <label
                                  for="tags"
                                  class="block mb-1 text-sm font-medium text-gray-700 dark:text-white"
                                  >Tags</label
                                >
                                <select
                                  id="tags"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  bind:value={tab.tags}
                                >
                                  <option selected>Pet</option>
                                </select>
                              </form>
                            </div>
                            <div class="flex flex-col w-full">
                              <form class="w-full">
                                <label
                                  for="service"
                                  class="block mb-1 text-sm font-medium text-gray-700 dark:text-white"
                                  >Service</label
                                >
                                <select
                                  id="service"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  bind:value={tab.service}
                                >
                                  <option value="" selected
                                    >Inherit from Parents</option
                                  >
                                </select>
                              </form>
                            </div>
                          </div>
                          <div class="flex flex-col w-full mt-2">
                            <form class="w-full">
                              <label
                                for="service"
                                class="block mb-1 text-sm font-medium text-gray-600 dark:text-white"
                                >operationId</label
                              >
                              <input
                                type="text"
                                placeholder="operationId of openAPI"
                                class="placeholder:text-gray-400 rounded-md placeholder:text-sm p-2 text-sm tracking-[0.05rem] border border-gray-300 text-gray-900"
                              />
                            </form>
                          </div>
                          <div class="flex flex-col w-full mt-2">
                            <form class="w-full">
                              <label
                                for="service"
                                class="block mb-1 text-sm font-medium text-gray-600 dark:text-white"
                                >Description</label
                              >
                              <textarea
                                name=""
                                id=""
                                rows="3"
                                placeholder="Support Markdown"
                                class="w-full rounded-md placeholder:text-gray-400 placeholder:text-sm p-2 text-sm tracking-[0.05rem] border border-gray-300 text-gray-900"
                              ></textarea>
                            </form>
                          </div>

                          <!-- request of edit tab start -->

                          <div class="mt-2">
                            <span
                              class="text-gray-500"
                              style="font-weight: 600;font-size:16px"
                              >Request</span
                            >
                            <div role="tablist" class="tabs tabs-lifted mt-2">
                              <!-- params of edit tab -->
                              <input
                                type="radio"
                                name="my_tabs_10"
                                role="tab"
                                aria-label="Params"
                                class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                                checked
                              />
                              <div
                                role="tabpanel"
                                class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
                              >
                                <span
                                  class="text-gray-400"
                                  style="font-weight: 600;">Query Params</span
                                >
                                <div class="relative overflow-x-auto mt-1">
                                  <table
                                    class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                  >
                                    <thead
                                      class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                    >
                                      <tr>
                                        <th
                                          scope="col"
                                          class="px-3 py-2 border border-gray-300 text-gray-600"
                                        >
                                          Name
                                        </th>
                                        <th
                                          scope="col"
                                          class="px-3 py-2 border border-gray-300"
                                        >
                                          Type</th
                                        >
                                        <th
                                          scope="col"
                                          class="px-3 py-2 border border-gray-300"
                                        >
                                          Example
                                        </th>
                                        <th
                                          scope="col"
                                          class="px-3 py-2 border border-gray-300"
                                        >
                                          Description
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr class="bg-white dark:bg-gray-800">
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-3 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                            placeholder="Add a new param"
                                          />
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-3 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          />
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-3 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          />
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-3 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                <span
                                  class="text-gray-400 mt-2 inline-block"
                                  style="font-weight: 600;">Path Params</span
                                >
                                <div class="relative overflow-x-auto mt-1">
                                  <table
                                    class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                  >
                                    <thead
                                      class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                    >
                                      <tr>
                                        <th
                                          scope="col"
                                          class="px-3 py-2 border border-gray-300 text-gray-600"
                                        >
                                          Name
                                        </th>
                                        <th
                                          scope="col"
                                          class="px-3 py-2 border border-gray-300"
                                        >
                                          Type</th
                                        >
                                        <th
                                          scope="col"
                                          class="px-3 py-2 border border-gray-300"
                                        >
                                          Example
                                        </th>
                                        <th
                                          scope="col"
                                          class="px-3 py-2 border border-gray-300"
                                        >
                                          Description
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <!-- parameters -->
                                      {#each tab.parameters as parameter}
                                        <!-- if parameters are path parameters -->
                                        <!-- {#if parameter.in === "path"} -->
                                        <tr class="bg-white dark:bg-gray-800">
                                          <td class=" border border-gray-300">
                                            <input
                                              type="text"
                                              class="px-3 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                              placeholder="Add a new param"
                                              bind:value={parameter.name}
                                            />
                                          </td>
                                          <td class=" border border-gray-300">
                                            <input
                                              type="text"
                                              class="px-3 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                              bind:value={parameter.type}
                                            />
                                          </td>
                                          <td class=" border border-gray-300">
                                            <input
                                              type="text"
                                              class="px-3 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                            />
                                          </td>
                                          <td class=" border border-gray-300">
                                            <input
                                              type="text"
                                              class="px-3 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                              bind:value={parameter.description}
                                            />
                                          </td>
                                        </tr>
                                        <!-- {/if} -->
                                      {/each}
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              <!-- body of edit tab -->
                              <input
                                type="radio"
                                name="my_tabs_10"
                                role="tab"
                                aria-label="Body"
                                class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                              />
                              <div
                                role="tabpanel"
                                class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
                              >
                                <div
                                  role="tablist"
                                  class="tabs tabs-lifted mt-2"
                                >
                                  <!-- none tab -->
                                  <input
                                    type="radio"
                                    name="my_tabs_13"
                                    role="tab"
                                    aria-label="none"
                                    class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                                    checked
                                  />
                                  <div
                                    role="tabpanel"
                                    class="tab-content bg-base-100 border-base-300 rounded-box p-3"
                                  >
                                    <div
                                      class="flex justify-center items-center h-[8vh] text-xs tracking-[0.06rem] text-gray-500"
                                    >
                                      This request has no body parameters.
                                    </div>
                                  </div>

                                  <!-- form-data -->
                                  <input
                                    type="radio"
                                    name="my_tabs_13"
                                    role="tab"
                                    aria-label="form-data"
                                    class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                                  />
                                  <div
                                    role="tabpanel"
                                    class="tab-content bg-base-100 border-base-300 rounded-box p-3"
                                  >
                                    <div class="relative overflow-x-auto mt-1">
                                      <table
                                        class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                      >
                                        <thead
                                          class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                        >
                                          <tr>
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300 text-gray-600"
                                            >
                                              Name
                                            </th>
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                            >
                                              Type</th
                                            >
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                            >
                                              Example
                                            </th>
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                            >
                                              Description
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr class="bg-white dark:bg-gray-800">
                                            <td class=" border border-gray-300">
                                              <input
                                                type="text"
                                                class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                                placeholder="Add a new param"
                                              />
                                            </td>
                                            <td class=" border border-gray-300">
                                              <input
                                                type="text"
                                                class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                              />
                                            </td>
                                            <td class=" border border-gray-300">
                                              <input
                                                type="text"
                                                class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                              />
                                            </td>
                                            <td class=" border border-gray-300">
                                              <input
                                                type="text"
                                                class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                              />
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                  <!-- x-www-form -->
                                  <input
                                    type="radio"
                                    name="my_tabs_13"
                                    role="tab"
                                    aria-label="x-www-form"
                                    class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                                  />
                                  <div
                                    role="tabpanel"
                                    class="tab-content bg-base-100 border-base-300 rounded-box p-3"
                                  >
                                    <div class="relative overflow-x-auto mt-1">
                                      <table
                                        class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                      >
                                        <thead
                                          class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                        >
                                          <tr>
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300 text-gray-600"
                                            >
                                              Name
                                            </th>
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                            >
                                              Type</th
                                            >
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                            >
                                              Example
                                            </th>
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                            >
                                              Description
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr class="bg-white dark:bg-gray-800">
                                            <td class=" border border-gray-300">
                                              <input
                                                type="text"
                                                class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                                placeholder="Add a new param"
                                              />
                                            </td>
                                            <td class=" border border-gray-300">
                                              <input
                                                type="text"
                                                class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                              />
                                            </td>
                                            <td class=" border border-gray-300">
                                              <input
                                                type="text"
                                                class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                              />
                                            </td>
                                            <td class=" border border-gray-300">
                                              <input
                                                type="text"
                                                class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                              />
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                  <!-- json -->
                                  <input
                                    type="radio"
                                    name="my_tabs_13"
                                    role="tab"
                                    aria-label="json"
                                    class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                                  />
                                  <div
                                    role="tabpanel"
                                    class="tab-content bg-base-100 border-base-300 rounded-box p-3"
                                  >
                                    <div class="relative overflow-x-auto mt-1">
                                      <table
                                        class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                      >
                                        <thead
                                          class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                        >
                                          <tr>
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                              style="color: rgb(124,58,237);"
                                            >
                                              Root
                                            </th>
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                              style="color:blue"
                                            >
                                              Object</th
                                            >
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                            >
                                              Mock
                                            </th>
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                            >
                                              Description
                                            </th>
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                            >
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr class="bg-white dark:bg-gray-800">
                                            <td class=" border border-gray-300">
                                              <select
                                                name=""
                                                id=""
                                                class="px-1 py-2 w-full h-full text-xs shadow-none text-gray-600 tracking-[0.06rem] border-0 focus:outline-none placeholder:text-gray-400 placeholder:text-sm"
                                              >
                                                <option
                                                  value=""
                                                  disabled
                                                  selected>Choose Fields</option
                                                >
                                              </select>
                                            </td>
                                            <td class=" border border-gray-300">
                                              <select
                                                name=""
                                                id=""
                                                class="px-3 py-2 w-full h-full text-xs shadow-none text-gray-600 tracking-[0.06rem] border-0 focus:outline-none placeholder:text-gray-400 placeholder:text-sm"
                                              >
                                                <option value="" selected
                                                  >String</option
                                                >
                                              </select>
                                            </td>
                                            <td class=" border border-gray-300">
                                              <input
                                                type="text"
                                                class="px-3 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                                placeholder="Mock"
                                              />
                                            </td>
                                            <td class=" border border-gray-300">
                                              <input
                                                type="text"
                                                class="px-3 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                              />
                                            </td>
                                            <td class=" border border-gray-300">
                                              <div
                                                class="flex items-center gap-1 px-2"
                                              >
                                                <i
                                                  on:click={() =>
                                                    addField(tab, index)}
                                                  class="fa-solid fa-plus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-green-600"
                                                ></i>
                                                <i
                                                  on:click={() =>
                                                    removeField(tab, index)}
                                                  class="fa-solid fa-minus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-violet-600"
                                                ></i>
                                              </div>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                  <!--xml -->
                                  <input
                                    type="radio"
                                    name="my_tabs_13"
                                    role="tab"
                                    aria-label="xml"
                                    class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                                  />
                                  <div
                                    role="tabpanel"
                                    class="tab-content bg-base-100 border-base-300 rounded-box p-3"
                                  >
                                    <div class="relative overflow-x-auto mt-1">
                                      <table
                                        class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                      >
                                        <thead
                                          class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                        >
                                          <tr>
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                              style="color: rgb(124,58,237);"
                                            >
                                              Root
                                            </th>
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                              style="color:blue"
                                            >
                                              Object</th
                                            >
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                            >
                                              Mock
                                            </th>
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                            >
                                              Description
                                            </th>
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                            >
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr class="bg-white dark:bg-gray-800">
                                            <td class=" border border-gray-300">
                                              <select
                                                name=""
                                                id=""
                                                class="px-1 py-2 w-full h-full text-xs shadow-none text-gray-600 tracking-[0.06rem] border-0 focus:outline-none placeholder:text-gray-400 placeholder:text-sm"
                                              >
                                                <option
                                                  value=""
                                                  disabled
                                                  selected>Choose Fields</option
                                                >
                                              </select>
                                            </td>
                                            <td class=" border border-gray-300">
                                              <select
                                                name=""
                                                id=""
                                                class="px-3 py-2 w-full h-full text-xs shadow-none text-gray-600 tracking-[0.06rem] border-0 focus:outline-none placeholder:text-gray-400 placeholder:text-sm"
                                              >
                                                <option value="" selected
                                                  >String</option
                                                >
                                              </select>
                                            </td>
                                            <td class=" border border-gray-300">
                                              <input
                                                type="text"
                                                class="px-3 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                                placeholder="Mock"
                                              />
                                            </td>
                                            <td class=" border border-gray-300">
                                              <input
                                                type="text"
                                                class="px-3 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                              />
                                            </td>
                                            <td class=" border border-gray-300">
                                              <div
                                                class="flex items-center gap-1 px-2"
                                              >
                                                <i
                                                  on:click={() =>
                                                    addField(tab, index)}
                                                  class="fa-solid fa-plus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-green-600"
                                                ></i>
                                                <i
                                                  on:click={() =>
                                                    removeField(tab, index)}
                                                  class="fa-solid fa-minus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-violet-600"
                                                ></i>
                                              </div>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                  <!-- raw -->
                                  <input
                                    type="radio"
                                    name="my_tabs_13"
                                    role="tab"
                                    aria-label="raw"
                                    class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                                  />
                                  <div
                                    role="tabpanel"
                                    class="tab-content bg-base-100 border-base-300 rounded-box p-3"
                                  >
                                    <div class="w-[27vw] h-[37vh] mx-auto">
                                      <div>
                                        <div
                                          class="text-center p-1 bg-gray-50 rounded-md"
                                        >
                                          Media Type: text/plain
                                        </div>
                                        <div class="mt-2">
                                          <span class="text-sm">Example</span>
                                          <div class=" mt-1">
                                            <textarea
                                              name=""
                                              id=""
                                              rows="3"
                                              class="w-full border border-gray-200 rounded-md p-2 focus:border-violet-600"
                                            ></textarea>
                                          </div>
                                        </div>
                                        <div class="mt-2">
                                          <span class="text-sm"
                                            >Description</span
                                          >
                                          <div class=" mt-1">
                                            <textarea
                                              name=""
                                              id=""
                                              rows="1"
                                              class="w-full border border-gray-200 rounded-md p-2 focus:border-violet-600 placeholder:text-gray-400"
                                              placeholder="Support Markdown"
                                            ></textarea>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <!-- binary -->
                                  <input
                                    type="radio"
                                    name="my_tabs_13"
                                    role="tab"
                                    aria-label="binary"
                                    class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                                  />
                                  <div
                                    role="tabpanel"
                                    class="tab-content bg-base-100 border-base-300 rounded-box p-3"
                                  >
                                    <div class="w-[27vw] h-[15vh] mx-auto">
                                      <div>
                                        <div
                                          class="text-center p-1 bg-gray-50 rounded-md"
                                        >
                                          Media Type: application/octet-stream
                                        </div>
                                        <div class="mt-2">
                                          <div class=" mt-1">
                                            <div
                                              class="flex items-center justify-center w-full"
                                            >
                                              <label
                                                for="dropzone-file"
                                                class="flex flex-col items-center justify-center w-full border-2 border-gray-200 rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                              >
                                                <div
                                                  class="flex items-center gap-1 pt-2 pb-2"
                                                >
                                                  <svg
                                                    class="w-6 h-6 text-gray-500 dark:text-gray-400"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 20 16"
                                                  >
                                                    <path
                                                      stroke="currentColor"
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"
                                                      stroke-width="2"
                                                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                    />
                                                  </svg>
                                                  <span
                                                    class="text-sm text-gray-500 dark:text-gray-400"
                                                    ><span class="font-semibold"
                                                      >Upload</span
                                                    ></span
                                                  >
                                                </div>
                                                <input
                                                  id="dropzone-file"
                                                  type="file"
                                                  class="hidden"
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <!-- graphql -->
                                  <input
                                    type="radio"
                                    name="my_tabs_13"
                                    role="tab"
                                    aria-label="GraphQl"
                                    class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                                  />
                                  <div
                                    role="tabpanel"
                                    class="tab-content bg-base-100 border-base-300 rounded-box p-3"
                                  >
                                    <div
                                      class="flex justify-center items-center h-[8vh] text-xs tracking-[0.06rem] text-gray-500"
                                    >
                                      No need to define the Body
                                    </div>
                                  </div>
                                  <!-- mgspack -->
                                  <input
                                    type="radio"
                                    name="my_tabs_13"
                                    role="tab"
                                    aria-label="mgspack"
                                    class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                                  />
                                  <div
                                    role="tabpanel"
                                    class="tab-content bg-base-100 border-base-300 rounded-box p-3"
                                  >
                                    <div class="relative overflow-x-auto mt-1">
                                      <table
                                        class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                      >
                                        <thead
                                          class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                        >
                                          <tr>
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                              style="color: rgb(124,58,237);"
                                            >
                                              Root
                                            </th>
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                              style="color:blue"
                                            >
                                              Object</th
                                            >
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                            >
                                              Mock
                                            </th>
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                            >
                                              Description
                                            </th>
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                            >
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr class="bg-white dark:bg-gray-800">
                                            <td class=" border border-gray-300">
                                              <select
                                                name=""
                                                id=""
                                                class="px-1 py-2 w-full h-full text-xs shadow-none text-gray-600 tracking-[0.06rem] border-0 focus:outline-none placeholder:text-gray-400 placeholder:text-sm"
                                              >
                                                <option
                                                  value=""
                                                  disabled
                                                  selected>Choose Fields</option
                                                >
                                              </select>
                                            </td>
                                            <td class=" border border-gray-300">
                                              <select
                                                name=""
                                                id=""
                                                class="px-3 py-2 w-full h-full text-xs shadow-none text-gray-600 tracking-[0.06rem] border-0 focus:outline-none placeholder:text-gray-400 placeholder:text-sm"
                                              >
                                                <option value="" selected
                                                  >String</option
                                                >
                                              </select>
                                            </td>
                                            <td class=" border border-gray-300">
                                              <input
                                                type="text"
                                                class="px-3 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                                placeholder="Mock"
                                              />
                                            </td>
                                            <td class=" border border-gray-300">
                                              <input
                                                type="text"
                                                class="px-3 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                              />
                                            </td>
                                            <td class=" border border-gray-300">
                                              <div
                                                class="flex items-center gap-1 px-2"
                                              >
                                                <i
                                                  on:click={() =>
                                                    addField(tab, index)}
                                                  class="fa-solid fa-plus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-green-600"
                                                ></i>
                                                <i
                                                  on:click={() =>
                                                    removeField(tab, index)}
                                                  class="fa-solid fa-minus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-violet-600"
                                                ></i>
                                              </div>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <!-- headers of edit tab -->
                              <input
                                type="radio"
                                name="my_tabs_10"
                                role="tab"
                                aria-label="Headers"
                                class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                              />
                              <div
                                role="tabpanel"
                                class="tab-content bg-gray-100 border-base-300 rounded-box p-6"
                              >
                                <span
                                  class="text-gray-400"
                                  style="font-weight: 600;">Headers</span
                                >
                                <div class="relative overflow-x-auto mt-1">
                                  <table
                                    class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                  >
                                    <thead
                                      class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                    >
                                      <tr>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300 text-gray-600"
                                        >
                                          Name
                                        </th>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                          Type</th
                                        >
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                          Example
                                        </th>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                          Description
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr class="bg-white dark:bg-gray-800">
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                            placeholder="Add a new param"
                                          />
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          />
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          />
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <!-- cookies of edit tab -->
                              <input
                                type="radio"
                                name="my_tabs_10"
                                role="tab"
                                aria-label="Cookies"
                                class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                              />
                              <div
                                role="tabpanel"
                                class="tab-content bg-gray-100 border-base-300 rounded-box p-6"
                              >
                                <div class="relative overflow-x-auto mt-1">
                                  <table
                                    class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                  >
                                    <thead
                                      class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                    >
                                      <tr>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300 text-gray-600"
                                        >
                                          Name
                                        </th>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                          Type</th
                                        >
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                          Example
                                        </th>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                          Description
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr class="bg-white dark:bg-gray-800">
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                            placeholder="Add a new param"
                                          />
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          />
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          />
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <!-- auth of edit tab -->
                              <input
                                type="radio"
                                name="my_tabs_10"
                                role="tab"
                                aria-label="Auth"
                                class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                              />
                              <div
                                role="tabpanel"
                                class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
                              >
                                <form class="max-w-sm me-auto">
                                  <label
                                    for="countries"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >Type</label
                                  >
                                  <select
                                    id="countries"
                                    bind:value={selectedAuthType}
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  >
                                    <option selected>Inherit from parent</option
                                    >
                                    {#each tab.auth as auth}
                                      <option value={auth.type}
                                        >{auth.type}</option
                                      >
                                    {/each}
                                  </select>

                                  {#if selectedAuthType === "Bearer Token"}
                                    <div class="mt-4">
                                      <label
                                        for="bearerToken"
                                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >Bearer Token</label
                                      >
                                      <input
                                        type="text"
                                        id="bearerToken"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Enter Bearer Token"
                                      />
                                    </div>
                                  {/if}

                                  {#if selectedAuthType === "API Key"}
                                    <div class="mt-4">
                                      <label
                                        for="apiKey"
                                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >API Key</label
                                      >
                                      <input
                                        type="text"
                                        id="apiKey"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Enter API Key"
                                      />
                                    </div>
                                  {/if}

                                  {#if selectedAuthType === "Basic Auth"}
                                    <div class="mt-4">
                                      <label
                                        for="username"
                                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >Username</label
                                      >
                                      <input
                                        type="text"
                                        id="username"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Enter Username"
                                      />
                                      <label
                                        for="password"
                                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >Password</label
                                      >
                                      <input
                                        type="password"
                                        id="password"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Enter Password"
                                      />
                                    </div>
                                  {/if}

                                  {#if selectedAuthType === "No Auth"}
                                    <div class="mt-4">
                                      <p
                                        class="text-sm text-gray-900 dark:text-white"
                                      >
                                        No authentication required for this
                                        endpoint.
                                      </p>
                                    </div>
                                  {/if}
                                </form>
                              </div>
                              <!-- pre processors of edit tab -->
                              <input
                                type="radio"
                                name="my_tabs_10"
                                role="tab"
                                aria-label="Pre"
                                class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                              />
                              <div
                                role="tabpanel"
                                class="tab-content bg-gray-100 border-base-300 rounded-box p-6"
                              ></div>
                              <!-- post processors of edit tab -->
                              <input
                                type="radio"
                                name="my_tabs_10"
                                role="tab"
                                aria-label="Post"
                                class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                              />
                              <div
                                role="tabpanel"
                                class="tab-content bg-gray-100 border-base-300 rounded-box p-6"
                              ></div>
                              <!-- settings of edit -->
                              <input
                                type="radio"
                                name="my_tabs_10"
                                role="tab"
                                aria-label="Settings"
                                class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                              />
                              <div
                                role="tabpanel"
                                class="tab-content bg-gray-100 border-base-300 rounded-box p-6"
                              ></div>
                            </div>
                          </div>

                          <!-- reponse of edit start -->
                          <div class="mt-4 mb-5 pb-5">
                            <span
                              class="   tracking-[0.06rem]"
                              style="font-size: 17px;font-weight:600;color:rgba(0,0,0,0.6)"
                              >Responses</span
                            >
                            <!-- response tabs -->
                            <div role="tablist" class="tabs tabs-lifted mt-2">
                              <!-- response code -->
                              {#each tab.responses as response}
                                <input
                                  type="radio"
                                  name="my_tabs_12"
                                  role="tab"
                                  checked
                                  style="width: 12vw!important;"
                                  class="relative tab bg-base-100 tracking-[0.05rem] text-xs truncate checked:bg-gray-100 checked:text-gray-600 px-3 checked:font-semibold flex justify-center"
                                  aria-label="{response.description}({response.status})"
                                />
                                <div
                                  role="tabpanel"
                                  class="tab-content bg-gray-100 border-base-300 rounded-box w-full"
                                >
                                  <div
                                    class="flex items-center gap-4 p-3 border-b border-gray-200"
                                  >
                                    <span class="text-gray-500"
                                      >HTTP Status Code : <input
                                        type="text"
                                        class="text-gray-600 border w-[4vw] rounded-md border-gray-200 px-2 py-1 focus:border-blue-600"
                                        bind:value={response.status}
                                      />
                                    </span>
                                    <span class="text-gray-500"
                                      >Content Type : <select
                                        name=""
                                        id=""
                                        class="text-gray-600 border w-[4vw] rounded-md border-gray-200 px-2 py-1 focus:border-blue-600 text-sm"
                                      >
                                        <option value="JSON">JSON</option>
                                        <option value="XML">XML</option>
                                      </select></span
                                    >
                                    <span class="text-gray-500"
                                      >Content Type : <span
                                        class="text-gray-800"
                                        >application/json</span
                                      ></span
                                    >
                                  </div>

                                  <div class="my-3">
                                    <div
                                      class="flex justify-between items-center"
                                    >
                                      <div></div>
                                      <div class="flex items-center gap-1">
                                        <button
                                          on:click={() => previewTab(tab)}
                                          class="bg-gray-50 py-1 px-3 hover:bg-gray-100 border border-gray-300 cursor-pointer text-xs"
                                          >Preview</button
                                        >
                                        <button
                                          class="bg-gray-50 py-1 px-3 hover:bg-gray-100 border border-gray-300 cursor-pointer text-xs flex items-center gap-1"
                                          ><svg
                                            class="w-4 h-4 text-gray-800 dark:text-white"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              stroke="currentColor"
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                              stroke-width="2"
                                              d="m8 8-4 4 4 4m8 0 4-4-4-4m-2-3-4 14"
                                            />
                                          </svg>
                                          Generate Code</button
                                        >
                                        <button
                                          class="bg-gray-50 py-1 px-3 hover:bg-gray-100 border border-gray-300 cursor-pointer text-xs"
                                          >Json Schema</button
                                        >
                                      </div>
                                    </div>
                                    <!-- preview modal of edit tab  -->
                                    <dialog id="my_modal_32" class="modal">
                                      <div class="modal-box">
                                        <h3 class="text-lg font-bold">
                                          Preview
                                        </h3>
                                        <textarea
                                          class="w-full h-64 p-2 border border-gray-300"
                                          readonly
                                          bind:value={previewContent}
                                        ></textarea>
                                      </div>
                                      <form
                                        method="dialog"
                                        class="modal-backdrop"
                                      >
                                        <button class="btn">Close</button>
                                      </form>
                                    </dialog>
                                    <!-- schemas table edit tab -->
                                    <div class="relative overflow-x-auto">
                                      <table
                                        class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                      >
                                        <thead
                                          class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                        >
                                          <tr>
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border text-violet-600 font-semibold border-gray-300"
                                              >Root</th
                                            >
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                              >Object</th
                                            >
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                              >Mock</th
                                            >
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                              >Description</th
                                            >
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                            ></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {#each response.schemas as field, index}
                                            <tr
                                              class="bg-white dark:bg-gray-800"
                                            >
                                              <td
                                                class="px-4 py-2 border border-gray-300 flex items-center"
                                              >
                                                {#if field.type === "array" && field.items}
                                                  <i
                                                    class="fa-solid fa-caret-right"
                                                    style="font-size: 9px;"
                                                    on:click={() =>
                                                      showSubItem(index)}
                                                  ></i>
                                                {/if}
                                                <input
                                                  type="text"
                                                  bind:value={field.name}
                                                  class=" text-sm w-full py-1 border-none bg-transparent focus:outline-none"
                                                />
                                              </td>
                                              <td
                                                class="px-4 py-2 border border-gray-300 text-green-600"
                                              >
                                                <select
                                                  bind:value={field.type}
                                                  class="w-full py-1 text-sm border-none bg-transparent focus:outline-none text-green-600"
                                                >
                                                  <option value="integer<int64>"
                                                    >integer<int64
                                                    ></int64></option
                                                  >
                                                  <option value="Category"
                                                    >Category</option
                                                  >
                                                  <option value="string"
                                                    >string</option
                                                  >
                                                  <option value="array"
                                                    >array</option
                                                  >
                                                  <!-- Add more options as needed -->
                                                </select>
                                              </td>
                                              <td
                                                class="px-4 py-2 border border-gray-300"
                                              >
                                                <input
                                                  type="text"
                                                  bind:value={field.mock}
                                                  class="w-full py-1 text-sm border-none bg-transparent focus:outline-none"
                                                />
                                              </td>
                                              <td
                                                class="px-4 py-2 border border-gray-300"
                                              >
                                                <input
                                                  type="text"
                                                  bind:value={field.description}
                                                  class="w-full py-1 border-none text-sm bg-transparent focus:outline-none"
                                                />
                                              </td>
                                              <td
                                                class=" border border-gray-300"
                                              >
                                                <div
                                                  class="flex items-center gap-1 px-2"
                                                >
                                                  <i
                                                    on:click={() =>
                                                      addField(tab, index)}
                                                    class="fa-solid fa-plus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-green-600"
                                                  ></i>
                                                  <i
                                                    on:click={() =>
                                                      removeField(tab, index)}
                                                    class="fa-solid fa-minus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-violet-600"
                                                  ></i>
                                                </div>
                                              </td>
                                            </tr>
                                            {#if field.type === "array" && field.items && showItem[index]}
                                              {#each field.items as item, itemIndex}
                                                <tr
                                                  class="bg-gray-50 dark:bg-gray-700"
                                                >
                                                  <td
                                                    class="px-5 py-2 border border-gray-300"
                                                  >
                                                    <input
                                                      type="text"
                                                      bind:value={item.name}
                                                      class="w-full py-1 text-xs border-none bg-transparent focus:outline-none"
                                                    />
                                                  </td>
                                                  <td
                                                    class="px-4 py-2 text-xs border border-gray-300 text-green-600"
                                                  >
                                                    <select
                                                      bind:value={item.type}
                                                      class="w-full text-xs border-none bg-transparent focus:outline-none text-green-600"
                                                    >
                                                      <option
                                                        value="integer<int64>"
                                                        >integer<int64
                                                        ></int64></option
                                                      >
                                                      <option value="Category"
                                                        >Category</option
                                                      >
                                                      <option value="string"
                                                        >string</option
                                                      >
                                                      <option value="array"
                                                        >array</option
                                                      >
                                                      <!-- Add more options as needed -->
                                                    </select>
                                                  </td>
                                                  <td
                                                    class="px-4 py-2 text-xs border border-gray-300"
                                                  >
                                                    <input
                                                      type="text"
                                                      bind:value={item.mock}
                                                      class="w-full py-1 text-xs border-none bg-transparent focus:outline-none"
                                                    />
                                                  </td>
                                                  <td
                                                    class="px-4 py-2 text-xs border border-gray-300"
                                                  >
                                                    <input
                                                      type="text"
                                                      bind:value={item.description}
                                                      class="w-full py-1 border-none text-xs bg-transparent focus:outline-none"
                                                    />
                                                  </td>
                                                  <td
                                                    class="px-4 py-2 border border-gray-300 flex gap-1"
                                                    colspan="3"
                                                  >
                                                    <i
                                                      class="fa-solid fa-plus w-5 h-5 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-green-600"
                                                      on:click={() =>
                                                        addItem(field)}
                                                    ></i>
                                                    <i
                                                      class="fa-solid fa-minus w-5 h-5 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-violet-600"
                                                      on:click={() =>
                                                        removeItem(
                                                          field,
                                                          itemIndex
                                                        )}
                                                    ></i>
                                                  </td>
                                                </tr>
                                              {/each}
                                            {/if}
                                          {/each}
                                        </tbody>
                                      </table>
                                    </div>

                                    <!-- successfull responses example edit tab -->
                                    {#if response.status === 200}
                                      <div class="mx-2 mt-2">
                                        <div
                                          style="font-weight:600"
                                          class="text-gray-600 text-sm"
                                        >
                                          Success Example
                                        </div>
                                        <div
                                          class="border border-gray-200 p-2 text-xs tracking-[0.05rem]"
                                        >
                                          {#if response.examples && response.examples.length > 0}
                                            <pre
                                              class="json-example">{@html syntaxHighlight(
                                                JSON.stringify(
                                                  response.examples[0],
                                                  null,
                                                  2
                                                )
                                              ) || ""}</pre>
                                          {:else}
                                            <p>No examples</p>
                                          {/if}
                                        </div>
                                      </div>
                                    {/if}
                                  </div>
                                </div>
                              {/each}
                            </div>
                          </div>
                        </div>

                        <!-- run tab -->
                        <input
                          id="runTab"
                          type="radio"
                          name={`my_tabs_${tab.id}`}
                          role="tab"
                          class="tab hover:text-violet-700 bg-gray-100 checked:bg-checked-white text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                          aria-label="Run"
                          checked={currentTab === "run"}
                          on:change={() => (currentTab = "run")}
                        />

                        <div
                          role="tabpanel"
                          class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                          style="overflow-y: auto; max-height: calc(100vh - 50px);"
                        >
                          <!-- run api path and method -->
                          <div class="mt-2 flex items-center gap-1 w-full">
                            <div class="flex items-center w-full gap-1">
                              <select
                                name=""
                                id="selectMethod"
                                class="py-1.5 rounded-md px-2 border-gray-200 text-xs tracking-[0.06rem] w-fit"
                                bind:value={tab.method}
                              >
                                <option
                                  value="GET"
                                  class="text-green-600 font-semibold"
                                  selected>GET</option
                                >
                                <option
                                  value="POST"
                                  class="text-violet-600 font-semibold"
                                  >POST</option
                                >
                                <option
                                  value="DELETE "
                                  class="text-red-600 font-semibold"
                                  >DELETE</option
                                >
                              </select>
                              <input
                                type="text"
                                data-testid="inputUrl"
                                class="py-1.5 rounded-md text-xs px-2 w-full border-gray-200 tracking-[0.06rem]"
                                placeholder=""
                                bind:value={tab.path}
                              />
                            </div>
                            <button
                              data-testid="sendRequestButton"
                              class="py-2 tracking-[0.05rem] px-3 text-white border border-violet-600 bg-violet-600 hover:bg-violet-800 rounded-md text-xs"
                              on:click={() => sendRequest(tab)}>Send</button
                            >
                            <buttons
                              class="py-2 tracking-[0.05rem] px-2 border border-gray-300 bg-base-100 hover:bg-gray-100 rounded-md text-xs"
                              >Stash</buttons
                            >
                            <button
                              class="py-2 border border-gray-300 tracking-[0.05rem] px-2 bg-base-100 hover:bg-gray-100 rounded-md text-xs w-[10vw]"
                              >Save as Case</button
                            >
                          </div>
                          <!-- run tabs -->
                          <div role="tablist" class="tabs tabs-lifted mt-2">
                            <!-- params tab -->
                            <input
                              type="radio"
                              name="my_tabs_11"
                              role="tab"
                              aria-label="Params"
                              class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                              checked
                            />
                            <div
                              role="tabpanel"
                              class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
                            >
                              <span
                                class="text-gray-400"
                                style="font-weight: 600;">Query Params</span
                              >
                              <div class="relative overflow-x-auto mt-1">
                                <table
                                  class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                >
                                  <thead
                                    class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                  >
                                    <tr>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300 text-gray-600"
                                      >
                                        Name
                                      </th>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                        Type</th
                                      >
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                        Example
                                      </th>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                        Description
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr class="bg-white dark:bg-gray-800">
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          placeholder="Add a new param"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <span
                                class="text-gray-400 mt-2 inline-block"
                                style="font-weight: 600;">Path Params</span
                              >
                              <div class="relative overflow-x-auto mt-1">
                                <table
                                  class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                >
                                  <thead
                                    class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                  >
                                    <tr>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300 text-gray-600"
                                      >
                                        Name
                                      </th>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                        Type</th
                                      >
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                        Example
                                      </th>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                        Description
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr class="bg-white dark:bg-gray-800">
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          placeholder="Add a new param"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            <!-- body tab -->
                            <input
                              type="radio"
                              name="my_tabs_11"
                              role="tab"
                              aria-label="Body"
                              class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                            />
                            <div
                              role="tabpanel"
                              class="tab-content bg-gray-100 border-base-300 rounded-box p-6"
                            >
                              <div role="tablist" class="tabs tabs-lifted mt-2">
                                <!-- none tab -->
                                <input
                                  type="radio"
                                  name="my_tabs_15"
                                  role="tab"
                                  aria-label="none"
                                  class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                                  checked
                                />
                                <div
                                  role="tabpanel"
                                  class="tab-content bg-base-100 border-base-300 rounded-box p-3"
                                >
                                  <div
                                    class="flex justify-center items-center h-[8vh] text-xs tracking-[0.06rem] text-gray-500"
                                  >
                                    This request has no body parameters.
                                  </div>
                                </div>

                                <!-- form-data -->
                                <input
                                  type="radio"
                                  name="my_tabs_15"
                                  role="tab"
                                  style="width:8vw!important"
                                  aria-label="form-data"
                                  class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                                />
                                <div
                                  role="tabpanel"
                                  class="tab-content bg-base-100 border-base-300 rounded-box p-3"
                                >
                                  <div class="relative overflow-x-auto mt-1">
                                    <table
                                      class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                    >
                                      <thead
                                        class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                      >
                                        <tr>
                                          <th
                                            scope="col"
                                            class="px-4 py-2 border border-gray-300 text-gray-600"
                                          >
                                            Name
                                          </th>
                                          <th
                                            scope="col"
                                            class="px-4 py-2 border border-gray-300"
                                          >
                                            Type</th
                                          >
                                          <th
                                            scope="col"
                                            class="px-4 py-2 border border-gray-300"
                                          >
                                            Example
                                          </th>
                                          <th
                                            scope="col"
                                            class="px-4 py-2 border border-gray-300"
                                          >
                                            Description
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr class="bg-white dark:bg-gray-800">
                                          <td class=" border border-gray-300">
                                            <input
                                              type="text"
                                              class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                              placeholder="Add a new param"
                                            />
                                          </td>
                                          <td class=" border border-gray-300">
                                            <input
                                              type="text"
                                              class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                            />
                                          </td>
                                          <td class=" border border-gray-300">
                                            <input
                                              type="text"
                                              class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                            />
                                          </td>
                                          <td class=" border border-gray-300">
                                            <input
                                              type="text"
                                              class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                            />
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                                <!-- x-www-form -->
                                <input
                                  type="radio"
                                  name="my_tabs_15"
                                  role="tab"
                                  style="width:9vw!important"
                                  aria-label="x-www-form"
                                  class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                                />
                                <div
                                  role="tabpanel"
                                  class="tab-content bg-base-100 border-base-300 rounded-box p-3"
                                >
                                  <div class="relative overflow-x-auto mt-1">
                                    <table
                                      class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                    >
                                      <thead
                                        class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                      >
                                        <tr>
                                          <th
                                            scope="col"
                                            class="px-4 py-2 border border-gray-300 text-gray-600"
                                          >
                                            Name
                                          </th>
                                          <th
                                            scope="col"
                                            class="px-4 py-2 border border-gray-300"
                                          >
                                            Type</th
                                          >
                                          <th
                                            scope="col"
                                            class="px-4 py-2 border border-gray-300"
                                          >
                                            Example
                                          </th>
                                          <th
                                            scope="col"
                                            class="px-4 py-2 border border-gray-300"
                                          >
                                            Description
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr class="bg-white dark:bg-gray-800">
                                          <td class=" border border-gray-300">
                                            <input
                                              type="text"
                                              class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                              placeholder="Add a new param"
                                            />
                                          </td>
                                          <td class=" border border-gray-300">
                                            <input
                                              type="text"
                                              class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                            />
                                          </td>
                                          <td class=" border border-gray-300">
                                            <input
                                              type="text"
                                              class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                            />
                                          </td>
                                          <td class=" border border-gray-300">
                                            <input
                                              type="text"
                                              class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                            />
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                                <!-- json -->
                                <input
                                  type="radio"
                                  name="my_tabs_15"
                                  role="tab"
                                  aria-label="json"
                                  class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                                />
                                <div
                                  role="tabpanel"
                                  class="tab-content bg-base-100 border-base-300 rounded-box p-3"
                                >
                                  <div>
                                    <textarea
                                      name=""
                                      rows="5"
                                      id=""
                                      class="border w-full border-gray-200 p-2 rounded-md text-xs tracking-[0.06rem]"
                                      bind:value={tab.jsonBody}
                                    />
                                  </div>
                                </div>
                                <!--xml -->
                                <input
                                  type="radio"
                                  name="my_tabs_15"
                                  role="tab"
                                  aria-label="xml"
                                  class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                                />
                                <div
                                  role="tabpanel"
                                  class="tab-content bg-base-100 border-base-300 rounded-box p-3"
                                >
                                  <div class="relative overflow-x-auto mt-1">
                                    <table
                                      class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                    >
                                      <thead
                                        class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                      >
                                        <tr>
                                          <th
                                            scope="col"
                                            class="px-4 py-2 border border-gray-300"
                                            style="color: rgb(124,58,237);"
                                          >
                                            Root
                                          </th>
                                          <th
                                            scope="col"
                                            class="px-4 py-2 border border-gray-300"
                                            style="color:blue"
                                          >
                                            Object</th
                                          >
                                          <th
                                            scope="col"
                                            class="px-4 py-2 border border-gray-300"
                                          >
                                            Mock
                                          </th>
                                          <th
                                            scope="col"
                                            class="px-4 py-2 border border-gray-300"
                                          >
                                            Description
                                          </th>
                                          <th
                                            scope="col"
                                            class="px-4 py-2 border border-gray-300"
                                          >
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr class="bg-white dark:bg-gray-800">
                                          <td class=" border border-gray-300">
                                            <select
                                              name=""
                                              id=""
                                              class="px-1 py-2 w-full h-full text-xs shadow-none text-gray-600 tracking-[0.06rem] border-0 focus:outline-none placeholder:text-gray-400 placeholder:text-sm"
                                            >
                                              <option value="" disabled selected
                                                >Choose Fields</option
                                              >
                                            </select>
                                          </td>
                                          <td class=" border border-gray-300">
                                            <select
                                              name=""
                                              id=""
                                              class="px-3 py-2 w-full h-full text-xs shadow-none text-gray-600 tracking-[0.06rem] border-0 focus:outline-none placeholder:text-gray-400 placeholder:text-sm"
                                            >
                                              <option value="" selected
                                                >String</option
                                              >
                                            </select>
                                          </td>
                                          <td class=" border border-gray-300">
                                            <input
                                              type="text"
                                              class="px-3 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                              placeholder="Mock"
                                            />
                                          </td>
                                          <td class=" border border-gray-300">
                                            <input
                                              type="text"
                                              class="px-3 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                            />
                                          </td>
                                          <td class=" border border-gray-300">
                                            <div
                                              class="flex items-center gap-1 px-2"
                                            >
                                              <i
                                                on:click={() =>
                                                  addField(tab, index)}
                                                class="fa-solid fa-plus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-green-600"
                                              ></i>
                                              <i
                                                on:click={() =>
                                                  removeField(tab, index)}
                                                class="fa-solid fa-minus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-violet-600"
                                              ></i>
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                                <!--run tab raw -->
                                <input
                                  type="radio"
                                  name="my_tabs_15"
                                  role="tab"
                                  aria-label="raw"
                                  class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                                />
                                <div
                                  role="tabpanel"
                                  class="tab-content bg-base-100 border-base-300 rounded-box p-3"
                                >
                                  <div>
                                    <textarea
                                      name=""
                                      rows="5"
                                      id=""
                                      class="border w-full border-gray-200 p-2 rounded-md text-xs tracking-[0.06rem]"
                                      bind:value={tab.rawBody}
                                    />
                                  </div>
                                </div>
                                <!-- binary -->
                                <input
                                  type="radio"
                                  name="my_tabs_15"
                                  role="tab"
                                  aria-label="binary"
                                  class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                                />
                                <div
                                  role="tabpanel"
                                  class="tab-content bg-base-100 border-base-300 rounded-box p-3"
                                >
                                  <div class="w-[27vw] h-[15vh] mx-auto">
                                    <div>
                                      <div
                                        class="text-center p-1 bg-gray-50 rounded-md"
                                      >
                                        Media Type: application/octet-stream
                                      </div>
                                      <div class="mt-2">
                                        <div class=" mt-1">
                                          <div
                                            class="flex items-center justify-center w-full"
                                          >
                                            <label
                                              for="dropzone-file"
                                              class="flex flex-col items-center justify-center w-full border-2 border-gray-200 rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                            >
                                              <div
                                                class="flex items-center gap-1 pt-2 pb-2"
                                              >
                                                <svg
                                                  class="w-6 h-6 text-gray-500 dark:text-gray-400"
                                                  aria-hidden="true"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill="none"
                                                  viewBox="0 0 20 16"
                                                >
                                                  <path
                                                    stroke="currentColor"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                  />
                                                </svg>
                                                <span
                                                  class="text-sm text-gray-500 dark:text-gray-400"
                                                  ><span class="font-semibold"
                                                    >Upload</span
                                                  ></span
                                                >
                                              </div>
                                              <input
                                                id="dropzone-file"
                                                type="file"
                                                class="hidden"
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <!-- graphql -->
                                <input
                                  type="radio"
                                  name="my_tabs_15"
                                  role="tab"
                                  aria-label="GraphQl"
                                  class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                                />
                                <div
                                  role="tabpanel"
                                  class="tab-content bg-base-100 border-base-300 rounded-box p-3"
                                >
                                  <div
                                    class="flex justify-center items-center h-[8vh] text-xs tracking-[0.06rem] text-gray-500"
                                  >
                                    No need to define the Body
                                  </div>
                                </div>
                                <!-- mgspack -->
                                <input
                                  type="radio"
                                  name="my_tabs_15"
                                  role="tab"
                                  aria-label="mgspack"
                                  class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                                />
                                <div
                                  role="tabpanel"
                                  class="tab-content bg-base-100 border-base-300 rounded-box p-3"
                                >
                                  <div class="relative overflow-x-auto mt-1">
                                    <table
                                      class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                    >
                                      <thead
                                        class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                      >
                                        <tr>
                                          <th
                                            scope="col"
                                            class="px-4 py-2 border border-gray-300"
                                            style="color: rgb(124,58,237);"
                                          >
                                            Root
                                          </th>
                                          <th
                                            scope="col"
                                            class="px-4 py-2 border border-gray-300"
                                            style="color:blue"
                                          >
                                            Object</th
                                          >
                                          <th
                                            scope="col"
                                            class="px-4 py-2 border border-gray-300"
                                          >
                                            Mock
                                          </th>
                                          <th
                                            scope="col"
                                            class="px-4 py-2 border border-gray-300"
                                          >
                                            Description
                                          </th>
                                          <th
                                            scope="col"
                                            class="px-4 py-2 border border-gray-300"
                                          >
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr class="bg-white dark:bg-gray-800">
                                          <td class=" border border-gray-300">
                                            <select
                                              name=""
                                              id=""
                                              class="px-1 py-2 w-full h-full text-xs shadow-none text-gray-600 tracking-[0.06rem] border-0 focus:outline-none placeholder:text-gray-400 placeholder:text-sm"
                                            >
                                              <option value="" disabled selected
                                                >Choose Fields</option
                                              >
                                            </select>
                                          </td>
                                          <td class=" border border-gray-300">
                                            <select
                                              name=""
                                              id=""
                                              class="px-3 py-2 w-full h-full text-xs shadow-none text-gray-600 tracking-[0.06rem] border-0 focus:outline-none placeholder:text-gray-400 placeholder:text-sm"
                                            >
                                              <option value="" selected
                                                >String</option
                                              >
                                            </select>
                                          </td>
                                          <td class=" border border-gray-300">
                                            <input
                                              type="text"
                                              class="px-3 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                              placeholder="Mock"
                                            />
                                          </td>
                                          <td class=" border border-gray-300">
                                            <input
                                              type="text"
                                              class="px-3 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                            />
                                          </td>
                                          <td class=" border border-gray-300">
                                            <div
                                              class="flex items-center gap-1 px-2"
                                            >
                                              <i
                                                on:click={() =>
                                                  addField(tab, index)}
                                                class="fa-solid fa-plus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-green-600"
                                              ></i>
                                              <i
                                                on:click={() =>
                                                  removeField(tab, index)}
                                                class="fa-solid fa-minus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-violet-600"
                                              ></i>
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <!-- headers tab -->
                            <input
                              type="radio"
                              name="my_tabs_11"
                              role="tab"
                              aria-label="Headers"
                              class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                            />
                            <div
                              role="tabpanel"
                              class="tab-content bg-gray-100 border-base-300 rounded-box p-6"
                            >
                              <span
                                class="text-gray-400"
                                style="font-weight: 600;">Headers</span
                              >
                              <div class="relative overflow-x-auto mt-1">
                                <table
                                  class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                >
                                  <thead
                                    class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                  >
                                    <tr>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300 text-gray-600"
                                      >
                                        Name
                                      </th>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                        Type</th
                                      >
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                        Example
                                      </th>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                        Description
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr class="bg-white dark:bg-gray-800">
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          placeholder="Add a new param"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <!-- cookies tab -->
                            <input
                              type="radio"
                              name="my_tabs_11"
                              role="tab"
                              aria-label="Cookies"
                              class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                            />
                            <div
                              role="tabpanel"
                              class="tab-content bg-gray-100 border-base-300 rounded-box p-6"
                            >
                              <span
                                class="text-gray-400"
                                style="font-weight: 600;">Cookies</span
                              >
                              <div class="relative overflow-x-auto mt-1">
                                <table
                                  class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                >
                                  <thead
                                    class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                  >
                                    <tr>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300 text-gray-600"
                                      >
                                        Name
                                      </th>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                        Type</th
                                      >
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                        Example
                                      </th>
                                      <th
                                        scope="col"
                                        class="px-4 py-2 border border-gray-300"
                                      >
                                        Description
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr class="bg-white dark:bg-gray-800">
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          placeholder="Add a new param"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <!-- auth run tab -->
                            <input
                              type="radio"
                              name="my_tabs_11"
                              role="tab"
                              data-testid="authRunTab"
                              aria-label="Auth"
                              class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                            />
                            <div
                              role="tabpanel"
                              class="tab-content bg-gray-100 border-base-300 rounded-box p-6"
                              style="overflow-y: auto; max-height: calc(100vh - 50px);"
                            >
                              <form class="max-w-sm me-auto">
                                <label
                                  for="countries"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  >Type</label
                                >
                                <select
                                  id="auths"
                                  bind:value={selectedAuthType}
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                >
                                  <option selected>Inherit from parent</option>
                                  {#each tab.auth as auth}
                                    <option value={auth.type}
                                      >{auth.type}</option
                                    >
                                  {/each}
                                </select>

                                {#if selectedAuthType === "Bearer Token"}
                                  <div class="mt-4">
                                    <label
                                      for="bearerToken"
                                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                      >Bearer Token</label
                                    >
                                    <input
                                      type="text"
                                      id="mockbearerToken"
                                      data-testid="bearerToken"
                                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                      placeholder="Enter Bearer Token"
                                      bind:value={tab.auth[0].value}
                                    />
                                  </div>
                                {/if}

                                {#if selectedAuthType === "API Key"}
                                  <div class="mt-4">
                                    <label
                                      for="apiKey"
                                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                      >API Key</label
                                    >
                                    <input
                                      type="text"
                                      id="mockapiKey"
                                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                      placeholder="Enter API Key"
                                      bind:value={tab.auth[1].value}
                                    />
                                  </div>
                                {/if}

                                {#if selectedAuthType === "Basic Auth"}
                                  <div class="mt-4">
                                    <label
                                      for="username"
                                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                      >Username</label
                                    >
                                    <input
                                      type="text"
                                      id="usernameAuth"
                                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                      placeholder="Enter Username"
                                      bind:value={tab.auth[2].username}
                                    />
                                    <label
                                      for="password"
                                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                      >Password</label
                                    >
                                    <input
                                      type="password"
                                      id="passwordAuth"
                                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                      placeholder="Enter Password"
                                      bind:value={tab.auth[2].password}
                                    />
                                  </div>
                                {/if}
                                {#if selectedAuthType === "JWT"}
                                  <div class="mt-4">
                                    <label
                                      for="jwtSecret"
                                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                      JWT Secret
                                    </label>
                                    <input
                                      type="text"
                                      id="mockjwtSecret"
                                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                      placeholder="Enter JWT Secret"
                                      bind:value={tab.auth[3].secret}
                                    />
                                  </div>

                                  <div class="mt-4">
                                    <label
                                      for="jwtAddTo"
                                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                      Add JWT to
                                    </label>
                                    <select
                                      id="mockjwtAddTo"
                                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                      bind:value={tab.auth[3].addTo}
                                    >
                                      <option value="headers">Headers</option>
                                      <option value="params">Params</option>
                                    </select>
                                  </div>

                                  <div class="mt-4">
                                    <label
                                      for="jwtPayload"
                                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                      JWT Payload
                                    </label>
                                    <textarea
                                      id="mockjwtPayload"
                                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                      placeholder="Enter JWT Payload"
                                      bind:value={tab.auth[3].payload}
                                    ></textarea>
                                  </div>
                                {/if}
                                {#if selectedAuthType === "OAuth 1.0"}
                                  <div class="mt-4">
                                    <label
                                      for="oauth1Token"
                                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                      OAuth 1.0 Token
                                    </label>
                                    <input
                                      type="text"
                                      id="mockoauth1Token"
                                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                      placeholder="Enter OAuth 1.0 Token"
                                      bind:value={tab.auth[4].token}
                                    />
                                  </div>

                                  <div class="mt-4">
                                    <label
                                      for="mockoauth1OauthToken"
                                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                      OAuth Token
                                    </label>
                                    <input
                                      type="text"
                                      id="mockoauth1OauthToken"
                                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                      placeholder="Enter OAuth Token"
                                      bind:value={tab.auth[4].oauthToken}
                                    />
                                  </div>

                                  <div class="mt-4">
                                    <label
                                      for="oauth1OauthTokenSecret"
                                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                      OAuth Token Secret
                                    </label>
                                    <input
                                      type="text"
                                      id="mockoauth1OauthTokenSecret"
                                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                      placeholder="Enter OAuth Token Secret"
                                      bind:value={tab.auth[4].oauthTokenSecret}
                                    />
                                  </div>

                                  <div class="mt-4">
                                    <label
                                      for="oauth1ConsumerKey"
                                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                      Consumer Key
                                    </label>
                                    <input
                                      type="text"
                                      id="mockoauth1ConsumerKey"
                                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                      placeholder="Enter Consumer Key"
                                      bind:value={tab.auth[4].consumerKey}
                                    />
                                  </div>

                                  <div class="mt-4">
                                    <label
                                      for="oauth1ConsumerSecret"
                                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                      Consumer Secret
                                    </label>
                                    <input
                                      type="text"
                                      id="mockoauth1ConsumerSecret"
                                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                      placeholder="Enter Consumer Secret"
                                      bind:value={tab.auth[4].consumerSecret}
                                    />
                                  </div>
                                {/if}

                                {#if selectedAuthType === "OAuth 2.0"}
                                  <div class="mt-4">
                                    <label
                                      for="oauth2Token"
                                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                      >OAuth 2.0 Token</label
                                    >
                                    <input
                                      type="text"
                                      id="mockoauth2Token"
                                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                      placeholder="Enter OAuth 2.0 Token"
                                      bind:value={tab.auth[5].token}
                                    />
                                  </div>

                                  <div class="mt-4">
                                    <label
                                      for="oauth2ClientId"
                                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                      >Client ID</label
                                    >
                                    <input
                                      type="text"
                                      id="mockoauth2ClientId"
                                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                      placeholder="Enter Client ID"
                                      bind:value={tab.auth[5].clientId}
                                    />
                                  </div>

                                  <div class="mt-4">
                                    <label
                                      for="oauth2ClientSecret"
                                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                      >Client Secret</label
                                    >
                                    <input
                                      type="text"
                                      id="mockoauth2ClientSecret"
                                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                      placeholder="Enter Client Secret"
                                      bind:value={tab.auth[5].clientSecret}
                                    />
                                  </div>

                                  <div class="mt-4">
                                    <label
                                      for="oauth2RedirectUri"
                                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                      >Redirect URI</label
                                    >
                                    <input
                                      type="text"
                                      id="mockoauth2RedirectUri"
                                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                      placeholder="Enter Redirect URI"
                                      bind:value={tab.auth[5].redirectUri}
                                    />
                                  </div>

                                  <div class="mt-4">
                                    <label
                                      for="oauth2AuthUrl"
                                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                      >Auth URL</label
                                    >
                                    <input
                                      type="text"
                                      id="mockoauth2AuthUrl"
                                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                      placeholder="Enter Auth URL"
                                      bind:value={tab.auth[5].authUrl}
                                    />
                                  </div>

                                  <div class="mt-4">
                                    <label
                                      for="oauth2AccessTokenUrl"
                                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                      >Access Token URL</label
                                    >
                                    <input
                                      type="text"
                                      id="mockoauth2AccessTokenUrl"
                                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                      placeholder="Enter Access Token URL"
                                      bind:value={tab.auth[5].accessTokenUrl}
                                    />
                                  </div>

                                  <button
                                    on:click={() => generateOAuthToken(tab)}
                                    class="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                                    >Generate Token</button
                                  >
                                {/if}

                                {#if selectedAuthType === "Digest Auth"}
                                  <!-- Digest Auth -->
                                  <div class="mt-4">
                                    <label
                                      for="digestUsername"
                                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                      Username
                                    </label>
                                    <input
                                      type="text"
                                      id="mockdigestUsername"
                                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                      placeholder="Enter Username"
                                      bind:value={tab.auth[6].username}
                                    />
                                    <label
                                      for="digestPassword"
                                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                      Password
                                    </label>
                                    <input
                                      type="password"
                                      id="mockdigestPassword"
                                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                      placeholder="Enter Password"
                                      bind:value={tab.auth[6].password}
                                    />
                                  </div>
                                {/if}

                                {#if selectedAuthType === "No Auth"}
                                  <div class="mt-4">
                                    <p
                                      class="text-sm text-gray-900 dark:text-white"
                                    >
                                      No authentication required for this
                                      endpoint.
                                    </p>
                                  </div>
                                {/if}
                              </form>
                            </div>
                            <!-- pre processors tab -->
                            <input
                              type="radio"
                              name="my_tabs_11"
                              role="tab"
                              aria-label="Pre"
                              class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                            />
                            <div
                              role="tabpanel"
                              class="tab-content bg-gray-100 border-base-300 rounded-box p-6"
                            ></div>
                            <!-- post processors tab -->
                            <input
                              type="radio"
                              name="my_tabs_11"
                              role="tab"
                              aria-label="Post"
                              class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                            />
                            <div
                              role="tabpanel"
                              class="tab-content bg-gray-100 border-base-300 rounded-box p-6"
                            ></div>
                            <!-- settings -->
                            <input
                              type="radio"
                              name="my_tabs_11"
                              role="tab"
                              aria-label="Settings"
                              class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                            />
                            <div
                              role="tabpanel"
                              class="tab-content bg-gray-100 border-base-300 rounded-box p-6"
                            ></div>
                          </div>

                          <!-- response of run tab -->
                          <div class="mt-4 pb-5 mb-5">
                            <label
                              for=""
                              class="text-gray-600 tracking-[0.05rem]"
                              style="font-weight:520;font-size:15px"
                              >Response</label
                            >

                            <!-- if response is empty then dont show response tabs -->
                            {#if response !== ""}
                              <!-- response tabs -->
                              <div
                                role="tablist"
                                class="tabs tabs-lifted mt-2"
                                data-testid="responseTabs"
                              >
                                <!-- response body tab -->
                                <input
                                  type="radio"
                                  name="my_tabs_17"
                                  role="tab"
                                  aria-label="Body"
                                  class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                                  checked
                                />
                                <div
                                  role="tabpanel"
                                  class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
                                >
                                  <textarea
                                    name=""
                                    id="responseData"
                                    rows="7"
                                    data-testid="response"
                                    class="responseData border border-gray-200 p-2 w-full text-xs tracking-[0.06rem] text-red-500"
                                    >{response}</textarea
                                  >
                                </div>

                                <!-- response cookies tab -->
                                <input
                                  type="radio"
                                  name="my_tabs_17"
                                  role="tab"
                                  aria-label="Cookies"
                                  class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                                />
                                <div
                                  role="tabpanel"
                                  class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
                                ></div>
                              </div>
                            {:else}
                              <div
                                class="py-5 text-center text-xs text-gray-500"
                              >
                                Send request to get response
                              </div>
                            {/if}
                          </div>
                        </div>

                        <!-- mock tab -->
                        <input
                          type="radio"
                          name={`my_tabs_${tab.id}`}
                          role="tab"
                          class="tab hover:text-violet-700 bg-gray-100 checked:bg-checked-white text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                          aria-label="Mock"
                          checked={currentTab === "mock"}
                          on:change={() => (currentTab = "mock")}
                        />
                        <div
                          role="tabpanel"
                          class="tab-content bg-base-100 border-base-300 rounded-box p-6 overflow-hidden"
                        >
                          <!-- expectations -->
                          <div class="flex my-3 items-center justify-between">
                            <div class="flex gap-1">
                              <button
                                type="button"
                                class="py-2 px-3 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 {activeButton ===
                                'Expectations'
                                  ? 'active'
                                  : ''}"
                                on:click={() => switchButton("Expectations")}
                              >
                                Expectations
                              </button>
                              <button
                                type="button"
                                class="py-2 px-3 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 {activeButton ===
                                'Script'
                                  ? 'active'
                                  : ''}"
                                on:click={() => switchButton("Script")}
                              >
                                Script
                              </button>
                            </div>

                            <button
                              type="button"
                              onclick="my_modal_33.showModal()"
                              class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-xs px-3 tracking-[0.05rem] py-2 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 capitalize"
                              ><i class="fa-solid fa-plus text-xs"
                                >&nbsp;New Expectation</i
                              ></button
                            >
                          </div>

                          <dialog id="my_modal_33" class="modal">
                            <div class="modal-box max-w-[47rem]">
                              <h3 class="text-lg font-medium">New</h3>
                              <div class="mt-4">
                                <label
                                  for="small-input"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  >Expectation Name *</label
                                >
                                <input
                                  type="text"
                                  id="small-input"
                                  class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                              </div>
                              <div class="mt-2">
                                <label
                                  for="small-input"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  >Params Conditions</label
                                >
                                <div class="relative overflow-x-auto mt-1">
                                  <table
                                    class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                  >
                                    <thead
                                      class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                    >
                                      <tr>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                        </th>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                          Location
                                        </th>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                          Name</th
                                        >
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                          Comparison
                                        </th>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                          Value
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr class="bg-white dark:bg-gray-800">
                                        <td class=" border border-gray-300">
                                        </td>
                                        <td class=" border border-gray-300">
                                          <select
                                            name=""
                                            id=""
                                            class="px-4 py-2 w-full h-full text-xs shadow-none text-gray-600 tracking-[0.06rem] border-0 focus:outline-none placeholder:text-gray-400 placeholder:text-sm"
                                          >
                                            <option value="">query</option>
                                          </select>
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-4 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          />
                                        </td>
                                        <td class=" border border-gray-300">
                                          <select
                                            name=""
                                            id=""
                                            class="px-4 py-2 w-full h-full text-xs shadow-none text-gray-600 tracking-[0.06rem] border-0 focus:outline-none placeholder:text-gray-400 placeholder:text-sm"
                                          >
                                            <option value="" selected
                                              >Equal To</option
                                            >
                                          </select>
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-4 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>

                                <label
                                  class="inline-flex items-center cursor-pointer my-3"
                                >
                                  <span
                                    class=" text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >IP Conditions</span
                                  >
                                  <div
                                    class="relative w-11 ms-3 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                                  ></div>
                                  <input
                                    type="checkbox"
                                    value=""
                                    class="sr-only peer"
                                  />
                                </label>

                                <div class="mt-2">
                                  <label
                                    for="small-input"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >Response Data</label
                                  >
                                  <div
                                    role="tablist"
                                    class="tabs tabs-lifted mt-3"
                                  >
                                    <input
                                      type="radio"
                                      name="my_tabs_14"
                                      role="tab"
                                      checked
                                      class="relative tab bg-base-100 tracking-[0.05rem] text-xs truncate checked:bg-gray-100 checked:text-gray-600 px-3 checked:font-semibold flex justify-center"
                                      aria-label="Body"
                                    />
                                    <div
                                      role="tabpanel"
                                      class="tab-content bg-gray-100 border-base-300 rounded-box p-3 w-full"
                                    >
                                      <textarea
                                        name=""
                                        id=""
                                        rows="4"
                                        class="w-full border border-gray-200 bg-gray-50 p-2 rounded-md focus:border-blue-600"
                                      ></textarea>
                                    </div>
                                    <input
                                      type="radio"
                                      name="my_tabs_14"
                                      role="tab"
                                      class="relative tab bg-base-100 tracking-[0.05rem] text-xs truncate checked:bg-gray-100 checked:text-gray-600 px-3 checked:font-semibold flex justify-center"
                                      aria-label="Headers"
                                    />
                                    <div
                                      role="tabpanel"
                                      class="tab-content bg-gray-100 border-base-300 rounded-box p-3 w-full"
                                    >
                                      <div
                                        class="relative overflow-x-auto mt-1"
                                      >
                                        <table
                                          class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                        >
                                          <thead
                                            class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                          >
                                            <tr>
                                              <th
                                                scope="col"
                                                class="px-4 py-2 border border-gray-300"
                                              >
                                              </th>
                                              <th
                                                scope="col"
                                                class="px-4 py-2 border border-gray-300"
                                              >
                                                Name</th
                                              >

                                              <th
                                                scope="col"
                                                class="px-4 py-2 border border-gray-300"
                                              >
                                                Value
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr
                                              class="bg-white dark:bg-gray-800"
                                            >
                                              <td
                                                class=" border border-gray-300"
                                              >
                                              </td>

                                              <td
                                                class=" border border-gray-300"
                                              >
                                                <input
                                                  type="text"
                                                  class="px-4 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                                />
                                              </td>
                                              <td
                                                class=" border border-gray-300"
                                              >
                                                <input
                                                  type="text"
                                                  class="px-4 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                                />
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                    <input
                                      type="radio"
                                      name="my_tabs_14"
                                      role="tab"
                                      class="relative tab bg-base-100 tracking-[0.05rem] text-xs truncate checked:bg-gray-100 checked:text-gray-600 px-3 checked:font-semibold flex justify-center"
                                      aria-label="More"
                                    />
                                    <div
                                      role="tabpanel"
                                      class="tab-content bg-gray-100 border-base-300 rounded-box p-3 w-full"
                                    >
                                      <div class="flex flex-col gap-1">
                                        <label
                                          class="inline-flex items-center cursor-pointer my-2"
                                        >
                                          <span
                                            class=" text-sm font-medium text-gray-900 dark:text-gray-300"
                                            >IP Conditions</span
                                          >
                                          <div
                                            class="relative w-11 ms-3 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                                          ></div>
                                          <input
                                            type="checkbox"
                                            value=""
                                            class="sr-only peer"
                                          />
                                        </label>
                                        <label
                                          class="inline-flex items-center cursor-pointer my-2"
                                        >
                                          <span
                                            class=" text-sm font-medium text-gray-900 dark:text-gray-300"
                                            >Response HTTP Status Code</span
                                          >
                                          <input
                                            type="text"
                                            id="small-input"
                                            class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                          />
                                        </label>
                                        <label
                                          class="inline-flex items-center cursor-pointer my-2"
                                        >
                                          <span
                                            class=" text-sm font-medium text-gray-900 dark:text-gray-300"
                                            >Response Delay</span
                                          >
                                          <input
                                            type="text"
                                            id="small-input"
                                            class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="modal-action">
                                  <form method="dialog">
                                    <!-- if there is a button in form, it will close the modal -->
                                    <button class="btn">Close</button>
                                  </form>

                                  <button
                                    class="btn bg-violet-600 hover:bg-violet-700 text-white"
                                    >Save</button
                                  >
                                </div>
                              </div>
                            </div>
                          </dialog>

                          {#if activeButton === "Expectations"}
                            <div class="relative overflow-x-auto">
                              <table
                                class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                              >
                                <thead
                                  class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                >
                                  <tr>
                                    <th
                                      scope="col"
                                      class="px-3 py-2 border border-gray-300"
                                    ></th>
                                    <th
                                      scope="col"
                                      class="px-3 py-2 border text-violet-600 font-semibold border-gray-300"
                                      >Local</th
                                    >
                                    <th
                                      scope="col"
                                      class="px-3 py-2 border border-gray-300"
                                      >Cloud</th
                                    >
                                    <th
                                      scope="col"
                                      class="px-3 py-2 border border-gray-300"
                                      >Name</th
                                    >
                                    <th
                                      scope="col"
                                      class="px-3 py-2 border border-gray-300"
                                      >Condition</th
                                    >
                                    <th
                                      scope="col"
                                      class="px-3 py-2 border border-gray-300"
                                      >Creator</th
                                    >
                                    <th
                                      scope="col"
                                      class="px-3 py-2 border border-gray-300"
                                      >Actions</th
                                    >
                                  </tr>
                                </thead>
                                <tbody>
                                  {#each tab.responses as response}
                                    <tr class="bg-white dark:bg-gray-800">
                                      <td
                                        class=" border border-gray-300 px-3 py-2"
                                        ><i class="fa-solid fa-ellipsis"
                                        ></i></td
                                      >
                                      <td
                                        class=" border border-gray-300 px-3 py-2"
                                      >
                                        <label
                                          class="inline-flex items-center me-0 cursor-pointer"
                                        >
                                          <input
                                            type="checkbox"
                                            value=""
                                            class="sr-only peer"
                                            checked
                                          />
                                          <div
                                            class="relative w-9 h-5 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"
                                          ></div>
                                        </label>
                                      </td>
                                      <td
                                        class=" border border-gray-300 px-3 py-2 text-gray-600"
                                      >
                                        <label
                                          class="inline-flex items-center me-0 cursor-pointer"
                                        >
                                          <input
                                            type="checkbox"
                                            value=""
                                            class="sr-only peer"
                                            checked
                                          />
                                          <div
                                            class="relative w-9 h-5 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"
                                          ></div>
                                        </label>
                                      </td>
                                      <td
                                        class=" border border-gray-300 px-3 py-2 text-gray-600"
                                      >
                                        {response.description}
                                      </td>
                                      <td
                                        class=" border border-gray-300 px-3 py-2 text-gray-600"
                                      >
                                        Path params
                                        <span
                                          class="px-2 py-1 bg-gray-50 rounded-md"
                                          >{tab.parameters[0].name
                                            ? tab.parameters[0].name
                                            : null}</span
                                        > equal to 1
                                      </td>
                                      <td
                                        class=" border border-gray-300 px-3 py-2 text-gray-600"
                                      >
                                        {tab.createdBy}
                                      </td>
                                      <td
                                        class=" border border-gray-300 px-3 py-3 text-gray-600"
                                      >
                                        <div class="flex gap-2 items-center">
                                          <a href="" class="text-violet-600"
                                            >Details</a
                                          >
                                          <span class="text-gray-400"
                                            >Request</span
                                          >
                                          <i
                                            class="fa-solid ms-1 fa-ellipsis text-gray-500"
                                          ></i>
                                        </div>
                                      </td>
                                    </tr>
                                  {/each}
                                </tbody>
                              </table>
                            </div>
                            <!-- script -->
                          {:else if activeButton === "Script"}
                            <div class="border border-gray-200 rounded-md">
                              <div
                                class="p-2 flex justify-between border-b border-gray-200"
                              >
                                Custom Script
                              </div>
                              <textarea
                                name=""
                                rows="7"
                                id=""
                                class="w-full h-full p-2 border shadow-none focus:outline-none border-gray-200 rounded-md text-xs tracking-[0.05rem]"
                              ></textarea>
                            </div>
                          {/if}
                        </div>
                      </div>
                    {/if}
                  {/if}

                  {#if tab.label === "newEndpoint"}
                    <div
                      style="overflow-y: auto; max-height: calc(100vh - 50px);"
                    >
                      <!-- edit api path and method -->
                      <div class="mt-2 flex items-center gap-1 w-full">
                        <div class="flex items-center w-full gap-1">
                          <select
                            name=""
                            id=""
                            class="py-1.5 rounded-md px-2 border-gray-200 text-xs tracking-[0.06rem] w-fit"
                            bind:value={tab.method}
                          >
                            <option
                              value="GET"
                              class="text-green-600 font-semibold"
                              selected>GET</option
                            >
                            <option
                              value="POST"
                              class="text-violet-600 font-semibold">POST</option
                            >
                            <option
                              value="DELETE "
                              class="text-red-600 font-semibold">DELETE</option
                            >
                          </select>
                          <input
                            type="text"
                            class="py-1.5 rounded-md text-xs px-2 w-full border-gray-200 tracking-[0.06rem]"
                            placeholder=""
                            bind:value={tab.path}
                          />
                        </div>
                        <button
                          class="py-2 tracking-[0.05rem] px-3 text-white border border-violet-600 bg-violet-600 hover:bg-violet-800 rounded-md text-xs"
                          on:click={() => saveNewEndpoint(tab)}>Save</button
                        >
                        {#if newCollectionFolder}
                          <div
                            class="absolute z-50 border border-gray-200 shadow-xl top-[19%] left-[13%] w-[30vw] max-w-[40vw] rounded-lg bg-base-100 p-3"
                          >
                            <div class="flex justify-between items-center">
                              <span
                                class="tracking-[0.06rem]"
                                style="font-weight:520;font-size:15px"
                                >Save Endpoint</span
                              >
                              <i
                                class="fa-solid fa-times text-gray-500 cursor-pointer text-sm"
                                on:click={() => (newCollectionFolder = false)}
                              ></i>
                            </div>
                            <div class="flex flex-col items-center mt-4">
                              <form class="w-full mx-auto mb-3">
                                <label
                                  for="countries"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  >Parent Folder</label
                                >
                                <select
                                  id="countries"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  bind:value={chooseParentFolder}
                                >
                                  {#if filteredProjects.length > 0}
                                    {#each filteredProjects as api}
                                      {#if api.objDetails.name === "Endpoints"}
                                        <option value={api.objDetails.name}
                                          >{api.objDetails.name}</option
                                        >
                                        {#if api.objDetails.collections}
                                          {#each api.objDetails.collections as collection}
                                            <option
                                              value={collection.objDetails.name}
                                              >{collection.objDetails
                                                .name}</option
                                            >
                                          {/each}
                                        {/if}
                                      {/if}
                                    {/each}
                                  {/if}
                                </select>
                              </form>
                              {#if showNameInput}
                                <form class="mx-auto w-full mb-5">
                                  <label
                                    for="name"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >Name*</label
                                  >
                                  <input
                                    type="text"
                                    id="name"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-violet-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder=""
                                    required
                                    bind:value={newFolderName}
                                  />
                                </form>
                              {/if}
                            </div>
                            <div class="modal-action">
                              <form method="dialog" class="flex">
                                <!-- if there is a button in form, it will close the modal -->
                                <button
                                  type="button"
                                  class="rounded-md px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-500 text-xs font-semibold"
                                  on:click={() => (newCollectionFolder = false)}
                                  >Cancel</button
                                >
                                <button
                                  type="button"
                                  class="rounded-md px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold mx-2"
                                  on:click={addNewFolderForEndpoint}>Ok</button
                                >
                              </form>
                            </div>
                          </div>
                        {/if}
                        <button
                          class="py-2 tracking-[0.05rem] px-2 border border-gray-300 bg-base-100 hover:bg-gray-100 rounded-md text-xs"
                          >Run</button
                        >
                        <button
                          class="py-2 border border-gray-300 tracking-[0.05rem] px-2 bg-base-100 hover:bg-gray-100 rounded-md text-xs"
                          >Delete
                        </button>
                      </div>
                      <!-- edit api details -->
                      <div class="mt-3 w-full">
                        <input
                          type="text"
                          style="font-weight: 520;"
                          class="py-1.5 rounded-md text-sm px-2 w-full border-1 border-gray-100 focus:border-violet-300 tracking-[0.06rem]"
                          placeholder=""
                          bind:value={tab.name}
                        />
                      </div>
                      <div class="mt-3 flex items-center w-full gap-2">
                        <div class="flex flex-col w-full">
                          <!-- endpoint status -->
                          <form class="w-full">
                            <label
                              for="status"
                              class="block mb-1 text-sm font-medium text-gray-700 dark:text-white"
                              >Status*</label
                            >
                            <select
                              id="status"
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              bind:value={tab.status}
                            >
                              <option selected>Released</option>
                              <option value="US">Testing</option>
                              <option value="CA">Deprecated</option>
                              <option value="FR">Developing</option>
                            </select>
                          </form>
                        </div>
                        <div class="flex flex-col w-full">
                          <!-- endpoint maintainer -->
                          <form class="w-full">
                            <label
                              for="maintainer"
                              class="block mb-1 text-sm font-medium text-gray-700 dark:text-white"
                              >Maintainer</label
                            >
                            <input
                              type="text"
                              id="maintainer"
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              bind:value={tab.maintainer}
                            />
                          </form>
                        </div>
                        <div class="flex flex-col w-full">
                          <!-- endpoint tags -->
                          <form class="w-full">
                            <label
                              for="tags"
                              class="block mb-1 text-sm font-medium text-gray-700 dark:text-white"
                              >Tags</label
                            >
                            <select
                              id="tags"
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              bind:value={tab.tags}
                            >
                              <option selected>Pet</option>
                            </select>
                          </form>
                        </div>
                        <div class="flex flex-col w-full">
                          <form class="w-full">
                            <!-- endpoint service -->
                            <label
                              for="service"
                              class="block mb-1 text-sm font-medium text-gray-700 dark:text-white"
                              >Service</label
                            >
                            <select
                              id="service"
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              bind:value={tab.service}
                            >
                              <option value="" selected
                                >Inherit from Parents</option
                              >
                            </select>
                          </form>
                        </div>
                      </div>
                      <div class="flex flex-col w-full mt-2">
                        <!-- operation id -->
                        <form class="w-full">
                          <label
                            for="operationId"
                            class="block mb-1 text-sm font-medium text-gray-600 dark:text-white"
                            >operationId</label
                          >
                          <input
                            type="text"
                            placeholder="operationId of openAPI"
                            class="placeholder:text-gray-400 rounded-md placeholder:text-sm p-2 text-sm tracking-[0.05rem] border border-gray-300 text-gray-900"
                          />
                        </form>
                      </div>
                      <div class="flex flex-col w-full mt-2">
                        <!-- endpoint description -->
                        <form class="w-full">
                          <label
                            for="service"
                            class="block mb-1 text-sm font-medium text-gray-600 dark:text-white"
                            >Description</label
                          >
                          <textarea
                            name=""
                            id=""
                            rows="3"
                            placeholder="Support Markdown"
                            class="w-full rounded-md placeholder:text-gray-400 placeholder:text-sm p-2 text-sm tracking-[0.05rem] border border-gray-300 text-gray-900"
                          ></textarea>
                        </form>
                      </div>
                      <!-- api details end -->

                      <!-- request start -->
                      <div class="mt-2">
                        <span
                          class="text-gray-500"
                          style="font-weight: 600;font-size:16px">Request</span
                        >
                        <div role="tablist" class="tabs tabs-lifted mt-2">
                          <!-- params tab -->
                          <input
                            type="radio"
                            name="my_tabs_10"
                            role="tab"
                            aria-label="Params"
                            class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                            checked
                          />
                          <div
                            role="tabpanel"
                            class="tab-content bg-base-100 border-gray-300 rounded-box p-3"
                          >
                            <span
                              class="text-gray-400"
                              style="font-weight: 600;">Query Params</span
                            >
                            <div class="relative overflow-x-auto mt-1">
                              <table
                                class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                              >
                                <thead
                                  class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                >
                                  <tr>
                                    <th
                                      scope="col"
                                      class="px-4 py-2 border border-gray-300 text-gray-600"
                                    >
                                      Name
                                    </th>
                                    <th
                                      scope="col"
                                      class="px-4 py-2 border border-gray-300"
                                    >
                                      Type</th
                                    >
                                    <th
                                      scope="col"
                                      class="px-4 py-2 border border-gray-300"
                                    >
                                      Example
                                    </th>
                                    <th
                                      scope="col"
                                      class="px-4 py-2 border border-gray-300"
                                    >
                                      Description
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr class="bg-white dark:bg-gray-800">
                                    <td class=" border border-gray-300">
                                      <input
                                        type="text"
                                        class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        placeholder="Add a new param"
                                      />
                                    </td>
                                    <td class=" border border-gray-300">
                                      <input
                                        type="text"
                                        class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                      />
                                    </td>
                                    <td class=" border border-gray-300">
                                      <input
                                        type="text"
                                        class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                      />
                                    </td>
                                    <td class=" border border-gray-300">
                                      <input
                                        type="text"
                                        class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <span
                              class="text-gray-400 mt-2 inline-block"
                              style="font-weight: 600;">Path Params</span
                            >
                            <div class="relative overflow-x-auto mt-1">
                              <table
                                class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                              >
                                <thead
                                  class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                >
                                  <tr>
                                    <th
                                      scope="col"
                                      class="px-4 py-2 border border-gray-300 text-gray-600"
                                    >
                                      Name
                                    </th>
                                    <th
                                      scope="col"
                                      class="px-4 py-2 border border-gray-300"
                                    >
                                      Type</th
                                    >
                                    <th
                                      scope="col"
                                      class="px-4 py-2 border border-gray-300"
                                    >
                                      Example
                                    </th>
                                    <th
                                      scope="col"
                                      class="px-4 py-2 border border-gray-300"
                                    >
                                      Description
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {#each tab.parameters as parameter}
                                    <tr class="bg-white dark:bg-gray-800">
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          class="px-4 py-2 border-gray-100 text-sm focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          placeholder="Add a new param"
                                          bind:value={parameter.name}
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          bind:value={parameter.type}
                                          class="px-4 py-2 border-gray-100 text-sm focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          bind:value={parameter.example}
                                          class="px-4 py-2 border-gray-100 text-sm focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        />
                                      </td>
                                      <td class=" border border-gray-300">
                                        <input
                                          type="text"
                                          bind:value={parameter.description}
                                          class="px-4 py-2 border-gray-100 text-sm focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        />
                                      </td>
                                    </tr>
                                  {/each}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <!-- body tab -->
                          <input
                            type="radio"
                            name="my_tabs_10"
                            role="tab"
                            aria-label="Body"
                            class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                          />
                          <div
                            role="tabpanel"
                            class="tab-content bg-base-100 border-base-300 rounded-box p-3"
                          >
                            <div role="tablist" class="tabs tabs-lifted mt-2">
                              <!-- none tab -->
                              <input
                                type="radio"
                                name="my_tabs_13"
                                role="tab"
                                aria-label="none"
                                class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                                checked
                              />
                              <div
                                role="tabpanel"
                                class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
                              >
                                <div
                                  class="flex justify-center items-center h-[8vh] text-xs tracking-[0.06rem] text-gray-500"
                                >
                                  This request has no body parameters.
                                </div>
                              </div>

                              <!-- form-data -->
                              <input
                                type="radio"
                                name="my_tabs_13"
                                role="tab"
                                aria-label="form-data"
                                class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                              />
                              <div
                                role="tabpanel"
                                class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
                              >
                                <div class="relative overflow-x-auto mt-1">
                                  <table
                                    class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                  >
                                    <thead
                                      class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                    >
                                      <tr>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300 text-gray-600"
                                        >
                                          Name
                                        </th>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                          Type</th
                                        >
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                          Example
                                        </th>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                          Description
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr class="bg-white dark:bg-gray-800">
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                            placeholder="Add a new param"
                                          />
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          />
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          />
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <!-- x-www-form -->
                              <input
                                type="radio"
                                name="my_tabs_13"
                                role="tab"
                                aria-label="x-www-form"
                                class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                              />
                              <div
                                role="tabpanel"
                                class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
                              >
                                <div class="relative overflow-x-auto mt-1">
                                  <table
                                    class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                  >
                                    <thead
                                      class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                    >
                                      <tr>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300 text-gray-600"
                                        >
                                          Name
                                        </th>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                          Type</th
                                        >
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                          Example
                                        </th>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                          Description
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr class="bg-white dark:bg-gray-800">
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                            placeholder="Add a new param"
                                          />
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          />
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          />
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <!-- json -->
                              <input
                                type="radio"
                                name="my_tabs_13"
                                role="tab"
                                aria-label="json"
                                class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                              />
                              <div
                                role="tabpanel"
                                class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
                              >
                                <div class="relative overflow-x-auto mt-1">
                                  <table
                                    class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                  >
                                    <thead
                                      class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                    >
                                      <tr>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                          style="color: rgb(124,58,237);"
                                        >
                                          Root
                                        </th>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                          style="color:blue"
                                        >
                                          Object</th
                                        >
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                          Mock
                                        </th>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                          Description
                                        </th>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr class="bg-white dark:bg-gray-800">
                                        <td class=" border border-gray-300">
                                          <select
                                            name=""
                                            id=""
                                            class="px-1 py-2 w-full h-full text-xs shadow-none text-gray-600 tracking-[0.06rem] border-0 focus:outline-none placeholder:text-gray-400 placeholder:text-sm"
                                          >
                                            <option value="" disabled selected
                                              >Choose Fields</option
                                            >
                                          </select>
                                        </td>
                                        <td class=" border border-gray-300">
                                          <select
                                            name=""
                                            id=""
                                            class="px-3 py-2 w-full h-full text-xs shadow-none text-gray-600 tracking-[0.06rem] border-0 focus:outline-none placeholder:text-gray-400 placeholder:text-sm"
                                          >
                                            <option value="" selected
                                              >String</option
                                            >
                                          </select>
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-3 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                            placeholder="Mock"
                                          />
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-3 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          />
                                        </td>
                                        <td class=" border border-gray-300">
                                          <div
                                            class="flex items-center gap-1 px-2"
                                          >
                                            <i
                                              on:click={() =>
                                                addField(tab, index)}
                                              class="fa-solid fa-plus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-green-600"
                                            ></i>
                                            <i
                                              on:click={() =>
                                                removeField(tab, index)}
                                              class="fa-solid fa-minus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-violet-600"
                                            ></i>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <!--xml -->
                              <input
                                type="radio"
                                name="my_tabs_13"
                                role="tab"
                                aria-label="xml"
                                class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                              />
                              <div
                                role="tabpanel"
                                class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
                              >
                                <div class="relative overflow-x-auto mt-1">
                                  <table
                                    class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                  >
                                    <thead
                                      class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                    >
                                      <tr>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                          style="color: rgb(124,58,237);"
                                        >
                                          Root
                                        </th>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                          style="color:blue"
                                        >
                                          Object</th
                                        >
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                          Mock
                                        </th>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                          Description
                                        </th>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr class="bg-white dark:bg-gray-800">
                                        <td class=" border border-gray-300">
                                          <select
                                            name=""
                                            id=""
                                            class="px-1 py-2 w-full h-full text-xs shadow-none text-gray-600 tracking-[0.06rem] border-0 focus:outline-none placeholder:text-gray-400 placeholder:text-sm"
                                          >
                                            <option value="" disabled selected
                                              >Choose Fields</option
                                            >
                                          </select>
                                        </td>
                                        <td class=" border border-gray-300">
                                          <select
                                            name=""
                                            id=""
                                            class="px-3 py-2 w-full h-full text-xs shadow-none text-gray-600 tracking-[0.06rem] border-0 focus:outline-none placeholder:text-gray-400 placeholder:text-sm"
                                          >
                                            <option value="" selected
                                              >String</option
                                            >
                                          </select>
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-3 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                            placeholder="Mock"
                                          />
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-3 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          />
                                        </td>
                                        <td class=" border border-gray-300">
                                          <div
                                            class="flex items-center gap-1 px-2"
                                          >
                                            <i
                                              on:click={() =>
                                                addField(tab, index)}
                                              class="fa-solid fa-plus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-green-600"
                                            ></i>
                                            <i
                                              on:click={() =>
                                                removeField(tab, index)}
                                              class="fa-solid fa-minus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-violet-600"
                                            ></i>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <!-- raw -->
                              <input
                                type="radio"
                                name="my_tabs_13"
                                role="tab"
                                aria-label="raw"
                                class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                              />
                              <div
                                role="tabpanel"
                                class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
                              >
                                <div class="w-[27vw] h-[37vh] mx-auto">
                                  <div>
                                    <div
                                      class="text-center p-1 bg-gray-50 rounded-md"
                                    >
                                      Media Type: text/plain
                                    </div>
                                    <div class="mt-2">
                                      <span class="text-sm">Example</span>
                                      <div class=" mt-1">
                                        <textarea
                                          name=""
                                          id=""
                                          rows="3"
                                          class="w-full border border-gray-200 rounded-md p-2 focus:border-violet-600"
                                        ></textarea>
                                      </div>
                                    </div>
                                    <div class="mt-2">
                                      <span class="text-sm">Description</span>
                                      <div class=" mt-1">
                                        <textarea
                                          name=""
                                          id=""
                                          rows="1"
                                          class="w-full border border-gray-200 rounded-md p-2 focus:border-violet-600 placeholder:text-gray-400"
                                          placeholder="Support Markdown"
                                        ></textarea>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <!-- binary -->
                              <input
                                type="radio"
                                name="my_tabs_13"
                                role="tab"
                                aria-label="binary"
                                class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                              />
                              <div
                                role="tabpanel"
                                class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
                              >
                                <div class="w-[27vw] h-[15vh] mx-auto">
                                  <div>
                                    <div
                                      class="text-center p-1 bg-gray-50 rounded-md"
                                    >
                                      Media Type: application/octet-stream
                                    </div>
                                    <div class="mt-2">
                                      <div class=" mt-1">
                                        <div
                                          class="flex items-center justify-center w-full"
                                        >
                                          <label
                                            for="dropzone-file"
                                            class="flex flex-col items-center justify-center w-full border-2 border-gray-200 rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                          >
                                            <div
                                              class="flex items-center gap-1 pt-2 pb-2"
                                            >
                                              <svg
                                                class="w-6 h-6 text-gray-500 dark:text-gray-400"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 20 16"
                                              >
                                                <path
                                                  stroke="currentColor"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                                  stroke-width="2"
                                                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                />
                                              </svg>
                                              <span
                                                class="text-sm text-gray-500 dark:text-gray-400"
                                                ><span class="font-semibold"
                                                  >Upload</span
                                                ></span
                                              >
                                            </div>
                                            <input
                                              id="dropzone-file"
                                              type="file"
                                              class="hidden"
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <!-- graphql -->
                              <input
                                type="radio"
                                name="my_tabs_13"
                                role="tab"
                                aria-label="GraphQl"
                                class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                              />
                              <div
                                role="tabpanel"
                                class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
                              >
                                <div
                                  class="flex justify-center items-center h-[8vh] text-xs tracking-[0.06rem] text-gray-500"
                                >
                                  No need to define the Body
                                </div>
                              </div>
                              <!-- mgspack -->
                              <input
                                type="radio"
                                name="my_tabs_13"
                                role="tab"
                                aria-label="mgspack"
                                class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                              />
                              <div
                                role="tabpanel"
                                class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
                              >
                                <div class="relative overflow-x-auto mt-1">
                                  <table
                                    class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                  >
                                    <thead
                                      class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                    >
                                      <tr>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                          style="color: rgb(124,58,237);"
                                        >
                                          Root
                                        </th>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                          style="color:blue"
                                        >
                                          Object</th
                                        >
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                          Mock
                                        </th>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                          Description
                                        </th>
                                        <th
                                          scope="col"
                                          class="px-4 py-2 border border-gray-300"
                                        >
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr class="bg-white dark:bg-gray-800">
                                        <td class=" border border-gray-300">
                                          <select
                                            name=""
                                            id=""
                                            class="px-1 py-2 w-full h-full text-xs shadow-none text-gray-600 tracking-[0.06rem] border-0 focus:outline-none placeholder:text-gray-400 placeholder:text-sm"
                                          >
                                            <option value="" disabled selected
                                              >Choose Fields</option
                                            >
                                          </select>
                                        </td>
                                        <td class=" border border-gray-300">
                                          <select
                                            name=""
                                            id=""
                                            class="px-3 py-2 w-full h-full text-xs shadow-none text-gray-600 tracking-[0.06rem] border-0 focus:outline-none placeholder:text-gray-400 placeholder:text-sm"
                                          >
                                            <option value="" selected
                                              >String</option
                                            >
                                          </select>
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-3 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                            placeholder="Mock"
                                          />
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            class="px-3 py-2 border-gray-100 w-full focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          />
                                        </td>
                                        <td class=" border border-gray-300">
                                          <div
                                            class="flex items-center gap-1 px-2"
                                          >
                                            <i
                                              on:click={() =>
                                                addField(tab, index)}
                                              class="fa-solid fa-plus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-green-600"
                                            ></i>
                                            <i
                                              on:click={() =>
                                                removeField(tab, index)}
                                              class="fa-solid fa-minus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-violet-600"
                                            ></i>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                          <!-- headers tab -->
                          <input
                            type="radio"
                            name="my_tabs_10"
                            role="tab"
                            aria-label="Headers"
                            class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                          />
                          <div
                            role="tabpanel"
                            class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                          >
                            <span
                              class="text-gray-400"
                              style="font-weight: 600;">Headers</span
                            >
                            <div class="relative overflow-x-auto mt-1">
                              <table
                                class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                              >
                                <thead
                                  class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                >
                                  <tr>
                                    <th
                                      scope="col"
                                      class="px-4 py-2 border border-gray-300 text-gray-600"
                                    >
                                      Name
                                    </th>
                                    <th
                                      scope="col"
                                      class="px-4 py-2 border border-gray-300"
                                    >
                                      Type</th
                                    >
                                    <th
                                      scope="col"
                                      class="px-4 py-2 border border-gray-300"
                                    >
                                      Example
                                    </th>
                                    <th
                                      scope="col"
                                      class="px-4 py-2 border border-gray-300"
                                    >
                                      Description
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {#if tab.headers.length > 0}
                                    {#each tab.headers as header}
                                      <tr class="bg-white dark:bg-gray-800">
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            bind:value={header.name}
                                            class="px-4 py-2 text-sm border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                            placeholder="Add a new param"
                                          />
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            bind:value={header.type}
                                            class="px-4 py-2 text-sm border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          />
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            bind:value={header.example}
                                            class="px-4 py-2 text-sm border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          />
                                        </td>
                                        <td class=" border border-gray-300">
                                          <input
                                            type="text"
                                            bind:value={header.description}
                                            class="px-4 py-2 text-sm border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                          />
                                        </td>
                                      </tr>
                                    {/each}
                                  {/if}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <!-- cookies tab -->
                          <input
                            type="radio"
                            name="my_tabs_10"
                            role="tab"
                            aria-label="Cookies"
                            class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                          />
                          <div
                            role="tabpanel"
                            class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                          >
                            <div class="relative overflow-x-auto mt-1">
                              <table
                                class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                              >
                                <thead
                                  class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                >
                                  <tr>
                                    <th
                                      scope="col"
                                      class="px-4 py-2 border border-gray-300 text-gray-600"
                                    >
                                      Name
                                    </th>
                                    <th
                                      scope="col"
                                      class="px-4 py-2 border border-gray-300"
                                    >
                                      Type</th
                                    >
                                    <th
                                      scope="col"
                                      class="px-4 py-2 border border-gray-300"
                                    >
                                      Example
                                    </th>
                                    <th
                                      scope="col"
                                      class="px-4 py-2 border border-gray-300"
                                    >
                                      Description
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr class="bg-white dark:bg-gray-800">
                                    <td class=" border border-gray-300">
                                      <input
                                        type="text"
                                        class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                        placeholder="Add a new param"
                                      />
                                    </td>
                                    <td class=" border border-gray-300">
                                      <input
                                        type="text"
                                        class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                      />
                                    </td>
                                    <td class=" border border-gray-300">
                                      <input
                                        type="text"
                                        class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                      />
                                    </td>
                                    <td class=" border border-gray-300">
                                      <input
                                        type="text"
                                        class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <!-- auth tab -->
                          <input
                            type="radio"
                            name="my_tabs_10"
                            role="tab"
                            aria-label="Auth"
                            class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                          />
                          <div
                            role="tabpanel"
                            class="tab-content bg-base-100 border-base-300 rounded-box p-3"
                          >
                            <form class="max-w-sm me-auto">
                              <label
                                for="countries"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >Type</label
                              >
                              <select
                                id="auths"
                                bind:value={selectedAuthType}
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              >
                                <option selected>Inherit from parent</option>
                                {#if tab.auth.length > 0}
                                  {#each tab.auth as auth}
                                    <option value={auth.type}
                                      >{auth.type}</option
                                    >
                                  {/each}
                                {/if}
                              </select>

                              {#if selectedAuthType === "Bearer Token"}
                                <div class="mt-4">
                                  <label
                                    for="bearerToken"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >Bearer Token</label
                                  >
                                  <input
                                    type="text"
                                    id="bearerToken"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Enter Bearer Token"
                                    bind:value={tab.auth[0].value}
                                  />
                                </div>
                              {/if}

                              {#if selectedAuthType === "API Key"}
                                <div class="mt-4">
                                  <label
                                    for="apiKey"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >API Key</label
                                  >
                                  <input
                                    type="text"
                                    id="apiKey"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Enter API Key"
                                    bind:value={tab.auth[1].value}
                                  />
                                </div>
                              {/if}

                              {#if selectedAuthType === "Basic Auth"}
                                <div class="mt-4">
                                  <label
                                    for="username"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >Username</label
                                  >
                                  <input
                                    type="text"
                                    id="usernameAuth"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Enter Username"
                                    bind:value={tab.auth[2].username}
                                  />
                                  <label
                                    for="password"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >Password</label
                                  >
                                  <input
                                    type="password"
                                    id="passwordAuth"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Enter Password"
                                    bind:value={tab.auth[2].password}
                                  />
                                </div>
                              {/if}

                              {#if selectedAuthType === "No Auth"}
                                <div class="mt-4">
                                  <p
                                    class="text-sm text-gray-900 dark:text-white"
                                  >
                                    No authentication required for this
                                    endpoint.
                                  </p>
                                </div>
                              {/if}
                            </form>
                          </div>
                          <!-- pre processors tab -->
                          <input
                            type="radio"
                            name="my_tabs_10"
                            role="tab"
                            aria-label="Pre"
                            class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                          />
                          <div
                            role="tabpanel"
                            class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                          ></div>
                          <!-- post processors tab -->
                          <input
                            type="radio"
                            name="my_tabs_10"
                            role="tab"
                            aria-label="Post"
                            class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                          />
                          <div
                            role="tabpanel"
                            class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                          ></div>
                          <!-- settings -->
                          <input
                            type="radio"
                            name="my_tabs_10"
                            role="tab"
                            aria-label="Settings"
                            class="tab hover:text-violet-700 bg-gray-100 checked:bg-base-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
                          />
                          <div
                            role="tabpanel"
                            class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                          ></div>
                        </div>
                      </div>

                      <!-- reponse start -->
                      <div class="mt-4 mb-5 pb-5">
                        <span
                          class="tracking-[0.06rem]"
                          style="font-size: 17px;font-weight:600;color:rgba(0,0,0,0.6)"
                          >Responses</span
                        >
                        <div class="flex justify-between items-start w-full">
                          <!-- response tabs -->
                          <div role="tablist" class="tabs tabs-lifted mt-2">
                            <!-- response code -->
                            {#if tab.responses.length > 0}
                              {#each tab.responses as response}
                                <input
                                  type="radio"
                                  name={`my_tabs_${response.id}`}
                                  role="tab"
                                  checked={response.id === selectedTabId}
                                  on:change={() => handleTabClick(response.id)}
                                  style="width: 12vw!important;"
                                  class="relative tab bg-gray-100 tracking-[0.05rem] text-xs truncate checked:bg-base-100 checked:text-gray-600 px-3 checked:font-semibold flex justify-center"
                                  aria-label="{response.description}({response.status})"
                                />
                                <div
                                  role="tabpanel"
                                  class="tab-content bg-base-100 border-base-300 rounded-box w-full"
                                >
                                  <div
                                    class="flex items-center gap-4 p-3 border-b border-gray-200"
                                  >
                                    <span class="text-gray-500"
                                      >HTTP Status Code : <input
                                        type="text"
                                        class="text-gray-600 border w-[4vw] rounded-md border-gray-200 px-2 py-1 focus:border-blue-600"
                                        bind:value={response.status}
                                      />
                                    </span>
                                    <span class="text-gray-500"
                                      >Name : <input
                                        type="text"
                                        class="text-gray-600 border w-[4vw] rounded-md border-gray-200 px-2 py-1 focus:border-blue-600"
                                        bind:value={response.description}
                                      />
                                    </span>
                                    <span class="text-gray-500"
                                      >Content Type : <select
                                        name=""
                                        id=""
                                        class="text-gray-600 border w-[4vw] rounded-md border-gray-200 px-2 py-1 focus:border-blue-600 text-sm"
                                      >
                                        <option value="JSON">JSON</option>
                                        <option value="XML">XML</option>
                                        <option value="HTML">HTML</option>
                                        <option value="Raw">Raw</option>
                                      </select></span
                                    >
                                    <span class="text-gray-500"
                                      >Content Type : <span
                                        class="text-gray-800"
                                        >application/json</span
                                      ></span
                                    >
                                  </div>

                                  <div class="my-3">
                                    <div
                                      class="flex justify-between items-center"
                                    >
                                      <div></div>
                                      <div class="flex items-center gap-1">
                                        <button
                                          on:click={() => previewTab(tab)}
                                          class="bg-gray-50 py-1 px-3 hover:bg-gray-100 border border-gray-300 cursor-pointer text-xs"
                                          >Preview</button
                                        >
                                        <button
                                          class="bg-gray-50 py-1 px-3 hover:bg-gray-100 border border-gray-300 cursor-pointer text-xs flex items-center gap-1"
                                          ><svg
                                            class="w-4 h-4 text-gray-800 dark:text-white"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              stroke="currentColor"
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                              stroke-width="2"
                                              d="m8 8-4 4 4 4m8 0 4-4-4-4m-2-3-4 14"
                                            />
                                          </svg>
                                          Generate Code</button
                                        >
                                        <button
                                          class="bg-gray-50 py-1 px-3 hover:bg-gray-100 border border-gray-300 cursor-pointer text-xs"
                                          >Json Schema</button
                                        >
                                      </div>
                                    </div>

                                    <dialog id="my_modal_32" class="modal">
                                      <div class="modal-box">
                                        <h3 class="text-lg font-bold">
                                          Preview
                                        </h3>
                                        <textarea
                                          class="w-full h-64 p-2 border border-gray-300"
                                          readonly
                                          bind:value={previewContent}
                                        ></textarea>
                                      </div>
                                      <form
                                        method="dialog"
                                        class="modal-backdrop"
                                      >
                                        <button class="btn">Close</button>
                                      </form>
                                    </dialog>

                                    <div class="relative overflow-x-auto">
                                      <table
                                        class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                      >
                                        <thead
                                          class="text-xs text-gray-900 uppercase dark:text-gray-400"
                                        >
                                          <tr>
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border text-violet-600 font-semibold border-gray-300"
                                              >Root</th
                                            >
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                              >Object</th
                                            >
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                              >Mock</th
                                            >
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                              >Description</th
                                            >
                                            <th
                                              scope="col"
                                              class="px-4 py-2 border border-gray-300"
                                            ></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {#each response.schemas as field, index}
                                            <tr
                                              class="bg-white dark:bg-gray-800"
                                            >
                                              <td
                                                class="px-4 py-2 border border-gray-300 flex items-center"
                                              >
                                                {#if field.type === "array" && field.items}
                                                  <i
                                                    class="fa-solid fa-caret-right"
                                                    style="font-size: 9px;"
                                                    on:click={() =>
                                                      showSubItem(index)}
                                                  ></i>
                                                {/if}
                                                <input
                                                  type="text"
                                                  bind:value={field.name}
                                                  class=" text-sm w-full py-1 border-none bg-transparent focus:outline-none"
                                                />
                                              </td>
                                              <td
                                                class="px-4 py-2 border border-gray-300 text-green-600"
                                              >
                                                <select
                                                  bind:value={field.type}
                                                  class="w-full py-1 text-sm border-none bg-transparent focus:outline-none text-green-600"
                                                >
                                                  <option value="integer<int64>"
                                                    >integer<int64
                                                    ></int64></option
                                                  >
                                                  <option value="Category"
                                                    >Category</option
                                                  >
                                                  <option value="string"
                                                    >string</option
                                                  >
                                                  <option value="array"
                                                    >array</option
                                                  >
                                                  <!-- Add more options as needed -->
                                                </select>
                                              </td>
                                              <td
                                                class="px-4 py-2 border border-gray-300"
                                              >
                                                <input
                                                  type="text"
                                                  bind:value={field.mock}
                                                  class="w-full py-1 text-sm border-none bg-transparent focus:outline-none"
                                                />
                                              </td>
                                              <td
                                                class="px-4 py-2 border border-gray-300"
                                              >
                                                <input
                                                  type="text"
                                                  bind:value={field.description}
                                                  class="w-full py-1 border-none text-sm bg-transparent focus:outline-none"
                                                />
                                              </td>
                                              <td
                                                class=" border border-gray-300"
                                              >
                                                <div
                                                  class="flex items-center gap-1 px-2"
                                                >
                                                  <i
                                                    on:click={() =>
                                                      addField(response, index)}
                                                    class="fa-solid fa-plus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-green-600"
                                                  ></i>
                                                  <i
                                                    on:click={() =>
                                                      removeField(
                                                        response,
                                                        index
                                                      )}
                                                    class="fa-solid fa-minus w-4 h-4 flex justify-center items-center border-0 border-gray-300 bg-gray-50 rounded-full text-xs text-violet-600"
                                                  ></i>
                                                </div>
                                              </td>
                                            </tr>
                                            {#if field.type === "array" && field.items && showItem[index]}
                                              {#each field.items as item, itemIndex}
                                                <tr
                                                  class="bg-gray-50 dark:bg-gray-700"
                                                >
                                                  <td
                                                    class="px-5 py-2 border border-gray-300"
                                                  >
                                                    <input
                                                      type="text"
                                                      bind:value={item.name}
                                                      class="w-full py-1 text-xs border-none bg-transparent focus:outline-none"
                                                    />
                                                  </td>
                                                  <td
                                                    class="px-4 py-2 text-xs border border-gray-300 text-green-600"
                                                  >
                                                    <select
                                                      bind:value={item.type}
                                                      class="w-full text-xs border-none bg-transparent focus:outline-none text-green-600"
                                                    >
                                                      <option
                                                        value="integer<int64>"
                                                        >integer<int64
                                                        ></int64></option
                                                      >
                                                      <option value="Category"
                                                        >Category</option
                                                      >
                                                      <option value="string"
                                                        >string</option
                                                      >
                                                      <option value="array"
                                                        >array</option
                                                      >
                                                      <!-- Add more options as needed -->
                                                    </select>
                                                  </td>
                                                  <td
                                                    class="px-4 py-2 text-xs border border-gray-300"
                                                  >
                                                    <input
                                                      type="text"
                                                      bind:value={item.mock}
                                                      class="w-full py-1 text-xs border-none bg-transparent focus:outline-none"
                                                    />
                                                  </td>
                                                  <td
                                                    class="px-4 py-2 text-xs border border-gray-300"
                                                  >
                                                    <input
                                                      type="text"
                                                      bind:value={item.description}
                                                      class="w-full py-1 border-none text-xs bg-transparent focus:outline-none"
                                                    />
                                                  </td>
                                                  <td
                                                    class="px-4 py-2 border border-gray-300 flex gap-1"
                                                    colspan="3"
                                                  >
                                                    <i
                                                      class="fa-solid fa-plus w-5 h-5 flex justify-center items-center border border-gray-300 bg-gray-50 rounded-full text-xs text-green-600"
                                                      on:click={() =>
                                                        addItem(field)}
                                                    ></i>
                                                    <i
                                                      class="fa-solid fa-minus w-5 h-5 flex justify-center items-center border border-gray-300 bg-gray-50 rounded-full text-xs text-violet-600"
                                                      on:click={() =>
                                                        removeItem(
                                                          field,
                                                          itemIndex
                                                        )}
                                                    ></i>
                                                  </td>
                                                </tr>
                                              {/each}
                                            {/if}
                                          {/each}
                                        </tbody>
                                      </table>
                                    </div>

                                    <!-- successfull responses -->
                                    {#if response.status === 200}
                                      <div class="mx-2 mt-2">
                                        <div
                                          style="font-weight:600"
                                          class="text-gray-600 text-sm"
                                        >
                                          Success Example
                                        </div>
                                        {#if response.examples.length > 0}
                                          <div
                                            class="border border-gray-200 p-2 text-xs tracking-[0.05rem]"
                                          >
                                            <pre
                                              class="json-example">{@html syntaxHighlight(
                                                JSON.stringify(
                                                  response.examples[0],
                                                  null,
                                                  2
                                                )
                                              )}</pre>
                                          </div>
                                        {:else}
                                          <div
                                            class="text-center text-gray-500 text-xs tracking-[0.06rem]"
                                          >
                                            There are no examples in the
                                            response
                                          </div>
                                        {/if}
                                      </div>
                                    {/if}
                                  </div>
                                </div>
                              {/each}
                            {/if}
                          </div>
                          <!-- add response tabs  -->

                          <details class="dropdown dropdown-left">
                            <summary
                              class="btn hover:bg-transparent py-0 px-1 bg-transparent border-0 shadow-none m-0"
                              style="height:0rem!important;max-height:0rem!important;min-height:1rem!important"
                            >
                              <div
                                class="flex gap-1 items-center cursor-pointer"
                              >
                                <i class="fa-solid fa-plus text-xs"></i><span
                                  >Add</span
                                >
                              </div>
                            </summary>
                            <ul
                              class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                            >
                              <li>
                                <a onclick="my_modal_24.showModal()"
                                  >Add Blank Response</a
                                >
                              </li>
                            </ul>
                          </details>

                          <!-- new response tab modal -->
                          <dialog id="my_modal_24" class="modal">
                            <div class="modal-box">
                              <span
                                class="tracking-[0.06rem]"
                                style="font-weight:520;font-size:15px"
                                >Add a Response</span
                              >

                              <div class="flex flex-col items-center mt-4">
                                <form class="mx-auto w-full">
                                  <label
                                    for="name"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >Name*</label
                                  >
                                  <input
                                    type="text"
                                    id="name"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-violet-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder=""
                                    required
                                    bind:value={newResponseName}
                                  />
                                </form>
                                <form class="mx-auto w-full">
                                  <label
                                    for="status"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >HTTP Status Code*</label
                                  >
                                  <input
                                    type="text"
                                    id="status"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-violet-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder=""
                                    required
                                    bind:value={newResponseStatus}
                                  />
                                </form>
                                <form class="w-full mx-auto mt-2">
                                  <label
                                    for="countries"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >Content Type</label
                                  >
                                  <select
                                    id="countries"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    bind:value={newResponseType}
                                  >
                                    <option value="JSON">JSON</option>
                                    <option value="XML">XML</option>
                                    <option value="HTML">HTML</option>
                                    <option value="Raw">Raw</option>
                                  </select>
                                </form>
                              </div>
                              <div class="modal-action">
                                <form
                                  method="dialog"
                                  class="flex gap-2 items-center"
                                >
                                  <!-- if there is a button in form, it will close the modal -->
                                  <button class="btn">Close</button>
                                  <button
                                    type="button"
                                    class="rounded-md px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold mx-2"
                                    on:click={() => addNewResponseTab(tab)}
                                    >Ok</button
                                  >
                                </form>
                              </div>
                            </div>
                          </dialog>
                        </div>
                      </div>
                    </div>
                  {/if}
                </div>
                <!-- <i class="fa-solid fa-times text-xs text-gray-600 absolute top-[9.5%] left-[36%]" on:click={() => removeTab(tab)}></i> -->
              {/each}
            {/if}
            {#if newTab}
              <!--add new tab for adding new schemas, endpoints tabs -->
              <input
                type="radio"
                name="my_tabs_2"
                role="tab"
                checked
                style="width: 8vw!important;"
                class="relative tab bg-base-100 tracking-[0.05rem] text-xs truncate checked:bg-gray-100 checked:text-gray-600 px-3 checked:font-semibold flex justify-center"
                aria-label="New..."
              />
              <div
                role="tabpanel"
                class="tab-content bg-gray-100 border-base-300 rounded-box p-3 w-[68vw]"
              >
                <div class="h-[80vh] flex justify-center items-center py-5">
                  <div class="flex flex-col gap-3">
                    <div class="flex items-center gap-2">
                      <div
                        class="bg-gray-50 hover:shadow-xl rounded-md cursor-pointer border border-gray-300 text-center p-4"
                        on:click={handleNewEndpointClick}
                      >
                        <i
                          class="fa-solid fa-snowflake text-3xl text-violet-700"
                        ></i>

                        <div class="mt-5">New Endpoint</div>
                      </div>
                      <div
                        class="bg-gray-50 hover:shadow-xl rounded-md cursor-pointer border border-gray-300 text-center p-4"
                      >
                        <i class="fa-solid fa-bolt text-3xl text-blue-700"></i>

                        <div class="mt-5">New Request</div>
                      </div>
                      <div
                        class="bg-gray-50 hover:shadow-xl border border-gray-300 rounded-md cursor-pointer text-center p-4"
                      >
                        <i class="fa-solid fa-m text-3xl text-red-700"></i>
                        <div class="mt-5">New Markdown</div>
                      </div>
                      <div
                        class="bg-gray-50 hover:shadow-xl rounded-md cursor-pointer border border-gray-300 text-center p-4"
                        on:click={handleNewSchemaClick}
                      >
                        <i class="fa-solid fa-table text-3xl text-blue-700"></i>

                        <div class="mt-5">New Schema</div>
                      </div>
                    </div>
                    <div class="mt-2 mx-auto">
                      <details class="dropdown">
                        <summary class="btn m-1">More</summary>
                        <ul
                          class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                        >
                          <li><a>New Endpoint folder</a></li>
                          <li><a>New Socket</a></li>
                          <li><a>Import</a></li>
                          <li><a>Import cURL</a></li>
                        </ul>
                      </details>
                    </div>
                  </div>
                </div>
              </div>
            {/if}
          </div>
          <div class="flex items-center gap-3 absolute right-0 top-[-0.2rem]">
            <i class="fa-solid fa-plus text-sm" on:click={addNewTab}></i>
            <details class="dropdown dropdown-left">
              <summary
                class="btn hover:bg-transparent py-0 px-1 bg-transparent border-0 shadow-none m-0"
                style="height:0rem!important;max-height:0rem!important;min-height:1rem!important"
              >
                <i class="fa-solid fa-ellipsis text-sm"></i>
              </summary>
              <ul
                class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
              >
                <li><a on:click={closeAllTabs}>Close All Tabs</a></li>
                <li><a on:click={closeSelectedTab}>Close Selected Tab</a></li>
                <li><a>Close Other Tabs</a></li>
                <li><a on:click={setActiveTabOverview}>Overview</a></li>
              </ul>
            </details>
            <form class="max-w-lg mx-auto">
              <div class="flex">
                <select
                  id="environments"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-xs tracking-[0.06rem] rounded-s-lg rounded-e-none shadow-none focus:outline-none block w-full p-1.5"
                >
                  <option selected>Choose Env</option>
                  {#each filteredEnvironments as env}
                    <option value={env.name}>{env.name}</option>
                  {/each}
                </select>
                <div class="relative w-full">
                  <input
                    type="search"
                    id="search-dropdown"
                    bind:value={searchQuery}
                    class="block p-1.5 w-[7vw] z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                    placeholder="Search.."
                    required
                  />
                  <button
                    type="button"
                    on:click={handleEnvModal}
                    class="absolute top-0 shadow-none end-0 p-2 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <i class="fa-solid fa-bars"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      {:else}
        <div class="flex items-center justify-between w-[113vw]">
          <div class="flex gap-2 items-center">
            <i class="fa-solid fa-plus text-sm" on:click={setActiveTabOverview}
            ></i>
            <details class="dropdown dropdown-left">
              <summary
                class="btn hover:bg-transparent py-0 px-1 bg-transparent border-0 shadow-none m-0"
                style="height:0rem!important;max-height:0rem!important;min-height:1rem!important"
              >
                <i class="fa-solid fa-ellipsis text-sm"></i>
              </summary>
              <ul
                class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
              >
                <li><a on:click={closeAllTabs}>Close All Tabs</a></li>
                <li><a>Close Selected Tab</a></li>
                <li><a>Close Other Tabs</a></li>
                <li>
                  <a on:click={() => activeTab === "Overview"}>Overview</a>
                </li>
              </ul>
            </details>
          </div>
          <form class="max-w-lg mx-auto">
            <div class="flex">
              <select
                id="environments"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-xs tracking-[0.06rem] rounded-s-lg rounded-e-none shadow-none focus:outline-none block w-full p-1.5"
              >
                <option selected>Choose Env</option>
                {#each filteredEnvironments as env}
                  <option value={env.name}>{env.name}</option>
                {/each}
              </select>
              <div class="relative w-full">
                <input
                  type="search"
                  id="search-dropdown"
                  bind:value={searchQuery}
                  class="block p-1.5 w-[7vw] z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                  placeholder="Search.."
                  required
                />
                <button
                  type="button"
                  on:click={handleEnvModal}
                  class="absolute top-0 shadow-none end-0 p-2 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <i class="fa-solid fa-bars"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      {/if}
    </div>
  {/if}
</div>
<!-- new environment tab modal -->
{#if envModal}
  <div
    class=" w-[85vw] h-[100vh] absolute shadow-xl z-50 bg-base-100 top-[0%] left-[8%]"
  >
    <div class="flex">
      <div class="w-[23vw] bg-gray-50 px-2 h-full py-4">
        <!-- global variable and params -->
        <label for="" class="text-xs text-gray-400 tracking-[0.06rem]"
          >Globals</label
        >
        <div class="my-3">
          <ul class="list-style-none">
            {#each globalEnvironment as global}
              <li
                class="p-2 hover:bg-gray-100 text-xs tracking-[0.05rem] cursor-pointer"
                on:click={() => handleGlobalClick(global)}
              >
                {global.name}
              </li>
            {/each}
          </ul>
        </div>
        <!-- environments -->
        <label for="" class="text-xs text-gray-400 tracking-[0.06rem]"
          >Environments</label
        >
        <div class="my-3">
          <ul class="list-style-none">
            {#each apiEnvironment as env}
              <li
                class="p-2 hover:bg-gray-100 text-xs tracking-[0.05rem] cursor-pointer"
                on:click={() => handleEnvironmentClick(env)}
              >
                {env.name}
              </li>
            {/each}
            <li
              on:click={addNewEnvironment}
              class="my-3 hover:bg-gray-100 p-2 text-xs tracking-[0.05rem] cursor-pointer"
            >
              <i class="fa-solid fa-plus text-gray-500"></i>&nbsp;New
              Environment
            </li>
          </ul>
        </div>
      </div>
      <div class="w-[80vw] bg-base-100">
        <div class="text-end">
          <i
            class="fa-solid fa-times text-sm px-2 text-gray-500 cursor-pointer"
            on:click={() => (envModal = false)}
          ></i>
        </div>
        <div class="px-2 pt-2 pb-2">
          {#if selectedGlobalName === "Global Variables"}
            <h2
              class="text-sm text-gray-400 tracking-[0.06rem]"
              style="font-weight:500"
            >
              Global Variables
            </h2>
            <div class="relative overflow-x-auto mt-2">
              <table
                class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <thead
                  class="text-xs text-gray-600 uppercase dark:text-gray-400"
                >
                  <tr>
                    <th
                      scope="col"
                      class="px-4 py-2 border border-gray-200 text-gray-600"
                    >
                      Variable
                    </th>
                    <th scope="col" class="px-4 py-2 border border-gray-200">
                      Initial Value</th
                    >
                    <th scope="col" class="px-4 py-2 border border-gray-200">
                      Current Value
                    </th>
                    <th scope="col" class="px-4 py-2 border border-gray-200">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="bg-white dark:bg-gray-800">
                    <td class=" border border-gray-200">
                      <input
                        type="text"
                        class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                      />
                    </td>
                    <td class=" border border-gray-200">
                      <input
                        type="text"
                        class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                      />
                    </td>
                    <td class=" border border-gray-200">
                      <input
                        type="text"
                        class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                      />
                    </td>
                    <td class=" border border-gray-200">
                      <input
                        type="text"
                        class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          {:else if selectedGlobalName === "Global Params"}
            <h2
              class="text-sm text-gray-400 tracking-[0.06rem]"
              style="font-weight:500"
            >
              Global Params
            </h2>

            <div role="tablist" class="tabs tabs-lifted mt-2">
              <!-- headers of env params tab -->
              <input
                type="radio"
                name="my_tabs_18"
                role="tab"
                aria-label="Headers"
                class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
              />
              <div
                role="tabpanel"
                class="tab-content bg-gray-100 border-base-300 rounded-box p-6"
              >
                <span class="text-gray-400" style="font-weight: 600;"
                  >Headers</span
                >
                <div class="relative overflow-x-auto mt-1">
                  <table
                    class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                  >
                    <thead
                      class="text-xs text-gray-900 uppercase dark:text-gray-400"
                    >
                      <tr>
                        <th
                          scope="col"
                          class="px-4 py-2 border border-gray-300 text-gray-600"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          class="px-4 py-2 border border-gray-300"
                        >
                          Type</th
                        >
                        <th
                          scope="col"
                          class="px-4 py-2 border border-gray-300"
                        >
                          Default Value
                        </th>
                        <th
                          scope="col"
                          class="px-4 py-2 border border-gray-300"
                        >
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="bg-white dark:bg-gray-800">
                        <td class=" border border-gray-300">
                          <input
                            type="text"
                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                            placeholder="Add a new param"
                          />
                        </td>
                        <td class=" border border-gray-300">
                          <input
                            type="text"
                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                          />
                        </td>
                        <td class=" border border-gray-300">
                          <input
                            type="text"
                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                          />
                        </td>
                        <td class=" border border-gray-300">
                          <input
                            type="text"
                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <!-- cookies of env params tab -->
              <input
                type="radio"
                name="my_tabs_18"
                role="tab"
                aria-label="Cookies"
                class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
              />
              <div
                role="tabpanel"
                class="tab-content bg-gray-100 border-base-300 rounded-box p-6"
              >
                <div class="relative overflow-x-auto mt-1">
                  <table
                    class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                  >
                    <thead
                      class="text-xs text-gray-900 uppercase dark:text-gray-400"
                    >
                      <tr>
                        <th
                          scope="col"
                          class="px-4 py-2 border border-gray-300 text-gray-600"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          class="px-4 py-2 border border-gray-300"
                        >
                          Type</th
                        >
                        <th
                          scope="col"
                          class="px-4 py-2 border border-gray-300"
                        >
                          Example
                        </th>
                        <th
                          scope="col"
                          class="px-4 py-2 border border-gray-300"
                        >
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="bg-white dark:bg-gray-800">
                        <td class=" border border-gray-300">
                          <input
                            type="text"
                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                            placeholder="Add a new param"
                          />
                        </td>
                        <td class=" border border-gray-300">
                          <input
                            type="text"
                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                          />
                        </td>
                        <td class=" border border-gray-300">
                          <input
                            type="text"
                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                          />
                        </td>
                        <td class=" border border-gray-300">
                          <input
                            type="text"
                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <!-- query of env params tab -->
              <input
                type="radio"
                name="my_tabs_18"
                role="tab"
                aria-label="Query"
                class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
              />
              <div
                role="tabpanel"
                class="tab-content bg-gray-100 border-base-300 rounded-box p-6"
              >
                <div class="relative overflow-x-auto mt-1">
                  <table
                    class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                  >
                    <thead
                      class="text-xs text-gray-900 uppercase dark:text-gray-400"
                    >
                      <tr>
                        <th
                          scope="col"
                          class="px-4 py-2 border border-gray-300 text-gray-600"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          class="px-4 py-2 border border-gray-300"
                        >
                          Type</th
                        >
                        <th
                          scope="col"
                          class="px-4 py-2 border border-gray-300"
                        >
                          Default Value
                        </th>
                        <th
                          scope="col"
                          class="px-4 py-2 border border-gray-300"
                        >
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="bg-white dark:bg-gray-800">
                        <td class=" border border-gray-300">
                          <input
                            type="text"
                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                            placeholder="Add a new param"
                          />
                        </td>
                        <td class=" border border-gray-300">
                          <input
                            type="text"
                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                          />
                        </td>
                        <td class=" border border-gray-300">
                          <input
                            type="text"
                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                          />
                        </td>
                        <td class=" border border-gray-300">
                          <input
                            type="text"
                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <!-- body of env params tab -->
              <input
                type="radio"
                name="my_tabs_18"
                role="tab"
                aria-label="Body"
                class="tab hover:text-violet-700 bg-base-100 checked:bg-gray-100 text-gray-500 font-medium checked:text-checked-violet checked:font-semibold"
              />
              <div
                role="tabpanel"
                class="tab-content bg-gray-100 border-base-300 rounded-box p-6"
              >
                <div class="relative overflow-x-auto mt-1">
                  <table
                    class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                  >
                    <thead
                      class="text-xs text-gray-900 uppercase dark:text-gray-400"
                    >
                      <tr>
                        <th
                          scope="col"
                          class="px-4 py-2 border border-gray-300 text-gray-600"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          class="px-4 py-2 border border-gray-300"
                        >
                          Type</th
                        >
                        <th
                          scope="col"
                          class="px-4 py-2 border border-gray-300"
                        >
                          Default Value
                        </th>
                        <th
                          scope="col"
                          class="px-4 py-2 border border-gray-300"
                        >
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="bg-white dark:bg-gray-800">
                        <td class=" border border-gray-300">
                          <input
                            type="text"
                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                            placeholder="Add a new param"
                          />
                        </td>
                        <td class=" border border-gray-300">
                          <input
                            type="text"
                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                          />
                        </td>
                        <td class=" border border-gray-300">
                          <input
                            type="text"
                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                          />
                        </td>
                        <td class=" border border-gray-300">
                          <input
                            type="text"
                            class="px-1 py-2 border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          {:else if selectedEnvironmentType === "Environment"}
            <h2
              class="text-sm text-gray-400 tracking-[0.06rem]"
              style="font-weight:500"
            >
              {selectedEnvironment.name}
            </h2>
            <div class="mt-3">
              <h2
                class="text-xs text-gray-500 tracking-[0.06rem]"
                style="font-weight:500"
              >
                Services(Base URL)
              </h2>
              <div class="relative overflow-x-auto mt-2">
                <table
                  class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                >
                  <thead
                    class="text-xs text-gray-600 uppercase dark:text-gray-400"
                  >
                    <tr>
                      <th
                        scope="col"
                        class="px-4 py-2 border border-gray-200 text-gray-600"
                      >
                        Service Name
                      </th>
                      <th scope="col" class="px-4 py-2 border border-gray-200">
                        Base URL</th
                      >
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="bg-white dark:bg-gray-800">
                      <td class=" border border-gray-200">
                        <input
                          type="text"
                          class="px-4 py-2 w-full border-gray-100 text-sm text-gray-600 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                          bind:value={selectedEnvironment.serviceName}
                        />
                      </td>
                      <td class=" border border-gray-200">
                        <input
                          type="text"
                          class="px-4 py-2 w-full border-gray-100 text-sm text-gray-600 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                          bind:value={selectedEnvironment.baseUrl}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button
                class="border-0 my-3 bg-trasnparent cursor-pointer shadow-none focus:outline-none text-gray-500"
                ><i class="fa-solid fa-plus"></i>&nbsp;Add Service</button
              >
              <div class="mt-3">
                <h2
                  class="text-sm text-gray-400 tracking-[0.06rem]"
                  style="font-weight:500"
                >
                  Variables
                </h2>
                <div class="relative overflow-x-auto mt-2">
                  <table
                    class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                  >
                    <thead
                      class="text-xs text-gray-600 uppercase dark:text-gray-400"
                    >
                      <tr>
                        <th
                          scope="col"
                          class="px-4 py-2 border border-gray-200 text-gray-600"
                        >
                          Variable
                        </th>
                        <th
                          scope="col"
                          class="px-4 py-2 border border-gray-200"
                        >
                          Initial Value</th
                        >
                        <th
                          scope="col"
                          class="px-4 py-2 border border-gray-200"
                        >
                          Current Value
                        </th>
                        <th
                          scope="col"
                          class="px-4 py-2 border border-gray-200"
                        >
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {#each selectedEnvironment.variables as variable}
                        <tr class="bg-white dark:bg-gray-800">
                          <td class=" border border-gray-200">
                            <input
                              type="text"
                              bind:value={variable.variable}
                              class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                            />
                          </td>
                          <td class=" border border-gray-200">
                            <input
                              type="text"
                              bind:value={variable.initialValue}
                              class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                            />
                          </td>
                          <td class=" border border-gray-200">
                            <input
                              type="text"
                              bind:value={variable.currentValue}
                              class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                            />
                          </td>
                          <td class=" border border-gray-200">
                            <input
                              type="text"
                              bind:value={variable.description}
                              class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                            />
                          </td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          {:else if selectedEnvironmentType === "New Environment"}
            <div class="mt-3 w-full">
              <input
                type="text"
                style="font-weight: 520;"
                class="py-1.5 rounded-md text-sm px-2 w-full border-1 border-gray-100 focus:border-violet-300 tracking-[0.06rem] placeholder:text-gray-400"
                placeholder="Environment Name"
                bind:value={selectedEnvironment.name}
              />
            </div>
            <div class="mt-3">
              <h2
                class="text-xs text-gray-500 tracking-[0.06rem]"
                style="font-weight:500"
              >
                Services(Base URL)
              </h2>
              <div class="relative overflow-x-auto mt-2">
                <table
                  class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                >
                  <thead
                    class="text-xs text-gray-600 uppercase dark:text-gray-400"
                  >
                    <tr>
                      <th
                        scope="col"
                        class="px-4 py-2 border border-gray-200 text-gray-600"
                      >
                        Service Name
                      </th>
                      <th scope="col" class="px-4 py-2 border border-gray-200">
                        Base URL</th
                      >
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="bg-white dark:bg-gray-800">
                      <td class=" border border-gray-200">
                        <input
                          type="text"
                          class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                        />
                      </td>
                      <td class=" border border-gray-200">
                        <input
                          type="text"
                          class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button
                class="border-0 my-3 bg-trasnparent cursor-pointer shadow-none focus:outline-none text-gray-500"
                ><i class="fa-solid fa-plus"></i>&nbsp;Add Service</button
              >
              <div class="mt-3">
                <h2
                  class="text-sm text-gray-400 tracking-[0.06rem]"
                  style="font-weight:500"
                >
                  Variables
                </h2>
                <div class="relative overflow-x-auto mt-2">
                  <table
                    class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                  >
                    <thead
                      class="text-xs text-gray-600 uppercase dark:text-gray-400"
                    >
                      <tr>
                        <th
                          scope="col"
                          class="px-4 py-2 border border-gray-200 text-gray-600"
                        >
                          Variable
                        </th>
                        <th
                          scope="col"
                          class="px-4 py-2 border border-gray-200"
                        >
                          Initial Value</th
                        >
                        <th
                          scope="col"
                          class="px-4 py-2 border border-gray-200"
                        >
                          Current Value
                        </th>
                        <th
                          scope="col"
                          class="px-4 py-2 border border-gray-200"
                        >
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="bg-white dark:bg-gray-800">
                        <td class=" border border-gray-200">
                          <input
                            type="text"
                            class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                          />
                        </td>
                        <td class=" border border-gray-200">
                          <input
                            type="text"
                            class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                          />
                        </td>
                        <td class=" border border-gray-200">
                          <input
                            type="text"
                            class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                          />
                        </td>
                        <td class=" border border-gray-200">
                          <input
                            type="text"
                            class="px-1 py-2 w-full border-gray-100 focus:border-blue-600 placeholder:text-gray-400 placeholder:text-sm"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  input[name="my_tabs_13"] {
    width: 7vw !important;
    padding: 0.2rem 0.3rem !important;
  }

  .active {
    background-color: blue !important;
    color: white !important;
  }
  .hoveredContent {
    display: none;
  }

  /* Show the dropdown menu when hovering over the list item */
  .listhover:hover .hoveredContent {
    display: block;
  }
</style>

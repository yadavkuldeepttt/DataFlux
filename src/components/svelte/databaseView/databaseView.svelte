<script>
  import { onMount } from "svelte";
  import { connections } from "../../../apiData/databases";
  import Ajv from "ajv";
  import JSONTree from "svelte-json-tree";
  import TableDoc from "./tableDoc.svelte";

  export let activeSideMenuList;
  let openCollectionSubMenu = {};

  let openTabGroup = {};
  let showTabInGroups = {};
  let activeTab = "tab-1"; // Initial active tab
  let nextTabId = 2; // Variable to keep track of the next tab id
  let tabs = [
    {
      id: "tab-1",
      name: "Home",
      documents: [],
      databaseName: "",
      connectionName: "",
    },
  ]; // Initial tabs
  let groupToAdd = "";
  // Array to store tab groups
  let tabGroups = [];
  let draggedTab = null;
  let connectionType = "MongoString"; // Default connection type
  let uri = "";
  let isEditable = false;
  let nameString = "";
  let connectionsList = [];

  function openCollectionBox(id) {
    openCollectionSubMenu[id] = !openCollectionSubMenu[id];
  }
  function openTabGroupBox(id) {
    openTabGroup[id] = !openTabGroup[id];
  }

  function showTabInGroupsBox(id) {
    showTabInGroups[id] = !showTabInGroups[id];
  }

  // Function to open a collection in a new tab
  function openCollectionTab(collection, connection, database) {
    const tabId = `tab-${nextTabId++}`;
    tabs = [
      ...tabs,
      {
        id: tabId,
        name: collection.objDetails.name,
        documents: collection.docs,
        databaseName: database.objDetails.name,
        connectionName: connection.objDetails.name,
      },
    ];
    // Set the newly added tab as active
    activeTab = tabId;
    console.log(tabs);
  }

  // Function to set active tab
  function setActiveTab(tabId) {
    activeTab = tabId;
    console.log(activeTab,"active tab");
  }

  // Function to close a tab
  function closeTab(tabId) {
    tabs = tabs.filter((tab) => tab.id !== tabId);
    // If the closed tab was active, set the first tab as active
    if (activeTab === tabId && tabs.length > 0) {
      activeTab = tabs[0].id;
    }
  }

  // Lifecycle hook to scroll to the active tab on component mount
  // onMount(() => {
  //   const activeTabElement = document.getElementById(activeTab);
  //   activeTabElement.scrollIntoView();
  // });

  // Function to add a tab to a tab group
  function addToTabGroup(tab, groupName) {
    const existingGroup = tabGroups.find((group) => group.name === groupName);
    const tabId = `tab-${nextTabId++}`;
    console.log(tabId, "tabId");
    if (existingGroup) {
      existingGroup.tabs.push(tab);
    } else {
      const newGroup = {
        id: `tab-${nextTabId++}`,
        name: groupName,
        tabs: [
          {
            id: tab.id || tabId,
            name: tab.name,
            documents: tab.documents,
          },
        ],
      };
      console.log(newGroup, "newGroup");
      tabGroups.push(newGroup);
    }
    // Remove the tab from the tabs array
    tabs = tabs.filter((t) => t.id !== tab.id);
    console.log(tabs, "tabs");

    tabGroups = [...tabGroups];
    tabs = [...tabs];
    console.log(tabGroups, "tabGroups");
    console.log(tabs, "tabs");

    groupToAdd = "";
  }
  function handleDragStart(event, tab) {
    event.dataTransfer.setData("text/plain", tab.id);
  }

  // Event handler for drag over in the first list
  function handleDragOver(event) {
    event.preventDefault();
  }

  // Event handler for drop in the tabGroups list
  function handleDropInTabGroups(event, group) {
    event.preventDefault();
    const tabId = event.dataTransfer.getData("text/plain");
    const tab = tabs.find((t) => t.id === tabId);

    // If the tab exists and the group is valid
    if (tab && group) {
      // Remove the tab from the tabs list
      tabs = tabs.filter((t) => t.id !== tabId);

      // Add the tab to the specified group
      group.tabs.push(tab);

      // Update tabGroups
      tabGroups = [...tabGroups];
      console.log(tabGroups);
    }
  }
  function handleDropInTab(event) {
    event.preventDefault();
  }
  // Function to add a new tab
  function addNewTab() {
    const tabId = `tab-${nextTabId++}`;
    const newTab = { id: tabId, name: "New Tab", documents: [] };
    tabs = [...tabs, newTab];
    activeTab = tabId;
  }

  function closeTabGroup(tabId) {
    tabGroups.forEach((group) => {
      // Find the index of the tab with the given ID in the current group
      const tabIndex = group.tabs.findIndex((tab) => tab.id === tabId);
      if (tabIndex !== -1) {
        // Remove the tab from the tabs array of the current group
        group.tabs.splice(tabIndex, 1);
      }
    });
    tabGroups = [...tabGroups];
  }
  // close group
  function closeGroup(groupId) {
    const confirmed = confirm("Are you sure you want to close the group?");
    if (confirmed) {
      tabGroups = tabGroups.filter((group) => group.id !== groupId);
    }
  }

  // Function to update URI based on connection type
  function updateURI() {
    if (connectionType === "MongoString") {
      uri =
        "mongodb://yadavkuldeep3434:abcd@cluster0.jnjc8w0.mongodb.net:27017/ac";
    } else if (connectionType === "Network") {
      uri = "mongodb://localhost:27017/";
    } else {
      uri = "";
    }
  }
  updateURI();

  // Function to handle checkbox change
  function handleCheckboxChange(event) {
    isEditable = event.target.checked;
    const textarea = document.getElementById("textarea");
    if (isEditable) {
      const confirmed = confirm(
        "Are you sure you want to edit your connection string?"
      );
      if (confirmed) {
        textarea.style.opacity = 1;
      }
    } else {
      textarea.style.opacity = 0.7;
    }
  }

  onMount(() => {
    const switchCheckbox = document.getElementById("flexSwitchCheckChecked");
    switchCheckbox.addEventListener("change", handleCheckboxChange);

    return () => {
      switchCheckbox.removeEventListener("change", handleCheckboxChange);
    };
  });
  onMount(() => {
    updateDropdown();
  });
  function handleNameString(event) {
    nameString = event.target.value;
  }
  function updateDropdown() {
    const dropdownMenu = document.getElementById("nameDropdown");
    if (dropdownMenu) {
      const names = nameString
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean);

      // Populate the dropdown menu with the names
      names.forEach((name) => {
        const dropdownItem = document.createElement("a");
        dropdownItem.classList.add("dropdown-item");
        dropdownItem.href = "#";
        dropdownItem.textContent = name;
        dropdownMenu.appendChild(dropdownItem);
      });
    }
  }
  function handleDelete() {
    connectionType = "None";
    uri = "";
  }
  function handleConnect() {
    const confirmed = confirm("Are you sure you want to connect?");
    if (confirmed) {
      updateDropdown();
      alert("Connected to " + uri);
      // window.location.href = "/";
      const connectionId = Math.floor(Math.random() * 1000000); // Generate a random connection ID
      connectionsList.push({
        id: connectionId, // Add the generated connection ID
        name: nameString,
        uri,
      });
      connectionsList = [...connectionsList];
    }
    const savedState = JSON.parse(localStorage.getItem(uri));
    console.log(savedState);
    if (savedState) {
      // Restore tab groups and tabs from the saved state
      tabGroups = savedState.tabGroups;
      tabs = savedState.tabs;
      // This will trigger re-rendering with the restored tab groups and tabs
      tabGroups = [...tabGroups];
      tabs = [...tabs];
    }
  }
  function handleDisconnect() {
    // Retrieve the current URI being disconnected
    const disconnectedUri = uri; // Assuming uri is accessible

    // Save the state of tab groups and tabs associated with the disconnected URI
    const disconnectedState = {
      tabGroups: tabGroups,
      tabs: tabs,
    };

    // Save the disconnected state to localStorage or sessionStorage
    localStorage.setItem(disconnectedUri, JSON.stringify(disconnectedState));

    // Remove the existing connection associated with the disconnected URI
    connectionsList = connectionsList.filter(
      (connection) => connection.uri !== disconnectedUri
    );
    connectionsList = [...connectionsList];
    tabGroups = [];
    tabs = [];
  }

  // filter documents
  let query = "";
  let project = "";
  let sort = "";
  let maxTimeMS = "";
  let collation = "";
  let skip = "";
  let limit = "";

  let filteredCollection = []; // Initialize filteredCollection with a copy of tab.documents
  let showoptions = false; //show options for filtering
  onMount(() => {
    findQuery(activeTab);
  });
  function findQuery(tab) {
    if (tab.id === activeTab) {
      // Split the query into field and value
      const [field, value] = query.split(":").map((part) => part.trim());

      // Apply skip and limit to the filtered collection
      let filteredData = tab.documents;

      // Filter documents based on the query
      filteredCollection = filteredData.filter((document) => {
        // Check if the field exists in the document and if its value matches the query
        if (
          document[field] &&
          document[field].toString().toLowerCase().includes(value.toLowerCase())
        ) {
          return true; // If a match is found, return true
        }
        return false; // If no match is found, return false
      });

      console.log(filteredCollection);

      // Skip documents based on the skip value
      if (skip) {
        filteredCollection = filteredData.slice(parseInt(skip));
      }

      // Apply limit to the filtered collection
      if (limit) {
        filteredCollection = filteredData.slice(0, parseInt(limit));
      }

      // Apply sorting to the filtered collection based on the sort field
      if (sort) {
        // Extract the sort field and order
        const [sortField, sortOrder] = sort
          .split(":")
          .map((part) => part.trim());
        // Sort the filteredData based on the sortField and sortOrder
        filteredCollection = filteredData.sort((a, b) => {
          const aValue = a[sortField];
          const bValue = b[sortField];
          if (sortOrder === "1") {
            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
          } else {
            return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
          }
        });
      }

      // Apply projection to the filtered collection based on the project field
      if (project) {
        const projectionFields = project
          .split(",")
          .map((field) => field.trim());

        // Iterate through each document in filteredData
        filteredCollection = filteredData.map((document) => {
          const projectedDocument = {};

          // Iterate through each field in the document
          for (const key in document) {
            // Check if the field should be included or excluded based on project field value
            const shouldInclude = projectionFields.some((projection) => {
              // Split the projection to check for field and value
              const [fieldName, value] = projection
                .split(":")
                .map((part) => part.trim());
              if (value === "0") {
                // Exclude field if value is 0
                return key !== fieldName;
              } else if (value === "1") {
                // Include field if value is 1
                return key === fieldName;
              }
            });

            // If shouldInclude is true, add the field to the projected document
            if (shouldInclude) {
              // Add the document ID to the projected document
              projectedDocument.id = document.id;
              projectedDocument[key] = document[key];
            }
          }
          return projectedDocument;
        });
      }

      filteredCollection = [...filteredCollection];
      console.log("====================================");
      console.log(filteredCollection);
      console.log("====================================");
    } else {
      filteredCollection = []; // Reset filteredCollection if tab is not active
    }
  }
  function resetData() {
    filteredCollection = [];
  }

  function showOptions() {
    showoptions = !showoptions;
  }

  // show stage box
  let showstagebox = false;

  function showAddStageBox() {
    showstagebox = true;
  }
  function showMoreStages() {
    showstagebox = true;
  }

  // aggregation stage
  let newField = "";

  // Function to handle the Enter key press
  function handleKeyPress(event, tab) {
    if (event.key === "Enter") {
      updateDocuments(tab);
    }
  }
  let updatedStageData = [];
  let runstage = false;

  // Function to update documents
  function updateDocuments(tab) {
    if (newField) {
      // Split the newField string by ","
      const fieldValues = newField.split(",");

      // Iterate through each field-value pair
      fieldValues.forEach((pair) => {
        // Split each pair by ":" to get field and value
        const [field, value] = pair.split(":").map((part) => part.trim());

        // Iterate through each document in the collection
        tab.documents.forEach((document) => {
          // Check if the field already exists in the document
          if (document[field] !== undefined) {
            // If it exists, update its value
            document[field] = value;
          } else {
            // If it doesn't exist, add the field with the specified value
            document[field] = value;
          }
        });
      });

      updatedStageData = tab.documents;

      console.log(tab.documents);
      console.log("====================================");
      console.log(updatedStageData);
      console.log("====================================");
    }
  }
  // run stage
  function runStages() {
    runstage = true;
  }

  // Define variables and functions for pagination
  let currentPage = 1; // Current page number

  const pageSize = 5; // Number of documents per page
  // Define setCurrentPage function to update the current page
  function setCurrentPage(page) {
    currentPage = page;
  }
  let documents = [];
  let documentsGroup=[];
  let paginatedDocuments = [];
  let arrayDocuments = [];
  let paginatedDocumentsGroup=[];
  let arrayDocumentsGroup=[];
  // Function to calculate the paginated documents for the current page
  $: {
    tabs.forEach((tab) => {
      if (tab.id === activeTab) {
        documents = tab.documents;
      }
    });
    tabGroups.forEach((group) => {
      group.tabs.forEach((tab)=>{

        if (tab.id === activeTab) {
          documentsGroup = tab.documents;
        }
      });
    });

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    paginatedDocuments = documents.slice(startIndex, endIndex);
    arrayDocuments = documents.slice(startIndex, endIndex);

    paginatedDocumentsGroup = documentsGroup.slice(startIndex, endIndex);
    arrayDocumentsGroup = documentsGroup.slice(startIndex, endIndex);

    console.log(paginatedDocumentsGroup,"paginated group");
  }

  // handle view
  let currentView = "listView"; // Initialize current view
  let isEditing = {};
  let showState = false;

  // Function to handle view change
  function handleView(view) {
    currentView = view; // Update current view based on the clicked button
  }
  // edit delete copy table document
  function handleDeleteTableDocument(document) {
    arrayDocuments = arrayDocuments.filter(
      (doc) => doc !== document.detail.item
    );
    // Update the state variable to reflect the changes in the UI
    arrayDocuments = [...arrayDocuments];
  }

  function handleDeleteDocument(document) {
    paginatedDocuments = paginatedDocuments.filter((doc) => doc !== document);
    // Update the state variable to reflect the changes in the UI
    paginatedDocuments = [...paginatedDocuments];
  }

  function handleCopyTableDocument(document) {
    const copy = { ...document };
    paginatedDocuments = [...paginatedDocuments, copy];
  }
  function handleEditTableDocument(document) {
    isEditing[document.id] = true;
  }
  function handleCopyJsonDocument(document) {
    const copy = { ...document };
    paginatedDocuments = [...paginatedDocuments, copy];
  }
  function handleEditJsonDocument(document) {
    isEditing[document.id] = true;
  }

  function handleDocumentChange(document, value) {
    document = value;
  }
  //update document
  function handleUpdateDocument(document) {
    // Exit editing mode
    isEditing[document.id] = false;
  }

  // show array
  let arrayVisibility = {};
  function toggleArrayVisibility(documentId, key) {
    arrayVisibility[documentId + key] = !arrayVisibility[documentId + key];
  }
  function handleArrayData(event) {
    arrayDocuments = event.detail.arrayData; // Update the paginatedDocuments with the new array data}
    showState = true;
  }

  // schema section
  let schema = {}; // Initialize an empty schema object
  let analyzeArrayDetails = {};

  function analyzeDocuments(tab) {
    schema = generateSchema(tab.documents);
    console.log(schema); // Log the generated schema to the console
  }

  // Function to generate schema from the documents
  function generateSchema(documents) {
    let generatedSchema = {};

    documents.forEach((doc) => {
      analyzeFields(doc, generatedSchema);
    });

    return generatedSchema;
  }

  // Function to recursively analyze fields
  function analyzeFields(doc, generatedSchema) {
    Object.keys(doc).forEach((key) => {
      if (!generatedSchema[key]) {
        // If the field doesn't exist in the schema, initialize it
        generatedSchema[key] = {
          types: new Set(),
          sampleValues: new Map(),
          fields: {},
        };
      }

      if (Array.isArray(doc[key])) {
        // Analyze arrays recursively
        doc[key].forEach((item) => {
          if (item instanceof Object) {
            analyzeFields(item, generatedSchema[key].fields);
          }
        });
      } else if (doc[key] instanceof Object) {
        // Analyze objects recursively
        analyzeFields(doc[key], generatedSchema[key].fields);
      }

      // Analyze array fields
      if (Array.isArray(doc[key])) {
        generatedSchema[key].types.add("array");
      }
      // Analyze other fields
      else {
        const sampleValue = doc[key];
        if (!generatedSchema[key].sampleValues.has(sampleValue)) {
          if (generatedSchema[key].sampleValues.size < 2) {
            generatedSchema[key].sampleValues.set(sampleValue, 1);
          }
        } else {
          const count = generatedSchema[key].sampleValues.get(sampleValue);
          generatedSchema[key].sampleValues.set(sampleValue, count + 1);
        }

        // Determine the type of the value and add it to types
        const valueType = getType(doc[key]);
        generatedSchema[key].types.add(valueType);
      }
    });
  }

  // Function to determine the type of a field
  function getType(value) {
    if (Array.isArray(value)) {
      return "array";
    } else if (value instanceof Object) {
      return "object";
    } else if (typeof value === "string") {
      return "string";
    } else if (typeof value === "number") {
      return "number";
    } else if (typeof value === "boolean") {
      return "boolean";
    } else {
      return "null";
    }
  }

  function showAnalyzeArrayDetails(fieldName) {
    console.log(fieldName, "fieldName");
    analyzeArrayDetails[fieldName] = !analyzeArrayDetails[fieldName];
  }

  // Function to change the data type of a sample value
  function changeDataType(fieldName, oldValue, newValue) {
    // Update the data type of the field in the schema
    schema[fieldName].types = new Set([newValue]);

    // Convert sample values to the new data type
    const sampleValues = Array.from(schema[fieldName].sampleValues.keys());
    const newSampleValues = sampleValues.map((value) => {
      switch (newValue) {
        case "string":
          return String(value);
        case "number":
          return Number(value);
        case "boolean":
          return value.toLowerCase() === "true";
        case "array":
          return [value];
        case "null":
          return null;
        default:
          return value;
      }
    });

    // Update the sample values in the schema
    schema[fieldName].sampleValues.clear();
    newSampleValues.forEach((value) => {
      schema[fieldName].sampleValues.set(value, 1);
    });

    console.log(`Changed data type of ${fieldName} to ${newValue}`);
  }

  // indexes section
  let createIndex = false;
  function handleCreateIndex() {
    createIndex = true;
  }

  let indexes = [];
  let rows = [{ newIndexName: "id", newIndexType: "1" }];

  function addIndexRow(index) {
    rows = [...rows, { newIndexName: "", newIndexType: "1" }];
  }
  function removeIndexRow(index) {
    rows.splice(index, 1);
    rows = [...rows];
  }
  function createIndexFunction() {
    let names = rows.map((row) => row.newIndexName);
    let types = rows.map((row) => row.newIndexType);

    // Combine names and types into an array of objects
    let indexData = names.map((name, index) => ({
      name: name,
      type: types[index],
    }));

    // Sort the indexData array based on the newIndexType
    indexData.sort((a, b) => a.type.localeCompare(b.type));

    // Extract sorted names from sorted indexData
    let sortedNames = indexData.map((index) => index.name);

    // Check for duplicate names
    let duplicateNames = sortedNames.filter(
      (name, index) => sortedNames.indexOf(name) !== index
    );

    if (duplicateNames.length > 0) {
      // Alert user about duplicate names
      alert("Index names should not be the same. Please provide unique names.");
      return; // Exit the function to prevent further execution
    }
    // Push the sorted names into the indexes array
    indexes.push({
      name: sortedNames,
      type: "Regular",
      size: "6.9 KB", // Add size property if needed
      usage: "Usage data unavailable", // Add usage property if needed
      properties: "Unique", // Add properties property if needed
    });

    // Sort the indexes array based on the newIndexType
    indexes.sort((a, b) => a.type.localeCompare(b.type));

    // Clear new index fields
    indexes = [...indexes];
    createIndex = false;

    console.log(indexes);
  }

  function removeIndex(indexKey) {
    indexes.splice(indexKey, 1);
    indexes = [...indexes];
  }
  // rule validation

  let showRule = false;
  function handleShowRule() {
    showRule = true;
  }
  let validationRules = "";
  let validationAction = "Warning";
  let validationLevel = "Off";
  let passedDocuments = [];
  let failedDocuments = [];

  function updateValidation(documents) {
    try {
      // Convert validation rules to JSON object
      const rules = JSON.parse(validationRules);

      // Check if the rules match the specified JSON schema format
      const isValidSchema = validateSchema(rules);

      // If the rules don't match the schema format, show warning or error based on validation action
      if (!isValidSchema) {
        if (validationAction === "Warning") {
          console.warn("Validation Rules do not match the expected schema.");
        } else if (validationAction === "Error") {
          throw new Error("Validation Rules do not match the expected schema.");
        }
        return;
      }

      // Reset passed and failed documents arrays
      passedDocuments = [];
      failedDocuments = [];

      // Perform validation on each document
      documents.forEach((document) => {
        const validationResult = validateDocument(document, rules);

        // Determine action based on validation action
        if (
          (validationAction === "Warning" && !validationResult.passed) ||
          (validationAction === "Error" && !validationResult.passed)
        ) {
          // If action is "Warning" and document passes, or "Error" and document doesn't pass, add to failed documents
          failedDocuments.push({ document, errors: validationResult.errors });
        } else {
          // Otherwise, add to passed documents
          passedDocuments.push(document);
        }
      });

      // Display validation results
      console.log("Passed Documents:", passedDocuments);
      console.log("Failed Documents:", failedDocuments);
    } catch (error) {
      console.error("Validation Error:", error);
    }
  }

  function validateDocument(document, rules) {
    // Implement your document validation logic here
    // You can use a library like ajv for JSON schema validation

    // Example: Check if the document matches the JSON schema if validation is applied
    const ajv = new Ajv(); // Assuming Ajv library is imported
    const validate = ajv.compile(rules);
    const isValid = validate(document);

    return { passed: isValid, errors: validate.errors };
  }

  function validateSchema(rules) {
    // Validate the rules against the specified JSON schema format
    // You can implement your own logic here to check if the rules match the expected schema
    // For simplicity, let's check if the rules contain 'type', 'properties', and 'required' keys
    return (
      typeof rules === "object" &&
      rules.hasOwnProperty("type") &&
      rules.hasOwnProperty("properties") &&
      rules.hasOwnProperty("required")
    );
  }

  // filte databases and collections
  let searchText = "";
  let filteredConnections = [];

  function filterItems(connectionId) {
    // Find the connection object with the given ID
    const connection = connections.find((conn) => conn.jo === connectionId);

    // Convert searchText to lowercase for case-insensitive search
    const query = searchText.toLowerCase().trim();

    // Filter databases based on search text for the selected connection
    filteredConnections = connection.databases.filter((database) => {
      // Filter collections based on search text for each database
      database.collections = database.collections.filter((collection) => {
        return collection.objDetails.name.toLowerCase().includes(query);
      });

      // Return true if the database contains any matching collections
      return database.objDetails.name.toLowerCase().includes(query);
    });

    // Update UI if necessary (if connections is reactive, this may not be needed)
    console.log(filteredConnections);
  }

  let newDatabasePopup = {};
  let newCollectionPopup = {};
  let databaseValue = "";
  let collectionValue1 = "";
  let collectionValue2 = "";
  let mainContentToggle = true;  //hide main content  tabs when drawer open 
  let databaseMenuCol = false;  //close database menu 
  

  function addNewDatabase(connectionId) {
    console.log(connectionId);
    newDatabasePopup[connectionId] = true;
  }
  function addNewCollection(connectionId, databaseId) {
    let key = connectionId + "_" + databaseId;
    newCollectionPopup[key] = true;
  }

  function handleCreateDatabase(connection, connectionJo) {
    const connectionToUpdate = connections.find(
      (conn) => conn.jo === connectionJo
    );

    if (!connectionToUpdate) {
      console.error(`Connection with jo '${connectionJo}' not found.`);
      return;
    }

    const nextDatabaseJo =
      Math.max(...connectionToUpdate.databases.map((db) => parseInt(db.jo))) +
      1;
    const newDatabase = {
      jo: nextDatabaseJo.toString(),
      objDetails: {
        name: databaseValue,
        totalDocs: 0,
      },
      collections: [
        {
          jo: "1",
          objDetails: {
            name: collectionValue1,
            totalDocs: 0,
          },
          docs: [],
        },
      ],
    };

    connectionToUpdate.databases.push(newDatabase);
    connectionToUpdate.databases = [...connectionToUpdate.databases];
    newDatabasePopup[connectionJo] = false;
    console.log(connectionToUpdate);
  }

  // Function to handle creating a new collection and adding it to the database
  function handleCreateCollection(database, connectionId, databaseId) {
    // Find the connection using its identification (jo)
    const connectionToUpdate = connections.find(
      (conn) => conn.jo === connectionJo
    );

    // Find the database within the connection
    const databaseToUpdate = connectionToUpdate.databases.find(
      (db) => db.jo === database.jo
    );
    console.log(databaseToUpdate);

    // Determine the next collection number
    const nextCollectionJo =
      Math.max(...databaseToUpdate.collections.map((col) => parseInt(col.jo))) +
      1;

    // Create the new collection object
    const newCollection = {
      jo: nextCollectionJo.toString(),
      objDetails: {
        name: collectionValue2, // Use the collection name provided
        totalDocs: 0,
      },
      docs: [], // Initialize docs array
    };

    // Add the new collection to the database
    databaseToUpdate.collections.push(newCollection);
    console.log(databaseToUpdate);

    // Close the new collection popup
    newCollectionPopup[connectionId + "_" + databaseId] = false;
  }
</script>

<div class="container-fluid">
  <div class="flex gap-0">
    {#if databaseMenuCol}
      <div
        class=" databaseMenuCol max-w-[30vw] {activeSideMenuList
          ? 'md:w-[22vw]'
          : 'md:w-[24vw]'}  "
        style="background-color:#f4f5f7;height:100vh;overflow:auto
"
      >
        <div
          class="new-connection d-flex justify-content-between items-center p-2"
          style="background-color: green;"
        >
          {#if connectionsList.length > 0}
            {#each connectionsList as connection}
              <div
                class="d-flex justify-content-between gap-4 align-items-center text-white"
              >
                <span style="font-size: 15px;font-weight:600"
                  >{connection.name}</span
                >

                <div class="dropdown">
                  <a
                    class="py-0 m-0 px-0 text-white"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i class="fa-solid fa-ellipsis" style="font-size: 13px;"
                    ></i>
                  </a>

                  <ul class="dropdown-menu">
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        on:click={handleDisconnect}>Disconnect</a
                      >
                    </li>
                    <li>
                      <a class="dropdown-item" href="#">Another action</a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#">Something else here</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <i
                  class="fa-solid fa-times text-white cursor-pointer"
                  on:click={() => (databaseMenuCol = false)}
                ></i>
              </div>
            {/each}
          {:else}
            <a href="#my_modal_11">
              <button class="btn btn-light btn-sm py-1" style="font-size: 11px;"
                >New Connection <i class="fa-solid fa-plus"></i></button
              >
            </a>
            <div>
              <i
                class="fa-solid fa-times text-white cursor-pointer"
                on:click={() => (databaseMenuCol = false)}
              ></i>
            </div>
          {/if}
        </div>

        <div class="connections">
          <div class="accordion" id="accordionExample">
            <div class="accordion-item">
              <h2
                class="accordion-header"
                id="headingOne"
                style="font-size:14px"
              >
                <button
                  class="accordion-button px-0 ps-1 py-2 fs-7"
                  style="font-size:14px"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  <i class="fa-solid fa-house-signal"></i>&nbsp; Connections
                </button>
              </h2>
              <div
                id="collapseOne"
                class="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div
                  class="accordion-body px-2 overflow-auto"
                  style="background-color:#f4f5f7"
                >
                  {#each connections as connection}
                    <li
                      style="font-size: 13px;"
                      class="d-flex gap-2 align-items-center justify-content-between hoverlist p-1"
                    >
                      <div class="d-flex gap-2 align-items-center">
                        <i class="fa-solid fa-desktop" style="font-size: 11px;"
                        ></i>
                        <span>
                          {connection.objDetails.name}
                        </span>
                      </div>

                      <div class="dropdown">
                        <button
                          class=" btn-white text-dark p-0 m-0"
                          type="button"
                          id="dropdownMenuButton"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <i
                            class="fa-solid fa-ellipsis"
                            style="font-size: 11px;"
                          ></i>
                        </button>
                        <div
                          class="dropdown-menu absolute"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <a
                            class="dropdown-item"
                            style="font-size:13px"
                            href="#"
                          >
                            <i class="fa-solid fa-arrow-up-right-from-square"
                            ></i>
                            &nbsp;&nbsp; Copy connection String</a
                          >
                          <a
                            class="dropdown-item"
                            style="font-size:13px"
                            href="#"
                            ><i class="fa-solid fa-trash"></i>&nbsp;&nbsp;
                            Remove
                          </a>
                        </div>
                      </div>
                    </li>
                  {/each}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="accordion mt-3" id="accordionExample">
          {#each connections as connection}
            <div class="accordion-item">
              <h2
                class="accordion-header"
                id="heading-{connection.jo}"
                style="font-size:14px"
              >
                <button
                  class="accordion-button px-0 ps-1 py-2 fs-7"
                  style="font-size:13px"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapse-{connection.jo}"
                  aria-expanded="true"
                  aria-controls="collapse-{connection.jo}"
                >
                  {connection.objDetails.name}
                </button>
              </h2>
              <div
                id="collapse-{connection.jo}"
                class="accordion-collapse collapse show"
                aria-labelledby="heading-{connection.jo}"
                data-bs-parent="#accordionExample"
              >
                <div
                  class="accordion-body px-2"
                  style="background-color:#f4f5f7"
                >
                  <div class="databases px-2 py-3">
                    <div
                      class="d-flex justify-content-between align-items-center"
                      style="font-size: 14px;"
                    >
                      <div class="d-flex gap-2 align-items-center">
                        <i class="fa-solid fa-database" style="font-size: 12px;"
                        ></i>
                        <span>Databases</span>
                      </div>
                      <div>
                        <a
                          href="#my_modal_8"
                          on:click={() => addNewDatabase(connection.jo)}
                        >
                          <i style="cursor:pointer" class="fa-solid fa-plus"
                          ></i>
                        </a>
                      </div>
                    </div>

                    <div>
                      <input
                        type="search"
                        class="form-control py-1 px-2 mt-2"
                        placeholder="search"
                        bind:value={searchText}
                        on:input={() => filterItems(connection.jo)}
                        style="font-size:12px"
                      />
                    </div>
                    {#if newDatabasePopup[connection.jo]}
                      <div class="modal" role="dialog" id="my_modal_8">
                        <div class="modal-box">
                          <div
                            class="d-flex justify-content-between align-items-center"
                          >
                            <h6 class="font600">Create Database</h6>
                            <i
                              class="fa-solid fa-times"
                              on:click={() =>
                                (newDatabasePopup[connection.jo] = false)}
                            ></i>
                          </div>
                          <div class="mt-3">
                            <div class="">
                              <label class="font500" style="font-size:12px"
                                >Database Name</label
                              >
                              <input
                                class="form-control py-1 px-2"
                                bind:value={databaseValue}
                              />
                            </div>
                            <div class="mt-3">
                              <label class="font500" style="font-size:12px"
                                >Collection Name</label
                              >
                              <input
                                class="form-control py-1 px-2"
                                bind:value={collectionValue1}
                              />
                            </div>
                            <div class="mt-5 text-end">
                              <button
                                class="btn btn-outline-secondary btn-sm"
                                style="font-size:12px"
                                on:click={() =>
                                  (newDatabasePopup[connection.jo] = false)}
                                >Cancel</button
                              >

                              <button
                                class="btn btn-primary btn-sm mx-2"
                                on:click={() =>
                                  handleCreateDatabase(
                                    connection,
                                    connection.jo
                                  )}
                                style="font-size:12px">Create Database</button
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    {/if}

                    <div class="databases-list mt-3">
                      <ul style="list-style-type: none;padding-left:0">
                        {#each connection.databases as database}
                          <li
                            style="font-size: 12px;"
                            class="mt-2 d-flex gap-2 align-items-center justify-content-between hoverlist p-1"
                          >
                            <div
                              data-testid="databaseList"
                              class="d-flex gap-2 align-items-center"
                              on:click={() => openCollectionBox(database.jo)}
                            >
                              <i
                                class="fa-solid fa-caret-right"
                                style="font-size: 9px;"
                              ></i>
                              <i
                                class="fa-solid fa-database"
                                style="font-size: 9px;"
                              ></i>
                              {database.objDetails.name}
                            </div>
                            <div
                              class="text-secondary d-flex gap-2 align-items-center"
                            >
                              <a href="#my_modal_10" class="p-0 m-0">
                                <i
                                  class="fa-solid fa-plus"
                                  on:click={() =>
                                    addNewCollection(
                                      connection.jo,
                                      database.jo
                                    )}
                                  style="font-size: 9px;"
                                ></i>
                              </a>

                              <i
                                class="fa-solid fa-trash"
                                style="font-size: 9px;"
                              ></i>
                            </div>
                          </li>

                          {#if openCollectionSubMenu[database.jo]}
                            <ul
                              style="list-style-type: none;padding-left:0"
                              data-testid="submenu"
                            >
                              {#each database.collections as collection}
                                <li
                                  style="font-size: 11px;"
                                  class=" d-flex gap-2 align-items-center justify-content-between hoverlist p-1 ps-4"
                                >
                                  <div
                                  data-testid={`submenu${collection.jo}`}

                                    class="d-flex gap-2 align-items-center "
                                    on:click={() =>
                                      openCollectionTab(
                                        collection,
                                        connection,
                                        database
                                      )}
                                  >
                                    <i
                                      class="fa-solid fa-folder"
                                      style="font-size: 9px;"
                                    ></i>
                                    <span>
                                      {collection.objDetails.name}
                                    </span>
                                  </div>
                                  <div class="dropdown">
                                    <button
                                      class="btn-transparent text-dark p-0 m-0"
                                      type="button"
                                      id="dropdownMenuButton"
                                      data-bs-toggle="dropdown"
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                    >
                                      <i
                                        class="fa-solid fa-ellipsis"
                                        style="font-size: 11px;"
                                      ></i>
                                    </button>
                                    <div
                                      class="dropdown-menu"
                                      aria-labelledby="dropdownMenuButton"
                                    >
                                      <a
                                        class="dropdown-item"
                                        style="font-size:13px"
                                        href="#"
                                      >
                                        <i
                                          class="fa-solid fa-arrow-up-right-from-square"
                                        ></i> &nbsp;&nbsp; Drop Collection</a
                                      >
                                      <a
                                        class="dropdown-item"
                                        style="font-size:13px"
                                        href="#"
                                        ><i class="fa-solid fa-trash"
                                        ></i>&nbsp;&nbsp; Open in new tab</a
                                      >
                                    </div>
                                  </div>
                                </li>
                              {/each}
                            </ul>
                          {/if}
                          {#if newCollectionPopup[connection.jo + "_" + database.jo]}
                            <div class="modal" role="dialog" id="my_modal_10">
                              <div class="modal-box">
                                <div
                                  class="d-flex justify-content-between align-items-center"
                                >
                                  <h6 class="font600">Create Collection</h6>
                                  <i
                                    class="fa-solid fa-times"
                                    on:click={() =>
                                      (newCollectionPopup[
                                        connection.jo + "_" + database.jo
                                      ] = false)}
                                  ></i>
                                </div>
                                <div class="mt-3">
                                  <div class="mt-2">
                                    <label
                                      class="font500"
                                      style="font-size:12px"
                                      >Collection Name</label
                                    >
                                    <input
                                      class="form-control py-1 px-2"
                                      bind:value={collectionValue2}
                                    />
                                  </div>
                                  <div class="mt-5 text-end">
                                    <button
                                      class="btn btn-outline-secondary btn-sm"
                                      style="font-size:12px"
                                      on:click={() =>
                                        (newCollectionPopup[
                                          connection.jo + "_" + database.jo
                                        ] = false)}>Cancel</button
                                    >

                                    <button
                                      on:click={() =>
                                        handleCreateCollection(
                                          database,
                                          connection.jo
                                        )}
                                      class="btn btn-primary btn-sm mx-2"
                                      style="font-size:12px"
                                      >Create Collection</button
                                    >
                                  </div>
                                </div>
                              </div>
                            </div>
                          {/if}
                        {/each}
                      </ul>
                    </div>

                    <div class="tabgroups pt-3">
                      <div
                        class="d-flex justify-content-between align-items-center"
                        style="font-size: 14px;"
                      >
                        <div class="d-flex gap-2 align-items-center">
                          <i
                            class="fa-solid fa-table-columns"
                            style="font-size: 12px;"
                          ></i>
                          <span>Tab Groups</span>
                        </div>
                        <div>
                          <i class="fa-solid fa-plus"></i>
                        </div>
                      </div>
                      <ul style="list-style-type: none;padding-left:0">
                        {#if tabGroups.length > 0}
                          {#each tabGroups as group}
                            <li
                              style="font-size: 13px;"
                              class="mt-2 d-flex gap-2 align-items-center justify-content-between hoverlist p-1"
                            >
                              <div
                                class="d-flex gap-2 align-items-center"
                                on:click={() => openTabGroupBox(group.id)}
                              >
                                <i
                                  class="fa-solid fa-caret-right"
                                  style="font-size: 11px;"
                                ></i>
                                <i
                                  class="fa-solid fa-database"
                                  style="font-size: 11px;"
                                ></i>
                                {group.name}
                              </div>
                              <div class="text-secondary d-flex gap-2">
                                <i
                                  class="fa-solid fa-plus"
                                  style="font-size: 11px;"
                                ></i>
                                <i
                                  class="fa-solid fa-trash"
                                  style="font-size: 11px;"
                                ></i>
                              </div>
                            </li>

                            {#if openTabGroup[group.id]}
                              <ul
                                style="list-style-type: none;padding-left:0"
                                class=""
                              >
                                {#each group.tabs as tab}
                                  <li
                                    style="font-size: 12px;"
                                    class="mt-1 d-flex gap-2 align-items-center justify-content-between hoverlist p-1 ps-4"
                                  >
                                    <div
                                      class="d-flex gap-2 align-items-center"
                                    >
                                      <i
                                        class="fa-solid fa-folder"
                                        style="font-size: 11px;"
                                      ></i>
                                      <span>
                                        {tab.name}
                                      </span>
                                    </div>
                                    <i
                                      class="fa-solid fa-ellipsis"
                                      style="font-size: 11px;"
                                    ></i>
                                  </li>
                                {/each}
                              </ul>
                            {/if}
                          {/each}
                        {:else}
                          <div
                            style="font-size: 12px;"
                            class="my-3 text-center"
                          >
                            Add tab in groups....
                          </div>
                        {/if}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
    <div
      class="mainContentSmallScreen bg-gray-50 {activeSideMenuList
        ? 'md:w-[92vw]'
        : 'md:w-[100vw] '} {databaseMenuCol
        ? 'w-[78vw] '
        : 'w-[94vw]'} {activeSideMenuList && databaseMenuCol
        ? ''
        : 'md:w-[100vw]'}  max-w-[100vw] databaseMainSection"
    >
      <div
        class="w-full flex items-center justify-between me-2 bg-gray-100 border-bottom"
      >
        {#if !databaseMenuCol}
          <div class="px-2 border-e">
            <i
              class="bi bi-layout-sidebar-inset cursor-pointer text-gray-500"
              style="font-size:15px;font-weight:800"
              on:click={() => (databaseMenuCol = true)}
            ></i>
          </div>
        {/if}
        <!-- tabs menu -->
        <ul class=" w-full nav nav-pills list-style-none">
          {#if tabGroups.length > 0}
            {#each tabGroups as group}
              <li
              data-testid="newGroupInTab"
                style="font-size: 14px;position:relative"
                class="nav-item d-flex gap-2 bg-gray-100 align-items-center
      tab border-end py-0 px-2"
                on:drop={(e) => handleDropInTabGroups(e, group)}
                on:dragover={(e) => handleDragOver(e)}
              >
                <div
                
                  style="text-decoration: none;font-size:12px;cursor:pointer;border-radius: 8px;padding: 1px 10px;"
                  class="border text-white bg-success clickOnNewGroup"
                  on:click={() => showTabInGroupsBox(group.id)}
                >
                  {group.name}
                </div>

                {#if showTabInGroups[group.id]}
                  <div class="d-flex align-items-center gap-1 borderafter showTabInGroups">
                    {#each group.tabs as tab}
                      <a
                        draggable="true"
                        on:dragstart={(e) => handleDragStart(e, tab)}
                        on:dragover={(e) => handleDragOver(e)}
                        style="font-size:12px"
                        class="text-decoration-none d-inline-block text-secondary font600"
                        data-bs-toggle="pill"
                        href="#"
                        on:click={() => setActiveTab(tab.id)}
                        class:active={tab.id === activeTab}
                      >
                        {tab.name}
                      </a>
                      <button
                        style="font-size:12px"
                        class="btn btn-transparent px-2"
                        on:click={() => closeTabGroup(tab.id)}
                        ><i class="fa-solid fa-times text-secondary" /></button
                      >
                    {/each}
                  </div>
                {:else}
                  <button
                    style="font-size:12px"
                    class="btn btn-transparent px-2"
                    on:click={() => closeGroup(group.id)}
                    ><i class="fa-solid fa-times text-secondary" /></button
                  >
                {/if}
              </li>
            {/each}
          {/if}
          {#each tabs as tab}
            <li
              on:drop={(e) => handleDropInTab(e, tab)}
              style="font-size: 14px;"
              class="nav-item tab bg-gray-100
           border-end py-0 px-2 allTabs"
              draggable="true"
              on:dragstart={(e) => handleDragStart(e, tab)}
              on:dragover={(e) => handleDragOver(e)}
            >
              <a
                style="font-size:13px"
                class="text-decoration-none p-0 mt-1 d-inline-block text-secondary font600"
                data-bs-toggle="pill"
                href="#"
                on:click={() => setActiveTab(tab.id)}
                class:active={tab.id === activeTab}
              >
                <i class="fa-solid fa-folder"></i>&nbsp;
                {tab.name}
              </a>
              <button
                style="font-size:11px"
                class="btn btn-transparent px-2"
                on:click={() => closeTab(tab.id)}
                ><i class="fa-solid fa-times text-secondary" /></button
              >
            </li>
          {/each}

          <li
            style="background-color:#f4f5f7;"
            class="nav-item
                            tab border-end py-0 px-2"
          >
            <button
              on:click={addNewTab}
              class="btn btn-transparent px-1 newTab"
              style="font-weight: 600;font-size:15px"
              ><i class="fa-solid fa-plus text-secondary" /></button
            >
          </li>
        </ul>
        <!-- tabs right sections -->
        <div class="rightSideIcon me-3 pr-1">
          <div class="drawer drawer-end">
            <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
            <div class="drawer-content">
              <!-- Page content here -->
              <label
                for="my-drawer-4"
                class="drawer-button bg-transparent border-0"
                on:click={() => (mainContentToggle = false)}
                ><i
                  class="bi bi-layout-sidebar-inset-reverse cursor-pointer text-gray-500"
                  style="font-size:15px"
                ></i></label
              >
            </div>
            <div class="drawer-side">
              <label
                for="my-drawer-4"
                aria-label="close sidebar"
                class="drawer-overlay z-10"
                on:click={() => (mainContentToggle = true)}
              ></label>
              <ul
                class="menu bg-base-200 text-base-content min-h-full w-80 p-4 z-50"
              >
                <!-- Sidebar content here -->
                <li><a>Sidebar Item 1</a></li>
                <li><a>Sidebar Item 2</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- main content -->
      <div class="">
        {#if mainContentToggle}
          <!-- tab groups content -->
          {#if tabGroups.length > 0}
            {#each tabGroups as group}
              {#each group.tabs as tab}
                <div>
                  {#if tab.id === activeTab}
                    <div class="mt-3">
                      <!-- <h5 class="ms-3">{tab.name}</h5> -->
                      <div class="pt-3 ps-3 queryTabs">
                        <div role="tablist" class="tabs tabs-lifted">
                          <input
                            type="radio"
                            name="my_tabs_2"
                            role="tab"
                            aria-label="Documents"
                            class="tab hover:text-green-700 bg-gray-50 checked:bg-checked-white text-gray-500 font-medium checked:text-checked-green checked:font-semibold"
                            checked
                          />
                          <div
                            role="tabpanel"
                            class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                          >
                            <div class="border p-2">
                              <div class="d-flex gap-2 align-items-center">
                                <span
                                  class="text-primary"
                                  style="font-size: 13px;">Filter</span
                                >
                                <input
                                  type="text"
                                  style="font-size: 12px;"
                                  class="form-control py-1 px-2 border-0"
                                  placeholder="Type a query: ( field : 'value' )"
                                  bind:value={query}
                                />
                                <button
                                  class="btn-light btn py-1 btn-sm"
                                  style="font-size: 13px;">Explain</button
                                >
                                <button
                                  on:click={resetData}
                                  class="btn-secondary btn py-1 btn-sm"
                                  style="font-size: 13px;">Reset</button
                                >
                                <button
                                  on:click={() => findQuery(tab)}
                                  class="btn-success btn py-1 btn-sm"
                                  style="font-size: 13px;">Find</button
                                >
                                <button
                                  on:click={showOptions}
                                  class="btn-white text-primary btn py-1 btn-sm dropdown-toggle"
                                  style="font-size: 13px;"
                                  >Options
                                </button>
                              </div>
                              {#if showoptions}
                                <div class="showoptions mt-2">
                                  <div class="d-flex gap-3 align-items-center">
                                    <label
                                      for=""
                                      class="font600"
                                      style="font-size: 13px;">Project</label
                                    >
                                    <input
                                      type="text"
                                      style="font-size: 12px;"
                                      class="form-control py-1 px-2 border-0 bg-light"
                                      placeholder="( field : 0 )"
                                      bind:value={project}
                                    />
                                  </div>
                                  <div
                                    class="d-flex justify-content-between align-items-center mt-2"
                                  >
                                    <div
                                      class="d-flex gap-3 align-items-center"
                                    >
                                      <label
                                        for=""
                                        class="font600"
                                        style="font-size: 13px;">Sort</label
                                      >
                                      <input
                                        type="text"
                                        style="font-size: 12px;"
                                        class="form-control py-1 px-2 border-0 bg-light"
                                        placeholder="( field : -1 ) or [['field':-1]]"
                                        bind:value={sort}
                                      />
                                    </div>
                                    <div
                                      class="d-flex gap-2 align-items-center"
                                    >
                                      <label
                                        for=""
                                        class="font600"
                                        style="font-size: 13px;"
                                        >MaxTimeMS</label
                                      >
                                      <input
                                        type="text"
                                        style="font-size: 12px;"
                                        class="form-control py-1 px-2 border-0 bg-light"
                                        placeholder="60000"
                                        bind:value={maxTimeMS}
                                      />
                                    </div>
                                  </div>
                                  <div
                                    class="d-flex justify-content-between align-items-center mt-2"
                                  >
                                    <div
                                      class="d-flex gap-3 align-items-center"
                                    >
                                      <label
                                        for=""
                                        class="font600"
                                        style="font-size: 13px;"
                                        >Collation</label
                                      >
                                      <input
                                        type="text"
                                        style="font-size: 12px;"
                                        class="form-control py-1 px-2 border-0 bg-light"
                                        placeholder="( locale : 'simple' )"
                                        bind:value={collation}
                                      />
                                    </div>
                                    <div
                                      class="d-flex gap-2 align-items-center"
                                    >
                                      <div
                                        class="d-flex gap-2 align-items-center"
                                      >
                                        <label
                                          for=""
                                          class="font600"
                                          style="font-size: 13px;">Skip</label
                                        >
                                        <input
                                          type="text"
                                          style="font-size: 12px;"
                                          class="form-control py-1 px-2 border-0 bg-light"
                                          placeholder="0"
                                          bind:value={skip}
                                        />
                                      </div>
                                      <div
                                        class="d-flex gap-2 align-items-center"
                                      >
                                        <label
                                          for=""
                                          class="font600"
                                          style="font-size: 13px;">Limit</label
                                        >
                                        <input
                                          type="text"
                                          style="font-size: 12px;"
                                          class="form-control py-1 px-2 border-0 bg-light"
                                          placeholder="0"
                                          bind:value={limit}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              {/if}
                            </div>

                            <div
                              class="p-2 mt-2 d-flex gap-2 align-items-center"
                            >
                              <button
                                class="btn-success btn py-1 btn-sm"
                                style="font-size: 13px;"
                                ><i class="fa-solid fa-circle-plus"></i> Add Data</button
                              >
                              <button
                                class="btn-light btn py-1 btn-sm"
                                style="font-size: 13px;"
                                ><i class="fa-solid fa-circle-plus"></i> Export Data</button
                              >
                            </div>
                            <div class="mt-3" style="height:45vh;overflow:auto">
                              {#if tab.documents.length > 0}
                                {#if filteredCollection.length > 0}
                                  {#each filteredCollection as document}
                                    <div class="document border ps-4 py-3 mb-2">
                                      {#each Object.entries(document) as [key, value]}
                                        <div class="" style="font-size: 11px;">
                                          <span class="key">{key}:</span
                                          >&nbsp;&nbsp;&nbsp;
                                          <span
                                            style={key === "id"
                                              ? "color:#e72b2b;"
                                              : ""}
                                            class="value">{value}</span
                                          >
                                        </div>
                                      {/each}
                                    </div>
                                  {/each}
                                {:else if paginatedDocumentsGroup.length > 0}
                                  {#each paginatedDocumentsGroup as document}
                                    <div class="document border ps-4 py-3 mb-2">
                                      {#each Object.entries(document) as [key, value]}
                                        <div class="" style="font-size: 11px;">
                                          <span class="key">{key}:</span
                                          >&nbsp;&nbsp;&nbsp;
                                          <span
                                            style={key === "id"
                                              ? "color:#e72b2b;"
                                              : ""}
                                            class="value">{value}</span
                                          >
                                        </div>
                                      {/each}
                                    </div>
                                  {/each}

                                  {#if tab.documents.length > 0}
                                    {#if tab.documents.length > 5}
                                      <ul
                                        class="pagination justify-content-center mb-3"
                                      >
                                        {#each Array.from( { length: Math.ceil(tab.documents.length / 5) } ) as _, pageIndex}
                                          <li class="page-item">
                                            <button
                                              class="page-link"
                                              on:click={() =>
                                                setCurrentPage(pageIndex + 1)}
                                              aria-label={"Page " +
                                                (pageIndex + 1)}
                                            >
                                              {pageIndex + 1}
                                            </button>
                                          </li>
                                        {/each}
                                      </ul>
                                    {/if}
                                  {/if}
                                {:else}
                                  <div
                                    class="text-center mt-3"
                                    style="font-size: 13px;"
                                  >
                                    There is no collection data
                                  </div>
                                {/if}
                              {:else}
                                <div
                                  class="text-center mt-3"
                                  style="font-size: 13px;"
                                >
                                  There is no collection data
                                </div>
                              {/if}
                              <!-- Pagination -->
                            </div>
                          </div>

                          <input
                            type="radio"
                            name="my_tabs_2"
                            role="tab"
                            class="tab hover:text-green-700 bg-gray-50 checked:bg-checked-white text-gray-500 font-medium checked:text-checked-green checked:font-semibold"
                            aria-label="Aggregations"
                          />
                          <div
                            role="tabpanel"
                            class="tab-content bg-base-100 border-base-300 rounded-box p-6 overflow-hidden"
                          >
                            <div class="border p-2">
                              <div
                                class="d-flex justify-content-between align-items-center"
                              >
                                <div class="d-flex gap-2 align-items-center">
                                  <span
                                    class="text-dark font600"
                                    style="font-size: 13px;">Pipeline</span
                                  >
                                  <i class="fa-solid fa-folder dropdown-toggle"
                                  ></i>
                                  {#if runstage}
                                    <button
                                      class="btn btn-info btn-sm"
                                      style="font-size:12px"
                                    >
                                      $addFields</button
                                    >

                                    <button
                                      on:click={() => (runstage = false)}
                                      class="btn btn-secondary btn-sm"
                                      style="font-size:12px"
                                      ><i class="fa-solid fa-pen"></i>&nbsp;
                                      Edit</button
                                    >
                                  {:else}
                                    <span
                                      style="font-size: 13px;"
                                      class="text-secondary"
                                      >Your pipeline is currently empty. Need
                                      help getting started?</span
                                    >{/if}
                                </div>
                                <div class="d-flex gap-2 align-items-center">
                                  <button
                                    class="btn-light btn py-1 btn-sm"
                                    style="font-size: 13px;">Explain</button
                                  >
                                  <button
                                    class="btn-secondary btn py-1 btn-sm"
                                    style="font-size: 13px;">Export</button
                                  >
                                  <button
                                    on:click={runStages}
                                    class="btn-success btn py-1 btn-sm"
                                    style="font-size: 13px;">Run</button
                                  >
                                  <button
                                    on:click={showOptions}
                                    class="btn-white text-primary btn py-1 btn-sm dropdown-toggle"
                                    style="font-size: 13px;"
                                    >Options
                                  </button>
                                </div>
                              </div>
                              {#if showoptions}
                                <div class="showoptions mt-2">
                                  <div class="d-flex gap-3 align-items-center">
                                    <label
                                      for=""
                                      class="font600"
                                      style="font-size: 13px;">Project</label
                                    >
                                    <input
                                      type="text"
                                      style="font-size: 12px;"
                                      class="form-control py-1 px-2 border-0 bg-light"
                                      placeholder="( field : 0 )"
                                    />
                                  </div>
                                  <div
                                    class="d-flex justify-content-between align-items-center mt-2"
                                  >
                                    <div
                                      class="d-flex gap-3 align-items-center"
                                    >
                                      <label
                                        for=""
                                        class="font600"
                                        style="font-size: 13px;">Sort</label
                                      >
                                      <input
                                        type="text"
                                        style="font-size: 12px;"
                                        class="form-control py-1 px-2 border-0 bg-light"
                                        placeholder="( field : -1 ) or [['field':-1]]"
                                      />
                                    </div>
                                    <div
                                      class="d-flex gap-2 align-items-center"
                                    >
                                      <label
                                        for=""
                                        class="font600"
                                        style="font-size: 13px;"
                                        >MaxTimeMS</label
                                      >
                                      <input
                                        type="text"
                                        style="font-size: 12px;"
                                        class="form-control py-1 px-2 border-0 bg-light"
                                        placeholder="60000"
                                      />
                                    </div>
                                  </div>
                                  <div
                                    class="d-flex justify-content-between align-items-center mt-2"
                                  >
                                    <div
                                      class="d-flex gap-3 align-items-center"
                                    >
                                      <label
                                        for=""
                                        class="font600"
                                        style="font-size: 13px;"
                                        >Collation</label
                                      >
                                      <input
                                        type="text"
                                        style="font-size: 12px;"
                                        class="form-control py-1 px-2 border-0 bg-light"
                                        placeholder="( locale : 'simple' )"
                                      />
                                    </div>
                                    <div
                                      class="d-flex gap-2 align-items-center"
                                    >
                                      <div
                                        class="d-flex gap-2 align-items-center"
                                      >
                                        <label
                                          for=""
                                          class="font600"
                                          style="font-size: 13px;">Skip</label
                                        >
                                        <input
                                          type="text"
                                          style="font-size: 12px;"
                                          class="form-control py-1 px-2 border-0 bg-light"
                                          placeholder="0"
                                        />
                                      </div>
                                      <div
                                        class="d-flex gap-2 align-items-center"
                                      >
                                        <label
                                          for=""
                                          class="font600"
                                          style="font-size: 13px;">Limit</label
                                        >
                                        <input
                                          type="text"
                                          style="font-size: 12px;"
                                          class="form-control py-1 px-2 border-0 bg-light"
                                          placeholder="0"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              {/if}
                            </div>
                            {#if runstage}
                              <div
                                class="mt-3 d-flex justify-content-between align-items-center"
                              >
                                <span class="font600" style="font-size: 13px;"
                                  >ALL REUSLTS</span
                                >
                                <span class="font500" style="font-size: 13px;"
                                  >Showing 1 - {updatedStageData.length}</span
                                >
                              </div>
                              <div class="mt-3">
                                {#if updatedStageData.length > 0}
                                  {#each updatedStageData as document}
                                    <div class="border p-2 shadow-sm mb-2">
                                      <div class="document ps-3 py-3 mb-2">
                                        {#each Object.entries(document) as [key, value]}
                                          <div
                                            class=""
                                            style="font-size: 11px;"
                                          >
                                            <span class="key">{key}:</span
                                            >&nbsp;&nbsp;&nbsp;
                                            <span
                                              style={key === "id"
                                                ? "color:#e72b2b;"
                                                : ""}
                                              class="value">{value}</span
                                            >
                                          </div>
                                        {/each}
                                      </div>
                                    </div>
                                  {/each}
                                {:else}
                                  <div
                                    class="mt-5 text-center"
                                    style="font-size: 12px;"
                                  >
                                    No Preview Documents
                                  </div>
                                {/if}
                              </div>
                            {:else}
                              <div
                                class="p-2 mt-2 d-flex gap-2 align-items-center"
                              >
                                <button
                                  class="btn-white text-secondary btn py-1 btn-sm"
                                  style="font-size: 13px;">Untitled</button
                                >
                                <button
                                  class="btn-success btn py-1 btn-sm dropdown-toggle"
                                  style="font-size: 13px;">Save</button
                                >
                                <button
                                  class="btn-success btn py-1 btn-sm"
                                  style="font-size: 12px;"
                                  ><i class="fa-solid fa-plus"></i>&nbsp;Create
                                  New</button
                                >
                                <button
                                  class="btn-outline-success btn py-1 btn-sm font500"
                                  style="font-size: 12px;"
                                  ><i class="fa-solid fa-code"></i>&nbsp;EXPORT
                                  TO LANGUAGE</button
                                >
                              </div>

                              <div class="mt-2 border">
                                <div
                                  class="p-2 border-bottom ps-3"
                                  style="font-size: 12px;"
                                >
                                  <span class="font600"
                                    >{tab.documents.length}</span
                                  > Documents in this collection
                                </div>
                                <div>
                                  <span
                                    style="font-size: 12px;"
                                    class="ps-3 pt-2">Preview of documents</span
                                  >
                                </div>
                                <div
                                  class="d-flex gap-2 ps-3 mt-2 mb-3 overflow-auto"
                                >
                                  {#if tab.documents.length > 0}
                                    {#each tab.documents as document}
                                      <div class="border p-2 shadow-sm">
                                        <div class="document ps-3 py-3 mb-2">
                                          {#each Object.entries(document) as [key, value]}
                                            <div
                                              class=""
                                              style="font-size: 11px;"
                                            >
                                              <span class="key">{key}:</span
                                              >&nbsp;&nbsp;&nbsp;
                                              <span
                                                style={key === "id"
                                                  ? "color:#e72b2b;"
                                                  : ""}
                                                class="value">{value}</span
                                              >
                                            </div>
                                          {/each}
                                        </div>
                                      </div>
                                    {/each}
                                  {:else}
                                    <div
                                      class="text-center mt-3 font500"
                                      style="font-size: 13px;margin:0 auto"
                                    >
                                      There is no documents....
                                    </div>
                                  {/if}
                                </div>
                              </div>

                              {#if showstagebox}
                                <div class="my-2 text-center">
                                  <i
                                    style="cursor:pointer"
                                    class="fa-solid fa-circle-plus"
                                    on:click={showMoreStages}
                                  ></i>
                                </div>
                                <div class="mt-3 border mb-3">
                                  <div
                                    class="border-bottom p-2 d-flex justify-content-between align-items-center"
                                  >
                                    <div
                                      class="d-flex gap-2 align-items-center w-100"
                                      style="font-size:12px"
                                    >
                                      <div>Stage 1</div>
                                      <select
                                        name=""
                                        id=""
                                        class="form-control py-0 px-1 w-auto"
                                        style="font-size:12px"
                                      >
                                        <option value="$addFields"
                                          >$addFields</option
                                        >
                                        <option value="$count">$count</option>
                                      </select>
                                    </div>
                                    <div>
                                      <i class="fa-solid fa-ellipsis"></i>
                                    </div>
                                  </div>
                                  <div class="row">
                                    <div class="col-lg-5">
                                      <textarea
                                        name=""
                                        class="p-1"
                                        id=""
                                        bind:value={newField}
                                        on:keypress={(event) =>
                                          handleKeyPress(event, tab)}
                                        placeholder="Enter field and value in the format: field: 'value'"
                                        style="width: 100%;height:29vh;border:0;outline:0;font-size:12px"
                                      ></textarea>
                                    </div>
                                    <div class="col-lg-7" style="">
                                      <div
                                        class="mt-2 ms-2"
                                        style="font-size: 12px;"
                                      >
                                        Output after <span class="text-primary"
                                          >$addFields</span
                                        >
                                        stage (Sample of {updatedStageData.length}
                                        documents)
                                      </div>
                                      <div style="overflow: auto;height:25vh">
                                        {#if updatedStageData.length > 0}
                                          {#each updatedStageData as document}
                                            <div class="border p-2 shadow-sm">
                                              <div
                                                class="document ps-3 py-3 mb-2"
                                              >
                                                {#each Object.entries(document) as [key, value]}
                                                  <div
                                                    class=""
                                                    style="font-size: 11px;"
                                                  >
                                                    <span class="key"
                                                      >{key}:</span
                                                    >&nbsp;&nbsp;&nbsp;
                                                    <span
                                                      style={key === "id"
                                                        ? "color:#e72b2b;"
                                                        : ""}
                                                      class="value"
                                                      >{value}</span
                                                    >
                                                  </div>
                                                {/each}
                                              </div>
                                            </div>
                                          {/each}
                                        {:else}
                                          <div
                                            class="mt-5 text-center"
                                            style="font-size: 12px;"
                                          >
                                            No Preview Documents
                                          </div>
                                        {/if}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              {:else}
                                <div class="mt-4 d-flex justify-content-center">
                                  <button
                                    class="btn btn-success btn-sm"
                                    on:click={showAddStageBox}
                                    ><i class="fa-solid fa-plus"></i>&nbsp; Add
                                    Stage</button
                                  >
                                </div>
                              {/if}
                            {/if}
                          </div>

                          <input
                            type="radio"
                            name="my_tabs_2"
                            role="tab"
                            class="tab hover:text-green-700 bg-gray-50 checked:bg-checked-white text-gray-500 font-medium checked:text-checked-green checked:font-semibold"
                            aria-label="Schema"
                          />
                          <div
                            role="tabpanel"
                            class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                          >
                            <div class="border p-2">
                              <div class="d-flex gap-2 align-items-center">
                                <span
                                  class="text-primary"
                                  style="font-size: 13px;">Filter</span
                                >
                                <input
                                  type="text"
                                  style="font-size: 12px;"
                                  class="form-control py-1 px-2 border-0"
                                  placeholder="Type a query: ( field : 'value' )"
                                  bind:value={query}
                                />

                                <button
                                  on:click={resetData}
                                  class="btn-secondary btn py-1 btn-sm"
                                  style="font-size: 13px;">Reset</button
                                >
                                <button
                                  class="btn-success btn py-1 btn-sm"
                                  style="font-size: 13px;">Analyze</button
                                >
                                <button
                                  class="btn-success btn py-1 btn-sm"
                                  style="font-size: 13px;"
                                  ><i class="fa-solid fa-code"></i></button
                                >

                                <button
                                  on:click={showOptions}
                                  class="btn-white text-primary btn py-1 btn-sm dropdown-toggle"
                                  style="font-size: 13px;"
                                  >Options
                                </button>
                              </div>
                              <div class="showoptions mt-2">
                                <div class="d-flex gap-3 align-items-center">
                                  <label
                                    for=""
                                    class="font600"
                                    style="font-size: 13px;">Project</label
                                  >
                                  <input
                                    type="text"
                                    style="font-size: 12px;"
                                    class="form-control py-1 px-2 border-0 bg-light"
                                    placeholder="( field : 0 )"
                                  />
                                </div>
                                <div
                                  class="d-flex justify-content-between align-items-center mt-2"
                                >
                                  <div class="d-flex gap-3 align-items-center">
                                    <label
                                      for=""
                                      class="font600"
                                      style="font-size: 13px;">Sort</label
                                    >
                                    <input
                                      type="text"
                                      style="font-size: 12px;"
                                      class="form-control py-1 px-2 border-0 bg-light"
                                      placeholder="( field : -1 ) or [['field':-1]]"
                                    />
                                  </div>
                                  <div class="d-flex gap-2 align-items-center">
                                    <label
                                      for=""
                                      class="font600"
                                      style="font-size: 13px;">MaxTimeMS</label
                                    >
                                    <input
                                      type="text"
                                      style="font-size: 12px;"
                                      class="form-control py-1 px-2 border-0 bg-light"
                                      placeholder="60000"
                                    />
                                  </div>
                                </div>
                                <div
                                  class="d-flex justify-content-between align-items-center mt-2"
                                >
                                  <div class="d-flex gap-3 align-items-center">
                                    <label
                                      for=""
                                      class="font600"
                                      style="font-size: 13px;">Collation</label
                                    >
                                    <input
                                      type="text"
                                      style="font-size: 12px;"
                                      class="form-control py-1 px-2 border-0 bg-light"
                                      placeholder="( locale : 'simple' )"
                                    />
                                  </div>
                                  <div class="d-flex gap-2 align-items-center">
                                    <div
                                      class="d-flex gap-2 align-items-center"
                                    >
                                      <label
                                        for=""
                                        class="font600"
                                        style="font-size: 13px;">Skip</label
                                      >
                                      <input
                                        type="text"
                                        style="font-size: 12px;"
                                        class="form-control py-1 px-2 border-0 bg-light"
                                        placeholder="0"
                                      />
                                    </div>
                                    <div
                                      class="d-flex gap-2 align-items-center"
                                    >
                                      <label
                                        for=""
                                        class="font600"
                                        style="font-size: 13px;">Limit</label
                                      >
                                      <input
                                        type="text"
                                        style="font-size: 12px;"
                                        class="form-control py-1 px-2 border-0 bg-light"
                                        placeholder="0"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <input
                            type="radio"
                            name="my_tabs_2"
                            role="tab"
                            class="tab hover:text-green-700 bg-gray-50 checked:bg-checked-white text-gray-500 font-medium checked:text-checked-green checked:font-semibold"
                            aria-label="Indexes"
                          />
                          <div
                            role="tabpanel"
                            class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                          >
                            <div
                              class="d-flex justify-content-between align-items-center"
                            >
                              <div>
                                <button class="btn btn-success btn-sm"
                                  >Create Index
                                </button>
                                <button class="btn btn-light btn-sm"
                                  ><i class="fa-solid fa-arrows-rotate"
                                  ></i>&nbsp; Refresh
                                </button>
                              </div>
                            </div>
                            <div class="mt-3 border p-3">
                              <div class="table-responsive w-100">
                                <table class="table w-100">
                                  <thead>
                                    <tr style="font-size:12px">
                                      <th>Name and Definition</th>
                                      <th>Type</th>
                                      <th>Size</th>
                                      <th>Usage</th>
                                      <th>Properties</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr style="font-size: 12px;">
                                      <td> _id_ </td>
                                      <td class=""
                                        ><span
                                          class="text-white bg-dark py-1 px-2 rounded"
                                          >Regular <i
                                            class="fa-solid fa-circle-info"
                                          ></i>
                                        </span>
                                      </td>
                                      <td> 36.0 KB</td>
                                      <td> Usage data unavailable </td>
                                      <td class=""
                                        ><span
                                          class="text-white bg-dark py-1 px-2 rounded"
                                          >Unique <i
                                            class="fa-solid fa-circle-info"
                                          ></i>
                                        </span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>

                          <input
                            type="radio"
                            name="my_tabs_2"
                            role="tab"
                            class="tab hover:text-green-700 bg-gray-50 checked:bg-checked-white text-gray-500 font-medium checked:text-checked-green checked:font-semibold"
                            aria-label="Validation"
                          />
                          <div
                            role="tabpanel"
                            class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                          >
                            <div class="d-flex align-items-center flex-column">
                              <i
                                class="fa-solid mt-3 fa-file-code"
                                style="font-size:30px"
                              ></i>
                              <h6 class="font600 mt-2 text-success">
                                Add validation rules
                              </h6>
                              <span class="mt-2 text-center"
                                >Create rules to enforce data structure of
                                documents on updates and inserts.</span
                              >
                              <button
                                class="btn btn-success btn-sm mt-3"
                                style="font-size: 13px;"
                                >Add Rule
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  {/if}
                </div>
              {/each}{/each}
          {/if}
          <div class="modal" role="dialog" id="my_modal_11">
            <div class="modal-box">
              <div class="">
                <h4>New Connection</h4>
                <br />

                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <select
                      bind:value={connectionType}
                      on:change={updateURI}
                      class="border-0 form-control text-sm p-2"
                      style="background-color: rgba(206,207,210,0.19);border-radius: 5px;border: 0; outline: 0;"
                    >
                      <option value="" disabled>Choose Type</option>
                      <option value="MongoString">MongoString</option>
                      <option value="Network">Network</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                  <div>
                    <div class="btn-group">
                      <button
                        type="button"
                        class="btn btn-white dropdown-toggle text-sm"
                        data-bs-toggle="dropdown"
                        style="background-color: rgba(206,207,210,0.19);border-radius: 5px;border: 0; outline: 0;"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Connection String
                      </button>
                      <div
                        class="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                        id="nameDropdown"
                      ></div>
                    </div>
                  </div>
                </div>

                <div
                  class="connection-box mt-4 shadow-sm p-3 bg-gray-100"
                  style="border-radius:10px"
                >
                  <label for="" class="text-sm font600">Name</label>
                  <input
                    type="text"
                    class="form-control my-1 fontsize14"
                    placeholder="e.g. abc"
                    bind:value={nameString}
                    on:input={handleNameString}
                    style="background-color: #fafafa;border-color:#fafafa"
                  />
                  <br />
                  <div
                    class="justify-content-between d-flex align-items-center"
                  >
                    <div>
                      <label for="" class="text-sm font600">URI</label>
                    </div>
                    <div
                      class="justify-content-end d-flex gap-1 align-items-center"
                    >
                      <div class="text-sm font600">Edit Connection String</div>
                      <div class="form-check form-switch">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          bind:checked={isEditable}
                          role="switch"
                          id="flexSwitchCheckChecked"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <textarea
                      name=""
                      id="textarea"
                      bind:value={uri}
                      cols="30"
                      rows="3"
                      disabled={!isEditable}
                      class="form-control mt-2 text-sm"
                      style="border-radius: 7px;background-color:#f6f7f9;outline:0;opacity:0.6"
                    ></textarea>
                  </div>
                  <div class="my-3 pt-2 text-end">
                    <button
                      class="btn btn-sm btn-secondary"
                      on:click={handleDelete}>Delete</button
                    >
                    <button
                      class="btn btn-sm btn-primary"
                      on:click={handleConnect}>Connect</button
                    >
                  </div>
                </div>
              </div>
              <div class="modal-action">
                <a href="#" class="btn">Close</a>
              </div>
            </div>
          </div>
          <!-- simple tabs content -->
          {#each tabs as tab}
            <div>
              {#if tab.id === activeTab}
                <div class="row border-bottom mt-1 pb-2">
                  <div class="col-lg-4 p-2 border-end">
                    <div class="">
                      <div class="d-flex gap-2">
                        <input
                          type="text"
                          class="form-control py-1 border-0"
                          placeholder="add to tab group"
                          style="font-size: 13px;"
                          bind:value={groupToAdd}
                        />
                        <button
                        data-testid="addToTabGroup"
                          class="btn btn-primary btn-sm"
                          on:click={() => addToTabGroup(tab, groupToAdd)}
                          style="font-size: 13px;">Add</button
                        >
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-8 ps-4">
                    {#if tab.databaseName !== ""}
                      <div
                        class="mt-2 d-flex align-items-center justify-content-between"
                      >
                        <h6 class="text-success">
                          [{tab.connectionName}].{tab.databaseName} .
                          <span> {tab.name}</span>
                        </h6>
                        <div class="d-flex gap-2 align-items-center pe-2">
                          <div class="d-flex flex-column align-items-center">
                            <span class="text-success font600">
                              {tab.documents.length}
                            </span>
                            <span style="font-size:13px">Documents</span>
                          </div>
                          <div class="d-flex flex-column align-items-center">
                            <span class="font600 text-success">
                              {tab.documents.length}
                            </span>
                            <span style="font-size:13px">Indexes</span>
                          </div>
                        </div>
                      </div>
                    {/if}
                  </div>
                </div>

                <div class="mt-3">
                  <!-- <h5 class="ms-3">{tab.name}</h5> -->
                  <div class="pt-3 ps-3 queryTabs">
                    <!-- tabs start-->
                    <div role="tablist" class="tabs tabs-lifted">
                      <input
                        type="radio"
                        name="my_tabs_2"
                        role="tab"
                        class="tab hover:text-green-700 bg-gray-50 checked:bg-checked-white font-medium checked:text-checked-green checked:font-semibold"
                        aria-label="Documents"
                        checked
                      />
                      <div
                        role="tabpanel"
                        class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                      >
                        <div class="border p-2">
                          <div class="flex gap-2 items-center">
                            <span class="text-primary" style="font-size: 13px;"
                              >Filter</span
                            >
                            <input
                              type="text"
                              style="font-size: 12px;"
                              class="form-control py-1 px-2 border-0"
                              placeholder="Type a query: ( field : 'value' )"
                              bind:value={query}
                            />
                            <button
                              class="btn-light btn py-1 btn-sm text-sm sm:text-xs text-gray-700"
                              >Explain</button
                            >
                            <button
                              on:click={resetData}
                              class="btn-secondary btn py-1 btn-sm text-sm sm:text-xs"
                              >Reset</button
                            >
                            <button
                              on:click={() => findQuery(tab)}
                              class="btn-success btn py-1 btn-sm text-sm sm:text-xs"
                              >Find</button
                            >
                            <button
                              on:click={showOptions}
                              class="btn-white text-primary btn py-1 btn-sm dropdown-toggle text-sm sm:text-xs"
                              >Options
                            </button>
                          </div>
                          {#if showoptions}
                            <div class="showoptions mt-2">
                              <div class="d-flex gap-3 align-items-center">
                                <label
                                  for=""
                                  class="font600"
                                  style="font-size: 13px;">Project</label
                                >
                                <input
                                  type="text"
                                  style="font-size: 12px;"
                                  class="form-control py-1 px-2 border-0 bg-light"
                                  placeholder="( field : 0 )"
                                  bind:value={project}
                                />
                              </div>
                              <div
                                class="d-flex justify-content-between align-items-center mt-2"
                              >
                                <div class="d-flex gap-3 align-items-center">
                                  <label
                                    for=""
                                    class="font600"
                                    style="font-size: 13px;">Sort</label
                                  >
                                  <input
                                    type="text"
                                    style="font-size: 12px;"
                                    class="form-control py-1 px-2 border-0 bg-light"
                                    placeholder="( field : -1 ) or [['field':-1]]"
                                    bind:value={sort}
                                  />
                                </div>
                                <div class="d-flex gap-2 align-items-center">
                                  <label
                                    for=""
                                    class="font600"
                                    style="font-size: 13px;">MaxTimeMS</label
                                  >
                                  <input
                                    type="text"
                                    style="font-size: 12px;"
                                    class="form-control py-1 px-2 border-0 bg-light"
                                    placeholder="60000"
                                    bind:value={maxTimeMS}
                                  />
                                </div>
                              </div>
                              <div
                                class="d-flex justify-content-between align-items-center mt-2"
                              >
                                <div class="d-flex gap-3 align-items-center">
                                  <label
                                    for=""
                                    class="font600"
                                    style="font-size: 13px;">Collation</label
                                  >
                                  <input
                                    type="text"
                                    style="font-size: 12px;"
                                    class="form-control py-1 px-2 border-0 bg-light"
                                    placeholder="( locale : 'simple' )"
                                    bind:value={collation}
                                  />
                                </div>
                                <div class="d-flex gap-2 align-items-center">
                                  <div class="d-flex gap-2 align-items-center">
                                    <label
                                      for=""
                                      class="font600"
                                      style="font-size: 13px;">Skip</label
                                    >
                                    <input
                                      type="text"
                                      style="font-size: 12px;"
                                      class="form-control py-1 px-2 border-0 bg-light"
                                      placeholder="0"
                                      bind:value={skip}
                                    />
                                  </div>
                                  <div class="d-flex gap-2 align-items-center">
                                    <label
                                      for=""
                                      class="font600"
                                      style="font-size: 13px;">Limit</label
                                    >
                                    <input
                                      type="text"
                                      style="font-size: 12px;"
                                      class="form-control py-1 px-2 border-0 bg-light"
                                      placeholder="0"
                                      bind:value={limit}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          {/if}
                        </div>

                        <div
                          class="p-2 mt-2 d-flex justify-content-between align-items-center"
                        >
                          <div class="d-flex gap-2 align-items-center">
                            <button
                              class="btn-success btn py-1 btn-sm text-sm sm:text-xs font-medium"
                              ><i class="fa-solid fa-circle-plus"></i> Add Data</button
                            >
                            <button
                              class="btn-light btn py-1 btn-sm sm:text-xs text-sm font-medium"
                              ><i class="fa-solid fa-circle-plus"></i> Export Data</button
                            >
                          </div>
                          <div
                            class="border d-flex align-items-center gap-2 buttonactive"
                          >
                            <button
                              on:click={() => handleView("listView")}
                              class:active={currentView === "listView"}
                              class="btn btn-white py-0 btn-sm"
                              ><i class="fa-solid fa-bars"></i></button
                            >
                            <button
                              on:click={() => handleView("jsonView")}
                              class:active={currentView === "jsonView"}
                              class="btn btn-white py-0 btn-sm"
                              ><i class="fa-solid fa-code"></i></button
                            >
                            <button
                              on:click={() => handleView("tableView")}
                              class:active={currentView === "tableView"}
                              class="btn btn-white py-0 btn-sm"
                              ><i class="fa-solid fa-table"></i></button
                            >
                          </div>
                        </div>
                        <div
                          class="mt-3"
                          style="height:45vh;overflow:auto"
                        >
                          {#if currentView === "jsonView"}
                            {#if filteredCollection.length > 0}
                              {#each filteredCollection as document}
                                <div
                                  class="document border position-relative mb-2"
                                  style="height:21vh;"
                                >
                                  {#if currentView === "jsonView"}
                                    <textarea
                                      style="width:100%;height:100%;border:0;outline:0;font-size:11px;"
                                      class="form-control ps-4 py-2 bg-light font500 multicolortext"
                                      value={JSON.stringify(document, null, 2)}
                                      contenteditable={isEditing[document.id]
                                        ? "true"
                                        : "false"}
                                      on:input={(e) =>
                                        handleDocumentChange(
                                          document,
                                          e.target.value
                                        )}
                                    ></textarea>
                                    <div
                                      class="d-flex gap-2 align-items-center position-absolute"
                                      style="font-size:12px;right:2%;top:28%;cursor:pointer"
                                    >
                                      <i
                                        class="fa-solid fa-pen border p-1"
                                        on:click={() =>
                                          handleEditJsonDocument(document)}
                                      ></i>
                                      <i
                                        class="fa-solid fa-copy border p-1"
                                        on:click={() =>
                                          handleCopyJsonDocument(document)}
                                      ></i>
                                      <i
                                        class="fa-solid fa-trash border p-1"
                                        on:click={() =>
                                          handleDeleteDocument(document)}
                                      ></i>
                                    </div>
                                  {/if}
                                </div>
                                {#if isEditing[document.id]}
                                  <div
                                    class="d-flex justify-content-end align-items-center my-2"
                                  >
                                    <button
                                      class="btn btn-white btn-sm"
                                      style="font-size:12px"
                                      on:click={() =>
                                        (isEditing[document.id] = false)}
                                      >Cancel</button
                                    >
                                    <button
                                      class="btn btn-success mx-2 btn-sm"
                                      style="font-size:12px"
                                      on:click={() =>
                                        handleUpdateDocument(document)}
                                      >Update</button
                                    >
                                  </div>
                                {/if}
                              {/each}
                            {:else if paginatedDocuments.length > 0}
                              {#each paginatedDocuments as value}
                                <div
                                  class="document border position-relative mb-2 p-2"
                                >
                                  {#if currentView === "jsonView"}
                                    <JSONTree
                                      {value}
                                      defaultExpandedLevel={1}
                                      shouldShowPreview={false}
                                      --json-tree-font-family="monospace"
                                      --json-tree-property-color="#e72b2b"
                                      --json-tree-string-color="#008000"
                                      --json-tree-symbol-color="#66d9ef"
                                      --json-tree-boolean-color="#c594c5"
                                      --json-tree-function-color="#c594c5"
                                      --json-tree-number-color="#f99157"
                                      --json-tree-label-color="#f92672"
                                      --json-tree-arrow-color="#ae81ff"
                                      --json-tree-null-color="#66d9ef"
                                      --json-tree-undefined-color="#66d9ef"
                                      --json-tree-date-color="#fd971f"
                                      --json-tree-operator-color="#f8f8f2"
                                      --json-tree-regex-color="#9effff"
                                      --json-tree-li-identation="2em"
                                      --json-tree-li-line-height="1.8"
                                      --json-tree-font-size="11px"
                                      --json-tree-font-weight="600"
                                    />
                                    <!-- <textarea
                                      rows="7"
                                      style="width:100%;height:100%;border:0;outline:0;font-size:11px;"
                                      class="form-control ps-4 py-2 bg-light font500 multicolortext"
                                      value={JSON.stringify(document, null, 2)}
                                      contenteditable={isEditing[document.id]
                                        ? "true"
                                        : "false"}
                                      on:input={(e) =>
                                        handleDocumentChange(
                                          document,
                                          e.target.value
                                        )}
                                    ></textarea> -->
                                    <div
                                      class="d-flex gap-2 align-items-center position-absolute"
                                      style="font-size:12px;right:2%;top:28%;cursor:pointer"
                                    >
                                      <i
                                        class="fa-solid fa-pen border p-1"
                                        on:click={() =>
                                          handleEditJsonDocument(document)}
                                      ></i>
                                      <i
                                        class="fa-solid fa-copy border p-1"
                                        on:click={() =>
                                          handleCopyJsonDocument(document)}
                                      ></i>
                                      <i
                                        class="fa-solid fa-trash border p-1"
                                        on:click={() =>
                                          handleDeleteDocument(document)}
                                      ></i>
                                    </div>
                                  {/if}
                                </div>
                                {#if isEditing[document.id]}
                                  <div
                                    class="d-flex justify-content-end align-items-center my-2"
                                  >
                                    <button
                                      class="btn btn-white btn-sm"
                                      style="font-size:12px"
                                      on:click={() =>
                                        (isEditing[document.id] = false)}
                                      >Cancel</button
                                    >
                                    <button
                                      class="btn btn-success mx-2 btn-sm"
                                      style="font-size:12px"
                                      on:click={() =>
                                        handleUpdateDocument(document)}
                                      >Update</button
                                    >
                                  </div>
                                {/if}
                              {/each}
                              {#if tab.documents.length > 0}
                                {#if tab.documents.length > 5}
                                  <!-- Pagination -->
                                  <ul
                                    class="pagination justify-content-center mb-3"
                                  >
                                    {#each Array.from( { length: Math.ceil(tab.documents.length / 5) } ) as _, pageIndex}
                                      <li class="page-item">
                                        <button
                                          class="page-link"
                                          on:click={() =>
                                            setCurrentPage(pageIndex + 1)}
                                          aria-label={"Page " + (pageIndex + 1)}
                                        >
                                          {pageIndex + 1}
                                        </button>
                                      </li>
                                    {/each}
                                  </ul>
                                {/if}
                              {/if}
                            {:else}
                              <div
                                class="text-center mt-3"
                                style="font-size: 13px;"
                              >
                                There is no collection data
                              </div>
                            {/if}
                          {:else if currentView === "tableView"}
                            {#if filteredCollection.length > 0}
                              <span
                                style="font-size: 12px;background-color:#f4f5f7"
                                class=" p-1"
                              >
                                <i
                                  class="fa-solid fa-home"
                                  style="font-size: 9px;"
                                ></i>&nbsp; {tab.name}
                              </span>

                              {#if currentView === "tableView"}
                                <TableDoc
                                  array={arrayDocuments}
                                  on:showArray={handleArrayData}
                                  on:editDocument={handleEditTableDocument}
                                  on:copyDocument={handleCopyTableDocument}
                                  on:deleteDocument={handleDeleteTableDocument}
                                />
                              {:else}
                                <TableDoc array={filteredDocuments} />
                              {/if}

                              {#if tab.documents.length > 0}
                                {#if tab.documents.length > 5}
                                  <!-- Pagination -->
                                  <ul
                                    class="pagination justify-content-center mb-3"
                                  >
                                    {#each Array.from( { length: Math.ceil(tab.documents.length / 5) } ) as _, pageIndex}
                                      <li class="page-item">
                                        <button
                                          class="page-link"
                                          on:click={() =>
                                            setCurrentPage(pageIndex + 1)}
                                          aria-label={"Page " + (pageIndex + 1)}
                                        >
                                          {pageIndex + 1}
                                        </button>
                                      </li>
                                    {/each}
                                  </ul>
                                {/if}
                              {/if}
                            {:else if paginatedDocuments.length > 0}
                              <span
                                style="font-size: 12px;background-color:#f4f5f7"
                                class=" p-1"
                              >
                                <i
                                  class="fa-solid fa-home"
                                  style="font-size: 9px;"
                                ></i>&nbsp; {tab.name}
                              </span>

                              {#if showState}
                                {#each Object.entries(paginatedDocuments[0]) as [key, value]}
                                  {#if Array.isArray(value)}
                                    <span
                                      style="font-size: 12px;background-color:#f4f5f7"
                                      class=" p-1"
                                    >
                                      <i
                                        class="fa-solid fa-home"
                                        style="font-size: 9px;"
                                      ></i>&nbsp; {key}
                                    </span>
                                  {/if}
                                {/each}
                              {:else}
                                {#each Object.entries(arrayDocuments[0]) as [key, value]}
                                  {#if Array.isArray(value)}
                                    <span
                                      style="font-size: 12px;background-color:#f4f5f7"
                                      class=" p-1"
                                    >
                                      <i
                                        class="fa-solid fa-home"
                                        style="font-size: 9px;"
                                      ></i>&nbsp; {key}
                                    </span>
                                  {/if}
                                {/each}
                              {/if}

                              {#if currentView === "tableView"}
                                <TableDoc
                                  array={arrayDocuments}
                                  on:showArray={handleArrayData}
                                  on:editDocument={handleEditTableDocument}
                                  on:copyDocument={handleCopyTableDocument}
                                  on:deleteDocument={handleDeleteTableDocument}
                                />
                              {:else}
                                <TableDoc array={paginatedDocuments} />
                              {/if}

                              {#if tab.documents.length > 0}
                                {#if tab.documents.length > 5}
                                  <!-- Pagination -->
                                  <ul
                                    class="pagination justify-content-center mb-3"
                                  >
                                    {#each Array.from( { length: Math.ceil(tab.documents.length / 5) } ) as _, pageIndex}
                                      <li class="page-item">
                                        <button
                                          class="page-link"
                                          on:click={() =>
                                            setCurrentPage(pageIndex + 1)}
                                          aria-label={"Page " + (pageIndex + 1)}
                                        >
                                          {pageIndex + 1}
                                        </button>
                                      </li>
                                    {/each}
                                  </ul>
                                {/if}
                              {/if}
                            {/if}
                          {:else if filteredCollection.length > 0}
                            {#each filteredCollection as document}
                              <div
                                class="document border ps-4 py-3 mb-2 position-relative"
                              >
                                {#each Object.entries(document) as [key, value]}
                                  <div
                                    class=""
                                    style="font-size: 11px;"
                                    contenteditable={isEditing[document.id]
                                      ? "true"
                                      : "false"}
                                  >
                                    <span class="key">{key}:</span
                                    >&nbsp;&nbsp;&nbsp;
                                    <span
                                      style={key === "id"
                                        ? "color:#e72b2b;"
                                        : ""}
                                      class="value"
                                    >
                                      {#if typeof value === "string"}
                                        "{value}" <!-- Wrap string values in double quotes -->
                                      {:else if Array.isArray(value)}
                                        <!-- Display array length and icon to toggle visibility -->
                                        <span>
                                          [{value.length}] <!-- Show array length -->
                                          <i
                                            class="fa-solid fa-caret-down text-secondary"
                                            style="cursor: pointer;"
                                            on:click={() =>
                                              toggleArrayVisibility(
                                                document.id,
                                                key
                                              )}
                                          ></i>
                                        </span>
                                        {#if arrayVisibility[document.id + key]}
                                          <!-- Render array content when visible -->
                                          <div style="margin-left: 20px;">
                                            {#each value as item, index}
                                              <div class="mb-2">
                                                {#if typeof item === "object"}
                                                  <!-- If item is an object, display its key-value pairs -->
                                                  <div
                                                    class="mb-1 text-secondary"
                                                  >
                                                    <span
                                                      class="text-dark font600"
                                                      >{index} :
                                                    </span> Object
                                                  </div>
                                                  {#each Object.entries(item) as [itemKey, itemValue]}
                                                    <div
                                                      class=""
                                                      style="margin-left:20px"
                                                    >
                                                      <span class="key"
                                                        >{itemKey}:</span
                                                      >&nbsp;&nbsp;&nbsp;
                                                      <span
                                                        style={itemKey === "id"
                                                          ? "color:#e72b2b;"
                                                          : ""}
                                                        class="value"
                                                        >{itemValue}</span
                                                      >
                                                    </div>
                                                  {/each}
                                                {:else}
                                                  {item}
                                                {/if}
                                              </div>
                                            {/each}
                                          </div>
                                        {/if}
                                      {:else}
                                        {value}
                                        <!-- Render other types as is -->
                                      {/if}
                                    </span>
                                  </div>
                                  <div
                                    class="d-flex gap-2 align-items-center position-absolute"
                                    style="font-size:12px;right:2%;top:28%;cursor:pointer"
                                  >
                                    <i
                                      class="fa-solid fa-pen border p-1"
                                      on:click={() =>
                                        handleEditJsonDocument(document)}
                                    ></i>
                                    <i
                                      class="fa-solid fa-copy border p-1"
                                      on:click={() =>
                                        handleCopyJsonDocument(document)}
                                    ></i>
                                    <i
                                      class="fa-solid fa-trash border p-1"
                                      on:click={() =>
                                        handleDeleteDocument(document)}
                                    ></i>
                                  </div>
                                {/each}
                              </div>
                              {#if isEditing[document.id]}
                                <div
                                  class="d-flex justify-content-end align-items-center my-2"
                                >
                                  <button
                                    class="btn btn-white btn-sm"
                                    style="font-size:12px"
                                    on:click={() =>
                                      (isEditing[document.id] = false)}
                                    >Cancel</button
                                  >
                                  <button
                                    class="btn btn-success mx-2 btn-sm"
                                    style="font-size:12px"
                                    on:click={() =>
                                      handleUpdateDocument(document)}
                                    >Update</button
                                  >
                                </div>
                              {/if}
                            {/each}
                          {:else if paginatedDocuments.length > 0}
                            {#each paginatedDocuments as document}
                              <div
                                class="document border ps-4 py-3 mb-2 position-relative"
                              >
                                {#each Object.entries(document) as [key, value]}
                                  <div
                                    class=""
                                    style="font-size: 11px;"
                                    contenteditable={isEditing[document.id]
                                      ? "true"
                                      : "false"}
                                  >
                                    <span class="key">{key}:</span
                                    >&nbsp;&nbsp;&nbsp;
                                    <span
                                      style={key === "id"
                                        ? "color:#e72b2b;"
                                        : ""}
                                      class="value"
                                    >
                                      {#if typeof value === "string"}
                                        "{value}"
                                      {:else if Array.isArray(value)}
                                        <span>
                                          [{value.length}]
                                          <i
                                            class="fa-solid fa-caret-down text-secondary"
                                            style="cursor: pointer;"
                                            on:click={() =>
                                              toggleArrayVisibility(
                                                document.id,
                                                key
                                              )}
                                          ></i>
                                        </span>
                                        {#if arrayVisibility[document.id + key]}
                                          <div style="margin-left: 20px;">
                                            {#each value as item, index}
                                              <div class="mb-2">
                                                {#if typeof item === "object"}
                                                  <div
                                                    class="mb-1 text-secondary"
                                                  >
                                                    <span
                                                      class="text-dark font600"
                                                      >{index} :
                                                    </span> Object
                                                  </div>
                                                  {#each Object.entries(item) as [itemKey, itemValue]}
                                                    <div
                                                      class=""
                                                      style="margin-left:20px"
                                                    >
                                                      <span class="key"
                                                        >{itemKey}:</span
                                                      >&nbsp;&nbsp;&nbsp;
                                                      <span
                                                        style={itemKey === "id"
                                                          ? "color:#e72b2b;"
                                                          : ""}
                                                        class="value"
                                                        >{itemValue}</span
                                                      >
                                                    </div>
                                                  {/each}
                                                {:else}
                                                  {item}
                                                {/if}
                                              </div>
                                            {/each}
                                          </div>
                                        {/if}
                                      {:else}
                                        {value}
                                      {/if}
                                    </span>
                                  </div>
                                  <div
                                    class="d-flex gap-2 align-items-center position-absolute"
                                    style="font-size:12px;right:2%;top:28%;cursor:pointer"
                                  >
                                    <i
                                      class="fa-solid fa-pen border p-1"
                                      on:click={() =>
                                        handleEditJsonDocument(document)}
                                    ></i>
                                    <i
                                      class="fa-solid fa-copy border p-1"
                                      on:click={() =>
                                        handleCopyJsonDocument(document)}
                                    ></i>
                                    <i
                                      class="fa-solid fa-trash border p-1"
                                      on:click={() =>
                                        handleDeleteDocument(document)}
                                    ></i>
                                  </div>
                                {/each}
                              </div>
                              {#if isEditing[document.id]}
                                <div
                                  class="d-flex justify-content-end align-items-center my-2"
                                >
                                  <button
                                    class="btn btn-white btn-sm"
                                    style="font-size:12px"
                                    on:click={() =>
                                      (isEditing[document.id] = false)}
                                    >Cancel</button
                                  >
                                  <button
                                    class="btn btn-success mx-2 btn-sm"
                                    style="font-size:12px"
                                    on:click={() =>
                                      handleUpdateDocument(document)}
                                    >Update</button
                                  >
                                </div>
                              {/if}
                            {/each}
                            {#if tab.documents.length > 0}
                              {#if tab.documents.length > 5}
                                <!-- Pagination -->
                                <ul
                                  class="pagination justify-content-center mb-3"
                                >
                                  {#each Array.from( { length: Math.ceil(tab.documents.length / 5) } ) as _, pageIndex}
                                    <li class="page-item">
                                      <button
                                        class="page-link"
                                        on:click={() =>
                                          setCurrentPage(pageIndex + 1)}
                                        aria-label={"Page " + (pageIndex + 1)}
                                      >
                                        {pageIndex + 1}
                                      </button>
                                    </li>
                                  {/each}
                                </ul>
                              {/if}
                            {/if}
                          {:else}
                            <div
                              class="text-center mt-3"
                              style="font-size: 13px;"
                            >
                              There is no collection data
                            </div>
                          {/if}
                        </div>
                      </div>

                      <input
                        type="radio"
                        name="my_tabs_2"
                        role="tab"
                        class="tab hover:text-green-700 text-gray-500 bg-gray-50 checked:bg-checked-white font-medium checked:text-checked-green checked:font-semibold"
                        aria-label="Aggregations"
                      />
                      <div
                        role="tabpanel"
                        class="tab-content bg-base-100 border-base-300 rounded-box p-6 sm:p-3 overflow-hidden"
                      >
                        <div class="border p-2">
                          <div
                            class="d-flex justify-content-between align-items-center"
                          >
                            <div class="d-flex gap-2 align-items-center">
                              <span
                                class="text-dark font600"
                                style="font-size: 13px;">Pipeline</span
                              >
                              <i class="fa-solid fa-folder dropdown-toggle"></i>
                              {#if runstage}
                                <button
                                  class="btn btn-info btn-sm"
                                  style="font-size:12px"
                                >
                                  $addFields</button
                                >

                                <button
                                  on:click={() => (runstage = false)}
                                  class="btn btn-secondary btn-sm"
                                  style="font-size:12px"
                                  ><i class="fa-solid fa-pen"></i>&nbsp; Edit</button
                                >
                              {:else}
                                <span
                                  style="font-size: 13px;"
                                  class="text-secondary sm:hidden"
                                  >Your pipeline is currently empty. Need help
                                  getting started?</span
                                >{/if}
                            </div>
                            <div class="d-flex gap-2 align-items-center">
                              <button
                                class="btn-light btn py-1 btn-sm sm:text-xs"
                                >Explain</button
                              >
                              <button
                                class="btn-secondary btn py-1 btn-sm sm:text-xs"
                                >Export</button
                              >
                              <button
                                on:click={runStages}
                                class="btn-success btn py-1 btn-sm sm:text-xs"
                                >Run</button
                              >
                              <button
                                on:click={showOptions}
                                class="btn-white text-primary btn py-1 btn-sm dropdown-toggle sm:text-xs"
                                >Options
                              </button>
                            </div>
                          </div>
                          {#if showoptions}
                            <div class="showoptions mt-2">
                              <div class="d-flex gap-3 align-items-center">
                                <label
                                  for=""
                                  class="font600"
                                  style="font-size: 13px;">Project</label
                                >
                                <input
                                  type="text"
                                  style="font-size: 12px;"
                                  class="form-control py-1 px-2 border-0 bg-light"
                                  placeholder="( field : 0 )"
                                />
                              </div>
                              <div
                                class="d-flex justify-content-between align-items-center mt-2"
                              >
                                <div class="d-flex gap-3 align-items-center">
                                  <label
                                    for=""
                                    class="font600"
                                    style="font-size: 13px;">Sort</label
                                  >
                                  <input
                                    type="text"
                                    style="font-size: 12px;"
                                    class="form-control py-1 px-2 border-0 bg-light"
                                    placeholder="( field : -1 ) or [['field':-1]]"
                                  />
                                </div>
                                <div class="d-flex gap-2 align-items-center">
                                  <label
                                    for=""
                                    class="font600"
                                    style="font-size: 13px;">MaxTimeMS</label
                                  >
                                  <input
                                    type="text"
                                    style="font-size: 12px;"
                                    class="form-control py-1 px-2 border-0 bg-light"
                                    placeholder="60000"
                                  />
                                </div>
                              </div>
                              <div
                                class="d-flex justify-content-between align-items-center mt-2"
                              >
                                <div class="d-flex gap-3 align-items-center">
                                  <label
                                    for=""
                                    class="font600"
                                    style="font-size: 13px;">Collation</label
                                  >
                                  <input
                                    type="text"
                                    style="font-size: 12px;"
                                    class="form-control py-1 px-2 border-0 bg-light"
                                    placeholder="( locale : 'simple' )"
                                  />
                                </div>
                                <div class="d-flex gap-2 align-items-center">
                                  <div class="d-flex gap-2 align-items-center">
                                    <label
                                      for=""
                                      class="font600"
                                      style="font-size: 13px;">Skip</label
                                    >
                                    <input
                                      type="text"
                                      style="font-size: 12px;"
                                      class="form-control py-1 px-2 border-0 bg-light"
                                      placeholder="0"
                                    />
                                  </div>
                                  <div class="d-flex gap-2 align-items-center">
                                    <label
                                      for=""
                                      class="font600"
                                      style="font-size: 13px;">Limit</label
                                    >
                                    <input
                                      type="text"
                                      style="font-size: 12px;"
                                      class="form-control py-1 px-2 border-0 bg-light"
                                      placeholder="0"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          {/if}
                        </div>
                        {#if runstage}
                          <div
                            class="mt-3 d-flex justify-content-between align-items-center"
                          >
                            <span class="font600" style="font-size: 13px;"
                              >ALL REUSLTS</span
                            >
                            <span class="font500" style="font-size: 13px;"
                              >Showing 1 - {updatedStageData.length}</span
                            >
                          </div>
                          <div class="mt-3">
                            {#if updatedStageData.length > 0}
                              {#each updatedStageData as document}
                                <div class="border p-2 shadow-sm mb-2">
                                  <div class="document ps-3 py-3 mb-2">
                                    {#each Object.entries(document) as [key, value]}
                                      <div class="" style="font-size: 11px;">
                                        <span class="key">{key}:</span
                                        >&nbsp;&nbsp;&nbsp;
                                        <span
                                          style={key === "id"
                                            ? "color:#e72b2b;"
                                            : ""}
                                          class="value">{value}</span
                                        >
                                      </div>
                                    {/each}
                                  </div>
                                </div>
                              {/each}
                            {:else}
                              <div
                                class="mt-5 text-center"
                                style="font-size: 12px;"
                              >
                                No Preview Documents
                              </div>
                            {/if}
                          </div>
                        {:else}
                          <div
                            class="px-2 py-2 sm:px-1 mt-2 d-flex gap-2 align-items-center"
                          >
                            <button
                              class="btn-white text-secondary btn py-1 btn-sm sm:text-xs sm:px-1"
                              >Untitled</button
                            >
                            <button
                              class="btn-success btn py-1 sm:px-1 btn-sm dropdown-toggle sm:text-xs"
                              >Save</button
                            >
                            <button
                              class="btn-success btn py-1 btn-sm sm:text-xs"
                              ><i class="fa-solid fa-plus"></i>&nbsp;Create New</button
                            >
                            <button
                              class="btn-outline-success btn py-1 btn-sm font500 sm:text-xs"
                              ><i class="fa-solid fa-code"></i>&nbsp;EXPORT TO
                              LANGUAGE</button
                            >
                          </div>

                          <div class="mt-2 border">
                            <div
                              class="p-2 border-bottom ps-3"
                              style="font-size: 12px;"
                            >
                              <span class="font600">{tab.documents.length}</span
                              > Documents in this collection
                            </div>
                            <div>
                              <span style="font-size: 12px;" class="ps-3 pt-2"
                                >Preview of documents</span
                              >
                            </div>
                            <div
                              class="d-flex gap-2 ps-3 mt-2 mb-3"
                              style="overflow: auto;"
                            >
                              {#if tab.documents.length > 0}
                                {#each tab.documents as document}
                                  <div class="border p-2 shadow-sm">
                                    <div class="document ps-3 py-3 mb-2">
                                      {#each Object.entries(document) as [key, value]}
                                        <div class="" style="font-size: 11px;">
                                          <span class="key">{key}:</span
                                          >&nbsp;&nbsp;&nbsp;
                                          <span
                                            style={key === "id"
                                              ? "color:#e72b2b;"
                                              : ""}
                                            class="value">{value}</span
                                          >
                                        </div>
                                      {/each}
                                    </div>
                                  </div>
                                {/each}
                              {:else}
                                <div
                                  class="text-center mt-3 font500"
                                  style="font-size: 13px;margin:0 auto"
                                >
                                  There is no documents....
                                </div>
                              {/if}
                            </div>
                          </div>

                          {#if showstagebox}
                            <div class="my-2 text-center">
                              <i
                                style="cursor:pointer"
                                class="fa-solid fa-circle-plus"
                                on:click={showMoreStages}
                              ></i>
                            </div>
                            <div class="mt-3 border mb-3">
                              <div
                                class="border-bottom p-2 d-flex justify-content-between align-items-center"
                              >
                                <div
                                  class="d-flex gap-2 align-items-center w-100"
                                  style="font-size:12px"
                                >
                                  <div>Stage 1</div>
                                  <select
                                    name=""
                                    id=""
                                    class="form-control py-0 px-1 w-auto"
                                    style="font-size:12px"
                                  >
                                    <option value="$addFields"
                                      >$addFields</option
                                    >
                                    <option value="$count">$count</option>
                                  </select>
                                </div>
                                <div>
                                  <i class="fa-solid fa-ellipsis"></i>
                                </div>
                              </div>
                              <div class="row">
                                <div class="col-lg-5">
                                  <textarea
                                    name=""
                                    class="p-1"
                                    id=""
                                    bind:value={newField}
                                    on:keypress={(event) =>
                                      handleKeyPress(event, tab)}
                                    placeholder="Enter field and value in the format: field: 'value'"
                                    style="width: 100%;height:29vh;border:0;outline:0;font-size:12px"
                                  ></textarea>
                                </div>
                                <div class="col-lg-7" style="">
                                  <div
                                    class="mt-2 ms-2"
                                    style="font-size: 12px;"
                                  >
                                    Output after <span class="text-primary"
                                      >$addFields</span
                                    >
                                    stage (Sample of {updatedStageData.length} documents)
                                  </div>
                                  <div style="overflow: auto;height:25vh">
                                    {#if updatedStageData.length > 0}
                                      {#each updatedStageData as document}
                                        <div class="border p-2 shadow-sm">
                                          <div class="document ps-3 py-3 mb-2">
                                            {#each Object.entries(document) as [key, value]}
                                              <div
                                                class=""
                                                style="font-size: 11px;"
                                              >
                                                <span class="key">{key}:</span
                                                >&nbsp;&nbsp;&nbsp;
                                                <span
                                                  style={key === "id"
                                                    ? "color:#e72b2b;"
                                                    : ""}
                                                  class="value">{value}</span
                                                >
                                              </div>
                                            {/each}
                                          </div>
                                        </div>
                                      {/each}
                                    {:else}
                                      <div
                                        class="mt-5 text-center"
                                        style="font-size: 12px;"
                                      >
                                        No Preview Documents
                                      </div>
                                    {/if}
                                  </div>
                                </div>
                              </div>
                            </div>
                          {:else}
                            <div class="mt-4 d-flex justify-content-center">
                              <button
                                class="btn btn-success btn-sm"
                                on:click={showAddStageBox}
                                ><i class="fa-solid fa-plus"></i>&nbsp; Add
                                Stage</button
                              >
                            </div>
                          {/if}
                        {/if}
                      </div>
                      <input
                        type="radio"
                        name="my_tabs_2"
                        role="tab"
                        class="tab hover:text-green-700 text-gray-500 bg-gray-50 checked:bg-checked-white font-medium checked:text-checked-green checked:font-semibold"
                        aria-label="Schema"
                      />
                      <div
                        role="tabpanel"
                        class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                      >
                        <div class="border p-2">
                          <div class="d-flex gap-2 align-items-center">
                            <span class="text-primary" style="font-size: 13px;"
                              >Filter</span
                            >
                            <input
                              type="text"
                              style="font-size: 12px;"
                              class="form-control py-1 px-2 border-0"
                              placeholder="Type a query: ( field : 'value' )"
                              bind:value={query}
                            />

                            <button
                              on:click={resetData}
                              class="btn-secondary btn py-1 btn-sm"
                              style="font-size: 13px;">Reset</button
                            >
                            <button
                              on:click={() => analyzeDocuments(tab)}
                              class="btn-success btn py-1 btn-sm"
                              style="font-size: 13px;">Analyze</button
                            >
                            <button
                              class="btn-success btn py-1 btn-sm"
                              style="font-size: 13px;"
                              ><i class="fa-solid fa-code"></i></button
                            >

                            <button
                              on:click={showOptions}
                              class="btn-white text-primary btn py-1 btn-sm dropdown-toggle"
                              style="font-size: 13px;"
                              >Options
                            </button>
                          </div>
                          {#if showoptions}
                            <div class="showoptions mt-2">
                              <div class="d-flex gap-3 align-items-center">
                                <label
                                  for=""
                                  class="font600"
                                  style="font-size: 13px;">Project</label
                                >
                                <input
                                  type="text"
                                  style="font-size: 12px;"
                                  class="form-control py-1 px-2 border-0 bg-light"
                                  placeholder="( field : 0 )"
                                />
                              </div>
                              <div
                                class="d-flex justify-content-between align-items-center mt-2"
                              >
                                <div class="d-flex gap-3 align-items-center">
                                  <label
                                    for=""
                                    class="font600"
                                    style="font-size: 13px;">Sort</label
                                  >
                                  <input
                                    type="text"
                                    style="font-size: 12px;"
                                    class="form-control py-1 px-2 border-0 bg-light"
                                    placeholder="( field : -1 ) or [['field':-1]]"
                                  />
                                </div>
                                <div class="d-flex gap-2 align-items-center">
                                  <label
                                    for=""
                                    class="font600"
                                    style="font-size: 13px;">MaxTimeMS</label
                                  >
                                  <input
                                    type="text"
                                    style="font-size: 12px;"
                                    class="form-control py-1 px-2 border-0 bg-light"
                                    placeholder="60000"
                                  />
                                </div>
                              </div>
                              <div
                                class="d-flex justify-content-between align-items-center mt-2"
                              >
                                <div class="d-flex gap-3 align-items-center">
                                  <label
                                    for=""
                                    class="font600"
                                    style="font-size: 13px;">Collation</label
                                  >
                                  <input
                                    type="text"
                                    style="font-size: 12px;"
                                    class="form-control py-1 px-2 border-0 bg-light"
                                    placeholder="( locale : 'simple' )"
                                  />
                                </div>
                                <div class="d-flex gap-2 align-items-center">
                                  <div class="d-flex gap-2 align-items-center">
                                    <label
                                      for=""
                                      class="font600"
                                      style="font-size: 13px;">Skip</label
                                    >
                                    <input
                                      type="text"
                                      style="font-size: 12px;"
                                      class="form-control py-1 px-2 border-0 bg-light"
                                      placeholder="0"
                                    />
                                  </div>
                                  <div class="d-flex gap-2 align-items-center">
                                    <label
                                      for=""
                                      class="font600"
                                      style="font-size: 13px;">Limit</label
                                    >
                                    <input
                                      type="text"
                                      style="font-size: 12px;"
                                      class="form-control py-1 px-2 border-0 bg-light"
                                      placeholder="0"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          {/if}
                        </div>

                        <div class="mt-3">
                          <div class="table-responsive">
                            <table class="table table-hover">
                              <thead class="table">
                                <tr
                                  style="font-size:12px"
                                  class="text-secondary"
                                >
                                  <th>Field Name</th>
                                  <th>Type</th>
                                  <th>Sample Value(s)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {#each Object.entries(schema) as [fieldName, fieldDetails]}
                                  <tr style="font-size:11px;cursor:pointer">
                                    <td class="font600 border-end">
                                      {#if Object.keys(fieldDetails.fields).length > 0}
                                        <i
                                          class="fa-solid fa-caret-down"
                                          on:click={() =>
                                            showAnalyzeArrayDetails(fieldName)}
                                          style="font-size:11px;cursor:pointer"
                                        ></i>
                                        &nbsp;{fieldName}
                                      {:else}
                                        {fieldName}
                                      {/if}
                                    </td>
                                    <td class="border-end">
                                      <select
                                        style="font-size:11px"
                                        class="border-0 form-control py-1 px-1 bg-light"
                                        value={Array.from(
                                          fieldDetails.types
                                        ).join(", ")}
                                        on:change={() =>
                                          changeDataType(
                                            fieldName,
                                            Array.from(fieldDetails.types).join(
                                              ", "
                                            ),
                                            event.target.value
                                          )}
                                      >
                                        <option value="string">String</option>
                                        <option value="number">Number</option>
                                        <option value="boolean">Boolean</option>
                                        <option value="array">Array</option>
                                        <option value="null">Null</option>

                                        <!-- Add more data types as needed -->
                                      </select>
                                      <!-- {Array.from(fieldDetails.types).join(
                                        ", "
                                      )} -->
                                    </td>
                                    <td>
                                      {#if Object.keys(fieldDetails.fields).length > 0}
                                        <span class="mx-2">
                                          Array of documents with {Object.keys(
                                            fieldDetails.fields
                                          ).length} nested fields.
                                        </span>
                                      {:else}
                                        {#each fieldDetails.sampleValues as sampleValue, index}
                                          <span
                                            class="mx-2 text-truncate border py-1 px-1"
                                            style="background-color:#f4f5f7"
                                          >
                                            {sampleValue}
                                          </span>
                                        {/each}
                                        <div
                                          style="font-size:9px"
                                          class="mt-1 px-2"
                                        >
                                          {Array.from(fieldDetails.types).join(
                                            ", "
                                          )}
                                        </div>
                                      {/if}
                                    </td>
                                  </tr>
                                  {#if analyzeArrayDetails[fieldName]}
                                    {#each Object.entries(fieldDetails.fields) as [subfieldName, subfieldDetails]}
                                      <tr
                                        class="table-secondary"
                                        style="font-size:11px;cursor:pointer"
                                      >
                                        <td class="font600 border-end">
                                          {#if Object.keys(subfieldDetails.fields).length > 0}
                                            <i
                                              class="fa-solid fa-caret-down"
                                              on:click={() =>
                                                showAnalyzeArrayDetails(
                                                  `${fieldName}.${subfieldName}`
                                                )}
                                              style="font-size:11px;cursor:pointer"
                                            ></i>
                                            &nbsp;{subfieldName}
                                          {:else}
                                            {subfieldName}
                                          {/if}
                                        </td>
                                        <td class="border-end">
                                          <select
                                            style="font-size:11px"
                                            class="border-0 form-control py-1 px-1 bg-light"
                                            value={Array.from(
                                              subfieldDetails.types
                                            ).join(", ")}
                                            on:change={() =>
                                              changeDataType(
                                                subfieldName,
                                                Array.from(
                                                  subfieldDetails.types
                                                ).join(", "),
                                                event.target.value
                                              )}
                                          >
                                            <option value="string"
                                              >String</option
                                            >
                                            <option value="number"
                                              >Number</option
                                            >
                                            <option value="boolean"
                                              >Boolean</option
                                            >
                                            <option value="array">Array</option>
                                            <option value="null">Null</option>

                                            <!-- Add more data types as needed -->
                                          </select>
                                        </td>
                                        <td>
                                          {#if Array.from(subfieldDetails.types).join(", ") === "null"}{:else if Object.keys(subfieldDetails.fields).length > 0}
                                            <span class="mx-2">
                                              Array of documents with {Object.keys(
                                                subfieldDetails.fields
                                              ).length} nested fields.
                                            </span>
                                          {:else}
                                            {#each subfieldDetails.sampleValues as sampleValue, index}
                                              <span
                                                class="mx-2 text-truncate border py-1 px-1"
                                                style="background-color:#f4f5f7"
                                              >
                                                {sampleValue}
                                              </span>
                                            {/each}
                                          {/if}
                                        </td>
                                      </tr>
                                    {/each}
                                  {/if}
                                {/each}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="my_tabs_2"
                        role="tab"
                        class="tab hover:text-green-700 text-gray-500 bg-gray-50 checked:bg-checked-white font-medium checked:text-checked-green checked:font-semibold"
                        aria-label="Indexes"
                      />
                      <div
                        role="tabpanel"
                        class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                      >
                        <div
                          class="d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <button
                              on:click={handleCreateIndex}
                              class="btn btn-success btn-sm"
                              >Create Index
                            </button>
                            <button class="btn btn-light btn-sm"
                              ><i class="fa-solid fa-arrows-rotate"></i>&nbsp;
                              Refresh
                            </button>
                          </div>
                        </div>
                        <div class="mt-3 border p-3">
                          <div class="table-responsive w-100">
                            <table class="table w-100">
                              <thead>
                                <tr style="font-size:12px">
                                  <th>Name and Definition</th>
                                  <th>Type</th>
                                  <th>Size</th>
                                  <th>Usage</th>
                                  <th>Properties</th>
                                </tr>
                              </thead>
                              <tbody>
                                {#each indexes as index, indexKey (index)}
                                  <tr style="font-size: 12px;">
                                    <td> {index.name} </td>
                                    <td class=""
                                      ><span
                                        class="text-white bg-dark py-1 px-2 rounded"
                                        >{index.type}
                                        <i class="fa-solid fa-circle-info"></i>
                                      </span>
                                    </td>
                                    <td>{index.size}</td>
                                    <td> {index.usage} </td>
                                    <td class=""
                                      ><span
                                        class="text-white bg-dark py-1 px-2 rounded"
                                      >
                                        {#if index.name.length > 1}
                                          Compound
                                        {:else}
                                          Unique
                                        {/if}

                                        <i class="fa-solid fa-circle-info"></i>
                                      </span>
                                    </td>
                                    <td>
                                      <i
                                        class="fa-solid fa-minus text-danger font600"
                                        style="font-size:12px;cursor:pointer"
                                        on:click={() => removeIndex(indexKey)}
                                      ></i>
                                    </td>
                                  </tr>
                                {/each}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {#if createIndex}
                          <div
                            class="shadow rounded-lg p-2"
                            style="position:absolute;top:32%;left:33%;z-index:99999;width:43vw;background-color:#fff;border-radius:12px"
                          >
                            <div class="mx-2 py-2 text-end">
                              <i
                                class="fa-solid fa-times"
                                style="font-size:13px;cursor:pointer"
                                on:click={() => (createIndex = false)}
                              ></i>
                            </div>
                            <div class="p-2">
                              <h4>Create Index</h4>
                              <span style="font-size:13px"
                                >{tab.databaseName}.{tab.name}</span
                              >

                              <div class="my-3">
                                {#each rows as row, index}
                                  <div
                                    class="d-flex gap-2 align-items-center my-2"
                                  >
                                    <select
                                      name=""
                                      id=""
                                      class="form-control"
                                      style="font-size:12px"
                                      bind:value={row.newIndexName}
                                    >
                                      {#each Object.entries(tab.documents[0]) as [key, value]}
                                        <option value={key}>{key}</option>
                                        {#if Array.isArray(value)}
                                          {#each Object.entries(value[0]) as [subKey, subValue]}
                                            <option value={subKey}
                                              >{key}.{subKey}</option
                                            >
                                          {/each}
                                        {/if}
                                      {/each}
                                    </select>&nbsp;
                                    <select
                                      name=""
                                      id=""
                                      class="form-control"
                                      bind:value={row.newIndexType}
                                      style="font-size:12px"
                                    >
                                      <option value="1">1(asc)</option>
                                      <option value="-1">1(desc)</option>
                                      <option value="2dsphere">2dsphere</option>
                                      <option value="text">text</option>
                                    </select>&nbsp;
                                    {#if index === 0}
                                      <i
                                        on:click={() => addIndexRow(index)}
                                        class="fa-solid fa-plus text-secondary font600"
                                        style="font-size:12px;cursor:pointer"
                                      ></i>
                                      <i
                                        on:click={() => removeIndexRow(index)}
                                        class="fa-solid fa-minus text-danger ms-2 font600"
                                        style="font-size:12px;cursor:pointer"
                                      ></i>
                                    {:else}
                                      <i
                                        on:click={() => addIndexRow(index)}
                                        class="fa-solid fa-plus text-secondary font600"
                                        style="font-size:12px;cursor:pointer"
                                      ></i>
                                      <i
                                        on:click={() => removeIndexRow(index)}
                                        class="fa-solid fa-minus text-danger ms-2 font600"
                                        style="font-size:12px;cursor:pointer"
                                      ></i>
                                    {/if}
                                  </div>
                                {/each}
                                <div class="text-end mb-2 mt-3">
                                  <button
                                    on:click={() => (createIndex = false)}
                                    class="btn btn-outline-secondary btn-sm"
                                    style="font-size:12px">Cancel</button
                                  >
                                  <button
                                    on:click={createIndexFunction}
                                    class="btn btn-success btn-sm mx-2"
                                    style="font-size:12px">Create Index</button
                                  >
                                </div>
                              </div>
                            </div>
                          </div>
                        {/if}
                      </div>

                      <input
                        type="radio"
                        name="my_tabs_2"
                        role="tab"
                        class="tab hover:text-green-700 text-gray-500 bg-gray-50 checked:bg-checked-white font-medium checked:text-checked-green checked:font-semibold"
                        aria-label="Validation"
                      />
                      <div
                        role="tabpanel"
                        class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                      >
                        {#if showRule}
                          <div class="mt-2 border p-2">
                            <div class="d-flex gap-2 align-items-center">
                              <div class="d-flex gap-1 align-items-center">
                                <div class="font500" style="font-size:12px">
                                  Validation Action&nbsp; <i
                                    class="fa-solid fa-circle-info"
                                    style="font-size:11px"
                                  ></i>
                                </div>
                                <select
                                  class="form-control py-1 px-1"
                                  style="font-size:13px"
                                  bind:value={validationAction}
                                >
                                  <option value="Warning"> Warning </option>
                                  <option value="Error"> Error </option>
                                </select>
                              </div>
                              <div class="d-flex gap-1 align-items-center">
                                <div style="font-size:12px" class="font500">
                                  Validation Level&nbsp; <i
                                    class="fa-solid fa-circle-info"
                                    style="font-size:11px"
                                  ></i>
                                </div>
                                <select
                                  class="form-control py-1 px-1"
                                  style="font-size:13px"
                                  bind:value={validationLevel}
                                >
                                  <option value="Off"> Off </option>
                                  <option value="Moderate"> Moderate </option>
                                  <option value="Strict"> Strict </option>
                                </select>
                              </div>
                            </div>
                            <div class="mt-2">
                              <textarea
                                bind:value={validationRules}
                                class="form-control"
                                style="width:100%;height:28vh;border:0;outline:0;background-color:#f4f5f7;font-size:12px"
                              />
                              <div class="mt-2 text-end">
                                <button
                                  class="btn btn-outline-secondary btn-sm"
                                  style="font-size:12px">Cancel</button
                                >
                                <button
                                  on:click={() =>
                                    updateValidation(tab.documents)}
                                  class="btn btn-primary btn-sm"
                                  style="font-size:12px">Update</button
                                >
                              </div>
                            </div>
                            <div class="mt-3">
                              <h6>Sample documents</h6>
                              <div class="row mt-1">
                                <div class="col-lg-6">
                                  <div
                                    class="text-success"
                                    style="font-size:13px"
                                  >
                                    <i class="fa-solid fa-circle-check"
                                    ></i>&nbsp; Passed Validation
                                  </div>
                                  <div
                                    class="border p-2 my-2"
                                    style="font-size:12px;height:38vh;max-height:100vh;border-radius:12px;margin-right:5px;overflow:auto"
                                  >
                                    {#each passedDocuments as value}
                                      <div class="mb-3">
                                        <JSONTree
                                          {value}
                                          defaultExpandedLevel={1}
                                          shouldShowPreview={false}
                                        />
                                      </div>
                                    {/each}
                                  </div>
                                </div>
                                <div class="col-lg-6">
                                  <div
                                    class="text-danger"
                                    style="font-size:13px"
                                  >
                                    <i class="fa-solid fa-circle-check"
                                    ></i>&nbsp;Failed Validation
                                  </div>
                                  <div
                                    class="border p-2 my-2"
                                    style="font-size:12px;height:38vh;max-height:100vh;border-radius:12px;overflow:auto"
                                  >
                                    {#each failedDocuments as value}
                                      <div class="mb-3">
                                        <JSONTree
                                          {value}
                                          defaultExpandedLevel={2}
                                          shouldShowPreview={false}
                                        />
                                      </div>
                                    {/each}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        {:else}
                          <div class="d-flex align-items-center flex-column">
                            <i
                              class="fa-solid mt-3 fa-file-code"
                              style="font-size:30px"
                            ></i>
                            <h6 class="font600 mt-2 text-success">
                              Add validation rules
                            </h6>
                            <span class="mt-2 text-center"
                              >Create rules to enforce data structure of
                              documents on updates and inserts.</span
                            >
                            <button
                              on:click={handleShowRule}
                              class="btn btn-success btn-sm mt-3"
                              style="font-size: 13px;"
                              >Add Rule
                            </button>
                          </div>
                        {/if}
                      </div>
                      <!-- tabs end -->
                    </div>
                  </div>
                </div>
              {/if}
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .multicolortext {
    background-image: linear-gradient(to left, violet, indigo, green, blue);
    -webkit-background-clip: text;
    -moz-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .key {
    font-weight: 600;
    color: #333;
  }
  .value {
    color: green;
  }
  .row,
  .container-fluid {
    --bs-gutter-x: 0rem;
  }
  button:focus,
  input:focus,
  select:focus,
  textarea:focus {
    box-shadow: none;
  }
  .hoverlist {
    cursor: pointer;
  }
  .hoverlist:hover {
    background-color: #fafafa;
  }
  .font600 {
    font-weight: 600;
  }

  .font500 {
    font-weight: 600;
  }
  .tab a.active {
    color: #004eff !important;
    font-weight: 600 !important;
  }
  .buttonactive button.active {
    color: #fff;
    background-color: #333;
  }
  .tab.active {
    background-color: #fff !important;
  }
  .queryTabs .nav-item .active {
    border-bottom: 4px solid green;
  }
  .queryTabs .nav-item .active h6 {
    color: green;
  }
  .borderafter::after {
    content: "";
    position: absolute;
    max-width: 100vw;
    left: 0%;
    height: 3px;
    width: 100%;
    top: 95%;
    color: green;
    border-bottom: 2px solid green;
    transition: border-bottom 0.5s ease-in-out;
  }
  .accordion-button::after {
    height: 0.8rem !important;
    background-size: 0.8rem !important;
  }

  /* @media screen and (min-width:600px) and (max-width:1020px){
      .databaseMainSection{
        min-width:73vw;
      }   
      .databaseMenuCol{
        min-width:26vw;
      }
  } */
</style>

<script>
  import { fade, fly } from "svelte/transition";
  import { editorData } from "../../../apiData/global";
  import { ch } from "../../../apiData/global";
  import { repo } from "../../../apiData/global";
  import TreeView from "./treeView.svelte";
  import RepoBranchGraph from "./repoBranchGraph/repoBranchGraph.svelte";
  import Outline from "./outlineSection.svelte";
  import { onDestroy, onMount } from "svelte";
  import TestList from "./testList.svelte";
  import { problems } from "../../../apiData/problems";
  import DatabaseView from "../databaseView/databaseView.svelte";
  import LogView from "../logView/logView.svelte";
  import ApiView from "../apiView/apiView.svelte";
  import ServerView from "../serverView/serverView.svelte";
  import doCall from "../../../apiData/api";

  // import Message from "./Message.svelte";
  // import Timer from "./Timer.svelte";
  // import Calendar from "./Calendar.svelte";

  let repoContent = [...repo];
  let response = "";
  let info = [];
  let item = [];
  let tasks = [];
  let loginpopup = false;
  // Reactive variable to track the currently active div`
  let activeIndex = 1;
  let isFirstColContent = true;
  let isThirdColContent = true;
  let isSplitBox = false;
  let codeArea = false;
  let collectionList = false;
  let environmentSection = false;
  let isSplitMenu = false;
  let searchbox = false;
  let databaseView = false;
  let apiView = false;
  let logView = false;
  let serverView = false;
  let tasklistbox = false;
  let selectedExportOption = "Export";
  const numbers = [...Array(100).keys()].map((i) => i + 1);
  let isProblemBox = false;
  let isMessageBox = false;
  let showcalendar = false;
  let showTestBox = false;
  let activeTabIndex = 2;
  let selectedFile = "tab-1";
  let selectedFileOutline;
  // for third column
  let selectedFileForThirdCol = null;
  let tabSubName = "";
  let tabSubLevelName = "";
  let tabName = "";
  // edit new collection box
  let settingboxcollection = {};
  let settingboxrequest = {};
  let filteredItems = [...item]; //filter collection list
  // Define a reactive variable to track checkbox state
  let isChecked = false;
  let activeTab = "tabresult1"; // Set default active tab
  let performanceTab = false;
  let collectionsharebox = false;
  let showRunManually = false;
  let showScheduleRuns = false;
  let showAutomateCli = false;
  let showRunManuallySection = false;
  let showScheduleRunsSection = false;
  let showAutomateCliSection = false;
  let envValue = "";
  let iterations = "1";
  let showrundetails = {};
  let showrundetailsendToend = {};
  let resultEndToEnd = false;
  let resultEndToEndDetails = false;

  let activeSideMenuList = false;
  let openmenuSidebar = false;
  let openRightSidebar=false;

  // add to tab group
  let groupToAdd = "";

  let openTabGroup = {};

  let showTabInGroups = {};
  let nextTabId = 2; // Variable to keep track of the next tab id

  // Array to store tab groups
  let tabGroups = [];

  // resizing third column - right sidebar
  let isResizing = false;
  let startX;
  let startWidth;
  let isResizingLeftCol = false;
  let startXLeftCol;
  let startWidthLeftCol;


  // api call
 let doLocal = {
 }

 doLocal.apiCommit = async function(input){
    // get
  return data;
 }


//  api call for getting the json data
async function fetchData() {
  try {
    const response = await fetch("src/apiData/jsonServer/data.json"); // Adjust the path if necessary
    const data = await response.json();

    console.log(data,"api data loaded");

    // Extract info, item, and tasks from the JSON file
    info = data.info;
    item = data.item;
    tasks = data.tasks;
    
    filterItems(); // Call your filter function after data is fetched
  } catch (error) {
    console.error("Error fetching data from JSON file:", error);
  }
}

// Mock API call replaced with fetching data from data.json
onMount(() => {
  fetchData();
});




  function handleMouseDown(event) {
    isResizing = true;
    startX = event.clientX;
    const thirdCol = document.querySelector(".third-col");
    startWidth = thirdCol.offsetWidth;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseMove(event) {
    if (!isResizing) return;
    const thirdCol = document.querySelector(".third-col");
    let newWidth = startWidth - (event.clientX - startX);
    if (newWidth > 100) {
      // Minimum width
      thirdCol.style.width = `${newWidth}px`;
    }
  }

  function handleMouseUp() {
    isResizing = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }

  // left column resizing
  // resizing left file menu section - left menu
  function handleMouseDownLeft(event) {
    isResizingLeftCol = true;
    startXLeftCol = event.clientX;
    const middleCol = document.querySelector(".left-col");
    startWidthLeftCol = middleCol.offsetWidth;

    document.addEventListener("mousemove", handleMouseMoveLeftCol);
    document.addEventListener("mouseup", handleMouseUpLeftCol);
  }

  function handleMouseMoveLeftCol(event) {
    if (!isResizingLeftCol) return;
    const middleCol = document.querySelector(".left-col");
    let newWidth = startWidthLeftCol + (event.clientX - startXLeftCol);
    if (newWidth > 100) {
      // Minimum width
      middleCol.style.width = `${newWidth}px`;
    }
  }

  function handleMouseUpLeftCol() {
    isResizingLeftCol = false;
    document.removeEventListener("mousemove", handleMouseMoveLeftCol);
    document.removeEventListener("mouseup", handleMouseUpLeftCol);
  }

  // function to handle side menu list
  function openSideMenuList() {
    activeSideMenuList = !activeSideMenuList;
    isSplitMenu= false;
  }

  //open sidebar in mobile screen
  function openSidebar() {
    openmenuSidebar = !openmenuSidebar;
  }

   //open sidebar in mobile screen
   function handleRightSidebar() {
    openRightSidebar = !openRightSidebar;
  }

  function closeSidebar() {
    openmenuSidebar = false;
    activeSideMenuList = false;
  }

  // show the code area and splitmenu initially
  onMount(() => {
    codeArea = true;
    isSplitMenu = true;
    collectionList = false;
    isFirstColContent = false;
    isThirdColContent = false;
    environmentSection = false;
  });

  // function for handling the theme change
  const changeTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
  };

  // send request to backened, postman
  async function sendRequest(tabContent) {
    try {
      const requestBody = JSON.parse(tabContent.objDetails.requestBodyRaw);
      let requestOptions = {
        method: tabContent.objDetails.requestMethod,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (tabContent.objDetails.requestMethod === "POST") {
        requestOptions.body = JSON.stringify(requestBody);
      } else if (tabContent.objDetails.requestMethod === "GET") {
        console.log("Products fetched Successfully");
      } else if (tabContent.objDetails.requestMethod === "DELETE") {
        console.log("Deleted Successfully");
      } else {
        // Unsupported method
        throw new Error("Error in method");
      }

      const res = await fetch(
        tabContent.objDetails.requestUrlRaw,
        requestOptions
      );

      const data = await res.json();
      response = JSON.stringify(data, null, 2);
      console.log("Response data:", response);
      // Update the textarea with the response
      const responseTextarea = document.querySelector(
        '[data-testid="response"]'
      );
      responseTextarea.value = response;

      // execute tasks
      if (tabContent.event && tabContent) {
        tabContent.event.forEach((event) => {
          console.log("Found 'test' event:", event);
          if (event.listen === "test") {
            event.script.exec.forEach((scriptLine) => {
              console.log("Processing script line:", scriptLine);
              try {
                // Remove comments from the script line
                const scriptLineWithoutComments = scriptLine.replace(
                  /\/\/.*/,
                  ""
                );
                console.log(
                  "Script line without comments:",
                  scriptLineWithoutComments
                );

                // Parse the script line to extract the test name and function
                const testNameMatch =
                  scriptLineWithoutComments.match(/pm\.test\('([^']*)'/);
                const testFunctionMatch =
                  scriptLineWithoutComments.match(/{(.*)}/);
                console.log("Test name match:", testNameMatch);
                console.log("Test function match:", testFunctionMatch);

                // Check if both test name and function are matched
                if (testNameMatch && testFunctionMatch) {
                  const testName = testNameMatch[1];
                  console.log("Test name:", testName);

                  // Create a new function from the extracted function definition
                  const testFunctionStr = testFunctionMatch[1];
                  const testFunction = new Function(testFunctionStr);

                  // Execute the test function
                  const testResult = testFunction();
                  console.log("Test result:", testResult);

                  // Log test pass or fail
                  if (testResult) {
                    console.log("Test passed:", testName);
                  } else {
                    console.error("Test failed:", testName);
                  }
                }
              } catch (error) {
                console.error("Error executing script line:", error);
              }
            });
          }
        });
      }

      console.log(tabContent);
    } catch (error) {
      console.error(error);
      // response = "Error occurred while sending request";
      const responseTextarea = document.querySelector(
        '[data-testid="response"]'
      );
      responseTextarea.value = "Error occurred while sending request";
    }
  }

  // toggle third column - review column
  const toggleThirdCol = () => {
    isThirdColContent = !isThirdColContent;
  };

  // when page load then it hides split menu and show original layout

  // for splittting
  function splitbox() {
    codeArea = !codeArea;
    isSplitBox = !isSplitBox;
    isFirstColContent = false;
    isThirdColContent = false;
    isSplitMenu = true;
  }

  // Function to update the active index
  function handleClick(index) {
    activeIndex = index;
  }

  //  for toggleFirstCol
  function toggleFirstCol() {
    isFirstColContent = !isFirstColContent;
  }
  // for toggleCollectionList and close all the opened sections
  function toggleCollectionList() {
    handleClick(2);
    collectionList = !collectionList;
    isSplitMenu = false;
    environmentSection = false;
    apiView = false;
    databaseView = false;
    logView = false;
    serverView = false;
  }

  // for toggleMenuCol and close all the opened sections
  function toggleMenuCol() {
    handleClick(1);
    isSplitMenu = !isSplitMenu;
    collectionList = false;
    environmentSection = false;
    apiView = false;
    databaseView = false;
    logView = false;
  }

  // for toggleEnvironmentSection and close all the opened sections
  function toggleEnvironmentSection() {
    handleClick(3);
    environmentSection = !environmentSection;
    isSplitMenu = false;
    collectionList = false;
    apiView = false;
    databaseView = false;
    logView = false;
    serverView = false;
  }

  //search box
  function searchBox() {
    handleClick(4);
    // Your existing logic for searchBox
    searchbox = !searchbox;
    apiView = false;
    databaseView = false;
    tasklistbox = false;
    loginpopup = false;
    logView = false;
    serverView = false;
  }

  //for showing frontend View and close all the opened sections
  function handleFrontendView() {
    handleClick(5);
    logView = false;
  }

  //for showing backened View and close all the opened sections
  function handleBackenedView() {
    handleClick(6);
    logView = false;
  }
  // for api section and close all the opened sections
  function handleApiView() {
    handleClick(7);
    apiView = !apiView;
    databaseView = false;
    tasklistbox = false;
    loginpopup = false;
    logView = false;
    serverView = false;
  }

  //for showing database View
  function handleDatabaseView() {
    handleClick(8);
    databaseView = !databaseView;
    apiView = false;
    tasklistbox = false;
    loginpopup = false;
    logView = false;
    serverView = false;
  }

  //for showing log View
  function handleLogView() {
    handleClick(9);
    logView = !logView;
    databaseView = false;
    apiView = false;
    tasklistbox = false;
    loginpopup = false;
    serverView = false;
  }

  //for showing server View
  function handleServerView() {
    handleClick(10);
    serverView = !serverView;
    logView = false;
    databaseView = false;
    apiView = false;
    tasklistbox = false;
    loginpopup = false;
  }

 

  // function to handle export change whether it is postman or swagger
  const handleExportChange = () => {
    let exportedData;
    // Logic to handle export option change
    // Convert JSON data based on selected export option
    if (selectedExportOption === "Export as Postman") {
      // Convert to Postman format
      exportedData = convertToPostman(item);
    } else if (selectedExportOption === "Export as Swagger") {
      // Convert to Swagger format
      exportedData = convertToSwagger(item);
    } else if (selectedExportOption === "Export") {
      // No conversion needed for "Export" option
      exportedData = item; // Keep the original JSON data
    }

    // Create a Blob object containing the JSON data
    const blob = new Blob([JSON.stringify(exportedData, null, 2)], {
      type: "application/json",
    });

    // Create a temporary anchor element
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `api.${selectedExportOption.toLowerCase().replace(/\s+/g, "")}.json`; // Set the download filename
    document.body.appendChild(a);

    // Simulate click to trigger the download
    a.click();

    // Remove the temporary anchor element
    document.body.removeChild(a);
  };

  // for converting the data  to postman data format
  const convertToPostman = (data) => {
    // Conversion logic to Postman format
    const postmanItem = {
      info: {
        _postman_id: "12345678-1234-1234-1234-1234567890ab",
        name: "My API Collection",
        schema:
          "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
      },
      item: [], // Placeholder for Postman item array
    };

    // Loop through original item data to convert each endpoint
    data.forEach((apiCollection) => {
      apiCollection.item.forEach((apiEndpoint) => {
        const postmanEndpoint = {
          id: apiEndpoint.id,
          name: apiEndpoint.objDetails.name,
          request: {
            method: apiEndpoint.objDetails.requestMethod,
            header: apiEndpoint.requestHeader || [],
            auth: {
              type: apiEndpoint.objDetails.requestAuthType,
              basic: apiEndpoint.requestAuthBasic || [],
              apiKey: apiEndpoint.requestApiKey || [],
              bearerToken: apiEndpoint.requestBearerToken || [],
            },
            body: {
              mode: apiEndpoint.objDetails.requestBodyMode || "raw",
              raw: apiEndpoint.objDetails.requestBodyRaw || "",
              formData: apiEndpoint.requestBodyFormData || [],
              urlEncoded: apiEndpoint.requestUrlEncoded || [],
            },
            url: {
              raw: apiEndpoint.objDetails.requestUrlRaw,
              host: apiEndpoint.requestUrlHost
                ? apiEndpoint.requestUrlHost.join(".")
                : "",
              path: apiEndpoint.requestUrlPath
                ? apiEndpoint.requestUrlPath.join("/")
                : "",
              query: apiEndpoint.requestUrlQuery || [],
            },
          },
          response: apiEndpoint.response || [],
          event: apiEndpoint.event || [],
          examples: apiEndpoint.examples || [],
        };
        postmanItem.item.push(postmanEndpoint);
      });
    });

    return postmanItem;
  };

  // for converting the data  to swagger data format
  const convertToSwagger = (data) => {
    // Conversion logic to Swagger format
    const swaggerItem = {
      swagger: "2.0",
      info: {
        title: "My API Collection",
        version: "1.0.0",
        description: "Description of your API collection",
      },
      paths: {}, // Placeholder for Swagger paths object
      securityDefinitions: {
        // Define security definitions
        basicAuth: {
          type: "basic",
        },
        apiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "X-API-Key",
        },
        bearerAuth: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
        },
      },
      // Add other Swagger properties as needed
    };

    // Loop through original item data to convert each endpoint
    data.forEach((apiCollection) => {
      apiCollection.item.forEach((apiEndpoint) => {
        // Construct Swagger path object for the endpoint
        const swaggerPath = {
          [apiEndpoint.objDetails.requestUrlPath]: {
            [apiEndpoint.objDetails.requestMethod.toLowerCase()]: {
              summary: apiEndpoint.objDetails.name,
              // Add other properties as needed
              responses: {
                // Example response
                200: {
                  description: "Successful response",
                  // Add other response properties as needed
                },
              },
              // Add security if required
              security: apiEndpoint.requestAuthType
                ? [
                    {
                      [apiEndpoint.objDetails.requestAuthType]: [],
                    },
                  ]
                : [],
            },
          },
        };

        // Merge Swagger path object with existing paths
        Object.assign(swaggerItem.paths, swaggerPath);
      });
    });

    return swaggerItem;
  };

  // show message box
  const showMessageBox = () => {
    isMessageBox = !isMessageBox;
  };

  // show problem section
  const showProblemBox = () => {
    isProblemBox = !isProblemBox;
  };
  // close all  boxes
  const closeBox = () => {
    isProblemBox = false;
  };

  //show calendar
  const showCalendar = () => {
    showcalendar = !showcalendar;
  };

  // switch file tabs
  let fileContentRepo;
  function switchFile(id, file) {
    let newTab;
    fileContentRepo = file;  // Create a new object reference
    if (file) {
      selectedFileOutline = file;
      // new tab
      let newTabId = generateUniqueId();
      newTab = {
        id: newTabId,
        tabId: file.name,
        content: {
          id: file.id,
          name:file.name,
          type: file.type,
          status:file.status,
          code: file.code,
          docs: file.docs,
          path: file.path,
          schema: file.schema,
          logSchema: file.logSchema,
          allDocs: file.allDocs,
          example: file.example,
        },
      };
      console.log(newTab, "newTab");
      let files = editorData.files[0];

      files.tabs = [...files.tabs, newTab];
      editorData.files = [...editorData.files];
    }

    // Check if the tab is already open
    const isTabOpen = editorData.files.some((file) =>
      file.tabs.some((tab) => (tab.id === file ? newTab.id : id))
    );

    if (!isTabOpen) {
      // Find the file to which the new tab should be added
      let fileToAddTab = editorData.files.find((file) =>
        file.tabs.some((tab) => tab.id === selectedFile)
      );
    }

    selectedFile = file ? newTab.id : id;
    console.log(selectedFile, "selected file");
  }

  // add new tab
  function addNewTab() {
    // new tab
    let newTabId = generateUniqueId();
    const newTab = {
      id: newTabId,
      tabId: "New Tab",
      content: {
        type: "code",
      },
    };
    let files = editorData.files[0];

    files.tabs = [...files.tabs, newTab];
    switchFile(newTab.id);
    editorData.files = [...editorData.files];
  }

  // switch file tabs for review section
  function switchFile2(fileId) {
    // Check if the tab is already open
    const isTabOpen = editorData.reviewFiles.some((file) =>
      file.tabs.some((tab) => tab.id === fileId)
    );

    if (!isTabOpen) {
      // Find the file to which the new tab should be added
      let fileToAddTab = editorData.reviewFiles.find((file) =>
        file.tabs.some((tab) => tab.id === selectedFileForThirdCol)
      );
    }
    selectedFileForThirdCol = fileId;
  }

  // close tabs
  function closeTab(tabId) {
    const fileIndex = editorData.files.findIndex((file) =>
      file.tabs.some((tab) => tab.id === tabId)
    );
    const tabIndex = editorData.files[fileIndex].tabs.findIndex(
      (tab) => tab.id === tabId
    );

    editorData.files[fileIndex].tabs.splice(tabIndex, 1);

    if (selectedFile === tabId) {
      selectedFile = null;
    }
  }
  // close tabs for review section
  function closeTab2(tabId) {
    const fileIndex = editorData.reviewFiles.findIndex((file) =>
      file.tabs.some((tab) => tab.id === tabId)
    );
    const tabIndex = editorData.reviewFiles[fileIndex].tabs.findIndex(
      (tab) => tab.id === tabId
    );

    editorData.reviewFiles[fileIndex].tabs.splice(tabIndex, 1);

    if (selectedFileForThirdCol === tabId) {
      selectedFileForThirdCol = null;
    }
  }

  // run specific testcase
  function runSpecific(testId, tabId) {
    showTestBox = !showTestBox;
    editorData.splitViews = editorData.splitViews.map((view) => ({
      ...view,
      tabs: view.tabs.map((tab) => ({
        ...tab,
        content: {
          ...tab.content,
          tdd: tab.content.tdd.map((test) => ({
            ...test,
            showCheck: test.id === testId && tab.tabId === tabId,
          })),
        },
      })),
    }));
  }
  // run all test cases
  function runAll() {
    showTestBox = !showTestBox;
    editorData.splitViews = editorData.splitViews.map((view) => ({
      ...view,
      tabs: view.tabs.map((tab) => ({
        ...tab,
        content: {
          ...tab.content,
          tdd: tab.content.tdd.map((test) => ({
            ...test,
            showCheck: true,
          })),
        },
      })),
    }));
  }
  // search box

  function handleDragStart(event, subItem) {
    // Pass the subItem data to be transferred during drag
    event.dataTransfer.setData("text/plain", JSON.stringify(subItem));
  }

  function handleDragStartRe(event, tab) {
    event.dataTransfer.setData("text/plain", JSON.stringify(tab));
  }

  // handle drop in tabs
  function handleDrop(event) {
    // Prevent default behavior
    event.preventDefault();
    // if there is tabGroups then drop in tabGroups
    if (tabGroups.length > 0) {
    } else {
      // Extract necessary data from the dropped item
      const droppedItem = JSON.parse(event.dataTransfer.getData("text/plain"));
      console.log(droppedItem, "droppedItem newnews");
      const { name } = droppedItem;

      // Find the target tab based on the event target
      const targetTabId = event.target.getAttribute("data-tab-id");
      let targetFile = findTargetFile(targetTabId);

      // Generate a unique ID for the new tab
      const newTabId = generateUniqueId();

      // Create a new tab object
      const newTab = {
        id: newTabId,
        tabId: droppedItem.objDetails.name || droppedItem.tabId,
        content: {
          type: "Postman",
          objDetails: {
            endpoint: droppedItem.objDetails.name || droppedItem.tabId,
            requestMethod: droppedItem.objDetails.requestMethod,
            requestBodyMode: droppedItem.objDetails.requestBodyMode,
            requestBodyRaw: droppedItem.objDetails.requestBodyRaw,
            requestUrlRaw: droppedItem.objDetails.requestUrlRaw,
            requestAuthType: droppedItem.objDetails.requestAuthType,
          },
          requestHeader: droppedItem.requestHeader,

          requestBodyFormData: droppedItem.requestBodyFormData,
          requestUrlEncoded: droppedItem.requestUrlEncoded,
          requestAuthBasic: droppedItem.requestAuthBasic,
          requestApiKey: droppedItem.requestApiKey,
          requestBearerToken: droppedItem.requestBearerToken,
          requestUrlQuery: droppedItem.requestUrlQuery,
          requestUrlHost: droppedItem.requestUrlHost,
          requestUrlPath: droppedItem.requestUrlPath,

          response: droppedItem.response,
          examples: droppedItem.examples,
          event: droppedItem.event,
        },
      };

      // Add the new tab to the appropriate file in editorData
      targetFile.tabs = [...targetFile.tabs, newTab];
      targetFile.tabs = targetFile.tabs;

      const originalFileIndex = editorData.reviewFiles.findIndex((file) =>
        file.tabs.some((tab) => tab.tabId === droppedItem.tabId)
      );
      if (originalFileIndex !== -1) {
        const originalTabIndex = editorData.reviewFiles[
          originalFileIndex
        ].tabs.findIndex((tab) => tab.id === droppedItem.tabId);
        editorData.reviewFiles[originalFileIndex].tabs.splice(
          originalTabIndex,
          1
        );
      }

      editorData.reviewFiles = [...editorData.reviewFiles];

      editorData.files = [...editorData.files];
      switchFile(newTabId);
      tabSubName = droppedItem.objDetails.name;

      console.log(editorData.files);
      editorData.reviewFiles = [...editorData.reviewFiles];
    }
  }

  // add sub item to tab
  function addSubItemToTab(subItem) {
    let targetFile = findTargetFile();
    // Generate a unique ID for the new tab
    const newTabId = generateUniqueId();

    // Create a new tab object
    const newTab = {
      id: newTabId,
      tabId: subItem.objDetails.name,
      content: {
        type: "Postman",
        objDetails: {
          endpoint: subItem.objDetails.name,
          requestMethod: subItem.objDetails.requestMethod,
          requestBodyMode: subItem.objDetails.requestBodyMode,
          requestUrlRaw: subItem.objDetails.requestUrlRaw,
          requestBodyRaw: subItem.objDetails.requestBodyRaw,
          requestAuthType: subItem.objDetails.requestAuthType,
        },
        requestHeader: subItem.requestHeader,
        requestBodyFormData: subItem.requestBodyFormData,
        requestUrlEncoded: subItem.requestUrlEncoded,
        requestAuthBasic: subItem.requestAuthBasic,
        requestApiKey: subItem.requestApiKey,
        requestBearerToken: subItem.requestBearerToken,
        requestUrlQuery: subItem.requestUrlQuery,
        requestUrlHost: subItem.requestUrlHost,
        requestUrlPath: subItem.requestUrlPath,
        response: subItem.response,
        examples: subItem.examples,
        event: subItem.event,
      },
    };

    // Add the new tab to the appropriate file in editorData
    targetFile.tabs = [...targetFile.tabs, newTab];
    targetFile.tabs = targetFile.tabs;
    switchFile(newTabId);
    tabSubName = subItem.objDetails.name;
    editorData.files = [...editorData.files];
    console.log(editorData.files);
  }
  // add sublevel item to tab
  function addSubLevelItemToTab(subItem, response) {
    let targetFile = findTargetFile();
    // Generate a unique ID for the new tab
    const newTabId = generateUniqueId();

    // Create a new tab object
    const newTab = {
      id: newTabId,
      tabId: response.name,
      content: {
        type: "Postman",
        objDetails: {
          endpoint: subItem.objDetails.name,
          requestMethod: subItem.objDetails.requestMethod,
          requestBodyMode: subItem.objDetails.requestBodyMode,
          requestUrlRaw: subItem.objDetails.requestUrlRaw,
          requestBodyRaw: subItem.objDetails.requestBodyRaw,
          requestAuthType: subItem.objDetails.requestAuthType,
        },
        requestHeader: subItem.requestHeader,
        requestBodyFormData: subItem.requestBodyFormData,
        requestUrlEncoded: subItem.requestUrlEncoded,

        requestAuthBasic: subItem.requestAuthBasic,
        requestApiKey: subItem.requestApiKey,
        requestBearerToken: subItem.requestBearerToken,
        requestUrlQuery: subItem.requestUrlQuery,
        requestUrlHost: subItem.requestUrlHost,
        requestUrlPath: subItem.requestUrlPath,
        response: subItem.response,
        examples: subItem.examples,
        event: subItem.event,
      },
    };

    // Add the new tab to the appropriate file in editorData
    targetFile.tabs = [...targetFile.tabs, newTab];
    targetFile.tabs = targetFile.tabs;
    switchFile(newTabId);
    editorData.files = [...editorData.files];
    tabSubLevelName = response.name;
    console.log(editorData.files);
  }

  function addenvToTab(subItem) {
    let targetFile = editorData.files[0];
    // Generate a unique ID for the new tab
    const newTabId = generateUniqueId();

    // Create a new tab object
    const newTab = {
      id: newTabId,
      tabId: subItem.tabId,
      content: {
        type: "Environment",
      },
    };

    // Add the new tab to the appropriate file in editorData
    targetFile.tabs = [...targetFile.tabs, newTab];
    targetFile.tabs = targetFile.tabs;
    switchFile(newTabId);

    editorData.files = [...editorData.files];

    console.log(JSON.stringify(editorData.files) + "Files ");
  }

  //add new environment
  function addNewEnvironment() {
    let targetFile = editorData.files[0];
    let file = editorData.envFiles[0];
    // Generate a unique ID for the new tab
    const newTabId = generateUniqueId();

    // Create a new tab object
    const newTab = {
      id: newTabId,
      tabId: "New Env",
      content: {
        type: "Environment",
      },
    };

    // Add the new tab to the appropriate file in editorData
    targetFile.tabs = [...targetFile.tabs, newTab];
    file.tabs = [...file.tabs, newTab];
    targetFile.tabs = targetFile.tabs;
    switchFile(newTabId);

    editorData.files = [...editorData.files];
    editorData.envFiles = [...editorData.envFiles];
  }

  // setting box
  function openSettingBoxCollection(collectionId) {
    // Initialize the settingboxcollection state for the collection if it doesn't exist
    if (!settingboxcollection[collectionId]) {
      settingboxcollection[collectionId] = false;
    }
    // Toggle the state of the setting box for the collection
    settingboxcollection[collectionId] = !settingboxcollection[collectionId];
  }
  // run collection to tab
  let runcollection = false;

  // add run collection to tab
  function addRunCollectionToTab(collectionId, collection) {
    settingboxcollection[collectionId] = false;

    let targetFile = editorData.files[0];
    // Generate a unique ID for the new tab

    const newTabId = generateUniqueId();

    // Retrieve items from the current tab
    let items = [];
    // Iterate through each tab in targetFile
    targetFile.tabs.forEach((tab) => {
      // Check if tab has content and content has items
      if (tab.content && tab.content.type === "Postman") {
        // Iterate through each item in tab
        items.push(tab.content);

        items = [...items];
      }
    });
    // Create a new tab ad
    const newTab = {
      id: newTabId,
      tabId: "Run Collection",
      content: {
        type: "Run Collection",
        item: items.map(({ type, ...rest }) => rest),
      },
    };

    // Add the new tab to the appropriate file in editorData
    targetFile.tabs = [...targetFile.tabs, newTab];
    targetFile.tabs = targetFile.tabs;
    switchFile(newTabId);
    runcollection = true;

    editorData.files = [...editorData.files];
  }

  // Function to handle "Deselect All" button click
  function deselectAll() {
    isChecked = false;
  }

  // Function to activate the clicked tab
  function activateTab(tabId) {
    activeTab = tabId;
  }

  // function to handle schedule runs postman
  function handleChangeScheduleRuns() {
    showScheduleRuns = !showScheduleRuns;
    if (showScheduleRuns) {
      showScheduleRunsSection = true;
    }
    showRunManually = false;
    showAutomateCli = false;
  }
  // function to handle automate cli postman
  function handleChangeAutomateCli() {
    showAutomateCli = !showAutomateCli;
    showScheduleRuns = false;
    if (showAutomateCli) {
      showAutomateCliSection = true;
    }
    showScheduleRuns = false;
    showRunManually = false;
  }

  // performance tab - run collection
  function showPerformanceTab() {
    performanceTab = true;
  }
  // functional tab - run collection
  function showFunctionalTab() {
    performanceTab = false;
  }

  // save postman data

  // run intergration tests
  let manualrunResults = {
    duration: "830ms",
    envValue: "",
    iterations: "",
    allTests: "0",
  };

  function savePostmanData(tab) {
    let targetFile = editorData.files[0];
    console.log(targetFile.tabs);
    console.log(tab, "tab");

    targetFile.tabs.forEach((tabs) => {
      if (tabs.id === tab.id) {
        // tabs.content= tab.content;
        console.log(tabs.content);
        console.log(tab.content);
      }
    });
    // targetFile.tabs = targetFile.tabs;

    editorData.files = [...editorData.files];
    console.log(editorData.files);
  }
  // Function to handle "Select All" button click
  function selectAll() {
    isChecked = true;
    const selectedItems = []; // Array to store selected items
    editorData.files.forEach((file) => {
      file.tabs.forEach((tab) => {
        if (tab.content.item) {
          tab.content.item.forEach((item) => {
            item.isChecked = true;
            selectedItems.push(item); // Add selected item to the array
          });
        }
      });
    });
    manualrunResults.items = selectedItems; // Assign the array of selected items to manualrunResults
    // You can perform further actions here based on the selected items
    console.log(manualrunResults);
  }

  function handleCheckboxCollectionChange(item) {
    manualrunResults.item = item; // Assign the array of selected items to manualrunResults
  }

  let runcollectiontests = false;

  function showRunDetails(request) {
    if (!showrundetails[request.name]) {
      showrundetails[request.name] = false;
    }
    showrundetails[request.name] = !showrundetails[request.name];
  }

  function showRunDetailsEndToEnd(request) {
    console.log(request);
    if (!showrundetailsendToend[request.name]) {
      showrundetailsendToend[request.name] = false;
    }
    showrundetailsendToend[request.name] =
      !showrundetailsendToend[request.name];

    resultEndToEndDetails = true;
  }

  async function runIntegrationTests() {
    showRunManually = true;
    if (showRunManually) {
      showRunManuallySection = true;
      runcollection = false;
      manualrunResults.envValue = envValue;
      manualrunResults.iterations = iterations;

      const currentDate = new Date();
      const formattedTime = currentDate.toLocaleTimeString();

      // Add the formatted time to manualrunResults
      manualrunResults.runTime = formattedTime;

      // Example collectionRequests array containing request objects
      let collectionRequests = manualrunResults.items.map((item) => {
        return {
          name: item.objDetails.endpoint,
          method: item.objDetails.requestMethod,
          url: item.objDetails.requestUrlRaw,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.parse(item.objDetails.requestBodyRaw),
        };
      });

      // console.log(collectionRequests,"collection requests..............");

      let requests = [];
      for (const request of collectionRequests) {
        try {
          const requestOptions = {
            method: request.method,
            headers: request.headers,
          };

          let responseMessage;
          if (request.method === "POST") {
            requestOptions.body = JSON.stringify(request.body);
            responseMessage = "should post the data to the database ";
          } else if (request.method === "GET") {
            responseMessage = "should get all the data ";

            console.log("Added successfully ");
          } else {
            responseMessage = "should delete the selected data";
            console.log("Deleted successfully ");
          }

          // console.log(requestOptions,"requestOPtions.............");
          const res = await fetch(request.url, requestOptions);
          const responseData = await res.json();
          const responseStatus = res.status;
          const responseHeaders = {};
          res.headers.forEach((value, name) => {
            responseHeaders[name] = value;
          });
          const responseType = responseHeaders["content-type"];

          // Create an object for the current request and add it to the requests array
          const requestObject = {
            name: request.name,
            method: request.method,
            url: request.url,
            status: responseStatus,
            headers: responseHeaders,
            type: responseType,
            message: responseMessage,
            data: responseData,
            body: JSON.stringify(request.body),
          };
          requests.push(requestObject);
        } catch (error) {
          // If an error occurs, store the error message in manualrunResults
          const errorObject = {
            name: request.name,
            method: request.method,
            error: error.message,
          };
          requests.push(errorObject);
          console.log(error, "error..............................");
        }
      }
      // Update manualrunResults with the requests array
      manualrunResults.requests = requests;
      runcollectiontests = true;
      resultEndToEnd = false;

      console.log(manualrunResults);
    }
  }

  let scheduleName = "";
  let runFrequency = "hourly";
  let runDay = "0";
  let runTime = "00:00:00";

  async function scheduleRun() {
    showRunManuallySection = true;
    const collectionId = "<YOUR_COLLECTION_ID>"; // Replace <YOUR_COLLECTION_ID> with your collection ID

    const scheduleConfig = {
      collection: collectionId,
      name: scheduleName,
      frequency: runFrequency,
      day: runDay,
      time: runTime,
      apiKey: apiKey,
    };

    const response = await fetch("https://api.getpostman.com/schedules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify(scheduleConfig),
    });

    const responseData = await response.json();
    if (response.ok) {
      alert("Collection run scheduled successfully!");
    } else {
      alert("Error scheduling collection run: " + responseData.error.message);
    }
  }
  // end to end testing
  let endtoendtesting = false;

  function endToEndTesting() {
    endtoendtesting = true;
    addRunCollectionToTab();
  }

  function toggleTestSelection(index) {
    editorData.endToEndTests[index].selected =
      !editorData.endToEndTests[index].selected;
  }

  function selectAllendtoend() {
    editorData.endToEndTests = editorData.endToEndTests.map((test) => ({
      ...test,
      selected: true,
    }));
  }

  function deselectAllendtoend() {
    editorData.endToEndTests = editorData.endToEndTests.map((test) => ({
      ...test,
      selected: false,
    }));
  }

  let endtoendResults = [];
  async function runEndToEndTests() {
    showRunManually = true;
    if (showRunManually) {
      showRunManuallySection = true;
      runcollection = false;
      endtoendtesting = false;

      const selectedTests = editorData.endToEndTests.filter(
        (test) => test.selected
      );

      for (const test of selectedTests) {
        const result = await executeTest(test);
        // displayTestResult(result);
        endtoendResults.push(result);
        endtoendResults = [...endtoendResults];
        console.log(endtoendResults, "endtoendResults");
        resultEndToEnd = true;
        runcollectiontests = false;
      }
    }
  }

  async function executeTest(test) {
    try {
      // Make API call to execute the test
      let requestOptions = {
        method: test.method,
        headers: test.headers,
      };
      if (test.method === "POST") {
        requestOptions.body = JSON.stringify(test.requestBody);
      }

      const response = await fetch(test.url, requestOptions);

      // Parse response
      const responseData = await response.json();

      // Construct the result object
      const result = {
        name: test.name,
        method: test.method,
        status: response.status,
        headers: response.headers,
        pass: response.ok,
        request: {
          url: test.url,
          method: test.method,
          requestBody: test.requestBody,
        },
        response: responseData,
        message: test.message,
      };

      // Return the result
      return result;
    } catch (error) {
      // If an error occurs during the API call, construct an error result object
      const errorResult = {
        name: test.name,
        method: test.method,
        status: response.status,
        headers: response.headers,
        pass: false,
        message: test.message,
        request: {
          url: test.url,
          method: test.method,
          requestBody: test.requestBody,
        },
        error: error.message,
      };

      // Return the error result
      return errorResult;
    }
  }

  // Add tests to textarea
  function addTestsToTextarea(tests) {
    let targetFile = editorData.files[0];

    // Loop through tabs in the target file
    targetFile.tabs.forEach((tab) => {
      // Check if tab content exists
      if (tab.content && tab.content.event) {
        // Loop through events in the tab content
        tab.content.event.forEach((event) => {
          // Check if script exists in the event
          if (event.script && event.script.exec) {
            // Join the exec array with newline characters
            // let scriptContent = event.script.exec.join("\n");
            // scriptContent.push(tests.tests);
            event.script.exec.push(tests.tests);
            // console.log(scriptContent);
            // Now you can do something with the script content, like displaying it in a textarea
          } else {
            console.log("Script content not found in the event");
          }
        });
      } else {
        console.log("Content not found in the tab");
      }
    });

    editorData.files = [...editorData.files];
    console.log(editorData.files);
  }
  //add scripts to textarea
  function addScriptsToTextarea(scripts) {
    let targetFile = editorData.files[0];

    // Loop through tabs in the target file
    targetFile.tabs.forEach((tab) => {
      // Check if tab content exists
      if (tab.content && tab.content.event) {
        // Loop through events in the tab content
        tab.content.event.forEach((event) => {
          // Check if script exists in the event
          if (event.script && event.script.exec) {
            // Join the exec array with newline characters
            event.script.exec.push(scripts.script);
            // Now you can do something with the script content, like displaying it in a textarea
          } else {
            console.log("Script content not found in the event");
          }
        });
      } else {
        console.log("Content not found in the tab");
      }
    });

    editorData.files = [...editorData.files];
  }

  function collectionShareBox(collectionId) {
    settingboxcollection[collectionId] = false;

    // Toggle the state of the setting box for the collection
    collectionsharebox = true;
  }

  function closeCollectionBox() {
    collectionsharebox = false;
  }

  function openSettingBoxRequest(requestId) {
    // Initialize the settingboxcollection state for the collection if it doesn't exist
    if (!settingboxrequest[requestId]) {
      settingboxrequest[requestId] = false;
    }
    // Toggle the state of the setting box for the collection
    settingboxrequest[requestId] = !settingboxrequest[requestId];
  }

  function addNewApiCollection() {
    // Create a new collection object
    const newCollection = {
      id: item.length + 1,
      name: "New Collection",
      item: [
        {
          id: "1",
          objDetails: {
            name: "New Request",
            requestMethod: "GET",
            requestBodyMode: "{}", // Assuming requestBodyMode is a string
            requestUrlRaw: "https://fakestoreapi.com/products",
            requestBodyRaw: "{}",
            requestAuthType: "Bearer Token",
          },
          requestHeader: [
            {
              id: "1",
              key: "",
              value: "",
              description: "",
              examples: [
                {
                  id: "1",
                  key: "userToken",
                  value: "ksj",
                  description: "sd",
                },
              ],
            },
          ],

          requestBodyFormData: [
            {
              id: "1",
              key: "",
              value: "",
              type: "",
            },
          ],
          requestUrlEncoded: [
            {
              id: "1",
              key: "",
              value: "",
              type: "",
            },
          ],
          requestAuthBasic: [
            {
              id: "1",
              key: "",
              value: "",
              type: "",
            },
          ],
          requestAuthBasic: [
            {
              key: "",
              value: "",
              type: "",
            },
          ],
          requestApiKey: [
            {
              id: "1",
              key: "",
              value: "",
              addTo: "",
            },
          ],
          requestBearerToken: [
            {
              token: "asasdfdjwu2i2",
            },
          ],
          requestUrlQuery: [
            {
              id: "1",
              key: "",
              value: "",
              description: "",
            },
          ],
          requestUrlHost: ["api", "example", "com"],
          requestUrlPath: ["users"],
          response: [],
          examples: [
            {
              request: [
                '{"id": 1, "username": "john_doe", "email": "john@example.com", "status": "active"}',
              ],
              response: [
                {
                  id: 1,
                  Code: 400,
                  Description: "Invalid ID Supplied",
                },
                {
                  id: 2,
                  Code: 404,
                  Description: "Not Found",
                },
              ],
            },
          ],
          event: [
            {
              listen: "test",
              script: {
                type: "text/javascript",
                exec: [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                ],
              },
            },
            {
              listen: "script",
              script: {
                type: "text/javascript",
                exec: ["//add scripts here"],
              },
            },
          ],
        },
      ],
    };

    item = [...item, newCollection];
    filteredItems = [...filteredItems, newCollection];
    filteredItems = [...filteredItems];
    item = [...item];
  }

  const handleFileChangeForImport = (event) => {
    importbox = false;
    const file = event.target.files[0];
    console.log(file, "file");
    const reader = new FileReader();

    reader.onload = function (e) {
      const content = e.target.result;
      try {
        const data = JSON.parse(content);
        console.log(data, "dropped data");
        if (data && Array.isArray(data.item)) {
          // Append the new items to the existing array

          let collection = data.item.map((importedItem, index) => ({
            id: index + 1,
            objDetails: {
              name: importedItem.name || importedItem.objDetails.name,
              requestMethod: importedItem.request
                ? importedItem.request.method || ""
                : "" || importedItem.objDetails.requestMethod,
              requestBodyMode: importedItem.request
                ? importedItem.request.body
                  ? importedItem.request.body.mode || ""
                  : ""
                : "" || importedItem.objDetails.requestBodyMode,
              requestUrlRaw: importedItem.request
                ? importedItem.request.url
                  ? importedItem.request.url.raw || ""
                  : ""
                : "" || importedItem.objDetails.requestUrlRaw,
              requestAuthType: importedItem.request
                ? importedItem.request.auth
                  ? importedItem.request.auth.type || ""
                  : ""
                : "" || importedItem.objDetails.requestAuthType,
              requestBodyRaw: importedItem.request
                ? importedItem.request.body
                  ? importedItem.request.body.raw || ""
                  : ""
                : "" || importedItem.objDetails.requestBodyRaw,

              // Add other properties as needed
            },
            requestHeader: importedItem.request
              ? importedItem.request.header || []
              : [] || importedItem.requestHeader,
            requestBodyFormData: importedItem.request
              ? importedItem.request.body
                ? importedItem.request.body.formdata || []
                : []
              : [] || importedItem.requestBodyFormData,
            requestUrlEncoded: importedItem.request
              ? importedItem.request.body
                ? importedItem.request.body.urlencoded || []
                : []
              : [] || importedItem.requestUrlEncoded,
            requestAuthBasic: importedItem.request
              ? importedItem.request.auth
                ? importedItem.request.auth.basic || []
                : []
              : [] || importedItem.requestAuthBasic,
            requestApiKey: importedItem.request
              ? importedItem.request.auth
                ? importedItem.request.auth.apiKey || []
                : []
              : [] || importedItem.requestApiKey,
            requestBearerToken: importedItem.request
              ? importedItem.request.auth
                ? importedItem.request.auth.bearerToken || []
                : []
              : [] || importedItem.requestBearerToken,
            requestUrlQuery: importedItem.request
              ? importedItem.request.url
                ? importedItem.request.url.query || []
                : []
              : [] || importedItem.requestUrlQuery,
            requestUrlHost: importedItem.request
              ? importedItem.request.url
                ? importedItem.request.url.host || []
                : []
              : [] || importedItem.requestUrlHost,
            requestUrlPath: importedItem.request
              ? importedItem.request.url
                ? importedItem.request.url.path || []
                : []
              : [] || importedItem.requestUrlPath,
            response: importedItem.response || [],
            examples: importedItem.examples || [],
            event: importedItem.event || [],
          }));

          let myCollection = {
            id: item.length + 1, // Ensure id is unique, you might need a different logic here
            name: file.name,
            item: collection,
          };

          item = [...item, myCollection];
          item = [...item];
          filteredItems = [...filteredItems, myCollection];
          filteredItems = [...filteredItems];

          console.log("File content added to the item array:", item);
          console.log(editorData.files);
        } else {
          console.error("Invalid file format. Expected item array.");
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };

    reader.readAsText(file);
  };

  function addRequest(requests, collectionId) {
    settingboxcollection[collectionId] = false;
    const collectionIndex = item.findIndex(
      (collection) => collection.id === collectionId
    );

    if (collectionIndex !== -1) {
      // Generate a unique ID for the new tab
      const newTabId = generateUniqueId();
      // Create a new tab object
      const newTab = {
        id: "" + requests.length + 1,
        objDetails: {
          name: "New Request",
          requestMethod: "GET",
          requestBodyMode: "{}", // Assuming requestBodyMode is a string
          requestUrlRaw: "https://fakestoreapi.com/products",
          requestAuthType: "Bearer Token",
          requestBodyRaw: "{}",
        },
        requestHeader: [
          {
            id: "1",
            key: "",
            value: "",
            description: "",
            examples: [
              {
                id: "1",
                key: "userToken",
                value: "ksj",
                description: "sd",
              },
            ],
          },
        ],
        requestBodyFormData: [
          {
            id: "1",
            key: "",
            value: "",
            type: "",
          },
        ],
        requestUrlEncoded: [
          {
            id: "1",
            key: "",
            value: "",
            type: "",
          },
        ],

        requestAuthBasic: [
          {
            id: "1",
            key: "",
            value: "",
            type: "",
          },
        ],
        requestApiKey: [
          {
            id: "1",
            key: "",
            value: "",
            addTo: "",
          },
        ],
        requestBearerToken: [
          {
            token: "asasdfdjwu2i2",
          },
        ],
        requestUrlQuery: [
          {
            id: "1",
            key: "",
            value: "",
            description: "",
          },
        ],
        requestUrlHost: ["api", "example", "com"],
        requestUrlPath: ["users"],
        response: [],
        examples: [
          {
            request: [
              '{"id": 1, "username": "john_doe", "email": "john@example.com", "status": "active"}',
            ],
            response: [
              {
                id: 1,
                Code: 400,
                Description: "Invalid ID Supplied",
              },
              {
                id: 2,
                Code: 404,
                Description: "Not Found",
              },
            ],
          },
        ],
        event: [
          {
            listen: "test",
            script: {
              type: "text/javascript",
              exec: [
                "pm.test('Status code is 200', function () {",
                "    pm.response.to.have.status(200);",
                "});",
              ],
            },
          },
          {
            listen: "script",
            script: {
              type: "text/javascript",
              exec: ["//add scripts here"],
            },
          },
        ],
      };

      item[collectionIndex].item.push(newTab);

      item = [...item];
      switchFile(newTabId);
      console.log(item);
    } else {
      console.log("Collection not found!");
    }
  }

  // export collection

  function exportCollection(collection) {
    settingboxcollection[collection.id] = false;
    let exportedData;

    exportedData = collection;
    // Create a Blob object containing the JSON data
    const blob = new Blob([JSON.stringify(exportedData, null, 2)], {
      type: "application/json",
    });

    // Create a temporary anchor element
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `api.${"export".toLowerCase().replace(/\s+/g, "")}.json`; // Set the download filename
    document.body.appendChild(a);

    // Simulate click to trigger the download
    a.click();

    // Remove the temporary anchor element
    document.body.removeChild(a);
  }

  // delete collection
  function deleteCollection(collectionId) {
    settingboxcollection[collectionId] = false;
    item = item.filter((collection) => collection.id !== collectionId);
    item = [...item];
    filteredItems = [...item];
    filteredItems = [...filteredItems];
  }
  // delete request
  function deleteRequests(requestId) {
    settingboxrequest[requestId] = false;
    // Filter out the item with the matching id
    item.forEach((collection) => {
      collection.item = collection.item.filter(
        (request) => request.id !== requestId
      );
    });
    // Update the item array
    item = [...item];
  }

  let editboxcollection = {};
  let editboxrequest = {};

  function editCollectionBox(collectionId) {
    settingboxcollection[collectionId] = false;
    if (!editboxcollection[collectionId]) {
      editboxcollection[collectionId] = false;
    }
    // Toggle the state of the setting box for the collection
    editboxcollection[collectionId] = !editboxcollection[collectionId];
  }

  function editRequestBox(requestId) {
    settingboxrequest[requestId] = false;
    if (!editboxrequest[requestId]) {
      editboxrequest[requestId] = false;
    }
    // Toggle the state of the setting box for the collection
    editboxrequest[requestId] = !editboxrequest[requestId];
  }

  function editRequest(request) {
    editboxrequest[request.id] = false;
    // item.name = request.name;
    // console.log(item);
  }

  function editCollection(collection) {
    editboxcollection[collection.id] = false;
  }

  // filter collection list

  // Define reactive variable to store search query
  let searchQuery = "";
  console.log(filteredItems);

  // Function to filter items based on search query
  function filterItems() {
    filteredItems = item.filter((topLevelItem) => {
      // Filter topLevelItem based on name
      const topLevelMatch = topLevelItem.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Filter subitems based on name
      const subItemMatch = topLevelItem.item.some((subItem) => {
        return subItem.objDetails.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      });

      // Include topLevelItem if either topLevelItem's name or any subitem's name matches the search query
      return topLevelMatch || subItemMatch;
    });
  }

  function handleDragOver(event) {
    event.preventDefault();
  }
  // Example implementation of findTargetFile function
  function findTargetFile() {
    // For demonstration purposes, let's assume we're targeting the first file
    return editorData.files[0] || editorData.reviewFiles[0];
  }
  // Example implementation of generateUniqueId function
  function generateUniqueId() {
    return (
      `tab-${editorData.files[0].tabs.length + 1}` ||
      `reviewTab-${editorData.reviewFiles[0].tabs.length + 1}`
    );
  }
  // for third column tab

  function handleDragStartForThirdCol(event, tab) {
    // Pass the tab data to be transferred during drag
    event.dataTransfer.setData("text/plain", JSON.stringify(tab));
  }

  function handleDropinThirdCol(event) {
    // Prevent default behavior
    event.preventDefault();

    // Extract necessary data from the dropped item
    const droppedIteminThirdCol = JSON.parse(
      event.dataTransfer.getData("text/plain")
    );
    const content = droppedIteminThirdCol.content;
    console.log(content, "content");

    const { tabId } = droppedIteminThirdCol;

    // Find the target tab based on the event target
    const targetTabId = event.target.getAttribute("data-tab-id");
    let targetFile = findTargetFileForThirdCol(targetTabId);

    // Generate a unique ID for the new tab
    const newTabId = generateUniqueIdForThirdCol();

    // Create a new tab object
    const newTab = {
      id: newTabId,
      tabId: tabId || content.objDetails.endpoint,
      content: {
        type: "Postman",
        objDetails: {
          endpoint: tabId || content.objDetails.name,
          requestMethod: content.objDetails.requestMethod,
          requestBodyMode: content.objDetails.requestBodyMode,
          requestUrlRaw: content.objDetails.requestUrlRaw,
          requestBodyRaw: content.objDetails.requestBodyRaw,
          requestAuthType: content.objDetails.requestAuthType,
        },
        requestBodyFormData: content.requestBodyFormData,
        requestHeader: content.requestHeader,
        requestUrlEncoded: content.requestUrlEncoded,

        requestAuthBasic: content.requestAuthBasic,
        requestApiKey: content.requestApiKey,
        requestBearerToken: content.requestBearerToken,
        requestUrlQuery: content.requestUrlQuery,
        requestUrlHost: content.requestUrlHost,
        requestUrlPath: content.requestUrlPath,
        response: content.response,
        examples: content.examples,
        event: content.event,
      },
    };

    // Add the new tab to the appropriate file in editorData
    targetFile.tabs = [...targetFile.tabs, newTab];

    targetFile.tabs = targetFile.tabs;

    // Remove the dropped tab from its original position in editorData.files
    const originalFileIndex = editorData.files.findIndex((file) =>
      file.tabs.some((tab) => tab.tabId === tabId)
    );
    if (originalFileIndex !== -1) {
      const originalTabIndex = editorData.files[
        originalFileIndex
      ].tabs.findIndex((tab) => tab.id === tabId);
      editorData.files[originalFileIndex].tabs.splice(originalTabIndex, 1);
    }

    editorData.reviewFiles = [...editorData.reviewFiles];
    editorData.files = [...editorData.files];
    switchFile(newTabId);

    console.log(editorData.reviewFiles, "reviewFiles");
  }

  function findTargetFileForThirdCol(targetTabId) {
    // For demonstration purposes, let's assume we're targeting the first file
    return editorData.reviewFiles[0];
  }

  // for third column tabs
  function generateUniqueIdForThirdCol() {
    return `reviewTab-${editorData.reviewFiles[0].tabs.length + 1}`;
  }

  let rowCounter = 1;
  let rowCounterForEnv = 1;

  let rows = [
    {
      id: rowCounter,
      key: "",
      value: "",
      description: "",
    },
  ];

  let rowsForEnv = [
    {
      id: rowCounter,
      variableName: "",
      variableType: "Default",
      initialValue: "",
      currentValue: "",
    },
  ];

  function addRow() {
    rowCounter++;
    rows = [
      ...rows,
      {
        id: rowCounter,
        key: "",
        value: "",
        description: "",
      },
    ];
  }
  // add new row for query params
  function addRowQueryParams(requestUrlQuery) {
    // Assuming query is an array, you push an empty object to it to add a new row

    requestUrlQuery.push({
      id: "" + (requestUrlQuery.length + 1),
      key: "",
      value: "",
      description: "",
    });

    editorData.files = [...editorData.files];
  }

  function deleteRowQueryParams(requestUrlQuery, idToDelete) {
    let file = editorData.files[0];

    file.tabs.forEach((tab) => {
      if (tab.content.requestUrlQuery) {
        // Filter the requestUrlQuery array and update it
        tab.content.requestUrlQuery = tab.content.requestUrlQuery.filter(
          (query) => query.id !== idToDelete
        );
      }
    });

    editorData.files = [...editorData.files];
  }
  // row for header
  function addRowForHeader(requestHeader) {
    requestHeader.push({
      id: "" + (requestHeader.length + 1),
      key: "",
      value: "",
      description: "",
      examples: [],
    });
    editorData.files = [...editorData.files];
  }

  function deleteRowForHeader(idToDelete) {
    let file = editorData.files[0];
    file.tabs.forEach((tab) => {
      if (tab.content.requestHeader) {
        // Filter the requestUrlQuery array and update it
        tab.content.requestHeader = tab.content.requestHeader.filter(
          (query) => query.id !== idToDelete
        );
      }
    });

    editorData.files = [...editorData.files];
  }

  // row for body form data
  function addRowForBodyFormData(requestBodyFormData) {
    requestBodyFormData.push({
      id: "" + (requestBodyFormData.length + 1),
      key: "",
      value: "",
      type: "",
    });
    editorData.files = [...editorData.files];
  }

  function deleteRowForBodyFormData(idToDelete) {
    let file = editorData.files[0];
    file.tabs.forEach((tab) => {
      if (tab.content.requestBodyFormData) {
        // Filter the requestUrlQuery array and update it
        tab.content.requestBodyFormData =
          tab.content.requestBodyFormData.filter(
            (query) => query.id !== idToDelete
          );
      }
    });

    editorData.files = [...editorData.files];
  }
  // row for body url encoded
  function addRowForUrlEncoded(requestUrlEncoded) {
    requestUrlEncoded.push({
      id: "" + (requestUrlEncoded.length + 1),
      key: "",
      value: "",
      type: "",
    });
    editorData.files = [...editorData.files];
  }

  function deleteRowForUrlEncoded(idToDelete) {
    let file = editorData.files[0];
    file.tabs.forEach((tab) => {
      if (tab.content.requestUrlEncoded) {
        // Filter the requestUrlEncoded array and update it
        tab.content.requestUrlEncoded = tab.content.requestUrlEncoded.filter(
          (query) => query.id !== idToDelete
        );
      }
    });

    editorData.files = [...editorData.files];
  }
  // add variable to path
  let variableChooseBox = false;
  let variablechooseboxcontainer = false;

  function handleSelectChange() {
    variableChooseBox = true;
  }

  function variableChooseBoxContainer() {
    variableChooseBox = false;
    variablechooseboxcontainer = true;
  }
  // add variable to path
  function addVariableToPath(variableName) {
    let targetFile = editorData.files[0];
    targetFile.tabs.forEach((tab) => {
      tab.content.requestUrlRaw += `{{${variableName}}}`;
      if (tab.content.requestUrlQuery) {
        tab.content.requestUrlQuery[0].key += `{{${variableName}}}`;
      }
    });
    editorData.files = [...editorData.files];
    variablechooseboxcontainer = false;
  }

  function addQueryKeyToPath(key) {
    console.log(key);
    let targetFile = editorData.files[0];
    targetFile.tabs.forEach((tab) => {
      if (
        tab.content &&
        tab.content.objDetails &&
        typeof tab.content.objDetails.requestUrlRaw === "string"
      ) {
        if (!tab.content.objDetails.requestUrlRaw.includes("?")) {
          tab.content.objDetails.requestUrlRaw += `?${key}`;
        }
      }
    });
    editorData.files = [...editorData.files];
    console.log(editorData.files, "editorData files");
  }

  function addQueryValueToPath(value) {
    console.log(value);
    let targetFile = editorData.files[0];
    targetFile.tabs.forEach((tab) => {
      if (
        tab.content &&
        tab.content.objDetails &&
        typeof tab.content.objDetails.requestUrlRaw === "string"
      ) {
        if (!tab.content.objDetails.requestUrlRaw.includes("=")) {
          tab.content.objDetails.requestUrlRaw += `=${value}`;
        }
      }
    });
    editorData.files = [...editorData.files];
  }
  // function handleKeyChange(event,queryIndex) {
  //   variablechooseboxcontainer = true;
  //       let targetFile = editorData.files[0];

  //   const newValue = event.target.value;
  //   console.log(newValue,envValue);
  //   targetFile.tabs.forEach((tab) => {
  //           tab.content.requestUrlQuery[queryIndex].key += `{{${newValue}}}`;
  //       });

  //       editorData.files = [...editorData.files];
  //       variablechooseboxcontainer = false;

  // }

  function deleteRow(index) {
    rows = rows.filter((row) => row.id !== index);
  }

  function addRowForEnv() {
    rowCounterForEnv++;
    rowsForEnv = [
      ...rowsForEnv,
      {
        id: rowCounterForEnv,
        variableName: "",
        variableType: "Default",
        initialValue: "",
        currentValue: "",
      },
    ];
  }
  // save the env data
  // let envList = [];

  function saveEnvVariable() {
    // console.log(rowsForEnv);
    // envList.push(rowsForEnv);
    // envList = [...envList];
  }

  function deleteRowForEnv(index) {
    rowsForEnv = rowsForEnv.filter((row) => row.id !== index);
  }

  function removeField(id) {
    fields = fields.filter((field) => field.id !== id);
  }

  // auth details postman
  let authDetails = [];
  // postman authorization variables
  let requestAuthType = "";
  let selectedAuthType = "Basic Auth";
  let requestAuthBasicValue1 = "";
  let requestAuthBasicValue2 = "";
  let requestApiKey = "";
  let requestApiKeyValue = "";
  let requestAuthToken = "";

  let targetFile = editorData.files[0];

  // postman authorization details
  targetFile.tabs.forEach((tab) => {
    requestAuthType = tab.content.requestAuthType;
    if (tab.content.requestAuthBasic) {
      requestAuthBasicValue1 = tab.content.requestAuthBasic[0].value; // Push only the value into the array
      requestAuthBasicValue2 = tab.content.requestAuthBasic[1].value; // Push only the value into the array
    }
    if (tab.content.requestApiKey) {
      requestApiKey = tab.content.requestApiKey[0].key;
      requestApiKeyValue = tab.content.requestApiKey[0].value;
    }
    if (tab.content.requestBearerToken) {
      requestAuthToken = tab.content.requestBearerToken[0].token;
    }
  });
  console.log(selectedAuthType);

  function updateAuthDetails() {
    authDetails = [];

    switch (selectedAuthType) {
      case "API Key":
        authDetails = [
          {
            label: "Key",
            placeholder: "Key",
            value: requestApiKey,
          },
          {
            label: "Value",
            placeholder: "Value",
            value: requestApiKeyValue,
          },
          {
            label: "Add to",
            placeholder: "Header",
            value: "Header",
          },
        ];
        break;
      case "Bearer Token":
        authDetails = [
          {
            label: "Token",
            placeholder: "Token",
            value: requestAuthToken,
          },
        ];
        break;
      case "Basic Auth":
        authDetails = [
          {
            label: "Username",
            placeholder: "Username",
            value: requestAuthBasicValue1,
          },
          {
            label: "Password",
            placeholder: "Password",
            value: requestAuthBasicValue2,
          },
        ];
        break;
      case "Digest Auth":
        authDetails = [
          {
            label: "Username",
            placeholder: "Username",
          },
          {
            label: "Password",
            placeholder: "Password",
          },
        ];
        break;

      default:
        break;
    }
  }

  // Initial setup
  onMount(() => {
    updateAuthDetails();
  });

  // treee view collections list
  let subItems = {};
  let sublevelItems = {};

  function toggleSubItems(id) {
    subItems[id] = !subItems[id];
  }

  function toggleSubLevelItems(id) {
    sublevelItems[id] = !sublevelItems[id];
  }
  // new box for adding new functionality
  let newboxopen = false;

  function newBoxOpen() {
    newboxopen = true;
  }

  function closeNewBoxOpen() {
    newboxopen = false;
  }
  // import box
  let importbox = false;

  function importBox() {
    importbox = true;
  }

  function closeImportBox() {
    importbox = false;
  }
  // for task description show on timer start
  let taskDescription = false;

  // for tasks list

  function showTaskListBox() {
    tasklistbox = !tasklistbox;
  }
  let editTaskId = null;
  let selectedTask = null;
  let editedTaskName = "";
  let playedId = null;
  let currentWorkValue = null;
  let timerStart = null;
  let timerEnd = null;
  let timeTaken = "";

  function showEditOption(taskId) {
    editTaskId = taskId;
    // Fetch task details for taskId from tasks array and set them to editedTaskName
    const task = tasks.find((task) => task.id === taskId);
    editedTaskName = task.name;

    document.body.classList.add("blurred");
  }

  function closeEditOption() {
    editTaskId = null;

    // Remove the class to remove the blur effect
    document.body.classList.remove("blurred");
  }

  function updateTask() {
    // Update task in tasks array with new task name
    const index = tasks.findIndex((task) => task.id === editTaskId);
    tasks[index].name = editedTaskName;

    // Close edit option popup
    editTaskId = null;
    closeEditOption();
  }
  // delete task
  function deleteTask(taskId) {
    tasks = tasks.filter((task) => task.id !== taskId);
    closeEditOption();
  }
  // view task details
  function viewTaskAllDetails(taskId) {
    selectedTask = tasks.find((task) => task.id === taskId);
  }

  // play task
  function playTask(taskId) {
    playedId = taskId;
    tasklistbox = false;
  }
  // show current work doing and start the timer
  // function showCurrentWorkDoing(testValue) {
  //   currentWorkValue = testValue;
  //   timerStart = Date.now();
  //   startTimer();
  // }

  // check the checkbox if the work is done and disable the input

  function calculateTimeTaken() {
    const timeTakenSeconds = Math.floor((timerEnd - timerStart) / 1000); // Time taken in seconds

    // Calculate hours, minutes, and remaining seconds
    const hours = Math.floor(timeTakenSeconds / 3600);
    const minutes = Math.floor((timeTakenSeconds % 3600) / 60);
    const seconds = timeTakenSeconds % 60;

    // Construct the formatted time string
    if (hours > 0) {
      timeTaken += `${hours} hour${hours > 1 ? "s" : ""}`;
    }
    if (minutes > 0) {
      timeTaken += ` ${minutes} minute${minutes > 1 ? "s" : ""}`;
    }
    if (seconds > 0 || timeTaken === "") {
      timeTaken += ` ${seconds} second${seconds > 1 ? "s" : ""}`;
    }

    console.log("Time taken:", timeTaken);
  }

  // timers start stop pause

  let intervalIdUp; // Timer counting up/
  let intervalIdUpSub; // Timer counting up

  let intervalIdDown; // Timer counting down
  let timerStartUp = 0;
  let timersub = 0;
  let timerStartDown = 0;
  let timerbuttons = false;
  let selectedTaskForTimer = null;

  function showTimerButtons() {
    timerbuttons = !timerbuttons;
  }

  function startTimerUp() {
    intervalIdUp = setInterval(() => {
      timerStartUp += 1000;
    }, 1000);
  }

  function startTimerUpSub() {
    intervalIdUpSub = setInterval(() => {
      timersub += 1000;
    }, 1000);
    timerStart = Date.now();
  }

  // Start the timer counting down from the task time to 0
  function startTimerDown() {
    intervalIdDown = setInterval(() => {
      if (timerStartDown > 0) {
        timerStartDown -= 1000;
      }
    }, 1000);
  }

  function pauseTimer() {
    if (selectedTaskForTimer.isPause) {
      clearInterval(intervalIdUp);
      clearInterval(intervalIdDown);
      clearInterval(intervalIdUpSub);
    } else {
      alert("Not Pausable");
    }
  }

  function stopTimer() {
    clearInterval(intervalIdUp);
    clearInterval(intervalIdUpSub);

    clearInterval(intervalIdDown);
    timerStartUp = 0;
    timersub = 0;
    timerStartDown = 0;
  }

  // Listen to changes in playedId
  $: {
    if (playedId) {
      selectedTaskForTimer = tasks.find((task) => task.id === playedId);
      const timeInMilliseconds = selectedTaskForTimer.time * 1000; // Convert seconds to milliseconds
      timerStartDown = timeInMilliseconds;
    }
  }

  // Convert milliseconds to time string in HH:MM:SS format
  function millisecondsToTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }

  function startTimer() {
    startTimerUp();
    startTimerUpSub();
    startTimerDown();
    taskDescription = true;
  }

  // Start the timers when the component is mounted
  // onMount(() => {
  //   startTimerUp();
  //   startTimerDown();
  // });

  // Stop the timers when the component is destroyed
  onDestroy(() => {
    stopTimer();
  });

  // work status logic

  // login pop up
  function loginPopup() {
    loginpopup = !loginpopup;
    tasklistbox = false;
  }
  // add new test cases
  let testcasesvalue = "";

  function saveNewTestCases(task) {}

  let showtaskdropdown = false;

  function showTaskDropdown() {
    showtaskdropdown = true;
  }

  let inputValue = ""; // Variable to store input value
  let selectedOption = "Write Test Case list";
  let taskDetails = [];

  let isWork = false;

  function handleDoneWork() {
    timerEnd = Date.now();
    calculateTimeTaken();
    const taskDetail = {
      statusValue: inputValue,
      selectedOptionValue: selectedOption,
      timeTakenTask: timeTaken,
    };

    taskDetails = [...taskDetails, taskDetail];
    isWork = true;
    clearInterval(intervalIdUpSub);
    timersub = 0;
    startTimerUpSub();
    console.log(taskDetails);
    inputValue = "";
    timeTaken = "";
  }

  // State to manage visibility of multiple sections
  let sectionsVisibility = {
    docs: true,
    code: true,
    allDocs: true,
    schema: true,
    examples: false,
    build: false,
  };

  // State to delete multiple sections
  let sectionsDelete = {
    docs: true,
    code: true,
    allDocs: true,
    schema: true,
    examples: true,
    build: true,
  };

  // toggle section
  function toggleSection(section) {
    sectionsVisibility[section] = !sectionsVisibility[section];
  }

  // delete section
  function deleteSection(section) {
    sectionsDelete[section] = false;
  }

  // run code
  function runCode(tabContent) {
    isThirdColContent = true;
    isSplitMenu = false;

    let newTabId = generateUniqueId();

    const newTab = {
      id: newTabId,
      tabId: "Run",
      content: {
        type: "run",
        logSchema: tabContent.logSchema,
        errors: {
          message: "An unknown error occurred during code execution.",
        },
      },
    };

    let files = editorData.reviewFiles[0];

    files.tabs = [...files.tabs, newTab];
    switchFile2(newTab.id);

    editorData.reviewFiles = [...editorData.reviewFiles];
  }


  // Array of background colors
  const colors = [
    "#f28d35", // Example color 1
    "#36a2eb", // Example color 2
    "#ff6384", // Example color 3
    "#4bc0c0", // Example color 4
    "#9966ff", // Example color 5
  ];

  // Function to get a random color from the colors array
  function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function openTabGroupBox(id) {
    openTabGroup[id] = !openTabGroup[id];
  }

  function showTabInGroupsBox(id) {
    showTabInGroups[id] = !showTabInGroups[id];
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

  // drag tab groups
  function handleDragStartTabGroup(event, group) {
    event.dataTransfer.setData("text/plain", group.id);
  }

  // Event handler for drag over in the first list
  function handleDragOverTabGroup(event) {
    event.preventDefault();
  }

  function handleDragStartGroup(event, tab) {
    event.dataTransfer.setData("text/plain", tab.id);
  }

  // Event handler for drag over in the first list
  function handleDragOverGroup(event) {
    event.preventDefault();
  }

  // internal tab dragging in tabGroups
  function handleDragStartInternalTab(event, tab) {
    event.dataTransfer.setData("text/plain", tab.id);
  }

  // Event handler for drag over in the first list
  function handleDragOverInternalTab(event) {
    event.preventDefault();
  }

  function generateUniqueIdTabGroup() {
    return "tab-" + Math.random().toString(36).substr(2, 9); // Example implementation
  }

  // Event handler for drop in the tabGroups list
  function handleDropInTabGroups(event, group) {
    event.preventDefault();
    let files = editorData.files[0];
    const tab = event.dataTransfer.getData("text/plain");
    let parseTab = JSON.parse(tab);
    console.log(parseTab, "tab");

    const tabId = parseTab.id;
    // const tab = files.tabs.find((t) => t.id === tabId);

    console.log(tabId, "tabId");

    const draggedGroup = event.dataTransfer.getData("text/plain");
    const draggedGroupId = JSON.parse(draggedGroup).id;
    console.log(draggedGroupId, "dragged");

    const droppedGroupId = event.target.dataset.tabId; // Get the ID of the tab where it's dropped
    console.log(droppedGroupId, "dropped");

    if (draggedGroupId && droppedGroupId && draggedGroupId !== droppedGroupId) {
      // Find the dragged and dropped groups
      const draggedGroup = tabGroups.find((g) => g.id === draggedGroupId);
      const droppedGroup = tabGroups.find((g) => g.id === droppedGroupId);

      if (draggedGroup && droppedGroup) {
        // Get the indexes of the dragged and dropped groups
        const draggedGroupIndex = tabGroups.indexOf(draggedGroup);
        const droppedGroupIndex = tabGroups.indexOf(droppedGroup);

        // Remove the dragged group from its original position
        tabGroups.splice(draggedGroupIndex, 1);

        // Insert the dragged group into the new position
        tabGroups.splice(droppedGroupIndex, 0, draggedGroup);

        // Update the tabGroups array
        tabGroups = [...tabGroups];
      }
    }

    // If the tab exists and the group is valid
    if (tab && group) {
      // Remove the tab from the tabs list
      files.tabs = files.tabs.filter((t) => t.id !== tabId);

      const newTabId = generateUniqueIdTabGroup();
      console.log(newTabId, "new tab id ");

      // Rename tabId to name
      const updatedTab = {
        name: parseTab.tabId, // Rename tabId to name
        ...parseTab, // Spread the rest of the properties
      };

      // new tab id
      updatedTab.id = newTabId;

      console.log(updatedTab, "updated tab");

      switchFile(updatedTab.id);
      // Add the tab to the specified group
      group.tabs.push(updatedTab);

      // Update tabGroups
      tabGroups = [...tabGroups];
      console.log(tabGroups, "tabGroups");
      console.log(files.tabs, "files.tabs");
      editorData.files = [...editorData.files];
    }
  }

  // handle internal position change of tabs
  function handleInternalTabDrop(event, group) {
    event.preventDefault();
    const draggedTabId = event.dataTransfer.getData("text/plain");
    console.log(draggedTabId);
    const droppedTabId = event.target.dataset.tabId; // Get the ID of the tab where it's dropped
    console.log(droppedTabId);
    if (draggedTabId && droppedTabId && draggedTabId !== droppedTabId) {
      // Find the dragged and dropped tabs
      const draggedTab = group.tabs.find((tab) => tab.id === draggedTabId);
      const droppedTab = group.tabs.find((tab) => tab.id === droppedTabId);

      if (draggedTab && droppedTab) {
        // Find the indices
        const draggedIndex = group.tabs.indexOf(draggedTab);
        const droppedIndex = group.tabs.indexOf(droppedTab);

        // Reorder tabs
        group.tabs.splice(draggedIndex, 1);
        group.tabs.splice(droppedIndex, 0, draggedTab);

        tabGroups = [...tabGroups]; // Trigger reactivity
      }
    }
  }
  // add tab to tabGroup
  function addToTabGroup(tab, groupName) {
    // Rename tabId to name
    const updatedTab = {
      name: tab.tabId, // Rename tabId to name
      ...tab, // Spread the rest of the properties
    };

    // delete updatedTab.tabId;

    const existingGroup = tabGroups.find((group) => group.name === groupName);
    // const tabId = `tab-${nextTabId++}`;

    const newTabId = generateUniqueIdTabGroup();
    // Determine the background color for the new group
    const groupColor = getRandomColor();

    let newGroup;

    if (existingGroup) {
      existingGroup.tabs.push(updatedTab);
    } else {
      newGroup = {
        id: newTabId,
        name: groupName,
        tabs: [
          {
            id: generateUniqueIdTabGroup(),
            name: tab.tabId,
            content: {
              type: tab.content.type,
              code: tab.content.code,
              docs: tab.content.docs,
              path: tab.content.path,
              allDocs: tab.content.allDocs,
            },
          },
        ],
        color: groupColor,
      };

      tabGroups.push(newGroup);
      showTabInGroups[newGroup.id] = true;
    }

    switchFile(newGroup.tabs[0].id);
    // Remove the tab from the tabs array
    let files = editorData.files[0];

    files.tabs = files.tabs.filter((t) => t.id !== tab.id);

    tabGroups = [...tabGroups];
    editorData.files = [...editorData.files];

    groupToAdd = "";
  }

  let isEditing = false; // State to determine if in edit mode
  let editedDocs = ""; // State to store the current content of docs
  let allDocsLabel = ""; //label allDocs
  let allDocsContent = ""; //allDocs content
  let schemaInput = ""; //schema input
  let schemaOutput = ""; //schema output
  let exampleInput = ""; //examples input
  let exampleOutput = ""; //examples output
  let exampleExplanation = ""; //examples explanation

  // Function to handle double-click to start editing
  function startEditing(tab) {
    isEditing = true;
    editedDocs = tab.content.docs; // Initialize with current docs content
  }

  // Function to save updated docs
  function saveDocs(tab) {
    tab.content.docs = editedDocs;
    isEditing = false; // Exit edit mode
  }

  // add new allDocs content
  function addNewAllDocs(tabContent, allDocsLabel, allDocsContent) {
    // Ensure tabContent.allDocs is initialized
    if (!Array.isArray(tabContent.allDocs)) {
      tabContent.allDocs = [];
    }

    // Create a new document object
    const newDoc = {
      name: allDocsLabel.trim(), // Name of the document
      docs: allDocsContent.trim(), // Content of the document
      drawing: "", // Assuming no drawing content is provided, keep it empty
    };

    // Add the new document to the allDocs array
    tabContent.allDocs.push(newDoc);

    editorData.files = [...editorData.files]; //for reactivity update
  }

  // <!-- add new examples -->
  function addNewExamples(tabContent, examplesInput, examplesOutput) {
    // Ensure tabContent.example is initialized
    if (!Array.isArray(tabContent.example)) {
      tabContent.example = [];
    }

    // Create a new document object
    const newExample = {
      input: exampleInput.trim(),
      output: exampleOutput.trim(),
      explanation: exampleExplanation.trim(),
    };

    // Add the new document to the example array
    tabContent.example.push(newExample);

    editorData.files = [...editorData.files]; //for reactivity update
  }

  // delete logs row examples
  function deleteLogsRowExamples(logId, ex) {
    ex.logs = ex.logs.filter((log) => log.id !== logId);
    editorData.files = [...editorData.files];
  }

  // add logs row for examples
  function addLogsRowExamples(ex) {
    const newLogs = {
      id: ex.logs.length + 1,
      timestamp: "",
      message: "",
    };
    ex.logs.push(newLogs);

    editorData.files = [...editorData.files];
  }

  // delete schema row
  function deleteSchemaRow(schemaId, tabContent) {
    tabContent.schema = tabContent.schema.filter(
      (schema) => schema.id !== schemaId
    );
    editorData.files = [...editorData.files];
  }

  // add schema row
  function addSchemaRow(tabContent) {
    const newSchema = {
      id: tabContent.schema.length + 1,
      input: "",
      output: "",
    };
    tabContent.schema.push(newSchema);
    editorData.files = [...editorData.files];
  }

  // sections drag and drop

  // Sections array (your content)
  let sections = [
    { id: "1", type: "docs", name: "Docs",  content: "Docs content" },
    { id: "2", type: "code", name: "Code", content: "Code content" },
    { id: "3", type: "allDocs", name: "All Docs", content: "All Docs content" },
    { id: "4", type: "schema", name: "Schema", content: "Schema content" },
    { id: "5", type: "examples", name: "Examples", content: "Example content" },
    { id: "6", type: "build", name: "Build", content: "Build content" },
  ];

  let draggedSectionId = null; //store draggedsection id

  // drag section
  function handleDragStartSection(event, id) {
    draggedSectionId = id;
  }

  // drop section to reorder
  function handleDropSection(event, id) {
    event.preventDefault();
    const draggedIndex = sections.findIndex(
      (section) => section.id === draggedSectionId
    );

    const dropIndex = sections.findIndex((section) => section.id === id);

    if (draggedIndex !== dropIndex) {
      const [draggedSection] = sections.splice(draggedIndex, 1);
      sections.splice(dropIndex, 0, draggedSection);
    }
    sections = [...sections];
  }
  // drag end section
  function handleDragOverSection(event) {
    event.preventDefault();
  }

  // Search input variable
  let searchTermLog = "";
  let filteredLogs = []; // store filtered logs

  // search logs
  function searchLogs(tabContent, searchTerm) {
    const query = searchTerm.toLowerCase().replace(/"/g, "");
    filteredLogs = tabContent.logSchema.filter((log) =>
      JSON.stringify(log.message).toLowerCase().includes(query)
    );
  }

  // reorder schema table rows
  let draggingIdSchemaTable = null;

  // drag row
  function handleDragStartSchemaTable(event, id) {
    draggingIdSchemaTable = id;
  }

  function handleDragOverSchemaTable(event) {
    event.preventDefault(); // This allows the drop event to fire
  }

  // drop schema table row
  function handleDropSchemaTable(event, targetId, tabContent) {
    if (draggingIdSchemaTable !== null && draggingIdSchemaTable !== targetId) {
      // Find the dragged item and target item indices
      const draggingIndex = tabContent.schema.findIndex(
        (item) => item.id === draggingIdSchemaTable
      );
      const targetIndex = tabContent.schema.findIndex(
        (item) => item.id === targetId
      );

      // Reorder the schema array
      const [draggedItem] = tabContent.schema.splice(draggingIndex, 1);
      tabContent.schema.splice(targetIndex, 0, draggedItem);

      editorData.files = [...editorData.files];
    }
    draggingIdSchemaTable = null; // Reset dragging id
  }

  function handleDragEndSchemaTable() {
    draggingIdSchemaTable = null; // Reset dragging id
  }

  // reorder examples log table rows
  let draggingIdExamplesTable = null;

  // drag row
  function handleDragStartExamplesTable(event, id) {
    draggingIdExamplesTable = id;
  }

  function handleDragOverExamplesTable(event) {
    event.preventDefault(); // This allows the drop event to fire
  }

  // drop Examples table row
  function handleDropExamplesTable(event, targetId, example) {
    if (
      draggingIdExamplesTable !== null &&
      draggingIdExamplesTable !== targetId
    ) {
      // Find the dragged item and target item indices
      const draggingIndex = example.logs.findIndex(
        (item) => item.id === draggingIdExamplesTable
      );
      const targetIndex = example.logs.findIndex(
        (item) => item.id === targetId
      );

      // Reorder the Examples array
      const [draggedItem] = example.logs.splice(draggingIndex, 1);
      example.logs.splice(targetIndex, 0, draggedItem);

      editorData.files = [...editorData.files];
    }
    draggingIdExamplesTable = null; // Reset dragging id
  }

  function handleDragEndExamplesTable() {
    draggingIdExamplesTable = null; // Reset dragging id
  }

  let repoInfo; // handle repo information function
  let isCollapsedInfo = true; // State to manage the collapse/expand of the info
  let activeBranch = "main"; // The current active branch
  let isCollapsedTasks = true; // State to manage the collapse/expand of the tasks
  let isCollapsedRepos = true; // State to manage the collapse/expand of the repos
  let isCollapsedBranch = true; // State to manage the collapse/expand of the branch
  let selectedBranch = null; //select branch
  let selectedRepoDetails = null;
  let commitMessage = "";

  // get info of repos from children component
  function handleRepoSelection(event) {
    const repoName = event.target.value;
    selectedRepoDetails = repo.find((r) => r.objDetails.repoName === repoName);
  }

  // Function to handle branch selection
  function handleBranchSelection(event) {
    const branchName = event.target.value;
    console.log(branchName);

    selectedBranch = selectedRepoDetails.branches.find(
      (branch) => branch.objDetails.branchName === branchName
    );
    console.log(selectedBranch);
  }

  // Function to switch branches
  function switchBranch(branch) {
    if (branch !== activeBranch) {
      const confirmSwitch = confirm(
        `Are you sure you want to switch to the branch: ${branch}?`
      );
      if (confirmSwitch) {
        activeBranch = branch; // Update active branch
        // Logic for branch switch (e.g., fetching data or changing views based on branch)
        console.log(`Switched to branch: ${activeBranch}`);
      }
    }
  }

  // toggle collapse info accordion
  function toggleCollapseInfo() {
    isCollapsedInfo = !isCollapsedInfo;
  }

  // toggle collapse info accordion
  function toggleCollapseTasks() {
    isCollapsedTasks = !isCollapsedTasks;
  }

  // toggle collapse info accordion
  function toggleCollapseRepos() {
    isCollapsedRepos = !isCollapsedRepos;
  }

  // toggle collapse info accordion
  function toggleCollapseBranch() {
    isCollapsedBranch = !isCollapsedBranch;
  }

  // get info of repos from children component
  function handleInfo(event) {
    isCollapsedInfo = false;
   const  repId = event.detail.id;
    repoInfo = repo.find((r) => r.id === repId);
    console.log(repoInfo, "repoInfo");
  }
  function saveFileContent(tabContent) {
  if (tabContent) {
    tabContent.status = "Modified"; // Update the tab content status
    fileContentRepo.status = "Modified"; // Update the file repo content status

    // Find the corresponding file in repoContent and update its status
    const fileIndex = repoContent.findIndex(file => file.id === fileContentRepo.id);
    if (fileIndex !== -1) {
      // Update the file's status in repoContent
      repoContent[fileIndex] = {
        ...repoContent[fileIndex],
        status: "Modified"
      };
    }

    // Trigger Svelte reactivity by reassigning the array with a new reference
    repoContent = [...repoContent];

    // Update the editor data as needed
    editorData.files = [...editorData.files];
  }
  console.log(fileContentRepo, "Updated fileContentRepo");
  console.log(repoContent, "Updated repoContent");
}




  // branch graph show in tab
  function handleBranchGraph(event) {
    const repId = event.detail.id;
    repoInfo = repo.find((r) => r.id === repId);

    const newTabId = generateUniqueId();
    const newTab = {
      id: newTabId,
      tabId: repoInfo.objDetails.repoName,
      content: {
        type: "Graph",
      },
    };

    let files = editorData.files[0];

    files.tabs = [...files.tabs, newTab];

    switchFile(newTab.id);
    editorData.files = [...editorData.files];
  }

  // show commits diff
  let showDiffUi = false;
  let selectedCommitDiff = [];

  // Function to show the diff for all commits in the selected branch
  function showDiff(branch) {
    selectedCommitDiff = branch.commits.flatMap((commit) => commit.changes);
    showDiffUi = !showDiffUi;
  }
  // Function to return appropriate class for change type
  function getClassForChangeType(changeType) {
    if (changeType === "added") return "added";
    if (changeType === "modified") return "modified";
    if (changeType === "removed") return "removed";
  }

  let tabContentData;

function openCommitModal(tabContent){
  tabContentData = tabContent;
}
function handleCommit(branch, commitMessage) {

    if (branch) {
      // Create a new commit based on tabContent (you should pass tabContent to this function)
      const newCommit = {
        commitId: `commit${branch.commits.length + 1}`,
        commitMessage,
        user: "CurrentUser", // Replace with actual user
        commitTime: new Date().toLocaleString(),
        changes: [
          {
            fileName: tabContentData.name, // Assuming tabContent contains file name
            changeType: "modified", // Update as needed
            code: tabContentData.code // Assuming tabContent contains code changes
          }
        ]
      };
      // Add the new commit to the branch
      branch.commits.push(newCommit);

      fileContentRepo.status = "Modified"; // Update the file repo content status

        // Find the corresponding file in repoContent and update its status
        const fileIndex = repoContent.findIndex(file => file.id === fileContentRepo.id);
        if (fileIndex !== -1) {
          // Update the file's status in repoContent
          repoContent[fileIndex] = {
            ...repoContent[fileIndex],
            status: "Modified"
          };
        }

        commitMessage= "";    //set commitMessage to empty

      repoContent.branches = [repoContent.branches];
      repoContent = [...repoContent];

    }
  }



</script>

<section class="hacker">
  <div class="hacker-container" data-testid="hackerContent">
    <!-- problems section -->
    <div class="problem-box z-50" class:problem={isProblemBox}>
      <div
        class="d-flex justify-content-between align-items-center px-3 py-4 border-bottom border-secondary"
      >
        <h5 style="font-size: 1.2rem;">
          Problem List <i
            class="bi bi-chevron-right"
            style="font-size: 15px;"
          />
        </h5>
        <i
          class="fa-solid fa-times"
          style="font-size: 18px;cursor:pointer;margin-top:-0.7rem"
          on:click={closeBox}
        />
      </div>

      <div class=" px-3 py-4">
        <strong>Recommend</strong>
        <div class="d-flex justify-content-between align-items-center">
          <span style="font-size: 12px;"
            >Recent hot questions we've picked for you.</span
          >
        </div>
      </div>

      <div class="problem-list p-3">
        <ul
          style="list-style-type: none;padding-left:0;"
          class="border border-secondary bg-slate-100"
        >
          {#each problems as { id, problemTitle, difficulty, isCompleted }}
            {#if !isCompleted}
              <li
                key={id}
                class="border-bottom border-secondary p-2 problem-list-hover"
                style="cursor: pointer;"
              >
                <div class="d-flex justify-content-between">
                  <div>
                    <span class="ms-2">{problemTitle}</span>
                  </div>
                  <div style="opacity: 0.7;">{difficulty}</div>
                </div>
              </li>
            {/if}
          {/each}
        </ul>
      </div>

      <div class=" px-3 py-4">
        <strong>Completed</strong>
      </div>
      <div class="problem-list p-3">
        <ul
          style="list-style-type: none;padding-left:0;"
          class="border border-secondary bg-slate-100"
        >
          {#each problems as { id, problemTitle, difficulty, isCompleted }}
            {#if isCompleted}
              <li
                key={id}
                class="border-bottom border-secondary p-2 problem-list-hover"
                style="cursor: pointer;"
                class:completed={isCompleted}
              >
                <div class="d-flex justify-content-between">
                  <div>
                    {#if isCompleted}
                      <i class="fa-solid text-success fa-check" />
                    {/if}
                    <span class="ms-2">{problemTitle}</span>
                  </div>
                  <div style="opacity: 0.7;">{difficulty}</div>
                </div>
              </li>
            {/if}
          {/each}
        </ul>
      </div>
    </div>

    {#if isMessageBox}
      <div class="message-box">
        <!-- <Message /> -->
      </div>
    {/if}
    <!-- top navbar -->
    <nav class="navbarStar">
      <div class="flex justify-between items-center px-2 pt-1 pb-0">
        <div class="">
          <div class="flex gap-2 items-center subnav">
            <div class="mx-1 md:block hidden">
              <i
                on:click={openSideMenuList}
                class="fa-solid text-gray-500 fa-bars"
                style="font-size: 15px;"
              />
            </div>
            <div>
              <button
                on:click={showProblemBox}
                class="btn px-2 py-1 text-white"
                style="font-size: 10px;font-weight:500;background-color:var(--bs-danger)"
              >
                <i class="bi bi-menu-button-wide" />
                Problem List
              </button>
            </div>
            <div class="d-inline-flex align-items-center">
              <button class="btn btn-light py-0 px-2"
                ><i
                  class="fa-solid fa-chevron-left"
                  style="font-size: 10px;"
                /></button
              >
              <button class="btn btn-light py-1 px-2 mx-1"
                ><i
                  class="fa-solid fa-chevron-right"
                  style="font-size: 10px;"
                /></button
              >

              <button
                class="btn btn-light py-0 px-1 mx-1"
                data-testid="tasksButton"
                on:click={showTaskListBox}
                style="font-size:12px">Tasks</button
              >
              <!-- Example single danger button -->
              {#if playedId}
                <button
                  style="font-size:12px"
                  class="btn btn-secondary py-1 px-1 ms-2"
                  on:click={showTaskDropdown}>{playedId}</button
                >
              {/if}
              {#if showtaskdropdown}
                <div class="workstatuspopup p-2" data-testid="test-case-task">
                  <div class="py-2 text-end">
                    <i
                      class="fa-solid fa-times me-2"
                      on:click={() => (showtaskdropdown = false)}
                    ></i>
                  </div>
                  <div class="d-flex gap-2">
                    <input
                      type="text"
                      data-testid="inputValue"
                      class="form-control"
                      bind:value={inputValue}
                      placeholder="Untitled text.."
                      style="font-size:12px"
                    />
                    <select
                      name=""
                      id=""
                      class="form-control"
                      bind:value={selectedOption}
                    >
                      {#each tasks as task (task.id)}
                        {#if task.id === playedId}
                          {#each task.testCase as test}
                            <option value={test.value}>
                              {test.value}
                            </option>
                          {/each}
                        {/if}
                      {/each}
                    </select>
                    <div class="alert alert-primary py-1 px-1 ms-2 m-0">
                      {millisecondsToTime(timersub)}
                    </div>
                    <button
                      on:click={handleDoneWork}
                      class="btn btn-primary py-1 px-1 mx-1"
                      style="font-size:12px">Done</button
                    >
                  </div>
                  {#if isWork}
                    <div class="mt-3">
                      <div class="table-responsive w-100">
                        <table class="table w-100">
                          <thead>
                            <tr style="font-size:14px">
                              <th>Test Case</th>
                              <th>Status</th>
                              <th>Time taken</th>
                            </tr>
                          </thead>
                          <tbody>
                            {#each taskDetails as task}
                              <tr style="font-size:13px;cursor:pointer">
                                <td>{task.selectedOptionValue}</td>
                                <td>{task.statusValue}</td>
                                <td>{task.timeTakenTask}</td>
                              </tr>
                            {/each}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  {/if}
                </div>
              {/if}

              {#if playedId}
                <div
                  style="cursor:pointer"
                  class="d-flex px-1"
                  on:click={showTimerButtons}
                >
                  <div class="alert alert-primary py-1 px-1 ms-2 m-0">
                    {millisecondsToTime(timerStartUp)}
                  </div>
                  <div class="alert alert-danger py-1 px-1 ms-2 m-0">
                    {millisecondsToTime(timerStartDown)}
                  </div>
                </div>
                <div class="buttonspopup">
                  <button
                    class="btn btn-light btn-sm py-1 px-2"
                    on:click={startTimer}>Start</button
                  >
                  {#if selectedTaskForTimer.isPause}
                    <button
                      class="btn btn-light btn-sm py-1 px-2"
                      on:click={pauseTimer}>Pause</button
                    >
                  {/if}
                  <button
                    class="btn btn-light btn-sm py-1 px-2"
                    on:click={stopTimer}>Stop</button
                  >
                </div>
              {/if}
            </div>
          </div>
        </div>
        <div class="text-end">
          <button class="btn btn-info me-2 py-0 px-2" on:click={showCalendar}>
            <i
              class="fa-solid fa-calendar"
              style="font-size: 11px;cursor:pointer"
            />
          </button>

          {#if showcalendar}
            <!-- <Calendar /> -->
          {/if}

          <button class="btn btn-light me-2 py-0 px-2" on:click={splitbox}>
            <i
              class="fa-solid fa-table-columns"
              style="font-size: 10px;cursor:pointer"
            />
          </button>

          <div class="dropdown">
            <div tabindex="0" role="button" class="btn m-1 text-xs font-medium">
              Theme
            </div>
            <ul
              tabindex="0"
              class="dropdown-content z-[1] menu p-2 shadow rounded-box w-52"
            >
              <li><a on:click={() => changeTheme("light")}>light</a></li>
              <li><a on:click={() => changeTheme("dark")}>dark</a></li>
              <li><a on:click={() => changeTheme("retro")}>retro</a></li>
            </ul>
          </div>
          <!-- Dropdown menu -->
          <button
            class="btn btn-outline-success mx-2 px-1"
            style="font-size: 10px;color:lightgreen;border-color:lightgreen"
            ><i class="bi bi-person" /> Invite</button
          >
          <button class="btn btn-outline-danger px-2" style="font-size: 10px;"
            >Close and View Report</button
          >
          <button
            class="btn mx-1 px-2 text-white"
            style="font-size:10px;background-color:var(--bs-danger);"
            ><i class="bi bi-camera-video" /></button
          >
          <button
            class="btn bg-success text-white px-2"
            on:click={showMessageBox}
            style="font-size:10px"
            ><i class="bi bi-chat-left-dots-fill" /></button
          >
          <button
            class="btn btn-primary py-1 px-1 mx-1"
            on:click={loginPopup}
            style="font-size:12px">Login</button
          >
        </div>
      </div>
    </nav>

    <!-- mobile navbar -->

    <nav class="mobileNavbar">
      <div class="flex justify-between items-center px-2 pt-1 pb-1 mobileNav">
        <div class="flex items-center gap-2">
          <div class="mx-1 md:block hidden">
            <i
            on:click={openSideMenuList}
              class="fa-solid text-gray-500 fa-bars"
              style="font-size: 15px;"
            />
          </div>
          <button
            class="btn btn-light py-0 px-1 mx-1"
            data-testid="tasksButton"
            on:click={showTaskListBox}
            style="font-size:12px">Tasks</button
          >
          <!-- Example single danger button -->
          {#if playedId}
            <button
              style="font-size:12px"
              class="btn btn-secondary py-1 px-1 ms-2"
              on:click={showTaskDropdown}>{playedId}</button
            >
          {/if}
          {#if showtaskdropdown}
            <div class="workstatuspopup p-2" data-testid="test-case-task">
              <div class="py-2 text-end">
                <i
                  class="fa-solid fa-times me-2"
                  on:click={() => (showtaskdropdown = false)}
                ></i>
              </div>
              <div class="d-flex gap-2">
                <input
                  type="text"
                  data-testid="inputValue"
                  class="form-control"
                  bind:value={inputValue}
                  placeholder="Untitled text.."
                  style="font-size:12px"
                />
                <select
                  name=""
                  id=""
                  class="form-control"
                  bind:value={selectedOption}
                >
                  {#each tasks as task (task.id)}
                    {#if task.id === playedId}
                      {#each task.testCase as test}
                        <option value={test.value}>
                          {test.value}
                        </option>
                      {/each}
                    {/if}
                  {/each}
                </select>
                <div class="alert alert-primary py-1 px-1 ms-2 m-0">
                  {millisecondsToTime(timersub)}
                </div>
                <button
                  on:click={handleDoneWork}
                  class="btn btn-primary py-1 px-1 mx-1"
                  style="font-size:12px">Done</button
                >
              </div>
              {#if isWork}
                <div class="mt-3">
                  <div class="table-responsive w-100">
                    <table class="table w-100">
                      <thead>
                        <tr style="font-size:14px">
                          <th>Test Case</th>
                          <th>Status</th>
                          <th>Time taken</th>
                        </tr>
                      </thead>
                      <tbody>
                        {#each taskDetails as task}
                          <tr style="font-size:13px;cursor:pointer">
                            <td>{task.selectedOptionValue}</td>
                            <td>{task.statusValue}</td>
                            <td>{task.timeTakenTask}</td>
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  </div>
                </div>
              {/if}
            </div>
          {/if}

          {#if playedId}
            <div
              style="cursor:pointer"
              class="d-flex px-1"
              on:click={showTimerButtons}
            >
              <div class="alert alert-primary py-1 px-1 ms-2 m-0">
                {millisecondsToTime(timerStartUp)}
              </div>
              <div class="alert alert-danger py-1 px-1 ms-2 m-0">
                {millisecondsToTime(timerStartDown)}
              </div>
            </div>
            <div class="buttonspopup">
              <button
                class="btn btn-light btn-sm py-1 px-2"
                on:click={startTimer}>Start</button
              >
              {#if selectedTaskForTimer.isPause}
                <button
                  class="btn btn-light btn-sm py-1 px-2"
                  on:click={pauseTimer}>Pause</button
                >
              {/if}
              <button
                class="btn btn-light btn-sm py-1 px-2"
                on:click={stopTimer}>Stop</button
              >
            </div>
          {/if}
        </div>

        <div>
          <button
            class="btn btn-primary py-0 px-2 mx-1"
            on:click={loginPopup}
            style="font-size:12px">Login</button
          >
          <button
          on:click={handleRightSidebar}
          class="bg-transparent border-0   py-0 px-2 mx-1"
          style="font-size:12px"><i class="fa-solid fa-gear text-gray-500 text-xs"></i></button
        >
        </div>

      
        

      </div>
    </nav>


    {#if openRightSidebar}
    <aside class="mobileRightSidebar">
      <div class="text-end px-2 py-1">
        <i class="fa-solid fa-times cursor-pointer" on:click={()=>openRightSidebar=false} />
      </div>
      <ul class="flex flex-col justify-center gap-3 p-3">
    
        <li
          class="flex flex-col gap-1 items-center hover:bg-gray-200 cursor-pointer px-1 py-1 rounded-sm"
          on:click={showProblemBox}
        >
          <i class="bi bi-menu-button-wide" />
          <span class="text-xs tracking-[0.05rem]"> Problems </span>
        </li>

        <li
          on:click={showCalendar}
          class="flex flex-col gap-1 items-center hover:bg-gray-200 cursor-pointer px-1 py-1 rounded-sm"
        >
          <i class="fa-solid fa-calendar" />
          <span class="text-xs tracking-[0.05rem]"> Calendar </span>
        </li>

        <li
          class="flex flex-col gap-1 items-center hover:bg-gray-200 cursor-pointer px-1 py-1 rounded-sm"
        >
          <i class="fa-solid fa-moon"></i>
          <div class="dropdown">
            <div
              tabindex="0"
              role="button"
              class="m-0 text-xs tracking-[0.05rem]"
            >
              Theme
            </div>
            <ul
              tabindex="0"
              class="dropdown-content z-[50] bg-white menu p-2 shadow rounded-box w-52"
            >
              <li><a on:click={() => changeTheme("light")}>light</a></li>
              <li><a on:click={() => changeTheme("dark")}>dark</a></li>
              <li><a on:click={() => changeTheme("retro")}>retro</a></li>
            </ul>
          </div>
        </li>
        <li
          class="flex flex-col gap-1 items-center hover:bg-gray-200 cursor-pointer px-1 py-1 rounded-sm"
        >
          <i class="fa-regular fa-user" />
          <span class="text-xs tracking-[0.05rem]"> Invite </span>
        </li>

        <li
          class="flex flex-col gap-1 items-center hover:bg-gray-200 cursor-pointer px-1 py-1 rounded-sm"
        >
          <svg
            class="w-6 h-6 text-gray-800 dark:text-white"
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
              d="M14 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 11-6-2V9l6-2v10Z"
            />
          </svg>

          <span class="text-xs tracking-[0.05rem]"> Video Call </span>
        </li>
        <li
          class="flex flex-col gap-1 items-center hover:bg-gray-200 cursor-pointer px-1 py-1 rounded-sm"
          on:click={showMessageBox}
        >
          <i class="bi bi-chat-left-dots-fill" />
          <span class="text-xs tracking-[0.05rem]"> Message </span>
        </li>
      </ul>
    </aside>

    {/if}


    <!-- mobile sidebar end -->

    <!-- theme button  -->
    {#if tasklistbox}
      <div
        data-testid="taskListBox"
        class="border-secondary shadow-sm bg-gray-100"
        in:fly={{ y: 200, duration: 1000 }}
        out:fade
      >
        <div class="p-3">
          <div class="row">
            <div class="col-lg-4 me-4">
              <h5>My Task List</h5>
              <br />
              <div
                class="card p-1 bg-slate-200"
                id="card"
                style="color:#fff;position:relative"
              >
                <div class="table-responsive w-100">
                  <table
                    class="table w-100 text-white"
                    data-testid="table-task"
                  >
                    <thead>
                      <tr style="font-size:14px">
                        <th>Task ID</th>
                        <th>Name</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {#each tasks as task (task.id)}
                        <tr style="font-size:13px;cursor:pointer">
                          <td
                            data-testid={`viewTask${task.id}`}
                            on:click={() => viewTaskAllDetails(task.id)}
                            >{task.id}</td
                          >
                          <td on:click={() => viewTaskAllDetails(task.id)}
                            >{task.name}</td
                          >

                          <td class="">
                            <i
                              data-testid={`faPenButton${task.id}`}
                              id="faPenButton"
                              style="font-size:11px;cursor:pointer"
                              class="fa-solid fa-pen"
                              on:click={() => showEditOption(task.id)}
                            ></i>
                            <i
                              data-testid={`faPlayButton${task.id}`}
                              style="font-size:11px;cursor:pointer"
                              class="fa-solid fa-play ms-3"
                              on:click={() => playTask(task.id)}
                            ></i>
                          </td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
                {#if editTaskId !== null}
                  <div
                    data-testid={`editForm${editTaskId}`}
                    class="editoption"
                    in:fly={{ y: 200, duration: 2000 }}
                    out:fade
                  >
                    <!-- Popup content -->
                    <div class="d-flex gap-2 align-items-center">
                      <div>
                        <textarea
                          data-testid="updateValueTextarea"
                          class="form-control w-100 p-1 updateValueTextarea"
                          rows="2"
                          cols="25"
                          style="font-size:14px;outline:0"
                          bind:value={editedTaskName}
                        />
                        <button
                          data-testid="updateTaskBtn"
                          style="font-size:14px"
                          class="btn btn-sm btn-primary mt-2 updateTaskBtn"
                          on:click={updateTask}>Update</button
                        >
                      </div>
                      <div
                        class="d-flex flex-column"
                        style="margin-top:-1.5rem"
                      >
                        <button
                          data-testid="deleteTaskBtn"
                          style="font-size:14px"
                          class="btn btn-sm btn-light mt-2 deleteTaskBtn"
                          on:click={() => deleteTask(editTaskId)}
                          >Archive</button
                        >
                        <button
                          style="font-size:14px"
                          class="btn btn-sm btn-light mt-2"
                          on:click={updateTask}>View</button
                        >
                      </div>
                    </div>
                  </div>
                  <div class="overlay" on:click={closeEditOption}></div>
                {/if}
              </div>
            </div>
            {#if selectedTask}
              <div
                class="col-lg-6 ms-2"
                data-testid={`taskDetail${selectedTask.id}`}
              >
                <h5>Task Details</h5>
                <br />
                <div>
                  <span class="font600 d-inline-block" style="font-weight:600"
                    >ID :
                  </span>
                  &nbsp;&nbsp;{selectedTask.id}
                </div>
                <div>
                  <span
                    class="font600 d-inline-block my-2"
                    style="font-weight:600"
                    >Task Name :
                  </span>
                  &nbsp;&nbsp;{selectedTask.name}
                </div>
                <div>
                  <span class="font600" style="font-weight:600"
                    >Description :
                  </span>
                  &nbsp;&nbsp;{selectedTask.details}
                </div>
                <div>
                  <span
                    class="font600 d-inline-block my-2"
                    style="font-weight:600"
                    >isPause :
                  </span>
                  &nbsp;&nbsp;{selectedTask.isPause}
                </div>
                <div>
                  <span class="font600" style="font-weight:600">Time : </span>
                  &nbsp;&nbsp;{selectedTask.time} Seconds
                </div>
                <div>
                  <span
                    class="font600 d-inline-block my-2"
                    style="font-weight:600"
                    >Test Cases :
                  </span>
                  &nbsp;&nbsp;
                  {#each selectedTask.testCase as test}
                    <li class="ms-5">{test.value}</li>
                  {/each}

                  <br />
                  <input
                    type="text"
                    class="form-control"
                    style="font-size:13px"
                    bind:value={testcasesvalue}
                    placeholder="add more test cases..."
                  />
                  <button
                    class="btn btn-primary btn-sm mt-1"
                    on:click={() => saveNewTestCases(selectedTask)}
                    style="font-size:13px">Save</button
                  >
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {:else if loginpopup}
      <div
        class="loginpopup mt-4"
        data-testid="loginpopup"
        in:fly={{ y: 200, duration: 2000 }}
        out:fade
      >
        <section class="vh-100">
          <div class="container-fluid h-custom">
            <div
              class="row d-flex justify-content-center align-items-center h-100"
            >
              <div class="col-md-9 col-lg-6 col-xl-5">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                  class="img-fluid"
                  alt="Sample image"
                />
              </div>
              <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                <form>
                  <div
                    class="d-flex flex-row align-items-center justify-content-center justify-content-lg-start"
                  >
                    <p class="lead fw-normal mb-0 me-3">Sign in with</p>
                    <button
                      type="button"
                      class="btn btn-primary btn-floating mx-1"
                    >
                      <i class="fab fa-facebook-f"></i>
                    </button>

                    <button
                      type="button"
                      class="btn btn-primary btn-floating mx-1"
                    >
                      <i class="fab fa-twitter"></i>
                    </button>

                    <button
                      type="button"
                      class="btn btn-primary btn-floating mx-1"
                    >
                      <i class="fab fa-linkedin-in"></i>
                    </button>
                  </div>

                  <div class="divider d-flex align-items-center my-4">
                    <p class="text-center fw-bold mx-3 mb-0">Or</p>
                  </div>

                  <!-- Email input -->
                  <div class="form-outline mb-4">
                    <input
                      type="email"
                      id="form3Example3"
                      class="form-control form-control-lg"
                      placeholder="Enter a valid email address"
                    />
                  </div>

                  <!-- Password input -->
                  <div class="form-outline mb-3">
                    <input
                      type="password"
                      id="form3Example4"
                      class="form-control form-control-lg"
                      placeholder="Enter password"
                    />
                  </div>

                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <!-- Checkbox -->
                    <div class="form-check mb-0">
                      <input
                        class="form-check-input me-2"
                        type="checkbox"
                        value=""
                        id="form2Example3"
                      />
                      <label class="form-check-label" for="form2Example3">
                        Remember me
                      </label>
                    </div>
                    <a href="#!" class="text-body">Forgot password?</a>
                  </div>

                  <div class="text-center text-lg-start mt-4 pt-2">
                    <button
                      type="button"
                      class="btn btn-primary btn-lg"
                      style="padding-left: 2.5rem; padding-right: 2.5rem;"
                      >Login</button
                    >
                    <p class="small fw-bold mt-2 pt-1 mb-0">
                      Don't have an account? <a href="#!" class="link-danger"
                        >Register</a
                      >
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    {:else if databaseView}
      <div
        class="flex border-t"
        data-testid="databaseView"
        in:fly={{ y: 200, duration: 1000 }}
        out:fade
      >
        <div
          class="toggleFirstCol bg-slate-50 flex flex-column items-center gap-3 w-[6vw] {activeSideMenuList
            ? 'md:w-[8vw] w-[6vw]'
            : 'md:hidden px-2 '}"
        >
          <div on:click={toggleFirstCol} class="mt-2.5">
            <i class="bi bi-list" style="font-size:17px" />
          </div>

          <div on:click={toggleCollectionList} class="">
            <i class="fa-regular fa-user" style="font-size:17px" />
          </div>

          <div
            class={` d-flex px-4   flex-column align-items-center gap-1 cursor-pointer ${activeIndex === 1 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
            on:click={toggleMenuCol}
          >
            <i class="fa-regular fa-file" />
            <span style="font-size:10px">File</span>
          </div>

          <div
            class={`d-flex px-2 flex-column align-items-center cursor-pointer ${activeIndex === 2 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
            on:click={toggleCollectionList}
          >
            <i class="bi bi-collection"></i>
            <span style="font-size:10px">Collections</span>
          </div>

          <div
            class={`d-flex px-1 flex-column align-items-center cursor-pointer ${activeIndex === 3 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
            on:click={toggleEnvironmentSection}
          >
            <i class="bi bi-collection"></i>
            <span style="font-size:10px">Environments</span>
          </div>
          <div
            class={`  d-flex px-2 flex-column align-items-center cursor-pointer ${activeIndex === 5 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
            on:click={handleFrontendView}
          >
            <i class="fa-brands fa-dev"></i>
            <span style="font-size:10px">Frontend</span>
          </div>
          <div
            on:click={handleBackenedView}
            class={`d-flex px-2 flex-column align-items-center cursor-pointer ${activeIndex === 6 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
          >
            <i class="fa-brands fa-codepen"></i>
            <span style="font-size:10px">Backened</span>
          </div>
          <div
            on:click={handleApiView}
            class={`  d-flex px-3 flex-column align-items-center cursor-pointer ${activeIndex === 7 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
          >
            <i class="bi bi-collection"></i>
            <span style="font-size:10px">Api</span>
          </div>

          <div
            on:click={handleDatabaseView}
            class={` d-flex px-2 flex-column align-items-center cursor-pointer ${activeIndex === 8 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
          >
            <i class="bi bi-database"></i>
            <span style="font-size:10px">Database</span>
          </div>

          <div
            on:click={handleLogView}
            class={` d-flex px-4 flex-column align-items-center cursor-pointer ${activeIndex === 9 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
          >
            <i class="bi bi-collection"></i>
            <span style="font-size:10px">Log</span>
          </div>
          <div
            on:click={handleServerView}
            class={` d-flex px-4 flex-column align-items-center cursor-pointer ${activeIndex === 10 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
          >
            <i class="fa-solid fa-server"></i>
            <span style="font-size:10px">Server</span>
          </div>

          <div
            class={`px-4 cursor-pointer ${activeIndex === 4 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
            on:click={searchBox}
          >
            <i class="fa-solid fa-search" />
          </div>
        </div>
        <DatabaseView {activeSideMenuList} />
      </div>
    {:else if logView}
      <div
        class="flex border-t"
        data-testid="logView"
        in:fly={{ y: 200, duration: 1000 }}
        out:fade
      >
        <div
          class="toggleFirstCol bg-slate-50 flex flex-column items-center gap-3 w-[6vw] {activeSideMenuList
            ? 'md:w-[8vw] w-[6vw]'
            : 'md:hidden px-2 '}"
        >
          <div on:click={toggleFirstCol} class="mt-2.5 iconList">
            <i class="bi bi-list" style="font-size:17px" />
          </div>
          <i class="fa-solid fa-times text-gray-600 closeIcon" on:click={()=>activeSideMenuList=false}></i>

          <div on:click={toggleCollectionList} class="">
            <i class="fa-regular fa-user" style="font-size:17px" />
          </div>

          <div
            class={` d-flex px-4   flex-column align-items-center gap-1 cursor-pointer ${activeIndex === 1 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
            on:click={toggleMenuCol}
          >
            <i class="fa-regular fa-file" />
            <span style="font-size:10px">File</span>
          </div>

          <div
            class={`d-flex px-2 flex-column align-items-center cursor-pointer ${activeIndex === 2 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
            on:click={toggleCollectionList}
          >
            <i class="bi bi-collection"></i>
            <span style="font-size:10px">Collections</span>
          </div>

          <div
            class={`d-flex px-1 flex-column align-items-center cursor-pointer ${activeIndex === 3 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
            on:click={toggleEnvironmentSection}
          >
            <i class="bi bi-collection"></i>
            <span style="font-size:10px">Environments</span>
          </div>
          <div
            class={`  d-flex px-2 flex-column align-items-center cursor-pointer ${activeIndex === 5 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
            on:click={handleFrontendView}
          >
            <i class="fa-brands fa-dev"></i>
            <span style="font-size:10px">Frontend</span>
          </div>
          <div
            on:click={handleBackenedView}
            class={`d-flex px-2 flex-column align-items-center cursor-pointer ${activeIndex === 6 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
          >
            <i class="fa-brands fa-codepen"></i>
            <span style="font-size:10px">Backened</span>
          </div>
          <div
            on:click={handleApiView}
            class={`  d-flex px-3 flex-column align-items-center cursor-pointer ${activeIndex === 7 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
          >
            <i class="bi bi-collection"></i>
            <span style="font-size:10px">Api</span>
          </div>

          <div
            on:click={handleDatabaseView}
            class={` d-flex px-2 flex-column align-items-center cursor-pointer ${activeIndex === 8 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
          >
            <i class="bi bi-database"></i>
            <span style="font-size:10px">Database</span>
          </div>

          <div
            on:click={handleLogView}
            class={` d-flex px-4 flex-column align-items-center cursor-pointer ${activeIndex === 9 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
          >
            <i class="bi bi-collection"></i>
            <span style="font-size:10px">Log</span>
          </div>

          <div
            on:click={handleServerView}
            class={` d-flex px-4 flex-column align-items-center cursor-pointer ${activeIndex === 10 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
          >
            <i class="fa-solid fa-server"></i>
            <span style="font-size:10px">Server</span>
          </div>

          <div
            class={`px-4 cursor-pointer ${activeIndex === 4 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
            on:click={searchBox}
          >
            <i class="fa-solid fa-search" />
          </div>
        </div>
        <LogView />
      </div>
    {:else if apiView}
      <div
        class="flex border-t"
        data-testid="apiView"
        in:fly={{ y: 200, duration: 1000 }}
        out:fade
      >
        <div
          class="toggleFirstCol bg-slate-50 flex flex-column items-center gap-3 w-[6vw] {activeSideMenuList
            ? 'md:w-[8vw] w-[6vw]'
            : 'md:hidden px-2 '}"
        >
          <div on:click={toggleFirstCol} class="mt-2.5">
            <i class="bi bi-list" style="font-size:17px" />
          </div>

          <div on:click={toggleCollectionList} class="">
            <i class="fa-regular fa-user" style="font-size:17px" />
          </div>

          <div
            class={` d-flex px-4   flex-column align-items-center gap-1 cursor-pointer ${activeIndex === 1 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
            on:click={toggleMenuCol}
          >
            <i class="fa-regular fa-file" />
            <span style="font-size:10px">File</span>
          </div>

          <div
            class={`d-flex px-2 flex-column align-items-center cursor-pointer ${activeIndex === 2 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
            on:click={toggleCollectionList}
          >
            <i class="bi bi-collection"></i>
            <span style="font-size:10px">Collections</span>
          </div>

          <div
            class={`d-flex px-1 flex-column align-items-center cursor-pointer ${activeIndex === 3 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
            on:click={toggleEnvironmentSection}
          >
            <i class="bi bi-collection"></i>
            <span style="font-size:10px">Environments</span>
          </div>
          <div
            class={`  d-flex px-2 flex-column align-items-center cursor-pointer ${activeIndex === 5 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
            on:click={handleFrontendView}
          >
            <i class="fa-brands fa-dev"></i>
            <span style="font-size:10px">Frontend</span>
          </div>
          <div
            on:click={handleBackenedView}
            class={`d-flex px-2 flex-column align-items-center cursor-pointer ${activeIndex === 6 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
          >
            <i class="fa-brands fa-codepen"></i>
            <span style="font-size:10px">Backened</span>
          </div>
          <div
            on:click={handleApiView}
            data-testid="apiViewButton"
            class={`  d-flex px-3 flex-column align-items-center cursor-pointer ${activeIndex === 7 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
          >
            <i class="bi bi-collection"></i>
            <span style="font-size:10px">Api</span>
          </div>

          <div
            on:click={handleDatabaseView}
            class={` d-flex px-2 flex-column align-items-center cursor-pointer ${activeIndex === 8 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
          >
            <i class="bi bi-database"></i>
            <span style="font-size:10px">Database</span>
          </div>

          <div
            on:click={handleLogView}
            class={` d-flex px-4 flex-column align-items-center cursor-pointer ${activeIndex === 9 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
          >
            <i class="bi bi-collection"></i>
            <span style="font-size:10px">Log</span>
          </div>

          <div
            on:click={handleServerView}
            class={` d-flex px-4 flex-column align-items-center cursor-pointer ${activeIndex === 10 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
          >
            <i class="fa-solid fa-server"></i>
            <span style="font-size:10px">Server</span>
          </div>

          <div
            class={`px-4 cursor-pointer ${activeIndex === 4 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
            on:click={searchBox}
          >
            <i class="fa-solid fa-search" />
          </div>
        </div>
        <ApiView {activeSideMenuList} />
      </div>
    {:else if serverView}
      <div
        class="flex border-t"
        data-testid="serverView"
        in:fly={{ y: 200, duration: 1000 }}
        out:fade
      >
        <div
          class="toggleFirstCol bg-slate-50 flex flex-column items-center gap-3 w-[6vw] {activeSideMenuList
            ? 'md:w-[8vw] w-[6vw]'
            : 'md:hidden px-2 '}"
        >
          <div on:click={toggleFirstCol} class="mt-2.5 iconList">
            <i class="bi bi-list" style="font-size:17px" />
          </div>
          <i class="fa-solid fa-times text-gray-600 closeIcon" on:click={()=>activeSideMenuList=false}></i>

          <div on:click={toggleCollectionList} class="">
            <i class="fa-regular fa-user" style="font-size:17px" />
          </div>

          <div
            class={` d-flex px-4   flex-column align-items-center gap-1 cursor-pointer ${activeIndex === 1 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
            on:click={toggleMenuCol}
          >
            <i class="fa-regular fa-file" />
            <span style="font-size:10px">File</span>
          </div>

          <div
            class={`d-flex px-2 flex-column align-items-center cursor-pointer ${activeIndex === 2 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
            on:click={toggleCollectionList}
          >
            <i class="bi bi-collection"></i>
            <span style="font-size:10px">Collections</span>
          </div>

          <div
            class={`d-flex px-1 flex-column align-items-center cursor-pointer ${activeIndex === 3 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
            on:click={toggleEnvironmentSection}
          >
            <i class="bi bi-collection"></i>
            <span style="font-size:10px">Environments</span>
          </div>
          <div
            class={`  d-flex px-2 flex-column align-items-center cursor-pointer ${activeIndex === 5 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
            on:click={handleFrontendView}
          >
            <i class="fa-brands fa-dev"></i>
            <span style="font-size:10px">Frontend</span>
          </div>
          <div
            on:click={handleBackenedView}
            class={`d-flex px-2 flex-column align-items-center cursor-pointer ${activeIndex === 6 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
          >
            <i class="fa-brands fa-codepen"></i>
            <span style="font-size:10px">Backened</span>
          </div>
          <div
            on:click={handleApiView}
            data-testid="apiViewButton"
            class={`  d-flex px-3 flex-column align-items-center cursor-pointer ${activeIndex === 7 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
          >
            <i class="bi bi-collection"></i>
            <span style="font-size:10px">Api</span>
          </div>

          <div
            on:click={handleDatabaseView}
            class={` d-flex px-2 flex-column align-items-center cursor-pointer ${activeIndex === 8 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
          >
            <i class="bi bi-database"></i>
            <span style="font-size:10px">Database</span>
          </div>

          <div
            on:click={handleLogView}
            class={` d-flex px-4 flex-column align-items-center cursor-pointer ${activeIndex === 9 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
          >
            <i class="bi bi-collection"></i>
            <span style="font-size:10px">Log</span>
          </div>

          <div
            on:click={handleServerView}
            class={` d-flex px-3 flex-column align-items-center cursor-pointer ${activeIndex === 10 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
          >
            <i class="fa-solid fa-server"></i>
            <span style="font-size:10px">Server</span>
          </div>

          <div
            class={`px-4 cursor-pointer ${activeIndex === 4 ? "active" : "hover:text-red-800"}`}
            style="cursor: pointer;font-size:17px"
            on:click={searchBox}
          >
            <i class="fa-solid fa-search" />
          </div>
        </div>
        <ServerView {activeSideMenuList} />
      </div>
    {:else}
      <div
        in:fly={{ y: 200, duration: 1000 }}
        out:fade
        data-testid="mainContent"
        class="hacker-box bg-slate-100 border-top border-secondary"
      >
        <div class="row">
          {#if isFirstColContent}
            {#if taskDescription}
              <div class="col-3 first-col bg-gray-100">
                <div
                  class="d-flex justify-content-between task-box"
                  style="padding:0.58rem 0.3rem ;"
                >
                  <div>
                    Task Description&nbsp;<i class="bi bi-pencil-square" />
                  </div>
                  <div on:click={toggleFirstCol}>
                    <i class="bi bi-list" />
                  </div>
                </div>

                <div>
                  <div
                    class="accordion accordion-flush"
                    id="accordionFlushExample"
                  >
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="flush-headingOne">
                        <button
                          class="accordion-button collapsed bg-green-100"
                          style="font-size:14px;"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#flush-collapseOne"
                          aria-expanded="false"
                          aria-controls="flush-collapseOne"
                        >
                          Task Content
                        </button>
                      </h2>
                      <div
                        id="flush-collapseOne"
                        class="accordion-collapse collapse"
                        aria-labelledby="flush-headingOne"
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div class="accordion-body bg-gray-50">
                          <div>
                            <div class="task-content">
                              <p style="font-size: 13px; " class="mt-2 p-2">
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit. Dolor, fuga magni consequuntur
                                laboriosam cupiditate aliquid! Blanditiis
                                laboriosam placeat ab omnis, eaque sed sit,
                                quod, excepturi quas inventore repellat. Labore
                                reiciendis, neque ducimus natus iusto dolores
                                possimus beatae praesentium corporis nesciunt?
                                Illo ipsam vero earum quisquam tempore velit
                                itaque, sit temporibus!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="flush-headingFour">
                        <button
                          class="accordion-button collapsed bg-green-100"
                          style="font-size:14px;"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#flush-collapseFour"
                          aria-expanded="false"
                          aria-controls="flush-collapseFour"
                        >
                          Test Cases
                        </button>
                      </h2>
                      <div
                        id="flush-collapseFour"
                        class="accordion-collapse collapse"
                        aria-labelledby="flush-headingFour"
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div class="accordion-body bg-gray-50">
                          <div>
                            <input
                              type="search"
                              name=""
                              id=""
                              class="w-100 p-1"
                              style="border: 0;outline:0"
                              placeholder="search.."
                            />
                            <div class="mt-4">
                              <TestList />
                              <div class="text-end">
                                <button
                                  class="btn btn-light"
                                  style="font-size: 15px;">Run</button
                                >
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="flush-headingOne">
                        <button
                          class="accordion-button collapsed bg-green-100"
                          style="font-size:14px;"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#flush-collapseOne"
                          aria-expanded="false"
                          aria-controls="flush-collapseOne"
                        >
                          Discussion
                        </button>
                      </h2>
                      <div
                        id="flush-collapseOne"
                        class="accordion-collapse collapse"
                        aria-labelledby="flush-headingOne"
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div class="accordion-body bg-gray-50">
                          <div>
                            <input
                              type="text"
                              class="border-0 w-100 p-2"
                              style="outline:0;border:0;"
                            />
                            <div class="text-end">
                              <button
                                class="btn btn-secondary mt-2"
                                style="font-size: 13px;">Comment</button
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="flush-headingTwo">
                        <button
                          class="accordion-button collapsed bg-green-100"
                          type="button"
                          style="font-size:14px;"
                          data-bs-toggle="collapse"
                          data-bs-target="#flush-collapseTwo"
                          aria-expanded="false"
                          aria-controls="flush-collapseTwo"
                        >
                          Similar Questions
                        </button>
                      </h2>
                      <div
                        id="flush-collapseTwo"
                        class="accordion-collapse collapse"
                        aria-labelledby="flush-headingTwo"
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div class="accordion-body bg-gray-50">
                          Placeholder content for this accordion, which is
                          intended to demonstrate the <code
                            >.accordion-flush</code
                          > class. This is the second item's accordion body. Let's
                          imagine this being filled with some actual content.
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="flush-headingThree">
                        <button
                          class="accordion-button collapsed bg-green-100"
                          type="button"
                          style="font-size:14px;"
                          data-bs-toggle="collapse"
                          data-bs-target="#flush-collapseThree"
                          aria-expanded="false"
                          aria-controls="flush-collapseThree"
                        >
                          Related Topics
                        </button>
                      </h2>
                      <div
                        id="flush-collapseThree"
                        class="accordion-collapse collapse"
                        aria-labelledby="flush-headingThree"
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div class="accordion-body bg-gray-50">
                          <button
                            class="btn btn-light"
                            style="font-size: 13px;background-color:#f4f5f7"
                            >Linked List</button
                          >
                          <button
                            class="btn btn-light"
                            style="font-size: 13px;background-color:#f4f5f7"
                            >Math</button
                          >
                          <button
                            class="btn btn-light"
                            style="font-size: 13px;background-color:#f4f5f7"
                            >Recursion</button
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            {:else}
              <div class="col-3 first-col bg-gray-100">
                <div on:click={toggleFirstCol} class="text-end m-2">
                  <i class="bi bi-list" />
                </div>
                <div class="text-center my-auto mt-3">
                  Wait for timer start...
                </div>
              </div>
            {/if}
          {:else}
            <div
              data-testid="firstColContent"
              class="toggleFirstCol bg-slate-50 flex flex-column items-center gap-3 w-[6vw] {activeSideMenuList
                ? 'md:w-[8vw] w-[6vw] '
                : 'md:hidden px-2  '}"
            >
            <i class="fa-solid fa-times text-gray-600 closeIcon" on:click={()=>activeSideMenuList=false}></i>
              <div on:click={toggleFirstCol} class="mt-2.5 iconList">
                <i class="bi bi-list" style="font-size:17px" />
              </div>

              <div on:click={toggleCollectionList} class="">
                <i class="fa-regular fa-user" style="font-size:17px" />
              </div>

              <div
                class={` d-flex px-3 flex-column align-items-center gap-1 cursor-pointer ${isSplitMenu ? (activeIndex === 1 ? "active" : "hover:text-red-800") : ""}`}
                style="cursor: pointer;font-size:17px"
                on:click={toggleMenuCol}
              >
                <i class="fa-regular fa-file" />
                <span style="font-size:10px">File</span>
              </div>

              <div
                data-testid="collectionsButton"
                class={`d-flex px-2 flex-column align-items-center cursor-pointer ${collectionList ? (activeIndex === 2 ? "active" : "hover:text-red-800") : ""}`}
                style="cursor: pointer;font-size:17px"
                on:click={toggleCollectionList}
              >
                <i class="bi bi-collection"></i>
                <span style="font-size:10px">Collections</span>
              </div>

              <div
                class={`d-flex px-1 flex-column align-items-center cursor-pointer ${environmentSection ? (activeIndex === 3 ? "active" : "hover:text-red-800") : ""}`}
                style="cursor: pointer;font-size:17px"
                on:click={toggleEnvironmentSection}
              >
                <i class="bi bi-collection"></i>
                <span style="font-size:10px">Environments</span>
              </div>
              <div
                class={`  d-flex px-2 flex-column align-items-center cursor-pointer ${activeIndex === 5 ? "active" : "hover:text-red-800"}`}
                style="cursor: pointer;font-size:17px"
                on:click={handleFrontendView}
              >
                <i class="fa-brands fa-dev"></i>
                <span style="font-size:10px">Frontend</span>
              </div>
              <div
                on:click={handleBackenedView}
                class={`d-flex px-2 flex-column align-items-center cursor-pointer ${activeIndex === 6 ? "active" : "hover:text-red-800"}`}
                style="cursor: pointer;font-size:17px"
              >
                <i class="fa-brands fa-codepen"></i>
                <span style="font-size:10px">Backened</span>
              </div>
              <div
                on:click={handleApiView}
                data-testid="apiViewButton"
                class={`  d-flex px-3 flex-column align-items-center cursor-pointer ${apiView ? (activeIndex === 7 ? "active" : "hover:text-red-800") : ""}`}
                style="cursor: pointer;font-size:17px"
              >
                <i class="bi bi-collection"></i>
                <span style="font-size:10px">Api</span>
              </div>

              <div
                data-testid="database"
                on:click={handleDatabaseView}
                class={` d-flex px-2 flex-column align-items-center cursor-pointer ${databaseView ? (activeIndex === 8 ? "active" : "hover:text-red-800") : ""}`}
                style="cursor: pointer;font-size:17px"
              >
                <i class="bi bi-database"></i>
                <span style="font-size:10px">Database</span>
              </div>

              <div
                data-testid="log"
                on:click={handleLogView}
                class={` d-flex px-4 flex-column align-items-center cursor-pointer ${logView ? (activeIndex === 9 ? "active" : "hover:text-red-800") : ""}`}
                style="cursor: pointer;font-size:17px"
              >
                <i class="bi bi-collection"></i>
                <span style="font-size:10px">Log</span>
              </div>

              <div
                data-testid="server"
                on:click={handleServerView}
                class={` d-flex px-4 flex-column align-items-center cursor-pointer ${serverView ? (activeIndex === 10 ? "active" : "hover:text-red-800") : ""}`}
                style="cursor: pointer;font-size:17px"
              >
                <i class="fa-solid fa-server"></i>
                <span style="font-size:10px">Server</span>
              </div>
              <div
                class={`px-4 cursor-pointer ${searchbox ? (activeIndex === 4 ? "active" : "hover:text-red-800") : ""}`}
                style="cursor: pointer;font-size:17px"
                on:click={searchBox}
              >
                <i class="fa-solid fa-search" />
              </div>
            </div>
          {/if}
          <!-- files -->
          {#if isSplitMenu}
            {#if searchbox}
              <div
                class="col-2 mt-1 px-2"
                style="border-right: 4px solid darkgray;width:13.666667%!important;"
              >
                <div class="text-end mx-2">
                  <i
                    class="bi bi-x"
                    on:click={searchBox}
                    style="font-size: 17px;"
                  />
                </div>
                <input
                  type="search"
                  class="w-100 form-control text-white mt-0"
                  placeholder="search..."
                  style="background-color:#0000ff14;border:0"
                />
                <hr />
                <div class="text-center mt-2">Not Found</div>
              </div>
            {:else}
              <div class="left-col file-list">
                <!-- Resizing handle -->
                <div
                  class="resize-handle-left"
                  on:mousedown={handleMouseDownLeft}
                ></div>
                <div class="text-end mt-0 mx-3">
                  <i class="bi bi-list" on:click={toggleMenuCol} />
                </div>
                <div class="flex flex-col justify-between h-[90vh]">
                  <div>
                    <!-- tasks section -->
                    <!-- accordion -->
                    <div class="bg-gray-200">
                      <!-- Header with Chevron and Ellipsis Icon -->
                      <div
                        class="flex items-center justify-between px-2 py-0 bg-gray-50"
                      >
                        <button
                          class="flex items-center text-xs font-semibold text-gray-700 hover:text-gray-900"
                          on:click={toggleCollapseTasks}
                        >
                          <i
                            class="fa-solid {isCollapsedTasks
                              ? 'fa-chevron-right'
                              : 'fa-chevron-down'}"
                            style="font-size: 9px;"
                          ></i>
                          <span class="ml-2 tracking-[0.06rem] text-gray-500">
                            Tasks</span
                          >
                        </button>
                        <!-- Dropdown Menu with Ellipsis Icon -->
                        <div class="dropdown dropdown-end dropdown-bottom">
                          <div
                            tabindex="0"
                            role="button"
                            class=" py-0 hover:bg-transparent m-0 text-gray-500"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 12h.01M12 12h.01M18 12h.01"
                              />
                            </svg>
                          </div>
                          <ul
                            tabindex="0"
                            class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                          >
                            <li><a>Action 1</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <!-- tasks content -->
                    {#if !isCollapsedTasks}
                      <div
                        class="tasks-content bg-gray-200 border-b border-gray-200 overflow-auto h-[30vh] p-2"
                      >
                        Tasks Content
                      </div>
                    {/if}

                    <!-- tree view accordion -->
                    <div class="bg-gray-200">
                      <!-- Header with Chevron and Ellipsis Icon -->
                      <div
                        class="flex items-center justify-between px-2 py-0 bg-gray-50"
                      >
                        <button
                          class="flex items-center text-xs font-semibold text-gray-700 hover:text-gray-900"
                          on:click={toggleCollapseRepos}
                        >
                          <i
                            class="fa-solid {isCollapsedRepos
                              ? 'fa-chevron-right'
                              : 'fa-chevron-down'}"
                            style="font-size: 9px;"
                          ></i>
                          <span class="ml-2 tracking-[0.06rem] text-gray-500">
                            Repos</span
                          >
                        </button>
                        <!-- Dropdown Menu with Ellipsis Icon -->
                        <div class="dropdown dropdown-end dropdown-bottom">
                          <div
                            tabindex="0"
                            role="button"
                            class=" py-0 hover:bg-transparent m-0 text-gray-500"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 12h.01M12 12h.01M18 12h.01"
                              />
                            </svg>
                          </div>
                          <ul
                            tabindex="0"
                            class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                          >
                            <li><a>Action 1</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <!-- repos content -->
                    {#if !isCollapsedRepos}
                      <div
                        class="tasks-content bg-gray-200 overflow-auto border-b border-gray-200 h-[30vh] p-2"
                      >
                        <TreeView
                          {repoContent}
                          {switchFile}
                          on:handleInfo={handleInfo}
                          on:handleBranchGraph={handleBranchGraph}
                        />
                      </div>
                    {/if}
                  </div>

                  <div class="">
                    <!-- branch accordion -->
                    <div class="bg-gray-200 border-b border-gray-400">
                      <!-- Header with Chevron and Ellipsis Icon -->
                      <div
                        class="flex items-center justify-between px-2 py-0 bg-gray-200"
                      >
                        <button
                          class="flex items-center text-xs font-semibold text-gray-700 hover:text-gray-900"
                          on:click={toggleCollapseBranch}
                        >
                          <i
                            class="fa-solid {isCollapsedBranch
                              ? 'fa-chevron-right'
                              : 'fa-chevron-down'}"
                            style="font-size: 9px;"
                          ></i>
                          <span class="ml-2 tracking-[0.06rem]"> Branch</span>
                        </button>
                        <!-- Dropdown Menu with Ellipsis Icon -->
                        <div class="dropdown dropdown-end dropdown-bottom">
                          <div
                            tabindex="0"
                            role="button"
                            class=" py-0 hover:bg-transparent m-0 text-gray-500"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 12h.01M12 12h.01M18 12h.01"
                              />
                            </svg>
                          </div>
                          <ul
                            tabindex="0"
                            class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                          >
                            <li><a>Action 1</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <!-- branch content -->
                    {#if !isCollapsedBranch}
                      <div
                        class="tasks-content bg-gray-100 overflow-auto h-[30vh] p-2"
                      >
                        <div class="p-1">
                          <!-- Select box for repos -->
                          <select
                            id="branch-select"
                            class="py-1 px-2 border border-gray-200 rounded-md text-xs tracking-[0.05rem]"
                            on:change={handleRepoSelection}
                          >
                            <option value="" disabled selected
                              >Select a repo</option
                            >
                            {#each repo as repoInfo}
                              <option value={repoInfo.objDetails.repoName}
                                >{repoInfo.objDetails.repoName}</option
                              >
                            {/each}
                          </select>

                          {#if selectedRepoDetails}
                            <!-- Select box for branches -->
                            <select
                              id="branch-select"
                              class="py-1 px-2 border border-gray-200 rounded-md text-xs tracking-[0.05rem]"
                              on:change={handleBranchSelection}
                            >
                              <option value="" disabled selected
                                >Select a branch</option
                              >
                              {#each selectedRepoDetails.branches as branch}
                                <option value={branch.objDetails.branchName}
                                  >{branch.objDetails.branchName}</option
                                >
                              {/each}
                            </select>
                          {/if}

                          <!-- Branch content (commits) -->
                          {#if selectedBranch}
                            <div
                              class="tasks-content bg-gray-100 border-t border-gray-300 overflow-auto h-[30vh] p-2 mt-2"
                            >
                              <div
                                class="flex items-center justify-between mb-2"
                              >
                                <h2 class="font-semibold">
                                  {selectedBranch.objDetails.branchName} - Commits
                                </h2>
                                <!--       <h2 class="font-semibold text-lg mb-4">Branch Commit Diff</h2>
 -->
                                <button
                                  on:click={() => showDiff(selectedBranch)}
                                  class="border border-gray-200 px-2 text-xs rounded-md tracking-[0.06rem] py-1 bg-green-600 hover:bg-green-800"
                                  >Diff</button
                                >
                              </div>
                              {#if showDiffUi}
                                {#each selectedCommitDiff as change}
                                  <div class="mb-2">
                                    <h3 class="font-semibold text-blue-600">
                                      {change.fileName}
                                    </h3>
                                    <p
                                      class="text-sm p-2 rounded-md {getClassForChangeType(
                                        change.changeType
                                      )}">
                                  {change.code}
                                </p>
                                  </div>
                                {/each}
                              {:else}
                                <ul>
                                  {#each selectedBranch.commits as commit}
                                    <li
                                      class="mb-4 p-2 border-b border-gray-300"
                                    >
                                      <p>
                                        <strong>Commit Message:</strong>
                                        {commit.commitMessage}
                                      </p>
                                      <p>
                                        <strong>Commit Time:</strong>
                                        {commit.commitTime}
                                      </p>
                                      <p>
                                        <strong>User:</strong>
                                        {commit.user}
                                      </p>
                                      <p><strong>Changes:</strong></p>
                                      <ul class="ml-4">
                                        {#each commit.changes as change}
                                          <li>
                                            <strong>{change.fileName}</strong>
                                            ({change.changeType})
                                            <pre
                                              class="bg-gray-200 p-2 mt-1">{change.code}</pre>
                                          </li>
                                        {/each}
                                      </ul>
                                    </li>
                                  {/each}
                                </ul>
                              {/if}
                            </div>
                          {/if}
                        </div>
                      </div>
                    {/if}

                    <!-- info accordion -->
                    <!-- accordion -->
                    <div>
                      <div
                        class="file-outline bg-gray-100 border-b border-gray-400"
                      >
                        <!-- Header with Chevron and Ellipsis Icon -->
                        <div
                          class="flex items-center justify-between px-2 py-0 bg-gray-200"
                        >
                          <button
                            class="flex items-center text-xs font-semibold text-gray-700 hover:text-gray-900"
                            on:click={toggleCollapseInfo}
                          >
                            <i
                              class="fa-solid {isCollapsedInfo
                                ? 'fa-chevron-right'
                                : 'fa-chevron-down'}"
                              style="font-size: 9px;"
                            ></i>
                            <span class="ml-2 tracking-[0.06rem]">
                              {repoInfo ? repoInfo.objDetails.repoName : ""} Info</span
                            >
                          </button>
                          <!-- Dropdown Menu with Ellipsis Icon -->
                          <div class="dropdown dropdown-end dropdown-top">
                            <div
                              tabindex="0"
                              role="button"
                              class=" py-0 hover:bg-transparent m-0 text-gray-500"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M6 12h.01M12 12h.01M18 12h.01"
                                />
                              </svg>
                            </div>
                            <ul
                              tabindex="0"
                              class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                            >
                              <li><a>Action 1</a></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- info Content -->
                    {#if !isCollapsedInfo}
                      {#if repoInfo}
                        <div
                          class="info-content bg-gray-50 overflow-auto h-[30vh] p-2"
                        >
                          <div class="mb-4">
                            <label
                              class="block text-sm tracking-[0.06rem] font-medium text-gray-600"
                              >Branch:</label
                            >
                            <ul class="text-gray-700 mt-2">
                              {#each repoInfo.objDetails.repoBranch as branch}
                                <li class="flex items-center gap-2">
                                  <svg
                                    class="w-3 h-3 fill-current text-gray-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    ><circle cx="12" cy="12" r="10" /></svg
                                  >
                                  <button
                                    class={branch === activeBranch
                                      ? "font-semibold text-blue-600"
                                      : "text-gray-600"}
                                    on:click={() => switchBranch(branch)}
                                  >
                                    {branch}
                                    {branch === activeBranch ? "(Active)" : ""}
                                  </button>
                                </li>
                              {/each}
                            </ul>
                          </div>

                          <div class="mb-4">
                            <label
                              class="block text-sm tracking-[0.06rem] font-medium text-gray-600"
                              >Last Commit:</label
                            >
                            <p class="text-gray-700 tracking-[0.06rem] text-xs">
                              {repoInfo.objDetails.repoCommit ||
                                "No commit message available"}
                            </p>
                          </div>

                          <div class="mb-4">
                            <label
                              class="block text-sm tracking-[0.06rem] font-medium text-gray-600"
                              >Last Commit Status:</label
                            >
                            <p class="text-gray-700 tracking-[0.06rem] text-xs">
                              {repoInfo.objDetails.access
                                ? "Successful"
                                : "Failed or Pending"}
                            </p>
                          </div>

                          <div class="mb-4">
                            <label
                              class="block text-sm tracking-[0.06rem] font-medium text-gray-600 tracking-[0.06rem]"
                              >Clone Link:</label
                            >
                            <p class="text-gray-700">
                              <code
                                class="bg-gray-100 px-2 py-1 rounded-md text-xs tracking-[0.06rem]"
                              >
                                git clone https://github.com/user/{repoInfo
                                  .objDetails.repoName}.git
                              </code>
                            </p>
                          </div>

                          <div class="flex gap-2 mt-6">
                            <button
                              class=" bg-blue-500 text-white hover:bg-blue-600 px-4 py-1 rounded-lg tracking-[0.06rem]"
                            >
                              Share
                            </button>
                            <button
                              class=" bg-green-500 text-white hover:bg-green-600 px-4 py-1 rounded-lg tracking-[0.06rem]"
                            >
                              Clone
                            </button>
                          </div>
                        </div>
                      {:else}
                        <p class="text-gray-500 text-xs p-2">
                          Click on info to view repo details.
                        </p>
                      {/if}
                    {/if}
                    <!-- outlines -->
                    <!-- {#if selectedFileOutline} -->
                    <Outline file={selectedFileOutline} />
                    <!-- {/if}  -->
                  </div>
                </div>
              </div>
            {/if}
          {/if}
          {#if collectionList}
            <div
              data-testid="collectionList"
              class="col-2 mt-1 px-2 bg-slate-100"
              style="border-right: 4px solid darkgray;"
            >
              <div
                class="d-flex justify-content-end align-items-center py-2 px-1"
              >
                <select
                  name=""
                  id=""
                  bind:value={selectedExportOption}
                  on:change={handleExportChange}
                  class="form-control py-1 me-1"
                  style="font-size: 11px;"
                >
                  <option value="Export">Export</option>
                  <option value="Export as Postman">Export as Postman</option>
                  <option value="Export as Swagger">Export as Swagger</option>
                </select>

                <button
                  data-testid="newButton"
                  class="btn btn-light btn-sm"
                  style="font-size: 11px;"
                  on:click={newBoxOpen}>New</button
                >
                <button
                  data-testid="importButton"
                  class="btn btn-light btn-sm mx-1"
                  on:click={importBox}
                  style="font-size: 11px;">Import</button
                >
              </div>
              <div
                class="d-flex justify-content-between gap-2 align-items-center"
              >
                <!-- <i class="fa-solid fa-plus" on:click={addNewApiCollection}> </i> -->

                <div class="dropdown show">
                  <a
                    class=""
                    href="#"
                    role="button"
                    id="dropdownMenuLink"
                    data-testid="addNewCollection"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i class="fa-solid fa-plus"> </i>
                  </a>

                  <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <a
                      class="dropdown-item blank_collection"
                      style="font-size:13px"
                      href="#"
                      on:click={addNewApiCollection}>Blank Collection</a
                    >
                    <div class="dropdown-divider"></div>
                    <h6 style="font-size:12px" class="font600 ps-2">
                      Create from template
                    </h6>
                    <a class="dropdown-item" style="font-size:13px" href="#"
                      >Rest Api Basics</a
                    >
                    <a
                      class="dropdown-item"
                      style="font-size:13px"
                      href="#"
                      on:click={endToEndTesting}>End-to-end testing</a
                    >
                  </div>
                </div>

                <input
                  type="search"
                  class="form-control mt-0 py-1 bg-gray-50"
                  placeholder="search..."
                  on:input={filterItems}
                  bind:value={searchQuery}
                  style="border:0;font-size:13px"
                />
                <!-- Example split danger button -->
                <div class="btn-group">
                  <i
                    class="fa-solid fa-ellipsis dropdown-toggle-split"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  ></i>

                  <ul class="dropdown-menu">
                    <li>
                      <a class="dropdown-item" style="font-size:13px" href="#"
                        >Export</a
                      >
                    </li>
                  </ul>
                </div>
              </div>
              <hr />
              {#if filteredItems.length > 0 || item.length > 0}
                <ul
                  id="tree-view "
                  class="ms-1 tree-view"
                  style="list-style-type:none;font-size:14px;position:relative"
                >
                  {#each filteredItems || item as topLevelItem}
                    <li class="my-3">
                      <div
                        class="d-flex align-items-center justify-content-between"
                      >
                        <div
                          data-testid="requestItem"
                          style="position:relative"
                          class="d-flex gap-2 align-items-center"
                          on:click={() => toggleSubItems(topLevelItem.id)}
                        >
                          <i
                            style="font-size:10px"
                            class={subItems[topLevelItem.id]
                              ? "fa-solid fa-chevron-down"
                              : "fa-solid fa-chevron-right"}
                          ></i>

                          <span class="root-item" style="font-size:13px"
                            >{topLevelItem.name}</span
                          >
                        </div>

                        <i
                          data-testid="settingOptions"
                          style="font-size:12px"
                          class="fa-solid fa-ellipsis"
                          on:click={() =>
                            openSettingBoxCollection(topLevelItem.id)}
                        ></i>

                        {#if editboxcollection[topLevelItem.id]}
                          <div
                            class=""
                            style="position:absolute;top:95%;right:17%;z-index:9999;padding: 10px 5px;width:15vw"
                          >
                            <input
                              data-testid="collectionNameInput"
                              type="text"
                              class="form-control py-1 px-2"
                              bind:value={topLevelItem.name}
                              style="font-size:12px"
                            />
                            <button
                              data-testid="saveCollectionButton"
                              class="btn btn-light btn-sm mt-2"
                              on:click={() => editCollection(topLevelItem)}
                              style="font-size:12px">Edit</button
                            >
                          </div>
                        {/if}
                      </div>
                      {#if subItems[topLevelItem.id]}
                        <ul
                          class="sub-items ms-3 my-2"
                          data-testid="requestList"
                        >
                          {#each topLevelItem.item as subItem}
                            <li
                              class="mb-1 d-flex justify-content-between align-items-center"
                              style="font-size: 12px;"
                            >
                              <div
                                on:click={() => toggleSubLevelItems(subItem.id)}
                              >
                                {#if subItem.response.length > 0}
                                  <i
                                    class={sublevelItems[subItem.id]
                                      ? "fa-solid fa-chevron-down"
                                      : "fa-solid fa-chevron-right"}
                                    style="font-size: 9px;"
                                  ></i>
                                {/if}
                                &nbsp;
                                <span
                                  style="font-size: 11px;cursor:pointer"
                                  draggable="true"
                                  class="sub-item"
                                  on:click={() => addSubItemToTab(subItem)}
                                  on:dragstart={(event) =>
                                    handleDragStart(event, subItem)}
                                >
                                  {subItem.objDetails.name}
                                </span>
                              </div>
                              <i
                                style="font-size: 10px;"
                                class="fa-solid fa-ellipsis"
                                on:click={() =>
                                  openSettingBoxRequest(subItem.id)}
                              ></i>

                              {#if editboxrequest[subItem.id]}
                                <div
                                  class=""
                                  style="position:absolute;top:95%;right:17%;z-index:9999;padding: 10px 5px;width:15vw"
                                >
                                  <input
                                    type="text"
                                    class="form-control py-1 px-2"
                                    bind:value={subItem.objDetails.name}
                                    style="font-size:12px"
                                  />
                                  <button
                                    class="btn btn-light btn-sm mt-2"
                                    on:click={() => editRequest(subItem)}
                                    style="font-size:12px">Edit</button
                                  >
                                </div>
                              {/if}
                              {#if settingboxrequest[subItem.id]}
                                <div
                                  class="shadow-sm bg-white text-dark"
                                  style="position:absolute;top:95%;right:17%;z-index:9999;padding: 10px 5px;width:15vw"
                                >
                                  <ul
                                    style="list-style-type:none;padding-left:0;cursor:pointer"
                                  >
                                    <li class="py-1 ps-2 hoverlist">Share</li>
                                    <li
                                      class="py-1 ps-2 hoverlist"
                                      on:click={() =>
                                        editRequestBox(subItem.id)}
                                    >
                                      Rename
                                    </li>
                                    <li
                                      class="py-1 ps-2 hoverlist"
                                      on:click={() =>
                                        deleteRequests(subItem.id)}
                                    >
                                      Delete
                                    </li>
                                  </ul>
                                </div>
                              {/if}
                            </li>
                            {#if sublevelItems[subItem.id]}
                              <ul class="sub-items-level ms-3 my-2">
                                {#each subItem.response as response}
                                  <li
                                    class="mb-1 d-flex justify-content-between align-items-center"
                                    style="font-size: 11px;"
                                  >
                                    <span
                                      style="font-size: 9px;cursor:pointer"
                                      on:click={() =>
                                        addSubLevelItemToTab(subItem, response)}
                                    >
                                      {response.name}
                                    </span>
                                    <i
                                      style="font-size: 9px;"
                                      class="fa-solid fa-ellipsis"
                                    ></i>
                                  </li>{/each}
                              </ul>
                            {/if}
                          {/each}
                        </ul>
                      {/if}

                      {#if settingboxcollection[topLevelItem.id]}
                        <div
                          class="shadow-sm bg-white text-dark settingboxcollection"
                          style="position:absolute;right:17%;z-index:9999;padding: 10px 5px;width:13vw;max-height:64vh;overflow:auto"
                        >
                          <ul
                            style="list-style-type:none;padding-left:0;cursor:pointer;font-size:12px"
                          >
                            <li
                              class="py-1 ps-2 hoverlist"
                              on:click={collectionShareBox(topLevelItem.id)}
                            >
                              Share
                            </li>
                            <li
                              data-testid="editButton"
                              class="py-1 ps-2 hoverlist"
                              on:click={() =>
                                editCollectionBox(topLevelItem.id)}
                            >
                              Edit
                            </li>
                            <li
                              class="py-1 ps-2 hoverlist"
                              on:click={() => exportCollection(topLevelItem)}
                            >
                              Export
                            </li>
                            <li class="py-1 ps-2 hoverlist">Move</li>
                            <li
                              data-testid="runCollection"
                              class="py-1 ps-2 hoverlist"
                              on:click={() =>
                                addRunCollectionToTab(
                                  topLevelItem.id,
                                  topLevelItem
                                )}
                            >
                              Run Collection
                            </li>
                            <li class="py-1 ps-2 hoverlist">Generate Tests</li>
                            <li class="py-1 ps-2 hoverlist">Mock Collection</li>
                            <li class="py-1 ps-2 hoverlist">
                              Monitor Collection
                            </li>
                            <li class="py-1 ps-2 hoverlist">Create a fork</li>

                            <li
                              data-testid="addRequestButton"
                              class="py-1 ps-2 hoverlist"
                              on:click={() =>
                                addRequest(topLevelItem.item, topLevelItem.id)}
                            >
                              Add Request
                            </li>

                            <li
                              data-testid="deleteButton"
                              class="py-1 ps-2 hoverlist"
                              on:click={() => deleteCollection(topLevelItem.id)}
                            >
                              Delete
                            </li>
                          </ul>
                        </div>
                      {/if}
                    </li>
                  {/each}
                </ul>
              {:else}
                <div class="text-center mt-2">No List Available</div>
              {/if}
            </div>
          {/if}
          {#if environmentSection}
            <div
              class="col-2 mt-1 px-2"
              style="border-right: 4px solid darkgray;"
            >
              <div
                class="d-flex justify-content-between gap-2 align-items-center"
              >
                <i class="fa-solid fa-plus" on:click={addNewEnvironment}> </i>
                <input
                  type="search"
                  class="form-control mt-0 py-1 bg-gray-50"
                  placeholder="search..."
                  style="border:0;font-size:13px"
                />
              </div>
              <hr />
              <div class="ms-2">
                <ul style="list-style-type:none" class="py-2 px-1">
                  {#each editorData.envFiles as files (files.name)}
                    <li
                      class="cursor-pointer"
                      on:click={() => addenvToTab(files.tabs[0])}
                    >
                      {files.tabs[0].tabId}
                    </li>
                  {/each}
                </ul>
              </div>
              <hr />
              <div class="mt-2 ms-2">
                <ul style="list-style-type:none">
                  {#each editorData.envFiles as files (files.name)}
                    {#each files.tabs as tab}
                      {#if tab !== files.tabs[0]}
                        <li
                          class="mb-2 d-flex justify-content-between align-items-center"
                          style="cursor:pointer"
                          on:click={() => addenvToTab(tab)}
                        >
                          <span class="text-truncate">
                            {tab.tabId}
                          </span>
                          <i class="fa-solid fa-ellipsis" style="opacity:0.6"
                          ></i>
                        </li>
                      {/if}
                    {/each}
                  {/each}
                </ul>
              </div>
            </div>
          {/if}
          {#if newboxopen}
            <div
              class="opennewbox bg-gray-50 openNewBox"
              in:fly={{ y: 200, duration: 2000 }}
              out:fade
            >
              <div class="pb-2 pt-1 me-3 text-end">
                <i
                  class="fa-solid fa-times closeNewBox"
                  style="font-size:13px;cursor:pointer"
                  on:click={closeNewBoxOpen}
                ></i>
              </div>
              <div class="d-flex flex-wrap gap-5 mx-4 p-2">
                <div class="d-flex flex-column align-items-center hoverbox">
                  <i class="bi bi-collection fs-1"></i>
                  <span>Collection</span>
                </div>
                <div class="d-flex flex-column align-items-center hoverbox">
                  <i class="bi bi-grid fs-1"></i>
                  <span>Workspace</span>
                </div>
              </div>
              <div class="mx-0 border-top mb-0 mt-4 p-2">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Deleniti, omnis!
              </div>
            </div>
          {/if}
          {#if collectionsharebox}
            <div
              in:fly={{ y: -100, duration: 2000 }}
              out:fade
              class="shadow-sm bg-gray-50 text-dark opennewbox p-3 collectionsharebox"
            >
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="font600">Share API Documentation #reference</h5>
                <i class="fa-solid fa-times" on:click={closeCollectionBox}></i>
              </div>

              <div class="tab-class wow mt-2">
                <div class=" border-bottom">
                  <ul
                    class="nav nav-pills d-inline-flex justify-content-center"
                  >
                    <li class="nav-item">
                      <a
                        class="d-flex align-items-center text-start mx-3 ms-0 pb-2 text-decoration-none text-dark active"
                        data-bs-toggle="pill"
                        href="#tab-share1"
                        style="font-size:14px"
                      >
                        <h6 class="mt-n1 mb-0">With people</h6>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a
                        class="d-flex align-items-center text-start mx-3 pb-2 text-decoration-none text-dark"
                        data-bs-toggle="pill"
                        href="#tab-share2"
                        style="font-size:14px"
                      >
                        <h6 class="mt-n1 mb-0">Via Run in Postman</h6>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a
                        class="d-flex align-items-center text-start mx-3 pb-2 text-decoration-none text-dark"
                        data-bs-toggle="pill"
                        href="#tab-share3"
                        style="font-size:14px"
                      >
                        <h6 class="mt-n1 mb-0">Via API</h6>
                      </a>
                    </li>
                  </ul>
                </div>

                <div class="tab-content mt-2">
                  <div id="tab-share1" class="tab-pane fade show p-0 active">
                    <div class="mt-2">
                      <label class="font600" style="font-size:13px"
                        >Enter name, group name or email</label
                      >

                      <div
                        class="d-flex gap-2 justify-content-between mt-1 align-items-center"
                      >
                        <input type="text" class="form-control py-1 px-2" />
                        <button class="btn btn-danger py-1 btn-sm">Share</button
                        >
                      </div>
                    </div>
                    <div>
                      <label class="font600" style="font-size:13px"
                        >Select an Environment</label
                      >
                      <select
                        class="form-control py-1 px-2 mt-1"
                        style="font-size:13px"
                      >
                        <option>New Environment</option>
                        <option>Globals</option>
                      </select>
                    </div>
                    <div>
                      <label class="font600" style="font-size:13px"
                        >Choose how you want to collaborate</label
                      >
                      <div class="mt-1">
                        <div class="d-flex gap-2 align-items-center">
                          <input type="radio" />
                          <div style="font-size:13px">
                            Create Team workspace and move this collection
                            <br />
                            <span style="font-size:11px" class="d-inline-block"
                              >Only this collection will be shared with your
                              team
                            </span>
                          </div>
                        </div>
                        <div class="d-flex gap-2 align-items-center my-2">
                          <input type="radio" />
                          <div style="font-size:13px">
                            Change this workspace's visibility to team
                            <br />

                            <span style="font-size:11px" class="d-inline-block"
                              >Everything in this workspace will be shared with
                              your team
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="tab-share2" class="tab-pane fade show p-0">
                    <span style="font-size:13px"
                      >Embed a
                      <a href="" style="text-decoration:none">
                        Run in Postman
                      </a>
                      button on your website or docs to make it easier for people
                      to discover and interact with your collection</span
                    >

                    <div class="p-2" style="font-size:13px">
                      <i class="fa-regular fa-lightbulb"></i> Your collection is
                      in a personal workspace. To share your collection, you need
                      to move it to a workspace that is accessible to other people.
                    </div>

                    <div class="mt-3">
                      <h6 class="font600">Additional settings (optional)</h6>
                      <label class="font600 mt-2" style="font-size:13px"
                        >Add an environment</label
                      >
                      <select
                        class="form-control py-1 px-2 mt-1 w-50"
                        style="font-size:13px"
                      >
                        <option>New Environment</option>
                        <option>Globals</option>
                      </select>
                    </div>
                  </div>
                  <div id="tab-share3" class="tab-pane fade show p-0">
                    <div>
                      <h6 class="font600 mt-2">
                        Get Collection JSON using Collection Access Key
                      </h6>
                      <div class="bg-warning p-2">
                        <h6 class="font600">Generate Key?</h6>
                        <div class="mt-2" style="font-sized:13px">
                          This will create a publicly-accessible link. Make
                          certain that your collection does not contain any
                          sensitive information before you share this link.
                        </div>
                      </div>
                      <div class="bg-white p-1">
                        <div class="mt-2" style="font-sized:12px">
                          https://api.postman.com/collections/29791650-733dfdfe-eb80-41b7-97ae-e9fdb2016675?access_key=
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/if}
          {#if importbox}
            <div
              data-testid="importBox"
              class="opennewbox bg-gray-50 openImportBox"
              in:fly={{ y: -100, duration: 2000 }}
              out:fade
            >
              <div class="pb-2 pt-1 me-3 text-end">
                <i
                  class="fa-solid fa-times closeImportBox"
                  style="font-size:13px;cursor:pointer"
                  on:click={closeImportBox}
                ></i>
              </div>
              <div class="p-2">
                <input
                  type="text"
                  class="form-control bg-light"
                  placeholder="paste cURL, Raw text or URL..."
                />
                <div
                  class="dropzone mt-2 d-flex justify-content-center align-items-center"
                  style="height: 33vh;border:1px dashed #ced4da"
                >
                  <div class="d-flex gap-2">
                    <i class="bx bx-import"></i>
                    <div>
                      <h5>Drop anywhere to import</h5>
                      <span style="font-size:13px" class="importFile"
                        >Or select <span
                          class="text-primary cursor-pointer importFileClick"
                        >
                          files
                          <input
                            type="file"
                            class="form-control bg-light fileimport"
                            on:change={handleFileChangeForImport}
                            style=" width: 5%!important;position: absolute;top: 55%;left: 48%;height:8px;opacity:0"
                          />
                        </span>
                        or
                        <span class="text-primary"> folders</span></span
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="mx-0 mb-0 mt-1 p-2">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Deleniti, omnis!
              </div>
            </div>
          {/if}

          {#if codeArea}
            <div class="col middle-col" data-testid="codeArea">
              <!--nav tabs  -->
              <div
                on:drop={(event) => handleDrop(event)}
                on:dragover={(event) => handleDragOver(event)}
                class=" flex justify-between items-center border-b border-gray-200"
              >
                <div class="flex items-center">
                  <!-- mobile screen menu list icon -->
               
                  <ul
                    data-testid="tabList"
                    style="font-size: 14px;position:relative"
                    class=" w-full nav nav-pills list-style-none overflow-hidden"
                    id="pills-tab"
                    role="tablist"
                  >
                    <!-- nav tabsGroup  -->
                    {#if tabGroups.length > 0}
                      {#each tabGroups as group}
                        <li
                          style="font-size: 14px;position:relative"
                          class="nav-item d-flex gap-2 bg-gray-100 align-items-center
                tab border-end py-0 px-2"
                          on:drop={(e) => handleDropInTabGroups(e, group)}
                          on:dragover={(e) => handleDragOverGroup(e)}
                        >
                          <div
                            data-tab-id={group.id}
                            on:dragstart={(e) =>
                              handleDragStartTabGroup(e, group)}
                            on:dragover={(e) => handleDragOverTabGroup(e)}
                            draggable="true"
                            style="text-decoration: none;font-size:12px;cursor:pointer;border-radius: 8px;padding: 1px 10px;background-color: {group.color};"
                            class="border text-white"
                            on:click={() => showTabInGroupsBox(group.id)}
                          >
                            {group.name}
                          </div>

                          {#if showTabInGroups[group.id]}
                            <div
                              class="d-flex align-items-center gap-1 borderafter"
                            >
                              {#each group.tabs as tab}
                                <a
                                  data-tab-id={tab.id}
                                  draggable="true"
                                  on:dragstart={(e) =>
                                    handleDragStartInternalTab(e, tab)}
                                  on:dragover={(e) =>
                                    handleDragOverInternalTab(e)}
                                  on:drop={(e) =>
                                    handleInternalTabDrop(e, group)}
                                  style="font-size:12px"
                                  class="text-decoration-none d-inline-block text-secondary font600"
                                  data-bs-toggle="pill"
                                  href="#"
                                  on:click={() => switchFile(tab.id)}
                                  class:active={selectedFile === tab.id}
                                >
                                  {tab.name}
                                </a>
                                <button
                                  style="font-size:12px"
                                  class="btn btn-transparent px-2"
                                  on:click={() => closeTabGroup(tab.id)}
                                  ><i
                                    class="fa-solid fa-times text-secondary"
                                  /></button
                                >
                              {/each}
                            </div>
                          {:else}
                            <button
                              style="font-size:12px"
                              class="btn btn-transparent px-2"
                              on:click={() => closeGroup(group.id)}
                              ><i
                                class="fa-solid fa-times text-secondary"
                              /></button
                            >
                          {/if}
                        </li>
                      {/each}
                    {/if}

                    <!-- nav tabs -->
                    {#each editorData.files as files (files.name)}
                      {#each files.tabs as tab (tab.id)}
                        <li
                          draggable="true"
                          on:dragstart={(e) => handleDragStartGroup(e, tab)}
                          on:dragover={(e) => handleDragOverGroup(e)}
                          on:dragstart={(event) =>
                            handleDragStartForThirdCol(event, tab)}
                          style="font-size: 10px;"
                          class="nav-item flex gap-2 bg-gray-100 items-center
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          tab border-end py-0 px-2"
                        >
                          <a
                            style="font-size:10px"
                            class="text-decoration-none p-0 mt-1 inline-block activeTabIndex
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              ? 'active'
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              : ''}"
                            data-bs-toggle="pill"
                            href={`#${tab.id}`}
                            on:click={() => switchFile(tab.id)}
                            class:active={selectedFile === tab.id}
                          >
                            <i
                              style="font-size:10px"
                              class={tab.content.type === "code"
                                ? "fa-solid fa-file"
                                : "fa-solid fa-folder"}
                            />&nbsp;
                            {tab.tabId}
                          </a>
                          <button
                            style="font-size:10px"
                            class="bg-transparent px-0 ms-1"
                            on:click={() => closeTab(tab.id)}
                            ><i
                              class="fa-solid fa-times text-gray-500"
                            /></button
                          >
                        </li>
                      {/each}
                    {/each}
                  </ul>
                  <span
                    on:click={addNewTab}
                    style="font-size:11px"
                    class=" py-2 px-2 bg-gray-100 border-e border-gray-200 rounded-0"
                    ><i
                      class="fa-solid fa-plus font-semibold text-gray-500"
                    /></span
                  >
                </div>

                <!-- middle column top buttons -->
                <div
                  class="flex items-center mobileButtonsMiddleCol gap-2 sm:hidden"
                >
                  {#each editorData.files as files (files.name)}
                    {#each files.tabs as tab (tab.id)}
                      {#if selectedFile === tab.id}
                        <button
                          on:click={() => runCode(tab.content)}
                          class="border border-green-600 text-white py-1 px-2 bg-green-600 text-xs tracking-[0.05rem] rounded-md"
                        >
                          Run
                        </button>
                      {/if}
                    {/each}
                    {/each}

                    {#each editorData.files as files (files.name)}
                    {#each files.tabs as tab (tab.id)}
                      {#if selectedFile === tab.id}
                        <button
                          onclick="my_modal_55.showModal()"
                          on:click={() => openCommitModal(tab.content)}
                          class="border border-green-600 text-white py-1 px-2 bg-green-600 text-xs tracking-[0.05rem] rounded-md"
                        >
                          Commit
                        </button>
                      {/if}
                    {/each}
                  {/each}
                  <button
                    class="border border-gray-200 py-1 px-2 bg-gray-50 text-xs tracking-[0.05rem] rounded-md"
                  >
                    Live Share
                  </button>
                  <button
                    class="border border-gray-200 py-1 px-2 bg-gray-50 text-xs tracking-[0.05rem] rounded-md"
                  >
                    Share
                  </button>
                  <button
                    class="border border-gray-200 py-1 px-2 bg-gray-50 text-xs tracking-[0.05rem] rounded-md"
                  >
                    Auto save
                  </button>
                  {#each editorData.files as files (files.name)}
                  {#each files.tabs as tab (tab.id)}
                    {#if selectedFile === tab.id}
                  <button
                  on:click={() => saveFileContent(tab.content)}
                    class="border border-gray-200 py-1 px-2 bg-gray-50 text-xs tracking-[0.05rem] rounded-md"
                  >
                    Save all
                  </button>
                  {/if}
                  {/each}
                  {/each}
                  <select
                    name=""
                    id=""
                    class="border-0 outline-0 mx-2 p-1 bg-green-600 text-white"
                    style=" font-size:10px;opacity:0.7;"
                    bind:value={envValue}
                  >
                    {#each rowsForEnv as list}
                      <option value={list.variableName}
                        >{list.variableName}<i class="fa-solid fa-caret-down"
                          >&nbsp;&nbsp;</i
                        ></option
                      >
                    {/each}
                  </select>
                </div>


          <!-- Open the modal using ID.showModal() method -->
          <dialog id="my_modal_55" class="modal">
            <div class="modal-box">
              <h3 class="font-bold text-lg">Commit Code</h3>

              <div class="form-control flex gap-3">
                <select
                id="branch-select"
                class="py-1 px-2 border border-gray-200 rounded-md text-xs tracking-[0.05rem]"
                on:change={handleRepoSelection}
              >
                <option value="" disabled selected
                  >Select a repo</option
                >
                {#each repo as repoInfo}
                  <option value={repoInfo.objDetails.repoName}
                    >{repoInfo.objDetails.repoName}</option
                  >
                {/each}
              </select>

              <select
              id="branch-select"
              class="py-1 px-2 border border-gray-200 rounded-md text-xs tracking-[0.05rem]"
              on:change={handleBranchSelection}
            >
              <option value="" disabled selected
                >Select a branch</option
              >
              {#if selectedRepoDetails}
                {#each selectedRepoDetails.branches as branch}
                <option value={branch.objDetails.branchName}
                >{branch.objDetails.branchName}</option
                >
                {/each}
            {/if} 
            </select>
              </div>
              

              <div class="form-control mt-4">
                <label class="label">Commit Message:</label>
                <input bind:value={commitMessage} type="text" placeholder="Enter commit message" class="input input-bordered"/>
              </div>
              <div class="modal-action">
                <form method="dialog" class="flex gap-2">
                  <button on:click={() => handleCommit(selectedBranch, commitMessage)} class="btn btn-primary">Commit</button>
                  <button class="btn">Cancel</button>
                  <!-- if there is a button in form, it will close the modal -->
                </form>
              </div>
            </div>
          </dialog>





              </div>
              <div class="row overflow-auto h-[100vh] scrollMiddleContent pb-5">
                <!-- tabsGroup content -->
                {#if tabGroups.length > 0}
                  {#each tabGroups as group}
                    {#each group.tabs as tab}
                      {#if selectedFile === tab.id}
                        <div>
                          {#if tab.content.type === "code" || tab.content.type === "file"}
                            <!-- add to tabgroup -->
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
                                    class="btn btn-primary btn-sm"
                                    on:click={() =>
                                      addToTabGroup(tab, groupToAdd)}
                                    style="font-size: 13px;">Add</button
                                  >
                                </div>
                              </div>
                            </div>

                            <!-- docs section -->
                            <div
                              class="m-2 border border-gray-200 bg-gray-50 {sectionsVisibility.docs
                                ? 'h-[35vh]'
                                : 'h-[5vh]'}  overflow-auto scrollMiddleContent rounded tracking-[0.05rem]"
                            >
                              <!-- collapse buttons -->
                              <div
                                class="flex items-center {sectionsVisibility.docs
                                  ? 'justify-end'
                                  : 'justify-between'} bg-slate-100 py-1.5 px-2"
                              >
                                {#if !sectionsVisibility.docs}
                                  <span
                                    class="text-gray-500"
                                    style="font-weight:600">Docs</span
                                  >
                                {/if}
                                <i
                                  class="fa-solid fa-minus text-gray-500 {sectionsVisibility.docs
                                    ? 'fa-minus'
                                    : 'fa-plus'}"
                                  on:click={() => toggleSection("docs")}
                                ></i>
                              </div>
                              {#if sectionsVisibility.docs}
                                <!-- heading docs -->
                                <div class="p-2">
                                  <!-- docs content -->
                                  <h3
                                    class="py-2 text-gray-500"
                                    style="font-weight:600"
                                  >
                                    Docs
                                  </h3>
                                  <span class="text-xs tracking-[0.06rem] mt-1"
                                    >{@html tab.content.docs}</span
                                  >
                                </div>
                              {/if}
                            </div>

                            <!-- code section -->
                            <div
                              class="flex flex-col h-[68vh] gap-1 border border-gray-200 p-2 m-2 bg-gray-50 rounded"
                            >
                              <div class="">
                                <h3
                                  class="py-1 text-gray-500 tracking-[0.05rem]"
                                  style="font-weight:700"
                                >
                                  Code
                                </h3>
                              </div>
                              <div
                                class="flex h-[55vh] border border-gray-200 rounded"
                              >
                                <div
                                  class="text-gray-200 flex flex-col items-center code-col1 border-e border-gray-200 px-4 pt-2 serial-no"
                                  style="opacity:0.4;"
                                >
                                  {#each numbers as number (number)}
                                    <div>{number}</div>
                                  {/each}
                                </div>
                                <div class="w-100">
                                  <textarea
                                    class="text-xs w-full h-full border-0 outline-none focus:border-0 p-2 focus:shadow-none tracking-[0.07rem]"
                                  >
                                    {tab.content.code}
                                  </textarea>
                                </div>
                              </div>

                              <div class="text-end">
                                <button
                                  class="border border-blue-600 bg-blue-600 text-white rounded-md px-3 py-1.5 text-xs tracking-[0.06rem] my-1"
                                  >Save</button
                                >
                              </div>
                            </div>

                            <!-- all docs section -->
                            <div
                              class="m-2 border border-gray-200 bg-gray-50 {sectionsVisibility.allDocs
                                ? 'h-[35vh]'
                                : 'h-[5vh]'}  overflow-auto scrollMiddleContent rounded tracking-[0.05rem]"
                            >
                              <!-- collapse buttons -->
                              <div
                                class="flex items-center {sectionsVisibility.allDocs
                                  ? 'justify-end'
                                  : 'justify-between'} bg-slate-100 py-1.5 px-2"
                              >
                                {#if !sectionsVisibility.allDocs}
                                  <span
                                    class="text-gray-500"
                                    style="font-weight:600">All Docs</span
                                  >
                                {/if}
                                <i
                                  class="fa-solid fa-minus text-gray-500 {sectionsVisibility.allDocs
                                    ? 'fa-minus'
                                    : 'fa-plus'}"
                                  on:click={() => toggleSection("allDocs")}
                                ></i>
                              </div>
                              {#if sectionsVisibility.allDocs}
                                <!-- heading allDocs -->
                                <div class="p-2">
                                  <!-- allDocs content -->
                                  <h3
                                    class="py-2 text-gray-500"
                                    style="font-weight:600"
                                  >
                                    All Docs
                                  </h3>
                                  <span class="text-xs tracking-[0.06rem] mt-1"
                                    >{@html tab.content.docs}</span
                                  >
                                </div>
                              {/if}
                            </div>

                            <!-- schema -->
                            <div
                              class="m-2 border border-gray-200 bg-gray-50 {sectionsVisibility.schema
                                ? 'h-[35vh]'
                                : 'h-[5vh]'}  overflow-auto scrollMiddleContent rounded tracking-[0.05rem]"
                            >
                              <!-- collapse buttons -->
                              <div
                                class="flex items-center {sectionsVisibility.schema
                                  ? 'justify-end'
                                  : 'justify-between'} bg-slate-100 py-1.5 px-2"
                              >
                                {#if !sectionsVisibility.schema}
                                  <span
                                    class="text-gray-500"
                                    style="font-weight:600">Schema</span
                                  >
                                {/if}
                                <i
                                  class="fa-solid fa-minus text-gray-500 {sectionsVisibility.schema
                                    ? 'fa-minus'
                                    : 'fa-plus'}"
                                  on:click={() => toggleSection("schema")}
                                ></i>
                              </div>
                              {#if sectionsVisibility.schema}
                                <!-- heading schema -->
                                <div class="p-2">
                                  <h3
                                    class="text-gray-500 py-2"
                                    style="font-weight:600"
                                  >
                                    Schema
                                  </h3>
                                  <!-- schema content -->
                                  <div class="flex mx-3">
                                    <div class="w-[60%]">
                                      <label
                                        for="input"
                                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >Input</label
                                      >
                                      <div
                                        class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                      >
                                        num1:array[]
                                      </div>
                                    </div>
                                    <div class="mx-2">
                                      <label
                                        for="output"
                                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >Output</label
                                      >
                                      <div
                                        class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
                                      >
                                        result:String
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              {/if}
                            </div>

                            <!-- examples -->
                            <div
                              class="m-2 mb-5 border border-gray-200 bg-gray-50 {sectionsVisibility.examples
                                ? 'h-[35vh]'
                                : 'h-[5vh]'}  overflow-auto scrollMiddleContent rounded tracking-[0.05rem]"
                            >
                              <!-- collapse buttons -->
                              <div
                                class="flex items-center {sectionsVisibility.examples
                                  ? 'justify-end'
                                  : 'justify-between'} bg-slate-100 py-1.5 px-2"
                              >
                                {#if !sectionsVisibility.examples}
                                  <span
                                    class="text-gray-500"
                                    style="font-weight:600">Examples</span
                                  >
                                {/if}
                                <i
                                  class="fa-solid fa-minus text-gray-500 {sectionsVisibility.examples
                                    ? 'fa-minus'
                                    : 'fa-plus'}"
                                  on:click={() => toggleSection("examples")}
                                ></i>
                              </div>
                              {#if sectionsVisibility.examples}
                                <!-- heading examples -->
                                <div class="p-2">
                                  <h3
                                    class="text-gray-500 py-2"
                                    style="font-weight:600"
                                  >
                                    Examples
                                  </h3>
                                  <!-- examples content -->
                                  <div class="flex flex-col mx-3 mt-1">
                                    {#each tab.content.example as ex, index}
                                      <div class="mb-4">
                                        <div class="font-bold">
                                          Example {index + 1} :
                                        </div>
                                        <div
                                          class="text-xs tracking-[0.06rem] mt-1"
                                        >
                                          <strong>Input:</strong>
                                          <span>{ex.input}</span>
                                        </div>
                                        <div
                                          class="text-xs tracking-[0.06rem] mt-1"
                                        >
                                          <strong>Output:</strong>
                                          <span>{ex.output}</span>
                                        </div>
                                        <div
                                          class="text-xs tracking-[0.06rem] mt-1"
                                        >
                                          <strong>Explanation:</strong>
                                          <span>{ex.explanation}</span>
                                        </div>
                                      </div>
                                    {/each}
                                  </div>
                                </div>
                              {/if}
                            </div>
                          {:else if tab.content.type === "code" || tab.content.type === "file"}
                            <div
                              class="col flex justify-center items-center h-full"
                            >
                              <div class="mt-4">Wait for timer to start...</div>
                            </div>
                          {/if}
                        </div>
                      {/if}
                    {/each}
                  {/each}
                {/if}

                <!-- tabs content -->
                <div class="col bg-gray-100">
                  <div>
                    {#each editorData.files as files (files.name)}
                      {#each files.tabs as tab (tab.id)}
                        {#if selectedFile === tab.id}
                          <div>
                            {#if tab.content.type === "code" || tab.content.type === "file"}
                              <!-- add to tabgroup -->
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
                                      class="btn btn-primary btn-sm"
                                      on:click={() =>
                                        addToTabGroup(tab, groupToAdd)}
                                      style="font-size: 13px;">Add</button
                                    >
                                  </div>
                                </div>
                              </div>

                              <!-- Display and reorder sections -->
                              <div class="mb-5">
                                {#each sections as section (section.id)}
                                  {#if sectionsDelete[section.type]}
                                    <!-- Only show if not deleted -->
                                    <div
                                      class="section"
                                      on:drop={(event) =>
                                        handleDropSection(event, section.id)}
                                      on:dragover={handleDragOverSection}
                                    >
                                      <div
                                        class="m-2 border border-gray-200 bg-gray-50 {sectionsVisibility[
                                          section.type
                                        ]
                                          ? section.type === 'code'
                                            ? 'h-[73vh] flex flex-col gap-1'
                                            : 'h-[35vh]'
                                          : 'h-[5vh]'}  overflow-auto scrollMiddleContent rounded tracking-[0.05rem]"
                                      >
                                        <!-- Collapse buttons and content -->
                                        <div
                                          class="flex items-center {sectionsVisibility[
                                            section.type
                                          ]
                                            ? 'justify-end'
                                            : 'justify-between'} bg-slate-100 py-1.5 px-2"
                                        >
                                          {#if !sectionsVisibility[section.type]}
                                            <span
                                              class="text-gray-500"
                                              style="font-weight:600"
                                              >{section.name}</span
                                            >
                                          {/if}
                                          <div class="flex items-center gap-3">
                                            <i
                                              class="fa-solid fa-minus text-gray-500 {sectionsVisibility[
                                                section.type
                                              ]
                                                ? 'fa-minus'
                                                : 'fa-plus'}"
                                              on:click={() =>
                                                toggleSection(section.type)}
                                            ></i>
                                            <i
                                              class="fa-solid fa-trash text-gray-500 cursor-pointer text-xs"
                                              on:click={() =>
                                                deleteSection(section.type)}
                                            ></i>
                                            <i
                                              class="fa-solid fa-grip text-gray-500 text-xs"
                                              draggable="true"
                                              on:dragstart={(event) =>
                                                handleDragStartSection(
                                                  event,
                                                  section.id
                                                )}
                                            ></i>
                                          </div>
                                        </div>

                                        <!-- If not collapsed -->
                                        {#if sectionsVisibility[section.type]}
                                          <!-- heading docs -->
                                          <div class="p-2">
                                            <!-- docs content -->
                                            <div class="flex justify-between">
                                              <h3
                                                class="py-2 text-gray-500"
                                                style="font-weight:600"
                                              >
                                                {section.name}
                                              </h3>
                                              <!-- button for saving the editing docs -->
                                              {#if isEditing && section.type === "docs"}
                                                <button
                                                  on:click={() => saveDocs(tab)}
                                                  class="border border-blue-600 bg-blue-600 text-white rounded-md px-3 py-1.5 text-xs tracking-[0.06rem] my-1"
                                                  >Save</button
                                                >
                                              {/if}
                                              {#if section.type === "allDocs"}
                                                <!-- icon for adding new allDocs  -->
                                                <i
                                                  class="fa-solid fa-circle-plus text-gray-500"
                                                  onclick="my_modal_41.showModal()"
                                                ></i>
                                              {/if}
                                              {#if section.type === "examples"}
                                                <!-- icon for adding new examples  -->
                                                <i
                                                  class="fa-solid fa-circle-plus text-gray-500"
                                                  onclick="my_modal_43.showModal()"
                                                ></i>
                                              {/if}
                                              {#if section.type === "build"}
                                                <!-- icon for adding new build  -->
                                                <i
                                                  class="fa-solid fa-circle-plus text-gray-500"
                                                ></i>
                                              {/if}
                                            </div>
                                            <!-- docs content -->
                                            {#if section.type === "docs"}
                                              {#if isEditing}
                                                <!-- Edit mode -->
                                                <textarea
                                                  class="w-full p-2 border border-gray-300 rounded"
                                                  rows="5"
                                                  bind:value={editedDocs}
                                                ></textarea>
                                              {:else}
                                                <!-- View mode -->
                                                <div
                                                  class="text-xs tracking-[0.06rem] mt-1 cursor-text"
                                                  on:dblclick={() =>
                                                    startEditing(tab)}
                                                >
                                                  {@html tab.content.docs}
                                                </div>
                                              {/if}
                                            {/if}

                                            <!-- code content -->
                                            {#if section.type === "code"}
                                              <!-- code editor -->
                                              <div
                                                class="flex h-[55vh] border border-gray-200 rounded"
                                              >
                                                <div
                                                  class="text-gray-200 flex flex-col items-center code-col1 border-e border-gray-200 px-4 pt-2 serial-no"
                                                  style="opacity:0.4;"
                                                >
                                                  {#each numbers as number (number)}
                                                    <div>{number}</div>
                                                  {/each}
                                                </div>
                                                <div class="w-100">
                                                  <textarea
                                                    class="text-xs w-full h-full border-0 outline-none focus:border-0 p-2 focus:shadow-none tracking-[0.07rem]"
                                                  >
                                                    {tab.content.code}
                                                  </textarea>
                                                </div>
                                              </div>

                                              <!-- button to save code -->
                                              <div class="text-end">
                                                <button
                                                  class="border border-blue-600 bg-blue-600 text-white rounded-md px-3 py-1.5 text-xs tracking-[0.06rem] my-1"
                                                  >Save</button
                                                >
                                              </div>
                                            {/if}

                                            <!-- all docs content -->
                                            {#if section.type === "allDocs"}
                                              {#each tab.content.allDocs as doc}
                                                <div
                                                  class="text-xs tracking-[0.07rem] mt-1 mb-1"
                                                >
                                                  <strong>{doc.name}:</strong>
                                                  <span>{doc.docs}</span>
                                                </div>
                                              {/each}
                                              <!-- modal for adding new allDocs -->
                                              <dialog
                                                id="my_modal_41"
                                                class="modal"
                                              >
                                                <div class="modal-box">
                                                  <!-- {#each Object.entries(tab.content.allDocs) as [key, value], index} -->
                                                  <div class="mb-4">
                                                    <div class="mb-2">
                                                      <!-- all docs name -->
                                                      <label
                                                        for="docsName"
                                                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white capitalize"
                                                      >
                                                        Name
                                                      </label>
                                                      <input
                                                        type="text"
                                                        id="docsName"
                                                        bind:value={allDocsLabel}
                                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        placeholder="Enter name"
                                                        required
                                                      />
                                                    </div>
                                                    <div class="mb-2">
                                                      <!-- all docs content -->
                                                      <label
                                                        for="docsName"
                                                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white capitalize"
                                                      >
                                                        Docs
                                                      </label>
                                                      <textarea
                                                        rows="4"
                                                        id="docsName"
                                                        bind:value={allDocsContent}
                                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        placeholder="Enter docs content"
                                                        required
                                                      ></textarea>
                                                    </div>
                                                  </div>

                                                  <div class="modal-action">
                                                    <form
                                                      method="dialog"
                                                      class="flex items-center gap-2"
                                                    >
                                                      <!-- if there is a button in form, it will close the modal -->
                                                      <button class="btn"
                                                        >Close</button
                                                      >
                                                      <button
                                                        class="btn btn-primary"
                                                        on:click={() =>
                                                          addNewAllDocs(
                                                            tab.content,
                                                            allDocsLabel,
                                                            allDocsContent
                                                          )}>Save</button
                                                      >
                                                    </form>
                                                  </div>
                                                </div>
                                              </dialog>
                                            {/if}

                                            <!-- schema content -->
                                            {#if section.type === "schema"}
                                              <!-- schema dropdown -->
                                              <details class="dropdown">
                                                <summary class="btn m-1"
                                                  >Schema Type</summary
                                                >
                                                <ul
                                                  class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                                                >
                                                  <li><a>Item 1</a></li>
                                                  <li><a>Item 2</a></li>
                                                </ul>
                                              </details>
                                              <!-- schema table -->
                                              <div
                                                class="table-responsive w-100 mt-1"
                                              >
                                                <table class="table w-100">
                                                  <thead>
                                                    <tr
                                                      style="font-size:12px"
                                                      class=" border border-gray-200"
                                                    >
                                                      <th
                                                        class=" border border-gray-200"
                                                      ></th>
                                                      <th
                                                        class=" border border-gray-200 capitalize"
                                                        >Input</th
                                                      >
                                                      <th
                                                        class=" border border-gray-200 capitalize"
                                                        >Output</th
                                                      >
                                                      <th
                                                        class=" border border-gray-200"
                                                      ></th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {#if tab.content.schema.length > 0}
                                                      {#each tab.content.schema as schemaItem}
                                                        <tr
                                                          style="font-size: 12px;"
                                                          class=" border border-gray-200"
                                                          on:drop={(event) =>
                                                            handleDropSchemaTable(
                                                              event,
                                                              schemaItem.id,
                                                              tab.content
                                                            )}
                                                          on:dragend={handleDragEndSchemaTable}
                                                        >
                                                          <td
                                                            class=" border border-gray-200 text-center"
                                                          >
                                                            <i
                                                              class="fa-solid fa-grip text-gray-500"
                                                              draggable="true"
                                                              on:dragstart={(
                                                                event
                                                              ) =>
                                                                handleDragStartSchemaTable(
                                                                  event,
                                                                  schemaItem.id
                                                                )}
                                                              on:dragover={handleDragOverSchemaTable}
                                                            ></i>
                                                          </td>
                                                          <td
                                                            class=" border border-gray-200"
                                                          >
                                                            <input
                                                              type="text"
                                                              class="form-control bg-gray-50 border-0 text-xs tracking-[0.06rem]"
                                                              bind:value={schemaItem.input}
                                                            />
                                                          </td>
                                                          <td
                                                            class=" border border-gray-200"
                                                          >
                                                            <input
                                                              type="text"
                                                              class="form-control bg-gray-50 border-0 text-xs tracking-[0.06rem]"
                                                              bind:value={schemaItem.output}
                                                            />
                                                          </td>
                                                          <td
                                                            class=" border border-gray-200 text-center"
                                                          >
                                                            <i
                                                              class="fa-solid fa-trash text-xs text-gray-500"
                                                              on:click={() =>
                                                                deleteSchemaRow(
                                                                  schemaItem.id,
                                                                  tab.content
                                                                )}
                                                            ></i>
                                                          </td>
                                                        </tr>
                                                      {/each}
                                                    {/if}
                                                  </tbody>
                                                </table>
                                                <div class="text-end">
                                                  <button
                                                    on:click={() =>
                                                      addSchemaRow(tab.content)}
                                                    class="btn btn-transparent p-1"
                                                  >
                                                    <i
                                                      class="fa-solid fa-circle-plus text-gray-500"
                                                    ></i>
                                                  </button>
                                                </div>
                                              </div>
                                            {/if}

                                            <!-- examples content -->
                                            {#if section.type === "examples"}
                                              <!-- examples content -->
                                              <div
                                                class="flex flex-col mx-3 mt-1"
                                              >
                                                {#each tab.content.example as ex, index}
                                                  <div class="mb-4">
                                                    <div class="font-bold">
                                                      Example {index + 1} :
                                                    </div>
                                                    <div
                                                      class="text-xs tracking-[0.06rem] mt-1"
                                                    >
                                                      <strong>Input:</strong>
                                                      <span>{ex.input}</span>
                                                    </div>
                                                    <div
                                                      class="text-xs tracking-[0.06rem] mt-1"
                                                    >
                                                      <strong>Output:</strong>
                                                      <span>{ex.output}</span>
                                                    </div>
                                                    <div
                                                      class="text-xs tracking-[0.06rem] mt-1"
                                                    >
                                                      <strong
                                                        >Explanation:</strong
                                                      >
                                                      <span
                                                        >{ex.explanation}</span
                                                      >
                                                    </div>
                                                    <div
                                                      class="text-xs tracking-[0.06rem] mt-1"
                                                    >
                                                      <strong>Logs:</strong>
                                                      <div
                                                        class="table-responsive w-100 mt-1"
                                                      >
                                                        <table
                                                          class="table w-100"
                                                        >
                                                          <thead>
                                                            <tr
                                                              style="font-size:12px"
                                                              class=" border border-gray-200"
                                                            >
                                                              <th
                                                                class=" border border-gray-200"
                                                              ></th>
                                                              {#if ex.logs.length > 0}
                                                                {#each Object.keys(ex.logs[0]) as key}
                                                                  {#if key !== "id"}
                                                                    <th
                                                                      class=" border border-gray-200 capitalize"
                                                                      >{key}</th
                                                                    >
                                                                  {/if}
                                                                {/each}
                                                              {/if}
                                                              <th
                                                                class=" border border-gray-200"
                                                              ></th>
                                                            </tr>
                                                          </thead>
                                                          <tbody>
                                                            {#if ex.logs.length > 0}
                                                              {#each ex.logs as log}
                                                                <tr
                                                                  style="font-size: 12px;"
                                                                  class=" border border-gray-200"
                                                                  on:drop={(
                                                                    event
                                                                  ) =>
                                                                    handleDropExamplesTable(
                                                                      event,
                                                                      log.id,
                                                                      ex
                                                                    )}
                                                                  on:dragend={handleDragEndExamplesTable}
                                                                >
                                                                  <td
                                                                    class=" border border-gray-200 text-center"
                                                                  >
                                                                    <i
                                                                      class="fa-solid fa-grip text-gray-500"
                                                                      draggable="true"
                                                                      on:dragstart={(
                                                                        event
                                                                      ) =>
                                                                        handleDragStartExamplesTable(
                                                                          event,
                                                                          log.id
                                                                        )}
                                                                      on:dragover={handleDragOverExamplesTable}
                                                                    ></i>
                                                                  </td>
                                                                  <td
                                                                    class=" border border-gray-200"
                                                                  >
                                                                    <input
                                                                      type="text"
                                                                      class="form-control bg-gray-50 border-0 text-xs tracking-[0.06rem]"
                                                                      bind:value={log.timestamp}
                                                                    />
                                                                  </td>
                                                                  <td
                                                                    class=" border border-gray-200"
                                                                  >
                                                                    <input
                                                                      type="text"
                                                                      class="form-control bg-gray-50 border-0 text-xs tracking-[0.06rem]"
                                                                      bind:value={log.message}
                                                                    />
                                                                  </td>
                                                                  <td
                                                                    class=" border border-gray-200 text-center"
                                                                  >
                                                                    <i
                                                                      class="fa-solid fa-trash text-xs text-gray-500"
                                                                      on:click={() =>
                                                                        deleteLogsRowExamples(
                                                                          log.id,
                                                                          ex
                                                                        )}
                                                                    ></i>
                                                                  </td>
                                                                </tr>
                                                              {/each}
                                                            {/if}
                                                          </tbody>
                                                        </table>
                                                        <div class="text-end">
                                                          <button
                                                            on:click={() =>
                                                              addLogsRowExamples(
                                                                ex
                                                              )}
                                                            class="btn btn-transparent p-1"
                                                          >
                                                            <i
                                                              class="fa-solid fa-circle-plus text-gray-500"
                                                            ></i>
                                                          </button>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                {/each}
                                              </div>

                                              <!-- modal for adding new example -->
                                              <dialog
                                                id="my_modal_43"
                                                class="modal"
                                              >
                                                <div class="modal-box">
                                                  <div class="mb-4">
                                                    <!-- input -->
                                                    <div class="mb-2">
                                                      <!-- example name -->
                                                      <label
                                                        for="docsName"
                                                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white capitalize"
                                                      >
                                                        Input
                                                      </label>
                                                      <!-- example value -->
                                                      <input
                                                        type="text"
                                                        id="docsName"
                                                        bind:value={exampleInput}
                                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        placeholder="Enter input"
                                                        required
                                                      />
                                                    </div>
                                                    <!-- output -->
                                                    <div class="mb-2">
                                                      <!-- example name -->
                                                      <label
                                                        for="docsName"
                                                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white capitalize"
                                                      >
                                                        Output
                                                      </label>
                                                      <!-- example value -->
                                                      <input
                                                        type="text"
                                                        id="docsName"
                                                        bind:value={exampleOutput}
                                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        placeholder="Enter output"
                                                        required
                                                      />
                                                    </div>
                                                    <!-- explanation -->
                                                    <div class="mb-2">
                                                      <!-- example name -->
                                                      <label
                                                        for="docsName"
                                                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white capitalize"
                                                      >
                                                        Explanation
                                                      </label>
                                                      <!-- example explanation -->
                                                      <textarea
                                                        rows="4"
                                                        id="docsName"
                                                        bind:value={exampleExplanation}
                                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        placeholder="Enter example explanation"
                                                        required
                                                      ></textarea>
                                                    </div>
                                                  </div>

                                                  <div class="modal-action">
                                                    <form
                                                      method="dialog"
                                                      class="flex items-center gap-2"
                                                    >
                                                      <!-- if there is a button in form, it will close the modal -->
                                                      <button class="btn"
                                                        >Close</button
                                                      >
                                                      <button
                                                        class="btn btn-primary"
                                                        on:click={() =>
                                                          addNewExamples(
                                                            tab.content,
                                                            exampleInput,
                                                            exampleOutput
                                                          )}>Save</button
                                                      >
                                                    </form>
                                                  </div>
                                                </div>
                                              </dialog>
                                            {/if}

                                            <!-- build content -->
                                            {#if section.type === "build"}
                                              <!-- build content -->
                                              <div class="py-2">
                                                <div
                                                  class="flex gap-3 items-center mx-2"
                                                >
                                                  <a
                                                    href=""
                                                    class="text-blue-600"
                                                    >npm run build</a
                                                  >
                                                  <a
                                                    href=""
                                                    class="text-blue-600"
                                                    >Run Script</a
                                                  >
                                                  <a
                                                    href=""
                                                    class="text-blue-600"
                                                    >Add New examples</a
                                                  >
                                                </div>
                                              </div>
                                            {/if}
                                          </div>
                                        {/if}
                                      </div>
                                    </div>
                                  {/if}
                                {/each}
                              </div>
                            {:else if (tab.content.type === "code" && !taskDescription) || (tab.content.type === "file" && !taskDescription)}
                              <div
                                class="col flex justify-center items-center h-full"
                              >
                                <div class="mt-4">
                                  Wait for timer to start...
                                </div>
                              </div>
                            {/if}
                          </div>

                          <!-- postman content -->
                          {#if tab.content.type === "Postman"}
                            <div class="postman-area h-100">
                              <div class="p-1">
                                <div
                                  class="d-flex justify-content-between align-items-center"
                                >
                                  <div class="">
                                    <div
                                      class="d-flex align-items-center"
                                      style="font-size:12px"
                                    >
                                      {#if tabSubLevelName === ""}
                                        <input
                                          type="text"
                                          class="bg-gray-200 text-xs form-control py-0 px-1 border-0"
                                          bind:value={tabSubName}
                                        />
                                      {:else}
                                        <div class="text-gray-500">
                                          {tabSubName}
                                        </div>
                                      {/if}

                                      {#if tabSubLevelName !== ""}
                                        &nbsp; / <input
                                          type="text"
                                          class="text-xs py-0 px-1 ms-1 border-0"
                                          style=""
                                          bind:value={tabSubLevelName}
                                        />
                                      {/if}
                                    </div>
                                  </div>
                                  <button
                                    on:click={() => savePostmanData(tab)}
                                    class="btn btn-sm"
                                    style="font-size:12px"
                                  >
                                    Save
                                  </button>
                                </div>
                                <div
                                  style="postion:relative"
                                  class="d-flex justify-content-between mt-2 align-items-center gap-1"
                                >
                                  {#if tab.content}
                                    <select
                                      name=""
                                      id=""
                                      bind:value={tab.content.objDetails
                                        .requestMethod}
                                      style="width: 15%; font-size: 14px"
                                      class="select-test-type form-control border-end"
                                    >
                                      <option value="GET">GET</option>
                                      <option value="POST">POST</option>
                                      <option value="PUT">PUT</option>
                                      <option value="DELETE">DELETE</option>
                                      <option value="PATCH">PATCH</option>
                                    </select>
                                    <input
                                      type="text"
                                      data-testid="inputUrl"
                                      class=" form-control border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                      id={`${tab.content.objDetails.requestUrlRaw}input`}
                                      style="font-size:14px;"
                                      on:input={handleSelectChange}
                                      bind:value={tab.content.objDetails
                                        .requestUrlRaw}
                                      placeholder="Enter URL or paste text"
                                    />
                                    <button
                                      data-testid="sendRequestButton"
                                      on:click={() => sendRequest(tab.content)}
                                      class="btn btn-primary py-1 px-2"
                                      style=" ">Send</button
                                    >
                                  {/if}
                                  {#if variableChooseBox}
                                    <div
                                      class="variablechoosebox bg-white text-dark p-2 border"
                                    >
                                      <span
                                        data-testid="setAsVariableButton"
                                        class="text-primary"
                                        style="cursor:pointer"
                                        on:click={variableChooseBoxContainer}
                                        >Set as variable</span
                                      >
                                      | &nbsp;
                                      <span>
                                        <i class="fa-solid fa-ellipsis"></i>
                                      </span>
                                    </div>
                                  {/if}
                                  {#if variablechooseboxcontainer}
                                    <div
                                      class="variablechooseboxcontainer shadow-sm bg-white text-dark p-2 border"
                                    >
                                      <div class="pb-2 text-end">
                                        <i
                                          class="fa-solid fa-times"
                                          on:click={() =>
                                            (variablechooseboxcontainer = false)}
                                        ></i>
                                      </div>
                                      <div>
                                        <input
                                          type="text"
                                          placeholder="Find a Variable"
                                          style="font-size:13px"
                                          class="form-control"
                                        />
                                      </div>
                                      <div
                                        class="mt-2 hoverlist p-1"
                                        data-testid="setAsNewVariableButton"
                                      >
                                        <i class="fa-solid fa-plus"></i>&nbsp;
                                        Set as new variable
                                      </div>
                                      <ul style="list-style-type:none">
                                        {#each rowsForEnv as list (list.id)}
                                          <li
                                            class="mt-2 mb-2 ms-2 hoverlist"
                                            on:click={() =>
                                              addVariableToPath(
                                                list.variableName
                                              )}
                                          >
                                            {#if tab.tabId === "Globals"}
                                              <i
                                                class="fa-solid fa-g bg-primary p-1"
                                              ></i>&nbsp;&nbsp;
                                              {list.variableName}{:else}
                                              <i
                                                class="fa-solid fa-c bg-success p-1"
                                              ></i>
                                              &nbsp;&nbsp;
                                              {list.variableName}
                                            {/if}
                                          </li>
                                        {/each}
                                      </ul>
                                    </div>
                                  {/if}
                                </div>
                                <div
                                  role="tablist"
                                  class="tabs mt-1 tabs-lifted"
                                >
                                  <input
                                    type="radio"
                                    name="my_tabs_1"
                                    role="tab"
                                    style="padding:0 0.6rem 0 0.6rem!important"
                                    class="tab text-xs px-2 bg-slate-200 checked:bg-gray-100 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                    aria-label="Params"
                                    checked
                                  />
                                  <div
                                    role="tabpanel"
                                    class="tab-content border-base-300 bg-gray-100 rounded-box p-1"
                                  >
                                    <h6
                                      class="mt-3 mb-1 text-sm font-semibold text-gray-600"
                                    >
                                      Query Params
                                    </h6>
                                    <div
                                      class="table-responsive"
                                      data-testid="tableParams"
                                    >
                                      <div class="table border border-gray-200">
                                        <thead>
                                          <tr>
                                            <th
                                              class="border-end border-gray-200"
                                              >Key</th
                                            >
                                            <th
                                              class="border-end border-gray-200"
                                              >Value</th
                                            >
                                            <th
                                              class="border-end border-gray-200"
                                              >Description</th
                                            >
                                            <th
                                              class="px-5 border-gray-200"
                                              style="padding-left: 1.7rem;padding-right:3rem"
                                              >Bulk Edit
                                            </th>
                                            <th class="border-gray-200"></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {#each editorData.files as files (files.name)}
                                            {#each files.tabs as tab}
                                              {#if tab.content.requestUrlQuery}
                                                {#each tab.content.requestUrlQuery as query}
                                                  <tr>
                                                    <td
                                                      class="border-end border-secondary"
                                                    >
                                                      <input
                                                        bind:value={query.key}
                                                        on:focus={() =>
                                                          (variablechooseboxcontainer = true)}
                                                        on:blur={() =>
                                                          (variablechooseboxcontainer = false)}
                                                        on:input={() =>
                                                          addQueryKeyToPath(
                                                            query.key
                                                          )}
                                                        type="text"
                                                        placeholder="Key"
                                                        class="form-control bg-gray-50"
                                                      />
                                                    </td>
                                                    <td
                                                      class="border-end border-secondary"
                                                    >
                                                      <input
                                                        bind:value={query.value}
                                                        on:input={() =>
                                                          addQueryValueToPath(
                                                            query.value
                                                          )}
                                                        type="text"
                                                        placeholder="Value"
                                                        class="form-control bg-gray-50"
                                                      />
                                                    </td>
                                                    <td
                                                      colspan="2"
                                                      class="border-end border-secondary"
                                                    >
                                                      <input
                                                        bind:value={query.description}
                                                        type="text"
                                                        placeholder="Description"
                                                        class="form-control bg-gray-50"
                                                      />
                                                    </td>
                                                    <td
                                                      class="mx-2 border-secondary border-end"
                                                    >
                                                      <button
                                                        class="btn text-gray-500 p-1"
                                                        on:click={() =>
                                                          deleteRowQueryParams(
                                                            tab.content
                                                              .requestUrlQuery,
                                                            query.id
                                                          )}
                                                        style="margin-left:-0.2rem"
                                                      >
                                                        <i
                                                          class="fa-solid fa-trash"
                                                        ></i>
                                                      </button>
                                                    </td>
                                                  </tr>
                                                {/each}
                                              {/if}
                                            {/each}
                                          {/each}
                                        </tbody>
                                      </div>
                                      <div class="text-end">
                                        <button
                                          class="btn text-gray-500 p-1"
                                          on:click={() =>
                                            addRowQueryParams(
                                              tab.content.requestUrlQuery
                                            )}
                                        >
                                          <i class="fa-solid fa-circle-plus"
                                          ></i>
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  <input
                                    type="radio"
                                    name="my_tabs_1"
                                    role="tab"
                                    style="padding:0 0.6rem 0 0.6rem!important"
                                    class="tab text-xs bg-slate-200 checked:bg-gray-100 border-0 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                    aria-label="Authorization"
                                  />
                                  <div
                                    role="tabpanel"
                                    class="tab-content p-1 border-base-300 bg-gray-100 rounded-box"
                                  >
                                    <div class="row mt-3">
                                      <div
                                        class="col-lg-4 col-10 border-end border-secondary"
                                      >
                                        <div class="d-flex gap-3">
                                          <span>Type</span>
                                          <select
                                            name=""
                                            id=""
                                            class="bg-gray-50"
                                            style=""
                                            bind:value={selectedAuthType}
                                            on:change={updateAuthDetails}
                                          >
                                            <option value="API Key"
                                              >API Key</option
                                            >
                                            <option value="Bearer Token"
                                              >Bearer Token</option
                                            >
                                            <option value="JWT Bearer"
                                              >JWT Bearer</option
                                            >
                                            <option value="Basic Auth"
                                              >Basic Auth</option
                                            >
                                            <option value="No Auth"
                                              >No Auth</option
                                            >
                                            <option value="Digest Auth"
                                              >Digest Auth</option
                                            >
                                            <option value="OAth 1.0"
                                              >OAth 1.0</option
                                            >
                                          </select>
                                        </div>
                                        <span
                                          class="mt-2 d-inline-block"
                                          style="font-size: 13px;"
                                        >
                                          The authorization header will be
                                          automatically generated when you send
                                          the request. Learn more about
                                          <a href=""> authorization </a>
                                        </span>
                                      </div>
                                      <div class="col-lg-8 col-10 py-3 px-4">
                                        {#each authDetails as { label, placeholder, value }}
                                          <div
                                            class="d-flex justify-content-between"
                                            key={label}
                                          >
                                            <span class="mb-2">{label}</span>
                                            <input
                                              type="text"
                                              bind:value
                                              {placeholder}
                                              class="p-1 mb-2 bg-gray-50"
                                            />
                                          </div>
                                        {/each}
                                      </div>
                                    </div>
                                  </div>

                                  <input
                                    type="radio"
                                    name="my_tabs_1"
                                    role="tab"
                                    style="padding:0 0.6rem 0 0.6rem!important"
                                    class="tab text-xs bg-slate-200 checked:bg-gray-100 border-0 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                    aria-label="Headers"
                                  />
                                  <div
                                    role="tabpanel"
                                    class="tab-content p-1 border-base-300 bg-gray-100 rounded-box"
                                  >
                                    <h6
                                      class="text-sm font-semibold text-gray-500 mt-3"
                                    >
                                      Headers
                                    </h6>
                                    <div class="table-responsive">
                                      <div class="table border border-gray-200">
                                        <thead>
                                          <tr>
                                            <th
                                              class="border-end border-gray-200"
                                              >Key</th
                                            >
                                            <th
                                              class="border-end border-gray-200"
                                              >Value</th
                                            >
                                            <th
                                              class="border-end border-gray-200"
                                              >Description</th
                                            >
                                            <th
                                              class="px-5 border-gray-200"
                                              style="padding-left: 1rem;padding-right:3rem"
                                              >Bulk Edit
                                            </th>
                                            <th
                                              class="border-end border-gray-200"
                                            />
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {#each editorData.files as files (files.name)}
                                            {#each files.tabs as tab}
                                              {#if tab.content.requestHeader}
                                                {#each tab.content.requestHeader as header}
                                                  <tr>
                                                    <td
                                                      class="border-end border-secondary"
                                                    >
                                                      <input
                                                        bind:value={header.key}
                                                        type="text"
                                                        placeholder="Key"
                                                        data-testid="headerKeyInput"
                                                        class="form-control bg-gray-50"
                                                        style="font-size:14px"
                                                      />
                                                    </td>
                                                    <td
                                                      class="border-end border-secondary"
                                                    >
                                                      <input
                                                        bind:value={header.value}
                                                        type="text"
                                                        data-testid="headerValueInput"
                                                        placeholder="Value"
                                                        style="font-size:14px"
                                                        class="form-control bg-gray-50"
                                                      />
                                                    </td>
                                                    <td
                                                      colspan="2"
                                                      class="border-end border-secondary"
                                                    >
                                                      <input
                                                        bind:value={header.description}
                                                        type="text"
                                                        style="font-size:14px"
                                                        placeholder="Description"
                                                        class="form-control bg-gray-50"
                                                      />
                                                    </td>
                                                    <td
                                                      class="mx-2 border-secondary border-end"
                                                    >
                                                      <button
                                                        on:click={() =>
                                                          deleteRowForHeader(
                                                            header.id
                                                          )}
                                                        class="btn text-gray-500 p-1"
                                                        style="margin-left:-0.2rem"
                                                      >
                                                        <i
                                                          class="fa-solid fa-trash"
                                                        ></i>
                                                      </button>
                                                    </td>
                                                  </tr>
                                                {/each}
                                              {/if}
                                            {/each}
                                          {/each}
                                        </tbody>
                                      </div>
                                      <div class="text-end">
                                        <button
                                          class="btn text-gray-500 p-1"
                                          on:click={() =>
                                            addRowForHeader(
                                              tab.content.requestHeader
                                            )}
                                        >
                                          <i class="fa-solid fa-circle-plus"
                                          ></i>
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  <input
                                    type="radio"
                                    name="my_tabs_1"
                                    role="tab"
                                    style="padding:0 0.6rem 0 0.6rem!important"
                                    class="tab text-xs bg-slate-200 checked:bg-gray-100 border-0 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                    aria-label="Body"
                                  />
                                  <div
                                    role="tabpanel"
                                    class="tab-content p-1 border-base-300 bg-gray-100 rounded-box"
                                  >
                                    <!-- body tabs start -->
                                    <div role="tablist" class="tabs mt-1">
                                      <input
                                        type="radio"
                                        name="my_tabs_3"
                                        role="tab"
                                        style="padding:0 0.6rem 0 0.6rem!important"
                                        class="tab text-xs bg-gray-100 checked:bg-gray-50 border-0 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                        aria-label="none"
                                        checked
                                      />
                                      <div
                                        role="tabpanel"
                                        class="tab-content bg-gray-50 border-base-300 rounded-box px-0 py-5 text-center"
                                      >
                                        This request does not have a body
                                      </div>
                                      <input
                                        type="radio"
                                        name="my_tabs_3"
                                        role="tab"
                                        style="padding:0 0.6rem 0 0.6rem!important"
                                        class="tab text-xs bg-gray-100 checked:bg-gray-50 border-0 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                        aria-label="raw"
                                      />
                                      <div
                                        role="tabpanel"
                                        class="tab-content p-2 bg-gray-50 border-base-100 rounded-box"
                                      >
                                        {#if tab.content}
                                          <textarea
                                            name=""
                                            data-testid="rawContent"
                                            id=""
                                            rows="4"
                                            class="p-1 bg-slate-100"
                                            bind:value={tab.content.objDetails
                                              .requestBodyRaw}
                                            style="width: 100%;outline:0;border:0;coverflow:auto"
                                          ></textarea>
                                        {/if}
                                      </div>
                                      <input
                                        type="radio"
                                        name="my_tabs_3"
                                        role="tab"
                                        style="padding:0 0.6rem 0 0.6rem!important"
                                        class="tab text-xs bg-gray-100 checked:bg-gray-50 border-0 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                        aria-label="form-data"
                                      />
                                      <div
                                        role="tabpanel"
                                        class="tab-content p-2 bg-gray-50 border-base-100 rounded-box"
                                      >
                                        <div class="table-responsive">
                                          <div
                                            class="table border border-gray-200"
                                          >
                                            <thead>
                                              <tr>
                                                <th
                                                  class="border-end border-gray-200"
                                                  >Key</th
                                                >
                                                <th
                                                  class="border-end border-gray-200"
                                                  >Value</th
                                                >
                                                <th
                                                  class="border-end border-gray-200"
                                                  >Description</th
                                                >
                                                <th
                                                  class="px-5 border-gray-200"
                                                  style="padding-left: 1rem;padding-right:3rem"
                                                  >Bulk Edit
                                                </th>
                                                <th
                                                  class="border-end border-gray-200"
                                                />
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {#each editorData.files as files (files.name)}
                                                {#each files.tabs as tab}
                                                  {#if tab.content.requestBodyFormData}
                                                    {#each tab.content.requestBodyFormData as formData}
                                                      <tr>
                                                        <td
                                                          class="border-end border-secondary"
                                                        >
                                                          <input
                                                            bind:value={formData.key}
                                                            type="text"
                                                            placeholder="Key"
                                                            class="form-control bg-gray-50"
                                                          />
                                                        </td>
                                                        <td
                                                          class="border-end border-secondary"
                                                        >
                                                          <input
                                                            bind:value={formData.value}
                                                            type="text"
                                                            placeholder="Value"
                                                            class="form-control bg-gray-50"
                                                          />
                                                        </td>
                                                        <td
                                                          colspan="2"
                                                          class="border-end border-secondary"
                                                        >
                                                          <input
                                                            bind:value={formData.description}
                                                            type="text"
                                                            placeholder="Description"
                                                            class="form-control bg-gray-50"
                                                          />
                                                        </td>
                                                        <td
                                                          class="mx-2 border-secondary border-end"
                                                        >
                                                          <button
                                                            on:click={() =>
                                                              deleteRowForBodyFormData(
                                                                formData.id
                                                              )}
                                                            class="btn text-gray-500 p-1"
                                                            style="margin-left:-0.2rem"
                                                          >
                                                            <i
                                                              class="fa-solid fa-trash"
                                                            ></i>
                                                          </button>
                                                        </td>
                                                      </tr>
                                                    {/each}
                                                  {/if}
                                                {/each}
                                              {/each}
                                            </tbody>
                                          </div>
                                          <div class="text-end">
                                            <button
                                              class="btn text-gray-500 p-1"
                                              on:click={() =>
                                                addRowForBodyFormData(
                                                  tab.content
                                                    .requestBodyFormData
                                                )}
                                            >
                                              <i class="fa-solid fa-circle-plus"
                                              ></i>
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                      <input
                                        type="radio"
                                        name="my_tabs_3"
                                        role="tab"
                                        style="padding:0 0.6rem 0 0.6rem!important"
                                        class="tab text-xs bg-gray-100 checked:bg-gray-50 border-0 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                        aria-label="x-www-form-urlencoded"
                                      />
                                      <div
                                        role="tabpanel"
                                        class="tab-content p-2 bg-gray-50 border-base-100 rounded-box"
                                      >
                                        <div class="table-responsive">
                                          <div
                                            class="table border border-gray-200"
                                          >
                                            <thead>
                                              <tr>
                                                <th
                                                  class="border-end border-gray-200"
                                                  >Key</th
                                                >
                                                <th
                                                  class="border-end border-gray-200"
                                                  >Value</th
                                                >
                                                <th
                                                  class="border-end border-gray-200"
                                                  >Description</th
                                                >
                                                <th
                                                  class="px-5 border-gray-200"
                                                  style="padding-left: 1rem;padding-right:3rem"
                                                  >Bulk Edit
                                                </th>
                                                <th
                                                  class="border-end border-gray-200"
                                                />
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {#each editorData.files as files (files.name)}
                                                {#each files.tabs as tab}
                                                  {#if tab.content.requestUrlEncoded}
                                                    {#each tab.content.requestUrlEncoded as formData}
                                                      <tr>
                                                        <td
                                                          class="border-end border-secondary"
                                                        >
                                                          <input
                                                            bind:value={formData.key}
                                                            type="text"
                                                            placeholder="Key"
                                                            class="form-control bg-gray-50"
                                                          />
                                                        </td>
                                                        <td
                                                          class="border-end border-secondary"
                                                        >
                                                          <input
                                                            bind:value={formData.value}
                                                            type="text"
                                                            placeholder="Value"
                                                            class="form-control bg-gray-50"
                                                          />
                                                        </td>
                                                        <td
                                                          colspan="2"
                                                          class="border-end border-secondary"
                                                        >
                                                          <input
                                                            bind:value={formData.description}
                                                            type="text"
                                                            placeholder="Description"
                                                            class="form-control bg-gray-50"
                                                          />
                                                        </td>
                                                        <td
                                                          class="mx-2 border-secondary border-end"
                                                        >
                                                          <button
                                                            on:click={() =>
                                                              deleteRowForUrlEncoded(
                                                                formData.id
                                                              )}
                                                            class="btn text-gray-500 p-1"
                                                            style="margin-left:-0.2rem"
                                                          >
                                                            <i
                                                              class="fa-solid fa-trash"
                                                            ></i>
                                                          </button>
                                                        </td>
                                                      </tr>
                                                    {/each}
                                                  {/if}
                                                {/each}
                                              {/each}
                                            </tbody>
                                          </div>
                                          <div class="text-end">
                                            <button
                                              class="btn text-gray-500 p-1"
                                              on:click={() =>
                                                addRowForUrlEncoded(
                                                  tab.content.requestUrlEncoded
                                                )}
                                            >
                                              <i class="fa-solid fa-circle-plus"
                                              ></i>
                                            </button>
                                          </div>
                                        </div>
                                      </div>

                                      <a
                                        class="text-decoration-none mt-1 d-block bg-transparent"
                                        data-bs-toggle="pill"
                                        href="#tab-choosesub"
                                      >
                                        <select
                                          name=""
                                          id=""
                                          class="border-0 py-0 bg-transparent"
                                          style="outline:0"
                                        >
                                          <option value="Javascript"
                                            >Javascript</option
                                          >
                                          <option value="Json">Json</option>
                                          <option value="HTML">HTML</option>
                                          <option value="XML">XML</option>
                                        </select>
                                      </a>
                                    </div>

                                    <!-- json options start-->
                                    <!--
                                            <div class="tab-content mb-5">
  
                                              <div
                                                id="tab-choosesub"
                                                class="tab-pane fade show p-2"
                                              >
                                                <textarea
                                                  name=""
                                                  id=""
                                                  rows="4"
                                                  style="width: 100%;outline:0;border:0;overflow:auto"
                                                >
                                                </textarea>
                                              </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  </div> -->

                                    <!-- json options end -->
                                  </div>

                                  <input
                                    type="radio"
                                    name="my_tabs_1"
                                    role="tab"
                                    style="padding:0 0.6rem 0 0.6rem!important"
                                    class="tab text-xs bg-slate-200 checked:bg-gray-100 border-0 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                    aria-label="PreReqScript"
                                  />
                                  <div
                                    role="tabpanel"
                                    class="tab-content p-2 border-base-300 bg-gray-100 rounded-box"
                                  >
                                    <div class="row">
                                      <div class="col-lg-8" style="height:21vh">
                                        {#if tab.content && tab.content.event}
                                          {#each tab.content.event as event}
                                            {#if event.listen === "script"}
                                              <textarea
                                                name=""
                                                id=""
                                                rows="5"
                                                style="width: 100%;font-size:12px;outline:0;resize:none;height:21vh"
                                                class="mt-2 p-2 font600 bg-slate-100 border-0"
                                              >
                                                {event.script.exec.join("\n")}
                                              </textarea>
                                            {/if}
                                          {/each}
                                        {/if}
                                      </div>
                                      <div
                                        class="col-lg-4 border-start mt-2"
                                        style="height:21vh;overflow:auto"
                                      >
                                        <h6
                                          class="font600 p-2 pb-0"
                                          style="font-size:13px;"
                                        >
                                          Snippets
                                        </h6>

                                        <ul
                                          style="list-style-type:none;padding-left:0.5rem"
                                          class="px-2 pb-2"
                                        >
                                          {#each editorData.scripts as scripts}
                                            <li
                                              class="text-primary pb-2"
                                              style="font-size:12px;cursor:pointer"
                                              on:click={() =>
                                                addScriptsToTextarea(scripts)}
                                            >
                                              {scripts.text}
                                            </li>
                                          {/each}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>

                                  <input
                                    type="radio"
                                    name="my_tabs_1"
                                    role="tab"
                                    style="padding:0 0.6rem 0 0.6rem!important"
                                    class="tab text-xs bg-slate-200 checked:bg-gray-100 border-0 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                    aria-label="Tests"
                                  />
                                  <div
                                    role="tabpanel"
                                    class="tab-content p-2 border-base-300 bg-gray-100 rounded-box"
                                  >
                                    <div class="row">
                                      <div class="col-lg-8" style="height:21vh">
                                        {#if tab.content && tab.content.event}
                                          {#each tab.content.event as event}
                                            {#if event.listen === "test"}
                                              <textarea
                                                name=""
                                                id=""
                                                rows="5"
                                                style="width: 100%;font-size:12px;outline:0;resize:none;height:21vh"
                                                class="mt-2 p-2 font600 bg-slate-100 border-0"
                                              >
                                                {event.script.exec.join("\n")}
                                              </textarea>
                                            {/if}
                                          {/each}
                                        {/if}
                                      </div>
                                      <div
                                        class="col-lg-4 border-start mt-2"
                                        style="height:21vh;overflow:auto"
                                      >
                                        <h6
                                          class="font600 p-2 pb-0"
                                          style="font-size:13px;"
                                        >
                                          Snippets
                                        </h6>

                                        <ul
                                          style="list-style-type:none;padding-left:0.5rem"
                                          class="px-2 pb-2"
                                        >
                                          {#each editorData.tests as tests}
                                            <li
                                              class="text-primary pb-2"
                                              style="font-size:12px;cursor:pointer"
                                              on:click={() =>
                                                addTestsToTextarea(tests)}
                                            >
                                              {tests.text}
                                            </li>
                                          {/each}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <!-- json dropdown -->

                                  <a
                                    href="#"
                                    class="text-decoration-none mt-1 d-inline-block"
                                  >
                                    <select
                                      name=""
                                      id=""
                                      class="border-0 py-0 px-0 bg-transparent"
                                      style="outline:0;margin-top:-1rem"
                                    >
                                      <option value="Javascript"
                                        >Javascript</option
                                      >
                                      <option value="Json">Json</option>
                                      <option value="HTML">HTML</option>
                                      <option value="XML">XML</option>
                                    </select>
                                  </a>

                                  <!-- end -->
                                </div>
                                <div class="mt-1 tab-content">
                                  <div
                                    id="tab-choose"
                                    class="tab-pane fade show p-0"
                                  >
                                    <textarea
                                      name=""
                                      id=""
                                      rows="5"
                                      style="width: 100%;color:#333"
                                      class="mt-2 p-2 bg-light"
                                    />
                                  </div>
                                </div>
                                <!-- footer tabs start -->
                                <div class="mt-5">
                                  <div
                                    role="tablist"
                                    class="tabs mt-1 tabs-lifted"
                                  >
                                    <input
                                      type="radio"
                                      name="my_tabs_2"
                                      role="tab"
                                      style="padding:0 0.8rem 0 0.8rem!important"
                                      class="tab text-xs bg-slate-200 checked:bg-gray-100 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                      aria-label="Body"
                                      checked
                                    />
                                    <div
                                      role="tabpanel"
                                      class="tab-content p-2 border-gray-300 bg-gray-100 rounded-box"
                                    >
                                      <div
                                        class="test-response"
                                        style="overflow: auto;"
                                      >
                                        <div class="">
                                          <textarea
                                            name=""
                                            rows="5"
                                            id=""
                                            data-testid="response"
                                            style="font-size:12px;color:green"
                                            class="form-control bg-slate-100"
                                          >
                                            {response}
                                          </textarea>
                                        </div>
                                      </div>
                                    </div>
                                    <input
                                      type="radio"
                                      name="my_tabs_2"
                                      role="tab"
                                      style="padding:0 0.8rem 0 0.8rem!important"
                                      class="tab text-xs bg-slate-200 checked:bg-gray-100 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                      aria-label="Cookies"
                                    />
                                    <div
                                      role="tabpanel"
                                      class="tab-content p-2 border-gray-300 bg-gray-100 rounded-box"
                                    >
                                      Cookies
                                    </div>
                                    <input
                                      type="radio"
                                      name="my_tabs_2"
                                      role="tab"
                                      style="padding:0 0.8rem 0 0.8rem!important"
                                      class="tab text-xs bg-slate-200 checked:bg-gray-100 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                      aria-label="Headers"
                                    />
                                    <div
                                      role="tabpanel"
                                      class="tab-content p-2 border-gray-300 bg-gray-100 rounded-box"
                                    >
                                      Headers
                                    </div>
                                    <input
                                      type="radio"
                                      name="my_tabs_2"
                                      role="tab"
                                      style="padding:0 0.8rem 0 0.8rem!important"
                                      class="tab text-xs bg-slate-200 checked:bg-gray-100 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                      aria-label="Test Results"
                                    />
                                    <div
                                      role="tabpanel"
                                      class="tab-content p-2 border-gray-300 bg-gray-100 rounded-box"
                                    >
                                      Test Results
                                    </div>
                                  </div>
                                </div>
                                <!-- footer tabs end -->

                                <div class="test-case py-2 mb-2 px-1">
                                  <div>
                                    <div
                                      class="accordion accordion-flush"
                                      id="accordionFlushExample"
                                    >
                                      <div class="accordion-item">
                                        <h2
                                          class="accordion-header"
                                          id="flush-headingTest"
                                        >
                                          <button
                                            class="accordion-button collapsed text-secondary"
                                            style="font-size:14px;"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#flush-collapseTest"
                                            aria-expanded="false"
                                            aria-controls="flush-collapseTest"
                                          >
                                            {tab.tabId} &nbsp;&nbsp; - Response Example
                                          </button>
                                        </h2>
                                        <div
                                          id="flush-collapseTest"
                                          class="accordion-collapse collapse"
                                          aria-labelledby="flush-headingTest"
                                          data-bs-parent="#accordionFlushExample"
                                        >
                                          <div
                                            class="accordion-body"
                                            style="font-weight:600"
                                          >
                                            <div>
                                              <div class="tasktestcase">
                                                <div class="row gy-2">
                                                  <div class="col-lg-6">
                                                    <h6 class="mb-2">
                                                      Parameter
                                                    </h6>
                                                    {#if tab.content.examples.length > 0}
                                                      {#each tab.content.examples[0].request as example}
                                                        <pre
                                                          style="font-size: 14px; padding: 10px; border-radius: 5px; overflow-x: auto;"
                                                          class="p-2">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      <code
                                                            style="color: #0366d6;"
                                                            >{JSON.stringify(
                                                              JSON.parse(
                                                                example
                                                              ),
                                                              null,
                                                              2
                                                            )}</code
                                                          >
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          </pre>
                                                      {/each}
                                                    {/if}
                                                    <p>
                                                      <strong
                                                        >Description:</strong
                                                      >&nbsp;User object that
                                                      needs to be added to the
                                                      store
                                                    </p>
                                                  </div>
                                                  <div class="col-lg-6">
                                                    <h6 class="mb-2">
                                                      Response
                                                    </h6>
                                                    <div
                                                      class="table-responsive w-100"
                                                    >
                                                      <table
                                                        class="table w-100 alert alert-primary"
                                                      >
                                                        <thead>
                                                          <tr>
                                                            <th>Code</th>
                                                            <th>Description</th>
                                                          </tr>
                                                        </thead>
                                                        <tbody>
                                                          {#if tab.content.examples.length > 0}
                                                            {#each tab.content.examples[0].response as response}
                                                              <tr>
                                                                <td
                                                                  >{response.Code}</td
                                                                >
                                                                <td
                                                                  >{response.Description}</td
                                                                >
                                                              </tr>
                                                            {/each}
                                                          {/if}
                                                        </tbody>
                                                      </table>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div class="text-end py-2">
                                                  <button
                                                    class="btn btn-success"
                                                  >
                                                    Run
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          {/if}
                          {#if tab.content.type === "Environment"}
                            <div class="postman-area">
                              <div
                                class="p-2 border-bottom d-flex justify-content-between align-items-center"
                              >
                                <div>
                                  <h6>{tab.tabId}</h6>
                                </div>
                                {#if tab.tabId === "New Env"}
                                  <div>
                                    <button
                                      class="btn btn-sm btn-light py-1 me-2"
                                      style="font-size:10px"
                                    >
                                      Fork
                                    </button>
                                    <button
                                      on:click={saveEnvVariable}
                                      class="btn btn-sm btn-light py-1 me-2"
                                      style="font-size:10px"
                                    >
                                      Save
                                    </button>
                                    <button
                                      class="btn btn-sm btn-light py-1 mx-2"
                                      style="font-size:10px"
                                    >
                                      <i class="fa-solid fa-share"></i>&nbsp;
                                      Share
                                    </button>
                                    <button
                                      class="btn btn-sm btn-light py-1 mx-2"
                                      style="font-size:10px"
                                    >
                                      <i class="fa-solid fa-ellipsis"></i>
                                    </button>
                                  </div>
                                {:else}
                                  <div>
                                    <button
                                      on:click={saveEnvVariable}
                                      class="btn btn-sm btn-light py-1 me-2"
                                      style="font-size:10px"
                                    >
                                      Save
                                    </button>
                                    <button
                                      class="btn btn-sm btn-light py-1 mx-2"
                                      style="font-size:10px"
                                    >
                                      Export
                                    </button>
                                  </div>
                                {/if}
                              </div>
                              <div class="my-2">
                                <input
                                  type="text"
                                  style="font-size:12px"
                                  class="form-control w-25 ps-2 border-gray-200 bg-gray-50"
                                  placeholder="Filter variables"
                                />
                              </div>

                              <div class="table-responsive w-100">
                                <table
                                  class="table table-bordered border-gray-200 w-100"
                                >
                                  <thead>
                                    <tr>
                                      <th></th>
                                      <th>Variable</th>
                                      <th>Type</th>
                                      <th>Initial value</th>
                                      <th>Current value</th>
                                      <th></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {#each rowsForEnv as row (row.id)}
                                      <tr
                                        style="font-size:13px"
                                        class="border-gray-200"
                                      >
                                        <td>
                                          <input
                                            type="checkbox"
                                            name=""
                                            class="mt-2 bg-gray-50 border-gray-200"
                                            id=""
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="text"
                                            class="form-control bg-gray-50 border-gray-200"
                                            bind:value={row.variableName}
                                          />
                                        </td>
                                        <td>
                                          <select
                                            name=""
                                            id=""
                                            class="form-control bg-gray-50 border-gray-200"
                                            bind:value={row.variableType}
                                          >
                                            <option value="Default"
                                              >Default</option
                                            >
                                            <option value="Secret"
                                              >Secret</option
                                            >
                                          </select>
                                        </td>
                                        <td>
                                          <input
                                            type="text"
                                            class="form-control bg-gray-50 border-gray-200"
                                            bind:value={row.initialValue}
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="text"
                                            class="form-control bg-gray-50 border-gray-200"
                                            bind:value={row.currentValue}
                                          />
                                        </td>
                                        <td
                                          class="mx-2 border-gray-200 border-end"
                                        >
                                          <button
                                            class="btn btn-transparent p-1"
                                            style="margin-left:-0.2rem"
                                            on:click={() =>
                                              deleteRowForEnv(row.id)}
                                          >
                                            <i class="fa-solid fa-trash"></i>
                                          </button>
                                        </td>
                                      </tr>
                                    {/each}
                                  </tbody>
                                </table>
                                <div class="text-end">
                                  <button
                                    class="btn btn-transparent p-1"
                                    on:click={() => addRowForEnv()}
                                  >
                                    <i class="fa-solid fa-circle-plus"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          {/if}

                          <!-- show repo graph -->

                          {#if tab.content.type === "Graph"}
                            <div>
                              <RepoBranchGraph {repoInfo} />
                            </div>
                          {/if}

                          <!-- run collection -->
                          {#if tab.content.type === "Run Collection" && runcollection}
                            <div
                              data-testid="runCollectionArea"
                              class="postman-area"
                              style="height:100vh"
                            >
                              <div class="row" style="height:100vh">
                                <div
                                  class="col-lg-6 p-2 bg-light text-dark border border-secondary"
                                >
                                  <div
                                    class="d-flex justify-content-between text-dark align-items-center"
                                  >
                                    <span class="font600">Run order</span>
                                    <div class="d-flex">
                                      {#if endtoendtesting}
                                        <button
                                          on:click={deselectAllendtoend}
                                          class="text-secondary btn-transparent btn btn-sm"
                                          >Deselect All</button
                                        >
                                        <button
                                          on:click={selectAllendtoend}
                                          class="text-secondary btn btn-transparent btn-sm"
                                          >Select All</button
                                        >
                                        <button
                                          class="text-secondary btn btn-transparent btn-sm"
                                          >Reset</button
                                        >
                                      {:else}
                                        <button
                                          on:click={deselectAll}
                                          class="text-secondary btn-transparent btn btn-sm"
                                          >Deselect All</button
                                        >
                                        <button
                                          on:click={selectAll}
                                          data-testid="selectAll"
                                          class="text-secondary btn btn-transparent btn-sm"
                                          >Select All</button
                                        >
                                        <button
                                          class="text-secondary btn btn-transparent btn-sm"
                                          >Reset</button
                                        >
                                      {/if}
                                    </div>
                                  </div>

                                  <div class="ms-4 mt-3">
                                    {#if endtoendtesting}
                                      {#each editorData.endToEndTests as endTests, index}
                                        <div
                                          class="mt-2 row gy-2"
                                          style="font-size:13px;width:65%"
                                        >
                                          <div class="col-1">
                                            <input
                                              type="checkbox"
                                              checked={endTests.selected}
                                              on:change={() =>
                                                toggleTestSelection(index)}
                                            />
                                          </div>
                                          <div class="col-3">
                                            {#if endTests.method === "GET"}
                                              <span
                                                class="text-success font600"
                                                style="font-size:10px"
                                              >
                                                {endTests.method}</span
                                              >
                                            {:else if endTests.method === "POST"}
                                              <span
                                                class="text-primary font600"
                                                style="font-size:10px"
                                              >
                                                {endTests.method}</span
                                              >
                                            {:else if endTests.method === "DELETE"}
                                              <span
                                                class="text-danger font600"
                                                style="font-size:10px"
                                              >
                                                {endTests.method}</span
                                              >
                                            {:else if endTests.method === "PUT"}
                                              <span
                                                class="text-warning font600"
                                                style="font-size:10px"
                                              >
                                                {endTests.method}</span
                                              >
                                            {/if}
                                          </div>
                                          <div class="col-8">
                                            <span class="text-end"
                                              >{endTests.name}</span
                                            >
                                          </div>
                                        </div>
                                      {/each}
                                    {:else}
                                      {#each editorData.files as files}
                                        {#each files.tabs as tab}
                                          {#if tab.content.item && tab.content.type === "Run Collection"}
                                            {#each tab.content.item as item}
                                              <div
                                                data-test-id="runCollectionList"
                                                class="mt-2 row gy-2"
                                                style="font-size:13px;width:56%"
                                              >
                                                <div class="col-1">
                                                  <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    on:change={() =>
                                                      handleCheckboxCollectionChange(
                                                        item
                                                      )}
                                                  />
                                                </div>
                                                <div class="col-2 ps-2">
                                                  {#if item.objDetails.requestMethod === "GET"}
                                                    <span
                                                      class="text-success font600"
                                                      style="font-size:10px"
                                                    >
                                                      {item.objDetails
                                                        .requestMethod}</span
                                                    >
                                                  {:else if item.objDetails.requestMethod === "POST"}
                                                    <span
                                                      class="text-primary font600"
                                                      style="font-size:10px"
                                                    >
                                                      {item.objDetails
                                                        .requestMethod}</span
                                                    >
                                                  {:else if item.objDetails.requestMethod === "DELETE"}
                                                    <span
                                                      class="text-danger font600"
                                                      style="font-size:10px"
                                                    >
                                                      {item.objDetails
                                                        .requestMethod}</span
                                                    >
                                                  {:else if item.objDetails.requestMethod === "PUT"}
                                                    <span
                                                      class="text-warning font600"
                                                      style="font-size:10px"
                                                    >
                                                      {item.objDetails
                                                        .requestMethod}</span
                                                    >
                                                  {/if}
                                                </div>
                                                <div class="col-8">
                                                  <span class="text-end"
                                                    >{item.objDetails
                                                      .endpoint}</span
                                                  >
                                                </div>
                                              </div>
                                            {/each}
                                          {/if}
                                        {/each}
                                      {/each}
                                    {/if}
                                  </div>
                                </div>
                                <div
                                  class="col-lg-6 p-2 pb-3 bg-light text-dark"
                                  style="overflow:auto"
                                >
                                  <button
                                    class=" btn-white btn font600 btn-sm text-primary"
                                    on:click={showFunctionalTab}
                                    >Functional</button
                                  >
                                  <button
                                    class="text-secondary btn-white btn font600 btn-sm"
                                    on:click={showPerformanceTab}
                                    >Performance</button
                                  >
                                  {#if performanceTab}
                                    <div class="">
                                      <h6 class="font600 mt-1">
                                        Set up your performance test
                                      </h6>
                                      <div
                                        class="mt-1 d-flex justify-content-between align-items-center gap-2"
                                      >
                                        <div>
                                          <label
                                            >Load profile <i
                                              class="fa-solid fa-circle-info text-secondary"
                                            ></i></label
                                          >
                                          <select
                                            class="form-control py-1 px-1"
                                            style="font-size:13px"
                                          >
                                            <option>Fixed</option>
                                            <option>Ramp</option>
                                          </select>
                                        </div>
                                        <div>
                                          <label
                                            >Virtual users <i
                                              class="fa-solid fa-circle-info text-secondary"
                                            ></i></label
                                          >
                                          <input
                                            type="text"
                                            value={20}
                                            class=" form-control py-1 px-1"
                                            style="font-size:13px"
                                          />
                                        </div>

                                        <div>
                                          <label
                                            >Test duration <i
                                              class="fa-solid fa-circle-info text-secondary"
                                            ></i></label
                                          >
                                          <input
                                            type="text"
                                            value={10}
                                            class="form-control py-1 px-1"
                                            style="font-size:13px"
                                          />
                                        </div>
                                      </div>
                                      <div class="mt-2" style="font-size:13px">
                                        <label class="text-secodanry font600"
                                          >Data</label
                                        ><br />
                                        <input
                                          type="file"
                                          class="mt-1 form-control w-25 py-1"
                                          style="font-size:12px"
                                        />
                                      </div>

                                      <button
                                        class="btn btn-warning mt-2"
                                        style="font-size:14px">Run</button
                                      >
                                    </div>
                                  {:else}
                                    <div>
                                      <div class="mt-1">
                                        <h6 class="font600">
                                          Choose how to run your collection
                                        </h6>
                                        <div class="mt-1">
                                          <div
                                            class="d-flex gap-2 align-items-center"
                                          >
                                            <input
                                              data-testid="runManuallyButton"
                                              type="radio"
                                              checked={showRunManually}
                                            />
                                            <div style="font-size:13px">
                                              Run Manually
                                              <br />
                                              <span
                                                style="font-size:11px"
                                                class="d-inline-block"
                                                >Run this collection in the
                                                Collection Runner.
                                              </span>
                                            </div>
                                          </div>
                                          <div
                                            class="d-flex gap-2 align-items-center my-2"
                                          >
                                            <input
                                              type="radio"
                                              checked={showScheduleRuns}
                                              on:change={handleChangeScheduleRuns}
                                            />
                                            <div style="font-size:13px">
                                              Schedule runs
                                              <br />

                                              <span
                                                style="font-size:11px"
                                                class="d-inline-block"
                                                >Periodically run collection at
                                                a specified time on the Postman
                                                Cloud.
                                              </span>
                                            </div>
                                          </div>
                                          <div
                                            class="d-flex gap-2 align-items-center"
                                          >
                                            <input
                                              type="radio"
                                              checked={showAutomateCli}
                                              on:change={handleChangeAutomateCli}
                                            />
                                            <div style="font-size:13px">
                                              Automate runs via CLI
                                              <br />

                                              <span
                                                style="font-size:11px"
                                                class="d-inline-block"
                                                >Configure CLI command to run on
                                                your build pipeline.
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {#if showScheduleRunsSection}
                                        <div class="mt-3">
                                          <h6
                                            class="font600"
                                            style="font-size:15px"
                                          >
                                            Schedule configuration
                                          </h6>
                                          <span style="font-size:12px"
                                            >Your collection will be
                                            automatically run on the Postman
                                            Cloud at the configured frequency.
                                            Learn more about scheduling
                                            collection runs</span
                                          >

                                          <div class="mt-2">
                                            <label
                                              class="text-secondary"
                                              style="font-size:13px"
                                              >Schedule Name</label
                                            >
                                            <input
                                              bind:value={scheduleName}
                                              class="form-control py-1 mb-1"
                                            />

                                            <label
                                              class="text-secondary mt-1"
                                              style="font-size:13px"
                                              >Run Frequency <i
                                                class="fa-solid fa-circle-info"
                                              ></i></label
                                            ><br />
                                            <span style="font-size:10px"
                                              >High frequency helps catch issues
                                              quicker but increases <a>
                                                resource usage .</a
                                              >

                                              <select
                                                bind:value={runFrequency}
                                                class="form-control py-1 px-2 mt-1"
                                              >
                                                <option value="hourly"
                                                  >Hourly</option
                                                >
                                                <option value="daily"
                                                  >Daily</option
                                                >
                                                <option value="weekly"
                                                  >Weekly</option
                                                >
                                              </select>
                                              <div
                                                style="font-size:12px"
                                                class="d-flex justify-content-between align-items-center mt-1"
                                              >
                                                <select
                                                  bind:value={runDay}
                                                  style="font-size:12px"
                                                  class="form-control py-1 px-2"
                                                >
                                                  <option>Every day</option>
                                                  <option>Every Monday</option>
                                                </select>
                                                &nbsp; <span>at</span> &nbsp;
                                                <select
                                                  bind:value={runTime}
                                                  style="font-size:12px"
                                                  class="form-control py-1 px-2"
                                                >
                                                  <option>12:00 A.M</option>
                                                  <option>1:00 A.M</option>
                                                  <option>5:00 PM</option>
                                                </select>
                                              </div>
                                            </span>
                                          </div>
                                        </div>
                                        <div class="mt-2">
                                          <h6 class="font600">
                                            Run configuration
                                          </h6>
                                          <div style="font-size:13px">
                                            <label
                                              class="text-secodanry font600"
                                              >Environment</label
                                            ><br />
                                            <select class="form-control">
                                              {#each rowsForEnv as list}
                                                <option>
                                                  {list.variableName}
                                                </option>
                                              {/each}
                                            </select>
                                          </div>
                                          <div style="font-size:13px">
                                            <label
                                              class="text-secodanry font600"
                                              >Iterations</label
                                            ><br />
                                            <input
                                              type="text"
                                              class="mt-1 form-control w-75 py-1"
                                              bind:value={iterations}
                                            />
                                          </div>

                                          <h6 class="my-2">
                                            Email notifications
                                          </h6>
                                          <div>
                                            <label
                                              class="text-secondary mt-1"
                                              style="font-size:13px"
                                              >Notification recipients<i
                                                class="fa-solid fa-circle-info"
                                              ></i></label
                                            ><br />
                                            <span style="font-size:10px"
                                              >You can add up to 5 team members
                                            </span>
                                            <input
                                              class="form-control py-1 px-2"
                                            />
                                          </div>

                                          <div
                                            style="font-size:12px"
                                            class="mt-1"
                                          >
                                            Stop notifications after
                                            <input
                                              type="number "
                                              class="w-25"
                                              value={3}
                                            />
                                            consecutive failures
                                          </div>

                                          <button
                                            on:click={scheduleRun}
                                            class="btn btn-warning mt-2"
                                            style="font-size:13px"
                                            >Schedule Run</button
                                          >
                                        </div>
                                      {:else if showAutomateCliSection}
                                        <div>Hello</div>
                                      {:else}
                                        <div class="mt-3">
                                          <h6 class="font600">
                                            Run configuration
                                          </h6>
                                          <div style="font-size:13px">
                                            <label
                                              class="text-secodanry font600"
                                              >Iterations</label
                                            ><br />
                                            <input
                                              type="text"
                                              class="mt-1 form-control w-75 py-1"
                                              bind:value={iterations}
                                            />
                                          </div>
                                          <div
                                            class="mt-2"
                                            style="font-size:13px"
                                          >
                                            <label
                                              class="text-secodanry font600"
                                              >Delay</label
                                            >
                                            <input
                                              type="text"
                                              class="mt-1 form-control w-75 py-1"
                                              placeholder="0 ms"
                                            />
                                          </div>
                                          <div
                                            class="mt-2"
                                            style="font-size:13px"
                                          >
                                            <label
                                              class="text-secodanry font600"
                                              >Data</label
                                            ><br />
                                            <input
                                              type="file"
                                              class="mt-1 form-control w-25 py-1"
                                              style="font-size:12px"
                                            />
                                          </div>
                                          <div
                                            class="d-flex gap-2 mt-2 align-items-center"
                                            style="font-size:13px"
                                          >
                                            <input type="checkbox" />
                                            <div>
                                              Persist responses for a session
                                              <i class="fa-solid fa-info-circle"
                                                ><i> </i></i
                                              >
                                            </div>
                                          </div>
                                          {#if endtoendtesting}
                                            <button
                                              on:click={runEndToEndTests}
                                              class="btn btn-warning mt-2"
                                              style="font-size:14px"
                                              >Run End-to-end Tests</button
                                            >
                                          {:else}
                                            <button
                                              data-testid="runIntegrationTests"
                                              on:click={runIntegrationTests}
                                              class="btn btn-warning mt-2"
                                              style="font-size:14px"
                                              >Run Integration Tests</button
                                            >
                                          {/if}
                                        </div>
                                      {/if}
                                    </div>
                                  {/if}
                                </div>
                              </div>
                            </div>
                          {:else if showRunManuallySection && !runcollection && !endtoendtesting}
                            <div
                              data-testid="runCollectionResult"
                              class="postman-area bg-light text-dark"
                              style="height:100vh"
                            >
                              <div
                                class="d-flex justify-content-between align-items-center"
                              >
                                <h6 class="font600" style="font-size:15px">
                                  My Api Collection Copy - Run results
                                </h6>

                                <div class="d-flex gap-2 align-items-center">
                                  <button
                                    class=" btn btn-sm btn-danger"
                                    style="font-size:12px">Run Again</button
                                  >
                                  <select
                                    class="form-control py-0 px-1 w-25"
                                    style="font-size:12px"
                                  >
                                    <option>Automate</option>
                                    <option>Schedule Run</option>
                                  </select>
                                  <button
                                    class=" btn btn-sm btn-white"
                                    style="font-size:13px"
                                  >
                                    <i
                                      class="fa-solid fa-plus"
                                      style="font-size:13px"
                                    ></i>
                                    &nbsp; New Run
                                  </button>
                                  <button
                                    class=" btn btn-sm btn-white"
                                    style="font-size:13px"
                                  >
                                    Export
                                  </button>
                                </div>
                              </div>
                              <div style="font-size:12px" class="my-2">
                                <i class="bi bi-user"></i> Run Today at {manualrunResults.runTime}
                                . <a class="text-dark">View All Runs</a>
                              </div>

                              <div
                                style="font-size:14px"
                                class="mt-1 mb-2 w-100"
                              >
                                <div class="table-responsive w-100">
                                  <table class="table w-100 bg-white text-dark">
                                    <thead
                                      class="text-secondary w-100"
                                      style="font-size:14px"
                                    >
                                      <tr>
                                        <th class="">Source</th>
                                        <th class="">Environments</th>
                                        <th class="">Iterations</th>
                                        <th class="">Duration</th>

                                        <th class="">All tests</th>

                                        <th class="">Avg. Resp. Time</th>
                                      </tr>
                                    </thead>
                                    <tbody class="w-100">
                                      <tr>
                                        <td>
                                          <h6
                                            style="font-size:14px"
                                            class="font600"
                                          >
                                            Runner
                                          </h6>
                                        </td>
                                        <td>
                                          <h6
                                            style="font-size:14px"
                                            class="font600"
                                          >
                                            {manualrunResults.envValue}
                                          </h6>
                                        </td>
                                        <td>
                                          <h6
                                            style="font-size:14px"
                                            class="font600"
                                          >
                                            {manualrunResults.iterations}
                                          </h6>
                                        </td>
                                        <td>
                                          <h6
                                            style="font-size:14px"
                                            class="font600"
                                          >
                                            {manualrunResults.duration}
                                          </h6>
                                        </td>
                                        <td>
                                          <h6
                                            style="font-size:14px"
                                            class="font600"
                                          >
                                            {manualrunResults.allTests}
                                          </h6>
                                        </td>
                                        <td>
                                          <h6
                                            style="font-size:14px"
                                            class="font600"
                                          >
                                            -
                                          </h6>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              <div class="mt-2 runnav">
                                <div role="tablist" class="tabs tabs-lifted">
                                  <input
                                    type="radio"
                                    name="my_tabs_2"
                                    role="tab"
                                    class="tab hover:text-green-700 bg-transparent font-medium checked:text-checked-green checked:font-semibold"
                                    aria-label="All Tests"
                                    checked
                                  />
                                  <div
                                    role="tabpanel"
                                    class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                                  >
                                    <div id="tab-run1">
                                      <div class="row">
                                        <div class="col pe-2">
                                          <div
                                            style="font-size:15px"
                                            class="font600"
                                          >
                                            Iteration {manualrunResults.iterations}
                                            <span class="text-light"
                                              >---------------------------------------</span
                                            >
                                          </div>
                                          {#if resultEndToEnd}
                                            {#each endtoendResults as request}
                                              <div
                                                data-testid="resultList"
                                                class="mt-3 listhover shadow-sm"
                                                style="cursor:pointer"
                                                on:click={() => {
                                                  showRunDetailsEndToEnd(
                                                    request
                                                  );
                                                }}
                                              >
                                                <div
                                                  class="d-flex gap-2 align-items-center"
                                                  style="font-size:13px"
                                                >
                                                  <div>
                                                    {#if request.method === "GET"}
                                                      <span
                                                        class="text-success font600"
                                                        >{request.method}</span
                                                      >
                                                    {:else if request.method === "POST"}
                                                      <span
                                                        class="text-primary font600"
                                                      >
                                                        {request.method}</span
                                                      >
                                                    {:else if request.method === "DELETE"}
                                                      <span
                                                        class="text-danger font600"
                                                      >
                                                        {request.method}</span
                                                      >
                                                    {/if}
                                                  </div>
                                                  <div
                                                    style="text-transform:capitalize"
                                                  >
                                                    {request.name}
                                                  </div>
                                                </div>
                                                <div
                                                  style="font-size:12px"
                                                  class="d-flex align-items-center justify-content-between"
                                                >
                                                  <span>
                                                    {request.request.url}
                                                  </span>
                                                  <div
                                                    class="d-flex gap-2 align-items-center"
                                                  >
                                                    <span>
                                                      {request.status}
                                                    </span>
                                                    <span>
                                                      {manualrunResults.duration}
                                                    </span>
                                                  </div>
                                                </div>
                                                {#if request.status === 200}
                                                  <div
                                                    class="mt-2 p-2 d-flex gap-3 align-items-center"
                                                    style="border-left:3px solid green;font-size:13px"
                                                  >
                                                    <div>
                                                      {#if request.status === 200}
                                                        PASS
                                                      {:else}
                                                        FAIL
                                                      {/if}
                                                    </div>
                                                    <div style="font-size:12px">
                                                      {#each request.message as msg}
                                                        {msg}
                                                        <br />
                                                        <!-- Add a line break after each message -->
                                                      {/each}
                                                    </div>
                                                  </div>
                                                {:else}
                                                  <div
                                                    class="mt-2 p-2 d-flex gap-3"
                                                    style="border-left:3px solid red;font-size:13px"
                                                  >
                                                    <div>
                                                      {#if request.status === 200}
                                                        PASS
                                                      {:else}
                                                        FAIL
                                                      {/if}
                                                    </div>
                                                    <div>
                                                      {request.message}
                                                    </div>
                                                  </div>
                                                {/if}
                                              </div>
                                            {/each}
                                          {:else if manualrunResults.requests && runcollectiontests}
                                            {#each manualrunResults.requests as request}
                                              <div
                                                class="mt-3 listhover shadow-sm"
                                                style="cursor:pointer"
                                                on:click={() => {
                                                  showRunDetails(request);
                                                }}
                                              >
                                                <div
                                                  class="d-flex gap-2 align-items-center"
                                                  style="font-size:13px"
                                                >
                                                  <div>
                                                    {#if request.method === "GET"}
                                                      <span
                                                        class="text-success font600"
                                                        >{request.method}</span
                                                      >
                                                    {:else if request.method === "POST"}
                                                      <span
                                                        class="text-primary font600"
                                                      >
                                                        {request.method}</span
                                                      >
                                                    {:else if request.method === "DELETE"}
                                                      <span
                                                        class="text-danger font600"
                                                      >
                                                        {request.method}</span
                                                      >
                                                    {/if}
                                                  </div>
                                                  <div
                                                    style="text-transform:capitalize"
                                                  >
                                                    {request.name}
                                                  </div>
                                                </div>
                                                <div
                                                  style="font-size:12px"
                                                  class="d-flex align-items-center justify-content-between"
                                                >
                                                  <span>
                                                    {request.url}
                                                  </span>
                                                  <div
                                                    class="d-flex gap-2 align-items-center"
                                                  >
                                                    <span>
                                                      {request.status}
                                                    </span>
                                                    <span>
                                                      {manualrunResults.duration}
                                                    </span>
                                                  </div>
                                                </div>
                                                {#if request.status === 200}
                                                  <div
                                                    class="mt-2 p-2 d-flex gap-3"
                                                    style="border-left:3px solid green;font-size:13px"
                                                  >
                                                    <div>
                                                      {#if request.status === 200}
                                                        PASS
                                                      {:else}
                                                        FAIL
                                                      {/if}
                                                    </div>
                                                    <div>
                                                      {request.message}
                                                    </div>
                                                  </div>
                                                {:else}
                                                  <div
                                                    class="mt-2 p-2 d-flex gap-3"
                                                    style="border-left:3px solid red;font-size:13px"
                                                  >
                                                    <div>
                                                      {#if request.status === 200}
                                                        PASS
                                                      {:else}
                                                        FAIL
                                                      {/if}
                                                    </div>
                                                    <div>
                                                      {request.message}
                                                    </div>
                                                  </div>
                                                {/if}
                                              </div>
                                            {/each}
                                          {/if}
                                        </div>
                                        {#if resultEndToEndDetails}
                                          {#each endtoendResults as request}
                                            {#if showrundetailsendToend[request.name]}
                                              <div
                                                class="col border-start ps-2"
                                                style="height:67vh"
                                              >
                                                <div
                                                  class="d-flex gap-2 align-items-center font600"
                                                  style="font-size:14px"
                                                >
                                                  <div>
                                                    {#if request.method === "GET"}
                                                      <span
                                                        class="text-success font600"
                                                        >{request.method}</span
                                                      >
                                                    {:else if request.method === "POST"}
                                                      <span
                                                        class="text-primary font600"
                                                      >
                                                        {request.method}</span
                                                      >
                                                    {:else if request.method === "DELETE"}
                                                      <span
                                                        class="text-danger font600"
                                                      >
                                                        {request.method}</span
                                                      >
                                                    {/if}
                                                  </div>
                                                  <div
                                                    style="text-transform:capitalize;font-size:15px"
                                                  >
                                                    {request.name}
                                                  </div>
                                                </div>

                                                <div
                                                  class="tab-class mt-2 runnav"
                                                >
                                                  <div
                                                    class=" border-bottom d-flex justify-content-between me-1 align-items-center"
                                                  >
                                                    <ul
                                                      class="nav nav-pills d-inline-flex justify-content-center"
                                                    >
                                                      <li
                                                        class="nav-item"
                                                        style="font-sixe:13px"
                                                      >
                                                        <a
                                                          class="d-flex align-items-center text-start mx-3 ms-0 pb-2 text-decoration-none text-dark active"
                                                          data-bs-toggle="pill"
                                                          href="#tabresult1"
                                                          on:click={() =>
                                                            activateTab(
                                                              "tabresult1"
                                                            )}
                                                        >
                                                          <h6
                                                            class="mt-n1 mb-0"
                                                            style="font-size:13px"
                                                          >
                                                            Response
                                                          </h6>
                                                        </a>
                                                      </li>
                                                      <li
                                                        class="nav-item"
                                                        style="font-sixe:13px"
                                                      >
                                                        <a
                                                          class="d-flex align-items-center text-start mx-3 ms-0 pb-2 text-decoration-none text-dark"
                                                          data-bs-toggle="pill"
                                                          href="#tabresult2"
                                                          on:click={() =>
                                                            activateTab(
                                                              "tabresult2"
                                                            )}
                                                        >
                                                          <h6
                                                            class="mt-n1 mb-0"
                                                            style="font-size:13px"
                                                          >
                                                            Headers
                                                          </h6>
                                                        </a>
                                                      </li>
                                                      <li
                                                        class="nav-item"
                                                        style="font-sixe:13px"
                                                      >
                                                        <a
                                                          class="d-flex align-items-center text-start mx-3 ms-0 pb-2 text-decoration-none text-dark"
                                                          data-bs-toggle="pill"
                                                          href="#tabresult3"
                                                          on:click={() =>
                                                            activateTab(
                                                              "tabresult3"
                                                            )}
                                                        >
                                                          <h6
                                                            class="mt-n1 mb-0"
                                                            style="font-size:13px"
                                                          >
                                                            Request
                                                          </h6>
                                                        </a>
                                                      </li>
                                                    </ul>
                                                    <div
                                                      style="font-size:12px"
                                                      class="d-flex gap-2 align-items-center"
                                                    >
                                                      <span>
                                                        {request.status}</span
                                                      >
                                                      <span>
                                                        {manualrunResults.duration}</span
                                                      >
                                                    </div>
                                                  </div>
                                                  <div class="tab-content mt-2">
                                                    {#if activeTab === "tabresult1"}
                                                      <div
                                                        id="tabresult1"
                                                        class="tab-pane fade show p-0 active"
                                                      >
                                                        <textarea
                                                          class="w-100 p-1"
                                                          style="color:blue;font-size:11px;height:56vh!important;border:0;outline:0"
                                                          >{JSON.stringify(
                                                            request.response,
                                                            null,
                                                            2
                                                          )}
                                                        </textarea>
                                                      </div>
                                                    {/if}
                                                    {#if activeTab === "tabresult2"}
                                                      <div
                                                        id="tabresult2"
                                                        style="font-size:13px"
                                                        class="tab-pane fade show p-0 active"
                                                      >
                                                        <div>
                                                          <span class="font600"
                                                            >General</span
                                                          >
                                                          <div
                                                            style="font-size:11px"
                                                          >
                                                            URL : <span
                                                              class="text-primary"
                                                              >{request.request
                                                                .url}</span
                                                            >
                                                          </div>
                                                          <div
                                                            style="font-size:11px"
                                                            class="mt-1"
                                                          >
                                                            Method : <span
                                                              class="text-primary"
                                                              >{request.method}</span
                                                            >
                                                          </div>

                                                          <div
                                                            style="font-size:11px"
                                                            class="mt-1"
                                                          >
                                                            Status Code: <span
                                                              class="text-primary"
                                                              >{request.status}</span
                                                            >
                                                          </div>
                                                        </div>
                                                        <div class="mt-3">
                                                          <span class="font600"
                                                            >Response Headers</span
                                                          >
                                                          <div
                                                            style="font-size:11px"
                                                          >
                                                            Content-Length : <span
                                                              class="text-primary"
                                                              >{request.headers}</span
                                                            >
                                                          </div>
                                                          <div
                                                            style="font-size:11px"
                                                            class="mt-1"
                                                          >
                                                            Content-Type : <span
                                                              class="text-primary"
                                                              >{request.type}</span
                                                            >
                                                          </div>
                                                        </div>
                                                      </div>
                                                    {/if}
                                                    {#if activeTab === "tabresult3"}
                                                      <div
                                                        id="tabresult3"
                                                        style="font-size:13px"
                                                        class="tab-pane fade show p-0 active"
                                                      >
                                                        <div>
                                                          {#if request.request.requestBody !== ""}
                                                            <textarea
                                                              class="w-100 p-1"
                                                              style="color:blue;font-size:11px;height:56vh!important;border:0;outline:0"
                                                            >
                                                              {request.body}
                                                            </textarea>
                                                          {:else}
                                                            <div
                                                              class="pt-4 d-flex align-items-center justify-content-center"
                                                            >
                                                              This request
                                                              doesn't have a
                                                              body
                                                            </div>
                                                          {/if}
                                                        </div>
                                                      </div>
                                                    {/if}
                                                  </div>
                                                </div>
                                              </div>
                                            {/if}
                                          {/each}
                                        {/if}

                                        {#if manualrunResults.requests}
                                          {#each manualrunResults.requests as request}
                                            {#if showrundetails[request.name]}
                                              <div
                                                class="col border-start ps-2"
                                                style="height:67vh"
                                              >
                                                <div
                                                  class="d-flex gap-2 align-items-center font600"
                                                  style="font-size:14px"
                                                >
                                                  <div>
                                                    {#if request.method === "GET"}
                                                      <span
                                                        class="text-success font600"
                                                        >{request.method}</span
                                                      >
                                                    {:else if request.method === "POST"}
                                                      <span
                                                        class="text-primary font600"
                                                      >
                                                        {request.method}</span
                                                      >
                                                    {:else if request.method === "DELETE"}
                                                      <span
                                                        class="text-danger font600"
                                                      >
                                                        {request.method}</span
                                                      >
                                                    {/if}
                                                  </div>
                                                  <div
                                                    style="text-transform:capitalize;font-size:15px"
                                                  >
                                                    {request.name}
                                                  </div>
                                                </div>

                                                <div
                                                  class="tab-class mt-2 runnav"
                                                >
                                                  <div
                                                    class=" border-bottom d-flex justify-content-between me-1 align-items-center"
                                                  >
                                                    <ul
                                                      class="nav nav-pills d-inline-flex justify-content-center"
                                                    >
                                                      <li
                                                        class="nav-item"
                                                        style="font-sixe:13px"
                                                      >
                                                        <a
                                                          class="d-flex align-items-center text-start mx-3 ms-0 pb-2 text-decoration-none text-dark active"
                                                          data-bs-toggle="pill"
                                                          href="#tabresult1"
                                                          on:click={() =>
                                                            activateTab(
                                                              "tabresult1"
                                                            )}
                                                        >
                                                          <h6
                                                            class="mt-n1 mb-0"
                                                            style="font-size:13px"
                                                          >
                                                            Response
                                                          </h6>
                                                        </a>
                                                      </li>
                                                      <li
                                                        class="nav-item"
                                                        style="font-sixe:13px"
                                                      >
                                                        <a
                                                          class="d-flex align-items-center text-start mx-3 ms-0 pb-2 text-decoration-none text-dark"
                                                          data-bs-toggle="pill"
                                                          href="#tabresult2"
                                                          on:click={() =>
                                                            activateTab(
                                                              "tabresult2"
                                                            )}
                                                        >
                                                          <h6
                                                            class="mt-n1 mb-0"
                                                            style="font-size:13px"
                                                          >
                                                            Headers
                                                          </h6>
                                                        </a>
                                                      </li>
                                                      <li
                                                        class="nav-item"
                                                        style="font-sixe:13px"
                                                      >
                                                        <a
                                                          class="d-flex align-items-center text-start mx-3 ms-0 pb-2 text-decoration-none text-dark"
                                                          data-bs-toggle="pill"
                                                          href="#tabresult3"
                                                          on:click={() =>
                                                            activateTab(
                                                              "tabresult3"
                                                            )}
                                                        >
                                                          <h6
                                                            class="mt-n1 mb-0"
                                                            style="font-size:13px"
                                                          >
                                                            Request
                                                          </h6>
                                                        </a>
                                                      </li>
                                                    </ul>
                                                    <div
                                                      style="font-size:12px"
                                                      class="d-flex gap-2 align-items-center"
                                                    >
                                                      <span>
                                                        {request.status}</span
                                                      >
                                                      <span>
                                                        {manualrunResults.duration}</span
                                                      >
                                                    </div>
                                                  </div>
                                                  <div class="tab-content mt-2">
                                                    {#if activeTab === "tabresult1"}
                                                      <div
                                                        id="tabresult1"
                                                        class="tab-pane fade show p-0 active"
                                                      >
                                                        <textarea
                                                          class="w-100 p-1"
                                                          style="color:blue;font-size:11px;height:56vh!important;border:0;outline:0"
                                                          >{JSON.stringify(
                                                            request.data,
                                                            null,
                                                            2
                                                          )}
                                                        </textarea>
                                                      </div>
                                                    {/if}
                                                    {#if activeTab === "tabresult2"}
                                                      <div
                                                        id="tabresult2"
                                                        style="font-size:13px"
                                                        class="tab-pane fade show p-0 active"
                                                      >
                                                        <div>
                                                          <span class="font600"
                                                            >General</span
                                                          >
                                                          <div
                                                            style="font-size:11px"
                                                          >
                                                            URL : <span
                                                              class="text-primary"
                                                              >{request.url}</span
                                                            >
                                                          </div>
                                                          <div
                                                            style="font-size:11px"
                                                            class="mt-1"
                                                          >
                                                            Method : <span
                                                              class="text-primary"
                                                              >{request.method}</span
                                                            >
                                                          </div>

                                                          <div
                                                            style="font-size:11px"
                                                            class="mt-1"
                                                          >
                                                            Status Code: <span
                                                              class="text-primary"
                                                              >{request.status}</span
                                                            >
                                                          </div>
                                                        </div>
                                                        <div class="mt-3">
                                                          <span class="font600"
                                                            >Response Headers</span
                                                          >
                                                          <div
                                                            style="font-size:11px"
                                                          >
                                                            Content-Length : <span
                                                              class="text-primary"
                                                              >{request.headers
                                                                .content -
                                                                length}</span
                                                            >
                                                          </div>
                                                          <div
                                                            style="font-size:11px"
                                                            class="mt-1"
                                                          >
                                                            Content-Type : <span
                                                              class="text-primary"
                                                              >{request.type}</span
                                                            >
                                                          </div>
                                                        </div>
                                                      </div>
                                                    {/if}
                                                    {#if activeTab === "tabresult3"}
                                                      <div
                                                        id="tabresult3"
                                                        style="font-size:13px"
                                                        class="tab-pane fade show p-0 active"
                                                      >
                                                        <div>
                                                          {#if request.body !== ""}
                                                            <textarea
                                                              class="w-100 p-1"
                                                              style="color:blue;font-size:11px;height:56vh!important;border:0;outline:0"
                                                            >
                                                              {request.body}
                                                            </textarea>
                                                          {:else}
                                                            <div
                                                              class="pt-4 d-flex align-items-center justify-content-center"
                                                            >
                                                              This request
                                                              doesn't have a
                                                              body
                                                            </div>
                                                          {/if}
                                                        </div>
                                                      </div>
                                                    {/if}
                                                  </div>
                                                </div>
                                              </div>
                                            {/if}
                                          {/each}
                                        {/if}
                                      </div>
                                    </div>
                                  </div>
                                  <input
                                    type="radio"
                                    name="my_tabs_2"
                                    role="tab"
                                    class="tab hover:text-green-700 bg-transparent font-medium checked:text-checked-green checked:font-semibold"
                                    aria-label="Passed(0)"
                                  />
                                  <div
                                    role="tabpanel"
                                    class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                                  >
                                    Passed
                                  </div>
                                  <div
                                    role="tabpanel"
                                    class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                                  ></div>
                                  <input
                                    type="radio"
                                    name="my_tabs_2"
                                    role="tab"
                                    class="tab hover:text-green-700 bg-transparent font-medium checked:text-checked-green checked:font-semibold"
                                    aria-label="Failed(0)"
                                  />
                                  <div
                                    role="tabpanel"
                                    class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                                  >
                                    Failed
                                  </div>
                                  <div
                                    role="tabpanel"
                                    class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                                  ></div>
                                  <input
                                    type="radio"
                                    name="my_tabs_2"
                                    role="tab"
                                    class="tab hover:text-green-700 bg-transparent font-medium checked:text-checked-green checked:font-semibold"
                                    aria-label="Skipped(0)"
                                  />
                                  <div
                                    role="tabpanel"
                                    class="tab-content bg-base-100 border-base-300 rounded-box p-6"
                                  >
                                    Skipped
                                  </div>
                                </div>
                              </div>
                            </div>
                          {/if}
                        {/if}
                      {/each}
                    {/each}
                  </div>
                </div>
              </div>
            </div>
          {/if}
          <!-- split tabs -->
          {#if isSplitBox}
            {#each editorData.splitViews as split (split.name)}
              <div
                class="col code-container second-col"
                style="    border-left: 4px solid darkgray;overflow:auto;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              "
              >
                <div class="code-header p-0 flex justify-between items-center">
                  <div class="flex">
                    <ul
                      class="nav nav-pills d-inline-flex justify-content-center list-style-none"
                    >
                      {#each split.tabs as tabs, index}
                        <li
                          style="font-size: 12px;"
                          class="nav-item tab border-end border-secondary py-1 px-2"
                        >
                          <a
                            class="text-decoration-none text-white mt-2 d-inline-block{index ===
                            activeTabIndex
                              ? 'active'
                              : ''}"
                            data-bs-toggle="pill"
                            href={`#${split.id}`}
                            >{tabs.tabId}<i class="bi bi-gear-fill mx-2" /></a
                          >
                        </li>
                      {/each}
                    </ul>
                    <span
                      class="plus-box bg-green-600 py-2 px-2 text-white border-0 rounded-0"
                      ><i class="bi bi-plus-lg" /></span
                    >
                  </div>
                  <div>
                    <select
                      name=""
                      id=""
                      class="border-0 outline-0 text-white mx-3 p-1"
                      style=" font-size:13px;opacity:0.7;"
                    >
                      <option value="java8"
                        >Java 8 <i class="fa-solid fa-caret-down"
                          >&nbsp;&nbsp;</i
                        ></option
                      >
                    </select>
                  </div>
                </div>
                <div class="row code-content">
                  <div
                    class="col-1 code-col1 border-end border-secondary px-2 pt-2 serial-no"
                    style="color: #fff;opacity:0.4;"
                  >
                    {#each numbers as number (number)}
                      <div>{number}</div>
                    {/each}
                  </div>

                  {#each editorData.splitViews as split (split.name)}
                    <div class="col-11 code-col2">
                      <div class="tab-content">
                        <div
                          id={split.id}
                          class="tab-pane fade show p-0 active text-white"
                        >
                          {#each split.tabs as tab (tab.tabId)}
                            <textarea
                              name=""
                              id=""
                              class="code-area"
                              value={tab.content.code}
                            />
                          {/each}
                        </div>
                      </div>
                    </div>
                  {/each}

                  <!-- <div id="tab-2" class="tab-pane fade show p-0 text-white">
                                <textarea name="" id="" class="code-area" />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          </div> -->
                  <!-- </div>
                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          {/each} -->
                </div>
                <div class="">
                  <button
                    class="btn btn-whi my-2 mx-3"
                    style="font-size: 14px;"
                    on:click={runAll}>Run All</button
                  >
                </div>
                <div class="col-12 d-flex mb-3">
                  <div class=" col-12 file-list">
                    {#each split.tabs as tabs (tabs.tabId)}
                      {#each tabs.content.tdd as testcase (testcase.name)}
                        <li
                          class="file-item d-flex gap-5"
                          style="cursor:pointer"
                        >
                          <div
                            class="px-3"
                            style="border-right:1px solid gray;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  "
                          >
                            <i
                              class={testcase.type === "code"
                                ? " fa-solid fa-file"
                                : "fa-solid fa-folder"}
                            />
                            <span class="file-name">{testcase.name}</span>
                          </div>
                          <div class="d-flex gap-2">
                            <textarea
                              name=""
                              id=""
                              rows="2"
                              class="text-white form-control"
                              style="width: 100%;border:0;outline:0;font-size:14px"
                              value={testcase.code}
                            />
                            <button
                              class=" mx-3 mt-2"
                              style="font-size: 14px;height:38px;border-radius:7px;border:0;outline:0;padding:10px "
                              on:click={() =>
                                runSpecific(testcase.id, tabs.tabId)}
                              >Run</button
                            >
                            {#if testcase.showCheck}
                              <div class="mt-3 ms-2">
                                <!-- The circle-check icon when showCheck is true -->
                                <i
                                  class="fas fa-check-circle"
                                  style="color:green"
                                />
                              </div>
                            {/if}
                          </div>
                        </li>
                      {/each}
                    {/each}
                  </div>
                </div>
              </div>
            {/each}
          {/if}
          <!-- third column content -->
          {#if isThirdColContent}
            <div class=" third-col bg-gray-100">
              <div
                on:drop={(event) => handleDropinThirdCol(event)}
                on:dragover={(event) => handleDragOver(event)}
                class="row bg-green-100"
                style="overflow:auto"
              >
                <div class="col d-flex align-items-center">
                  <div class="py-2 px-3" on:click={toggleThirdCol}>
                    <i class="bi bi-list" />
                  </div>
                  <div>
                    <ul class=" w-full nav nav-pills list-style-none">
                      {#each editorData.reviewFiles as files (files.name)}
                        {#each files.tabs as tab (tab.id)}
                          <li
                            draggable="true"
                            on:dragstart={(event) =>
                              handleDragStartRe(event, tab)}
                            style="font-size: 12px;"
                            class="nav-item flex gap-2 bg-gray-100 items-center
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  tab border-end py-0 px-2"
                          >
                            <a
                              class="text-decoration-none d-inline-block activeTabIndex
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ? 'active'
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      : ''}"
                              data-bs-toggle="pill"
                              href={`#${tab.id}`}
                              on:click={() => switchFile2(tab.id)}
                              class:active={selectedFileForThirdCol === tab.id}
                              >{tab.tabId}
                            </a>
                            <button
                              class="ms-1 bg-transparent"
                              on:click={() => closeTab2(tab.id)}
                              ><i class="bi bi-x" /></button
                            >
                          </li>
                        {/each}
                      {/each}
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Resizing handle -->
              <div class="resize-handle" on:mousedown={handleMouseDown}></div>

              <div class="mt-2 overflow-auto h-[100vh] pb-5">
                {#each editorData.reviewFiles as files (files.name)}
                  {#each files.tabs as tab (tab.id)}
                    {#if selectedFileForThirdCol === tab.id}
                      <div>
                        {#if tab.content.type === "Postman"}
                          <div class="postman-area h-100">
                            <div class="p-1">
                              <div
                                class="d-flex justify-content-between align-items-center"
                              >
                                <div class="">
                                  <div
                                    class="d-flex align-items-center"
                                    style="font-size:12px"
                                  >
                                    {#if tabSubLevelName === ""}
                                      <input
                                        type="text"
                                        class="bg-gray-200 text-xs form-control py-0 px-1 border-0"
                                        bind:value={tabSubName}
                                      />
                                    {:else}
                                      <div class="text-gray-500">
                                        {tabSubName}
                                      </div>
                                    {/if}

                                    {#if tabSubLevelName !== ""}
                                      &nbsp; / <input
                                        type="text"
                                        class="text-xs py-0 px-1 ms-1 border-0"
                                        style=""
                                        bind:value={tabSubLevelName}
                                      />
                                    {/if}
                                  </div>
                                </div>
                                <button
                                  on:click={() => savePostmanData(tab)}
                                  class="btn btn-sm"
                                  style="font-size:12px"
                                >
                                  Save
                                </button>
                              </div>
                              <div
                                style="postion:relative"
                                class="d-flex justify-content-between mt-2 align-items-center gap-1"
                              >
                                {#if tab.content}
                                  <select
                                    name=""
                                    id=""
                                    bind:value={tab.content.objDetails
                                      .requestMethod}
                                    style="width: 15%; font-size: 14px"
                                    class="select-test-type form-control border-end"
                                  >
                                    <option value="GET">GET</option>
                                    <option value="POST">POST</option>
                                    <option value="PUT">PUT</option>
                                    <option value="DELETE">DELETE</option>
                                    <option value="PATCH">PATCH</option>
                                  </select>
                                  <input
                                    type="text"
                                    class=" form-control border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    id={`${tab.content.objDetails.requestUrlRaw}input`}
                                    style="font-size:14px;"
                                    on:input={handleSelectChange}
                                    bind:value={tab.content.objDetails
                                      .requestUrlRaw}
                                    placeholder="Enter URL or paste text"
                                  />
                                  <button
                                    on:click={() => sendRequest(tab.content)}
                                    class="btn btn-primary py-1 px-2"
                                    style=" ">Send</button
                                  >
                                {/if}
                                {#if variableChooseBox}
                                  <div
                                    class="variablechoosebox bg-white text-dark p-2 border"
                                  >
                                    <span
                                      class="text-primary"
                                      style="cursor:pointer"
                                      on:click={variableChooseBoxContainer}
                                      >Set as variable</span
                                    >
                                    | &nbsp;
                                    <span>
                                      <i class="fa-solid fa-ellipsis"></i>
                                    </span>
                                  </div>
                                {/if}
                                {#if variablechooseboxcontainer}
                                  <div
                                    class="variablechooseboxcontainer shadow-sm bg-white text-dark p-2 border"
                                  >
                                    <div class="pb-2 text-end">
                                      <i
                                        class="fa-solid fa-times"
                                        on:click={() =>
                                          (variablechooseboxcontainer = false)}
                                      ></i>
                                    </div>
                                    <div>
                                      <input
                                        type="text"
                                        placeholder="Find a Variable"
                                        style="font-size:13px"
                                        class="form-control"
                                      />
                                    </div>
                                    <div class="mt-2 hoverlist p-1">
                                      <i class="fa-solid fa-plus"></i>&nbsp; Set
                                      as new variable
                                    </div>
                                    <ul style="list-style-type:none">
                                      {#each rowsForEnv as list (list.id)}
                                        <li
                                          class="mt-2 mb-2 ms-2 hoverlist"
                                          on:click={() =>
                                            addVariableToPath(
                                              list.variableName
                                            )}
                                        >
                                          {#if tab.tabId === "Globals"}
                                            <i
                                              class="fa-solid fa-g bg-primary p-1"
                                            ></i>&nbsp;&nbsp;
                                            {list.variableName}{:else}
                                            <i
                                              class="fa-solid fa-c bg-success p-1"
                                            ></i>
                                            &nbsp;&nbsp;
                                            {list.variableName}
                                          {/if}
                                        </li>
                                      {/each}
                                    </ul>
                                  </div>
                                {/if}
                              </div>
                              <div
                                role="tablist"
                                class="tabs mt-1 postmanTab"
                                data-testid="tabListPostman"
                              >
                                <input
                                  type="radio"
                                  name="my_tabs_1"
                                  role="tab"
                                  class="tab text-xs bg-transparent border-0 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                  aria-label="Params"
                                  checked
                                />
                                <div role="tabpanel" class="tab-content p-0">
                                  <h6
                                    class="mt-3 mb-1 text-sm font-semibold text-gray-600"
                                  >
                                    Query Params
                                  </h6>
                                  <div class="table-responsive">
                                    <div class="table border border-gray-200">
                                      <thead>
                                        <tr>
                                          <th class="border-end border-gray-200"
                                            >Key</th
                                          >
                                          <th class="border-end border-gray-200"
                                            >Value</th
                                          >
                                          <th class="border-end border-gray-200"
                                            >Description</th
                                          >
                                          <th
                                            class="px-5 border-gray-200"
                                            style="padding-left: 1.7rem;padding-right:3rem"
                                            >Bulk Edit
                                          </th>
                                          <th class="border-gray-200"></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {#each editorData.files as files (files.name)}
                                          {#each files.tabs as tab}
                                            {#if tab.content.requestUrlQuery}
                                              {#each tab.content.requestUrlQuery as query}
                                                <tr>
                                                  <td
                                                    class="border-end border-secondary"
                                                  >
                                                    <input
                                                      bind:value={query.key}
                                                      on:focus={() =>
                                                        (variablechooseboxcontainer = true)}
                                                      on:blur={() =>
                                                        (variablechooseboxcontainer = false)}
                                                      on:input={() =>
                                                        addQueryKeyToPath(
                                                          query.key
                                                        )}
                                                      type="text"
                                                      placeholder="Key"
                                                      class="form-control bg-gray-50"
                                                    />
                                                  </td>
                                                  <td
                                                    class="border-end border-secondary"
                                                  >
                                                    <input
                                                      bind:value={query.value}
                                                      on:input={() =>
                                                        addQueryValueToPath(
                                                          query.value
                                                        )}
                                                      type="text"
                                                      placeholder="Value"
                                                      class="form-control bg-gray-50"
                                                    />
                                                  </td>
                                                  <td
                                                    colspan="2"
                                                    class="border-end border-secondary"
                                                  >
                                                    <input
                                                      bind:value={query.description}
                                                      type="text"
                                                      placeholder="Description"
                                                      class="form-control bg-gray-50"
                                                    />
                                                  </td>
                                                  <td
                                                    class="mx-2 border-secondary border-end"
                                                  >
                                                    <button
                                                      class="btn text-gray-500 p-1"
                                                      on:click={() =>
                                                        deleteRowQueryParams(
                                                          tab.content
                                                            .requestUrlQuery,
                                                          query.id
                                                        )}
                                                      style="margin-left:-0.2rem"
                                                    >
                                                      <i
                                                        class="fa-solid fa-trash"
                                                      ></i>
                                                    </button>
                                                  </td>
                                                </tr>
                                              {/each}
                                            {/if}
                                          {/each}
                                        {/each}
                                      </tbody>
                                    </div>
                                    <div class="text-end">
                                      <button
                                        class="btn text-gray-500 p-1"
                                        on:click={() =>
                                          addRowQueryParams(
                                            tab.content.requestUrlQuery
                                          )}
                                      >
                                        <i class="fa-solid fa-circle-plus"></i>
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                <input
                                  type="radio"
                                  name="my_tabs_1"
                                  role="tab"
                                  class="tab text-xs bg-transparent border-0 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                  aria-label="Authorization"
                                />
                                <div role="tabpanel" class="tab-content p-0">
                                  <div class="row mt-3">
                                    <div
                                      class="col-lg-4 col-10 border-end border-secondary"
                                    >
                                      <div class="d-flex gap-3">
                                        <span>Type</span>
                                        <select
                                          name=""
                                          id=""
                                          class="bg-gray-50"
                                          style=""
                                          bind:value={selectedAuthType}
                                          on:change={updateAuthDetails}
                                        >
                                          <option value="API Key"
                                            >API Key</option
                                          >
                                          <option value="Bearer Token"
                                            >Bearer Token</option
                                          >
                                          <option value="JWT Bearer"
                                            >JWT Bearer</option
                                          >
                                          <option value="Basic Auth"
                                            >Basic Auth</option
                                          >
                                          <option value="No Auth"
                                            >No Auth</option
                                          >
                                          <option value="Digest Auth"
                                            >Digest Auth</option
                                          >
                                          <option value="OAth 1.0"
                                            >OAth 1.0</option
                                          >
                                        </select>
                                      </div>
                                      <span
                                        class="mt-2 d-inline-block"
                                        style="font-size: 13px;"
                                      >
                                        The authorization header will be
                                        automatically generated when you send
                                        the request. Learn more about
                                        <a href=""> authorization </a>
                                      </span>
                                    </div>
                                    <div class="col-lg-8 col-10 py-3 px-4">
                                      {#each authDetails as { label, placeholder, value }}
                                        <div
                                          class="d-flex justify-content-between"
                                          key={label}
                                        >
                                          <span class="mb-2">{label}</span>
                                          <input
                                            type="text"
                                            bind:value
                                            {placeholder}
                                            class="p-1 mb-2 bg-gray-50"
                                          />
                                        </div>
                                      {/each}
                                    </div>
                                  </div>
                                </div>

                                <input
                                  type="radio"
                                  name="my_tabs_1"
                                  data-testid="headerTab"
                                  role="tab"
                                  class="tab text-xs bg-transparent border-0 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                  aria-label="Headers"
                                />
                                <div role="tabpanel" class="tab-content p-0">
                                  <h6
                                    class="text-sm font-semibold text-gray-500 mt-3"
                                  >
                                    Headers
                                  </h6>
                                  <div class="table-responsive tableHeader">
                                    <div class="table border border-gray-200">
                                      <thead>
                                        <tr>
                                          <th class="border-end border-gray-200"
                                            >Key</th
                                          >
                                          <th class="border-end border-gray-200"
                                            >Value</th
                                          >
                                          <th class="border-end border-gray-200"
                                            >Description</th
                                          >
                                          <th
                                            class="px-5 border-gray-200"
                                            style="padding-left: 1rem;padding-right:3rem"
                                            >Bulk Edit
                                          </th>
                                          <th
                                            class="border-end border-gray-200"
                                          />
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {#each editorData.files as files (files.name)}
                                          {#each files.tabs as tab}
                                            {#if tab.content.requestHeader}
                                              {#each tab.content.requestHeader as header}
                                                <tr>
                                                  <td
                                                    class="border-end border-secondary"
                                                  >
                                                    <input
                                                      bind:value={header.key}
                                                      type="text"
                                                      placeholder="Key"
                                                      data-testid="headerKeyInput"
                                                      class="form-control bg-gray-50 headerKeyInput"
                                                      style="font-size:14px"
                                                    />
                                                  </td>
                                                  <td
                                                    class="border-end border-secondary"
                                                  >
                                                    <input
                                                      bind:value={header.value}
                                                      type="text"
                                                      placeholder="Value"
                                                      data-testid="headerValueInput"
                                                      style="font-size:14px"
                                                      class="form-control bg-gray-50"
                                                      aria-label="headerValueInput"
                                                    />
                                                  </td>
                                                  <td
                                                    colspan="2"
                                                    class="border-end border-secondary"
                                                  >
                                                    <input
                                                      bind:value={header.description}
                                                      type="text"
                                                      style="font-size:14px"
                                                      placeholder="Description"
                                                      class="form-control bg-gray-50"
                                                    />
                                                  </td>
                                                  <td
                                                    class="mx-2 border-secondary border-end"
                                                  >
                                                    <button
                                                      on:click={() =>
                                                        deleteRowForHeader(
                                                          header.id
                                                        )}
                                                      class="btn text-gray-500 p-1"
                                                      style="margin-left:-0.2rem"
                                                    >
                                                      <i
                                                        class="fa-solid fa-trash"
                                                      ></i>
                                                    </button>
                                                  </td>
                                                </tr>
                                              {/each}
                                            {/if}
                                          {/each}
                                        {/each}
                                      </tbody>
                                    </div>
                                    <div class="text-end">
                                      <button
                                        class="btn text-gray-500 p-1"
                                        on:click={() =>
                                          addRowForHeader(
                                            tab.content.requestHeader
                                          )}
                                      >
                                        <i class="fa-solid fa-circle-plus"></i>
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                <input
                                  type="radio"
                                  name="my_tabs_1"
                                  role="tab"
                                  class="tab text-xs bg-transparent border-0 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                  aria-label="Body"
                                />
                                <div role="tabpanel" class="tab-content p-0">
                                  <!-- body tabs start -->
                                  <div
                                    role="tablist"
                                    class="tabs mt-1"
                                    data-testid="bodyTabList"
                                  >
                                    <input
                                      type="radio"
                                      name="my_tabs_3"
                                      role="tab"
                                      class="tab text-xs bg-transparent border-0 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                      aria-label="none"
                                      checked
                                    />
                                    <div
                                      role="tabpanel"
                                      class="tab-content p-0 mt-5 text-center"
                                    >
                                      This request does not have a body
                                    </div>
                                    <input
                                      type="radio"
                                      name="my_tabs_3"
                                      role="tab"
                                      class="tab text-xs bg-transparent border-0 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                      aria-label="raw"
                                      data-testid="rawTab"
                                    />
                                    <div
                                      role="tabpanel"
                                      class="tab-content p-2"
                                    >
                                      {#if tab.content}
                                        <textarea
                                          name=""
                                          id=""
                                          data-testid="rawContent"
                                          rows="4"
                                          class="p-1 bg-slate-100"
                                          bind:value={tab.content.objDetails
                                            .requestBodyRaw}
                                          style="width: 100%;outline:0;border:0;coverflow:auto"
                                        ></textarea>
                                      {/if}
                                    </div>
                                    <input
                                      type="radio"
                                      name="my_tabs_3"
                                      role="tab"
                                      class="tab text-xs bg-transparent border-0 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                      aria-label="form-data"
                                    />
                                    <div
                                      role="tabpanel"
                                      class="tab-content p-2"
                                    >
                                      <div class="table-responsive">
                                        <div
                                          class="table border border-gray-200"
                                        >
                                          <thead>
                                            <tr>
                                              <th
                                                class="border-end border-gray-200"
                                                >Key</th
                                              >
                                              <th
                                                class="border-end border-gray-200"
                                                >Value</th
                                              >
                                              <th
                                                class="border-end border-gray-200"
                                                >Description</th
                                              >
                                              <th
                                                class="px-5 border-gray-200"
                                                style="padding-left: 1rem;padding-right:3rem"
                                                >Bulk Edit
                                              </th>
                                              <th
                                                class="border-end border-gray-200"
                                              />
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {#each editorData.files as files (files.name)}
                                              {#each files.tabs as tab}
                                                {#if tab.content.requestBodyFormData}
                                                  {#each tab.content.requestBodyFormData as formData}
                                                    <tr>
                                                      <td
                                                        class="border-end border-secondary"
                                                      >
                                                        <input
                                                          bind:value={formData.key}
                                                          type="text"
                                                          placeholder="Key"
                                                          class="form-control bg-gray-50"
                                                        />
                                                      </td>
                                                      <td
                                                        class="border-end border-secondary"
                                                      >
                                                        <input
                                                          bind:value={formData.value}
                                                          type="text"
                                                          placeholder="Value"
                                                          class="form-control bg-gray-50"
                                                        />
                                                      </td>
                                                      <td
                                                        colspan="2"
                                                        class="border-end border-secondary"
                                                      >
                                                        <input
                                                          bind:value={formData.description}
                                                          type="text"
                                                          placeholder="Description"
                                                          class="form-control bg-gray-50"
                                                        />
                                                      </td>
                                                      <td
                                                        class="mx-2 border-secondary border-end"
                                                      >
                                                        <button
                                                          on:click={() =>
                                                            deleteRowForBodyFormData(
                                                              formData.id
                                                            )}
                                                          class="btn text-gray-500 p-1"
                                                          style="margin-left:-0.2rem"
                                                        >
                                                          <i
                                                            class="fa-solid fa-trash"
                                                          ></i>
                                                        </button>
                                                      </td>
                                                    </tr>
                                                  {/each}
                                                {/if}
                                              {/each}
                                            {/each}
                                          </tbody>
                                        </div>
                                        <div class="text-end">
                                          <button
                                            class="btn text-gray-500 p-1"
                                            on:click={() =>
                                              addRowForBodyFormData(
                                                tab.content.requestBodyFormData
                                              )}
                                          >
                                            <i class="fa-solid fa-circle-plus"
                                            ></i>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                    <input
                                      type="radio"
                                      name="my_tabs_3"
                                      role="tab"
                                      class="tab text-xs bg-transparent border-0 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                      aria-label="x-www-form-urlencoded"
                                    />
                                    <div
                                      role="tabpanel"
                                      class="tab-content p-2"
                                    >
                                      <div class="table-responsive">
                                        <div
                                          class="table border border-gray-200"
                                        >
                                          <thead>
                                            <tr>
                                              <th
                                                class="border-end border-gray-200"
                                                >Key</th
                                              >
                                              <th
                                                class="border-end border-gray-200"
                                                >Value</th
                                              >
                                              <th
                                                class="border-end border-gray-200"
                                                >Description</th
                                              >
                                              <th
                                                class="px-5 border-gray-200"
                                                style="padding-left: 1rem;padding-right:3rem"
                                                >Bulk Edit
                                              </th>
                                              <th
                                                class="border-end border-gray-200"
                                              />
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {#each editorData.files as files (files.name)}
                                              {#each files.tabs as tab}
                                                {#if tab.content.requestUrlEncoded}
                                                  {#each tab.content.requestUrlEncoded as formData}
                                                    <tr>
                                                      <td
                                                        class="border-end border-secondary"
                                                      >
                                                        <input
                                                          bind:value={formData.key}
                                                          type="text"
                                                          placeholder="Key"
                                                          class="form-control bg-gray-50"
                                                        />
                                                      </td>
                                                      <td
                                                        class="border-end border-secondary"
                                                      >
                                                        <input
                                                          bind:value={formData.value}
                                                          type="text"
                                                          placeholder="Value"
                                                          class="form-control bg-gray-50"
                                                        />
                                                      </td>
                                                      <td
                                                        colspan="2"
                                                        class="border-end border-secondary"
                                                      >
                                                        <input
                                                          bind:value={formData.description}
                                                          type="text"
                                                          placeholder="Description"
                                                          class="form-control bg-gray-50"
                                                        />
                                                      </td>
                                                      <td
                                                        class="mx-2 border-secondary border-end"
                                                      >
                                                        <button
                                                          on:click={() =>
                                                            deleteRowForUrlEncoded(
                                                              formData.id
                                                            )}
                                                          class="btn text-gray-500 p-1"
                                                          style="margin-left:-0.2rem"
                                                        >
                                                          <i
                                                            class="fa-solid fa-trash"
                                                          ></i>
                                                        </button>
                                                      </td>
                                                    </tr>
                                                  {/each}
                                                {/if}
                                              {/each}
                                            {/each}
                                          </tbody>
                                        </div>
                                        <div class="text-end">
                                          <button
                                            class="btn text-gray-500 p-1"
                                            on:click={() =>
                                              addRowForUrlEncoded(
                                                tab.content.requestUrlEncoded
                                              )}
                                          >
                                            <i class="fa-solid fa-circle-plus"
                                            ></i>
                                          </button>
                                        </div>
                                      </div>
                                    </div>

                                    <a
                                      class="text-decoration-none mt-1 d-block"
                                      data-bs-toggle="pill"
                                      href="#tab-choosesub"
                                    >
                                      <select
                                        name=""
                                        id=""
                                        class="border-0 py-0"
                                        style="outline:0"
                                      >
                                        <option value="Javascript"
                                          >Javascript</option
                                        >
                                        <option value="Json">Json</option>
                                        <option value="HTML">HTML</option>
                                        <option value="XML">XML</option>
                                      </select>
                                    </a>
                                  </div>

                                  <!-- json options start-->
                                  <!--
                                            <div class="tab-content mb-5">
  
                                              <div
                                                id="tab-choosesub"
                                                class="tab-pane fade show p-2"
                                              >
                                                <textarea
                                                  name=""
                                                  id=""
                                                  rows="4"
                                                  style="width: 100%;outline:0;border:0;overflow:auto"
                                                >
                                                </textarea>
                                              </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          </div> -->

                                  <!-- json options end -->
                                </div>

                                <input
                                  type="radio"
                                  name="my_tabs_1"
                                  role="tab"
                                  class="tab text-xs bg-transparent border-0 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                  aria-label="Pre-request Scripts"
                                />
                                <div role="tabpanel" class="tab-content p-0">
                                  <div class="row">
                                    <div class="col-lg-8" style="height:21vh">
                                      {#if tab.content && tab.content.event}
                                        {#each tab.content.event as event}
                                          {#if event.listen === "script"}
                                            <textarea
                                              name=""
                                              id=""
                                              rows="5"
                                              style="width: 100%;font-size:12px;outline:0;resize:none;height:21vh"
                                              class="mt-2 p-2 font600 bg-slate-100"
                                            >
                                              {event.script.exec.join("\n")}
                                            </textarea>
                                          {/if}
                                        {/each}
                                      {/if}
                                    </div>
                                    <div
                                      class="col-lg-4 border-start mt-2"
                                      style="height:21vh;overflow:auto"
                                    >
                                      <h6
                                        class="font600 p-2 pb-0"
                                        style="font-size:13px;"
                                      >
                                        Snippets
                                      </h6>

                                      <ul
                                        style="list-style-type:none;padding-left:0.5rem"
                                        class="px-2 pb-2"
                                      >
                                        {#each editorData.scripts as scripts}
                                          <li
                                            class="text-primary pb-2"
                                            style="font-size:12px;cursor:pointer"
                                            on:click={() =>
                                              addScriptsToTextarea(scripts)}
                                          >
                                            {scripts.text}
                                          </li>
                                        {/each}
                                      </ul>
                                    </div>
                                  </div>
                                </div>

                                <input
                                  type="radio"
                                  name="my_tabs_1"
                                  role="tab"
                                  class="tab text-xs bg-transparent border-0 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                  aria-label="Tests"
                                />
                                <div role="tabpanel" class="tab-content p-0">
                                  <div class="row">
                                    <div class="col-lg-8" style="height:21vh">
                                      {#if tab.content && tab.content.event}
                                        {#each tab.content.event as event}
                                          {#if event.listen === "test"}
                                            <textarea
                                              name=""
                                              id=""
                                              rows="5"
                                              style="width: 100%;font-size:12px;outline:0;resize:none;height:21vh"
                                              class="mt-2 p-2 font600 bg-slate-100"
                                            >
                                              {event.script.exec.join("\n")}
                                            </textarea>
                                          {/if}
                                        {/each}
                                      {/if}
                                    </div>
                                    <div
                                      class="col-lg-4 border-start mt-2"
                                      style="height:21vh;overflow:auto"
                                    >
                                      <h6
                                        class="font600 p-2 pb-0"
                                        style="font-size:13px;"
                                      >
                                        Snippets
                                      </h6>

                                      <ul
                                        style="list-style-type:none;padding-left:0.5rem"
                                        class="px-2 pb-2"
                                      >
                                        {#each editorData.tests as tests}
                                          <li
                                            class="text-primary pb-2"
                                            style="font-size:12px;cursor:pointer"
                                            on:click={() =>
                                              addTestsToTextarea(tests)}
                                          >
                                            {tests.text}
                                          </li>
                                        {/each}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                                <!-- json dropdown -->

                                <a
                                  href="#"
                                  class="text-decoration-none mt-1 d-inline-block"
                                >
                                  <select
                                    name=""
                                    id=""
                                    class="border-0 py-0 px-0 bg-transparent"
                                    style="outline:0;margin-top:-1rem"
                                  >
                                    <option value="Javascript"
                                      >Javascript</option
                                    >
                                    <option value="Json">Json</option>
                                    <option value="HTML">HTML</option>
                                    <option value="XML">XML</option>
                                  </select>
                                </a>

                                <!-- end -->
                              </div>
                              <div class="mt-1 tab-content">
                                <div
                                  id="tab-choose"
                                  class="tab-pane fade show p-0"
                                >
                                  <textarea
                                    name=""
                                    id=""
                                    rows="5"
                                    style="width: 100%;color:#333"
                                    class="mt-2 p-2 bg-light"
                                  />
                                </div>
                              </div>
                              <!-- footer tabs start -->
                              <div class="mt-5">
                                <div role="tablist" class="tabs mt-1">
                                  <input
                                    type="radio"
                                    name="my_tabs_2"
                                    role="tab"
                                    class="tab text-xs bg-transparent border-0 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                    aria-label="Body"
                                    checked
                                  />
                                  <div role="tabpanel" class="tab-content p-0">
                                    <div
                                      class="test-response"
                                      style="overflow: auto;"
                                    >
                                      <div class="">
                                        <textarea
                                          name=""
                                          rows="5"
                                          id=""
                                          style="font-size:12px;color:green"
                                          class="form-control bg-slate-100"
                                        >
                                          {response}
                                        </textarea>
                                      </div>
                                    </div>
                                  </div>
                                  <input
                                    type="radio"
                                    name="my_tabs_2"
                                    role="tab"
                                    class="tab text-xs bg-transparent border-0 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                    aria-label="Cookies"
                                  />
                                  <div role="tabpanel" class="tab-content p-0">
                                    Cookies
                                  </div>
                                  <input
                                    type="radio"
                                    name="my_tabs_2"
                                    role="tab"
                                    class="tab text-xs bg-transparent border-0 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                    aria-label="Headers"
                                  />
                                  <div role="tabpanel" class="tab-content p-0">
                                    Headers
                                  </div>
                                  <input
                                    type="radio"
                                    name="my_tabs_2"
                                    role="tab"
                                    class="tab text-xs bg-transparent border-0 cursor-pointer hover:text-red-700 checked:text-checked-color checked:font-semibold"
                                    aria-label="Test Results"
                                  />
                                  <div role="tabpanel" class="tab-content p-0">
                                    Test Results
                                  </div>
                                </div>
                              </div>
                              <!-- footer tabs end -->

                              <div class="test-case py-2 mb-2 px-1">
                                <div>
                                  <div
                                    class="accordion accordion-flush"
                                    id="accordionFlushExample"
                                  >
                                    <div class="accordion-item">
                                      <h2
                                        class="accordion-header"
                                        id="flush-headingTest"
                                      >
                                        <button
                                          class="accordion-button collapsed text-secondary"
                                          style="font-size:14px;"
                                          type="button"
                                          data-bs-toggle="collapse"
                                          data-bs-target="#flush-collapseTest"
                                          aria-expanded="false"
                                          aria-controls="flush-collapseTest"
                                        >
                                          {tab.tabId} &nbsp;&nbsp; - Response Example
                                        </button>
                                      </h2>
                                      <div
                                        id="flush-collapseTest"
                                        class="accordion-collapse collapse"
                                        aria-labelledby="flush-headingTest"
                                        data-bs-parent="#accordionFlushExample"
                                      >
                                        <div
                                          class="accordion-body"
                                          style="font-weight:600"
                                        >
                                          <div>
                                            <div class="tasktestcase">
                                              <div class="row gy-2">
                                                <div class="col-lg-6">
                                                  <h6 class="mb-2">
                                                    Parameter
                                                  </h6>
                                                  {#if tab.content.examples.length > 0}
                                                    {#each tab.content.examples[0].request as example}
                                                      <pre
                                                        style="font-size: 14px; padding: 10px; border-radius: 5px; overflow-x: auto;"
                                                        class="p-2">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              <code
                                                          style="color: #0366d6;"
                                                          >{JSON.stringify(
                                                            JSON.parse(example),
                                                            null,
                                                            2
                                                          )}</code
                                                        >
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  </pre>
                                                    {/each}
                                                  {/if}
                                                  <p>
                                                    <strong>Description:</strong
                                                    >&nbsp;User object that
                                                    needs to be added to the
                                                    store
                                                  </p>
                                                </div>
                                                <div class="col-lg-6">
                                                  <h6 class="mb-2">Response</h6>
                                                  <div
                                                    class="table-responsive w-100"
                                                  >
                                                    <table
                                                      class="table w-100 alert alert-primary"
                                                    >
                                                      <thead>
                                                        <tr>
                                                          <th>Code</th>
                                                          <th>Description</th>
                                                        </tr>
                                                      </thead>
                                                      <tbody>
                                                        {#if tab.content.examples.length > 0}
                                                          {#each tab.content.examples[0].response as response}
                                                            <tr>
                                                              <td
                                                                >{response.Code}</td
                                                              >
                                                              <td
                                                                >{response.Description}</td
                                                              >
                                                            </tr>
                                                          {/each}
                                                        {/if}
                                                      </tbody>
                                                    </table>
                                                  </div>
                                                </div>
                                              </div>
                                              <div class="text-end py-2">
                                                <button class="btn btn-success">
                                                  Run
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        {:else if tab.content.type === "review"}
                          <div class="code-quality p-2">
                            <div class="d-flex justify-content-between">
                              <h6 style="font-size: 14px;">
                                Code Quality&nbsp;<i
                                  class="bi bi-info-circle"
                                  style="opacity: 0.7;"
                                />
                              </h6>
                              <span class="" style="opacity: 0.6;font-size:11px"
                                >Add Rating&nbsp;<i class="bi bi-star-fill" /><i
                                  class="bi bi-star-fill"
                                /><i class="bi bi-star-fill" /><i
                                  class="bi bi-star-fill"
                                /><i class="bi bi-star-half" /></span
                              >
                            </div>
                            <div class="mt-2">
                              <textarea
                                name=""
                                class="bg-gray-50"
                                id=""
                                style="width: 100%;outline:0;border:0;"
                                rows="3"
                                placeholder="Feedback"
                              />
                            </div>
                          </div>

                          <div
                            class="problem-solving border-top border-bottom p-2 border-secondary"
                          >
                            <div class="d-flex justify-content-between">
                              <h6 style="font-size: 14px;">
                                Problem Solving&nbsp;<i
                                  class="bi bi-info-circle"
                                  style="opacity: 0.7;"
                                />
                              </h6>
                              <span class="" style="opacity: 0.6;font-size:11px"
                                >Add Rating&nbsp;<i class="bi bi-star-fill" /><i
                                  class="bi bi-star-fill"
                                /><i class="bi bi-star-fill" /><i
                                  class="bi bi-star-fill"
                                /><i class="bi bi-star-half" /></span
                              >
                            </div>
                          </div>

                          <div class=" border-bottom p-2 border-secondary">
                            <div class="d-flex justify-content-between">
                              <h6 style="font-size: 14px;">
                                Language Proficiency&nbsp;<i
                                  class="bi bi-info-circle"
                                  style="opacity: 0.7;"
                                />
                              </h6>
                              <span class="" style="opacity: 0.6;font-size:11px"
                                >Add Rating&nbsp;<i class="bi bi-star-fill" /><i
                                  class="bi bi-star-fill"
                                /><i class="bi bi-star-fill" /><i
                                  class="bi bi-star-fill"
                                /><i class="bi bi-star-half" /></span
                              >
                            </div>
                          </div>

                          <div class=" border-bottom p-2 border-secondary">
                            <div class="d-flex justify-content-between">
                              <h6 style="font-size: 14px;">
                                Technical Communication&nbsp;<i
                                  class="bi bi-info-circle"
                                  style="opacity: 0.7;"
                                />
                              </h6>
                              <span class="" style="opacity: 0.6;font-size:11px"
                                >Add Rating&nbsp;<i class="bi bi-star-fill" /><i
                                  class="bi bi-star-fill"
                                /><i class="bi bi-star-fill" /><i
                                  class="bi bi-star-fill"
                                /><i class="bi bi-star-half" /></span
                              >
                            </div>
                          </div>

                          <div class="p-2">
                            <a
                              href="#y"
                              class="text-decoration-none text-primary"
                              style="font-size: 13px;">Add overall feedback</a
                            >
                          </div>

                          <div class="p-2">
                            <div
                              class="d-flex justify-content-between align-items-center"
                            >
                              <span class="" style="opacity: 0.6;font-size:11px"
                                >All changes saved</span
                              >
                              <button
                                class="btn btn-secondary"
                                style="font-size: 14px;"
                                ><i class="bi bi-copy" />&nbsp;Copy to Clipboard</button
                              >
                            </div>
                          </div>
                        {:else if tab.content.type === "run"}
                          <div class="p-1">
                            <h3
                              style="font-weight:600;"
                              class="text-gray-500 tracking-[0.06rem] ps-1"
                            >
                              Test Results
                            </h3>

                            <label
                              for="input"
                              style="font-weight:500"
                              class="block mb-1 mt-2 ps-2 tracking-[0.05rem] text-sm font-medium text-gray-900 dark:text-white"
                              >Input</label
                            >
                            <!-- table for input -->
                            <div
                              class="table-responsive w-full scrollTableContent"
                            >
                              <table class="table w-full mx-2 bg-gray-50">
                                <thead>
                                  <tr style="font-size:12px">
                                    <th class="border border-gray-200">Name</th>
                                    <th class="border border-gray-200">Value</th
                                    >
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr style="font-size: 12px;">
                                    <td class="border border-gray-200">
                                      nums1
                                    </td>
                                    <td class="border border-gray-200"
                                      ><span class="">[2,3,4,5] </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <!-- upload file -->
                            <div
                              class="flex items-center justify-center w-full mx-1"
                            >
                              <label
                                for="dropzone-file"
                                class="flex flex-col items-center justify-center w-full h-[20vh] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                              >
                                <div
                                  class="flex flex-col items-center justify-center pt-3 pb-4"
                                >
                                  <svg
                                    class="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400"
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
                                  <p
                                    class="mb-2 text-sm text-gray-500 dark:text-gray-400"
                                  >
                                    <span class="font-semibold"
                                      >Click to upload</span
                                    > or drag and drop
                                  </p>
                                  <p
                                    class="text-xs text-gray-500 dark:text-gray-400"
                                  >
                                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                                  </p>
                                </div>
                                <input
                                  id="dropzone-file"
                                  type="file"
                                  class="hidden"
                                />
                              </label>
                            </div>

                            <!-- validation errors -->
                            <div class="my-3">
                              {#if tab.content.errors && tab.content.errors.message !== ""}
                                <label
                                  for="output"
                                  style="font-weight:500"
                                  class="block mb-1 mt-3 ps-2 tracking-[0.05rem] text-sm font-medium text-gray-900 dark:text-white"
                                  >Error</label
                                >

                                <div class="my-2 ps-2">
                                  <span
                                    class="text-xs text-red-600 tracking-[0.07rem]"
                                    >{tab.content.errors.message}</span
                                  >
                                </div>
                              {/if}
                            </div>

                            <label
                              for="output"
                              style="font-weight:500"
                              class="block mb-1 mt-3 ps-2 tracking-[0.05rem] text-sm font-medium text-gray-900 dark:text-white"
                              >Output</label
                            >
                            <!-- table for output -->
                            <div
                              class="table-responsive w-full scrollTableContent"
                            >
                              <table class="table w-full mx-2 bg-gray-50">
                                <thead>
                                  <tr style="font-size:12px">
                                    <th class="border border-gray-200">Name</th>
                                    <th class="border border-gray-200">Value</th
                                    >
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr style="font-size: 12px;">
                                    <td class="border border-gray-200">
                                      result
                                    </td>
                                    <td class="border border-gray-200"
                                      ><span class="">3 </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <!-- upload file -->
                            <div
                              class="flex items-center justify-center w-full mx-1"
                            >
                              <label
                                for="dropzone-file"
                                class="flex flex-col items-center justify-center w-full h-[20vh] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                              >
                                <div
                                  class="flex flex-col items-center justify-center pt-3 pb-4"
                                >
                                  <svg
                                    class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
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
                                  <p
                                    class="mb-2 text-sm text-gray-500 dark:text-gray-400"
                                  >
                                    <span class="font-semibold"
                                      >Click to upload</span
                                    > or drag and drop
                                  </p>
                                  <p
                                    class="text-xs text-gray-500 dark:text-gray-400"
                                  >
                                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                                  </p>
                                </div>
                                <input
                                  id="dropzone-file"
                                  type="file"
                                  class="hidden"
                                />
                              </label>
                            </div>

                            <!-- logs  -->
                            <label
                              for="output"
                              style="font-weight:500"
                              class="block mb-1 mt-3 ps-2 tracking-[0.05rem] text-sm font-medium text-gray-900 dark:text-white"
                              >Logs</label
                            >

                            <!-- search logs -->
                            <form class="w-full">
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
                                    class="w-4 h-4 text-gray-500 dark:text-gray-400"
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
                                  bind:value={searchTermLog}
                                  on:input={() =>
                                    searchLogs(tab.content, searchTermLog)}
                                  id="default-search"
                                  class="block w-full py-2 pe-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="Search..."
                                  required
                                />
                              </div>
                            </form>
                            <!-- logs table -->
                            <div class="table-responsive w-100 mt-2 mb-5">
                              <table class="table w-100">
                                <thead>
                                  <tr
                                    style="font-size:12px"
                                    class=" border border-gray-200"
                                  >
                                    {#if tab.content.logSchema.length > 0}
                                      {#each Object.keys(tab.content.logSchema[0]) as key}
                                        {#if key !== "id"}
                                          <th
                                            class=" border border-gray-200 capitalize"
                                            >{key}</th
                                          >
                                        {/if}
                                      {/each}
                                    {/if}
                                  </tr>
                                </thead>
                                <tbody>
                                  {#if filteredLogs.length > 0}
                                    {#each filteredLogs as log}
                                      <tr
                                        style="font-size: 12px;"
                                        class=" border border-gray-200"
                                      >
                                        <td class=" border border-gray-200">
                                          <input
                                            type="text"
                                            class="form-control bg-gray-50 border-0 text-xs tracking-[0.06rem]"
                                            bind:value={log.timestamp}
                                          />
                                        </td>
                                        <td class=" border border-gray-200">
                                          <input
                                            type="text"
                                            class="form-control bg-gray-50 border-0 text-xs tracking-[0.06rem]"
                                            bind:value={log.message}
                                          />
                                        </td>
                                      </tr>
                                    {/each}
                                  {/if}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        {/if}
                        <!-- Additional conditions for other tab types can be added -->
                      </div>
                    {/if}
                  {/each}
                {/each}
              </div>
            </div>
          {:else}
            <div class="toggleThirdCol sm:hidden">
              <div on:click={toggleThirdCol}>
                <i class="bi bi-list" />
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</section>

<style>
  .tab a.active {
    color: #004eff !important;
    font-weight: 600 !important;
  }

  .tab.active {
    color: #004eff !important;
    font-weight: 600 !important;
  }

  ::placeholder {
    font-size: 14px;
  }

  .root-item {
    cursor: pointer;
    font-size: 14px;
    transition: all 0.5s ease-in-out;
  }

  .tree-view {
    font-size: 14px;
  }

  .tree-view i {
    font-size: 12px;
  }

  .sub-items {
    transition: all 0.5s ease-in-out;
    list-style-type: none;
  }

  ul,
  li {
    padding: 0;
  }

  .file-list {
    list-style: none;
    padding: 0;
    border-right: 4px solid rgba(169, 169, 169, 0.105);
  }

  .file-item {
    display: flex;
    align-items: center;
    padding: 10px 12px;
    margin-top: 0.4rem;
    border-top: 1px solid rgba(169, 169, 169, 0.224);
  }

  .file-name {
    margin-left: 8px;
  }

  .code {
    color: #007acc;
  }

  .code-content {
    position: relative;
  }

  .code-col2 {
    position: absolute;
    top: 0;
    right: 0px;
  }

  .collectionsharebox .nav-item .active {
    border-bottom: 3px solid rgb(26, 115, 232);
  }

  .collectionsharebox .nav-item .active h6 {
    color: #0d6efd;
  }

  .toggleFirstCol .active {
    @apply border-s-2 border-blue-600 text-blue-800 font-bold;
  }
</style>

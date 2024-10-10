<script>
  import { onMount } from "svelte";
  import { Bar } from "svelte-chartjs";
  import { logs } from "../../../apiData/logs";
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const data = {
    labels: [
      "18:07:00",
      "18:08:00",
      "18:09:00",
      "18:10:00",
      "18:11:00",
      "18:12:00",
      "18:13:00",
      "18:14:00",
      "18:15:00",
      "18:16:00",
      "18:17:00",
      "18:18:00",
      "18:19:00",
      "18:20:00",
      "18:21:00",
    ],
    datasets: [
      {
        label: "My First Dataset",
        backgroundColor: "rgb(15 118 110)",
        borderColor: "rgb(15 118 110)",
        borderWidth: 1,
        barThickness: 28,
        maxBarThickness: 30,
        hoverBackgroundColor: "rgb(17 94 89)",
        hoverBorderColor: "rgb(17 94 89)",
        data: [
          1500, 1600, 1500, 2000, 2200, 2400, 2600, 3100, 3000, 3200, 3400,
          1500, 2000, 2200, 3000,
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart.js Bar Chart",
      },
    },
  };

  let filteredLogs = [...logs];
  let selectedFields = ["_message"]; // Initially selected with _message

  // Define the available time ranges
  let timeRanges = [
    "Today",
    "This week",
    "Last 15 minutes",
    "Last 30 minutes",
    "Last 1 hour",
    "Last 24 hours",
    "Last 7 days",
    "Last 30 days",
    "Last 90 days",
    "Last 1 year",
  ];

  // State to keep track of the selected time range
  let selectedTimeRange = "Last 15 minutes";

  // State to keep track of the select box values and input number
  let rangeType = "Last";
  let number = 1;
  let timeUnit = "Minutes";

  // Function to handle click on a time range
  function selectTimeRange(range) {
    selectedTimeRange = range;
    filterLogs();
  }

  // Function to handle applying the custom time range
  function applyCustomTimeRange(event) {
    event.preventDefault();
    selectedTimeRange = `${rangeType} ${number} ${timeUnit}`;
    filterLogs();
  }

  // Function to filter logs based on selected time range
  function filterLogs() {
    const now = new Date();
    let startTime;
    let endTime;

    if (selectedTimeRange.startsWith("Last")) {
      const [_, value, unit] = selectedTimeRange.split(" ");
      const amount = parseInt(value);

      switch (unit.toLowerCase()) {
        case "minutes":
          startTime = new Date(now.getTime() - amount * 60000);
          break;
        case "hours":
          startTime = new Date(now.getTime() - amount * 3600000);
          break;
        case "days":
          startTime = new Date(now.getTime() - amount * 86400000);
          break;
      }
      endTime = now;
    } else if (selectedTimeRange.startsWith("Next")) {
      const [_, value, unit] = selectedTimeRange.split(" ");
      const amount = parseInt(value);

      switch (unit.toLowerCase()) {
        case "minutes":
          endTime = new Date(now.getTime() + amount * 60000);
          break;
        case "hours":
          endTime = new Date(now.getTime() + amount * 3600000);
          break;
        case "days":
          endTime = new Date(now.getTime() + amount * 86400000);
          break;
      }
      startTime = now;
    } else if (selectedTimeRange === "Today") {
      startTime = new Date(now.setHours(0, 0, 0, 0));
      endTime = new Date(now.setHours(23, 59, 59, 999));
    } else if (selectedTimeRange === "This Week") {
      const dayOfWeek = now.getDay(); // Get the current day of the week (0 for Sunday, 1 for Monday, etc.)
      const startOfWeek = new Date(now);
      startOfWeek.setDate(
        now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
      ); // Adjust to Monday or the previous Monday if today is Sunday
      startOfWeek.setHours(0, 0, 0, 0);
      startTime = startOfWeek;

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Adjust to Sunday
      endOfWeek.setHours(23, 59, 59, 999);
      endTime = endOfWeek;
    } else if (selectedTimeRange === "This Month") {
      startTime = new Date(now.getFullYear(), now.getMonth(), 1);
      endTime = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endTime.setHours(23, 59, 59, 999);
    } else if (selectedTimeRange === "This Year") {
      startTime = new Date(now.getFullYear(), 0, 1);
      endTime = new Date(now.getFullYear(), 11, 31);
      endTime.setHours(23, 59, 59, 999);
    } else if (selectedTimeRange === "Tomorrow") {
      startTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0,
        0
      );
      endTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        23,
        59,
        59,
        999
      );
    }

    filteredLogs = logs.filter((log) => {
      const logTime = new Date(log.objDetails.timestamp);
      return logTime >= startTime && logTime <= endTime;
    });
  }
  // Initial filter on mount
  onMount(() => {
    filterLogs();
  });
  // Function to get all available fields from logs metadata
  function getAvailableFields() {
    const availableFields = new Set();

    logs.forEach((log) => {
      const objDetails = log.objDetails;

      // Add top-level fields
      if (log.id) {
        availableFields.add("_id");
      }
      if (objDetails.timestamp) {
        availableFields.add("@timestamp");
      }
      if (objDetails.level) {
        availableFields.add("_level");
      }
      if (objDetails.message) {
        availableFields.add("_message");
      }
      if (objDetails.source) {
        availableFields.add("_source");
      }

      // Add nested fields from metadata
      const metadata = objDetails.metadata;
      if (metadata) {
        Object.keys(metadata).forEach((key) => {
          if (typeof metadata[key] === "object" && metadata[key] !== null) {
            Object.keys(metadata[key]).forEach((subKey) => {
              availableFields.add(`metadata.${key}.${subKey}`);
            });
          } else {
            availableFields.add(`metadata.${key}`);
          }
        });
      }
    });

    return Array.from(availableFields);
  }

  //get the available fields and assign to availableFields variable
  let availableFields = getAvailableFields();
  let searchText = "";
  let searchLogs = "";

  // Function to add selected field
  function addSelectedField(field) {
    if (!selectedFields.includes(field)) {
      selectedFields = [...selectedFields, field];
    }
  }

  // Function to filter available fields based on search input
  function filterAvailableFields(event) {
    const searchText = event.target.value.toLowerCase();

    if (!searchText.trim()) {
      availableFields = getAvailableFields(); // Reset to all available fields if search input is empty
      return;
    }

    availableFields = getAvailableFields().filter((field) => {
      return field.toLowerCase().includes(searchText);
    });
  }
  // function for search the logs
  function highlightMatchedLogs(event) {
    event.preventDefault();
    const query = searchLogs.toLowerCase().replace(/"/g, "");
    filteredLogs = logs.filter((log) =>
      JSON.stringify(log.objDetails).toLowerCase().includes(query)
    );
  }

  // function to higlight the searched text
  function highlightText(text, query) {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts
      .map((part, index) =>
        part.toLowerCase() === query.toLowerCase()
          ? `<span style="background-color:yellow">${part}</span>`
          : part
      )
      .join("");
  }

  // Function to handle field selection (this can be tied to a UI element, e.g., a dropdown or checkbox)
  function toggleField(field) {
    if (selectedFields.includes(field)) {
      selectedFields = selectedFields.filter((f) => f !== field);
    } else {
      selectedFields = [...selectedFields, field];
    }
  }

  // Function to remove underscores and return display-friendly field name
  function formatFieldName(field) {
    return field.replace(/_/g, "");
  }
  // Function to resolve both top-level and nested fields
  function resolveNestedField(obj, path) {
    const parts = path.split(".");
    let current = obj;

    for (const part of parts) {
      if (current && current.hasOwnProperty(part)) {
        current = current[part];
      } else {
        return undefined; // Return undefined if the path does not exist
      }
    }
    return current;
  }
</script>

<div class="w-full p-2 pt-0 mt-0 h-[100vh] pb-5 overflow-y-scroll">
  <!--top buttons -->
  <div class="flex justify-between items-center  w-100 mt-1 me-4 shadow-sm">
    <div class="flex items-center gap-3">
      <i class="fa-solid fa-bars bg-slate-200 px-2 py-2"></i>
      <span class="font-semibold text-xs"> Discover </span>
    </div>
    <div class="flex items-center gap-3">
      <a class="text-xs text-primary font-semibold" href="#my_modal_13">
        New
      </a>
      <a class="text-xs text-primary font-semibold" href="#"> Open </a>
      <a class="text-xs text-primary font-semibold" href="#"> Share </a>
      <a class="text-xs text-primary font-semibold" href="#"> Save </a>
      <a class="text-xs text-primary font-semibold me-2" href="#"> Inspect </a>
    </div>
  </div>

  <!-- modals start -->
  <div class="modal" role="dialog" id="my_modal_13">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Hello!</h3>
      <p class="py-4">This modal works with anchor links</p>
      <div class="modal-action">
        <a href="#" class="btn">Yay!</a>
      </div>
    </div>
  </div>
  <!-- modals end -->

  <!-- for search and  time dropdowns -->
  <div class="flex row1 w-100 mt-2 me-4 border-0">
    <form class=" mx-2 w-100">
      <div class="flex">
        <label
          for="search-dropdown"
          class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >Your Email</label
        >
        <details class="dropdown">
          <summary
            data-dropdown-toggle="dropdown"
            class="flex-shrink-0 z-10 inline-flex items-center py-2 px-3 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
            ><i class="bi bi-collection"></i>&nbsp;&nbsp;<i
              class="fa-solid fa-chevron-down font-bold"
              style="font-size: 11px;"
            ></i></summary
          >
          <ul
            class="p-2 shadow menu dropdown-content z-50 bg-base-100 rounded-box w-52"
          >
            <li><a>Item 1</a></li>
            <li><a>Item 2</a></li>
          </ul>
        </details>
        <div class="relative w-full">
          <input
            type="search"
            id="search-dropdown"
            bind:value={searchLogs}
            class="block p-2 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            placeholder="Search"
            required
          />
          <button
            type="submit"
            on:click={highlightMatchedLogs}
            class="absolute top-0 end-0 p-2.5 text-sm font-semibold h-full text-blue-800 bg-transparent rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            KQL
            <span class="sr-only">Search</span>
          </button>
        </div>
      </div>
    </form>
    <form class=" lg:mx-3 me-1 w-100">
      <div class="flex">
        <label
          for="search-dropdown"
          class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >Your Email</label
        >
        <details class="dropdown">
          <summary
            data-dropdown-toggle="dropdown"
            class="flex-shrink-0 z-10 inline-flex items-center py-2 px-3 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
            ><i class="bi bi-collection"></i>&nbsp;&nbsp;<i
              class="fa-solid fa-chevron-down font-bold"
              style="font-size: 11px;"
            ></i></summary
          >
          <div
            class="p-2 shadow menu dropdown-content z-50 bg-base-100 rounded-box w-[24vw]"
          >
            <div class="flex justify-between items-center">
              <span class="text-xs font-semibold"> Quick select </span>
              <div>
                <i
                  class="fa-solid fa-chevron-left text-xs cursor-pointer hover:bg-gray-100 py-1 px-2 rounded-md"
                ></i>
                <i
                  class="fa-solid fa-chevron-right text-xs px-2 cursor-pointer hover:bg-gray-100 py-1 px-2 rounded-md"
                ></i>
              </div>
            </div>

            <div class="flex gap-1 py-2">
              <select
                name=""
                id=""
                bind:value={rangeType}
                class="form-control py-1 text-xs focus:shadow-none"
              >
                <option value="Last">Last</option>
                <option value="Next">Next</option>
              </select>
              <input
                type="number"
                bind:value={number}
                class="form-control border-gray-300 py-1 text-xs"
              />
              <select
                name=""
                id=""
                bind:value={timeUnit}
                class="form-control py-1 text-xs focus:shadow-none"
              >
                <option value="Minutes">Minutes</option>
                <option value="Hours">Hours</option>
                <option value="Days">Days</option>
              </select>
              <button
                on:click={applyCustomTimeRange}
                class="bg-teal-700 text-white text-xs py-1 px-2 rounded-md"
                >Apply</button
              >
            </div>

            <span class="text-xs font-semibold"> Commonly used </span>
            <div class="flex gap-3 mt-1">
              <ul class="list-style-none">
                {#each timeRanges.slice(0, 5) as range}
                  <li>
                    <span
                      class="text-xs text-primary font-semibold cursor-pointer py-1"
                      on:click={() => selectTimeRange(range)}
                    >
                      {range}
                    </span>
                  </li>
                {/each}
              </ul>
              <ul class="list-style-none">
                {#each timeRanges.slice(5) as range}
                  <li>
                    <span
                      class="text-xs text-primary font-semibold cursor-pointer py-1"
                      on:click={() => selectTimeRange(range)}
                    >
                      {range}
                    </span>
                  </li>
                {/each}
              </ul>
            </div>
            <span class="text-xs font-semibold mt-2">
              Recently used date ranges
            </span>
          </div>
        </details>
        <div class="relative w-full flex items-center border rounded-e-lg">
          <!-- <span class="font-semibold text-gray-500 ms-3">Last 15 minutes</span>
           -->
          <input
            type="text"
            bind:value={selectedTimeRange}
            class="form-control border-0 py-0 font-semibold text-sm text-gray-400 ms-2 focus:text-gray-500"
          />
          <button
            type="submit"
            class="absolute top-0 end-0 p-2.5 text-sm font-semibold h-full text-blue-800 bg-transparent rounded-e-lg border-0 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Show Dates
          </button>
        </div>
      </div>
    </form>
    <button class="bg-teal-700 text-white py-1 px-4 text-xs rounded-md"
      >Refresh</button
    >
  </div>
  <!-- <i class="fa-solid fa-arrow-rotate-right text-xs"></i> -->

  <!-- main content bar chart and table showing logs  -->
  <section class="mt-3 row2 flex h-full pb-5">
    <div class="row2FirstCol w-[28%]">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-filter text-gray-400"></i>
        <details class="dropdown">
          <summary class="ms-1 btn py-0">
            <div class="flex items-center text-primary font-semibold text-xs">
              <i class="fa-solid fa-plus text-xs"></i>&nbsp;
              <span class="cursor-pointer">Add Filter</span>
            </div>
          </summary>
          <div
            class=" shadow menu dropdown-content z-[1] bg-base-100 rounded-md w-[50vw]"
          >
            <div
              class="flex p-2 items-center justify-between pb-3 border-b border-gray-300"
            >
              <span class="text-xs font-semibold">Edit filter</span>
              <span class="text-xs font-semibold cursor-pointer text-primary"
                >Edit as query DSL</span
              >
            </div>
            <div class="flex gap-1">
              <div class="flex flex-col mt-2 w-[40vw]">
                <label for="" class="text-xs font-semibold">Field</label>
                <select
                  name=""
                  id=""
                  class="form-control text-xs focus:shadow-none w-full"
                >
                  <option value="shadow_none" selected>shadow_none</option>
                  <option value="abc">abc</option>
                </select>
              </div>
              <div class="flex flex-col mt-2">
                <label for="" class="text-xs font-semibold">Operator</label>
                <select
                  name=""
                  id=""
                  class="form-control text-xs focus:shadow-none w-[8vw]"
                >
                  <option value="is" selected>is</option>
                  <option value="abc">abc</option>
                </select>
              </div>
              <div></div>
            </div>
            <div class="mt-2">
              <label for="" class="text-primary text-xs font-semibold"
                >Value</label
              ><br />
              <div class="w-full mt-1">
                <select
                  class="select select-bordered w-full text-xs text-gray-500"
                >
                  <option disabled selected>Choose a value</option>
                  <option>English</option>
                  <option>Japanese</option>
                  <option>Italian</option>
                </select>
              </div>
            </div>
            <div class="mt-3 flex justify-end">
              <button
                class="text-xs px-2 py-2 bg-transparent rounded-md text-primary font-semibold"
                >Cancel</button
              >
              <button
                class="text-xs bg-teal-700 mx-2 px-2 py-2 text-white rounded-md hover:bg-teal-800"
                >Save</button
              >
            </div>
          </div>
        </details>
      </div>
      <div class="flex items-center justify-between mt-2">
        <details class="dropdown">
          <summary
            data-dropdown-toggle="dropdown"
            class="flex-shrink-0 inline-flex items-center py-2 px-1 text-sm font-semibold text-center text-gray-900 bg-transparent border-0 border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
            >Kublr_demo* &nbsp;&nbsp;<i
              class="fa-solid fa-chevron-down font-bold"
              style="font-size: 11px;"
            ></i></summary
          >
          <ul
            class="p-2 shadow menu dropdown-content z-50 bg-base-100 rounded-box w-52"
          >
            <li><a>Item 1</a></li>
            <li><a>Item 2</a></li>
          </ul>
        </details>
        <div>
          <i class="fa-solid fa-list text-primary text-xs"></i>
        </div>
      </div>
      <!-- search -->

      <form class="max-w-md mx-auto">
        <label
          for="default-search"
          class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >Search</label
        >
        <div class="relative">
          <input
            type="search"
            id="default-search"
            class="block w-full p-1 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search field names"
            required
            bind:value={searchText}
            on:input={filterAvailableFields}
          />
        </div>
      </form>

      <!-- selected fields -->
      <div class="mt-3">
        <label class="text-xs font-bold" for="">Selected fields</label>
        <ul class="list-style-none">
          {#each selectedFields as field}
            <li
              class="flex selectedList justify-between items-center hover:bg-gray-50 cursor-pointer my-1 py-1 px-1"
            >
              <div>
                <span class="py-0 px-1.5 rounded-sm border text-primary text-xs"
                  >#</span
                >
                <span class="text-xs font-medium">{field}</span>
              </div>
              <div>
                <i
                  on:click={() => toggleField(field)}
                  class="fa-solid fa-times text-gray-500 cursor-pointer hidden icon-remove"
                ></i>
              </div>
            </li>
          {/each}
        </ul>
      </div>
      <!-- available fields -->
      <div class="mt-3 ">
        <label class="text-xs font-bold" for="">Available fields</label>
        <ul class="list-style-none availableFields">
          {#each availableFields as field}
            <li
              on:click={() => addSelectedField(field)}
              class="flex gap-2 items-center hover:bg-gray-50 cursor-pointer my-1 py-1 px-1"
            >
              <span class="py-0 px-1.5 rounded-sm border text-primary text-xs"
                >#</span
              >
              <span class="text-xs font-medium">{field}</span>
            </li>
          {/each}
        </ul>
      </div>
    </div>
    <div class="w-full h-max border mx-2 pb-5 mt-4 bg-gray-50 p-2">
      <div>
        <Bar {data} {options} height="100" />
        <div class="text-center pb-2 pt-3">
          <label class="font-semibold text-xs" for=""
            >@timestamp per 30 seconds</label
          >
        </div>
      </div>

      <div class="relative mb-3 pt-2">
        {#if filteredLogs.length > 0}
          <table
            class="w-full text-sm text-left rtl:text-right border border-gray-400 text-gray-500 dark:text-gray-400"
          >
            <thead
              class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
              <tr>
                <th scope="col" class="px-4 py-2 font-semibold">
                  Time <i class="fa-solid fa-caret-down text-gray-500 text-xs"
                  ></i>
                </th>
                <th scope="col" class="px-4 py-2 font-semibold"> _message </th>
                {#each selectedFields as field}
                  {#if field !== "_message"}
                    <th
                      class="px-2 py-3 text-left text-xs font-semibold text-gray-500 tracking-wider"
                    >
                      {formatFieldName(field)}
                    </th>
                  {/if}
                {/each}
              </tr>
            </thead>
            <tbody>
              {#each filteredLogs as log}
                <tr
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td
                    class="timestamp px-2 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <i
                      class="fa-solid fa-chevron-right text-xs text-gray-500 pe-3"
                    ></i>
                    {log.objDetails.timestamp}
                  </td>
                  <td
                    class="source px-2 py-3 text-xs font-medium tracking-wide text-gray-500"
                  >
                    {@html highlightText(log.objDetails.message, searchLogs)}
                  </td>
                  {#each selectedFields as field}
                    {#if field !== "_message"}
                      <td class="px-2 py-3 text-xs font-medium text-gray-500">
                        {#if field === "@timestamp"}
                          {@html highlightText(
                            log.objDetails.timestamp,
                            searchLogs
                          )}
                        {:else if field === "_level"}
                          {@html highlightText(
                            log.objDetails.level,
                            searchLogs
                          )}
                        {:else if field === "_source"}
                          {@html highlightText(
                            log.objDetails.source,
                            searchLogs
                          )}
                        {:else if resolveNestedField(log.objDetails, field)}
                          {@html highlightText(
                            resolveNestedField(log.objDetails, field),
                            searchLogs
                          )}
                        {:else}
                          N/A
                        {/if}
                      </td>
                    {/if}
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        {:else}
          <div class="text-xs flex justify-center py-4 w-full">
            <span class="py-3 text-gray-600"> No logs available </span>
          </div>
        {/if}
      </div>
    </div>
  </section>
</div>

<style>
  .highlight {
    background-color: yellow !important;
  }
  /* Show the icon when the li element is hovered */
  .selectedList:hover .icon-remove {
    display: inline;
  }

  @media screen and (max-width:600px){
    .row1{
      flex-direction: column!important;
      gap:0.7rem;
      align-items: center;
    }
    .row2{
      flex-direction: column!important;
      gap:0.7rem;
      align-items: start;
    }
    .row2FirstCol{
      width: 100%;
    }
    .availableFields{
      height: 24vh;
      overflow-y: auto;
    }
  }
</style>

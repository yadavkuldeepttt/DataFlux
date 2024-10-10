<script>
  import PressureChart from "./PressureChart.svelte";
  import { Cluster, cluster1 } from "./../../../apiData/serverHealth.js";
  import BarChart from "./BarChart.svelte";
  import Speedometer from "./Speedometer.svelte";
  import LineChart from "./LineChart.svelte";
  import ServerGraph from "./serverGraph/serverGraph.svelte";

  let clusters = cluster1;
  export let activeSideMenuList; //for hiding the sidemenu on middle screen

  //  all chart datas and options
  const data1 = {
    labels: ["", "", "", "", "", ""],
    datasets: [
      {
        label: "Dataset 1",
        backgroundColor: "rgb(251 191 36)",
        borderColor: "rgb(251 191 36)",
        borderWidth: 1,
        barThickness: 28,
        maxBarThickness: 30,
        hoverBackgroundColor: "rgb(251 191 38)",
        hoverBorderColor: "rgb(251 191 38)",
        data: [500, 40, 200, 300, 100, 600],
      },
    ],
  };

  const options1 = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "",
      },
    },
  };

  const data2 = {
    datasets: [
      {
        label: "Dataset 2",
        backgroundColor: "rgb(54, 162, 235)",
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 1,
        barThickness: 10,
        maxBarThickness: 20,
        hoverBackgroundColor: "rgb(255, 99, 132)",
        hoverBorderColor: "rgb(255, 99, 132)",
        data: [
          { x: "<1w", y: 0 },
          { x: "2w-4w", y: 3 },
          { x: "2w-4w", y: 6 },
          { x: "1w-3w", y: 12 },
          { x: "1m-2m", y: 5 },
          { x: "2m-3m", y: 20 },
        ],
      },
    ],
  };

  const options2 = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "",
      },
      scales: {
        y: {
          beginAtZero: true,
          min: 0,
          max: 20,
          ticks: {
            stepSize: 10,
          },
        },
      },
    },
  };

  let nodesList = true; //nodes list menu toggle variable
  let activeNode = "All Nodes";
  let activeNodeData = Cluster[0].nodes[0];

  //   nodes list menu toggle
  function toggleNodesList() {
    nodesList = !nodesList;
  }

  // handle sidemenu subitems collapse
  function handleSideMenuCollapseServer() {
    const menu = document.getElementById("sidemenu_collapse_server");
    menu.classList.toggle("hidden");
  }

  // Function to set the active node
  function setActiveNode(nodeName, nodeData) {
    activeNode = nodeName;
    activeNodeData = nodeData;
  }

  // filter alerts
  let filteredAlerts = [...activeNodeData.raisedAlerts];

  let selectedStatus = [];
  let selectedName = [];
  // let selectedContext = [];
  let selectAllStatus = false;
  let selectAllName = false;
  // let selectAllContext = false;

  // Handle "Select All" checkbox
  function handleSelectAll(type, checked) {
    if (type === "status") {
      if (checked) {
        // Select all unique statuses
        selectedStatus = [
          ...new Set(filteredAlerts.map((alert) => alert.status)),
        ];
      } else {
        selectedStatus = [];
      }
      selectAllStatus = checked;
    }
  }

  // Handle individual checkbox toggle
  function handleCheckboxChange(type, value, checked) {
    if (type === "status") {
      if (checked) {
        // Add to selected statuses
        selectedStatus = [...selectedStatus, value];
        // Recalculate filtered alerts based on selected statuses
        filteredAlerts = filteredAlerts.filter(
          (alert) =>
            selectedStatus.length === 0 || selectedStatus.includes(alert.status)
        );
      } else if (type === "name") {
        if (checked) {
          selectedName = [...selectedName, value];
          // Recalculate filtered alerts based on selected statuses
          filteredAlerts = filteredAlerts.filter(
            (alert) =>
              selectedName.length === 0 || selectedName.includes(alert.name)
          );
        }
      } else {
        // Remove from selected statuses
        selectedStatus = selectedStatus.filter((item) => item !== value);
        selectedName = selectedName.filter((item) => item !== value);

        // Recalculate filtered alerts based on selected statuses
        filteredAlerts = [...activeNodeData.raisedAlerts];
      }

      // Update "Select All" checkbox state
      //  const allStatuses = [...new Set(filteredAlerts.map(alert => alert.status))];
      // selectAllStatus = selectedStatus.length === allStatuses.length;

      // Ensure filteredAlerts is a new array reference to trigger reactivity
      filteredAlerts = [...filteredAlerts];

      console.log(selectedStatus, "selected status");
      console.log(selectedName, "selected name");

      console.log(filteredAlerts, "filteredAlerts");
    }
  }

  // Edit service details
  function editService(clusterId, machineId, serviceId) {
    const cluster = clusters.find((c) => c.id === clusterId);
    const machine = cluster.ch[0].machines.find((m) => m.id === machineId);
    const service = machine.services.find((s) => s.id === serviceId);

    const newName = prompt(`Edit name for ${service.name}`, service.name);
    if (newName) {
      service.name = newName;
    }
    clusters = [...clusters];
  }

  // Add a new service
  function addService(clusterId, machineId) {
    const cluster = clusters.find((c) => c.id === clusterId);
    const machine = cluster.ch[0].machines.find((m) => m.id === machineId);

    const newServiceId = `service_${machine.services.length + 1}`;
    const newServiceName = prompt(
      "Enter service name:",
      `Service ${machine.services.length + 1}`
    );
    if (newServiceName) {
      machine.services.push({ id: newServiceId, name: newServiceName });
    }
    clusters = [...clusters];
  }

    // Delete a service
    function deleteService(clusterId, machineId, serviceId) {
    const cluster = clusters.find(c => c.id === clusterId);
    const machine = cluster.ch[0].machines.find(m => m.id === machineId);

    // Filter out the service to delete
    machine.services = machine.services.filter(s => s.id !== serviceId);

    clusters = [...clusters];
  }
</script>

<!-- server health content -->
<main class="flex w-full h-full overflow-auto">
  <!-- server health sidebar -->
  <aside class="h-screen {nodesList ? 'flex' : ''}">
    <div
      class="h-full md:w-[22vw] sm:w-[7vw!important] w-[4vw] sidebar-multi lg:px-2 md:px-1 py-3 overflow-y-auto bg-base-50 border-r dark:bg-gray-800"
    >
      <div class="grid h-[88vh] grid-cols-1 content-between">
        <div class="flex flex-col gap-4 items-center">
          <i class="fa-solid fa-house text-gray-600"></i>
          <i
            class="fa-solid fa-chevron-right text-gray-600 font-semibold"
            on:click={toggleNodesList}
          ></i>
        </div>
        <div class="flex flex-col gap-3 items-center">
          <i class="fa-solid fa-circle-question text-gray-600"></i>
          <i class="fa-solid fa-gear text-gray-600"></i>
          <i
            class="fa-solid fa-right-to-bracket bg-green-600 py-1 px-2 rounded-md text-white"
          ></i>
        </div>
      </div>
    </div>

    <!-- server health toggle nodes list -->
    {#if nodesList}
      <div
        class="h-full w-[14vw] sidebar-multi lg:px-2 md:px-1 py-2 overflow-y-auto bg-base-50 border-r dark:bg-gray-800"
      >
        <h3 class="text-lg tracking-[0.04rem] mb-2" style="font-weight:500">
          Server Health
        </h3>
        <ul class="space-y-1 font-medium">
          <li>
            <a
              href="#"
              class="flex tracking-[0.08rem] items-center text-xs p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <svg
                class="w-4 h-4 text-gray-600 dark:text-white"
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
                  d="m10.051 8.102-3.778.322-1.994 1.994a.94.94 0 0 0 .533 1.6l2.698.316m8.39 1.617-.322 3.78-1.994 1.994a.94.94 0 0 1-1.595-.533l-.4-2.652m8.166-11.174a1.366 1.366 0 0 0-1.12-1.12c-1.616-.279-4.906-.623-6.38.853-1.671 1.672-5.211 8.015-6.31 10.023a.932.932 0 0 0 .162 1.111l.828.835.833.832a.932.932 0 0 0 1.111.163c2.008-1.102 8.35-4.642 10.021-6.312 1.475-1.478 1.133-4.77.855-6.385Zm-2.961 3.722a1.88 1.88 0 1 1-3.76 0 1.88 1.88 0 0 1 3.76 0Z"
                />
              </svg>

              <span
                class="flex-1 text-xs xl:ms-3 lg:ms-1 whitespace-nowrap tracking-[0.08rem]"
                >Integrations</span
              >
            </a>
          </li>
          <li>
            <a
              href="#"
              class="flex tracking-[0.08rem] items-center text-xs p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <svg
                class="w-4 h-4 text-gray-600 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M10.83 5a3.001 3.001 0 0 0-5.66 0H4a1 1 0 1 0 0 2h1.17a3.001 3.001 0 0 0 5.66 0H20a1 1 0 1 0 0-2h-9.17ZM4 11h9.17a3.001 3.001 0 0 1 5.66 0H20a1 1 0 1 1 0 2h-1.17a3.001 3.001 0 0 1-5.66 0H4a1 1 0 1 1 0-2Zm1.17 6H4a1 1 0 1 0 0 2h1.17a3.001 3.001 0 0 0 5.66 0H20a1 1 0 1 0 0-2h-9.17a3.001 3.001 0 0 0-5.66 0Z"
                />
              </svg>

              <span
                class="flex-1 text-xs xl:ms-3 lg:ms-1 whitespace-nowrap tracking-[0.08rem]"
                >Connect Nodes</span
              >
            </a>
          </li>

          <li>
            <a
              href="#"
              class="flex tracking-[0.08rem] items-center text-xs p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <svg
                class="w-4 h-4 text-gray-600 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-width="2"
                  d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>

              <span
                class="flex-1 text-xs xl:ms-3 lg:ms-1 whitespace-nowrap tracking-[0.08rem]"
                >Invite Users</span
              >
            </a>
          </li>
        </ul>
        <ul class="space-y-2 font-medium">
          <li>
            <button
              type="button"
              on:click={handleSideMenuCollapseServer}
              class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              aria-controls="sidemenu_collapse"
              data-collapse-toggle="sidemenu_collapse"
            >
              <svg
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
                  d="M11 6.5h2M11 18h2m-7-5v-2m12 2v-2M5 8h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1Zm0 12h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1Zm12 0h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1Zm0-12h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1Z"
                />
              </svg>

              <span
                class="flex-1 tracking-[0.05rem] text-sm xl:ms-3 lg:ms-1 text-left rtl:text-right whitespace-nowrap"
                >Rooms</span
              >
              <svg
                class="w-2 h-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            <ul id="sidemenu_collapse_server" class="hidden py-1 space-y-2">
              <li
                class="hover:bg-transparent text-sm ps-3 cursor-pointer tracking-[0.05rem]"
              >
                {#each Cluster[0].nodes as node}
                  <li
                    on:click={() => setActiveNode(node.objDetails.name, node)}
                  >
                    <a
                      href="#"
                      class="flex tracking-[0.08rem] text-xs items-center w-full py-2 my-1 ps-3 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 {node
                        .objDetails.name === activeNode
                        ? 'bg-gray-100'
                        : ''}">{node.objDetails.name}</a
                    >
                  </li>
                {/each}
                <a
                  href="#my_modal_22 "
                  class="mt-2 inline-block decoration-none"
                >
                  <i class="fa-solid text-sm text-gray-500 fa-plus"></i>&nbsp;
                  New Node
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    {/if}
  </aside>

  <div class="w-full sm:w-[93%]">
    <!-- server health navbar -->
    <nav class="w-full">
      <div
        class="flex border-b border-gray-100 py-1 px-2 w-full justify-between items-center"
      >
        <!-- navbar left side content -->
        <div class="flex items-center gap-3">
          <!-- dropdown node list -->
          <div class="dropdown">
            <div
              tabindex="0"
              role="button"
              class=" px-2 py-0 font-medium tracking-[0.05rem] flex items-center gap-2"
            >
              <svg
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
                  d="M11 6.5h2M11 18h2m-7-5v-2m12 2v-2M5 8h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1Zm0 12h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1Zm12 0h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1Zm0-12h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1Z"
                />
              </svg>
              <span style="font-weight: 500;">
                {activeNode}
              </span>
              <span
                ><i class="fa-solid fa-chevron-down" style="font-size: 9px;"
                ></i></span
              >
            </div>
            <ul
              tabindex="0"
              class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <span class="text-lg tracking-[0.06rem] m-1">Rooms </span>
              {#each Cluster[0].nodes as node}
                <li on:click={() => setActiveNode(node.objDetails.name, node)}>
                  <a
                    class={node.objDetails.name === activeNode
                      ? "bg-gray-100"
                      : ""}>{node.objDetails.name}</a
                  >
                </li>
              {/each}
            </ul>
          </div>
          <i class="fa-solid fa-gear text-gray-500"></i>
        </div>

        <!-- navbar right side content -->
        <div class="flex items-center gap-3">
          <button
            class="rounded-md bg-transparent text-xs hover:text-green-900 tracking-[0.05rem] py-1 px-3"
            >Alpha features</button
          >

          <button
            class="rounded-md bg-green-600 text-white text-xs tracking-[0.05rem] py-1 px-3"
            >2</button
          >

          <i class="fa-solid fa-server text-gray-500"></i>
          <button
            class="rounded-md bg-green-600 text-white text-xs tracking-[0.05rem] py-2 px-2"
            >Sign In</button
          >
        </div>
      </div>
    </nav>

    <!-- server health main content start -->
    <div class="w-full p-1">
      <div role="tablist" class="tabs tabs-lifted">
        <!-- home tab -->
        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          class="tab bg-base-100 tracking-[0.05rem] checked:bg-gray-100 checked:text-gray-600 checked:font-semibold"
          aria-label="Home"
          checked
        />
        <div
          role="tabpanel"
          class="tab-content bg-gray-100 border-base-300 rounded-box p-3 sm:p-[0.25rem!important] sm:w-[96vw] h-[80vh]"
          style="overflow-y: auto; max-height: calc(100vh - 50px)"
        >
          <div>
            <div class="p-2 bg-gray-50 shadow rounded">
              <div class="flex w-full gap-2 sm:flex-col">
                <div class="w-[16vw] sm:w-[87vw!important] border-e">
                  <div class="flex flex-col gap-2">
                    <span class="text-sm text-center tracking-[0.05rem]"
                      >Total Nodes</span
                    >
                    <span
                      class="text-xl font-semibold text-gray-600 tracking-[0.05rem] text-center"
                      >2</span
                    >
                  </div>
                  <div class="flex justify-between px-3 mt-2">
                    <div class="flex flex-col gap-2">
                      <span class="text-xs text-center tracking-[0.05rem]"
                        >Live</span
                      >
                      <span
                        class="text-lg font-semibold text-gray-600 tracking-[0.05rem] text-center"
                        >2</span
                      >
                    </div>
                    <div class="flex flex-col gap-2">
                      <span class="text-xs text-center tracking-[0.05rem]"
                        >Offline</span
                      >
                      <span
                        class="text-lg font-semibold text-gray-600 tracking-[0.05rem] text-center"
                        >0</span
                      >
                    </div>
                    <div class="flex flex-col gap-2">
                      <span class="text-xs text-center tracking-[0.05rem]"
                        >Stale</span
                      >
                      <span
                        class="text-lg font-semibold text-gray-600 tracking-[0.05rem] text-center"
                        >2</span
                      >
                    </div>
                  </div>
                  <div class="my-2">
                    <progress
                      class="progress progress-success w-52"
                      value="100"
                      max="100"
                    ></progress>
                  </div>

                  <div class="mt-3">
                    <div class="text-sm text-center tracking-[0.05rem]">
                      Active alerts
                    </div>
                    <div class="mt-2">
                      <div
                        class="radial-progress text-primary"
                        style="--value:20;"
                        role="progressbar"
                      >
                        20%
                      </div>
                    </div>
                  </div>
                </div>
                <!-- middle part -->
                <div class="w-[38vw] sm:w-[91vw!important] border-e">
                  <div class="flex items-center">
                    <form class="max-w-sm mx-auto">
                      <label
                        for="group"
                        class="block mb-1 text-xs tracking-[0.06rem] font-medium text-gray-900 dark:text-white"
                        >Group by</label
                      >
                      <select
                        id="group"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="US" selected>None</option>
                        <option value="CA">Status</option>
                      </select>
                    </form>

                    <form class="max-w-sm mx-auto">
                      <label
                        for="color"
                        class="block mb-1 text-xs tracking-[0.06rem] font-medium text-gray-900 dark:text-white"
                        >Color by</label
                      >
                      <select
                        id="color"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="US" selected>Status</option>
                        <option value="CA">Connection Ability</option>
                      </select>
                    </form>

                    <div class="flex items-center gap-3 mt-4 me-2">
                      <div class="flex items-center gap-1">
                        <div class="w-3 h-3 bg-green-600"></div>
                        <span class="tracking-[0.07rem] text-xs">Live</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <div class="w-3 h-3 bg-gray-600"></div>
                        <span class="tracking-[0.07rem] text-xs">Offline</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <div class="w-3 h-3 bg-gray-200"></div>
                        <span class="tracking-[0.07rem] text-xs">Stale</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <div class="w-3 h-3 bg-yellow-600"></div>
                        <span class="tracking-[0.07rem] text-xs">Unseen</span>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- right part -->
                <div class="w-[16vw] sm:w-[87vw!important]">
                  <div class="flex justify-between px-3 mt-2">
                    <div class="flex flex-col gap-2">
                      <span class="text-xs text-center tracking-[0.05rem]"
                        >Parents</span
                      >
                      <span
                        class="text-xl font-semibold text-gray-600 tracking-[0.05rem] text-center"
                        >0</span
                      >
                    </div>
                    <div class="flex flex-col gap-2">
                      <span class="text-xs text-center tracking-[0.05rem]"
                        >Children</span
                      >
                      <span
                        class="text-xl font-semibold text-gray-600 tracking-[0.05rem] text-center"
                        >0</span
                      >
                    </div>
                    <div class="flex flex-col gap-2">
                      <span class="text-xs text-center tracking-[0.05rem]"
                        >Standalone</span
                      >
                      <span
                        class="text-xl font-semibold text-gray-600 tracking-[0.05rem] text-center"
                        >0</span
                      >
                    </div>
                  </div>
                  <div class="my-2">
                    <progress
                      class="progress progress-primary w-54"
                      value="10"
                      max="100"
                    ></progress>
                  </div>

                  <div class="mt-4">
                    <div class="text-sm text-center tracking-[0.05rem]">
                      Data Replication
                    </div>
                    <div class="flex justify-between px-3 mt-2">
                      <div class="flex flex-col gap-2">
                        <span class="text-xs text-center tracking-[0.05rem]"
                          >None</span
                        >
                        <span
                          class="text-xl font-semibold text-gray-600 tracking-[0.05rem] text-center"
                          >0</span
                        >
                      </div>
                      <div class="flex flex-col gap-2">
                        <span class="text-xs text-center tracking-[0.05rem]"
                          >Single</span
                        >
                        <span
                          class="text-xl font-semibold text-gray-600 tracking-[0.05rem] text-center"
                          >0</span
                        >
                      </div>
                      <div class="flex flex-col gap-2">
                        <span class="text-xs text-center tracking-[0.05rem]"
                          >Multi</span
                        >
                        <span
                          class="text-xl font-semibold text-gray-600 tracking-[0.05rem] text-center"
                          >0</span
                        >
                      </div>
                    </div>
                    <div class="my-2">
                      <progress
                        class="progress progress-primary w-54"
                        value="10"
                        max="100"
                      ></progress>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex sm:flex-col mt-2 gap-1">
              <!-- alert section  -->
              <div
                class="p-3 bg-gray-50 w-[45vw] sm:w-[90vw!important] max-w-[100vw] shadow rounded"
              >
                <!-- most alerts in 24h-->
                <span class="text-sm tracking-[0.05rem]"
                  >Nodes with the most alerts in the last 24h</span
                >
                <!-- bar chart  -->
                <div>
                  <BarChart {data1} {options1} height="100" />
                </div>

                <!-- bar chart details -->
                <div class="flex justify-around px-3 mt-2">
                  <div class="flex flex-col gap-2">
                    <span class="text-xs text-center tracking-[0.05rem]"
                      >Warning</span
                    >
                    <span
                      class="text-lg font-semibold text-gray-600 tracking-[0.05rem] text-center"
                      >1183</span
                    >
                  </div>
                  <div class="flex flex-col gap-2">
                    <span class="text-xs text-center tracking-[0.05rem]"
                      >Critical</span
                    >
                    <span
                      class="text-lg font-semibold text-gray-600 tracking-[0.05rem] text-center"
                      >9</span
                    >
                  </div>
                  <div class="flex flex-col gap-2">
                    <span class="text-xs text-center tracking-[0.05rem]"
                      >Total</span
                    >
                    <span
                      class="text-lg font-semibold text-gray-600 tracking-[0.05rem] text-center"
                      >1192</span
                    >
                  </div>
                </div>
                <div class="my-2">
                  <progress
                    class="progress progress-warning w-full"
                    value="90"
                    max="100"
                  ></progress>
                </div>

                <!-- top alerts in 24h -->
                <div class="mb-2 mt-4">
                  <span class="text-sm tracking-[0.05rem]"
                    >Top alerts in the last 24 h</span
                  >
                  <!-- table of alerts  -->
                  <div class="relative overflow-x-auto mt-2">
                    <table
                      class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      <thead class="text-xs text-gray-900 dark:text-gray-400">
                        <tr>
                          <th
                            scope="col"
                            class="text-center text-xs tracking-[0.05rem] py-2 border border-gray-300 text-gray-600"
                          >
                            Alert name
                          </th>
                          <th
                            scope="col"
                            class="text-center text-xs tracking-[0.05rem] py-2 border border-gray-300"
                          >
                            Instance</th
                          >
                          <th
                            scope="col"
                            class="text-center text-xs tracking-[0.05rem] py-2 border border-gray-300"
                          >
                            Occurrences
                          </th>
                          <th
                            scope="col"
                            class="text-center text-xs tracking-[0.05rem] py-2 border border-gray-300"
                          >
                            Duration(seconds)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="bg-white dark:bg-gray-800">
                          <td
                            class="text-xs py-2 text-center tracking-[0.05rem] border border-gray-300"
                          >
                            <a href="" class="text-green-600"
                              >10min_qos_packet_drops</a
                            >
                          </td>
                          <td
                            class="text-xs py-2 text-center tracking-[0.05rem] border border-gray-300"
                          >
                            <span> tc.eth0_dropped </span>
                          </td>
                          <td
                            class="text-xs py-2 text-center tracking-[0.05rem] border border-gray-300"
                          >
                            <span> 664</span>
                          </td>
                          <td
                            class="text-xs py-2 text-center tracking-[0.05rem] border border-gray-300"
                          >
                            <span> 307682</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <!-- total data overview -->
              <div class="flex flex-col">
                <div
                  class="py-3 px-2 w-[27.2vw] sm:w-[89.2vw!important] max-w-[100vw]"
                >
                  <div class="flex gap-1">
                    <div
                      class="rounded shadow-md bg-gray-50 flex flex-col gap-3 p-2 text-center"
                    >
                      <span class="tracking-[0.05rem] text-xs"
                        >Metrics collected</span
                      >
                      <span class="font-semibold text-xl tracking-[0.05rem]"
                        >150.2k</span
                      >
                    </div>
                    <div
                      class="rounded shadow-md bg-gray-50 flex flex-col gap-3 p-2 text-center"
                    >
                      <span class="tracking-[0.05rem] text-xs"
                        >Charts visualized</span
                      >
                      <span class="font-semibold text-xl tracking-[0.05rem]"
                        >1.2k</span
                      >
                    </div>
                    <div
                      class="rounded shadow-md bg-gray-50 flex flex-col gap-3 p-2 text-center"
                    >
                      <span class="tracking-[0.05rem] text-xs"
                        >Alerts configured</span
                      >
                      <span class="font-semibold text-xl tracking-[0.05rem]"
                        >22</span
                      >
                    </div>
                  </div>
                </div>
                <div
                  class="py-3 px-2 bg-gray-50 w-[27.2vw] sm:w-[89.2vw!important] h-full max-w-[100vw] shadow rounded"
                >
                  <span class="text-sm tracking-[0.05rem]"
                    >Data retention per Nodes</span
                  >
                  <!-- bar chart total data overview day,year,month wise -->
                  <div class="h-full">
                    <BarChart {data2} {options2} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- nodes tab -->
        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          class="tab bg-base-100 tracking-[0.05rem] checked:bg-gray-100 checked:text-gray-600 checked:font-semibold"
          aria-label="Nodes"
        />
        <div
          role="tabpanel"
          class="tab-content bg-gray-100 border-base-300 rounded-box p-3 h-[80vh] w-full"
          style="overflow: auto; max-height: calc(100vh - 50px)"
        >
          <div class="flex sm:flex-col sm:gap-5">
            <!-- nodes tab left section -->
            <div class="w-[54vw] sm:w-[88vw!important] border-end">
              <!-- nodes tab buttons -->
              <div class="flex justify-end items-center">
                <form class="relative">
                  <select
                    id="nodes"
                    class="bg-gray-50 border me-2 px-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="" selected>Node Status</option>
                    <option value="" selected>Alert Status</option>
                  </select>
                  <i
                    class="fa-solid fa-chevron-down absolute top-1.5 right-1 text-xs text-gray-500"
                  ></i>
                </form>
                <button
                  class="mx-2 border-gray-200 border rounded-md text-xs tracking-[0.07rem] py-1 px-2"
                >
                  <i class="fa-solid text-xs fa-gear text-gray-500"></i>
                  Metrics
                </button>
                <button
                  style="font-weight: 600;"
                  class="mx-2 border-green-600 text-green-600 border rounded-md text-xs tracking-[0.07rem] py-1 px-2"
                >
                  Integrations
                </button>
                <button
                  style="font-weight: 600;"
                  class="mx-2 border-green-600 bg-green-600 border text-white rounded-md text-xs tracking-[0.07rem] py-1 px-2"
                >
                  <i class="fa-solid text-xs fa-server"></i>
                  Add nodes
                </button>
              </div>

              <!-- live nodes -->
              <div class="mt-2">
                <div
                  style="font-weight: 520;"
                  class="text-lg tracking-[0.05rem] text-gray-400"
                >
                  Live
                </div>
                {#each activeNodeData.nodes as node}
                  <div
                    class="mt-1 flex items-center gap-2"
                    id={`node-${node.id}`}
                  >
                    <span class=" border-e pe-2 border-gray-300">
                      <i
                        class="fa-solid fa-chart-simple rounded-full text-green-600 border border-gray-200 bg-green-100 p-1"
                      ></i>
                    </span>
                    <span class=" border-e pe-2 border-gray-300">
                      <a href=""
                        >{node.objDetails.name} &nbsp;
                        <i
                          class="fa-solid fa-arrow-up-right-from-square text-gray-400"
                        ></i></a
                      >
                    </span>
                    <span class=" border-e pe-2 border-gray-300">
                      <i class="fa-solid fa-circle-info text-gray-400"></i>
                    </span>
                    <span class=" border-e pe-2 border-gray-300">
                      <i class="fa-regular fa-bell text-gray-600"></i>
                      <span class="px-1">0</span>
                      <span class="px-1">0</span>
                    </span>
                    <span class=" border-e pe-2 border-gray-300">
                      <i class="fa-solid fa-search text-gray-600 text-xs"></i>
                      <span
                        class="py-1 ms-1 cursor-pointer px-2 bg-green-600 text-white rounded-lg text-xs tracking-[0.05rem]"
                        >ON</span
                      >
                    </span>
                    <span class=" border-e pe-2 border-gray-300">
                      <span>f(x)</span>
                      <span
                        class="py-1 ms-1 cursor-pointer px-2 bg-green-600 text-white rounded-lg text-xs tracking-[0.05rem]"
                        >ON</span
                      >
                    </span>
                    <span class="">
                      <i class="fa-solid fa-gear text-gray-600 text-xs"></i>
                      <i
                        style="padding:0.2rem 0.4rem"
                        class="fa-regular fa-bell mx-1 text-xs text-green-600 border rounded-md border-green-600"
                      ></i>
                    </span>
                  </div>

                  <ul
                    class="list-style-none mt-2 grid grid-cols-3 gap-2 w-full overflow-x-auto"
                  >
                    {#if node.healthLineChart && node.healthLineChart.length > 0}
                      {#each node.healthLineChart as healthNode}
                        <li class="w-full shadow-sm">
                          <span
                            id={`${node.id}`}
                            class="text-xs text-gray-600 text-center tracking-[0.05rem]"
                            >{healthNode.text}</span
                          >
                          <div class="mt-1">
                            <LineChart {healthNode} />
                          </div>
                        </li>
                      {/each}
                    {/if}
                  </ul>
                {/each}
              </div>
            </div>

            <!-- nodes tab right section -->
            <div class="w-[20vw] sm:w-[88vw!important]">
              <span class="px-2">Nodes</span>
              <div class="mt-1 w-full">
                <div role="tablist" class="tabs tabs-lifted w-full">
                  <!--nodes charts tab -->
                  <input
                    type="radio"
                    name="my_tabs_6"
                    role="tab"
                    class="tab bg-gray-100 tracking-[0.05rem] checked:bg-gray-50 checked:text-gray-600 checked:font-semibold"
                    aria-label="Charts"
                    checked
                  />
                  <div
                    role="tabpanel"
                    class="tab-content bg-gray-50 border-base-300 rounded-box p-2 h-[80vh] w-full"
                    style="overflow-y: auto; max-height: calc(100vh - 50px)"
                  >
                    <div class="">
                      <ul class="list-style-none mt-2">
                        {#each activeNodeData.nodes as node}
                          <li
                            class=" ms-3 mt-1 font-medium tracking-[0.05rem] cursor-pointer"
                          >
                            <a
                              href={`#node-${node.id}`}
                              class="decoration-none"
                            >
                              {node.objDetails.name}
                            </a>
                            <!-- <i class="fa-solid fa-chevron-right text-xs"></i>&nbsp; -->
                          </li>
                        {/each}
                      </ul>
                    </div>
                  </div>
                  <!-- nodes filter tab -->
                  <input
                    type="radio"
                    name="my_tabs_6"
                    role="tab"
                    class="tab bg-gray-100 tracking-[0.05rem] checked:bg-gray-50 checked:text-gray-600 checked:font-semibold"
                    aria-label="Filter"
                  />
                  <div
                    role="tabpanel"
                    class="tab-content bg-gray-50 border-base-300 rounded-box p-3 h-[80vh]"
                    style="overflow-y: auto; max-height: calc(100vh - 50px)"
                  ></div>
                  <!-- nodes alerts tab -->
                  <input
                    type="radio"
                    name="my_tabs_6"
                    role="tab"
                    class="tab bg-gray-100 tracking-[0.05rem] checked:bg-gray-50 checked:text-gray-600 checked:font-semibold"
                    aria-label="Alerts"
                  />
                  <div
                    role="tabpanel"
                    class="tab-content bg-gray-50 border-base-300 rounded-box p-3 h-[80vh]"
                    style="overflow-y: auto; max-height: calc(100vh - 50px)"
                  ></div>
                  <!-- nodes info tab -->
                  <input
                    type="radio"
                    name="my_tabs_6"
                    role="tab"
                    class="tab bg-gray-100 tracking-[0.05rem] checked:bg-gray-50 checked:text-gray-600 checked:font-semibold"
                    aria-label="Info"
                  />
                  <div
                    role="tabpanel"
                    class="tab-content bg-gray-50 border-base-300 rounded-box p-3 h-[80vh]"
                    style="overflow-y: auto; max-height: calc(100vh - 50px)"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- metrics tab -->
        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          class="tab bg-base-100 tracking-[0.05rem] checked:bg-gray-100 checked:text-gray-600 checked:font-semibold"
          aria-label="Metrics"
        />
        <div
          role="tabpanel"
          class="tab-content bg-gray-100 border-base-300 rounded-box p-3 h-[80vh]"
          style="overflow-y: auto; max-height: calc(100vh - 50px)"
        >
          <div class="flex sm:flex-col sm:gap-5">
            <!-- metrics tab left section -->
            <div class="w-[56vw] sm:w-[88vw!important] border-end">
              <div
                style="font-weight: 520;"
                class="text-lg tracking-[0.05rem] text-gray-400"
              >
                System Overview
              </div>
              <span class="text-xs tracking-[0.07rem]"
                >Overview of the key system metrics.</span
              >
              <!-- charts  -->
              <div class="mt-2">
                <div class="flex gap-3 flex-wrap w-full">
                  {#each activeNodeData.metrics as metricData}
                    <!-- radial chart -->
                    {#if metricData.healthRadial && metricData.healthRadial.length > 0}
                      {#each metricData.healthRadial as progress}
                        <div
                          class="rounded bg-gray-50 shadow-md flex flex-col items-center gap-3 p-2 text-center"
                        >
                          <span class="text-xs tracking-[0.07rem]"
                            >{progress.text}</span
                          >
                          <!-- chart -->
                          <div
                            class="radial-progress {progress.progressBarColorClass} text-xs"
                            style="--value:{progress.value}; --size:{progress.size}; --thickness: {progress.thickness};"
                            role="progressbar"
                          >
                            <span style="font-weight: 520;" class="text-lg"
                              >{progress.displayValue}</span
                            >
                            {progress.unit}
                          </div>
                        </div>
                      {/each}
                    {/if}

                    <!-- pressure chart -->
                    {#if metricData.healthPressure && metricData.healthPressure.length > 0}
                      {#each metricData.healthPressure as pressure}
                        <div
                          class="rounded bg-gray-50 shadow-md flex flex-col items-center gap-3 p-2 text-center"
                        >
                          <span class="text-xs tracking-[0.07rem]"
                            >{pressure.text}</span
                          >
                          <PressureChart {pressure} />
                        </div>
                      {/each}
                    {/if}

                    <!-- health top nodes chart -->
                    {#if metricData.healthTopNodes && metricData.healthTopNodes.length > 0}
                      {#each metricData.healthTopNodes as node}
                        <div
                          class="rounded bg-gray-50 w-[11vw] shadow-md flex flex-col items-center gap-3 p-2 text-center"
                        >
                          <span class="text-xs tracking-[0.07rem]"
                            >{node.text}</span
                          >
                          <div class="mt-0">
                            <div class="relative overflow-x-auto">
                              <table
                                class="w-fit text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                              >
                                <thead
                                  class="text-xs text-gray-900 dark:text-gray-400"
                                >
                                  <tr>
                                    <th
                                      scope="col"
                                      class="text-center px-1 text-xs tracking-[0.05rem] py-2 border-0 text-gray-600"
                                    >
                                      Dimension
                                    </th>
                                    <th
                                      scope="col"
                                      class="text-center text-xs px-1 tracking-[0.05rem] py-2 border-0 text-gray-600"
                                    >
                                      Value
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {#each node.topNodes as top}
                                    <tr class="bg-white dark:bg-gray-800">
                                      <td
                                        class="text-xs py-2 px-1 text-center border-0 tracking-[0.05rem]"
                                      >
                                        <div
                                          class="w-full bg-gray-200 rounded-full dark:bg-gray-700"
                                        >
                                          <div
                                            class="{top.bgColor} {top.textColor} text-xs font-medium text-center p-0.5 leading-none rounded-full"
                                            style={`width:${top.value}`}
                                          >
                                            {top.name}
                                          </div>
                                        </div>
                                      </td>

                                      <td
                                        class="text-xs py-2 px-1 text-center border-0 tracking-[0.05rem]"
                                      >
                                        {top.value}
                                      </td>
                                    </tr>
                                  {/each}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      {/each}
                    {/if}

                    <!-- speedometer chart -->
                    {#if metricData.healthSpeedometer && metricData.healthSpeedometer.length > 0}
                      {#each metricData.healthSpeedometer as speedometer}
                        <div
                          class="rounded bg-gray-50 shadow-md flex flex-col items-center gap-3 p-2 text-center"
                        >
                          <span class="text-xs tracking-[0.07rem]"
                            >{speedometer.text}</span
                          >
                          <Speedometer {speedometer} />
                        </div>
                      {/each}
                    {/if}
                  {/each}
                </div>
              </div>
            </div>

            <!-- metrics tab right section -->
            <div class="w-[20vw] sm:w-[88vw!important]">
              <span class="px-2">Overview</span>
              <div class="mt-1 w-full">
                <div role="tablist" class="tabs tabs-lifted w-full">
                  <!-- charts tab -->
                  <input
                    type="radio"
                    name="my_tabs_3"
                    role="tab"
                    class="tab bg-gray-100 tracking-[0.05rem] checked:bg-gray-50 checked:text-gray-600 checked:font-semibold"
                    aria-label="Charts"
                    checked
                  />
                  <div
                    role="tabpanel"
                    class="tab-content bg-gray-50 border-base-300 rounded-box p-2 h-[80vh] w-full"
                    style="overflow-y: auto; max-height: calc(100vh - 50px)"
                  >
                    <h3 style="font-weight: 530;">Section and Charts</h3>

                    <form class="max-w-md mx-auto mt-1 pb-3">
                      <label
                        for="default-search"
                        class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                        >Search</label
                      >
                      <div class="relative">
                        <input
                          type="search"
                          id="default-search"
                          class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Search Charts"
                          required
                        />
                      </div>
                    </form>

                    <div class="border-t border-gray-200">
                      <ul class="list-style-none mt-2">
                        {#each activeNodeData.metrics as metricData}
                          <!-- <li
                          style="font-weight: 600;"
                          class="text-green-700 tracking-[0.05rem] cursor-pointer"
                        >
                          <i class="fa-solid fa-chevron-right"></i>&nbsp;
                          &nbsp;System Overview
                        </li> -->

                          <li
                            class=" ms-3 mt-1 font-medium tracking-[0.05rem] cursor-pointer"
                          >
                            <!-- <i class="fa-solid fa-chevron-right text-xs"></i>&nbsp; -->
                            {metricData.objDetails.name}
                          </li>
                        {/each}
                      </ul>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="my_tabs_3"
                    role="tab"
                    class="tab bg-gray-100 tracking-[0.05rem] checked:bg-gray-50 checked:text-gray-600 checked:font-semibold"
                    aria-label="Filter"
                  />
                  <div
                    role="tabpanel"
                    class="tab-content bg-gray-50 border-base-300 rounded-box p-3 h-[80vh]"
                    style="overflow-y: auto; max-height: calc(100vh - 50px)"
                  ></div>
                  <input
                    type="radio"
                    name="my_tabs_3"
                    role="tab"
                    class="tab bg-gray-100 tracking-[0.05rem] checked:bg-gray-50 checked:text-gray-600 checked:font-semibold"
                    aria-label="Alerts"
                  />
                  <div
                    role="tabpanel"
                    class="tab-content bg-gray-50 border-base-300 rounded-box p-3 h-[80vh]"
                    style="overflow-y: auto; max-height: calc(100vh - 50px)"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- alert tab -->
        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          class="tab bg-base-100 tracking-[0.05rem] checked:bg-gray-100 checked:text-gray-600 checked:font-semibold"
          aria-label="Alerts"
        />
        <div
          role="tabpanel"
          class="tab-content bg-gray-100 border-base-300 rounded-box p-3 h-[80vh]"
          style="overflow-y: auto; max-height: calc(100vh - 50px)"
        >
          <div class="flex sm:flex-col sm:gap-5">
            <!-- alerts tab left section -->
            <!-- <div class="w-[56vw] border-end"> -->
            <div role="tablist" class="tabs tabs-lifted">
              <!-- alerts raised  tab -->
              <input
                type="radio"
                name="my_tabs_4"
                role="tab"
                class="tab bg-gray-100 tracking-[0.05rem] checked:bg-base-100 checked:text-gray-600 checked:font-semibold"
                aria-label="Raised(17)"
                checked
              />
              <div
                role="tabpanel"
                class="tab-content bg-base-100 border-base-300 rounded-box p-3 h-[80vh]"
                style="overflow-y: auto; max-height: calc(100vh - 50px)"
              >
                <div class="flex justify-between items-center">
                  <form class="w-[18vw]">
                    <label
                      for="default-search"
                      class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                      >Search</label
                    >
                    <div class="relative">
                      <input
                        type="search"
                        id="default-search"
                        class="block w-full p-1.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search Charts"
                        required
                      />
                    </div>
                  </form>
                  <i class="fa-solid fa-gear text-gray-500"></i>
                </div>

                <div class="flex">
                  <div class="mt-2 w-[54vw]">
                    <div class="relative overflow-x-auto overflowScroll">
                      <table
                        class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        {#if activeNodeData.raisedAlerts.length > 0}
                          <thead
                            class="text-xs text-gray-900 dark:text-gray-400"
                          >
                            <tr>
                              {#each Object.keys(activeNodeData.raisedAlerts[0]) as alert}
                                <th
                                  scope="col"
                                  class="text-center capitalize text-xs tracking-[0.05rem] py-2 border border-gray-300 text-gray-600"
                                >
                                  {alert}
                                </th>
                              {/each}
                            </tr>
                          </thead>
                        {/if}
                        <tbody>
                          {#if filteredAlerts.length > 0}
                            {#each filteredAlerts as alert}
                              <tr class="bg-white dark:bg-gray-800">
                                <td
                                  class="text-xs py-3 px-2 tracking-[0.05rem] border border-gray-300"
                                >
                                  <div
                                    class="py-1.5 px-2 bg-warning rounded-lg"
                                  >
                                    {alert.status}
                                  </div>
                                </td>
                                <td
                                  class="text-xs py-3 px-2 tracking-[0.05rem] border border-gray-300"
                                >
                                  <a href="" class="">{alert.alert}</a>
                                </td>
                                <td
                                  class="text-xs py-3 px-2 tracking-[0.05rem] border border-gray-300"
                                >
                                  <div>{alert.name}</div>
                                </td>
                                <td
                                  class="text-xs py-3 px-2 tracking-[0.05rem] border border-gray-300"
                                >
                                  <div>{alert.context}</div>
                                </td>
                                <td
                                  class="text-xs py-3 px-2 tracking-[0.05rem] border border-gray-300"
                                >
                                  <div>{alert.instance}</div>
                                </td>
                                <td
                                  class="text-xs py-3 px-2 tracking-[0.05rem] border border-gray-300"
                                >
                                  <div>{alert.node}</div>
                                </td>
                                <td
                                  class="text-xs py-3 px-2 tracking-[0.05rem] border border-gray-300"
                                >
                                  <div
                                    class="text-warning w-[6vw] border bg-amber-100 border-warning rounded-lg py-1.5 px-2"
                                    style="font-weight: 600;"
                                  >
                                    {alert.latestValue}
                                  </div>
                                </td>
                                <td
                                  class="text-xs py-3 px-3 tracking-[0.05rem] border border-gray-300"
                                >
                                  <div class="w-[8vw]">{alert.updatedAt}</div>
                                </td>
                                <td
                                  class="text-xs py-3 px-2 tracking-[0.05rem] border border-gray-300"
                                >
                                  <div
                                    class="text-warning w-[7vw] max-w-[20vw] border bg-amber-100 border-warning rounded-lg py-1.5 px-2"
                                    style="font-weight: 600;"
                                  >
                                    {alert.triggeredValue}
                                  </div>
                                </td>
                                <td
                                  class="text-xs py-3 px-3 tracking-[0.05rem] border border-gray-300"
                                >
                                  <div class="w-[8vw]">{alert.triggeredAt}</div>
                                </td>
                              </tr>
                            {/each}
                          {/if}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <!-- alerts raised tab right section -->
                  <div class="w-[22vw] border-s border-gray-200 h-full">
                    <span class="px-2">Alerts</span>
                    <div class="mt-1 w-full px-2">
                      <!-- raised status name filter -->

                      <span class="px-2">Status</span>
                      <ul class="list-style-none mt-2">
                        <li class="px-2 flex gap-2 my-2">
                          <input
                            type="checkbox"
                            id="select-all-status"
                            bind:checked={selectAllStatus}
                            on:change={() =>
                              handleSelectAll("status", selectAllStatus)}
                            class="w-4 h-4 border border-gray-200"
                          />
                          <span class="tracking-[0.05rem] text-xs"
                            >Select all</span
                          >
                        </li>
                        {#each activeNodeData.raisedAlerts as alert}
                          <li class="px-2 flex gap-2 my-2">
                            <input
                              type="checkbox"
                              id={alert.status}
                              checked={selectedStatus.includes(alert.status)}
                              on:change={(e) =>
                                handleCheckboxChange(
                                  "status",
                                  alert.status,
                                  e.target.checked
                                )}
                              class="w-4 h-4 border border-gray-200"
                            />
                            <span class="tracking-[0.05rem] text-xs"
                              >{alert.status}</span
                            >
                          </li>
                        {/each}
                      </ul>

                      <!-- raised alert name filter -->
                      <span class="px-2 mt-2 inline-block">Name</span>
                      <form class="max-w-md mx-auto mt-1 pb-2">
                        <label
                          for="default-search"
                          class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                          >Search</label
                        >
                        <div class="relative">
                          <input
                            type="search"
                            id="default-search"
                            class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search.."
                            required
                          />
                        </div>
                      </form>
                      <ul class="list-style-none mt-2">
                        <li class="px-2 flex gap-2 my-2">
                          <input
                            type="checkbox"
                            name=""
                            id=""
                            class="w-4 h-4 border border-gray-200"
                          />
                          <span class="tracking-[0.05rem] text-xs"
                            >Select all</span
                          >
                        </li>
                        {#each activeNodeData.raisedAlerts as alert}
                          <li class="px-2 flex gap-2 my-2">
                            <input
                              type="checkbox"
                              id={alert.name}
                              checked={selectedName.includes(alert.name)}
                              on:change={(e) =>
                                handleCheckboxChange(
                                  "name",
                                  alert.name,
                                  e.target.checked
                                )}
                              class="w-4 h-4 border border-gray-200"
                            />
                            <span class="tracking-[0.05rem] text-xs"
                              >{alert.name}</span
                            >
                          </li>
                        {/each}
                      </ul>

                      <!-- raised alert context filter -->
                      <span class="px-2 mt-2 inline-block">Contexts</span>
                      <form class="max-w-md mx-auto mt-1 pb-2">
                        <label
                          for="default-search"
                          class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                          >Search</label
                        >
                        <div class="relative">
                          <input
                            type="search"
                            id="default-search"
                            class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search.."
                            required
                          />
                        </div>
                      </form>
                      <ul class="list-style-none mt-2">
                        <li class="px-2 flex gap-2 my-2">
                          <input
                            type="checkbox"
                            name=""
                            id=""
                            class="w-4 h-4 border border-gray-200"
                          />
                          <span class="tracking-[0.05rem] text-xs"
                            >Select all</span
                          >
                        </li>
                        {#each activeNodeData.raisedAlerts as alert}
                          <li class="px-2 flex gap-2 my-2">
                            <input
                              type="checkbox"
                              name=""
                              id=""
                              class="w-4 h-4 border border-gray-200"
                            />
                            <span class="tracking-[0.05rem] text-xs"
                              >{alert.context}</span
                            >
                          </li>
                        {/each}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <!-- alerts running  tab -->
              <input
                type="radio"
                name="my_tabs_4"
                role="tab"
                class="tab bg-gray-100 tracking-[0.05rem] checked:bg-base-100 checked:text-gray-600 checked:font-semibold"
                aria-label="Running(122)"
              />
              <div
                role="tabpanel"
                class="tab-content bg-base-100 border-base-300 rounded-box p-3 h-[80vh]"
                style="overflow-y: auto; max-height: calc(100vh - 50px)"
              >
                <div class="flex justify-between items-center">
                  <form class="w-[18vw]">
                    <label
                      for="default-search"
                      class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                      >Search</label
                    >
                    <div class="relative">
                      <input
                        type="search"
                        id="default-search"
                        class="block w-full p-1.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search Charts"
                        required
                      />
                    </div>
                  </form>
                  <i class="fa-solid fa-gear text-gray-500"></i>
                </div>
                <div class="relative overflow-x-auto mt-2">
                  <table
                    class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                  >
                    {#if activeNodeData.runningAlerts.length > 0}
                      <thead class="text-xs text-gray-900 dark:text-gray-400">
                        <tr>
                          {#each Object.keys(activeNodeData.runningAlerts[0]) as alert}
                            <th
                              scope="col"
                              class="text-center capitalize text-xs tracking-[0.05rem] py-2 px-1 border border-gray-300 text-gray-600"
                            >
                              {alert}
                            </th>
                          {/each}
                        </tr>
                      </thead>
                    {/if}
                    <tbody>
                      {#if activeNodeData.runningAlerts.length > 0}
                        {#each activeNodeData.runningAlerts as alert}
                          <tr class="bg-white dark:bg-gray-800">
                            <td
                              class="text-xs py-3 px-2 tracking-[0.05rem] border border-gray-300"
                            >
                              <div class="">
                                {alert.alert}
                              </div>
                            </td>
                            <td
                              class="text-xs py-3 px-2 tracking-[0.05rem] border border-gray-300"
                            >
                              <a href="" class="">{alert.nodesRunningAlert}</a>
                            </td>
                            <td
                              class="text-xs py-3 px-2 tracking-[0.05rem] border border-gray-300"
                            >
                              <div>{alert.alertInstances}</div>
                            </td>
                            <td
                              class="text-xs py-3 px-2 tracking-[0.05rem] border border-gray-300"
                            >
                              <div>{alert.contexts}</div>
                            </td>
                            <td
                              class="text-xs py-3 px-2 tracking-[0.05rem] border border-gray-300"
                            >
                              {#if alert.critical === ""}
                                <div class="px-2">{alert.critical}</div>
                              {:else}
                                <div class="px-2">-</div>
                              {/if}
                            </td>
                            <td
                              class="text-xs py-3 px-2 tracking-[0.05rem] border border-gray-300"
                            >
                              {#if alert.warning === ""}
                                <div class="px-2">{alert.warning}</div>
                              {:else}
                                <div class="px-2">-</div>
                              {/if}
                            </td>
                            <td
                              class="text-xs py-3 px-2 tracking-[0.05rem] border border-gray-300"
                            >
                              <div
                                class="text-white border bg-green-600 border-green-600 rounded-lg py-1.5 px-2"
                                style="font-weight: 600;"
                              >
                                {alert.clear}
                              </div>
                            </td>
                            <td
                              class="text-xs py-3 px-3 tracking-[0.05rem] border border-gray-300"
                            >
                              {#if alert.error === ""}
                                <div class="px-2">{alert.error}</div>
                              {:else}
                                <div class="px-2">-</div>
                              {/if}
                            </td>
                            <td
                              class="text-xs py-3 px-2 tracking-[0.05rem] border border-gray-300"
                            >
                              <div>
                                {alert.configs}
                              </div>
                            </td>
                            <td
                              class="text-xs py-3 px-3 tracking-[0.05rem] border border-gray-300"
                            >
                              <div class="w-[8vw]">{alert.classes}</div>
                            </td>
                            <td
                              class="text-xs py-3 px-3 tracking-[0.05rem] border border-gray-300"
                            >
                              <div class="w-[8vw]">{alert.components}</div>
                            </td>
                            <td
                              class="text-xs py-3 px-3 tracking-[0.05rem] border border-gray-300"
                            >
                              <div class="w-[8vw]">{alert.types}</div>
                            </td>
                            <td
                              class="text-xs py-3 px-3 tracking-[0.05rem] border border-gray-300"
                            >
                              <div class="">{alert.roles}</div>
                            </td>
                            <td
                              class="text-xs py-3 px-3 tracking-[0.05rem] border border-gray-300"
                            >
                              {#if alert.silencing === ""}
                                <div class="px-2">{alert.silencing}</div>
                              {:else}
                                <div class="px-2">N/A</div>
                              {/if}
                            </td>
                          </tr>
                        {/each}
                      {/if}
                    </tbody>
                  </table>
                </div>
              </div>
              <!-- </div> -->
            </div>
          </div>
        </div>
        <!-- sites tab -->
        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          class="tab bg-base-100 tracking-[0.05rem] checked:bg-gray-100 checked:text-gray-600 checked:font-semibold"
          aria-label="Sites"
        />
        <div
          role="tabpanel"
          class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
        ></div>
        <!-- services tab -->
        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          class="tab bg-base-100 tracking-[0.05rem] checked:bg-gray-100 checked:text-gray-600 checked:font-semibold"
          aria-label="Services"
        />
        <div
          role="tabpanel"
          class="tab-content bg-gray-100 border-base-300 rounded-box p-2 overflow-y-auto h-[100vh] pb-5 mb-5"
        >

        <div class="mb-5 pb-5">

          <!-- Loop through clusters and display services -->
          {#each clusters as cluster}
            <div class="cluster bg-gray-50 border rounded-md my-2">
              <h2>{cluster.objDetails.name}</h2>

              {#each cluster.ch as ch}
                <!-- Loop through machines inside each cluster -->
                {#each ch.machines as machine}
                  <div class="machine border rounded-md my-2">
                    <h3 style="font-weight:600">Machine: {machine.objDetails.name}</h3>

                    <!-- List services under each machine -->
                    {#each machine.services as service}
                      <div class="service flex items-center justify-between border rounded-md my-2">
                        <div>

                          <p> <span style="font-weight:600">

                            Service Name: 
                          </span> 
                            {service.name}
                          </p>
                        </div>
                        <div class="gap-2 flex items-center">

                          <button
                          class="bg-gray-100 py-1.5 px-2 my-2 rounded-md hover:bg-gray-400 text-xs tracking-[0.06rem] hover:text-white"
                          on:click={() =>
                            deleteService(cluster.id, machine.id, service.id)}
                          ><i class="fa-solid fa-trash text-xs text-gray-500 "></i></button
                          >
                        <button
                        class="bg-green-600 text-white py-1.5 px-2 my-2 rounded-md hover:bg-green-800 text-xs tracking-[0.06rem]"
                          on:click={() =>
                            editService(cluster.id, machine.id, service.id)}
                          >Edit</button
                          >
                        </div>
                      </div>
                    {/each}

                    <!-- Button to add a new service to this machine -->
                    <button on:click={() => addService(cluster.id, machine.id)}      class="bg-green-600 text-white py-1.5 px-2 my-2 rounded-md hover:bg-green-800 text-xs tracking-[0.06rem]"
                      >Add Service</button
                    >
                  </div>
                {/each}
              {/each}
            </div>
          {/each}

          </div>
        </div>
        <!-- server graph tab -->
        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          class="tab bg-base-100 tracking-[0.05rem] checked:bg-gray-100 checked:text-gray-600 checked:font-semibold"
          aria-label="serverGraph"
        />
        <div
          role="tabpanel"
          class="tab-content bg-gray-100 border-base-300 rounded-box p-3"
        >
          <!-- server graph content -->
          <ServerGraph />
        </div>
      </div>
    </div>
  </div>

  <!-- server health main content end -->
</main>

<style>
  .overflowScroll::-webkit-scrollbar {
    height: 5px;
  }

  .cluster,
  .machine,
  .service {
    margin-bottom: 10px;
    padding: 10px;
  }
  .machine,
  .service {
    margin-left: 20px;
  }
</style>

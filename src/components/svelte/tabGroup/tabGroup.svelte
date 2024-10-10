<script>
  import { onMount } from "svelte";
  let openTabGroup = {};
  let activeTab = ""; // Initial active tab
  let activeGroup = "tab-3";
  let showTabInGroups = {};
  let nextTabId = 2; // Variable to keep track of the next tab id

  function generateUniqueIdTabGroup() {
    return "tab-" + Math.random().toString(36).substr(2, 9); // Example implementation
  }

  let tabs = [];
  onMount(() => {
    tabs = [
      {
        id: generateUniqueIdTabGroup(),
        name: "Home",
        documents: [],
        databaseName: "",
        connectionName: "",
      },
    ]; // Initial tabs

    activeTab = tabs[0].id;
  });

  let groupToAdd = "";
  // Array to store tab groups
  let tabGroups = [];

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

  // Function to set active tab
  function setActiveTab(tabId, groupId) {
    activeTab = tabId;
    activeGroup = groupId;
  }

  function addToTabGroup(tab, groupName) {
    const existingGroup = tabGroups.find((group) => group.name === groupName);
    const newTabId = generateUniqueIdTabGroup();
    const tabId = `tab-${nextTabId++}`;
    console.log(tabId, "tabId");

    // Determine the background color for the new group
    const groupColor = getRandomColor();

    if (existingGroup) {
      const newUpdatedTab = {
        ...tab,
        id: generateUniqueIdTabGroup(),
      };
      existingGroup.tabs.push(newUpdatedTab);
      activeGroup = existingGroup.id;
      activeTab = newUpdatedTab.id;
    } else {
      const newGroup = {
        id: newTabId,
        name: groupName,
        tabs: [
          {
            id: generateUniqueIdTabGroup(),
            name: tab.name,
            documents: tab.documents,
          },
        ],
        color: groupColor,
      };
      tabGroups.push(newGroup);
      showTabInGroups[newGroup.id] = true;
      activeGroup = newGroup.id;
      activeTab = newGroup.tabs[0].id;
    }

    // Remove the tab from the tabs array
    tabs = tabs.filter((t) => t.id !== tab.id);

    tabGroups = [...tabGroups];
    tabs = [...tabs];

    groupToAdd = "";
  }
  function handleDragStart(event, tab) {
    event.dataTransfer.setData("text/plain", tab.id);
  }

  // Event handler for drag over in the first list
  function handleDragOver(event) {
    event.preventDefault();
  }

  // internal tab dragging in tabGroups
  function handleDragStartInternalTab(event, tab) {
    console.log("dragging internal tab");
    event.dataTransfer.setData("text/plain", tab.id);
  }

  // Event handler for drag over in the first list
  function handleDragOverInternalTab(event) {
    event.preventDefault();
  }

  // Event handler for drop in the tabGroups list
  function handleDropInTabGroups(event, group) {
    event.preventDefault();
    const tabId = event.dataTransfer.getData("text/plain");
    const tab = tabs.find((t) => t.id === tabId);

    const draggedGroupId = event.dataTransfer.getData("text/plain");
    const droppedGroupId = event.target.dataset.tabId; // Get the ID of the tab where it's dropped

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
      tabs = tabs.filter((t) => t.id !== tabId);

      // Add the tab to the specified group
      group.tabs.push(tab);

      activeGroup = group.id;
      // Update tabGroups
      tabGroups = [...tabGroups];
    }
  }

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
      if (activeTab === tabId && group.tabs.length > 0) {
        activeTab = group.tabs[0].id;
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

  // Function to close a tab
  function closeTab(tabId) {
    // Filter out the closed tab from tabs array
    tabs = tabs.filter((tab) => tab.id !== tabId);

    console.log(activeTab, "active tab");

    // If the closed tab was the active one and there are still tabs, activate the first tab
    if (activeTab === tabId && tabs.length > 0) {
      activeTab = tabs[0].id;
    }
    // If no tabs remain, check the tabGroups
    else if (tabs.length === 0 && tabGroups.length > 0) {
      // Activate the first tab in the first tabGroup
      activeGroup = tabGroups[0].id;
      if (tabGroups[0].tabs.length > 0) {
        activeTab = tabGroups[0].tabs[0].id; // Activate the first tab in the first tabGroup
      }
    }
    // Otherwise, just activate the current group
    else {
      tabGroups.forEach((group) => {
        activeGroup = group.id;
      });
    }
  }

  // drag tab groups
  function handleDragStartTabGroup(event, group) {
    event.dataTransfer.setData("text/plain", group.id);
    console.log(group, "group");
  }

  // Event handler for drag over in the first list
  function handleDragOverTabGroup(event) {
    event.preventDefault();
  }

  let isEditing = {};

  function handleDoubleClick(tab) {
    isEditing[tab.id] = true;
  }
  function handleBlur(tab) {
    isEditing[tab.id] = false;
  }

  function handleKeyPress(event, tab) {
    if (event.key === "Enter") {
      isEditing[tab.id] = false;
    }
  }
</script>

<div class="p-5">
  <ul class=" w-full nav nav-pills list-style-none">
    {#if tabGroups.length > 0}
      {#each tabGroups as group}
        <li
          style="font-size: 14px;position:relative"
          class="nav-item d-flex gap-2 bg-gray-100 align-items-center
     border-end py-0 ps-2 group {activeGroup !== group.id
            ? 'border border-green-800'
            : ''} "
          on:drop={(e) => handleDropInTabGroups(e, group)}
          on:dragover={(e) => handleDragOver(e)}
          class:active={group.id === activeGroup && activeTab}
        >
          <div
            data-tab-id={group.id}
            on:dragstart={(e) => handleDragStartTabGroup(e, group)}
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
              class="d-flex align-items-center gap-1 {activeGroup === group.id
                ? 'borderafter'
                : ''}  "
            >
              {#each group.tabs as tab}
                <div
                  class:active={tab.id === activeTab}
                  class="flex tabInGroup px-1 items-center"
                  on:click={() => setActiveTab(tab.id, group.id)}
                >
                  <a
                    data-tab-id={tab.id}
                    draggable="true"
                    on:dragstart={(e) => handleDragStartInternalTab(e, tab)}
                    on:dragover={(e) => handleDragOverInternalTab(e)}
                    on:drop={(e) => handleInternalTabDrop(e, group)}
                    style="font-size:12px"
                    class="text-decoration-none d-inline-block text-gray-600 font600"
                    data-bs-toggle="pill"
                    href="#"
                    on:dblclick={() => handleDoubleClick(tab)}
                  >
                    {#if isEditing[tab.id]}
                      <input
                        type="text"
                        bind:value={tab.name}
                        on:input={(e) => (editedName = e.target.value)}
                        on:blur={() => handleBlur(tab)}
                        on:keypress={(e) => handleKeyPress(e, tab)}
                        class="text-decoration-none inline-block border border-green-800 text-gray-600 w-[5vw] py-1 px-1 text-xs tracking-[0.06rem]"
                        autofocus
                      />
                    {:else}
                      {tab.name}
                    {/if}
                  </a>
                  <!-- dropdown -->
                  <div class="dropdown">
                    <div tabindex="0" role="button">
                      <i
                        style="font-size: 10px;"
                        class="fa-solid fa-gear text-gray-500 ms-2 me-1"
                      ></i>
                    </div>
                    <ul
                      tabindex="0"
                      class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                    >
                      <li><a href="#">Delete</a></li>
                      <li><a href="#">Duplicate</a></li>
                      <li>
                        <!-- sub dropdown -->
                        <details class="dropdown dropdown-right dropdown-hover">
                          <summary
                            class="m-0 flex items-center justify-between"
                          >
                            <span> Copy to </span>
                          </summary>
                          <ul
                            class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                          >
                            <li><a>Item 1</a></li>
                            <li><a>Item 2</a></li>
                          </ul>
                        </details>
                      </li>

                      <li><a href="#">Rename</a></li>
                      <hr class="border border-gray-400" />
                      <li><a href="#">New</a></li>
                    </ul>
                  </div>

                  {#if activeTab === tab.id}
                    <input
                      type="text"
                      class="form-control py-1 border-0 w-[5vw]"
                      placeholder="add.."
                      style="font-size: 12px; {activeGroup === group.id
                        ? 'background-color:rgb(0 128 0 / 0%)'
                        : 'background-color:rgb(243 244 246)'}"
                      bind:value={groupToAdd}
                      on:keypress={(event) => {
                        if (event.key === "Enter") {
                          addToTabGroup(tab, groupToAdd);
                        }
                      }}
                    />
                    <!-- dropdown -->
                    <div class="dropdown">
                      <div tabindex="0" role="button">
                        <i
                          style="font-size: 10px;"
                          class="fa-solid fa-gear text-gray-500 ms-2 me-1"
                        ></i>
                      </div>
                      <ul
                        tabindex="0"
                        class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                      >
                        <li><a href="#">Delete</a></li>
                        <li><a href="#">Duplicate</a></li>
                        <li>
                          <!-- sub dropdown -->
                          <details
                            class="dropdown dropdown-right dropdown-hover"
                          >
                            <summary
                              class="m-0 flex items-center justify-between"
                            >
                              <span> Copy to </span>
                            </summary>
                            <ul
                              class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                            >
                              <li><a>Item 1</a></li>
                              <li><a>Item 2</a></li>
                            </ul>
                          </details>
                        </li>

                        <li><a href="#">Rename</a></li>
                        <hr class="border border-gray-400" />
                        <li><a href="#">New</a></li>
                      </ul>
                    </div>
                  {/if}
                  <button
                    style="font-size:12px"
                    class="bg-transparent border-0 px-2"
                    on:click={() => closeTabGroup(tab.id)}
                    ><i class="fa-solid fa-times text-secondary" /></button
                  >
                </div>
              {/each}
            </div>
          {:else}
            <button
              style="font-size:12px"
              class="bg-transparnet border-0 px-2"
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
        class="nav-item tabActive flex items-center bg-gray-100
         border-end py-0 px-2"
        draggable="true"
        on:dragstart={(e) => handleDragStart(e, tab)}
        on:dragover={(e) => handleDragOver(e)}
        class:active={tab.id === activeTab}
        on:click={() => setActiveTab(tab.id)}
        on:dblclick={() => handleDoubleClick(tab)}
      >
        <a
          style="font-size:13px"
          class="text-decoration-none flex items-center p-0 mt-0 d-inline-block text-secondary font600"
          data-bs-toggle="pill"
          href="#"
        >
          <i class="fa-solid fa-folder"></i>&nbsp;
          {#if isEditing[tab.id]}
            <input
              type="text"
              bind:value={tab.name}
              on:input={(e) => (editedName = e.target.value)}
              on:blur={() => handleBlur(tab)}
              on:keypress={(e) => handleKeyPress(e, tab)}
              class="text-decoration-none inline-block border border-green-800 text-gray-600 w-[5vw] py-1 px-1 text-xs tracking-[0.06rem]"
              autofocus
            />
          {:else}
            {tab.name}
          {/if}
        </a>
        <!-- dropdown -->
        <div class="dropdown">
          <div tabindex="0" role="button">
            <i
              style="font-size: 10px;"
              class="fa-solid fa-gear text-gray-500 ms-2 me-1"
            ></i>
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            <li><a href="#">Delete</a></li>
            <li><a href="#">Duplicate</a></li>
            <li>
              <!-- sub dropdown -->
              <details class="dropdown dropdown-right dropdown-hover">
                <summary class="m-0 flex items-center justify-between">
                  <span> Copy to </span>
                </summary>
                <ul
                  class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                >
                  <li><a>Item 1</a></li>
                  <li><a>Item 2</a></li>
                </ul>
              </details>
            </li>

            <li><a href="#">Rename</a></li>
            <hr class="border border-gray-400" />
            <li><a href="#">New</a></li>
          </ul>
        </div>

        {#if activeTab === tab.id}
          <input
            type="text"
            class="form-control py-1 border-0 w-[5vw]"
            placeholder="add.."
            style="font-size: 11px; {activeTab === tab.id
              ? 'background-color:rgb(0 128 0 / 0%)'
              : 'background-color:rgb(243 244 246)'}"
            bind:value={groupToAdd}
            on:keypress={(event) => {
              if (event.key === "Enter") {
                addToTabGroup(tab, groupToAdd);
              }
            }}
          />
          <!-- dropdown -->
          <div class="dropdown">
            <div tabindex="0" role="button">
              <i
                style="font-size: 10px;"
                class="fa-solid fa-gear text-gray-500 ms-2 me-1"
              ></i>
            </div>
            <ul
              tabindex="0"
              class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li><a href="#">Delete</a></li>
              <li><a href="#">Duplicate</a></li>
              <li>
                <!-- sub dropdown -->
                <details class="dropdown dropdown-right dropdown-hover">
                  <summary class="m-0 flex items-center justify-between">
                    <span> Copy to </span>
                  </summary>
                  <ul
                    class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                  >
                    <li><a>Item 1</a></li>
                    <li><a>Item 2</a></li>
                  </ul>
                </details>
              </li>

              <li><a href="#">Rename</a></li>
              <hr class="border border-gray-400" />
              <li class="mt-2">
                <input
                  type="text"
                  class="w-full border py-1.5 border-gray-100 text-xs ps-2 tracking-[0.06rem]"
                  placeholder="add.."
                />
              </li>
            </ul>
          </div>
        {/if}
        <button
          style="font-size:11px"
          class="bg-transparent border-0 px-2"
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
        class="bg-transparent border-0 px-1"
        style="font-weight: 600;font-size:15px"
        ><i class="fa-solid fa-plus text-secondary" /></button
      >
    </li>
  </ul>

  <div>
    {#if tabGroups.length > 0}
      {#each tabGroups as group}
        {#each group.tabs as tab}
          <div>
            {#if tab.id === activeTab && group.id === activeGroup}
              <div class="mt-3">
                <h5 class="ms-3">{tab.name}</h5>
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
                      Documents
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
                      <div class="border p-2">Aggregations</div>
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
                      Schema
                    </div>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        {/each}{/each}
    {/if}

    <!-- simple tabs content -->
    {#each tabs as tab}
      <div>
        {#if tab.id === activeTab}
          <div class="row border-bottom mt-1 pb-2">
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
            <h5 class="ms-3">{tab.name}</h5>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .row {
    --bs-gutter-x: 0rem;
  }
  button:focus,
  input:focus {
    box-shadow: none;
  }

  .font600 {
    font-weight: 600;
  }

  .tabInGroup.active {
    color: black !important;
    background-color: #00800036 !important;
  }
  .tabActive.active {
    background-color: #00800036 !important;
    color: black !important;
  }
  .group.active {
    background-color: #0080001c !important;
  }

  .queryTabs .nav-item .active {
    border-bottom: 4px solid green;
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
</style>

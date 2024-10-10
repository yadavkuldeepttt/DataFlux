<script>
  import { editorData, repo } from "../../../apiData/global";
  import OutlineSection from "../star/outlineSection.svelte";
  import TreeView from "../star/treeView.svelte";
  // handle repo information function
  let repoInfo;
  let isCollapsedInfo = true; // State to manage the collapse/expand of the info
  let activeBranch = "main"; // The current active branch
  let selectedFile = "tab-1";
  let selectedFileForThirdCol = null;

  // switch file tabs
  function switchFile(id, file) {
    let newTab;
    if (file) {
      selectedFileOutline = file;
      // new tab
      let newTabId = generateUniqueId();
      newTab = {
        id: newTabId,
        tabId: file.name,
        content: {
          id: file.id,
          type: file.type,
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

  // get info of repos from children component
  function handleInfo(event) {
    isCollapsedInfo = false;
    const repId = event.detail.id;
    repoInfo = repo.find((r) => r.id === repId);
    console.log(repoInfo, "repoInfo");
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
</script>

<section class="">
  <div class="border row border-gray-200 flex">
      
      <!-- side menu - left col -->
    <div class="w-[20vw] border-r-4  border-gray-400 bg-gray-100 file-list">
      <!-- Resizing handle -->
      <div class="text-end mt-0 mx-3">
        <i class="bi bi-list" />
      </div>
      <div class="flex flex-col justify-between h-[96vh]">
        <div>
          <!-- tasks section -->
          <ul class="list-style-none">
            <li
              class=" ps-2 py-1 cursor-pointer border-b border-gray-200"
              style="font-size:11px"
            >
              <span class="tracking-[0.07rem]"> Tasks Section </span>
            </li>
          </ul>
          <!-- tree view repos folders files -->
          <TreeView {repo} on:handleInfo={handleInfo} />
        </div>
        <div class="">
          <!-- accordion -->
          <div>
            <div class="file-outline bg-gray-100 border-b border-gray-400">
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
              <div class="info-content bg-gray-50 overflow-auto h-[30vh] p-2">
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
                      git clone https://github.com/user/{repoInfo.objDetails
                        .repoName}.git
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
          <OutlineSection />
          <!-- {/if}  -->
        </div>
      </div>
    </div>

    <!--  middle column -->
    <div class="col middle-col" data-testid="codeArea">
      <!--nav tabs  -->
      <div
        on:drop={(event) => handleDrop(event)}
        on:dragover={(event) => handleDragOver(event)}
        class=" flex justify-between items-center border-b border-gray-200"
      >
        <div class="flex">
          <ul
            data-testid="tabList"
            style="font-size: 14px;position:relative"
            class=" w-full nav nav-pills list-style-none overflow-hidden"
            id="pills-tab"
            role="tablist"
          >
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
                    ><i class="fa-solid fa-times text-gray-500" /></button
                  >
                </li>
              {/each}
            {/each}
          </ul>
          <span
            on:click={addNewTab}
            style="font-size:11px"
            class=" py-2 px-2 bg-gray-100 border-e border-gray-200 rounded-0"
            ><i class="fa-solid fa-plus font-semibold text-gray-500" /></span
          >
        </div>

        <!-- middle content buttons such as share,save,autoSave etc. -->
        <div class="flex items-center gap-2">
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
          <button
            class="border border-gray-200 py-1 px-2 bg-gray-50 text-xs tracking-[0.05rem] rounded-md"
          >
            Save all
          </button>
          <select
            name=""
            id=""
            class="border-0 outline-0 mx-2 p-1 bg-green-600 text-white"
            style=" font-size:10px;opacity:0.7;"
          >
          </select>
        </div>
      </div>
      <div class="row overflow-auto h-[100vh] scrollMiddleContent pb-5">
        <!-- tabs content -->
        <div class="col bg-gray-100 p-2">
          <div>
            {#each editorData.files as files (files.name)}
              {#each files.tabs as tab (tab.id)}
                {#if selectedFile === tab.id}
                  <div>
                    <div>Home</div>
                  </div>
                {/if}
              {/each}
            {/each}
          </div>
        </div>
      </div>
    </div>

    
    <!--right col  -->
    <div class="border-l-4 border-gray-400 third-col bg-gray-100">
      <div
        on:drop={(event) => handleDropinThirdCol(event)}
        on:dragover={(event) => handleDragOver(event)}
        class="row bg-green-100"
        style="overflow:auto"
      >
        <div class="col d-flex align-items-center">
          <div class="py-2 px-3">
            <i class="bi bi-list" />
          </div>
          <div>
            <ul class=" w-full nav nav-pills list-style-none">
              {#each editorData.reviewFiles as files (files.name)}
                {#each files.tabs as tab (tab.id)}
                  <li
                    draggable="true"
                    on:dragstart={(event) => handleDragStartRe(event, tab)}
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

     

      <div class="mt-2 overflow-auto h-[100vh] pb-5">
        {#each editorData.reviewFiles as files (files.name)}
          {#each files.tabs as tab (tab.id)}
            {#if selectedFileForThirdCol === tab.id}
              <div>
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
                    <button class="btn btn-secondary" style="font-size: 14px;"
                      ><i class="bi bi-copy" />&nbsp;Copy to Clipboard</button
                    >
                  </div>
                </div>
              </div>
            {/if}
          {/each}
        {/each}
      </div>
    </div>
  </div>
</section>

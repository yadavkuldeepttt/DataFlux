<script>
  import { createEventDispatcher, onMount } from "svelte";
  import Folder from "./nestedFolder.svelte";
  export let folder;
  export let switchFile; // Accept the switchFile function as a prop


  let openFolder = null;

  let dispatch = createEventDispatcher();

  function toggleFolder(id) {
    openFolder = openFolder === id ? null : id;
  }

  let editingFile = {};
  let editingFolder = {};

  function handleEditFile(folderId, fileId) {
    editingFile[(folderId, fileId)] = true;
  }

  function handleEditFolder(folderId) {
    editingFolder[folderId] = true;
  }

  function handleSaveEditedFile(folderId, fileId) {
    editingFile[(folderId, fileId)] = false;
  }

  function handleSaveEditedFolder(folderId) {
    editingFolder[folderId] = false;
  }

  // dispatch add folder
  function addFolder(id) {
    dispatch("addFolder", { folderId: id });
  }

  //  dispatch delete folder
  function deleteFolder(id) {
    dispatch("deleteFolder", { folderId: id });
  }

  // dispatch  add file
  function addFile(id) {
    dispatch("addFile", { folderId: id });
  }

  //   delete file
  function deleteFile(folderId, fileId) {
    dispatch("deleteFile", { folderId: folderId, fileId: fileId });
  }

  //   add duplicate file
  let newFile;
  function handleDuplicateFile(folderId, fileId) {
    const file = folder.ch.find((f) => f.id === fileId);
    if (file) {
      console.log("entered");

      // Create a new unique ID for the duplicated file
      const newFileId = `file-${Date.now()}`;
      const newFileName = `${file.name} - Copy`;

      // Create a new file object with the new ID and name
      newFile = {
        ...file,
        id: newFileId,
        name: newFileName,
      };

      // Dispatch an event to add the new file to the folder
      dispatch("addFile", { folderId, newFile });
    }
  }
</script>

<!-- Folder Display -->
<div>
  <!-- Folder -->
  <div class="flex items-center justify-between mt-0">
    <button
      class="w-full text-left text-gray-600 hover:text-gray-900"
      on:click={() => toggleFolder(folder.id)}
    >
      <div class="flex items-center gap-2">
        <i
          style="font-size: 8px;"
          class="fa-solid {openFolder === folder.id
            ? 'fa-chevron-down'
            : 'fa-chevron-right'}"
        ></i>
        <div class="flex items-center gap-1">
          <svg
            class="w-4 h-4 text-gray-500 dark:text-white"
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
              d="M13.5 8H4m0-2v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-5.032a1 1 0 0 1-.768-.36l-1.9-2.28a1 1 0 0 0-.768-.36H5a1 1 0 0 0-1 1Z"
            />
          </svg>
          {#if editingFolder[folder.id]}
            <input
              type="text"
              bind:value={folder.objDetails.name}
              on:blur={() => handleSaveEditedFolder(folder.id)}
              on:keyup={(e) =>
                e.key === "Enter" && handleSaveEditedFolder(folder.id)}
              class="text-xs border rounded p-1"
              autofocus
            />
          {:else}
            <span class="tracking-[0.05rem] text-xs">
              {folder.objDetails.name}
            </span>
          {/if}
        </div>
      </div>
    </button>

    <!-- Dropdown Menu for Folder Actions -->
    <div class="dropdown dropdown-end">
      <div tabindex="0" role="button" class=" text-gray-500 mx-1">
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
        <li><a on:click={() => addFolder(folder.id)}>Add Folder</a></li>
        <li><a on:click={() => addFile(folder.id)}>Add File</a></li>
        <li><a on:click={() => deleteFolder(folder.id)}>Delete Folder</a></li>
        <li><a on:click={() => handleEditFolder(folder.id)}>Edit</a></li>
        <li>
          <a on:click={() => handleDuplicateFolder(folder.id)}>Duplicate</a>
        </li>

        <li><a>Info</a></li>
      </ul>
    </div>
  </div>

  <!-- Folder Content (Subfolders and Files) -->
  {#if openFolder === folder.id}
    <div class="ml-1 border-l border-gray-200 pl-4">
      <!-- Loop through Subfolders -->
      {#if folder.subFolders.length > 0}
        {#each folder.subFolders as subFolder (subFolder.id)}
          <div class="sub-folder">
            <!-- Recursive Folder Component for Subfolders -->
            <Folder
              folder={subFolder}
              {switchFile}
              on:addFolder={(e) =>
                dispatch("addFolder", { folderId: subFolder.id })}
              on:deleteFolder={(e) =>
                dispatch("deleteFolder", { folderId: subFolder.id })}
              on:addFile={(e) =>
                dispatch("addFile", {
                  folderId: subFolder.id,
                  newFile: e.detail.newFile,
                })}
              on:deleteFile={(e) =>
                dispatch("deleteFile", {
                  folderId: e.detail.folderId,
                  fileId: e.detail.fileId,
                })}
            />
          </div>
        {/each}
      {/if}

      <!-- Loop through Files -->
      {#if folder.ch.length > 0}
        {#each folder.ch as file (file.id)}
          <div
            class="flex items-center justify-between mt-0.5 {folder.subFolders
              .length > 0
              ? 'ps-[0.8rem]'
              : ''}"
          >
            <button
              class="w-full text-left text-gray-500 hover:text-gray-700"
              on:click={() => switchFile(file.id, file)}
            >
              <div class="flex items-center gap-1">
                {#if file.type === "code"}
                  <!-- Code icon -->
                  <svg
                    class="w-4 h-4 text-gray-500 dark:text-white"
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
                {:else if file.type === "file"}
                  <!-- File icon -->
                  <svg
                    class="w-4 h-3.5 text-gray-500 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
                    />
                  </svg>
                {/if}
                {#if editingFile[(folder.id, file.id)]}
                  <input
                    type="text"
                    bind:value={file.name}
                    on:blur={() => handleSaveEditedFile(folder.id, file.id)}
                    on:keyup={(e) =>
                      e.key === "Enter" &&
                      handleSaveEditedFile(folder.id, file.id)}
                    class="text-xs border rounded p-1"
                    autofocus
                  />
                {:else}
                  <span class="text-xs tracking-[0.07rem]">
                    {file.name}
                  </span>
                {/if}
              </div>
            </button>

            <div class="flex items-center gap-1">
              {#if file.status === "Modified"}
                <span
                  style="font-size: 8px;font-weight:600"
                  class="bg-red-500 rounded-circle text-dark pt-1 py-0.5 px-1.5 ml-1"
                  title="Modified">M</span
                >
              {:else if file.status === "Committed"}
                <span
                  style="font-size: 8px;font-weight:600"
                  class="bg-green-500 rounded-circle text-dark pt-1 py-0.5 px-1.5 ml-1"
                  title="Committed">c</span
                >
              {:else if file.status === "Untracked"}
                <span
                  style="font-size: 8px;font-weight:600"
                  class="bg-yellow-500 rounded-circle text-dark pt-1 py-0.5 px-1.5 ml-1"
                  title="Untracked">U</span
                >
              {/if}
              <!-- Dropdown Menu for File Actions -->
              <div class="dropdown dropdown-end">
                <div tabindex="0" role="button" class=" text-gray-500 mx-1">
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
                  <li>
                    <a on:click={() => deleteFile(folder.id, file.id)}
                      >Delete File</a
                    >
                  </li>
                  <li>
                    <a on:click={() => handleEditFile(folder.id, file.id)}
                      >Edit</a
                    >
                  </li>
                  <li>
                    <a on:click={() => handleDuplicateFile(folder.id, file.id)}
                      >Duplicate</a
                    >
                  </li>

                  <li><a>Info</a></li>
                </ul>
              </div>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>

<style>
</style>

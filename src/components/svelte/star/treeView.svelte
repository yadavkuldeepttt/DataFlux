<script>
  import { createEventDispatcher } from "svelte";
  import Folder from "./nestedFolder.svelte"; // Import the Folder component

  export let repoContent;
  export let switchFile;


  const dispatch = createEventDispatcher();
  
  let repo = repoContent;

  let openRepo = null;

   
  // handle repo indo 
    function handleInfo(id) {
      dispatch('handleInfo', { id });
    }

    // handle branch graph
    function handleBranchGraph(id) {
      dispatch('handleBranchGraph', { id });
    }


    //toggle repo
  function toggleRepo(id) {
    openRepo = openRepo === id ? null : id;
  }

  // add folder in repo
  function addFolderInRepo(repoId) {
    // Logic to add a new folder in repo

    // Generate a unique ID using the current timestamp
    const uniqueId = `folder${Date.now()}`;

    const rep = repo.find((r) => r.id === repoId);

    const newFolder = {
      id: uniqueId,
      objDetails: {
        name: "repoFolder2",
      },
      subFolders: [],
      ch: [],
    };

    rep.folders.push(newFolder);
    repo = [...repo];
  }

  // delete repo
  function deleteRepo(repoId) {
    // Find the index of the repo to delete
    const repoIndex = repo.findIndex((r) => r.id === repoId);

    // If found, remove the repository
    if (repoIndex !== -1) {
      repo.splice(repoIndex, 1);
      repo = [...repo]; // Trigger reactivity
    }
  }

  // add sub folder in repo
  function addSubFolderInFolder(repoId, folderId) {
    // Similar logic to add a folder to a specific folder in the repo
    const uniqueId = `subFolder${Date.now()}`;
    const rep = repo.find((r) => r.id === repoId);
    const folder = findFolder(rep.folders, folderId);

    const newSubFolder = {
      id: uniqueId,
      objDetails: { name: "subFolder" },
      subFolders: [],
      ch: [],
    };

    folder.subFolders.push(newSubFolder);
    repo = [...repo];
  }

// Delete folder logic
function deleteFolder(repoId, folderId) {
  const rep = repo.find((r) => r.id === repoId);

  if (!rep) {
    console.log(`Repository with id ${repoId} not found.`);
    return;
  }

  // Find the folder and its parent folder
  const { folder, parent } = findFolderAndParent(rep.folders, folderId) || {};

  if (!folder) {
    console.log(`Folder with id ${folderId} not found.`);
    return;
  }

  // If parent is null, we are deleting a top-level folder
  if (parent === null) {
    rep.folders = rep.folders.filter((f) => f.id !== folderId);
  } else {
    // Remove the folder from the parent's subFolders
    parent.subFolders = parent.subFolders.filter((f) => f.id !== folderId);
  }

  // Trigger reactivity by creating a new array
  repo = [...repo];
  console.log(`Folder with id ${folderId} deleted.`);
}

  // Helper function to find the folder and its parent folder
function findFolderAndParent(folders, folderId, parent = null) {
  for (let folder of folders) {
    if (folder.id === folderId) {
      return { folder, parent };
    }
    if (folder.subFolders.length > 0) {
      const result = findFolderAndParent(folder.subFolders, folderId, folder);
      if (result) {
        return result;
      }
    }
  }
  return null; // Folder not found
}


  //   add file 
  function addFile(repoId, folderId,newFile) {
    
    const rep = repo.find((r) => r.id === repoId);
    const folder = findFolder(rep.folders, folderId);

    if(newFile){
    
        if (folder.subFolders.length > 0 && folderId === "subFolder1") {
        folder.subFolders[0].ch.push(newFile);
    } else {
        folder.ch.push(newFile);
        
    }
    repo = [...repo];
    }else{
        // Generate a unique ID for the new file
        const uniqueFileId = `file${Date.now()}`;
        const newFile = {
        id: uniqueFileId,
        name: "New File",
        type: "code",
        docs: "",
        code: "",
        allDocs: [],
        logSchema: [],
        schema: [],
        example: [],
        };
    if (folder.subFolders.length > 0 && folderId === "subFolder1") {
        folder.subFolders[0].ch.push(newFile);
    } else {
        folder.ch.push(newFile);
    }
    repo = [...repo];
}
  }

  //   delete file
  function deleteFile(repoId, folderId, fileId) {
    const rep = repo.find((r) => r.id === repoId);
    const folder = findFolder(rep.folders, folderId);

    if (folder) {
      const fileIndex = folder.ch.findIndex((file) => file.id === fileId);
      if (fileIndex !== -1) {
        folder.ch.splice(fileIndex, 1);
        repo = [...repo]; // Trigger reactivity
      }
    }
  }

  //   find folder for file folder adding or deleting
  function findFolder(folders, folderId) {
    let result = null;

    function search(folders) {
      for (const folder of folders) {
        if (folder.id === folderId) {
          result = folder;
          return;
        }
        if (folder.subFolders.length > 0) {
          search(folder.subFolders);
        }
      }
    }

    search(folders);
    return result;
  }

 

let searchTerm = ""; // Search term from the input
  let filteredRepo = [...repoContent];

// Function to filter repos, folders, subfolders, and files
function filterRepos() {
  if (!searchTerm) {
    filteredRepo = [...repo]; // Show all if no search term
    return;
  }

  console.log(repo, "repo");

  filteredRepo = repo.filter((r) => {
    // Check if the repo name matches the search term
    const repoNameMatch = r.objDetails.repoName.includes(searchTerm);

    // Recursively check for a match in folders, subfolders, and files
    const folderMatch = r.folders.some((folder) => checkFolderAndSubFolders(folder));

    // Return true if either the repo name or any folder, subfolder, or file matches
    return repoNameMatch || folderMatch;
  });

  console.log(filteredRepo, "filtered");
}

// Helper function to check folders, subfolders, and files
function checkFolderAndSubFolders(folder) {
  // Check if the folder name matches the search term
  const folderNameMatch = folder.objDetails.name.includes(searchTerm);

  // Check if any subfolder matches
  const subFolderMatch = folder.subFolders.some((subFolder) => checkFolderAndSubFolders(subFolder));

  // Check if any file within this folder matches
  const fileMatch = folder.ch.some((file) => file.name.includes(searchTerm));

  // Return true if the folder name, any subfolder, or any file matches
  return folderNameMatch || subFolderMatch || fileMatch;
}

  // add new branch
  let newBranch=false;
  let newBranchName = '';
  let currentRepoId = null;

  function handleNewBranch(repId){
    newBranch=true;
    currentRepoId =repId;
  }

 // Function to add a new branch when Enter is pressed
 function addNewBranch(event) {
    if (event.key === 'Enter' && newBranchName.trim() !== '') {

      const currentRepo = repo.find((r)=>r.id === currentRepoId);

      const newBranchObject = {
        id: currentRepo.branches.length + 1,
        objDetails: {
          branchName:newBranchName,
        },
        commits: [],
    
      };

      if(currentRepo && currentRepo.branches){
        currentRepo.branches.push(newBranchObject);
        currentRepo.objDetails.repoBranch.push(newBranchObject.objDetails.branchName);
      }

      repo = [...repo];

      newBranch = false; // Hide the input field
      newBranchName = ''; // Clear the input field
    }
  }
</script>


<section>
  <!-- search input -->
  <div class="">
    <input type="search" name=""   bind:value={searchTerm} on:input={filterRepos} placeholder="add new branch " class="w-full py-0 rounded-md border-b bg-gray-50 border-gray-200 px-2 tracking-[0.06rem] focus:outline-none focus:shadow-none" style="font-size: 11px;" id="">  
  </div>

  <!-- repo files and folders -->
<div class="p-1">

  {#each filteredRepo as rep (rep.id)}
    <div class="ml-0">
      <!-- Repo Name -->
      <div class="flex items-center justify-between ">
        <button
          style="font-weight:500"
          class="text-xs tracking-[0.06rem] text-gray-800 bg-gray-200 px-2 py-0 rounded-lg w-full text-left"
          on:click={() => toggleRepo(rep.id)}
        >
          <div class="flex items-center gap-2">
            <i
              style="font-size: 8px;"
              class="fa-solid {openRepo === rep.id
                ? 'fa-chevron-down'
                : 'fa-chevron-right'} "
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
              <span class="tracking-[0.05rem]">
                {rep.objDetails.repoName}
              </span>
            </div>
          </div>
        </button>

        <!-- Dropdown Menu -->
        <div class="dropdown dropdown-end ">
          <div
            tabindex="0"
            role="button"
            class=" text-gray-500 mx-1"
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
            <li><a on:click={() => addFolderInRepo(rep.id)}>Add Folder</a></li>
            <li><a on:click={() => deleteRepo(rep.id)}>Delete Repo</a></li>
            <li><a on:click={() => handleInfo(rep.id)}>Info</a></li>
            <li><a on:click={() => handleNewBranch(rep.id)}>New Branch</a></li>
            <li><a on:click={() => handleBranchGraph(rep.id)}>Branch Graph</a></li>
            
            
            
            <!-- <li><a on:click={() => document.getElementById(`modal-${rep.id}`).showModal()}>Info</a></li> -->
        </ul>
        </div>
      </div>


      <!-- Folders -->
      {#if openRepo === rep.id}
        <div class="ml-3 mt-0 border-l border-gray-200 pl-4">
          {#each rep.folders as folder (folder.id)}
            <Folder
              {folder}
           
              on:addFile={(event) => addFile(rep.id, event.detail.folderId,event.detail.newFile)}
              on:deleteFile={(event) =>
                deleteFile(rep.id, event.detail.folderId, event.detail.fileId)}
              on:addFolder={(event) =>
                addSubFolderInFolder(rep.id, event.detail.folderId)}
              on:deleteFolder={(event) =>
                deleteFolder(rep.id, event.detail.folderId)}
              {switchFile}
            />
          {/each}
        </div>
      {/if}
    </div>
  {/each}

  <!-- New Branch Input -->
  {#if newBranch}
    <input 
      type="text" 
      bind:value={newBranchName} 
      placeholder="Enter new branch name..." 
      class="w-full py-2 mt-2 rounded-md border bg-gray-50 px-2 text-xs tracking-[0.06rem] focus:outline-none focus:ring focus:ring-blue-300"
      on:keydown={addNewBranch} 
    />
  {/if}
</div>
</section>

<style>
  .btn {
    min-height: 1.4rem !important;
    height: 1rem !important;
  }
</style>

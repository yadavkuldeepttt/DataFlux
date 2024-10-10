<script>
  import ApiSection from "./apiSection.svelte";
  import { apiProjects } from "../../../apiData/apiProjects.js";
  
  // for handling api view
  let apiSection = {};

  // variable for hiding sidemenu on middle screens 
  export let activeSideMenuList;

  // Store to keep track of the teams
  let teams = ["Personal Team"];
  let activeTeam = "Personal Team";
  let activeProjectType = "HTTP";
  let newTeamName = "";
  let projectName = "";
  let projectType = "HTTP";
  let projectLanguage = "English";
  let includingExamples = false;
  let projects = [...apiProjects];
  let projectID = "";

  // array of filtered projects
  let apiSectionProjects = [];

  // handle sidemenu subitems collapse
  function handleSideMenuCollapse() {
    const menu = document.getElementById("sidemenu_collapse");
    menu.classList.toggle("hidden");
  }

  // Function to create a new team
  function createTeam() {
    if (newTeamName.trim() !== "") {
      teams = [...teams, newTeamName];
      newTeamName = "";
    } else {
      alert("Please enter a team name");
    }
  }
  // Function to set the active team
  function setActiveTeam(team) {
    activeTeam = team;
  }

  // function to create new project
  function createProject() {
    projects = [
      ...projects,
      {
        id: (projects.length + 1).toString(),
        objDetails: {
          name: projectName,
          type: projectType,
          language: projectLanguage,
          includingExamples: includingExamples,

          icon:
            projectType === "HTTP"
              ? "https://assets.apidog.com/app/project-icon/builtin/15.jpg"
              : "https://path-to-grpc-icon.jpg",
        },
      },
    ];
    // Reset form fields
    projectName = "";
    projectType = "HTTP";
    projectLanguage = "English";
    includingExamples = false;

    console.log(projects);
    // Close the modal
    closeModal();
  }
  // show modal for new project add
  function showModal() {
    document.getElementById("my_modal_27").style.display = "inline-block";
  }

  // close modal for new project add
  function closeModal() {
    document.getElementById("my_modal_27").style.display = "none";
  }

  // set  project type active
  function setActiveProjectType(type) {
    projectType = type;
    activeProjectType = type;
  }

  // function to handle opening of the particular project
  function handleOpenProject(projectId) {
    apiSection[projectId] = true;
    projectID = projectId;
    apiSectionProjects = projects.filter((project) => project.id === projectId);
  }
</script>

<!-- api section -->
{#if apiSection[projectID]}
  <ApiSection {apiSectionProjects} />
{:else}
  <!-- project section start -->
  <!-- sidebar -->
  <aside
    class="h-screen"
  >
    <div
      class="h-full  {activeSideMenuList ? "md:w-[20vw]" : "md:w-[22vw]"} w-[17vw] sidebar-multi  lg:px-2 md:px-1 py-3 overflow-y-auto bg-base-50 border-r dark:bg-gray-800"
    >
      <ul class="space-y-2 font-medium">
        <li>
          <button
            type="button"
            on:click={handleSideMenuCollapse}
            class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            aria-controls="sidemenu_collapse"
            data-collapse-toggle="sidemenu_collapse"
          >
            <svg
              class="flex-shrink-0 w-4 h-4 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path
                d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"
              />
            </svg>
            <span
              class="flex-1 tracking-[0.05rem] text-sm xl:ms-3 lg:ms-1  text-left rtl:text-right whitespace-nowrap"
              >My Teams</span
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
          <ul id="sidemenu_collapse" class="hidden py-2 space-y-2">
            {#each teams as team}
              <li on:click={() => setActiveTeam(team)}>
                <a
                  href="#"
                  class="flex tracking-[0.05rem] text-sm items-center w-full py-2 ps-5 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 {team ===
                  activeTeam
                    ? 'bg-gray-100'
                    : ''}">{team}</a
                >
              </li>
            {/each}
            <li
              class="hover:bg-gray-100 text-sm py-2 ps-5 cursor-pointer tracking-[0.05rem]"
            >
              <a href="#my_modal_22" class="decoration-none">
                <i class="fa-solid text-sm text-gray-500 fa-plus"></i>&nbsp; New
                Team
              </a>
            </li>
          </ul>
        </li>
        <li>
          <a
            href="#"
            class="flex tracking-[0.05rem] text-sm items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
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
                d="M10 3v4a1 1 0 0 1-1 1H5m4 10v-2m3 2v-6m3 6v-3m4-11v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
              />
            </svg>

            <span class="flex-1 xl:ms-3 lg:ms-1  whitespace-nowrap">Api Hub</span>
            <span class="text-gray-300 text-xs ms-1">Explore more</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex tracking-[0.05rem] items-center text-sm p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
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
                stroke-width="2"
                d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z"
              />
            </svg>

            <span class="flex-1 xl:ms-3 lg:ms-1  text-sm whitespace-nowrap"
              >My Favorites</span
            >
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex tracking-[0.05rem] items-center text-sm p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
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
                d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>

            <span class="flex-1 text-sm xl:ms-3 lg:ms-1  whitespace-nowrap"
              >Recently Visited</span
            >
          </a>
        </li>
      </ul>
    </div>
  </aside>

  <!-- modals start-->
  <div class="modal" role="dialog" id="my_modal_22">
    <div class="modal-box w-[30vw]">
      <div class="modal-action py-0 my-0">
        <a href="#" class=""
          ><i class="fa-solid fa-times text-gray-500 cursor-pointer"></i></a
        >
      </div>
      <div class="flex justify-center flex-col items-center">
        <h3
          class="font-bold text-xl mt-2 text-center tracking-[0.05rem] text-gray-600"
        >
          New Team
        </h3>
        <input
          type="text"
          placeholder="Team Name"
          bind:value={newTeamName}
          class="input input-bordered text-center placeholder:text-sm placeholder:text-gray-400 tracking-[0.05rem] my-4 input-primary w-full max-w-xs"
        />
        <button
          on:click={createTeam}
          type="button"
          class="focus:outline-none text-white bg-purple-400 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 w-[23.3vw] font-semibold rounded-lg text-sm px-5 py-2.5 my-4 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
          >Create</button
        >
      </div>
    </div>
  </div>
  <div class="modal" role="dialog" id="my_modal_23">
    <div class="modal-box w-[30vw]">
      <div class="modal-action py-0 my-0">
        <a href="#" class="btn"><i class="fa-solid fa-times"></i></a>
      </div>
      <div class="flex justify-between items-center">
        <span class="tracking-[0.05rem] text-sm font-medium">Edit Team</span>
      </div>

      <div class="flex justify-center flex-col items-center">
        <div class="w-full">
          <label
            for=""
            class="font-medium mt-4 text-gray-600 tracking-[0.05rem]"
            >My Team *</label
          >
          <input
            type="text"
            placeholder="Team Name"
            bind:value={activeTeam}
            class="input mt-1 text-xs input-bordered placeholder:text-sm placeholder:text-gray-400 tracking-[0.05rem] my-4 input-primary w-full"
          />
        </div>
        <div class="text-end w-full">
          <button
            type="button"
            class="focus:outline-none text-white bg-purple-400 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-semibold rounded-lg text-sm px-3 py-2 my-4 mx-2 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            >Save</button
          >
        </div>
      </div>
    </div>
  </div>
  <div class="modal" role="dialog" id="my_modal_24">
    <div class="modal-box w-[30vw]">
      <div class="modal-action py-0 my-0">
        <a href="#" class="btn"><i class="fa-solid fa-times"></i></a>
      </div>
      <div class="flex justify-between items-center">
        <span class="tracking-[0.05rem] text-sm font-medium">Edit Nickname</span
        >
      </div>

      <div class="flex justify-center flex-col items-center">
        <div class="w-full">
          <label
            for=""
            class="font-medium mt-4 text-gray-600 tracking-[0.05rem]"
            >My Nickname *</label
          >
          <input
            type="text"
            placeholder="Team Name"
            bind:value={activeTeam}
            class="input mt-1 text-xs input-bordered placeholder:text-sm placeholder:text-gray-400 tracking-[0.05rem] my-4 input-primary w-full"
          />
        </div>
        <div class="text-end w-full">
          <button
            type="button"
            class="focus:outline-none text-white bg-purple-400 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-semibold rounded-lg text-sm px-3 py-2 my-4 mx-2 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            >Save</button
          >
        </div>
      </div>
    </div>
  </div>
  <div class="modal" role="dialog" id="my_modal_25">
    <div class="modal-box w-[30vw]">
      <div class="modal-action py-0 my-0">
        <a href="#" class="btn"><i class="fa-solid fa-times"></i></a>
      </div>
      <div class="flex justify-between items-center">
        <span class="tracking-[0.05rem] text-sm font-medium">Transfer Team</span
        >
      </div>

      <div class="flex justify-center flex-col items-center">
        <div class="w-full">
          <label
            for=""
            class="font-medium mt-4 text-gray-600 tracking-[0.05rem]"
            >Owner</label
          >
          <input
            type="text"
            placeholder="Team Name"
            bind:value={activeTeam}
            class="input mt-1 text-xs input-bordered placeholder:text-sm placeholder:text-gray-400 tracking-[0.05rem] my-4 input-primary w-full"
          />
        </div>
        <div class="text-end w-full">
          <button
            type="button"
            class="focus:outline-none text-white bg-purple-400 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-semibold rounded-lg text-sm px-3 py-2 my-4 mx-2 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            >Save</button
          >
        </div>
      </div>
    </div>
  </div>
  <div class="modal" role="dialog" id="my_modal_26">
    <div class="modal-box w-[30vw]">
      <div class="modal-action py-0 my-0">
        <a href="#" class="btn"><i class="fa-solid fa-times"></i></a>
      </div>
      <div class="flex justify-between items-center">
        <span class="tracking-[0.05rem] text-sm font-medium">Dismiss Team?</span
        >
      </div>

      <div class="flex justify-center flex-col items-center">
        <div class="w-full">
          <div class="text-xs py-2 text-gray-300 mt-2 tracking-[0.05rem]">
            This action cannot be undone. After the Abc team is dismissed, all
            projects under the team will be deleted simultaneously!
          </div>
          <label
            for=""
            class="font-medium mt-2 text-gray-600 tracking-[0.05rem]"
            >Enter team name to confirm</label
          >
          <input
            type="text"
            placeholder="Team Name"
            bind:value={activeTeam}
            class="input mt-1 text-xs input-bordered placeholder:text-sm placeholder:text-gray-400 tracking-[0.05rem] my-4 input-primary w-full"
          />
        </div>
        <div class="text-end w-full">
          <button
            type="button"
            class="focus:outline-none text-white bg-purple-400 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-semibold rounded-lg text-sm px-3 py-2 my-4 mx-2 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            >Save</button
          >
        </div>
      </div>
    </div>
  </div>
  <div class="modal" role="dialog" id="my_modal_27">
    <div class="flex justify-center items-center h-full">
      <div class="modal-box w-[52vw] max-w-[100vw] p-0 m-0">
        <div class="flex">
          <div class="w-[20vw] bg-gray-50 p-3 flex justify-center items-center">
            <div class="flex flex-col items-center justify-center">
              <span class="text-lg mt-3 inline-block font-medium text-gray-500"
                >Project Type</span
              >
              <div
                on:click={() => setActiveProjectType("HTTP")}
                class="mt-3 rounded-lg cursor-pointer hover:bg-gray-100 flex items-center flex-col gap-3 px-5 py-4 {activeProjectType ===
                'HTTP'
                  ? 'border-2 border-blue-500'
                  : ' border-1 border-gray-300'}"
              >
                <div
                  class="rounded-full w-9 h-9 text-white bg-blue-600 text-sm flex justify-center items-center"
                >
                  <i class="fa-solid fa-code-branch"></i>
                </div>
                <span class="text-lg font-semibold text-blue-600">HTTP</span>
              </div>
              <div
                on:click={() => setActiveProjectType("grPC")}
                class="mt-2 cursor-pointer hover:bg-gray-100 rounded-lg w-[11vw] flex items-center gap-2 px-5 py-2 {activeProjectType ===
                'grPC'
                  ? 'border-2 border-blue-500'
                  : ' border-1 border-gray-300'}"
              >
                <div
                  class="rounded-full w-9 h-9 text-white bg-teal-600 text-xs p-1 flex justify-center items-center"
                >
                  grPC
                </div>
                <span class="text-md font-medium text-gray-700">grPC</span>
              </div>
            </div>
          </div>
          <div class="p-2">
            <div class="absolute right-5">
              <div class="modal-action py-0 my-0">
                <a href="#" class=""><i class="fa-solid fa-times"></i></a>
              </div>
            </div>
            <div class=" mt-4 w-[35vw] flex justify-center">
              <div class="flex flex-col items-center text-center w-full px-5">
                <h2
                  class="text-xl font-semibold text-gray-500 tracking-[0.05rem]"
                >
                  Create a New Project
                </h2>
                <span class="text-xs text-gray-400 tracking-[0.05rem]"
                  >of Personal team</span
                >
                <input
                  type="text"
                  class="form-control my-3 py-1 text-center placeholder:text-sm placeholder:text-gray-400 w-full border-gray-300 rounded-lg"
                  placeholder="Project Name"
                  bind:value={projectName}
                />
                <div class="flex items-center mt-3 self-start gap-2">
                  <input
                    type="checkbox"
                    checked={includingExamples}
                    class="checkbox checkbox-xs checkbox-primary"
                  />
                  <span class="text-sm text-gray-500 tracking-[0.04rem]"
                    >Including Examples</span
                  >
                </div>
                <select
                  bind:value={projectLanguage}
                  class="select mb-4 mt-2 inline-block select-bordered w-full text-gray-600"
                >
                  <option disabled selected>Project Language?</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
                <div class="mt-5 mb-5 pb-5 w-full">
                  <button
                    type="button"
                    on:click={createProject}
                    class="focus:outline-none w-full text-white bg-purple-500 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                    >Create</button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- modals end -->
  <!-- main content -->
  <div class="" >
    <!-- personal team -->
    <div class="pt-4 ps-4">
      <div class="flex items-center">
        <h2 class="text-lg" style="letter-spacing: 0.07rem;">{activeTeam}</h2>
        <div
          class="bg-orange-1 rounded-md ms-2 text-xs px-2 py-1 font-semibold text-orange-7"
          style="color: #c9571b;"
        >
          Team Owner
        </div>
      </div>
      <!-- tabs -->
      <div class="flex justify-between mt-4">
        <div role="tablist" class="tabs tabs-lifted">
          <!-- projects tab -->
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            class="tab bg-base-100 tracking-[0.05rem] checked:bg-gray-100 checked:text-gray-600 checked:font-semibold"
            aria-label="Projects"
            checked
          />
          <div
            role="tabpanel"
            class="tab-content bg-gray-100 border-base-300 rounded-box p-6 w-[74vw] lg:w-[72vw] {activeSideMenuList ? "md:w-[68vw]" : " md:w-[74vw] "}"
          >
            <div class="flex flex-wrap gap-3 items-center" data-testid="projectList">
              {#each projects as project}
                <div
                data-testid={`openSpecificProject${project.id}`}
                  on:click={() => handleOpenProject(project.id)}
                  class="p-3 hover:shadow-lg border-base-300 cursor-pointer bg-gray-50 w-[20vw]"
                >
                  <img
                    src={project.objDetails.icon}
                    alt=""
                    height="30"
                    width="30"
                    class="rounded-md"
                  />
                  <p
                    class="text-xs font-semibold pt-3 text-gray-400"
                    style="letter-spacing: 0.06rem;"
                  >
                    {project.objDetails.name}
                  </p>
                  <p
                    class="mt-4 px-2 bg-gray-100 text-xs text-gray text-gray-400 py-1 w-fit"
                  >
                    {project.objDetails.type}
                  </p>
                </div>
              {/each}
            </div>
            <div class="absolute top-[7rem] right-[2%] md:top-[4rem] md:right-[1%] lg:top-[4rem] lg:right-[1%] flex">
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
                    id="default-search"
                    class="block py-2.5 md:py-2 lg:py-2 pl-10 w-[12vw] md:[10vw] tracking-[0.05rem] text-sm text-gray-900 border-0 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search Mockups, Logos..."
                    required
                  />
                </div>
              </form>
              <button
                type="button"
                class="py-[0.68rem] md:py-[0.5rem] lg:py-[0.5rem] px-2 tracking-[0.05rem] ms-2 mb-2 text-xs font-medium text-gray-600 focus:outline-none bg-white rounded-lg border-t md:border-y lg:border-y border-x border-gray-100 border-b-0 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >Import Project</button
              >
              <button
                type="button"
                on:click={showModal}
                class="py-[0.68rem] md:py-[0.5rem] lg:py-[0.5rem] px-3 md:px-0 tracking-[0.05rem] ms-2 mb-2 text-xs font-medium focus:outline-none text-white bg-purple-500 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 rounded-lg dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
              >
                <a href="#my_modal_27" class="hover:text-white">
                  <i class="fa-solid fa-plus text-xs"></i>&nbsp New Project
                </a>
              </button>
            </div>
          </div>

          <!-- resources tab -->
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            class="tab bg-base-100 tracking-[0.05rem] checked:bg-gray-100 checked:text-gray-600 checked:font-semibold"
            aria-label="Resources"
          />
          <div
            role="tabpanel"
            class="tab-content bg-gray-100 border-base-300 rounded-box p-6 w-[73vw] lg:w-[72vw] {activeSideMenuList ? "md:w-[68vw]" : " md:w-[71vw] "}"
          >
            <div class="flex">
              <div class=" p-2 w-[17vw] bg-gray-50 h-full">
                <ul class="list-style-none max-w-[17vw]" >
                  <li
                    class="text-gray-400 tracking-[0.05rem] text-xs hover:bg-transparent"
                  >
                    Self-hosted Runner
                  </li>
                  <li
                    class="text-gray-600 tracking-[0.05rem] text-xs mt-2 py-2 px-1 hover:bg-gray-100 bg-gray-100 cursor-pointer"
                  >
                    General Runner
                  </li>
                  <li
                    class="text-gray-600 tracking-[0.05rem] text-xs py-2 px-1 hover:bg-gray-100 cursor-pointer"
                  >
                    Load Test Runner
                  </li>
                  <li
                    class="text-gray-400 tracking-[0.05rem] mt-2 text-xs hover:bg-transparent"
                  >
                    Team Public Resource
                  </li>
                  <li
                    class="text-gray-600 text-xs tracking-[0.05rem] mt-2 py-2 px-1 hover:bg-gray-100 cursor-pointer"
                  >
                    Schemas
                  </li>
                  <li
                    class="text-gray-600 text-xs tracking-[0.05rem] py-2 px-1 hover:bg-gray-100 cursor-pointer"
                  >
                    Responses
                  </li>
                  <li
                    class="text-gray-600 text-xs tracking-[0.05rem] py-2 px-1 hover:bg-gray-100 cursor-pointer"
                  >
                    Scripts
                  </li>
                  <li
                    class="text-gray-400 tracking-[0.05rem] mt-2 text-xs hover:bg-transparent"
                  >
                    Team Default Project Settings
                  </li>
                  <li
                    class="text-gray-600 text-xs tracking-[0.05rem] py-2 px-1 hover:bg-gray-100 cursor-pointer"
                  >
                    Api Fields
                  </li>
                  <li
                    class="text-gray-600 text-xs tracking-[0.05rem] py-2 px-1 hover:bg-gray-100 cursor-pointer"
                  >
                    Mock Custom Matching
                  </li>
                  <li
                    class="text-gray-600 text-xs tracking-[0.05rem] py-2 px-1 hover:bg-gray-100 cursor-pointer"
                  >
                    Advanced Settings
                  </li>
                </ul>
              </div>
              <div class="px-3">
                <span
                  class=" font-semibold tracking-[0.05rem] text-gray-600 tracking-[0.05rem]"
                  >General Runner</span
                ><br />
                <span
                  class="mt-2 tracking-[0.05rem] pb-2 border-b w-full inline-block text-xs text-gray-500"
                  >Execute scheduled automated tests, API imports, and mock
                  services via self-hosted runners. Learn more</span
                >
                <div
                  class="border w-[50vw] p-5 mt-3 rounded-lg flex items-center justify-center"
                >
                  <button class="bg-transparent tracking-[0.05rem] text-primary"
                    ><i class="fa-solid text-xs fa-plus"></i>&nbsp; Deploy
                    General Runner</button
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- activities tab -->
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            class="tab bg-base-100 tracking-[0.05rem] checked:bg-gray-100 checked:text-gray-600 checked:font-semibold"
            aria-label="Activities"
          />
          <div
            role="tabpanel"
            class="tab-content bg-gray-100 border-base-300 rounded-box p-6 w-[73vw] lg:w-[72vw] {activeSideMenuList ? "md:w-[68vw]" : " md:w-[71vw] "}"
          >
            Tab content 3
          </div>

          <!--members tab  -->
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            class="tab bg-base-100 tracking-[0.05rem] checked:bg-gray-100 checked:text-gray-600 checked:font-semibold"
            aria-label="Members"
          />
          <div
            role="tabpanel"
            class="tab-content bg-gray-100 border-base-300 rounded-box p-6 w-[73vw] lg:w-[72vw] {activeSideMenuList ? "md:w-[68vw]" : " md:w-[71vw] "}"
          >
            <div class="px-3 py-4 flex justify-evenly items-center bg-gray-50">
              <div class="flex flex-col items-center">
                <span class="text-3xl font-semibold">1</span>
                <span
                  class="font-semibold text-sm tracking-[0.05rem] text-gray-600"
                  >Members</span
                >
              </div>
              <div class="flex flex-col items-center">
                <span class="text-3xl font-semibold">0</span>
                <span
                  class="font-semibold text-sm tracking-[0.05rem] text-gray-600"
                  >Guests <i class="fa-regular text-xs fa-question-circle"
                  ></i></span
                >
              </div>
              <div class="flex flex-col items-center">
                <span class="text-3xl font-semibold">0</span>
                <span
                  class="font-semibold text-sm tracking-[0.05rem] text-gray-600"
                  >Pending Invites</span
                >
              </div>
            </div>
            <div class="mt-2 flex justify-between items-center">
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
                    id="default-search"
                    class="block py-2.5 pl-10 w-[11vw] tracking-[0.05rem] text-sm text-gray-900 border-0 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search"
                    required
                  />
                </div>
              </form>
              <button
                type="button"
                class="focus:outline-none flex items-center gap-1 text-white bg-purple-500 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                ><svg
                  class="w-4 h-4 text-white dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z"
                    clip-rule="evenodd"
                  />
                </svg>
                Invite</button
              >
            </div>
            <div class="my-2">
              <div class="relative overflow-x-auto">
                <table
                  class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                >
                  <thead
                    class="text-xs text-gray-900 uppercase dark:text-gray-400"
                  >
                    <tr>
                      <th scope="col" class="px-6 py-3 border border-gray-300">
                        Name
                      </th>
                      <th scope="col" class="px-6 py-3 border border-gray-300">
                        Email</th
                      >
                      <th scope="col" class="px-6 py-3 border border-gray-300">
                        Team Role
                      </th>
                      <th scope="col" class="px-6 py-3 border border-gray-300">
                        Last Active
                      </th>
                      <th scope="col" class="px-6 py-3 border border-gray-300">
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="bg-white dark:bg-gray-800">
                      <th
                        scope="row"
                        style="border-left: 1px solid rgb(209 213 219)!important;border-bottom: 1px solid  rgb(229 231 235)!important"
                        class="px-4 py-3 flex gap-2 items-center border-0 border-gray-300 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        <div
                          class="rounded-full text-sm text-white bg-orange-500 w-8 h-8 flex items-center justify-center"
                        >
                          J
                        </div>
                        John Doe
                      </th>
                      <td class="px-4 py-3 border border-gray-300">
                        abc123@gmail.com
                      </td>
                      <td class="px-4 py-3 border border-gray-300">
                        <div
                          class="bg-orange-1 rounded-md ms-2 w-fit text-xs px-2 py-1 font-semibold text-orange-7"
                          style="color: #c9571b;"
                        >
                          Team Owner
                        </div></td
                      >
                      <td class="px-4 py-3 border border-gray-300">
                        an hour ago
                      </td>
                      <td class="border border-gray-300 px-4 py-3">
                        <i
                          class="fa-solid fa-gear text-sm hover:bg-gray-100 text-gray-500 p-1 rounded-md"
                        ></i>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- plans tab -->
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            class="tab bg-base-100 tracking-[0.05rem] checked:bg-gray-100 checked:text-gray-600 checked:font-semibold"
            aria-label="Plans"
          />
          <div
            role="tabpanel"
            class="tab-content bg-gray-100 border-base-300 rounded-box p-6 w-[73vw] lg:w-[72vw] {activeSideMenuList ? "md:w-[68vw]" : " md:w-[71vw] "}"
          >
            Tab content 3
          </div>

          <!-- settings tab -->
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            class="tab tracking-[0.05rem] bg-base-100 checked:bg-gray-100"
            aria-label="Settings"
          />
          <div
            role="tabpanel"
            class="tab-content bg-gray-100 border-base-300 rounded-box p-6 w-[73vw] lg:w-[72vw] {activeSideMenuList ? "md:w-[68vw]" : " md:w-[71vw] "}"
          >
            <div class="">
              <span
                class="text-xs tracking-[0.05rem] text-gray-600 font-semibold"
                >General Info</span
              >
              <div
                class="bg-gray-50 mt-2 border border-gray-300 p-2 rounded-md"
              >
                <div class="border-b justify-between items-center flex pb-3">
                  <div class="flex gap-5 items-center">
                    <span class="tracking-[0.05rem] text-sm">Team Name</span>
                    <span class="tracking-[0.05rem] text-xs text-gray-600"
                      >{activeTeam}</span
                    >
                  </div>
                  <div>
                    <button
                      class="rounded-md px-3 tracking-[0.05rem] py-2 bg-gray-100 hover:bg-slate-50 text-xs text-gray-600"
                    >
                      <a href="#my_modal_23"> Edit </a>
                    </button>
                  </div>
                </div>
                <div class=" justify-between items-center flex pb-3 mt-2">
                  <div class="flex gap-5 items-center">
                    <span class="tracking-[0.05rem] text-sm">My Nickname</span>
                    <span class="tracking-[0.05rem] text-xs text-gray-600"
                    ></span>
                  </div>
                  <div>
                    <button
                      class="rounded-md px-3 tracking-[0.05rem] py-2 bg-gray-100 hover:bg-slate-50 text-xs text-gray-600"
                    >
                      <a href="#my_modal_24"> Edit </a>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-3">
              <span
                class="text-xs tracking-[0.05rem] text-gray-600 font-semibold"
                >Danger Zone</span
              >
              <div
                class="bg-gray-50 mt-2 border border-gray-300 p-2 rounded-md"
              >
                <div class="border-b justify-between items-center flex pb-3">
                  <div class="flex gap-5 items-center">
                    <span class="tracking-[0.05rem] text-sm">Transfer</span>
                    <span class="tracking-[0.05rem] text-xs text-gray-600">
                      Transferring the team ownership to other members</span
                    >
                  </div>
                  <div>
                    <button
                      class="rounded-md px-3 tracking-[0.05rem] py-2 bg-gray-100 hover:bg-slate-50 text-xs text-gray-600"
                    >
                      <a href="#my_modal_25"> Transfer </a>
                    </button>
                  </div>
                </div>
                <div class=" justify-between items-center flex pb-3 mt-2">
                  <div class="flex gap-5 items-center">
                    <span class="tracking-[0.05rem] text-sm"
                      >Dismiss Team
                    </span>
                    <span class="tracking-[0.05rem] text-xs text-gray-600">
                      The team is not restorable after dismiss.</span
                    >
                  </div>
                  <div>
                    <button
                      class="rounded-md px-3 tracking-[0.05rem] py-2 bg-gray-100 hover:bg-slate-50 text-xs text-gray-600"
                    >
                      <a href="#my_modal_26"> Dismiss </a>
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
{/if}

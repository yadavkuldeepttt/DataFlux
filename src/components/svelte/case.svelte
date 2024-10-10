<script>
  import doCall from "../../apiData/api";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";

  let videoList = [];

  // case  links
  let category = [
    {
      link: "/en/opinion",
      name: "Opinion",
    },
    {
      link: "/en/JodhpurCase",
      name: "Jodhpur Case",
    },
    {
      link: "/en/AhmedabadCase",
      name: "Ahmedabad Case",
    },
    {
      link: "/en/contribution",
      name: "Contribution",
    },
    {
      link: "/en/health",
      name: "Health",
    },
    {
      link: "/en/AttackonIndianSanskriti",
      name: "AttackonIndianSanskriti",
    },
    {
      link: "/en/LegalTerrorism",
      name: "LegalTerroism",
    },
    {
      link: "/en/references/images",
      name: "References",
    },
  ];
  let showModal = false;
  let selectedVideo = "";

  //  api call for getting the json data
  async function fetchData() {
    try {
      const response = await fetch("src/apiData/jsonServer/data.json"); // Adjust the path if necessary
      const data = await response.json();

      console.log(data, "api data loaded");

      // Extract info, item, and tasks from the JSON file
      videoList = data.videoList;

      filterItems(); // Call your filter function after data is fetched
    } catch (error) {
      console.error("Error fetching data from JSON file:", error);
    }
  }

  // Mock API call replaced with fetching data from data.json
  onMount(() => {
    fetchData();
  });

  // Function to toggle the visibility of the modal
  function toggleModal(video) {
    selectedVideo = video;
    console.log(selectedVideo);
    showModal = !showModal;
  }
</script>

<div class="">
  <div
    class="
	 flex gap-2 lg:justify-between sm:flex-col lg:mr-28 sm:mr-0"
  >
    <div
      class=" slide m-auto text-start flex lg:flex-col sm:flex-wrap justify-center items-center lg:gap-4 sm:gap-2"
    >
      {#each category as cat, index}
        <a
          href={cat.link}
          transition:fade
          class="btn rounded-pill buttonshover border border-secondary"
        >
          {cat.name}
        </a>
      {/each}
      <br />
    </div>

    <div transition:fade>
      <div class="advertise bg-dark my-3 shadow">
        <div>
          <img
            class="img-fluid lg:w-[32vw] lg:h-[72vh] sm:w-[100vw]"
            src="https://c.sachtak.com/images/web/inr_1.png"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
  <div class="mt-5 mb-5 d-flex justify-content-center align-items-center">
    <ul style="list-style-type:none;padding-left:0" class="d-flex gap-3">
      {#each videoList as list, index}
        <li class="shadow" transition:fade>
          <!-- <div
            class="video-thumbnail-container p-1"
            on:click={() => toggleModal(list.link)}
          > -->
          <a
            href="#my_modal_8"
            class=""
            on:click={() => toggleModal(list.link)}
          >
            <div class=" video-thumbnail-container">
              <img
                transition:fade
                src={list.thumbnail}
                alt="Video Thumbnail"
                class="video-thumbnail aspect-video object-cover lg:h-full lg:w-screen"
              />
              <div class="play-button border-0">
                <i class="fa-solid fa-play text-danger" />
              </div>
            </div>
          </a>
          <!-- </div> -->
          <h6 class="ps-2">{list.name}</h6>
        </li>
      {/each}
    </ul>
  </div>
</div>
{#if showModal}
  <div class="modal" role="dialog" id="my_modal_8" transition:fade>
    <div class="modal-box fixed top-[22%] left-[29%]">
      <iframe
        style="width: 100%;"
        height="350"
        src={selectedVideo}
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      />
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </div>
{/if}

<style>
  .video-thumbnail {
    position: relative;
  }
  .buttonshover {
    transition: all 0.5s ease-in-out;
    font-weight: 600;
  }
  .buttonshover:hover {
    background-color: #dc3545 !important;
    color: #fff !important;
    border-color: #dc3545 !important;
  }
  .play-button {
    position: absolute;
    top: 50%;
    font-size: 1.3rem;
    outline: 0;
    cursor: pointer;
    left: 45%;
    z-index: 1;
    transition: transform 0.3s ease;
  }
  .play-button:hover {
    animation: pulse 0.5s infinite;
  }
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

  .slide {
    transition: transform 0.3s ease-out;
  }
  .modal {
    display: block;
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .modal-content {
    background-color: #fefefe;
    margin: 5% auto;
    padding: 5px;
    border: 1px solid #888;
    width: 90%;
    max-width: 900px;
    position: relative;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
  .video-thumbnail-container {
    position: relative;
    cursor: pointer;
    border-radius: 8px;
    overflow: hidden;
  }

  .video-thumbnail {
    transition: transform 0.3s ease;
  }
  .video-thumbnail-container:hover .play-button {
    color: #ff0000;
  }

  .video-thumbnail-container:hover .play-button {
    transform: scale(1.2);
  }
</style>

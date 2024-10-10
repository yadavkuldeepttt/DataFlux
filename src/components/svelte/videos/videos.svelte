<!-- App.svelte -->
<script client:only>
  import { fade } from "svelte/transition";
  import doCall from "./../../../apiData/api.js";
  import { onMount } from "svelte";
  // import { infiniteVideos } from "../../../apiData/data.js";
  // import { writable } from 'svelte/store';
  import lazyLoadVideos from "../../../apiData/lazyloadvideo.js";

  let infiniteVideos = [];

  //  api call for getting the json data
  async function fetchData() {
    try {
      const response = await fetch("src/apiData/jsonServer/data.json"); // Adjust the path if necessary
      const data = await response.json();

      console.log(data, "api data loaded");

      // Extract content from the JSON file
      infiniteVideos = data.infiniteVideos;

      filterItems(); // Call your filter function after data is fetched
    } catch (error) {
      console.error("Error fetching data from JSON file:", error);
    }
  }

  // Mock API call replaced with fetching data from data.json
  onMount(() => {
    fetchData();
  });

  onMount(async () => {
    try {
      // Fetch posts
      infiniteVideos = await doCall.apiCall({
        path: "/infiniteVideos",
        method: "GET",
        responseTypeNeeded: "json",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });

  let playingIndex = null;

  // Function to stop the currently playing video
  function stopPlayingVideo(index) {
    if (index !== null) {
      const video = document.getElementById(`video-${index}`);
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    }
  }

  // Function to handle scroll event
  function handleScroll() {
    const threshold = window.innerHeight / 2; // Adjust this threshold as needed
    const indexInView = Math.floor(window.scrollY / window.innerHeight);

    if (indexInView !== playingIndex) {
      stopPlayingVideo(playingIndex);
      playingIndex = indexInView;
      const nextVideo = document.getElementById(`video-${indexInView}`);
      if (nextVideo) {
        nextVideo.play();
      }
    }
  }

  onMount(() => {
    // Event listener for scroll
    window.addEventListener("scroll", handleScroll);

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
</script>

<div class="videos-container">
  <div>
    <ul class="video-list">
      {#each infiniteVideos as video, index}
        <li
          use:lazyLoadVideos
          class="video-item gap-1 mb-3 h-screen w-full lg:w-1/3 md:1/2"
          transition:fade
          key="{video.id}I"
          style="position: relative;"
        >
          <video
            loop
            autoplay={index === playingIndex}
            playsinline
            muted
            preload="none"
            id={`video-${index}`}
            poster="https://sveltejs.github.io/assets/caminandes-llamigos.jpg"
            class="video-thumbnail shadow lazy h-screen object-cover
            "
          >
            <source src={video.url} type="video/mp4" class="h-screen" />
            Your browser does not support the video tag.
          </video>
          <div
            class="videotext absolute md:bottom-4 md:left-[5%] bottom-4 left-[5%]"
          >
            <div class="d-flex align-items-center gap-3">
              <i
                class="bi bi-person-circle"
                style="color: #fff;font-size:1.8rem"
              />
              <h6 style="color:#fff" class="">thesubhankarfan .</h6>
              <button class="buttonfollow">Follow</button>
            </div>
          </div>
          <div
            class="sidebuttons d-flex flex-column gap-3 align-items-center absolute right-2 bottom-2"
            style="color:#fff"
          >
            <div class="">
              <a href="/" class="link">
                <i class="fa-solid fa-house" style="font-size:1.6rem;" />
              </a>
            </div>

            <div class="d-flex flex-column align-items-center mt-3">
              <i class="fa-solid fa-heart" style="font-size:1.7rem" />
              <span>373k</span>
            </div>
            <div class="d-flex flex-column align-items-center">
              <i class="bi bi-chat" style="font-size:1.7rem" />
              <span>2,250</span>
            </div>
            <div class="mt-2">
              <i class="bi bi-send" style="font-size:1.7rem;font-weight:700" />
            </div>
            <div class="mt-3">
              <i class="fa-regular fa-bookmark" style="font-size:1.6rem;" />
            </div>
            <div class="mt-3">
              <i class="fa-solid fa-ellipsis" style="font-size:1.6rem;" />
            </div>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
  .sidebuttons {
    /* position: absolute;
    bottom: 2%;
    left: 54%; */
    z-index: 9999;
  }
  .buttonfollow {
    padding: 0.2rem 0.3rem;
    border-radius: 7px;
    border: 1px solid #fafafa !important;
    background: transparent !important;
    font-weight: 600;
    color: #fff !important;
    font-size: 10px;
  }
  .videotext {
    z-index: 9999;
  }
  .sidebuttons i {
    cursor: pointer;
    transition: color 0.5s ease-in-out;
  }
  .sidebuttons i:hover {
    color: #ffffff81;
  }
  .video-list {
    list-style-type: none;
    padding: 0;
  }

  .video-item {
    margin: 0 auto;
    border-radius: 5px;
    max-height: 100vh !important;
    overflow: hidden;
  }

  .upload-input {
    margin-top: 20px;
  }

  .full-screen-button {
    margin-top: 10px;
    padding: 8px 16px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .full-screen-button:hover {
    background-color: #0056b3;
  }
</style>

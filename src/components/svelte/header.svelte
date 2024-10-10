<script>
  import Subscribe from "../svelte/subscribe.svelte";
  import { fade } from "svelte/transition";
  import doCall from "../../apiData/api";
  import * as C from "../../apiData/config";
  import { onMount } from "svelte";
  // search box
  let isSearchOpen = false;
  let marqueData = [];
  let dropdownOpen = false;

  function searchBox() {
    isSearchOpen = !isSearchOpen;
  }
  function closeBox() {
    isSearchOpen = false;
  }

  function toggleDropdown() {
    dropdownOpen = !dropdownOpen;
  }

  //  api call for getting the json data
async function fetchData() {
  try {
    const response = await fetch("src/apiData/jsonServer/data.json"); // Adjust the path if necessary
    const data = await response.json();

    console.log(data,"api data loaded");

    // Extract info, item, and tasks from the JSON file
    marqueData = data.marqueData;
    
    
    filterItems(); // Call your filter function after data is fetched
  } catch (error) {
    console.error("Error fetching data from JSON file:", error);
  }
}

// Mock API call replaced with fetching data from data.json
onMount(() => {
  fetchData();
});


</script>

<!-- topMenu -->

<div class="bg-white z-50">
  <div class="parent">
    <div class="d-inline-flex top-nav fixed-top bg-danger text-white">
      <a class="nav-link text-white font600 py-1">INDIA </a>
      <a class="nav-link text-white font600 py-1">DAILY</a>
      <!-- <a class="nav-link text-white py-1">BUSINESS</a> -->
    </div>
  </div>

  <!-- subscribe box -->

  <dialog id="my_modal_3" class="modal">
    <div class="modal-box max-w-4xl w-11/12">
      <Subscribe />
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
  <!-- subscribe box end -->

  <div
    style=""
    class="d-flex justify-content-between bg-white align-items-center mid-nav fixed-top border-b border-t border-top"
  >
    <div class="flex items-center cursor-pointer">
      <button
        class="px-2 text-gray-500 my-menu cursor-pointer"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasWithBothOptions"
        aria-controls="offcanvasWithBothOptions"
      >
        <i class="fa-solid fa-bars cursor-pointer text-xs" />
      </button>

      <div class="flex items-center lg:ms-0 ms-4 gap-3">
        <img
          class="h-10 w-10"
          src={C.default.objDetails.logo}
          alt={C.default.objDetails.name}
        />
        <h5 class="m-0 xl:block md:block hidden for-clr fw-bold">
          {C.default.objDetails.name}
        </h5>
      </div>
    </div>
    <div class=" d-flex align-items-center">
      <button
        onclick="my_modal_3.showModal()"
        style=" background-color: var(--bs-danger);font-size:11px"
        class="btn-white sub btn btn-sm text-white rounded-pill fw-bold d-flex align-items-center py-1 px-2 me-5"
        id="premium"><i class=" bx bx-crown fs-6" />Subscribe</button
      >

      <div class="d-flex rightnav">
        <div
        class=" text-center hidden lg:block md:block border-start px-3"
        style="cursor:pointer;"
      >
        <a href="/magazine" class=" text-dark text-decoration-none">
          <i class="bx bx-news" style="font-size: 16px;" />
          <p class="m-0 small">Magazine</p>
        </a>
      </div> 
        <!-- <div class="text-center hidden lg:block md:block border-start px-3">
        <i class="bx bx-tv" style="font-size: 16px;" />
        <p class="m-0 small text-center">Live TV</p>
      </div> -->
        <div
          class="text-center border-start px-3"
          on:click={toggleDropdown}
          style="cursor: pointer;"
        >
          <i class="bx bx-globe" style="font-size: 16px;" />
          <p class="m-0 small text-center">Language</p>
        </div>
        {#if dropdownOpen}
          <div class="dropdown-menu shadow" transition:fade>
            <!-- Dropdown content -->
            <ul
              style="list-style-type: none;"
              class="d-flex gap-4 flex-wrap py-2"
            ></ul>
          </div>
        {/if}

        <div
          class="text-center border-start px-3 border-end"
          style="cursor:pointer;"
          on:click={searchBox}
        >
          <i class="bx bx-search" style="font-size: 18px;" />
          <p class="m-0 small text-center">Search</p>
        </div>

        <div
          class="text-center px-3 border-end whatsapp-button"
          style="cursor:pointer;background-color:var(--bs-whatsapp)"
        >
          <a
            style="text-decoration: none;"
            target="_"
            href={`https://wa.me/${encodeURIComponent(C.default.objDetails.contact)}`}
            class="m-0 small text-center d-flex align-items-center flex-column pt-2 text-white"
          >
            <div class="d-flex align-items-center gap-1">
              <i
                class="fa-brands fa-whatsapp text-white"
                style="font-size: 20px;"
              />
              <span style="font-size:12px " class="font600 text-white">
                WhatsApp Us
              </span>
            </div>

            <span style="font-size:10px;cursor:pointer">
              +91 {C.default.objDetails.contact}
            </span>
          </a>
        </div>
        {#if isSearchOpen}
          <div class="popup-search" transition:fade>
            <div
              class="text-end mx-2 mt-1 mb-1"
              style="cursor: pointer;"
              on:click={closeBox}
            >
              <i class="fa-solid fa-times" />
            </div>

            <input
              type="search"
              name=""
              id=""
              placeholder="search..."
              class="form-control mb-1"
            />
          </div>
        {/if}
      </div>
    </div>
  </div>

  <div
    class="bg-white z-50 fixed md:top-[4.8rem] lg:top-[4.4566rem] top-[4.1rem] left-0 lg:left-[11.5rem] border-b logos lg:pt-1 py-1 lg:pb-1.5 w-full"
  >
    <div class="flex items-center logos-slide">
      {#each marqueData as icon}
        <a href={icon.link} title={icon.id}>
          <img src={icon.icon} alt="" height="30" width="30" />
        </a>
      {/each}
    </div>
  </div>
</div>

<style>
  .whatsapp-button a:hover {
    background-color: #08eb5b !important;
  }
  .whatsapp-button:hover {
    background-color: #08eb5b !important;
  }

  .logos-slide {
    animation: slide 20s infinite linear;
    -webkit-animation: slide 20s infinite linear;
  }
  .logos:hover .logos-slide {
    animation-play-state: paused;
  }
  .logos-slide img {
    margin: 0 40px;
  }
  @keyframes slide {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-20%);
      -webkit-transform: translateX(-20%);
      -moz-transform: translateX(-20%);
      -ms-transform: translateX(-20%);
      -o-transform: translateX(-20%);
    }
  }

  .popup-search {
    position: fixed;
    top: 25%;
    left: 67%;
    transform: translate(-50%, -50%);
    background: #212529;
    border: 1px solid #ffffff57;
    padding: 10px 20px;
    z-index: 9999;
    width: 50%;
    transition: transform 0.5s ease-in-out;
    box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.2);
  }

  .subscribe-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #212529;
    border: 1px solid #ffffff57;
    z-index: 9999;
    width: 50%;
    box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.6);
  }
  input:focus {
    box-shadow: none;
  }
  .dropdown-menu {
    display: block;
    position: absolute;
    top: 100%;
    width: 38%;
    max-width: 100%;
    left: auto;
    padding: 14px 4px;
    right: 13.7%;
    background-color: #212529;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }
  @media screen and (max-width: 600px) {
    .dropdown-menu {
      width: 100%;
      right: 10px;
      margin-top: 1rem;
    }
    .carousel_home {
      margin-top: 2.6rem !important;
    }
  }
</style>

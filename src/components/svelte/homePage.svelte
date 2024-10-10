<script>
  import { fade, fly } from "svelte/transition";
  import doCall from "../../apiData/api";
  import NewsHomeContent from "../../components/svelte/newsHomeContent.svelte";
  import * as C from "../../apiData/config";
  import { onMount } from "svelte";

  let posts = [];
  let jobs = [];
  let des = [];

  
//  api call for getting the json data
async function fetchData() {
  try {
    const response = await fetch("src/apiData/jsonServer/data.json"); // Adjust the path if necessary
    const data = await response.json();

    console.log(data,"api data loaded");

    // Extract info, item, and tasks from the JSON file
    posts = data.posts;
    jobs = data.jobs;
    des = data.des;
    
    filterItems(); // Call your filter function after data is fetched
  } catch (error) {
    console.error("Error fetching data from JSON file:", error);
  }
}

// Mock API call replaced with fetching data from data.json
onMount(() => {
  fetchData();
});




  let likes = 3;
  let isLiked = false;
  let votes = 7;
  let isVoted = false;

  let comments = 9;

  function toggleLike() {
    isLiked = !isLiked;
    likes = isLiked ? likes + 1 : likes - 1;
  }
  function toggleVote() {
    isVoted = !isVoted;
    votes = isVoted ? votes + 1 : votes - 1;
  }

  let shareBox = false;
  function sharePost() {
    shareBox = !shareBox;
    // alert("Post shared!");
  }
  function closeShareBox() {
    shareBox = false;
  }

  let showCommentPopup = false;
  function openCommentPopup() {
    showCommentPopup = true;
  }

  function closeCommentPopup() {
    showCommentPopup = false;
  }
  function showContestsList(jobId) {
    if (typeof window !== "undefined") {
      window.location.href = `job/${jobId}/`;
    }
  }
  let chatMessages = []; // Array to store chat messages
  let chatbox = false;
  let newMessage = ""; // Variable to store the new message from input

  function showChatBox() {
    chatbox = !chatbox;
  }

  function sendMessage() {
    if (newMessage.trim() !== "") {
      chatMessages = [...chatMessages, { text: newMessage, sender: "user" }];
      newMessage = ""; // Clear the input after sending the message
    }
  }
  let avtar = [
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format",
    "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/3106026/pexels-photo-3106026.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/4238521/pexels-photo-4238521.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  ];
  let bottomcarousel = [
    {
      img: "https://media.istockphoto.com/id/1292573758/photo/happy-mother-with-father-carrying-their-daughter-on-shoulder-at-park.jpg?s=612x612&w=0&k=20&c=bYGSsldUJKnSTTqRY5NYB-KNY947Vy8VNrEiFu0JvLk=",
      text: "img 1",
    },
    {
      img: "https://media.istockphoto.com/id/1413204314/photo/happy-man-at-supermarket-store.jpg?s=612x612&w=0&k=20&c=Dn5UI46Z6UmBx2n9kYg56jObHBYoQtxcLjS5ukEuXCE=",
      text: "Image 2",
    },
    {
      img: "https://media.istockphoto.com/id/1365550676/photo/map-of-india-on-digital-display.jpg?s=612x612&w=0&k=20&c=qq0fqPlwo1mlv8uDf4AYV265tRBnhgSP3U6YoahHPfA=",
      text: "Image 3",
    },
    {
      img: "https://media.istockphoto.com/id/587191498/photo/india-economy-and-financial-market-growth-concept-3d-rendering.jpg?s=612x612&w=0&k=20&c=5UbDJ98YAWAV-ZGYVe_Ga1L3yctchDSq2QOHGIJGkPA=",
      text: "Image 4",
    },
  ];
  let cardData = [
    {
      imageUrl:
        "https://media.istockphoto.com/id/1312418309/photo/visual-contents-concept-social-networking-service-streaming-video-communication-network-3d.jpg?s=1024x1024&w=is&k=20&c=xlvR1iWvkXQ71_TOmmRbkHTRUHf-Mh7OrUeNapS_QRY=",
      destination: "Destinations",
      title: "Go to see the best sunsets in the world",
      buttonText: "Browse Destinations",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1546422904-90eab23c3d7e?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      destination: "Destinations",
      title: "Go to see the best sunsets in the world",
      buttonText: "Browse Destinations",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      destination: "Destinations",
      title: "Go to see the best sunsets in the world",
      buttonText: "Browse Destinations",
    },
    {
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1661776557883-2248c55146d6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      destination: "Destinations",
      title: "Go to see the best sunsets in the world",
      buttonText: "Browse Destinations",
    },
    {
      imageUrl:
        "https://images.pexels.com/photos/3970330/pexels-photo-3970330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      destination: "Destinations",
      title: "Go to see the best sunsets in the world",
      buttonText: "Browse Destinations",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      destination: "Destinations",
      title: "Go to see the best sunsets in the world",
      buttonText: "Browse Destinations",
    },
    // Add more card objects as needed
  ];

  const Contentimage = [
    {
      imageUrl: "https://wallpapercave.com/wp/wp4676582.jpg",
      title: "Noteworthy technology acquisitions 2021",
    },
    {
      imageUrl: "https://wallpapercave.com/wp/wp4676582.jpg",
      title: "Noteworthy technology acquisitions 2021",
    },
    {
      imageUrl: "https://wallpapercave.com/wp/wp4676582.jpg",
      title: "Noteworthy technology acquisitions 2021",
    },
  ];

  let openSubMenu = {};

  function toggleSubMenu(menuItem) {
    openSubMenu[menuItem.name] = !openSubMenu[menuItem.name];
  }
</script>

<!-- floating 3d button for chatbox -->
<div
  on:click={showChatBox}
  class="btn-group dropstart end-0 shadow rounded-circle threedicon"
  style="position:fixed;top:87%;right:1%!important;z-index:99999"
>
  <button
    type="button"
    class="btn btn-white support-button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
    style="cursor:pointer"
    data-bs-auto-close="inside outside"
  >
    <i class="bx bx-support" style="font-size:34px"></i>
  </button>
</div>

<!-- chatbox start-->
{#if chatbox}
  <div
    class="chatpopup shadow"
    in:fly={{ y: 200, duration: 1000 }}
    out:fly={{ y: 200, duration: 1000 }}
  >
    <div
      class="d-flex justify-content-between align-items-center p-2 font600"
      style="background:linear-gradient(to right, var(--bs-danger),orangered);"
    >
      <div class="d-flex gap-2 align-items-center">
        <i class="fa-solid fa-circle-user text-light" style="font-size:25px"
        ></i>
        <h6 class="mt-2 text-white font600" style="font-size: 14px;">
          ABC India
        </h6>
      </div>

      <div style="font-size:13px;cursor:pointer" class="text-white">
        <i class="fa-solid fa-ellipsis-vertical"></i>
        <i
          class="fa-solid fa-chevron-down px-3"
          on:click={() => (chatbox = false)}
        ></i>
      </div>
    </div>
    <div
      class="chatbody"
      style="background-color: #fafafa; height: 41vh; overflow-y: auto;"
    >
      {#each chatMessages as message}
        <div class={`${message.sender === "user" ? "outgoing" : "incoming"}`}>
          <div>{message.text}</div>
        </div>
      {/each}
    </div>
    <div
      class="chat-message d-flex gap-2 justify-content-between"
      style="background-color:#f4f5f7"
    >
      <input
        bind:value={newMessage}
        type="text"
        class="w-100 py-2 ps-1"
        style="border: 0;outline:0;background-color:#f4f5f7;font-size:13px"
        placeholder="Type your answer.."
      />
      <button class="btn btn-light btn-sm m-0" on:click={sendMessage}>
        <i class="fa-solid fa-paper-plane text-primary"></i>
      </button>
    </div>
  </div>
{/if}
<!-- chatbox end -->

<div class="main-container carousel-container">
  <div class="center-div mb:w-screen px-1" transition:fade>
    <!-- homepage links -->
    <div
      transition:fade
      class="respadding m-auto md:pt-3 md:pb-2 sm:pt-3 lg:py-0 text-center d-flex flex-wrap hoverbuttons justify-content-center align-items-center lg:gap-3 md:gap-3 sm:gap-3 gap-2"
    >
      {#each des as item}
        <a href={item.href} class="btn btn-outline-danger rounded-pill"
          >{item.label}</a
        >
      {/each}
    </div>

    <!-- main news content start  -->
    <div class="d-flex gap-1 flexcontainer mb-3 mt-0 xl:pt-5 md:pt-5">
      <!-- live youtube  video  -->
      <div class="shadow-sm iframcontainer w-full">
        {#each C.default.liveVideo as live}
          <iframe
            src={live.link}
            class="object-cover
             aspect-video w-full h-full"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          />
        {/each}
      </div>

      <!-- jobs section -->
      <div class="jobs shadow-sm w-100 p-1 ps-3">
        <h2 class="font-bold mb-2 text-xl">Jobs</h2>
        <div class="table-responsive">
          <table class="table table-striped table-hover table-bordered">
            <thead class="">
              <tr style="font-size:14px;">
                <th>Title</th>
                <th>Company</th>
                <th>Salary</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {#each jobs as job, index}
                <tr
                  id="job-{job.id}"
                  style="font-size:12px"
                  on:click={() => showContestsList(job.id)}
                >
                  <td style="font-weight:600">{job.jobPost}</td>
                  <td>{job.companyName}</td>
                  <td>{job.salary}</td>
                  <td>{job.location}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <div class="flex justify-end">
          <button class="buttons btn btn-light btn-sm"> +See all jobs</button>
        </div>
      </div>
    </div>
    <!-- news home content start -->
    <NewsHomeContent />
    <!-- news home content end -->
    <!-- posts content-->
    <div>
      <div
        class="d-flex justify-content-between items-center gap-1 flex-wrap mb-3"
      >
        {#each posts as post, index}
          <div class="col-lg-8 col-md-12 my-2 shadow" style="cursor:pointer">
            <div class="">
              <div class="lg:px-3 sm:px-0 py-2">
                <p class="for-clr fw-bold">{post.title}</p>
                <div
                  class="d-flex justify-content-between flex-wrap align-items-center"
                >
                  <div class="col-lg-8">
                    <h4 class="fw-bold">
                      {post.mainHeadline}
                    </h4>
                    <p class="m-0 mb-2 text-secondary">
                      {post.description}
                    </p>
                  </div>
                  <div class="col-lg-3">
                    <img src={post.image} class="img-fluid w-[100vw]" />
                  </div>
                </div>
                <div class="d-flex gap-4 align-items-center my-2">
                  <div class="d-flex align-items-center">
                    <i class="bx bx-smile fs-3 me-1" />
                    {post.likes}
                  </div>
                  <div class="d-flex align-items-center">
                    <i class="bx bx-message-detail fs-3 me-1" />
                    {post.comments}
                  </div>
                  <i class="bx bx-bookmark fs-3" />
                  <i class="bx bx-share bx-flip-horizontal fs-3" />
                </div>
              </div>
            </div>
          </div>
          {#each post.ads as ad, index}
            <div class="col-lg-3 col-md-12 my-2 shadow" style="cursor:pointer">
              <div>
                <div class="flex sm:gap-2 md:flex md:gap-2 lg:flex-col">
                  <div class="">
                    <img class="lg:w-full sm:w-50 sm:h-50" src={ad.image} />
                  </div>
                  <a href="#" class="text-dark p-1 d-inline-block">
                    {ad.title}
                  </a>
                </div>
              </div>
            </div>
          {/each}
        {/each}
      </div>
    </div>
    <!-- posts content end -->

    <!-- carousel -->
    <div class="flex carouselresponsive">
      <!-- card -->
      <div class=" sm:w-full relative w-full lg:w-[70%] md:w-2/3 mr-6">
        <h1 class="text-5xl font-extrabold tracking-tight text-center"></h1>
        <ul
          class="mt-10 pb-8 px-[4rem] w-full no-scrollbar flex overflow-x-auto gap-8 snap-x pl-0"
        >
          {#each cardData as card}
            <li class="snap-center md:w-[56vw] lg:w-[24vw] w-[80vw]">
              <div class="relative flex-shrink-0 overflow-hidden rounded-3xl">
                <img
                  src={card.imageUrl}
                  alt=""
                  class="absolute inset-0 w-full h-full object-cover object-bottom"
                />
                <div
                  class="absolute inset-0 h-full w-full bg-gradient-to-br from-black/75"
                ></div>
                <div
                  class="relative h-96 w-[768px] md:w-[calc(50% - 1rem)] p-12 flex flex-col justify-between items-start"
                >
                  <div>
                    <p class="font-medium text-white">{card.destination}</p>
                    <h2
                      class="mt-3 w-2/3 lg:text-2xl text-xl font-semibold tracking-tight text-white"
                    >
                      {card.title}
                    </h2>
                  </div>
                  <a
                    href="#"
                    class="px-4 py-3 rounded-lg bg-white text-slate-900 text-sm font-medium"
                    >{card.buttonText}</a
                  >
                </div>
              </div>
            </li>
          {/each}
        </ul>
      </div>
      <!-- component -->
      <div
        class="carouselcard bg-white border-b-4 shadow-md border-blue-500 w-full sm:mt-2 mt-5 sm:mb-10 h-full sm:h-4/5 overflow-hidden"
      >
        <img
          src="https://images.unsplash.com/photo-1573748240263-a4e9c57a7fcd"
          alt="People"
          class="w-full object-cover h-32 sm:h-48 md:h-64"
        />
        <div class="p-4 md:p-2 carouselcardcontent">
          <p
            class="carouselcardcontenp text-blue-500 font-semibold text-xs mb-1 leading-none"
          >
            News
          </p>
          <h3
            class="carouselcardcontent font-semibold mb-2 text-xl leading-tight sm:leading-normal"
          >
            The Coldest Sunset
          </h3>
          <div class="carouselcardcontent text-sm flex items-center">
            <svg
              class="carouselcardcontent opacity-75 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Capa_1"
              x="0px"
              y="0px"
              width="12"
              height="12"
              viewBox="0 0 97.16 97.16"
              style="enable-background:new 0 0 97.16 97.16;"
              xml:space="preserve"
            >
              <path
                d="M48.58,0C21.793,0,0,21.793,0,48.58s21.793,48.58,48.58,48.58s48.58-21.793,48.58-48.58S75.367,0,48.58,0z M48.58,86.823c-21.087,0-38.244-17.155-38.244-38.243S27.493,10.337,48.58,10.337S86.824,27.492,86.824,48.58S69.667,86.823,48.58,86.823z"
              />
              <path
                d="M73.898,47.08H52.066V20.83c0-2.209-1.791-4-4-4c-2.209,0-4,1.791-4,4v30.25c0,2.209,1.791,4,4,4h25.832c2.209,0,4-1.791,4-4S76.107,47.08,73.898,47.08z"
              />
            </svg>
            <p class="leading-none">21 Oct 2019</p>
          </div>
        </div>
      </div>
    </div>

    <!-- avtar -->
    <div class="sm:flex block">
      <div class="relative lg:w-[55.5vw] w-full sm:w-9/12">
        <h1 class="text-5xl font-extrabold tracking-tight text-center"></h1>
        <ul
          class=" pb-8 py-5 lg:w-[55.5vw] w-full no-scrollbar flex overflow-x-auto gap-8 snap-x pl-0"
        >
          {#each avtar as image}
            <li class="snap-center bg-none w-48">
              <div class="relative flex-shrink-0 overflow-hidden rounded-3xl">
                <img
                  src={image}
                  alt=""
                  class="avtar absolute inset-0 object-cover object-bottom rounded-full w-44 h-44 border-4 border-gray-300"
                />
                <div class="absolute inset-0 h-full w-full from-black/75"></div>
                <div
                  class="relative h-44 bg-transparent w-[768px] p-12 flex flex-col justify-between items-start"
                ></div>
                <p class="ml-16">Content</p>
              </div>
            </li>
          {/each}
        </ul>
      </div>
      <!-- component -->
      <div class=" verticleccarousel carousel-container h-80 overflow-y-scroll">
        <ol
          class="relative mr-10 border-s border-gray-200 dark:border-gray-700"
        >
          <li class="mb-10 ms-4">
            <span
              class="absolute flex items-center justify-center w-3 h-3 ml-6 mt-2 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900"
            >
              <svg
                class="w-2.5 h-2.5 text-blue-800 dark:text-blue-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
                />
              </svg>
            </span>
            <time
              class="mb-1 text-sm ml-3 font-normal leading-none text-gray-400 dark:text-gray-500"
              >February 2022</time
            >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Application UI code in Tailwind CSS
            </h3>
            <p
              class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400"
            >
              Get access to over 20+ pages.
            </p>
            <a
              href="#"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              >Learn more <svg
                class="w-3 h-3 ms-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg></a
            >
          </li>
          <li class="mb-10 ms-4">
            <span
              class="absolute flex items-center justify-center w-3 h-3 ml-6 mt-2 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900"
            >
              <svg
                class="w-2.5 h-2.5 text-blue-800 dark:text-blue-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
                />
              </svg>
            </span>
            <time
              class="mb-1 ml-3 text-sm font-normal leading-none text-gray-400 dark:text-gray-500"
              >March 2022</time
            >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Marketing UI design in Figma
            </h3>
            <p class="text-base font-normal text-gray-500 dark:text-gray-400">
              All of the pages and components are first designed in Figma.
            </p>
          </li>
          <li class=" ms-4">
            <span
              class="absolute flex items-center justify-center w-3 h-3 ml-6 mt-2 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900"
            >
              <svg
                class="w-2.5 h-2.5 text-blue-800 dark:text-blue-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
                />
              </svg>
            </span>
            <time
              class="mb-1 ml-3 text-sm font-normal leading-none text-gray-400 dark:text-gray-500"
              >April 2022</time
            >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              E-Commerce UI code in Tailwind CSS
            </h3>
            <p class="text-base font-normal text-gray-500 dark:text-gray-400">
              Get started with dozens of web components.
            </p>
          </li>
        </ol>
      </div>
    </div>

    <!-- <Carousel /> -->
    <div class="max-w-screen-xl mx-auto py-5 relative">
      <div class="grid grid-cols-1 sm:grid-cols-12 gap-10">
        <div class="sm:col-span-6 lg:col-span-5">
          <a href="#">
            <div
              class="h-56 bg-cover text-center overflow-hidden"
              style="background-image: url('https://tailwindcss.com/img/card-left.jpg')"
              title="Woman holding a mug"
            ></div>
          </a>
          <div
            class="mt-3 bg-white rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal"
          >
            <div class="">
              <a
                href="#"
                class="text-xs text-indigo-600 uppercase font-medium mb-3 flex items-center hover:text-gray-900 transition duration-500 ease-in-out"
              >
                Fashion
              </a>
              <a
                href="#"
                class="text-gray-900 font-bold text-lg mb-2 hover:text-indigo-600 transition duration-500 ease-in-out"
                >The perfect summer sweater that you can wear!
              </a>
              <p class="text-gray-700 text-xs mt-2">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptatibus quia, nulla! Maiores et perferendis eaque,
                exercitationem praesentium nihil.
              </p>
            </div>
          </div>
        </div>

        <div class="sm:col-span-6 lg:col-span-4">
          <div class="flex items-start mb-3 pb-3">
            <a href="#" class="inline-block mr-3">
              <div
                class="w-20 h-20 bg-cover bg-center"
                style="background-image:url(https://media.gettyimages.com/photos/cristiano-ronaldo-of-juventus-fc-looks-dejected-during-the-uefa-of-picture-id1227967060?k=6&amp;m=1227967060&amp;s=612x612&amp;w=0&amp;h=cMSMlRyI6YAzcE_C2KgHGRLeVojHYoUhIvhwPBYv8f4=);"
              ></div>
            </a>
            <div class="text-sm">
              <p class="text-gray-600 text-xs">Aug 18</p>
              <a
                href="#"
                class="text-gray-900 font-medium hover:text-indigo-600 leading-none"
                >Cristiano Ronaldo of Juventus FC looks dejected during the...</a
              >
            </div>
          </div>
          <div class="flex items-start mb-3 pb-3">
            <a href="#" class="inline-block mr-3">
              <div
                class="w-20 h-20 bg-cover bg-center"
                style="background-image:url(https://media.gettyimages.com/photos/lionel-messi-and-marcandre-ter-stegen-of-fc-barcelona-waits-in-the-picture-id1266763488?k=6&amp;m=1266763488&amp;s=612x612&amp;w=0&amp;h=8vxz9HfQVfrff5N7d1lBVxtLamRQGK3J3lyHkUuuIiw=);"
              ></div>
            </a>
            <div class="text-sm w-2/3">
              <p class="text-gray-600 text-xs">Jan 18</p>
              <a
                href="#"
                class="text-gray-900 font-medium hover:text-indigo-600 leading-none"
                >Barcelona v Bayern Munich
              </a>
            </div>
          </div>

          <div class="flex items-start">
            <a href="#" class="inline-block mr-3">
              <div
                class="w-20 h-20 bg-cover bg-center"
                style="background-image:url(https://media.gettyimages.com/photos/lionel-messi-of-fc-barcelona-looks-dejected-following-his-teams-in-picture-id1266341828?k=6&amp;m=1266341828&amp;s=612x612&amp;w=0&amp;h=FZi-bSrIlOEE01780h79GsbBYPqZo2l3aaCxoktWADY=);"
              ></div>
            </a>
            <div class="text-sm w-2/3">
              <p class="text-gray-600 text-xs">July 23</p>
              <a
                href="#"
                class="text-gray-900 font-medium hover:text-indigo-600 leading-none"
                >Barcelona v Bayern Munich - UEFA Champions League
              </a>
            </div>
          </div>
        </div>

        <div class="sm:col-span-12 lg:col-span-3">
          <a href="#">
            <div
              class="h-56 bg-cover text-center overflow-hidden"
              style="background-image: url('https://tailwindcss.com/img/card-left.jpg')"
              title="Woman holding a mug"
            ></div>
          </a>
          <div
            class="mt-3 bg-white rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal"
          >
            <div class="">
              <a
                href="#"
                class="text-xs text-indigo-600 uppercase font-medium flex items-center hover:text-gray-900 transition duration-500 ease-in-out"
              >
                Fashion
              </a>
              <a
                href="#"
                class="text-gray-900 font-bold text-lg mb-2 hover:text-indigo-600 transition duration-500 ease-in-out"
                >The perfect summer sweater that you can wear!
              </a>
              <p class="text-gray-700 text-xs mt-2">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- mobile screen bottom navbar -->
  <div class="bottom-nav position-relative">
    <div
      class="bottom d-flex justify-content-around bg-light fixed-bottom py-1"
    >
      <div class="text-center">
        <button class=""
          ><i class="home bx bxs-home text-danger fs-1 for-clr" />
        </button>
        <p class="m-0 small">Home</p>
      </div>
      <div class="text-center">
        <button class=""> <i class="bx bx-tv fs-1" /> </button>

        <p class="m-0 small text-center">Live TV</p>
      </div>
      <div class="text-center">
        <button class=""> <i class="bx bxs-star fs-1" /> </button>

        <p class="m-0 small text-center">Personalise</p>
      </div>
      <div class="text-center">
        <button class=""> <i class="bx bx-news fs-1" /> </button>

        <p class="m-0 small">Magazine</p>
      </div>
      <div
        class="text-center"
        style="cursor: pointer;"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasWithBothOptions"
        aria-controls="offcanvasWithBothOptions"
      >
        <button class=""> <i class="bx bx-menu fs-1" /> </button>

        <p class="m-0 small">Menu</p>
      </div>
    </div>
  </div>
</div>

<style>
  .liked {
    color: red; /* Change the color when liked */
  }
  .voted {
    color: blue;
  }
  .share-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    width: 30%;
    border: 1px solid #ccc;
    box-sm: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  .vertical-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    writing-mode: vertical-lr;
    text-orientation: upright;
    white-space: nowrap;
    font-weight: 600;
    border-radius: 8px;
    z-index: 9999;
  }

  .support-button {
    width: 60px !important;
    border: 2px solid #fff;
    height: 60px !important;
    margin: 5px;
    background: linear-gradient(
      to right,
      var(--bs-danger),
      orangered
    ); /* Green background */
    border-radius: 50%; /* Makes it circular */
    text-align: center;
    box-shadow:
      0 10px 20px rgba(0, 0, 0, 0.19),
      0 6px 6px rgba(0, 0, 0, 0.23); /* 3D effect */
    text-align: center;
    line-height: 64px; /* Center the text vertically */
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .support-button:hover {
    box-shadow:
      0 15px 30px rgba(0, 0, 0, 0.25),
      0 12px 12px rgba(0, 0, 0, 0.22);
    transform: translateY(-4px); /* Button "pops" up when hovered */
  }

  .support-button:active {
    box-shadow:
      0 5px 10px rgba(0, 0, 0, 0.25),
      0 2px 2px rgba(0, 0, 0, 0.22);
    transform: translateY(-2px); /* Button "presses" down when clicked */
  }

  .circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin: 0 5px;
    opacity: 0;
    transition: opacity 0.5s;
  }

  .horizontal-row {
    display: flex;
    justify-content: center; /* Align circles horizontally at the center */
    background-color: #e2dcdc; /* Background color for the horizontal row */
    padding: 8px;
    border-radius: 30px;
    margin-right: 8px;
  }

  .show {
    opacity: 1;
  }

  /* For screen sizes less than 620px */
  @media screen and (max-width: 619px) {
    .carouselresponsive {
      display: flex !important;
      flex-direction: column !important;
    }
  }
  @media screen and (max-width: 576px) {
    .respadding {
      padding: 0rem !important;
    }
  }

  /* For screen sizes between 620px and 768px */
  @media screen and (min-width: 620px) and (max-width: 768px) {
    .carouselresponsive {
      display: flex !important;
      flex-direction: column !important;
    }
  }

  /* For screen sizes greater than 768px */
  @media screen and (min-width: 769px) {
    .carouselresponsive {
      display: flex !important;
      flex-direction: row !important;
    }
  }

  @media screen and (min-width: 638px) and (max-width: 768) {
  }
  .dropdown:hover .dropdown-menu {
    display: block;
  }
</style>

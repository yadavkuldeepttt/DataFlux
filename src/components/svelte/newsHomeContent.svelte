<script>
  // import { Carousel, Thumbnails } from "flowbite-svelte";
  import Carouselcontainer from "./carousel.svelte";
  import { videoList } from "../../apiData/data";
  import doCall from "../../apiData/api";
  import { onMount } from "svelte";

  let index = 0;
  let adds = [];
  let articles = [];
  let rightarticles = [];
  let mainstoryheading = [];
  let newsItems = [];
  let playerItems = [];
  let activeTab = "tb_0";
  export let svgSize = 24;

  //  api call for getting the json data
async function fetchData() {
  try {
    const response = await fetch("src/apiData/jsonServer/data.json"); // Adjust the path if necessary
    const data = await response.json();

    console.log(data,"api data loaded");

    // Extract info, item, and tasks from the JSON file
    adds = data.adds;
    articles = data.articles;
    rightarticles = data.rightarticles;
    mainstoryheading = data.mainstoryheading;
    newsItems = data.newsItems;
    playerItems = data.playerItems;
    
    
    filterItems(); // Call your filter function after data is fetched
  } catch (error) {
    console.error("Error fetching data from JSON file:", error);
  }
}

// Mock API call replaced with fetching data from data.json
onMount(() => {
  fetchData();
});



  // images avatar section
  const images = [
    {
      alt: "Cosmic timetraveler",
      src: "https://img.freepik.com/free-vector/gradient-breaking-news-background_23-2151157233.jpg?size=626&ext=jpg&ga=GA1.1.1209301284.1715834575&semt=ais_user",
      title: "cosmic-timetraveler-pYyOZ8q7AII-unsplash.com",
    },
    {
      alt: "Cristina Gottardi",
      src: "https://img.freepik.com/free-vector/gradient-breaking-news-background_52683-153668.jpg?w=740&t=st=1716450022~exp=1716450622~hmac=aa648a83538847751f4b37749e0e4f6254fec220fdf1a4eabfbb361dabdbbe67",
      title: "cristina-gottardi-CSpjU6hYo_0-unsplash.com",
    },
    {
      alt: "Johannes Plenio",
      src: "https://media.istockphoto.com/id/518198839/photo/motorbike-accident.jpg?s=612x612&w=0&k=20&c=spBrzoUSB603skxLrY_IbQrH7WRYJcyauCmyT52zLbE=",
      title: "johannes-plenio-RwHv7LgeC7s-unsplash.com",
    },
    {
      alt: "Jonatan Pie",
      src: "https://media.istockphoto.com/id/1406997367/photo/damaged-in-heavy-car-accident-vehicles-after-collision-on-city-street-crash-site-at-night.jpg?s=612x612&w=0&k=20&c=Mh2AQiHLMBdeTvVzzVUmZooKddc3lOdmXSevKHBA0m8=",
      title: "jonatan-pie-3l3RwQdHRHg-unsplash.com",
    },
    {
      alt: "Mark Harpur",
      src: "https://akm-img-a-in.tosshub.com/sites/visualstory/wp/2024/05/cropped-kohli-Pant-grab-2-vs.jpg?size=138:184",
      title: "mark-harpur-K2s_YE031CA-unsplash",
    },
  ];

  // function for tab switching news
  function rudrSwitchTab_order(tabId, contentId) {
    activeTab = tabId;
  }
</script>

<div class="middle content-area p-2">
  <div class="player-section mb-2">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="left-story col-span-1">
        {#each mainstoryheading as story}
          <div class="hm-stoy-left-body">
            <a href={story.link} title={story.title}>
              <div class="des h-auto">
                <h2
                  class="font-bold text-2xl leading-9 text-black mb-4 text-left"
                >
                  {story.title}
                </h2>
              </div>
              <div class="thumb">
                <img src={story.image} alt={story.title} class="w-full" />
              </div>
              <div class="des mt-2">
                <p>{story.description}</p>
              </div>
            </a>
          </div>
        {/each}
      </div>

      <div class="right-story col-span-2 md:col-span-2">
        <div
          class="at-row flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0"
        >
          <div class="left-sec flex-1 w-full md:w-1/2">
            <ul class="event-tab-nav flex -ml-2 w-full list-none p-0 m-0">
              <!-- Tab 0 -->
              <li
                class="tab0 p-2 flex-1 bg-red-500 flex items-center justify-center border border-black"
              >
                <a
                  href="javascript:void(0);"
                  id="tb_0"
                  class="tabmenu cursor-pointer text-center h-full w-full text-white {activeTab ===
                  'tb_0'
                    ? 'active text-blue-600'
                    : ''}"
                  on:click={() => rudrSwitchTab_order("tb_0")}>सचतक</a
                >
              </li>
              <!-- Tab 1 -->
              <li
                class="tab1 p-2 flex-1 flex items-center justify-center border border-black"
              >
                <a
                  href="javascript:void(0);"
                  id="tb_1"
                  class="tabmenu cursor-pointer text-center h-full w-full {activeTab ===
                  'tb_1'
                    ? 'active text-blue-600'
                    : ''}"
                  on:click={() => rudrSwitchTab_order("tb_1")}>Right शॉट</a
                >
              </li>
            </ul>

            <!-- Content for Tab 0 -->
            {#if activeTab === "tb_0"}
              <div id="content_0" class="tabcontent block h-203px">
                <div class="live-tv w-full" id="content_0_livetv">
                  <iframe
                    allow="autoplay; fullscreen;"
                    allowfullscreen
                    frameborder="0"
                    id="livetv_AT_web"
                    mozallowfullscreen
                    scrolling="no"
                    src={videoList[0].link}
                    webkitallowfullscreen
                    class="w-full h-full"
                  ></iframe>
                </div>
              </div>
            {/if}

            <!-- Content for Tab 1 -->
            {#if activeTab === "tb_1"}
              <div id="content_1" class="tabcontent block h-203px">
                <div class="live-tv" id="content_0_livetv">
                  <iframe
                    allow="autoplay; fullscreen;"
                    allowfullscreen
                    frameborder="0"
                    id="livetv_AT_web"
                    mozallowfullscreen
                    scrolling="no"
                    src={videoList[1].link}
                    webkitallowfullscreen
                    class="w-full h-full"
                  ></iframe>
                </div>
              </div>
            {/if}

            <!-- Right Section -->
            <div class="sm-thumb-listing h-203px flex-grow">
              <div class="flex flex-row">
                <ul class="flex flex-col -ml-2 w-full h-full list-none p-0 m-0">
                  {#each articles as article}
                    <li
                      data-tb-region-item=""
                      class="bg-transparent border border-black mb-2 mr-2 w-full h-full"
                    >
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex flex-row justify-between items-center p-2 w-full h-full custom-flex"
                      >
                        <div class="thumb flex-shrink-0 mr-2 custom-thumb">
                          <img
                            class="ls-is-cached lazyloaded rounded custom-img"
                            src={article.image}
                            alt={article.alt}
                            width="120"
                            height="68"
                          />
                        </div>
                        <div
                          class="title title-bold text-black flex-grow custom-title"
                        >
                          <h3>{article.title}</h3>
                        </div>
                      </a>
                    </li>
                  {/each}
                </ul>
              </div>
            </div>
          </div>

          <div class="right-sec flex-1 overflow-hidden w-full md:w-1/2">
            <div
              class="story-listing flex-1 overflow-hidden max-w-full flex flex-col h-full"
            >
              <ul class="story-listing-ul flex-1 flex flex-col space-y-2">
                {#each rightarticles as article}
                  <li
                    class="py-2 overflow-hidden border-b border-gray-200"
                    data-tb-region-item=""
                  >
                    <a
                      href={article.link}
                      target="_blank"
                      title={article.title}
                      class="vidsecTion text-sm sm:text-md lg:text-sm h-full"
                    >
                      <h3 class="font-medium">{article.title}</h3>
                    </a>
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!--badi-khabar content -->
<div class="player-sec p-2">
  <div class="hed-panel-common badi-khabar flex items-center">
    <span class="mr-2">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 55 55"
        style="enable-background:new 0 0 55 55;"
        xml:space="preserve"
        width={svgSize}
        height={svgSize}
      >
        <g>
          <g>
            <path
              style="fill:#D91F26;"
              d="M9.867,4h35.258c3.242,0,5.876,2.628,5.876,5.876v35.258c-0.011,2.373-1.452,4.508-3.644,5.406c-2.186,0.921-4.711,0.433-6.404-1.234L5.695,14.048c-1.67-1.687-2.158-4.218-1.234-6.404C5.359,5.446,7.494,4.012,9.867,4"
            ></path>
          </g>
        </g>
      </svg>
    </span>
    <h2 class="font-bold mb-2 text-xl">बड़ी ख़बरें</h2>
  </div>

  <!-- badikhbre content -->
  <div
    class="badikhbre-widget grid grid-cols-1 items-center lg:grid-cols-3 md:grid-cols-1 lg:gap-4 gap-3 overflow-hidden mb-4"
  >
    <div class="badikhbre-left">
      <ul class="flex-1 flex flex-col overflow-y-auto">
        {#each newsItems as item}
          <li class="border-b border-gray-100">
            <a
              title={item.title}
              href={item.href}
              class="text-sm sm:text-lg lg:text-sm">{item.title}</a
            >
          </li>
        {/each}
      </ul>
    </div>

    <div class="badikhbre-middle">
      <div class="panel-section">
        <!-- Added justify-between class -->
        <div class="player-sec flex flex-col">
          <div class="player-slider-rr overflow-hidden">
            <ul class="grid lg:grid-cols-3 grid-cols-3 gridcolsmd">
              <!-- Adjusted max width to accommodate for padding and border -->
              {#each playerItems as item}
                <li
                  class="border border-gray-300 rounded overflow-hidden bg-blue-100 mx-1"
                >
                  <a
                    class="flex flex-col items-start"
                    title={item.title}
                    href={item.href}
                  >
                    <div class="img-panl">
                      <img
                        class="w-96 h-30 object-cover"
                        src={item.imgSrc}
                        alt={item.altText}
                      />
                    </div>
                    <div class="text-panl m-1 overflow-hidden">
                      <div class="text-xs font-bold line-clamp-6">
                        {item.title}
                      </div>
                    </div>
                  </a>
                </li>
              {/each}
            </ul>
          </div>
          <div class="player-slider-rr flex-1 overflow-hidden mt-2">
            <ul class="grid lg:grid-cols-3 grid-cols-3 gridcolsmd">
              <!-- Adjusted max width to accommodate for padding and border -->
              {#each playerItems as item}
                <li
                  class="border border-gray-300 rounded overflow-hidden bg-blue-100 mx-1"
                >
                  <a
                    class="flex flex-col items-start"
                    title={item.title}
                    href={item.href}
                  >
                    <div class="img-panl">
                      <img
                        class="w-96 h-30 object-cover"
                        src={item.imgSrc}
                        alt={item.altText}
                      />
                    </div>
                    <div class="text-panl m-1">
                      <div class="text-xs line-clamp-8 font-bold">
                        {item.title}
                      </div>
                    </div>
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="badikhbre-right shadow-md rounded-md">
      {#each adds as add}
        <div class="">
          <figure>
            <img
              class=" p-2 md:h-52 md:w-full lg:h-56 lg:w-96"
              src={add.image}
              alt={add.name}
            />
          </figure>
          <div class="mb-1 p-1 h-full">
            <h2 class="text-lg font-bold">{add.name}</h2>
            <p class="text-gray-600 mt-2">{add.description}</p>
          </div>
          <div class="flex justify-end">
            <button
              class=" buttons mt-2 text-white text-end font-bold py-1 px-4 text-sm rounded"
            >
              Buy Now
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<!--visualstories  -->

<div id="wrapper p-2">
  <section class="visual_story">
    <div class="widget-head">
      <div class="hed-panel-common badi-khabar flex items-center">
        <span class="mr-2">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 55 55"
            style="enable-background:new 0 0 55 55;"
            xml:space="preserve"
            width={svgSize}
            height={svgSize}
          >
            <g>
              <g>
                <path
                  style="fill:#D91F26;"
                  d="M9.867,4h35.258c3.242,0,5.876,2.628,5.876,5.876v35.258c-0.011,2.373-1.452,4.508-3.644,5.406c-2.186,0.921-4.711,0.433-6.404-1.234L5.695,14.048c-1.67-1.687-2.158-4.218-1.234-6.404C5.359,5.446,7.494,4.012,9.867,4"
                ></path>
              </g>
            </g>
          </svg>
        </span>
        <h2 class="text-gray-900 font-black text-xl font-bold">
          विजुअल स्टोरीज़
        </h2>
      </div>
    </div>

    <div
      class=" my-3 flex flex-col md:flex-row gap-x-3 md:gap-y-4 sm:gap-y-4 space-y-2"
    >
      <!-- <div class="lg:w-[51vw] mb-2">
        <Carousel
          {images}
          class="  sm:h-[24rem] lg:h-[20rem] lg:w-[51vw] xl:h-[23rem]"
          imgClass="object-cover  rounded-sm "
          let:Indicators
          let:Controls
        >
          <Controls
            class="items-center text-red-400 dark:text-green-400 pt-4"
          />
        </Carousel> -->
      <!-- </div> -->

      <div
        class="adds w-full lg:h-[23rem] mt-0 md:w-96 bg-white shadow-md border rounded-md"
      >
        <figure
          class="lg:h-56 h-[37vh] overflow-hidden"
          style="align-content: center;"
        >
          <img
            class="p-1 md:w-96"
            src="https://cdn.pixabay.com/photo/2020/04/04/03/42/market-5000694_1280.png"
            alt="Shoes"
          />
        </figure>
        <div class="p-1 *sm:p-0">
          <h2 class="text-lg font-bold">Shoes!</h2>
          <p class="text-gray-600 mt-2">
            If a dog chews shoes whose shoes does he choose?
          </p>
          <div class="mt-2 flex justify-end">
            <button
              class=" buttons text-white text-sm font-bold py-1 px-4 rounded"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Story wrapper -->
    <Carouselcontainer />
  </section>
</div>

<style>
  @media (min-width: 768px) and (max-width: 1185px) {
    .custom-title {
      font-size: 0.8rem;
    }
    .custom-flex {
      flex-direction: row;
      align-items: center;
    }
    .custom-thumb,
    .custom-title {
      width: 50%;
      height: auto;
    }
    .custom-img {
      width: 100%;
      height: auto;
      max-height: 100%;
    }
  }

  @media (min-width: 945px) and (max-width: 1124px) {
    .custom-title {
      font-size: 0.8rem;
      height: auto;
      display: flex;
      align-items: center;
      overflow: hidden;
    }
  }

  @media screen and (min-width: 640px) and (max-width: 1279px) {
    .carouselvideo {
      height: 23rem !important;
    }
  }

  .thumb img {
    @apply rounded;
  }

  .title {
    @apply mt-2;
  }
</style>

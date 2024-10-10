<script>
  import { fade } from "svelte/transition";
  export let detail;

  import Carousel from "svelte-carousel";
  import "resize-observer-polyfill/dist/ResizeObserver.global";

  // import ResizeObserver from "resize-observer-polyfill";

  import { onMount } from "svelte";

  let isMobile = false;
  let showModal = false;
  let selectedVideo = "";

  const updateIsMobile = () => {
    isMobile = window.innerWidth <= 768;
  };

  onMount(() => {
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);

    return () => window.removeEventListener("resize", updateIsMobile);
  });

  function toggleModal(video) {
    selectedVideo = video;
    console.log(selectedVideo);
    showModal = !showModal;
  }
</script>

<div class="main-container pe-1 ps-5">
  <div class="center-div mb-4 bg-light" style="overflow: auto;" transition:fade>
    <div class="container-xxl py-5">
      <div class="container">
        <div class="row gy-5 gx-4">
          <div class="col-lg-8">
            <div class="d-flex align-items-center mb-5">
              <img
                class="flex-shrink-0 img-fluid border rounded"
                src={detail.objDetails.logo}
                alt=""
                style="width: 80px; height: 80px;"
              />
              <div class="text-start ps-4">
                <h3>{detail.objDetails.name}</h3>
                <span class=" text-truncate"
                  >{detail.objDetails.companyName}</span
                >&nbsp;&nbsp;
                <span class="text-truncate me-3"
                  ><i class="fa fa-map-marker-alt text-success me-2" />{detail
                    .objDetails.location}</span
                >
                <span class="text-truncate me-3"
                  ><i class="far fa-clock text-success me-2" />{detail
                    .objDetails.internshipType}</span
                >
                <span class="text-truncate me-0"
                  ><i class="far fa-money-bill-alt text-success me-2" />{detail
                    .objDetails.salary}</span
                >
              </div>
            </div>

            <div class="carousel-container w-full py-2">
              <Carousel>
                {#each detail.testimonials as testimonial, index}
                  {#if isMobile ? index % 1 === 0 : index % 3 === 0}
                    <div class="carousel-row flex justify-between gap-1">
                      {#each detail.testimonials.slice(index, isMobile ? index + 1 : index + 3) as testimonialSlice}
                        <div
                          class="story-slide shadow-sm rounded w-1/3 border border-gray-300"
                        >
                          <!-- <a
                              href={testimonialSlice.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              class="block text-center"
                            >
                              {#if testimonialSlice.video}
                                <video
                                  class="w-full h-auto aspect-video video"
                                  controls
                                  on:mouseenter={handleMouseEnter}
                                  on:mouseleave={handleMouseLeave}
                                >
                                  <source
                                    src={testimonialSlice.video}
                                    type="video/mp4"
                                  />
                                  Your browser does not support the video tag.
                                </video>
                              {:else}
                                <img
                                  src={testimonialSlice.image}
                                  alt={testimonialSlice.testimonial}
                                  class="w-full h-auto"
                                />
                              {/if}
                              <div class=" p-2 text-sm bg-green-200">
                                <blockquote
                                  class="text-sm italic font-semibold text-gray-900 dark:text-white"
                                >
                                  {testimonialSlice.testimonial}
                                </blockquote>
                              </div>
                            </a> -->
                          <a
                            href="#my_modal_9"
                            class=""
                            on:click={() => toggleModal(testimonialSlice.link)}
                          >
                            <div class=" video-thumbnail-container">
                              <img
                                transition:fade
                                src={testimonialSlice.thumbnail}
                                alt="Video Thumbnail"
                                class="video-thumbnail rounded-b-none aspect-video object-cover lg:h-full lg:w-screen"
                              />
                              <div class="play-button border-0">
                                <i class="fa-solid fa-play text-danger" />
                              </div>
                            </div>
                          </a>

                          <blockquote
                            class="p-2 border-s-4 border-green-500 bg-gray-100 dark:border-gray-500 dark:bg-gray-800"
                          >
                            <p
                              class="text-sm italic font-medium text-gray-900 dark:text-white"
                            >
                              {testimonialSlice.testimonial}
                            </p>
                          </blockquote>
                        </div>
                      {/each}
                    </div>
                  {/if}
                {/each}
              </Carousel>
            </div>
            {#if showModal}
              <div
                class="modal "
                style="z-index: 9999999999!important;"
                role="dialog"
                id="my_modal_9"
                transition:fade
              >
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
                <form method="dialog" class="modal-backdrop z-2">
                  <button>close</button>
                </form>
              </div>
            {/if}
            <div class="mb-5">
              <h4 class="mb-3">Internship description</h4>
              <p>{detail.objDetails.description}</p>

              <h4 class="mb-3">Responsibility</h4>
              <p>{detail.objDetails.responsibilityHeader}</p>
              <ul>
                {#each detail.objDetails.responsibilityData as responsibility}
                  <li>
                    <i class="fa fa-angle-right text-success me-2" />
                    {responsibility}
                  </li>
                {/each}
              </ul>

              <h4 class="mb-3">Qualifications</h4>
              <p>{detail.objDetails.qualificationHeader}</p>
              <ul>
                {#each detail.objDetails.qualificationData as qualification}
                  <li>
                    <i class="fa fa-angle-right text-success me-2" />
                    {qualification}
                  </li>
                {/each}
              </ul>
            </div>

            <div style="list-style: none;">
              <a href={`/internshipDetails/${detail.jo}/apply`}>
                <button class="btn btn-success" type="submit">Apply Now</button>
              </a>
            </div>
          </div>

          <div class="col-lg-4">
            <div
              class="bg-light rounded p-5 mb-4 wow slideInUp"
              data-wow-delay="0.1s"
              style="background-color: #EFFDF5;"
            >
              <h4 class="mb-4">Internship Summary</h4>
              <p>
                <i class="fa fa-angle-right text-success me-2" />Published On: {detail
                  .objDetails.publishedOn}
              </p>
              <p>
                <i class="fa fa-angle-right text-success me-2" />Vacancy: {detail
                  .objDetails.vacancy}
                Position
              </p>
              <p>
                <i class="fa fa-angle-right text-success me-2" />Internship
                Nature: {detail.objDetails.internshipType}
              </p>
              <p>
                <i class="fa fa-angle-right text-success me-2" />Salary: {detail
                  .objDetails.salary}
              </p>
              <p>
                <i class="fa fa-angle-right text-success me-2" />Location: {detail
                  .objDetails.location}
              </p>
              <p class="m-0">
                <i class="fa fa-angle-right text-success me-2" />Date Line: {detail
                  .objDetails.expireOn}
              </p>
            </div>
            <div
              class="bg-light rounded p-5 wow slideInUp"
              data-wow-delay="0.1s"
            >
              <h4 class="mb-4">Company Detail</h4>
              <p class="m-0">{detail.objDetails.companyDetail}.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  h1 {
    font-weight: 700;
  }
  ul {
    padding: 0;
    list-style-type: none;
  }
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
  .video-thumbnail-container {
    position: relative;
    cursor: pointer;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;

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

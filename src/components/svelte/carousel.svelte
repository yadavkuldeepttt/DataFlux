<script>
  // import Carousel from "svelte-carousel";
  import "resize-observer-polyfill/dist/ResizeObserver.global";

  // import ResizeObserver from "resize-observer-polyfill";

  import { onMount } from "svelte";

  let visualstories = [
    {
      link: "https://www.aajtak.in/visualstories/sports/virat-kohli-angry-after-seeing-rishabh-pant-bat-shown-in-ipl-2024-rcb-vs-dc-match-reaction-video-viral-tspo-135961-15-05-2024",
      image:
        "https://akm-img-a-in.tosshub.com/sites/visualstory/wp/2024/05/cropped-kohli-Pant-grab-2-vs.jpg?size=138:184",
      title: "ऋषभ की हरकत देख भड़के कोहली! IPL मैच में दिखाया बल्ला, VIDEO",
    },
    {
      link: "https://www.aajtak.in/visualstories/auto/massive-challan-at-petrol-pumps-if-vehicle-owners-found-without-valid-puc-certificate-135953-15-05-2024",
      image:
        "https://akm-img-a-in.tosshub.com/sites/visualstory/wp/2024/03/cropped-Petrol-Pump-PUC-Certificate-amp.jpg?size=138:184",
      title:
        "पेट्रोल पंप पर पहुंचते ही कटेगा 10,000 का चालान! तत्काल बनवा लें गाड़ी का ये पेपर",
    },
    {
      link: "https://www.aajtak.in/visualstories/sports/virat-kohli-angry-after-seeing-rishabh-pant-bat-shown-in-ipl-2024-rcb-vs-dc-match-reaction-video-viral-tspo-135961-15-05-2024",
      image:
        "https://akm-img-a-in.tosshub.com/sites/visualstory/wp/2024/05/cropped-kohli-Pant-grab-2-vs.jpg?size=138:184",
      title: "ऋषभ की हरकत देख भड़के कोहली! IPL मैच में दिखाया बल्ला, VIDEO",
    },
    {
      link: "https://www.aajtak.in/visualstories/sports/virat-kohli-angry-after-seeing-rishabh-pant-bat-shown-in-ipl-2024-rcb-vs-dc-match-reaction-video-viral-tspo-135961-15-05-2024",
      image:
        "https://akm-img-a-in.tosshub.com/sites/visualstory/wp/2024/05/cropped-kohli-Pant-grab-2-vs.jpg?size=138:184",
      title: "ऋषभ की हरकत देख भड़के कोहली! IPL मैच में दिखाया बल्ला, VIDEO",
    },
    {
      link: "https://www.aajtak.in/visualstories/auto/massive-challan-at-petrol-pumps-if-vehicle-owners-found-without-valid-puc-certificate-135953-15-05-2024",
      image:
        "https://akm-img-a-in.tosshub.com/sites/visualstory/wp/2024/03/cropped-Petrol-Pump-PUC-Certificate-amp.jpg?size=138:184",
      title:
        "पेट्रोल पंप पर पहुंचते ही कटेगा 10,000 का चालान! तत्काल बनवा लें गाड़ी का ये पेपर",
    },
    {
      link: "https://www.aajtak.in/visualstories/sports/virat-kohli-angry-after-seeing-rishabh-pant-bat-shown-in-ipl-2024-rcb-vs-dc-match-reaction-video-viral-tspo-135961-15-05-2024",
      image:
        "https://akm-img-a-in.tosshub.com/sites/visualstory/wp/2024/05/cropped-kohli-Pant-grab-2-vs.jpg?size=138:184",
      title: "ऋषभ की हरकत देख भड़के कोहली! IPL मैच में दिखाया बल्ला, VIDEO",
    },
    {
      link: "https://www.aajtak.in/visualstories/sports/virat-kohli-angry-after-seeing-rishabh-pant-bat-shown-in-ipl-2024-rcb-vs-dc-match-reaction-video-viral-tspo-135961-15-05-2024",
      image:
        "https://akm-img-a-in.tosshub.com/sites/visualstory/wp/2024/05/cropped-kohli-Pant-grab-2-vs.jpg?size=138:184",
      title: "ऋषभ की हरकत देख भड़के कोहली! IPL मैच में दिखाया बल्ला, VIDEO",
    },
    {
      link: "https://www.aajtak.in/visualstories/auto/massive-challan-at-petrol-pumps-if-vehicle-owners-found-without-valid-puc-certificate-135953-15-05-2024",
      image:
        "https://akm-img-a-in.tosshub.com/sites/visualstory/wp/2024/03/cropped-Petrol-Pump-PUC-Certificate-amp.jpg?size=138:184",
      title:
        "पेट्रोल पंप पर पहुंचते ही कटेगा 10,000 का चालान! तत्काल बनवा लें गाड़ी का ये पेपर",
    },
    {
      link: "https://www.aajtak.in/visualstories/sports/virat-kohli-angry-after-seeing-rishabh-pant-bat-shown-in-ipl-2024-rcb-vs-dc-match-reaction-video-viral-tspo-135961-15-05-2024",
      image:
        "https://akm-img-a-in.tosshub.com/sites/visualstory/wp/2024/05/cropped-kohli-Pant-grab-2-vs.jpg?size=138:184",
      title: "ऋषभ की हरकत देख भड़के कोहली! IPL मैच में दिखाया बल्ला, VIDEO",
    },
    {
      link: "https://www.aajtak.in/visualstories/sports/virat-kohli-angry-after-seeing-rishabh-pant-bat-shown-in-ipl-2024-rcb-vs-dc-match-reaction-video-viral-tspo-135961-15-05-2024",
      image:
        "https://akm-img-a-in.tosshub.com/sites/visualstory/wp/2024/05/cropped-kohli-Pant-grab-2-vs.jpg?size=138:184",
      title: "ऋषभ की हरकत देख भड़के कोहली! IPL मैच में दिखाया बल्ला, VIDEO",
    },
    {
      link: "https://www.aajtak.in/visualstories/auto/massive-challan-at-petrol-pumps-if-vehicle-owners-found-without-valid-puc-certificate-135953-15-05-2024",
      image:
        "https://akm-img-a-in.tosshub.com/sites/visualstory/wp/2024/03/cropped-Petrol-Pump-PUC-Certificate-amp.jpg?size=138:184",
      title:
        "पेट्रोल पंप पर पहुंचते ही कटेगा 10,000 का चालान! तत्काल बनवा लें गाड़ी का ये पेपर",
    },
    {
      link: "https://www.aajtak.in/visualstories/sports/virat-kohli-angry-after-seeing-rishabh-pant-bat-shown-in-ipl-2024-rcb-vs-dc-match-reaction-video-viral-tspo-135961-15-05-2024",
      image:
        "https://akm-img-a-in.tosshub.com/sites/visualstory/wp/2024/05/cropped-kohli-Pant-grab-2-vs.jpg?size=138:184",
      title: "ऋषभ की हरकत देख भड़के कोहली! IPL मैच में दिखाया बल्ला, VIDEO",
    },
  ];

  let isMobile = false;

  const updateIsMobile = () => {
    isMobile = window.innerWidth <= 768;
  };

  onMount(() => {
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  });
</script>

<div class="carousel-container w-full py-2">
  <!-- <Carousel>
    {#each visualstories as story, index}
      {#if isMobile ? index % 3 === 0 : index % 6 === 0}
        <div class="carousel-row flex justify-between">
          {#each visualstories.slice(index, isMobile ? index + 3 : index + 6) as storySlice}
            <div class="story-slide w-1/3 px-2 border border-gray-300 p-2">
              <a
                href={storySlice.link}
                target="_blank"
                rel="noopener noreferrer"
                class="block text-center"
              >
                <img
                  src={storySlice.image}
                  alt={storySlice.title}
                  class="w-full h-auto"
                />
                <p class="mt-2 text-sm text-gray-700">{storySlice.title}</p>
              </a>
            </div>
          {/each}
        </div>
      {/if}
    {/each}
  </Carousel> -->
</div>

<style>
  /* Add custom styles here if needed */
</style>

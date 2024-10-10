<script>
  import Carousel from "svelte-carousel";
  import "resize-observer-polyfill/dist/ResizeObserver.global";

  const videos = [
    {
      url: "https://www.youtube.com/shorts/bse-euNJtjA",
      thumbnail:
        "https://media.istockphoto.com/id/1933752815/photo/modern-interior-of-living-room-with-leather-armchair-on-wood-flooring-and-dark-blue-wall.jpg?s=1024x1024&w=is&k=20&c=zJyB6GTOGorMV4Uo3HhYdpmKUblV-jzCW0Ib5E3zuZQ=", // Add thumbnail URL
      title: "Video 1",
    },
    {
      url: "https://www.youtube.com/shorts/bse-euNJtjA",
      thumbnail:
        "https://media.istockphoto.com/id/1933752815/photo/modern-interior-of-living-room-with-leather-armchair-on-wood-flooring-and-dark-blue-wall.jpg?s=1024x1024&w=is&k=20&c=zJyB6GTOGorMV4Uo3HhYdpmKUblV-jzCW0Ib5E3zuZQ=", // Add thumbnail URL
      title: "Video 2",
    },
    {
      url: "https://www.youtube.com/shorts/bse-euNJtjA",
      thumbnail:
        "https://media.istockphoto.com/id/1933752815/photo/modern-interior-of-living-room-with-leather-armchair-on-wood-flooring-and-dark-blue-wall.jpg?s=1024x1024&w=is&k=20&c=zJyB6GTOGorMV4Uo3HhYdpmKUblV-jzCW0Ib5E3zuZQ=", // Add thumbnail URL
      title: "Video 3",
    },
    {
      url: "https://www.youtube.com/shorts/bse-euNJtjA",
      thumbnail:
        "https://media.istockphoto.com/id/1933752815/photo/modern-interior-of-living-room-with-leather-armchair-on-wood-flooring-and-dark-blue-wall.jpg?s=1024x1024&w=is&k=20&c=zJyB6GTOGorMV4Uo3HhYdpmKUblV-jzCW0Ib5E3zuZQ=", // Add thumbnail URL
      title: "Video 4",
    },
    {
      url: "https://www.youtube.com/shorts/bse-euNJtjA",
      thumbnail:
        "https://media.istockphoto.com/id/1933752815/photo/modern-interior-of-living-room-with-leather-armchair-on-wood-flooring-and-dark-blue-wall.jpg?s=1024x1024&w=is&k=20&c=zJyB6GTOGorMV4Uo3HhYdpmKUblV-jzCW0Ib5E3zuZQ=", // Add thumbnail URL
      title: "Video 5",
    },
    {
      url: "https://www.youtube.com/shorts/bse-euNJtjA",
      thumbnail:
        "https://media.istockphoto.com/id/1933752815/photo/modern-interior-of-living-room-with-leather-armchair-on-wood-flooring-and-dark-blue-wall.jpg?s=1024x1024&w=is&k=20&c=zJyB6GTOGorMV4Uo3HhYdpmKUblV-jzCW0Ib5E3zuZQ=", // Add thumbnail URL
      title: "Video 6",
    },
    {
      url: "https://www.youtube.com/shorts/bse-euNJtjA",
      thumbnail:
        "https://media.istockphoto.com/id/1933752815/photo/modern-interior-of-living-room-with-leather-armchair-on-wood-flooring-and-dark-blue-wall.jpg?s=1024x1024&w=is&k=20&c=zJyB6GTOGorMV4Uo3HhYdpmKUblV-jzCW0Ib5E3zuZQ=", // Add thumbnail URL
      title: "Video 7",
    },
    {
      url: "https://www.youtube.com/shorts/bse-euNJtjA",
      thumbnail:
        "https://media.istockphoto.com/id/1933752815/photo/modern-interior-of-living-room-with-leather-armchair-on-wood-flooring-and-dark-blue-wall.jpg?s=1024x1024&w=is&k=20&c=zJyB6GTOGorMV4Uo3HhYdpmKUblV-jzCW0Ib5E3zuZQ=", // Add thumbnail URL
      title: "Video 8",
    },
    // Add more videos as needed
  ];

  let carousel;

  const handleNextClick = () => {
    carousel.goToNext();
  };

  let playingVideo = null;

  const togglePlay = (event, videoIndex) => {
    const video = event.target;
    if (playingVideo && playingVideo !== video) {
      playingVideo.pause();
    }
    if (playingVideo === video && !video.paused) {
      video.pause();
    } else {
      video.play();
      playingVideo = video;
    }
  };
</script>

<div class="carousel-container">
  <Carousel
    bind:this={carousel}
    let:loaded
    autoplay
    autoplayDuration={4000}
    autoplayProgressVisible
  >
    {#each videos as video, videoIndex (video)}
      {#if videoIndex % 2 === 0}
        <div class="video-slide">
          {#if loaded.includes(videoIndex)}
            <div class="video-wrapper">
              <div class="video-container">
                <a href={video.url} target="_blank" rel="noopener noreferrer">
                  <div
                    class="thumbnail-overlay"
                    style="background-image: url({video.thumbnail})"
                  ></div>
                  <!-- Add thumbnail overlay -->
                  <video
                    controls
                    preload="metadata"
                    src={video.url}
                    alt={video.title}
                    poster={video.thumbnail}
                    on:click={(event) => togglePlay(event, videoIndex)}
                  ></video>
                  <!-- Use thumbnail as poster -->
                  <i class="fas fa-play play-icon"></i>
                  <!-- Add first play icon -->
                  <i class="fas fa-play play-icon"></i>
                  <!-- Add second play icon -->
                  <p>{video.title}</p>
                </a>
              </div>
            </div>
          {/if}
          {#if videos[videoIndex + 1]}
            <!-- Check if there's a video next to this one -->
            <div class="video-wrapper">
              <div class="video-container">
                <a
                  href={videos[videoIndex + 1].url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    class="thumbnail-overlay"
                    style="background-image: url({videos[videoIndex + 1]
                      .thumbnail})"
                  ></div>
                  <!-- Add thumbnail overlay -->
                  <video
                    controls
                    preload="metadata"
                    src={videos[videoIndex + 1].url}
                    alt={videos[videoIndex + 1].title}
                    poster={videos[videoIndex + 1].thumbnail}
                    on:click={(event) => togglePlay(event, videoIndex + 1)}
                  ></video>
                  <!-- Use thumbnail as poster -->
                  <i class="fas fa-play play-icon"></i>
                  <!-- Add first play icon -->
                  <i class="fas fa-play play-icon"></i>
                  <!-- Add second play icon -->
                  <p>{videos[videoIndex + 1].title}</p>
                </a>
              </div>
            </div>
          {/if}
        </div>
      {/if}
    {/each}
  </Carousel>
</div>

<style>
  .carousel-container {
    max-width: 600px;
    max-height: 400px;
    overflow: hidden;
    position: relative; /* Add this */
  }

  .video-slide {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .video-wrapper {
    flex: 1;
    margin-right: 10px; /* Adjust margin as needed */
  }

  .video-wrapper:last-child {
    margin-right: 0;
  }

  .video-container {
    width: 100%;
    height: 100%;
    position: relative;
  }

  video {
    width: auto;
    max-width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
  }

  .thumbnail-overlay {
    /* Add this */
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    opacity: 0.7; /* Adjust opacity as needed */
    z-index: 1;
  }

  .play-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 3rem;
    z-index: 2;
  }

  .play-icon:first-child {
    transform: translate(-150%, -50%); /* Adjust position for first play icon */
  }

  .play-icon:last-child {
    transform: translate(50%, -50%); /* Adjust position for second play icon */
  }

  p {
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    padding: 5px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    z-index: 3; /* Ensure title is above thumbnail */
  }
</style>

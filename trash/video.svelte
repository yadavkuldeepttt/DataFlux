<!-- <script>
  import SimplePeer from "simple-peer";
  import io from "socket.io-client";

  let peer;
  let localStream;
  let remoteStream;

  const startCall = async () => {
    // Initialize socket connection
    const socket = io("http://localhost:5173"); // Update with your server URL

    peer = new SimplePeer({ initiator: true });

    // Listen for signal event
    peer.on("signal", (signal) => {
      socket.emit("signal", signal); // Send the signal to the other peer
    });

    // Listen for stream event
    peer.on("stream", (stream) => {
      remoteStream = stream;
    });

    // Get local video stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStream = stream;
        peer.addStream(stream);
      })
      .catch((err) => console.error("getUserMedia error:", err));
  };
  let localVideo;
  let remoteVideo;

  $: if (localStream) {
    localVideo.srcObject = localStream;
  }

  $: if (remoteStream) {
    remoteVideo.srcObject = remoteStream;
  }
</script>

<button class="btn btn-danger mx-1" on:click={startCall}>
  <i class="bi bi-camera-video" />
</button>

<video
  bind:this={localVideo}
  autoplay
  muted
  controls
  style="width: 320px; height: 240px;"
/>

<video
  bind:this={remoteVideo}
  autoplay
  controls
  style="width: 320px; height: 240px;"
/> -->

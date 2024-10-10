/** @type {import('svelte/action').Action}  */
export default function lazyLoadVideos(node) {
  const supported = 'IntersectionObserver' in window && 'MutationObserver' in window
  if (!supported) return

  const io = new IntersectionObserver((entries, observer) => {
    for (const { isIntersecting, target: video } of entries) {
      if (isIntersecting && video instanceof HTMLVideoElement) {
        video.load()
        video.classList.remove('lazy')
        observer.unobserve(video)
      }
    }
  })

  const mo = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const removedNode of Array.from(mutation.removedNodes)) {
        if (removedNode instanceof HTMLVideoElement && removedNode.classList.contains('lazy')) {
          io.unobserve(removedNode)
        }
      }
      for (const addedNode of Array.from(mutation.addedNodes)) {
        if (addedNode instanceof HTMLVideoElement && addedNode.classList.contains('lazy')) {
          io.observe(addedNode)
        }
      }
    }
  })

  // initialization for the IntersectionObserver (first load)
  const initialLazyVideos = Array.from(node.querySelectorAll('video.lazy'))
  for (const lazyVideo of initialLazyVideos) {
    io.observe(lazyVideo)
  }

  mo.observe(node, {
    childList: true,
    subtree: false,
  })

  return {
    destroy() {
      io.disconnect()
      mo.disconnect()
    },
  }
}
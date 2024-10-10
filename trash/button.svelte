<script>
  function toggle() {
    window.document.body.classList.toggle("dark-mode");
  }
</script>

<button on:click={toggle}> Theme </button>

<style>
  button {
    background-color: #f76027;
    color: white;
    border: none;
    font-size: 10px;
    border-radius: 4px;
    padding: 0.4rem 0.2rem;
  }
  :global(body.dark-mode) button {
    background-color: #0084f6;
    color: white;
  }
</style>

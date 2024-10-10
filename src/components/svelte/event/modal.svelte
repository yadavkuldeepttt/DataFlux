<script>
  import { fly } from "svelte/transition";
  import { fade } from "svelte/transition";
  export let showModal;
  let dialog;

  $: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
  in:fly={{ x: -200, duration: 2000 }}
  out:fade
  bind:this={dialog}
  on:close={() => (showModal = false)}
  on:click|self={() => dialog.close()}
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:click|stopPropagation>
    <slot name="header" />
    <slot />
    <div class="text-end mt-3">
      <button
        class="btn btn-danger mx-2 mt-3 d-inline"
        autofocus
        on:click={() => dialog.close()}>Close</button
      >
    </div>
  </div>
</dialog>

<style>
  .btn:focus {
    box-shadow: none;
  }
  dialog {
    max-width: 100%;
    border-radius: 15px;
    border: none;
    padding: 0;
    position: absolute;
    width: 90%;
    box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.06);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.5s ease-in-out;
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }
  dialog > div {
    padding: 1em;
  }
  /* dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  } */
  dialog[open]::-webkit-scrollbar {
    width: 5px;
  }
  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }
  /* dialog[open]::backdrop {
    animation: fade 0.4s ease-out;
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  } */
  button {
    display: block;
  }
</style>

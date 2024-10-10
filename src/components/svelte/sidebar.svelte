<script>
  import { fade, fly } from "svelte/transition";
  import * as C from "../../apiData/config";
  import { onMount } from "svelte";
  import Subscribe from "./subscribe.svelte";

  let openSubMenu = {};
  // let subscribe = false;

  // function showSubscribeBox() {
  //   subscribe = !subscribe;
  // }

  function toggleSubMenu(menuItem) {
    openSubMenu[menuItem.name] = !openSubMenu[menuItem.name];
  }

  const changeTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
  };

  let auth2;
  let token;

  function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId());
    console.log("Name: " + profile.getName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);

    fetch(`${C.default.objDetails.baseUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_token: id_token }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "data");
        token = response.token;
        localStorage.setItem("token", token);
        if (data.message === "User authenticated" && token) {
          console.log("Authentication successful:", data.payload);
        } else {
          console.error("Authentication failed:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error sending token:", error);
      });
  }

  onMount(() => {
    const interval = setInterval(() => {
      if (window.gapi) {
        clearInterval(interval);
        gapi.load("auth2", () => {
          gapi.auth2
            .init({
              client_id:
                "903421820217-b6482d9nsronpftg0srsv172nhfuni2u.apps.googleusercontent.com", // Replace with your actual client ID
            })
            .then(() => {
              auth2 = gapi.auth2.getAuthInstance();
              document
                .getElementById("googleSignInButton")
                .addEventListener("click", () => {
                  auth2.signIn().then(onSignIn);
                });
            })
            .catch((error) => {
              console.error("Error initializing Google Auth:", error);
            });
        });
      }
    }, 100);
  });
</script>

<!--left div--------------------------------------->
<div
  class="offcanvas offcanvas-start shadow"
  data-bs-scroll="true"
  in:fly={{ x: -200, duration: 1500 }}
  out:fade
  tabindex="-1"
  id="offcanvasWithBothOptions"
  aria-labelledby="offcanvasWithBothOptionsLabel "
>
  <div
    class="offcanvas-body overflow-auto p-0"
    in:fly={{ x: -200, duration: 1500 }}
    out:fade
  >
    <div class="text-white shadow">
      <div class="d-flex justify-content-end cursor-pointer sidebar-close-btn">
        <button
          class=" border-0 py-0 pe-2 cursor-pointer"
          style="font-size: 17px;"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        >
          <i class="bx bx-x cursor-pointer" /></button
        >
      </div>

      <div
        class="d-flex px-2 justify-content-between align-items-center pb-1 pt-1 border-bottom sidebar-top"
      >
        <button
          id="googleSignInButton"
          class="btn btn-white btn-sm rounded-pill font600 signin text-xs"
          style="font-size:11px;background-color:var(--bs-danger);color:#fff!important"
        >
          Sign In
        </button>

        <button
          id="dropdownHoverButton"
          data-dropdown-toggle="dropdownHover"
          data-dropdown-trigger="hover"
          class="theme btn btn-outline-danger btn-sm rounded-pill text-black bg-gray-100 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-xs font-semibold text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
          >Theme
        </button>

        <!-- Dropdown menu -->
        <div
          id="dropdownHover"
          class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
        >
          <ul
            class="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownHoverButton"
          >
            <li>
              <a
                href="#"
                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                on:click={() => changeTheme("light")}>Light</a
              >
            </li>
            <li>
              <a
                href="#"
                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                on:click={() => changeTheme("dark")}>Dark</a
              >
            </li>
            <li>
              <a
                href="#"
                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                on:click={() => changeTheme("aqua")}>Aqua</a
              >
            </li>
            <li>
              <a
                href="#"
                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                on:click={() => changeTheme("retro")}>Retro</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="py-2 px-2 sidebar-content">
        <button
          onclick="my_modal_2.showModal()"
          style="font-size: 13px;background-color:var(--bs-background);"
          class="w-100 h-[1rem] btn justify-content-center rounded-pill btnsubscribe fw-bold d-flex align-items-center px-1 me-5"
          ><i class="bx bx-crown fs-7" />&nbsp;Subscribe</button
        >

        <div class="mt-3" style="color:black">
          {#each C.default.menu as menuItem}
            <div
              style="cursor: pointer;"
              on:click={() => toggleSubMenu(menuItem)}
              class="d-flex align-items-center pb-3"
            >
              <i
                class={menuItem.icon +
                  ` p-2 rounded-circle border bg-white shadow-lg ${menuItem.color} fs-6 me-3`}
              />
              {#if !menuItem.link}
                <div
                  style="cursor:text;font-size:14px;"
                  on:click={() => toggleSubMenu(menuItem)}
                  class="m-0 fw-bold text-decoration-none"
                >
                  {menuItem.name}
                </div>
              {:else}
                <a
                  href={menuItem.link}
                  style="font-size:14px"
                  class="m-0 fw-bold text-decoration-none">{menuItem.name}</a
                >
              {/if}
            </div>
            {#if menuItem.submenu && openSubMenu[menuItem.name]}
              {#each menuItem.submenu as subMenuItem}
                <div class="d-flex align-items-center pb-2 ps-4">
                  <i
                    style="font-size:13px"
                    class={subMenuItem.icon +
                      ` p-1 rounded-circle border bg-white shadow-lg ${subMenuItem.color} fs-7 me-2`}
                  />
                  <a
                    href={subMenuItem.link}
                    style="font-size:13px"
                    class="m-0 fw-bold text-decoration-none"
                  >
                    {subMenuItem.name}
                  </a>
                </div>
              {/each}
            {/if}
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<!-- {#if subscribe}
  <div class="absolute drop-shadow-lg rounded-lg left-[24%] top-[24%] z-50">
    <Subscribe />
  </div>
{/if} -->

<dialog id="my_modal_2" class="modal">
  <div class="modal-box max-w-4xl w-11/12">
    <Subscribe />
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<style>
  .popup {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border: 1px solid #fff;
    padding: 10px 20px;
    z-index: 9999;
    height: auto;
    overflow: auto;
    width: 50%;
    box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.6);
  }
  input:focus {
    box-shadow: none;
  }
</style>

<script>
  let isInitialized = false;
  export let signedIn;
  async function initializeGoogleClient() {
    if (!isInitialized) {
      gapi.load("auth2", async function () {
        try {
          await gapi.auth2.init({
            client_id:
              "502967510762-3gkro8toruv96svoogvkh64ndfcgc2rj.apps.googleusercontent.com",
          });
          isInitialized = true;
        } catch (error) {
          console.error("Google API Client Initialization Error", error);
        }
      });
    }
  }
  async function handleGoogleLogin() {
    initializeGoogleClient();
    try {
      const auth2 = gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();
      signedIn = true;
      // Handle successful sign-in
      console.log("Google Sign-In Successful", googleUser.getBasicProfile());
      alert(`Hello, ${profile.getName()}`);
    } catch (error) {
      // Handle sign-in error
      console.error("Google Sign-In Error", error);
    }
  }
</script>

<button class="btn btn-light" on:click={handleGoogleLogin}
  >Sign in with Google</button
>
<!-- AIzaSyDEezBZM6q4IKy8U29ouwKRDZZGeIZrgi8 -->
<!-- 502967510762-3gkro8toruv96svoogvkh64ndfcgc2rj.apps.googleusercontent.com -->

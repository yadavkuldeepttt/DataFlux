<!-- ContestPage.svelte -->
<script>
  import { activeContests, archivedContests } from "../../apiData/contest";
</script>

<div class="main-container">
  <div class="flex contest-header justify-between items-center">
    <h1 class="text-2xl font-bold mt-4 ml-4 mb-4">Contest Page</h1>

    <div>
      <button class="btn btn-1 mr-2">Button 1</button>
      <button class="btn">Button 2</button>
    </div>
  </div>
  <div class="center-div p-4" style="margin-top:10px">
    <div class="section active-contests">
      <h2 class="text-xl font-semibold mb-8">Active Contests</h2>
      <div class="flex flex-wrap -mx-4 mb-8">
        {#each activeContests as contest}
          <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-4 mb-4">
            <div class="contest-card bg-gray-100 rounded-lg shadow-md p-4">
              <div class="contest-details">
                <h3 class="text-lg font-semibold mb-1">{contest.name}</h3>
                <p class="text-gray-700 mb-1">
                  Start Date: {contest.startDate}
                </p>
                <p class="text-gray-700">End Date: {contest.endDate}</p>
              </div>
              <button
                class="view-details-btn mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                <a href={`/contestDetails/${contest.jo}`}>View Details</a
                ></button
              >
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="section archived-contests">
      <h2 class="text-xl font-semibold mb-8">Archived Contests</h2>
      <div class="flex flex-wrap -mx-4">
        {#each archivedContests as contest}
          <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-8 mb-4">
            <div class="contest-card bg-gray-100 rounded-lg shadow-md p-4">
              <div class="contest-details">
                <h3 class="text-lg font-semibold mb-1">{contest.name}</h3>
                <p class="text-gray-700 mb-1">
                  Start Date: {contest.startDate}
                </p>
                <p class="text-gray-700">End Date: {contest.endDate}</p>
              </div>
              <button
                class="view-details-btn mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >View Details</button
              >
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .contest-card {
    border-top: 3px solid red;
  }
  .btn {
    padding: 6px 12px;
    background-color: #2c502e;
    color: white;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    font-size: 18px;
    border: 1px solid black;
  }

  .contest-header {
    margin-top: 112px;
    margin-left: 5.2%;
    width: 102%; /* Adjusted width */
    padding: 2%;
    background-color: rgb(239, 242, 244);
  }

  .btn.btn-1 {
    background-color: white;
    color: black;
  }

  @media (max-width: 768px) {
    .contest-header {
      margin-top: 100px; /* Adjust margin for smaller screens */
      margin-left: 0; /* Reset left margin */
      width: 100%; /* Set width to 100% for smaller screens */
      padding: 10px; /* Adjust padding for smaller screens */
    }
    .btn.btn1 {
      margin-bottom: 3px;
    }
  }
</style>

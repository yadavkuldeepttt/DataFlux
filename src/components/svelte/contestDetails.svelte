<script>
    export let detail;
</script>


<div class="main-container ">
    <div class="center-div  p-4" >

<h1 class="text-2xl font-bold mb-4">{detail.objDetails.contestName}</h1>
<div class="flex">
<div class="section active-contests w-3/4">
  {#each detail.objDetails.questions as contest}
    <div class="contest-item flex justify-between items-center bg-gray-100 rounded-lg shadow-md p-4 mb-4">
      <div class="contest-details">
        <h3 class="text-lg font-semibold mb-1">{contest.name}</h3>
        <p class="text-gray-700 text-green-400 mb-1 inline" class:bg-green={contest.difficulty === 'easy'} class:bg-yellow={contest.difficulty === 'medium'} class:bg-red={contest.difficulty === 'hard'}>{contest.difficulty} </p>
        <p class="text-gray-700 inline">Max Score:  {contest.max_score}</p>
    </div>
      <button class="view-details-btn bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">View Details</button>
    </div>
  {/each}
</div>

<div class="ml-8 max-w-md w-screen overflow-hidden rounded-lg border border-gray-200 open:shadow-lg text-gray-700">

  <form action="" class="flex">
    <fieldset class="w-full">
      <legend class="block w-full bg-gray-50 px-5 py-3 text-[1rem] font-medium">Type</legend>

      <div class="space-y-2 px-5 py-6">
        <div class="flex items-center">
          <input id="New" type="checkbox" name="type[New]" class="h-5 w-5 rounded border-gray-300" checked />

          <label for="New" class="ml-3 text-sm font-medium"> Solved </label>
        </div>

        <div class="flex items-center">
          <input id="Used" type="checkbox" name="type[Used]" class="h-5 w-5 rounded border-gray-300" />

          <label for="Used" class="ml-3 text-sm font-medium"> Unsolved </label>
        </div>

        
    </fieldset>

  </form>
  <div class="">
    <div class="flex justify-between border-t border-gray-200 px-5 py-3">
      <button name="commit" type="button" class="rounded bg-blue-600 px-5 py-3 text-xs font-medium text-white active:scale-95">Apply Filters</button>
    </div>
  </div>
</div>

</div>
</div>
</div>

<style>
  /* Add any additional styles here */
  .bg-green {
    color: green;
  }

  .bg-yellow {
   color: rgb(131, 131, 86);
  }

  .bg-red {
    color: red;
  }
  </style>
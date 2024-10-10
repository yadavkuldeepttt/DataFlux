<script>
  // for timer
  // Get the current time in seconds
  const currentTime = new Date();
  const currentTimeInSeconds = Math.round(currentTime.getTime() / 1000);
  const currentTimeInSeconds2 = Math.round(
    currentTime.getHours() * 3600 +
      currentTime.getMinutes() * 60 +
      currentTime.getSeconds()
  );

  // close the task description section if time up
  let taskDescription = false;
  let timeInput = "";
  let timeInput2 = "";
  let ongoingtime = 0;
  let ongoingtime2 = 0;
  let timerInterval1;
  let timerInterval2;
  let timerInterval3;
  let timerInterval4;
  let hours1 = 0;
  let minutes1 = 0;
  let seconds1 = 0;
  let hours2 = 0;
  let minutes2 = 0;
  let seconds2 = 0;
  let hours3 = 0;
  let minutes3 = 0;
  let seconds3 = 0;
  let hours4 = 0;
  let minutes4 = 0;
  let seconds4 = 0;
  let difference = 0;
  let difference2 = 0;
  let showTime = false;
  let showTime2 = false;
  // Function to update the timer display for difference to 0
  const updateDisplay1 = () => {
    hours1 = Math.floor(difference / 3600);
    minutes1 = Math.floor((difference % 3600) / 60);
    seconds1 = difference % 60;
  };

  // Function to update the timer display for 0 to difference
  const updateDisplay2 = () => {
    hours2 = Math.floor(ongoingtime / 3600);
    minutes2 = Math.floor((ongoingtime % 3600) / 60);
    seconds2 = ongoingtime % 60;
  };
  const updateDisplay3 = () => {
    hours3 = Math.floor(difference2 / 3600);
    minutes3 = Math.floor((difference2 % 3600) / 60);
    seconds3 = difference2 % 60;
  };

  // Function to update the timer display for 0 to difference
  const updateDisplay4 = () => {
    hours4 = Math.floor(ongoingtime2 / 3600);
    minutes4 = Math.floor((ongoingtime2 % 3600) / 60);
    seconds4 = ongoingtime2 % 60;
  };

  // Function to start both timers
  const startTimers = () => {
    if (!timerInterval1 && !timerInterval2) {
      timerInterval1 = setInterval(() => {
        difference--;
        updateDisplay1();
        taskDescription = true;
        isFirstColContent = true;
        if (difference <= 0) {
          clearInterval(timerInterval1);
          timerInterval1 = null;
          alert("Time Up");
          // close the task description section if time up
          taskDescription = false;
          isFirstColContent = false;
        }
      }, 1000);

      timerInterval2 = setInterval(() => {
        if (ongoingtime !== difference) {
          ongoingtime++;
        } else {
          clearInterval(timerInterval2);
          timerInterval2 = null;
        }
        updateDisplay2();
      }, 1000);
    }
  };
  const startTimers2 = () => {
    if (!timerInterval3 && !timerInterval4) {
      timerInterval3 = setInterval(() => {
        difference2--;
        updateDisplay3();
        if (difference2 <= 0) {
          clearInterval(timerInterval3);
          timerInterval3 = null;
          alert("Time Up");
        }
      }, 1000);

      timerInterval4 = setInterval(() => {
        if (ongoingtime2 !== difference2) {
          ongoingtime2++;
        } else {
          clearInterval(timerInterval4);
          timerInterval4 = null;
        }
        updateDisplay4();
      }, 1000);
    }
  };

  // Function to pause the timers
  const pauseTimers = () => {
    clearInterval(timerInterval1);
    clearInterval(timerInterval2);
    timerInterval1 = null;
    timerInterval2 = null;
  };

  // Function to stop the timers
  const stopTimers = () => {
    clearInterval(timerInterval1);
    clearInterval(timerInterval2);
    timerInterval1 = null;
    timerInterval2 = null;
    difference = 0;
    updateDisplay1();
    updateDisplay2();
  };

  const pauseTimers2 = () => {
    clearInterval(timerInterval3);
    clearInterval(timerInterval4);
    timerInterval3 = null;
    timerInterval4 = null;
  };

  // Function to stop the timers
  const stopTimers2 = () => {
    clearInterval(timerInterval3);
    clearInterval(timerInterval4);
    timerInterval3 = null;
    timerInterval4 = null;
    difference = 0;
    updateDisplay3();
    updateDisplay4();
  };

  // Function to set the time input and start the countdown
  const setTimeLeft = () => {
    const userInput = new Date(timeInput);
    const inputTimeInSeconds = Math.round(userInput.getTime() / 1000);
    if (
      !isNaN(inputTimeInSeconds) &&
      inputTimeInSeconds >= currentTimeInSeconds
    ) {
      difference = inputTimeInSeconds - currentTimeInSeconds;
      updateDisplay1();
      updateDisplay2();
    } else {
      alert("Please enter a valid future time.");
    }
    showTime = true;
    // taskDescription = true;
  };
  const setTimeLeft2 = () => {
    const userInput = timeInput2.split(":");
    const inputTimeInSeconds =
      parseInt(userInput[0]) * 3600 + parseInt(userInput[1]) * 60;
    if (
      !isNaN(inputTimeInSeconds) &&
      inputTimeInSeconds >= currentTimeInSeconds2
    ) {
      ongoingtime2 = 0;
      difference2 = inputTimeInSeconds - currentTimeInSeconds2;
    } else {
      alert("Please enter a valid future time for Timer 2.");
    }
    showTime2 = true;
  };
  // Call the updateDisplay function on mount
  onMount(() => {
    updateDisplay1();
    updateDisplay2();
    updateDisplay3();
    updateDisplay4();
  });
</script>
       <!-- <div>
              <div class="d-flex align-items-center gap-1">
                <div>
                  {#if showTime}
                    <div
                      style="font-size: 10px;"
                      class="alert alert-primary d-flex justify-content-between w-100 py-1 px-1 mb-0"
                    >
                      {#if difference >= 0}
                        {hours1}:{String(minutes1).padStart(2, "0")}:{String(
                          seconds1
                        ).padStart(2, "0")}
                      {:else}
                        <span style="font-size: 12px;">
                          First Timer (Difference to 0) Time Expired
                        </span>
                      {/if}
                      &nbsp;&nbsp;
                      <div>
                        {#if difference >= 0}
                          {hours2}:{String(minutes2).padStart(2, "0")}:{String(
                            seconds2
                          ).padStart(2, "0")}
                        {:else}
                          <span style="font-size: 12px;">
                            Second Timer (0 to Difference) Time Expired
                          </span>
                        {/if}
                      </div>
                    </div>
                <div class="alert alert-primary w-75 py-1 px-2 mb-0"></div> 
                    <div class="mt-1">
                      <button
                        class="btn btn-light btn-sm py-0 px-1"
                        style="font-size: 10px;"
                        on:click={startTimers}>Start</button
                      >
                      <button
                        class="btn btn-light btn-sm py-0 px-1"
                        style="font-size: 10px;"
                        on:click={pauseTimers}>Pause</button
                      >
                      <button
                        class="btn btn-light btn-sm py-0 px-1"
                        style="font-size: 10px;"
                        on:click={stopTimers}>Stop</button
                      >
                    </div>
                  {:else}
                    <div class="d-flex gap-1 align-items-center">
                      <input
                        type="datetime-local"
                        class="w-50 form-control bg-light p-1"
                        style="font-size:10px;outline:0"
                        bind:value={timeInput}
                        placeholder="Enter time in seconds"
                      />
                      <button
                        class="btn btn-sm btn-primary py-1 px-2"
                        style="font-size: 10px;"
                        on:click={setTimeLeft}>Set</button
                      >
                    </div>
                  {/if}
                </div>
                <br />

                {#if showTime2}
                  <div class="d-flex flex-column align-items-center">
                    <div
                      style="font-size: 10px;"
                      class="alert alert-danger d-flex justify-content-between w-100 py-1 px-1 mb-0"
                    >
                      {#if difference2 >= 0}
                        {hours3}:{String(minutes3).padStart(2, "0")}:{String(
                          seconds3
                        ).padStart(2, "0")}
                      {:else}
                        <span style="font-size: 12px;">
                          First Timer (Difference to 0) Time Expired
                        </span>
                      {/if}
                      &nbsp;&nbsp;
                      <div>
                        {#if difference2 >= 0}
                          {hours4}:{String(minutes4).padStart(2, "0")}:{String(
                            seconds4
                          ).padStart(2, "0")}
                        {:else}
                          <span style="font-size: 12px;">
                            Second Timer (0 to Difference) Time Expired
                          </span>
                        {/if}
                      </div>
                    </div>
                    <div class="mt-1">
                      <button
                        class="btn btn-light btn-sm py-0 px-1"
                        style="font-size: 10px;"
                        on:click={startTimers2}>Start</button
                      >
                      <button
                        class="btn btn-light btn-sm py-0 px-1"
                        style="font-size: 10px;"
                        on:click={pauseTimers2}>Pause</button
                      >
                      <button
                        class="btn btn-light btn-sm py-0 px-1"
                        style="font-size: 10px;"
                        on:click={stopTimers2}>Stop</button
                      >
                    </div>
                  </div>
                {:else}
                  <div class="d-flex gap-1 align-items-center">
                    <input
                      type="time"
                      class="w-100 form-control bg-light p-1"
                      style="font-size:10px;outline:0"
                      bind:value={timeInput2}
                      placeholder="Enter time in seconds"
                    />
                    <button
                      class="btn btn-sm btn-primary py-1 px-2"
                      style="font-size: 10px;"
                      on:click={setTimeLeft2}>Set</button
                    >
                  </div>
                {/if}
              </div>
            </div> -->
      
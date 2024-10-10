<script>
  import { onMount } from "svelte";
  import { events } from "../../../apiData/event";

  let isDropdownVisible1 = false;
  let isDropdownVisible2 = false;
  let isDropdownVisible3 = false;
  let isDropdownVisible4 = false;

  const handleDropdown1 = () => {
    isDropdownVisible1 = !isDropdownVisible1;
  };
  const handleDropdown2 = () => {
    isDropdownVisible2 = !isDropdownVisible2;
  };
  const handleDropdown3 = () => {
    isDropdownVisible3 = !isDropdownVisible3;
  };
  const handleDropdown4 = () => {
    isDropdownVisible4 = !isDropdownVisible4;
  };

  onMount(() => {
    isDropdownVisible1 = true;
  });

  let selectedDateFilter = null;
  let filteredEvents = [];

  function handleDateFilter(filter) {
    selectedDateFilter = filter;
    filterEvents();
  }

  function filterEvents() {
    if (selectedDateFilter) {
      filteredEvents = events.filter(
        (event) => event.objDetails.date === selectedDateFilter
      );
    } else {
      filteredEvents = events;
    }
  }
  function initializeEvents() {
    filterEvents();
  }
  function showAllEvents() {
    selectedDateFilter = null;
    filterEvents();
  }

  onMount(() => {
    initializeEvents();
  });
</script>

<!--header breadcrumb start-->
<div class="header-breadcrumb">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="inner-bread-cont text-center">
          <h2>Event</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb justify-content-center">
              <li class="breadcrumb-item"><a href="/">Home</a></li>
              <li class="breadcrumb-item active" aria-current="page">Event</li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  </div>
  <!--/.container-->
</div>
<!--header breadcrumb end-->

<!-- event schedule sec start -->

<section class="event-schedule-sec light px-120">
  <div class="container-fluid">
    <div class="row gy-4">
      <div class="col-12">
        <div class="sec-title text-center">
          <h4>
            <img
              src="https://placehold.co/1700x170"
              data-aos="flip-left"
              data-aos-duration="1500"
              alt=""
            /> Events Schedule 2024
          </h4>
          <h2> Events Schedule</h2>
        </div>
      </div>
    </div>
    <div class="row g-4 p-5">
      <div class="col-4">
        <div class="filter_heading" style="font-weight: bold;font-size:1.3rem">
          Filters
        </div>
        <div
          class="filter_time_box filter_box px-3 bg-white mb-2 mt-4"
          style="width:76%"
        >
          <div class="d-flex justify-content-between p-2">
            <div
              class="d-flex align-items-center over"
              on:click={handleDropdown1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 15 10"
                height="12"
                width="12"
                ><path
                  fill="none"
                  stroke="#666666"
                  stroke-width="1.5"
                  d="M335 3L342 9.5 335 16"
                  transform="matrix(0 -1 -1 0 17 344)"
                /></svg
              >
              <div class="text-danger px-2" style="font-size: 0.8rem;">
                Date
              </div>
            </div>
            <div style="font-size: 0.8rem;">Clear</div>
          </div>

          {#if isDropdownVisible1}
            <div class="filter_dropdown">
              <div class="filter_buttons" style="font-size: 13px;">
                <button
                  type="button"
                  class="btn btn-outline-danger m-2"
                  on:click={showAllEvents}>All</button
                >

                <button
                  type="button"
                  class="btn btn-outline-danger m-2"
                  on:click={() => handleDateFilter("Thu, 23 Oct")}>Today</button
                >
                <button
                  type="button"
                  class="btn btn-outline-danger"
                  on:click={() => handleDateFilter("Fri, 24 Oct")}
                  >Tomorrow</button
                >
                <button
                  type="button"
                  class="btn btn-outline-danger m-2"
                  on:click={() => handleDateFilter("Sun, 26 Oct")}
                  >This Weekened</button
                >
              </div>
              <div class="date_filter p-1" style="margin:0.2rem 0.4rem">
                <label for="" style="font-size: 15px;">Date:</label>
                <input
                  type="date"
                  class="text-secondary m-2"
                  style="border:1px solid lightgrey;"
                />&nbsp;
              </div>
            </div>
          {/if}
        </div>

        <div class="filter_time_box filter_box px-3 bg-white" style="width:76%">
          <div class="d-flex justify-content-between p-2">
            <div
              class="d-flex align-items-center over"
              on:click={handleDropdown2}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 15 10"
                height="12"
                width="12"
                ><path
                  fill="none"
                  stroke="#666666"
                  stroke-width="1.5"
                  d="M335 3L342 9.5 335 16"
                  transform="matrix(0 -1 -1 0 17 344)"
                /></svg
              >
              <div class="px-2" style="font-size: 0.8rem;">Languages</div>
            </div>
            <div style="font-size: 0.8rem;">Clear</div>
          </div>

          {#if isDropdownVisible2}
            <div class="filter_dropdown">
              <div class="filter_buttons" style="font-size: 13px;">
                <button type="button" class="btn btn-outline-danger m-2"
                  >English</button
                >
                <button type="button" class="btn btn-outline-danger"
                  >Hindi</button
                > 
              </div>
            </div>
          {/if}
        </div>

        <div
          class="filter_time_box filter_box px-3 bg-white mt-2"
          style="width:76%"
        >
          <div class="d-flex justify-content-between p-2">
            <div
              class="d-flex align-items-center over"
              on:click={handleDropdown3}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 15 10"
                height="12"
                width="12"
                ><path
                  fill="none"
                  stroke="#666666"
                  stroke-width="1.5"
                  d="M335 3L342 9.5 335 16"
                  transform="matrix(0 -1 -1 0 17 344)"
                /></svg
              >
              <div class="px-2" style="font-size: 0.8rem;">Price</div>
            </div>
            <div style="font-size: 0.8rem;">Clear</div>
          </div>
          {#if isDropdownVisible3}
            <div class="filter_dropdown">
              <div class="filter_buttons" style="font-size: 13px;">
                <button type="button" class="btn btn-outline-danger m-2"
                  >Free</button
                >
                <button type="button" class="btn btn-outline-danger"
                  >0-500</button
                >
                <button type="button" class="btn btn-outline-danger m-2"
                  >501-2000</button
                > 
              </div>
            </div>
          {/if}
        </div>

        <div
          class="filter_time_box filter_box px-3 bg-white mt-2"
          style="width:76%"
        >
          <div class="d-flex justify-content-between p-2">
            <div class="d-flex align-items-center" on:click={handleDropdown4}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 15 10"
                height="12"
                width="12"
                ><path
                  fill="none"
                  stroke="#666666"
                  stroke-width="1.5"
                  d="M335 3L342 9.5 335 16"
                  transform="matrix(0 -1 -1 0 17 344)"
                /></svg
              >
              <div class="px-2" style="font-size: 0.8rem;">Other Filters</div>
            </div>
            <div style="font-size: 0.8rem;">Clear</div>
          </div>

          {#if isDropdownVisible4}
            <div class="filter_dropdown">
              <div class="filter_buttons" style="font-size: 13px;">
                <button type="button" class="btn btn-outline-danger m-2"
                  >Online Events</button
                > 
                <button type="button" class="btn btn-outline-danger m-2"
                  >Outdoor Events</button
                >
              </div>
            </div>
          {/if}
        </div>
      </div>

      <div class="col-8">
        <div class="events" style="font-weight: bold;font-size:1.3rem">
          Events
        </div>
        <div class="events_box mt-4">
          <div class="row g-5">
            {#if selectedDateFilter}
              {#each filteredEvents as event}
                <div class="col-lg-3">
                  <a href={`/event/details/${event.id}`}>
                    <div class="single-speaker-wrap" key={event.id}>
                      <div class="imgs">
                        <img src={event.objDetails.image} alt="" />
                        <div class="single_speaker_date px-2">
                          {event.objDetails.date}
                        </div>
                      </div>

                      <div class="cont mt-2">
                        <h4 class="mt-1 p-1" style="font-size:1.1rem;">
                          {event.objDetails.name}
                        </h4>
                        <span class="text-dark p-1"
                          >{event.objDetails.location}</span
                        ><br />
                        <span class="text-secondary p-1"
                          >{event.objDetails.type}</span
                        ><br />
                        <span class="p-1 text-secondary"
                          >{event.objDetails.price}</span
                        >
                      </div>
                    </div>
                  </a>
                </div>
              {/each}
            {:else}
              {#each events as event}
                <div class="col-lg-3" data-testid="eventList">
                  <a href={`/event/details/${event.id}`}>
                    <div class="single-speaker-wrap" key={event.id}>
                      <div class="imgs">
                        <img src={event.objDetails.image} alt="" />
                        <div class="single_speaker_date px-2">
                          {event.objDetails.date}
                        </div>
                      </div>

                      <div class="cont mt-2">
                        <h4 class="mt-1 p-1" style="font-size:1.1rem;">
                          {event.objDetails.name}
                        </h4>
                        <span class="text-dark p-1"
                          >{event.objDetails.location}</span
                        ><br />
                        <span class="text-secondary p-1"
                          >{event.objDetails.type}</span
                        ><br />
                        <span class="p-1 text-secondary"
                          >{event.objDetails.price}</span
                        >
                      </div>
                    </div>
                  </a>
                </div>
              {/each}
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .event-schedule-sec.light {
    background: #f4f5f7;
  }

  .btn {
    padding: 0.3rem 0.5rem;
    font-size: 15px;
    border: 1px solid lightgray;
  }
  .single-speaker-wrap img {
    border-top-right-radius: 13px;
    border-top-left-radius: 13px;
  }
  a {
    display: inline-block;
  }

  .single-speaker-wrap .imgs {
    border: 3px solid #fff;
    border-radius: 13px;
  }
  .single-speaker-wrap .imgs .single_speaker_date {
    background-color: #333;
    color: #fff;
    font-size: 15px;
    border-bottom-left-radius: 11px;
    border-bottom-right-radius: 11px;
    cursor: pointer;
  }
  .filter_box .over {
    cursor: pointer;
  }
</style>

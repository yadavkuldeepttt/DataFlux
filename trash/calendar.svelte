<!-- <script>
  // import FullCalendar, { Draggable } from "svelte-fullcalendar";
  // import daygridPlugin from "@fullcalendar/daygrid";
  // import timegridPlugin from "@fullcalendar/timegrid";
  // import interactionPlugin from "@fullcalendar/interaction";

  let options = {
    dateClick: handleDateClick,
    droppable: true,
    editable: true,
    events: [
      // initial event data
      { title: "New Event", start: new Date() },
    ],
    initialView: "dayGridMonth",
    plugins: [daygridPlugin, timegridPlugin, interactionPlugin],
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    height: "100%",
    weekends: true,
  };
  let calendarComponentRef;
  let eventData = { title: "my event", duration: "02:00" };

  function toggleWeekends() {
    options = { ...options, weekends: !options.weekends };
  }

  function gotoPast() {
    let calendarApi = calendarComponentRef.getAPI();
    calendarApi.gotoDate("2000-01-01"); // call a method on the Calendar object
  }

  function handleDateClick(event) {
    if (confirm("Would you like to add an event to " + event.dateStr + " ?")) {
      const { events } = options;
      const calendarEvents = [
        ...events,
        {
          title: "New Event",
          start: event.date,
          allDay: event.allDay,
        },
      ];
      options = {
        ...options,
        events: calendarEvents,
      };
    }
  }
</script>

<div class="demo-app">
  <div class="demo-app-top">
    <button on:click={toggleWeekends}>toggle weekends</button> &nbsp;
    <button on:click={gotoPast}>go to a date in the past</button> &nbsp; (also, click
    a date/time to add an event)
  </div>

  <div>
    <Draggable {eventData} class="draggable">
      Drag me in Week or Day view!
    </Draggable>
  </div>

  <div class="demo-app-calendar">
    <FullCalendar bind:this={calendarComponentRef} {options} />
  </div>
</div>

<style>
  :global(* > *) {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  .demo-app {
    width: 100vw;
    height: 100vh;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-family:
      Arial,
      Helvetica Neue,
      Helvetica,
      sans-serif;
    font-size: 14px;
  }

  .demo-app-calendar {
    width: 100%;
    flex-grow: 1;
    margin: 0 auto;
    max-width: 900px;
  }
  :global(.draggable) {
    color: white;
    background: #3788d8;
    width: fit-content;
    padding: 1rem;
    margin: 1rem;
    cursor: pointer;
  }
</style> -->

<script>
  // import { experiences } from "./../../../apiData/experiences";
  import Modal from "./modal.svelte";
  // import GoogleSignIn from "./googleSignIn.svelte";
  export let eventDetail;

  let userDetails = [
    {
      id: 1,
      objDetails: {
        name: "",
        bookId: "",
        receiptId: "",
        transportComingName: "",
        transportReturnName: "",
        mobile: "",
        pincode: "",
        gender: "male",
        age: "",
        startDate: "",
        endDate: "",
        days: null,
        amount: "",
        aadhar: "",
        delete: null,
        isMaster: false,
      },
      hasError: false,
    },
  ];

  let transportDetails = [
    {
      id: 1,
      objDetails: {
        name: "",
        mode: "bus",
        fromDate: "2024-06-05",
        toDate: "2024-06-15",
        fromTime: "09:00",
        toTime: "20:00",
        boardingLocation: "New Delhi Railway Station",
        boardingTime: "08:30",
        destinationLocation: "Mumbai",
        destinationTime: "21:00",
        needPickup: false,
        checkinTime: "08:00",
        checkoutTime: "20:30",
        total: "",
        comment: "",
      },
      hasError: false,
    },
  ];

  let showModal = false;
  let x = eventDetail.transportDetails[0].map[0].latitude;
  let y = eventDetail.transportDetails[0].map[0].longitude;

  // for changing the view mobile or desktop
  let selectedOption = "Desktop View";

  function handleOptionChange(event) {
    selectedOption = event.target.value;
  }
  // sign in google
  let signedIn = false;

  let rowCounter = 2;

  function addUserDetailsRow() {
    userDetails = [
      ...userDetails,
      {
        id: userDetails.length + 1,
        objDetails: {
          name: "",
          bookId: "",
          receiptId: "",
          transportComingName: "",
          transportReturnName: "",
          mobile: "",
          pincode: "",
          gender: "male",
          age: "",
          startDate: "",
          endDate: "",
          days: null,
          amount: "",
          aadhar: "",
          delete: null,
          isMaster: false,
        },
        hasError: false,
      },
    ];
  }

  function addTransportDetailsRow() {
    transportDetails = [
      ...transportDetails,
      {
        id: transportDetails.length + 1,
        objDetails: {
          name: "",
          mode: "bus",
          fromDate: "2024-06-05",
          toDate: "2024-06-15",
          fromTime: "09:00",
          toTime: "20:00",
          boardingLocation: "New Delhi Railway Station",
          boardingTime: "08:30",
          destinationLocation: "Mumbai",
          destinationTime: "21:00",
          needPickup: false,
          checkinTime: "08:00",
          checkoutTime: "20:30",
          comment: "",
        },
        hasError: false,
      },
    ];
  }

  // delete rows
  function deleteRowUserDetails(id) {
    userDetails = userDetails.filter((row) => row.id !== id);
  }

  function deleteRowTransportDetails(id) {
    transportDetails = transportDetails.filter((row) => row.id !== id);
  }
  // Validation Functions
  function validateField(field, value) {
    switch (field) {
      case "name":
        return value !== "";
      case "transportComingName":
        return value !== "";
      case "transportReturnName":
        return value !== "";
      case "mobile":
        return /^\d{10}$/.test(value);
      case "pincode":
        return /^\d{6}$/.test(value);
      case "gender":
        return value !== "";
      case "age":
        return value > 0;
      case "startDate":
        return value !== "";
      case "days":
        return value > 0;
      case "aadhar":
        return /^\d{12}$/.test(value);

      default:
        return true;
    }
  }
  function validateTransportField(field, value) {
    let isValid = true;
    let errorMessage = "";

    switch (field) {
      case "transportName":
        isValid = value !== "";
        errorMessage = isValid ? "" : "Please enter a name.";
        console.log(
          `Field: ${field}, Value: ${value}, isValid: ${isValid}, ErrorMessage: ${errorMessage}`
        );

        break;
      case "mode":
        isValid = value !== "";
        errorMessage = isValid ? "" : "Please select a mode of transport.";
        break;
      case "fromDate":
        isValid = value !== "";
        errorMessage = isValid ? "" : "Please enter a from date.";
        break;
      case "toDate":
        isValid = value !== "";
        errorMessage = isValid ? "" : "Please enter a to date.";
        break;
      case "boardingLocation":
        isValid = value !== "";
        errorMessage = isValid ? "" : "Please enter a boarding location.";
        break;
      case "destinationLocation":
        isValid = value !== "";
        errorMessage = isValid ? "" : "Please enter a destination location.";
        break;
      case "boardingTime":
        isValid = value !== "";
        errorMessage = isValid ? "" : "Please enter a boarding time.";
        break;
      case "destinationTime":
        isValid = value !== "";
        errorMessage = isValid ? "" : "Please enter a destination time.";
        break;
      case "checkinTime":
        isValid = value !== "";
        errorMessage = isValid ? "" : "Please enter a check-in time.";
        break;
      case "checkoutTime":
        isValid = value !== "";
        errorMessage = isValid ? "" : "Please enter a check-out time.";
        break;
      case "total":
        isValid = !isNaN(value) && Number(value) > 0;
        errorMessage = isValid
          ? ""
          : "Please enter a valid number greater than 0 for total travellers.";
        break;
      case "comment":
        isValid = true;
        errorMessage = "";
        break;
      default:
        isValid = true;
        errorMessage = "";
        break;
    }

    return { isValid, errorMessage };
  }

  function validateRow(row) {
    const fields = [
      "name",
      "mobile",
      "transportComingName",
      "transportReturnName",
      "pincode",
      "gender",
      "age",
      "startDate",
      "days",
      "aadhar",
    ];
    let isValid = true;
    row.hasError = false; // Reset the error state for the row
    fields.forEach((field) => {
      if (!validateField(field, row.objDetails[field])) {
        isValid = false;
        row.objDetails[`${field}Error`] = true;
        document
          .getElementById(`errorMessage-${field}-${row.id}`)
          .classList.remove("hidden");
      } else {
        row.objDetails[`${field}Error`] = false;
        document
          .getElementById(`errorMessage-${field}-${row.id}`)
          .classList.add("hidden");
      }
    });
    if (!isValid) {
      row.hasError = true; // Set the row error state if any field is invalid
    }
    return isValid;
  }

  function validateTransportRow(transport) {
    const fields = [
      "transportName",
      "mode",
      "fromDate",
      "toDate",
      "boardingLocation",
      "boardingTime",
      "destinationLocation",
      "destinationTime",
      "checkinTime",
      "checkoutTime",
      "total",
      "comment",
    ];

    let isValid = true;
    transport.hasError = false;

    fields.forEach((field) => {
      const validation = validateTransportField(
        field,
        transport.objDetails[field]
      );
      const errorMessageElement = document.getElementById(
        `errorMessageTransport-${field}-${transport.id}`
      );

      if (!validation.isValid) {
        isValid = false;
        transport.objDetails[`${field}Error`] = true;
        errorMessageElement.classList.remove("hidden");
        errorMessageElement.textContent = validation.errorMessage;
      } else {
        transport.objDetails[`${field}Error`] = false;
        errorMessageElement.classList.add("hidden");
        errorMessageElement.textContent = "";
      }
    });

    if (!isValid) {
      transport.hasError = true;
    }

    return isValid;
  }

  // submit form
  const submitForm = async (event) => {
    event.preventDefault();

    const form = document.getElementById("form");
    let formIsValid = true;
    form.classList.add("validated");
    userDetails = userDetails.map((row) => {
      // Ensure reactivity in Svelte
      if (!validateRow(row)) {
        formIsValid = false;
      }
      return { ...row }; // Ensure Svelte re-renders the row
    });

    transportDetails = transportDetails.map((transport) => {
      if (!validateTransportRow(transport)) {
        formIsValid = false;
      }
      return { ...transport };
    });
    if (formIsValid) {
      const response = await fetch(
        "http://localhost:5050/api/saveParticipant ",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userDetails, transportDetails }),
        }
      );
      if (response.ok) {
        alert("Data saved successfully");
        console.log(response, "response");
      } else {
        alert("Failed to save data");
        console.error(response);
        console.log(response, "response");
      }
    } else {
      alert("Please correct the errors in the form.");
    }
  };
  function handleInput(row, field) {
    return (event) => {
      row.objDetails[field] = event.target.value;
      validateField(field, event.target.value)
        ? document
            .getElementById(`errorMessage-${field}-${row.id}`)
            .classList.add("hidden")
        : document
            .getElementById(`errorMessage-${field}-${row.id}`)
            .classList.remove("hidden");
      validateRow(row); // Validate the entire row on input change
    };
  }
  function handleTransportInput(transport, field) {
    return (event) => {
      transport.objDetails[field] = event.target.value;

      console.log(
        `Handling input for field: ${field}, value: ${event.target.value}`
      );

      const validation = validateTransportField(field, event.target.value);

      console.log(
        `Validation result for field: ${field}, isValid: ${validation.isValid}, ErrorMessage: ${validation.errorMessage}`
      );

      const id = document.getElementById(
        `errorMessageTransport-${field}-${transport.id}`
      );
      console.log(id);

      if (validation.isValid) {
        id.classList.add("hidden");
        id.textContent = "";
      } else {
        id.classList.remove("hidden");
        id.textContent = validation.errorMessage;
      }

      validateTransportRow(transport);
    };
  }

  // for update last date
  function updateEndDate(row) {
    if (row.objDetails.startDate && row.objDetails.days) {
      const startDate = new Date(row.objDetails.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + row.objDetails.days);
      row.objDetails.endDate = endDate.toISOString().split("T")[0];
    }
  }
  // calculate amount
  function calculateAmount(row) {
    const days = row.objDetails.days;
    const age = row.objDetails.age;
    const rateRule =
      age > 18 ? eventDetail.rateRules[1] : eventDetail.rateRules[0];
    row.objDetails.amount = days * rateRule.amount;
  }
  // call function updateEndDate and CalculateAmount
  $: {
    userDetails.forEach((row) => {
      updateEndDate(row);
      calculateAmount(row);
    });
  }

  // mobile view code
  // let editedParticipant = {
  //   id: null,
  //   objDetails: {
  //     name: "",
  //     age: "",
  //     address: "",
  //     pincode: "",
  //   },
  // };
  // let nameError = "";
  // let ageError = "";
  // let aadharError = "";
  // let pincodeError = "";
  // let startError = "";
  // let endError = "";
  // let addressError = "";

  // let editFormOpen = false;

  // function openEditForm(participant) {
  //   editedParticipant = { ...participant };
  //   editFormOpen = true;
  // }

  // function closeEditForm() {
  //   editFormOpen = false;
  // }

  // function saveEditedParticipant() {
  //   if (!editedParticipant.objDetails.name) {
  //     nameError = "Name is required";
  //     return;
  //   } else {
  //     nameError = "";
  //   }

  //   if (
  //     isNaN(editedParticipant.objDetails.age) ||
  //     editedParticipant.objDetails.age < 0
  //   ) {
  //     ageError = "Age must be a positive number";

  //     return;
  //   } else if (!editedParticipant.objDetails.age) {
  //     ageError = "Age is required";
  //   } else {
  //     ageError = "";
  //   }
  //   if (!editedParticipant.objDetails.address) {
  //     addressError = "Address is required";
  //     return;
  //   } else {
  //     addressError = "";
  //   }
  //   if (!editedParticipant.objDetails.pincode) {
  //     pincodeError = "Address is required";
  //     return;
  //   } else if (editedParticipant.objDetails.pincode.length < 5) {
  //     pincodeError = "Pincode must contain atleast 5 numbers";
  //     return;
  //   } else {
  //     pincodeError = "";
  //   }
  //   // Find and update the participant in the participants array
  //   const index = participants.findIndex((p) => p.id === editedParticipant.id);
  //   if (index !== -1) {
  //     participants[index] = { ...editedParticipant };
  //   }
  //   closeEditForm();
  // }

  // function deleteParticipant(participantId) {
  //   // Delete the participant from the participants array
  //   participants = participants.filter((p) => p.id !== participantId);
  // }

  // let addParticipantBox = false;

  // function closeAddBox() {
  //   addParticipantBox = false;
  // }

  // let newParticipant = {
  //   name: "",
  //   age: "",
  //   address: "",
  //   pincode: "",
  //   aadhar: "",
  // };

  // function addParticipant() {
  //   addParticipantBox = true;
  // }
  // // add participant validation
  // function saveParticipant() {
  //   nameError = validateName(newParticipant.name);
  //   ageError = validateAge(newParticipant.age);
  //   addressError = validateAddress(newParticipant.address);
  //   pincodeError = validatePincode(newParticipant.pincode);
  //   aadharError = validateAadhar(newParticipant.aadhar);

  //   if (
  //     !nameError &&
  //     !ageError &&
  //     !addressError &&
  //     !pincodeError &&
  //     !aadharError
  //   ) {
  //     // Add the new participant to your objDetails structure
  //     // and close the add participant form
  //     closeAddBox();
  //   }
  // }

  // function validateName(name) {
  //   if (!name) {
  //     return "Name is required";
  //   }
  //   return "";
  // }

  // function validateAge(age) {
  //   if (isNaN(age) || age < 0) {
  //     return "Age must be a positive number";
  //   } else if (!age) {
  //     return "Age is required";
  //   }
  //   return "";
  // }

  // function validateAddress(address) {
  //   if (!address) {
  //     return "address is required";
  //   }
  //   return "";
  // }

  // function validatePincode(pincode) {
  //   if (!pincode) {
  //     return "pincode is required";
  //   } else if (pincode < 6) {
  //     return "pincode must contain at lease 6 numbers";
  //   }
  //   return "";
  // }
  // function validateAadhar(aadhar) {
  //   if (!aadhar) {
  //     return "aadhar is required";
  //   }
  //   if (aadhar.length < 12) {
  //     return "aadhar must contain at lease 12 numbers";
  //   }
  //   return "";
  // }

  // function handleLikeClick(exp) {
  //   exp.objDetails.likes += 1;
  //   exp.objDetails.isLiked = true;
  // }

  // function handleVoteClick(exp) {
  //   exp.objDetails.votes += 1;
  //   exp.objDetails.isVoted = true;
  // }
</script>

<!--header breadcrumb start-->
<div class="header-breadcrumb">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="inner-bread-cont text-center">
          <h2>Event Details</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb justify-content-center">
              <li class="breadcrumb-item"><a href="/">Home</a></li>
              <li class="breadcrumb-item active" aria-current="page">
                Event Details
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  </div>
  <!--/.container-->
</div>
<!--header breadcrumb end-->

<!--event details page start-->

<section class="event-details-pg px-120">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="event-details-banner">
          <div class="e-details-slider-js swiper">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
                <img src={eventDetail.images[0].src} alt="" />
              </div>
            </div>
          </div>
          <!--/.e-details-slider-js-->
          <div class="event-dts-places">
            <div class="row gy-5">
              <div class="col-lg-8">
                <div>
                  <h2 style="font-size: 2rem;">
                    {eventDetail.objDetails.name}
                  </h2>
                  <span class="mb-3 d-inline-block"
                    >{eventDetail.objDetails.type} | {eventDetail.objDetails
                      .duration}</span
                  >
                </div>
                <div class="flex gap-3 items-center py-2">
                  <a href="#" class="btn btn1">Save on Calendrer</a>

                  <a
                    href="#"
                    style="background-color:red"
                    class="btn btn2 text-white"
                    on:click={() => (showModal = true)}>Participate</a
                  >
                </div>
                <ul class="d-flex flex-wrap">
                  <li>
                    <div class="icon">
                      <img
                        src={eventDetail.images[5].src}
                        alt=""
                        style="border-radius: 14px;"
                      />
                    </div>
                    <p>Date Conference</p>
                    <h4>{eventDetail.objDetails.time}</h4>
                  </li>
                  <li>
                    <div class="icon">
                      <img
                        src={eventDetail.images[6].src}
                        alt=""
                        style="border-radius: 14px;"
                      />
                    </div>
                    <p>Location</p>
                    <h4>{eventDetail.objDetails.location}</h4>
                  </li>
                  <li>
                    <div class="icon">
                      <img
                        src={eventDetail.images[7].src}
                        alt=""
                        style="border-radius: 14px;"
                      />
                    </div>
                    <p>Tickets Remaining</p>
                    <h4>{eventDetail.objDetails.ticketsRemain} Tickets</h4>
                  </li>
                  <li>
                    <div class="icon">
                      <img
                        src={eventDetail.images[8].src}
                        alt=""
                        style="border-radius: 14px;"
                      />
                    </div>
                    <p>Speaker</p>
                    <h4>
                      {eventDetail.objDetails.totalSpeaker} Professional Speakers
                    </h4>
                  </li>
                  <li>
                    <div class="icon">
                      <img
                        src={eventDetail.images[9].src}
                        alt=""
                        style="border-radius: 14px;"
                      />
                    </div>
                    <p>Price</p>

                    <h4>
                      <strong>Student:</strong>&nbsp;<span
                        class="text-success"
                        style="font-size: 1.3rem;"
                        >{eventDetail.rateRules[0].amount}</span
                      >
                    </h4>
                    <h4>
                      <strong>Others:</strong>&nbsp;<span
                        class="text-success"
                        style="font-size: 1.3rem;"
                        >{eventDetail.rateRules[1].amount}</span
                      >
                    </h4>
                  </li>
                </ul>
              </div>
              <div class="col-lg-4">
                <div>
                  <h4>Transport Details:</h4>
                  <p>
                    Type:{eventDetail.transportDetails[0].type}, Name:{eventDetail
                      .transportDetails[0].name}, Contact:{eventDetail
                      .transportDetails[0].contact}, Address:{eventDetail
                      .transportDetails[0].address}
                  </p>
                </div>
                <div class="event-maps-wrap">
                  <iframe
                    title=""
                    src={`https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3507.2323570251697!2d${y}!3d${x}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjjCsDI4JzIxLjIiTiA3N8KwMDEnNTQuNSJF!5e0!3m2!1sen!2sin!4v1697799312612!5m2!1sen!2sin`}
                    width="600"
                    height="450"
                    style="border:0;"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- <div class="artist_name text-center">
          <h3 class="p-4 text-center">Speakers</h3>
          <div class="row g-4">
            <div class="col text-end">
              <img
                src={eventDetail.speakerName[0].image}
                alt=""
                style="border-radius:50%"
              />
              <h3 class="mt-2">{eventDetail.speakerName[0].name}</h3>
            </div>
            <div class="col text-start">
              <img
                src={eventDetail.speakerName[1].image}
                alt=""
                style="border-radius:50%"
              />
              <h3 class="mt-2">{eventDetail.speakerName[1].name}</h3>
            </div>
          </div>
        </div> -->

        <!-- <div class="event-details-txt">
          <h2>Experiences</h2>
          <span>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit,
            expedita.
          </span>
        </div> -->

        <!-- <div
          class="event-details-imgs d-flex flex-wrap gap-3 align-items-center"
        >
          <ul style="list-style-type: none;" class="d-flex gap-3">
            {#each experiences as exp (exp.id)}
              <li
                class="shadow rounded mx-2"
                style="background-color: #fafafa;"
              >
                <div class="">
                  <video class="h-100" controls style="width: 100%;">
                    <source src={exp.objDetails.videoUrl} type="video/mp4" />
                  </video>
                </div>
                <div class="p-2 mb-2">
                  <h3>{exp.objDetails.name}</h3>
                  <span class="mb-2 d-inline-block"
                    >{exp.objDetails.description}</span
                  >
                  <div
                    class="d-flex gap-5 align-items-center mt-2 border-top pt-2"
                  >
                    <div
                      class="d-flex align-items-center"
                      on:click={() => handleLikeClick(exp)}
                    >
                      <i
                        class="bx bx-smile fs-3 me-1"
                        style="cursor: pointer;"
                      />
                      {exp.objDetails.likes}
                    </div>
                    <div class="d-flex align-items-center">
                      <i
                        class="bx bx-message-eventDetail fs-3 me-1"
                        style="cursor: pointer;"
                      />
                      {exp.objDetails.message}
                    </div>
                    <div
                      class="d-flex align-items-center"
                      on:click={() => handleVoteClick(exp)}
                    >
                      <i
                        class="bx bx-upvote fs-2 me-1"
                        style="cursor: pointer;"
                      />
                      {exp.objDetails.votes}
                    </div>

                    <i class="bx bx-bookmark fs-3" style="cursor: pointer;" />

                    <i
                      class="bx bx-share bx-flip-horizontal fs-3"
                      style="cursor: pointer;"
                    />
                  </div>
                </div>
              </li>
            {/each}
          </ul>
        </div> -->

        <!-- <div
          class="event-details-imgs d-flex flex-wrap gap-3 align-items-center"
        >
          <img
            src={eventDetail.images[1].src}
            alt=""
            style="border-radius: 14px;"
          />
          <img
            src={eventDetail.images[2].src}
            alt=""
            style="border-radius: 14px;"
          />
          <img
            src={eventDetail.images[3].src}
            alt=""
            style="border-radius: 14px;"
          />
        </div> -->
      </div>
    </div>
  </div>
  <!--/.container-->
  <Modal bind:showModal>
    <div class="modal-boxs">
      <form action="" on:submit={submitForm} id="form" novalidate>
        <div class="text-center mt-3">
          <h4 class="mb-2">Enter/Edit Participant Details</h4>
          <span>(All * fields are mandatory)</span>
          <select
            name=""
            id=""
            class="bg-success mx-3 p-1"
            style="color:#fff;border:0;outline:0;font-size:15px"
            bind:value={selectedOption}
            on:change={handleOptionChange}
          >
            <option value="Desktop View">Desktop View</option>
            <option value="Mobile View">Mobile View</option>
          </select>
        </div>
        <!-- {#if selectedOption === "Desktop View"} -->
        <!-- {#if signedIn} -->
        <div class="search-filter mt-5 d-flex">
          <input
            type="search"
            class="form-control w-50"
            style="margin-left: 16rem;"
          />
          <button class="btn btn-success mx-3"
            ><i class="fa-solid fa-search" /></button
          >
        </div>

        <div class=" mt-5">
          <div class="d-flex justify-content-between gap-2 salign-items-center">
            <div class="d-flex gap-3 align-items-center">
              <input type="text" class="form-control py-1" />
              <button
                class="btn btn-light"
                style="font-size: 13px;width:52%;max-width:100%"
                >Apply all pincode</button
              >
            </div>
            <div class="d-flex gap-3 align-items-center">
              <input
                type="date"
                class="form-control py-1 min-w-[10vw]"
                style="color:rgba(0,0,0,0.7)"
              />
              <button
                class="btn btn-light"
                style="font-size: 13px;width:56%;max-width:100%"
                >Apply all FromDate</button
              >
            </div>
            <div class="d-flex gap-3 align-items-center">
              <input type="number" class="form-control py-1" />
              <button
                class="btn btn-light"
                style="font-size: 13px;width:52%;max-width:100%"
                >Apply all Days</button
              >
            </div>
          </div>
        </div>

        <h5 class="mt-5">Personal Details</h5>
        <div class="table-responsive mt-2">
          <table class="table table-striped table-hover table-bordered">
            <thead class="">
              <tr>
                <th scope="col">Select</th>
                <th scope="col">SNo.</th>
                <th scope="col">Name*</th>
                <th scope="col">BookId</th>
                <th scope="col">ReceiptId</th>
                <th scope="col">TransportComing</th>
                <th scope="col">TransportReturn</th>
                <th scope="col">Mobile*</th>
                <th scope="col">Pincode*</th>
                <th scope="col">Gender*</th>
                <th scope="col">Age*</th>
                <th scope="col">From Date</th>
                <th scope="col">Days*</th>
                <th scope="col">To Date</th>
                <th scope="col">Amount</th>
                <th scope="col">Aadhar</th>
                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              {#each userDetails as row (row.id)}
                <tr
                  class="border-gray-300 {row.hasError
                    ? 'border-pink-600'
                    : ''} "
                >
                  <td class="text-center"
                    ><label for="" class="text-xs">Master</label>&nbsp;<input
                      type="checkbox"
                      name=""
                      id=""
                    /></td
                  >
                  <td class="text-center">{row.id}</td>
                  <td>
                    <div>
                      <input
                        type="text"
                        class="form-control w-100 focus:text-blue-600 {row
                          .objDetails.nameError
                          ? 'border-pink-600 ring-2 ring-pink-200'
                          : 'border-gray-300'}"
                        bind:value={row.objDetails.name}
                        placeholder=" "
                        required
                        on:input={handleInput(row, "name")}
                      />
                      <span
                        id="errorMessage-name-{row.id}"
                        class="mt-2 hidden error-message text-pink-600 text-sm"
                      >
                        Please provide your name.
                      </span>
                    </div>
                  </td>

                  <!-- pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" -->
                  <td
                    ><input
                      type="text"
                      class="form-control w-100 focus:text-blue-600 border-gray-300"
                      bind:value={row.objDetails.bookId}
                      placeholder=" "
                    />
                  </td>
                  <td
                    ><input
                      type="text"
                      class="form-control w-100 focus:text-blue-600 border-gray-300"
                      bind:value={row.objDetails.receiptId}
                      placeholder=" "
                    />
                  </td>
                  <td>
                    <select
                      name=""
                      id=""
                      class="form-control {row.objDetails
                        .transportComingNameError
                        ? 'border-pink-600 ring-2 ring-pink-200'
                        : 'border-gray-300'}"
                      bind:value={row.objDetails.transportComingName}
                      on:input={handleInput(row, "transportComingName")}
                    >
                      <option value="abc">Abc</option>
                    </select>
                    <span
                      id="errorMessage-transportComingName-{row.id}"
                      class="mt-2 hidden error-message text-pink-600 text-sm"
                    >
                      Please select transport coming.
                    </span>
                  </td>
                  <td>
                    <select
                      name=""
                      id=""
                      class="form-control {row.objDetails
                        .transportReturnNameError
                        ? 'border-pink-600 ring-2 ring-pink-200'
                        : 'border-gray-300'}"
                      bind:value={row.objDetails.transportReturnName}
                      on:input={handleInput(row, "transportReturnName")}
                    >
                      <option value="abc">Abc</option>
                    </select>
                    <span
                      id="errorMessage-transportReturnName-{row.id}"
                      class="mt-2 hidden error-message text-pink-600 text-sm"
                    >
                      Please select transport return.
                    </span>
                  </td>

                  <td
                    ><input
                      type="text"
                      class="form-control w-100 {row.objDetails.mobileError
                        ? 'border-pink-600 ring-2 ring-pink-200'
                        : 'border-gray-300'}"
                      bind:value={row.objDetails.mobile}
                      on:input={handleInput(row, "mobile")}
                    />
                    <span
                      id="errorMessage-mobile-{row.id}"
                      class="mt-2 hidden error-message text-pink-600 text-sm"
                    >
                      Please enter mobile number.
                    </span>
                  </td>
                  <td
                    ><input
                      type="text"
                      class="form-control w-100 {row.objDetails.pincodeError
                        ? 'border-pink-600 ring-2 ring-pink-200'
                        : 'border-gray-300'}"
                      bind:value={row.objDetails.pincode}
                      on:input={handleInput(row, "pincode")}
                    />
                    <span
                      id="errorMessage-pincode-{row.id}"
                      class="mt-2 hidden error-message text-pink-600 text-sm"
                    >
                      Please enter your pincode.
                    </span>
                  </td>
                  <td>
                    <select
                      name=""
                      id=""
                      class="form-control {row.objDetails.genderError
                        ? 'border-pink-600 ring-2 ring-pink-200'
                        : 'border-gray-300'}"
                      bind:value={row.objDetails.gender}
                      on:input={handleInput(row, "gender")}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <span
                      id="errorMessage-gender-{row.id}"
                      class="mt-2 hidden error-message text-pink-600 text-sm"
                    >
                      Please select gender.
                    </span>
                  </td>
                  <td
                    ><input
                      type="number"
                      name=""
                      id=""
                      class="form-control {row.objDetails.ageError
                        ? 'border-pink-600 ring-2 ring-pink-200'
                        : 'border-gray-300'}"
                      bind:value={row.objDetails.age}
                      on:input={handleInput(row, "age")}
                    />
                    <span
                      id="errorMessage-age-{row.id}"
                      class="mt-2 hidden error-message text-pink-600 text-sm"
                    >
                      Please enter age.
                    </span>
                  </td>
                  <td
                    ><input
                      type="date"
                      class="form-control {row.objDetails.startDateError
                        ? 'border-pink-600 ring-2 ring-pink-200'
                        : 'border-gray-300'}"
                      style="font-size: 14px;color:rgba(0,0,0,0.8)"
                      bind:value={row.objDetails.startDate}
                      on:input={() => calculateAmount(row)}
                      on:input={handleInput(row, "startDate")}
                    />
                    <span
                      id="errorMessage-startDate-{row.id}"
                      class="mt-2 hidden error-message text-pink-600 text-sm"
                    >
                      Please select from date.
                    </span>
                  </td>
                  <td
                    ><input
                      type="number"
                      name=""
                      id=""
                      class="form-control {row.objDetails.daysError
                        ? 'border-pink-600 ring-2 ring-pink-200'
                        : 'border-gray-300'}"
                      bind:value={row.objDetails.days}
                      on:input={handleInput(row, "days")}
                      on:input={() => updateEndDate(row)}
                    />
                    <span
                      id="errorMessage-days-{row.id}"
                      class="mt-2 hidden error-message text-pink-600 text-sm"
                    >
                      Please enter number of days.
                    </span>
                  </td>
                  <td
                    ><input
                      type="date"
                      class="form-control border-gray-300"
                      style="font-size: 14px;color:rgba(0,0,0,0.8)"
                      bind:value={row.objDetails.endDate}
                    />
                  </td>

                  <td
                    ><input
                      type="text"
                      class="form-control border-gray-300"
                      bind:value={row.objDetails.amount}
                      readonly
                    />
                  </td>
                  <td
                    ><input
                      type="text"
                      class="form-control {row.objDetails.aadharError
                        ? 'border-pink-600 ring-2 ring-pink-200'
                        : 'border-gray-300'}"
                      bind:value={row.objDetails.aadhar}
                      on:input={handleInput(row, "aadhar")}
                    />
                    <span
                      id="errorMessage-aadhar-{row.id}"
                      class="mt-2 hidden error-message text-pink-600 text-sm"
                    >
                      Please enter aadhar number.
                    </span>
                  </td>
                  <td>
                    <button
                      class="btn btn-light"
                      on:click={() => deleteRowUserDetails(row.id)}
                    >
                      <i class="fa-solid fa-trash" />
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
          <div>
            <button
              class="btn btn-primary"
              style="font-size: 13px;"
              on:click={addUserDetailsRow}>New Entry</button
            >
          </div>
        </div>
        <h5 class="mt-5">Transport Details</h5>
        <div class="table-responsive mt-2">
          <table class="table table-striped table-hover">
            <thead class="">
              <tr style="font-size: 14px;">
                <th scope="col">Select</th>
                <th scope="col">SNo.</th>
                <th scope="col">Name</th>
                <th scope="col">Mode</th>
                <th scope="col">From Date</th>
                <th scope="col">To Date</th>
                <th scope="col">BoardingPlace</th>
                <th scope="col">BoardingTime</th>
                <th scope="col">DestinationPlace</th>
                <th scope="col">DestinationTime</th>
                <th scope="col-2">CheckIn Time</th>
                <th scope="col-2">CheckOut Time</th>
                <th scope="col-2">Total</th>
                <th scope="col-2">Comment</th>

                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              {#each transportDetails as transport}
                <tr
                  class={transport.hasError
                    ? "border-pink-600 ring-2 ring-pink-200"
                    : "border-gray-300"}
                >
                  <td class="text-center"
                    ><input type="checkbox" name="" id="" /></td
                  >
                  <td class="text-center">{transport.id}</td>
                  <td>
                    <input
                      type="text"
                      class="form-control w-100 {transport.objDetails
                        .transportNameError
                        ? 'border-pink-600 ring-2 ring-pink-200'
                        : 'border-gray-300'}"
                      bind:value={transport.objDetails.name}
                      on:input={handleTransportInput(
                        transport,
                        "transportName"
                      )(event)}
                    />
                    <span
                      id="errorMessageTransport-transportName-{transport.id}"
                      class="mt-2 hidden error-message text-pink-600 text-sm"
                    >
                      Please enter name.
                    </span>
                  </td>
                  <td>
                    <select
                      name=""
                      style="font-size: 12px;"
                      id=""
                      class="form-control {transport.objDetails.modeError
                        ? 'border-pink-600 ring-2 ring-pink-200'
                        : 'border-gray-300'}"
                      bind:value={transport.objDetails.mode}
                      on:input={handleTransportInput(transport, "mode")}
                    >
                      <option value="bus">Bus</option>
                      <option value="train">Train</option>
                      <option value="flight">Flight</option>
                    </select>
                    <span
                      id="errorMessageTransport-mode-{transport.id}"
                      class="mt-2 hidden error-message text-pink-600 text-sm"
                    >
                      Please enter mode of transport.
                    </span>

                    <!-- {#if row.errors.gender}
                        <p class="text-danger" style="font-size: 13px;">
                          {row.errors.gender}
                        </p>
                      {/if} -->
                  </td>
                  <td
                    ><input
                      type="date"
                      class="form-control {transport.objDetails.fromDateError
                        ? 'border-pink-600 ring-2 ring-pink-200'
                        : 'border-gray-300'}"
                      style="font-size: 12px;color:rgba(0,0,0,0.8)"
                      bind:value={transport.objDetails.fromDate}
                      on:input={handleTransportInput(transport, "fromDate")}
                    />
                    <span
                      id="errorMessageTransport-fromDate-{transport.id}"
                      class="mt-2 hidden error-message text-pink-600 text-sm"
                    >
                      Please enter from date.
                    </span>
                  </td>

                  <td
                    ><input
                      type="date"
                      class="form-control {transport.objDetails.toDateError
                        ? 'border-pink-600 ring-2 ring-pink-200'
                        : 'border-gray-300'}"
                      style="font-size: 12px;color:rgba(0,0,0,0.8)"
                      bind:value={transport.objDetails.toDate}
                      on:input={handleTransportInput(transport, "toDate")}
                    />
                    <span
                      id="errorMessageTransport-toDate-{transport.id}"
                      class="mt-2 hidden error-message text-pink-600 text-sm"
                    >
                      Please enter to date.
                    </span>
                  </td>
                  <td
                    ><input
                      type="text"
                      class="form-control {transport.objDetails
                        .boardingLocationError
                        ? 'border-pink-600 ring-2 ring-pink-200'
                        : 'border-gray-300'}"
                      style="font-size: 12px;color:rgba(0,0,0,0.8)"
                      bind:value={transport.objDetails.boardingLocation}
                      on:input={handleTransportInput(
                        transport,
                        "boardingLocation"
                      )}
                    />
                    <span
                      id="errorMessageTransport-boardingLocation-{transport.id}"
                      class="mt-2 hidden error-message text-pink-600 text-sm"
                    >
                      Please enter boarding location.
                    </span>
                  </td>
                  <td
                    ><input
                      type="time"
                      class="form-control {transport.objDetails
                        .boardingTimeError
                        ? 'border-pink-600 ring-2 ring-pink-200'
                        : 'border-gray-300'}"
                      style="font-size: 12px;color:rgba(0,0,0,0.8)"
                      bind:value={transport.objDetails.boardingTime}
                      on:input={handleTransportInput(transport, "boardingTime")}
                    />
                    <span
                      id="errorMessageTransport-boardingTime-{transport.id}"
                      class="mt-2 hidden error-message text-pink-600 text-sm"
                    >
                      Please enter boarding time.
                    </span>
                  </td>
                  <td
                    ><input
                      type="text"
                      class="form-control {transport.objDetails
                        .destinationLocationError
                        ? 'border-pink-600 ring-2 ring-pink-200'
                        : 'border-gray-300'}"
                      style="font-size: 12px;color:rgba(0,0,0,0.8)"
                      bind:value={transport.objDetails.destinationLocation}
                      on:input={handleTransportInput(
                        transport,
                        "destinationLocation"
                      )}
                    />
                    <span
                      id="errorMessageTransport-destinationLocation-{transport.id}"
                      class="mt-2 hidden error-message text-pink-600 text-sm"
                    >
                      Please enter destination location.
                    </span>
                  </td>
                  <td
                    ><input
                      type="time"
                      class="form-control {transport.objDetails
                        .destinationTimeError
                        ? 'border-pink-600 ring-2 ring-pink-200'
                        : 'border-gray-300'}"
                      style="font-size: 12px;color:rgba(0,0,0,0.8)"
                      bind:value={transport.objDetails.destinationTime}
                      on:input={handleTransportInput(
                        transport,
                        "destinationTime"
                      )}
                    />
                    <span
                      id="errorMessageTransport-destinationTime-{transport.id}"
                      class="mt-2 hidden error-message text-pink-600 text-sm"
                    >
                      Please enter destination time.
                    </span>
                  </td>
                  <td class="col-2"
                    ><input
                      type="time"
                      class="form-control {transport.objDetails.checkinTimeError
                        ? 'border-pink-600 ring-2 ring-pink-200'
                        : 'border-gray-300'}"
                      style="font-size: 12px;color:rgba(0,0,0,0.8)"
                      bind:value={transport.objDetails.checkinTime}
                      on:input={handleTransportInput(transport, "checkinTime")}
                    />
                    <span
                      id="errorMessageTransport-checkinTime-{transport.id}"
                      class="mt-2 hidden error-message text-pink-600 text-sm"
                    >
                      Please enter checkin time.
                    </span>
                  </td>
                  <td
                    ><input
                      type="time"
                      class="form-control {transport.objDetails
                        .checkoutTimeError
                        ? 'border-pink-600 ring-2 ring-pink-200'
                        : 'border-gray-300'}"
                      style="font-size: 12px;color:rgba(0,0,0,0.8)"
                      bind:value={transport.objDetails.checkoutTime}
                      on:input={handleTransportInput(transport, "checkoutTime")}
                    />
                    <span
                      id="errorMessageTransport-checkoutTime-{transport.id}"
                      class="mt-2 hidden error-message text-pink-600 text-sm"
                    >
                      Please enter checkout time.
                    </span>
                  </td>
                  <td
                    ><input
                      type="number"
                      class="form-control {transport.objDetails.totalError
                        ? 'border-pink-600 ring-2 ring-pink-200'
                        : 'border-gray-300'}"
                      style="font-size: 12px;color:rgba(0,0,0,0.8)"
                      bind:value={transport.objDetails.total}
                      on:input={handleTransportInput(transport, "total")}
                    />
                    <span
                      id="errorMessageTransport-total-{transport.id}"
                      class="mt-2 hidden error-message text-pink-600 text-sm"
                    >
                      Please enter total traveller.
                    </span>
                  </td>
                  <td>
                    <textarea name="" id="" rows="1" cols="2" class="">
                      {transport.objDetails.comment}
                    </textarea>
                  </td>

                  <td>
                    <button
                      class="btn btn-light"
                      on:click={() => deleteRowTransportDetails(transport.id)}
                    >
                      <i class="fa-solid fa-trash" />
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
          <div>
            <button
              class="btn btn-primary"
              style="font-size: 13px;"
              on:click={addTransportDetailsRow}>New Entry</button
            >
          </div>
        </div>
        <!-- {:else}
          <div class="text-center mt-5">
            <GoogleSignIn {signedIn} />
          </div>
        {/if} -->
        <!-- {:else if selectedOption === "Mobile View"}
        <div class="search-filter mt-5 d-flex">
          <input
            type="search"
            bind:value={searchQuery}
            class="form-control w-50"
            style="margin-left: 16rem;"
          />
          <button class="btn btn-success mx-3" on:click={search}
            ><i class="fa-solid fa-search" /></button
          >
        </div>

        <div class=" mt-5">
          <div class="d-flex justify-content-between">
            <div class="d-flex gap-3">
              <input
                type="text"
                class="form-control"
                bind:value={pincodeValue}
              />
              <button
                class="btn btn-light"
                style="font-size: 13px;"
                on:click={applyAllPincode}>Apply all pincode</button
              >
            </div>
            <div class="d-flex gap-3">
              <input
                type="date"
                class="form-control"
                style="color:rgba(0,0,0,0.7)"
                bind:value={fromDateValue}
              />
              <button
                class="btn btn-light"
                style="font-size: 13px;"
                on:click={applyAllFromDate}>Apply all FromDate</button
              >
            </div>
            <div class="d-flex gap-3">
              <input
                type="number"
                class="form-control"
                bind:value={daysValue}
              />
              <button
                class="btn btn-light"
                style="font-size: 13px;"
                on:click={applyAllDays}>Apply all Days</button
              >
            </div>
          </div>
        </div>

        {#each filteredRows as row (row.id)}
          <ul class="mt-5">
            {#each participants as participant (participant.id)}
              <li
                class="participant-mobile mx-5 mb-3 p-3 d-flex justify-content-between align-items-center"
                style="cursor: pointer"
                on:click={() => openEditForm(participant)}
              >
                <span>{participant.objDetails.name}</span>
                <i
                  class="fa-solid fa-trash"
                  on:click={() => deleteParticipant(participant.id)}
                />
              </li>
            {/each}
          </ul>
        {/each}

        <!-- Edit Participant Form Pop-up -->
        <!-- {#if editFormOpen && editedParticipant.id !== null}
          <div class="popup-container">
            <div class="popup">
              <form class="edit-form">
                <div>
                  <label for="editName">Name</label> <br />
                  <input
                    type="text"
                    id="editName"
                    bind:value={editedParticipant.objDetails.name}
                    class="form-control"
                  />
                  <div class="error-message my-2" style="color: red;">
                    {nameError}
                  </div>
                </div>

                <div>
                  <label for="editAge">Age</label> <br />

                  <input
                    type="number"
                    id="editAge"
                    bind:value={editedParticipant.objDetails.age}
                    class="form-control"
                  />
                  <div class="error-message my-2" style="color: red;">
                    {ageError}
                  </div>
                </div>
                <div>
                  <label for="editAddress">Address</label> <br />
                  <input
                    type="text"
                    id="editAddress"
                    bind:value={editedParticipant.objDetails.address}
                    class="form-control"
                  />
                  <div class="error-message my-2" style="color: red;">
                    {addressError}
                  </div>
                </div>
                <div>
                  <label for="editAddress">Pincode</label> <br />
                  <input
                    type="text"
                    id="editPincode"
                    bind:value={editedParticipant.objDetails.pincode}
                    class="form-control"
                  />
                  <div class="error-message my-2" style="color: red;">
                    {pincodeError}
                  </div>
                </div>
                <div class="mt-4">
                  <button
                    class="btn btn-success"
                    style="font-size: 14px"
                    on:click={() => saveEditedParticipant()}>Save</button
                  >
                  <button
                    class="btn btn-danger"
                    style="font-size: 14px"
                    on:click={() => deleteParticipant(editedParticipant.id)}
                    >Delete</button
                  >
                </div>
              </form>
              <hr style="color:#fafafa" />
              <div class="mt-3 text-end">
                <button
                  class="close-button btn btn-primary"
                  style="font-size: 14px"
                  on:click={() => closeEditForm()}>Close</button
                >
              </div>
            </div>
          </div>
        {/if} -->

        <!-- {#if addParticipantBox}
          <div class="popup-container">
            <div
              class="popup"
              style="overflow: auto;max-height:95vh;max-width:500px
              "
            >
              <form class="add-form edit-form">
                <div>
                  <label for="">Name</label> <br />
                  <input
                    type="text"
                    id="editName"
                    class="form-control"
                    bind:value={newParticipant.name}
                  />
                  <div class="error-message my-1" style="color: red;">
                    {nameError}
                  </div>
                </div>
                <div class="d-flex gap-2">
                  <div>
                    <label for="">Age</label> <br />

                    <input
                      type="number"
                      class="form-control"
                      bind:value={newParticipant.age}
                    />
                    <div class="error-message my-1" style="color: red;">
                      {ageError}
                    </div>
                  </div>
                  <div>
                    <label for="">Pincode</label> <br />
                    <input
                      type="text"
                      class="form-control"
                      bind:value={newParticipant.pincode}
                    />
                    <div class="error-message my-1" style="color: red;">
                      {pincodeError}
                    </div>
                  </div>
                </div>
                <div>
                  <label for="">Address</label> <br />
                  <input
                    type="text"
                    class="form-control"
                    bind:value={newParticipant.address}
                  />
                  <div class="error-message my-1" style="color: red;">
                    {addressError}
                  </div>
                </div>

                <div>
                  <label for="">Aadhar</label> <br />
                  <input
                    type="text"
                    class="form-control"
                    bind:value={newParticipant.aadhar}
                  />
                  <div class="error-message my-1" style="color: red;">
                    {aadharError}
                  </div>
                </div>
                <div class="d-flex gap-5">
                  <div class="">
                    <label for="">Start</label> <br />
                    <input
                      type="date"
                      class="form-control w-100"
                      style="font-size: 14px;;color:rgba(0,0,0,0.7"
                    />
                  </div>
                  <div>
                    <label for="">End</label> <br />

                    <input
                      type="date"
                      class="form-control w-100"
                      style="font-size: 14px;;color:rgba(0,0,0,0.7"
                    />
                  </div>
                </div>
                <div class="mt-3">Prize</div>
                <div class="mt-4">
                  <button
                    class="btn btn-success"
                    style="font-size: 14px"
                    on:click={saveParticipant}>Save</button
                  >
                  <button
                    class="btn btn-danger"
                    style="font-size: 14px"
                    on:click={closeAddBox}>Cancel</button
                  >
                </div>
              </form>
            </div>
          </div>
        {/if} -->

        <!-- <div class="" />
        <button
          class="btn btn-primary mt-3"
          style="font-size: 13px;"
          on:click={addParticipant}>Add Participant</button
        > -->
        <!-- {:else}
          <div class="text-center mt-5">
            <GoogleSignIn {signedIn} />
          </div>
        {/if} -->
        <!-- {/if}  -->
        <div class="my-5">
          <label for="">Suggestion:</label>
          <input type="text" class="form-control" />
        </div>
        <hr />
        <button
          type="submit"
          class="btn btn-success mx-2 mt-3 d-inline-block"
          autofocus>Submit</button
        >

        <span>
          <a
            href={`/event/details/${eventDetail.id}/share`}
            class="btn btn-light mt-3 mx-2">Share</a
          >
        </span>
      </form>
    </div></Modal
  >
</section>

<!--event details page end-->

<style>
  .table td {
    padding: 0.3rem !important;
  }
  .table td input:not([type="checkbox"]),
  .table td select,
  .table td textarea {
    padding: 0rem 0.2rem 0rem 0.2rem !important;
    /* border: 1px solid #fafafa; */
    min-width: 100px !important;
    font-size: 13px !important;
  }
  .table td select {
    min-width: 70px !important;
  }

  .edit-form label {
    margin-top: 1rem;
  }

  .popup-container {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .popup {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    max-width: 400px;
    width: 100%;
  }

  /* Add more styles as needed for your specific design */

  .participant-mobile {
    background-color: rgb(208, 220, 243);
  }

  .participant-mobile:hover {
    background-color: rgba(208, 220, 243, 0.43);
  }
  .table-responsive::-webkit-scrollbar {
    height: 30px;
  }
  /* .accordion-button:focus {
    box-shadow: none;
  }
  @media screen and (max-width: 760px) {
    .grid-item {
      display: flex;
      flex-direction: column;
    }
    .grid-row {
      flex-direction: column;
    }
  }
  .grid-row {
    display: flex;
    gap: 20px;
    justify-content: space-evenly;
    flex-wrap: wrap;
    margin-bottom: 2rem;
    background-color: #fafafa;
    padding: 0.5rem 0.3rem;
  } */

  .btn:focus,
  input:focus {
    box-shadow: none;
  }
  .modal-boxs {
    width: 100%;
  }
  @media (max-width: 767px) {
  }
  .event-details-banner {
    background: var(--clr-white-light);
    border-radius: 30px;
  }

  .e-details-slider-js img {
    width: 100%;
    border-radius: 30px;
    display: block;
  }

  .event-dts-places {
    padding: 40px;
  }

  .event-dts-places ul {
    gap: 24px;
  }
  .event-dts-places li {
    width: 48%;
    width: calc(50% - 24px);
    display: inline-block;
    position: relative;
    background: var(--clr-bg-white);
    padding: 26px;
    padding-left: 108px;
    border-radius: 20px;
    min-height: 98px;
  }

  .event-dts-places li .icon {
    background: var(--clr-white-light);
    border-radius: 10px;
    width: 58px;
    height: 58px;
    text-align: center;
    line-height: 58px;
    position: absolute;
    left: 20px;
    top: 50%;
    -webkit-transform: translate(0, -50%);
    -moz-transform: translate(0, -50%);
    transform: translate(0, -50%);
  }

  .event-dts-places li .icon img {
    vertical-align: middle;
  }

  .event-dts-places li p {
    line-height: 100%;
    padding-bottom: 12px;
  }
  .event-maps-wrap {
    max-width: 100%;
    margin-left: auto;
    border-radius: 20px;
  }

  .event-maps-wrap iframe {
    width: 100%;
    height: 220px;
    border-radius: 20px;
  }

  .event-details-txt {
    padding-top: 60px;
  }

  .event-details-txt p {
    padding-top: 30px;
  }

  .event-details-imgs {
    margin-top: 30px;
  }

  .event-details-imgs img {
    border-radius: 30px;
  }

  .single-feature-event-v2.light {
    box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.06);
  }

  @media (max-width: 767px) {
    .event-dts-places li {
      width: 100%;
      padding-left: 80px;
    }
    .event-dts-places {
      padding: 20px;
    }
  }
</style>

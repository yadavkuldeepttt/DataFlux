<script>
  import { fade } from "svelte/transition";
  import { internships } from "../../apiData/internships.js";
  import { onMount } from "svelte";

  let internship;
  for (let i = 0; i < internships.length; i++) {
    internship = internships[i].objDetails;
  }

  let filters = {
    internPost: "",
    location: "",
    salary: "",
  };

  function filterJobs(internType) {
    return internships
      .filter((internship) => internship.objDetails.internType === internType)
      .filter((internship) => {
        const profileMatch =
          !filters.internPost.toLowerCase() ||
          internship.objDetails.internPost
            .toLowerCase()
            .includes(filters.internPost.toLowerCase());
        const locationMatch =
          !filters.location ||
          internship.objDetails.location.includes(filters.location);
        const salaryMatch =
          !filters.salary ||
          internship.objDetails.salary.includes(filters.salary);
        return profileMatch && locationMatch && salaryMatch;
      });
  }
  let filteredFullTimeJobs = [];
  let filteredPartTimeJobs = [];
  let filteredJobPost = [];

  function updateFilteredJobs() {
    filteredFullTimeJobs = filterJobs("Full Time");
    filteredPartTimeJobs = filterJobs("Part Time");
    filteredJobPost = filterJobs(internship.internPost);
  }

  // $$.watch(filters, updateFilteredJobs);
  $: {
    updateFilteredJobs();
  }

  const handleFilter = () => {
    updateFilteredJobs();
  };
  onMount(() => {
    updateFilteredJobs();
  });

  let activeTab = "featured"; // Initially set the active tab

  function setActiveTab(tab) {
    activeTab = tab; // Set the active tab when a tab is clicked
    console.log(activeTab);
  }
  console.log("====================================");
  console.log(activeTab);
  console.log("====================================");
</script>

<div class="main-container pe-1 ps-5">
  <div
    class="center-div mb-4 pt-2 bg-light"
    style="overflow: auto;"
    transition:fade
  >
    <div class="container-xxl py-2">
      <div class="container-fluid p-2">
        <div class="row">
          <div class="col-lg-3 col-12">
            <div class="filter_box">
              <div
                class="filter_heading text-center"
                style="font-weight: bold;font-size:1.3rem;"
              >
                <i class="fa-solid fa-filter text-primary" />&nbsp;Filters
              </div>

              <div class="mt-3">
                <label for="">Profile</label><br />
                <input
                  type="text"
                  class="w-100 mt-1"
                  placeholder="e.g. Marketing"
                  bind:value={filters.internPost}
                />
              </div>

              <div class="mt-3">
                <label for="">Location</label><br />
                <input
                  type="text"
                  class="w-100 mt-1"
                  placeholder="e.g. Delhi"
                  bind:value={filters.location}
                />
              </div>
              <div class="mt-3">
                <label for="">Salary</label><br />
                <input
                  type="text"
                  class="w-100 mt-1"
                  placeholder="e.g. $250 - $345"
                  bind:value={filters.salary}
                />
              </div>
              <div class="mt-3">
                <label for="">Years of experience</label><br />
                <input
                  type="select"
                  class="w-100 mt-1"
                  placeholder="Fill years of experience"
                />
              </div>

              <a
                href="#t"
                on:click={handleFilter}
                style="text-decoration: none;"
                class="text-primary mt-3 d-inline-block"
              >
                <button class="btn btn-sm btn-danger">Apply</button>
              </a>
              <div class=" text-end">
                <a href="#t" style="text-decoration: none;" class="text-primary"
                  >Clear all</a
                >
              </div>

              <div class="text-center mt-3 mb-4">OR</div>
              <div class="search_section">
                <h6 class="text-center">Search</h6>
                <input
                  type="text"
                  class="w-100 mt-1"
                  placeholder="e.g. $250 - $345"
                />

                <button class="btn btn-primary searchbtn"
                  ><i class="fa-solid fa-magnifying-glass" /></button
                >
              </div>
            </div>
          </div>

          <div class="col-lg-9 mt-4 col-12">
            <div
              class="tab-class text-center wow fadeInUp"
              data-wow-delay="0.3s"
            >
              <ul
                class="nav nav-pills d-inline-flex justify-content-center border-bottom mb-5"
              >
                <li class="nav-item">
                  <a
                    class="d-flex align-items-center text-start mx-3 ms-0 pb-3 text-decoration-none text-dark {activeTab ===
                    'featured'
                      ? 'active'
                      : ''}"
                    data-bs-toggle="pill"
                    on:click={() => setActiveTab("featured")}
                    href="#tab-featured"
                  >
                    <h6 class="mt-n1 mb-0">Featured</h6>
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    class="d-flex align-items-center text-start mx-3 pb-3 text-decoration-none text-dark"
                    data-bs-toggle="pill"
                    href="#tab-fullTime"
                    on:click={() => setActiveTab("fullTime")}
                  >
                    <h6 class="mt-n1 mb-0">Full Time</h6>
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    on:click={() => setActiveTab("partTime")}
                    class="d-flex align-items-center text-start mx-3 me-0 pb-3 text-decoration-none text-dark"
                    data-bs-toggle="pill"
                    href="#tab-partTime"
                  >
                    <h6 class="mt-n1 mb-0">Part Time</h6>
                  </a>
                </li>
              </ul>

              <div class="">
                {#if activeTab === "featured"}
                  <div id="tab-featured" class="">
                    {#each internships as { jo, objDetails }}
                      <div class="internship-item p-4 mb-4">
                        <div class="row g-4">
                          <div
                            class="col-sm-12 col-md-8 d-flex align-items-center"
                          >
                            <img
                              class="flex-shrink-0 img-fluid border rounded"
                              src={objDetails.logo}
                              alt="logo1"
                              style="width: 80px; height: 80px;"
                            />
                            <div class="text-start ps-4">
                              <h5 class="mb-2">{objDetails.internPost}</h5>
                              <span
                                class="me-3 text-secondary"
                                style="font-weight:500"
                                >{objDetails.companyName}</span
                              ><br />

                              <span class="text-truncate me-3"
                                ><i
                                  class="fa fa-map-marker-alt text-success me-2"
                                />{objDetails.location}</span
                              >
                              <span class="text-truncate me-3"
                                ><i
                                  class="far fa-clock text-success me-2"
                                />{objDetails.internType}</span
                              >
                              <span class="text-truncate me-0"
                                ><i
                                  class="far fa-money-bill-alt text-success me-2"
                                />{objDetails.salary}</span
                              >
                            </div>
                          </div>
                          <div
                            class="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center"
                          >
                            <div class="d-flex mb-3">
                              <a class="btn btn-light btn-square me-3" href="#"
                                ><i class="far fa-heart text-success" /></a
                              >
                              <a
                                class="btn btn-success"
                                style="font-size: 14px;"
                                href={`/internshipDetails/${jo}/apply`}
                                >Apply Now</a
                              >
                              <li style="list-style: none;">
                                <a
                                  href={`/internshipDetails/${jo}`}
                                  class="btn btn-light btn-square ms-3"
                                  ><i
                                    class="fa-solid fa-ellipsis-vertical text-success"
                                  /></a
                                >
                              </li>
                            </div>
                            <small class="text-truncate"
                              ><i
                                class="far fa-calendar-alt text-success me-2"
                              />Date Line: {objDetails.date}</small
                            >
                          </div>
                        </div>
                      </div>
                    {/each}

                    <button class="btn btn-success">Browse More Jobs</button>
                  </div>
                {/if}
                {#if activeTab === "fullTime"}
                  <div id="tab-fullTime" class="">
                    {#each filteredFullTimeJobs as { jo, objDetails }}
                      <div class="internship-item p-4 mb-4">
                        <div class="row g-4">
                          <div
                            class="col-sm-12 col-md-8 d-flex align-items-center"
                          >
                            <img
                              class="flex-shrink-0 img-fluid border rounded"
                              src={objDetails.logo}
                              alt="logo1"
                              style="width: 80px; height: 80px;"
                            />
                            <div class="text-start ps-4">
                              <h5 class="mb-2">{objDetails.internPost}</h5>
                              <span
                                class="me-3 text-secondary"
                                style="font-weight:500"
                                >{objDetails.companyName}</span
                              ><br />

                              <span class="text-truncate me-3"
                                ><i
                                  class="fa fa-map-marker-alt text-success me-2"
                                />{objDetails.location}</span
                              >
                              <span class="text-truncate me-3"
                                ><i
                                  class="far fa-clock text-success me-2"
                                />{objDetails.internType}</span
                              >
                              <span class="text-truncate me-0"
                                ><i
                                  class="far fa-money-bill-alt text-success me-2"
                                />{objDetails.salary}</span
                              >
                            </div>
                          </div>
                          <div
                            class="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center"
                          >
                            <div class="d-flex mb-3">
                              <a class="btn btn-light btn-square me-3" href="#"
                                ><i class="far fa-heart text-success" /></a
                              >
                              <a
                                class="btn btn-success"
                                href={`/internshipDetails/${jo}/apply`}
                                >Apply Now</a
                              >
                              <li style="list-style: none;">
                                <a
                                  href={`/internshipDetails/${jo}`}
                                  class="btn btn-light btn-square ms-3"
                                  ><i
                                    class="fa-solid fa-ellipsis-vertical text-success"
                                  /></a
                                >
                              </li>
                            </div>
                            <small class="text-truncate"
                              ><i
                                class="far fa-calendar-alt text-success me-2"
                              />Date Line: {objDetails.date}</small
                            >
                          </div>
                        </div>
                      </div>
                    {/each}

                    <button class="btn btn-success">Browse More Jobs</button>
                  </div>
                {/if}

                {#if activeTab === "partTime"}
                  <div id="tab-partTime" class="">
                    {#each filteredPartTimeJobs as { jo, objDetails }}
                      <div class="internship-item p-4 mb-4">
                        <div class="row g-4">
                          <div
                            class="col-sm-12 col-md-8 d-flex align-items-center"
                          >
                            <img
                              class="flex-shrink-0 img-fluid border rounded"
                              src={objDetails.logo}
                              alt="logo1"
                              style="width: 80px; height: 80px;"
                            />
                            <div class="text-start ps-4">
                              <h5 class="mb-2">{objDetails.internPost}</h5>
                              <span
                                class="me-3 text-secondary"
                                style="font-weight:500"
                                >{objDetails.companyName}</span
                              ><br />
                              <span class="text-truncate me-3"
                                ><i
                                  class="fa fa-map-marker-alt text-success me-2"
                                />{objDetails.location}</span
                              >
                              <span class="text-truncate me-3"
                                ><i
                                  class="far fa-clock text-success me-2"
                                />{objDetails.internType}</span
                              >
                              <span class="text-truncate me-0"
                                ><i
                                  class="far fa-money-bill-alt text-success me-2"
                                />{objDetails.salary}</span
                              >
                            </div>
                          </div>
                          <div
                            class="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center"
                          >
                            <div class="d-flex mb-3">
                              <a class="btn btn-light btn-square me-3" href="#"
                                ><i class="far fa-heart text-success" /></a
                              >
                              <a
                                class="btn btn-success"
                                href={`/internshipDetails/${jo}/apply`}
                                >Apply Now</a
                              >
                              <li style="list-style: none;">
                                <a
                                  href={`/internshipDetails/${jo}`}
                                  class="btn btn-light btn-square ms-3"
                                  ><i
                                    class="fa-solid fa-ellipsis-vertical text-success"
                                  /></a
                                >
                              </li>
                            </div>
                            <small class="text-truncate"
                              ><i
                                class="far fa-calendar-alt text-success me-2"
                              />Date Line: {objDetails.date}</small
                            >
                          </div>
                        </div>
                      </div>
                    {/each}
                    <button class="btn btn-success">Browse More Jobs</button>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  
  .nav-pills .nav-item .active {
    border-bottom: 2px solid #00b074;
  }
  .internship-item {
    border: 1px solid transparent;
    border-radius: 2px;
    box-shadow: 0 0 45px rgba(0, 0, 0, 0.08);
    transition: 0.5s;
  }
  .internship-item:hover {
    border-color: rgba(0, 0, 0, 0.08);
    box-shadow: none;
  }
  .filter_box {
    margin-top: 7rem;
    padding: 1rem;
    border: 1px solid transparent;
    border-radius: 2px;
    border-color: rgba(0, 0, 0, 0.08);
    transition: 0.5s;
  }
  label {
    font-weight: 500;
    color: #333;
  }
  input {
    border: 1px solid lightgray;
    padding: 0.3rem;
  }
  input:hover {
    border: 1px solid #00b074;
  }
  input:focus {
    outline: none;
  }
  .searchbtn {
    position: absolute;
    right: 0;
    padding: 0.3rem 0.7rem;
    top: 31px;
    box-shadow: none;
    border-radius: 0;
  }
  .search_section {
    position: relative;
  }
</style>

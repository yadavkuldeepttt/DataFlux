<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import Toast from "./toast.svelte";
  export let detail;

  let formData = {};
  let showToast = false;
  let toastMessage = "";
  let toastType = "success";

  // Initialize formData with existing data
  onMount(() => {
    detail.formsData.forEach((data) => {
      formData[data.name] = data.value;
    });
  });

  function getFormFields(jo) {
    return detail.formsFields.filter((field) => field.jo === jo);
  }

  function handleInputChange(event, fieldName) {
    formData[fieldName] = event.target.value;
  }

  function handleFileChange(event, fieldName) {
    formData[fieldName] = event.target.files[0];
  }

  function handleRadioChange(event, fieldName) {
    formData[fieldName] = event.target.value;
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    showToast = true;
    toastMessage = "Submitted successfully";
    toastType = "success";
    setTimeout(() => {
      showToast = false;
      window.location.href = `/internships`;
    }, 3000);
    console.log("Submitted Data:", formData);
  }
</script>

{#if showToast}
  <Toast message={toastMessage} type={toastType} />
{/if}

<section>
  <div class="main-container pe-1 ps-5">
    <div
      class="center-div mb-4 bg-light"
      style="overflow: auto;"
      transition:fade
    >
      <div class="p-2">
        <h4 class="mb-2 mt-2 text-center">
          Apply For The <span class="text-primary"
            >{detail.objDetails.name}</span
          > I
        </h4>
        <h6 class="mb-5 text-center text-secondary">
          {detail.objDetails.companyName}
        </h6>
        <form class="py-2 px-3" on:submit={handleFormSubmit}>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {#each getFormFields(detail.jo) as field}
              {#if field.type === "text" || field.type === "email" || field.type === "tel" || field.type === "date"}
                <div class="col-span-1">
                  <label class="block text-gray-700">{field.label}</label>
                  <input
                    type={field.type}
                    class="form-input mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    value={formData[field.name] || ""}
                    on:input={(e) => handleInputChange(e, field.name)}
                  />
                </div>
              {/if}
              {#if field.type === "file"}
                <div class="col-span-1">
                  <label class="block text-gray-700">{field.label}</label>
                  <input
                    type="file"
                    class="form-input mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    on:change={(e) => handleFileChange(e, field.name)}
                  />
                </div>
              {/if}
              {#if field.type === "textarea"}
                <div class="col-span-1 sm:col-span-2">
                  <label class="block text-gray-700">{field.label}</label>
                  <textarea
                    class="form-textarea mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    rows="3"
                    on:input={(e) => handleInputChange(e, field.name)}
                    >{formData[field.name] || ""}</textarea
                  >
                </div>
              {/if}
              {#if field.type === "radio"}
                <div class="col-span-1 sm:col-span-2">
                  <label class="block text-gray-700">{field.label}</label>
                  {#each field.options as option}
                    <div>
                      <input
                        type="radio"
                        name={field.name}
                        value={option}
                        class="form-radio text-blue-600"
                        checked={formData[field.name] === option}
                        on:change={(e) => handleRadioChange(e, field.name)}
                      />
                      <label class="ml-2">{option}</label>
                    </div>
                  {/each}
                </div>
              {/if}
              {#if field.type === "select"}
                <div class="col-span-1">
                  <label class="block text-gray-700">{field.label}</label>
                  <select
                    class="form-select mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    value={formData[field.name] || ""}
                    on:change={(e) => handleInputChange(e, field.name)}
                  >
                    {#each field.options as option}
                      <option value={option}>{option}</option>
                    {/each}
                  </select>
                </div>
              {/if}
            {/each}
          </div>
          <div class="mt-6">
            <button
              class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              type="submit"
            >
              Apply Now
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>

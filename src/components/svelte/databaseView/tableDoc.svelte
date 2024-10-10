<script>
  import { createEventDispatcher } from "svelte";
  export let array;
  console.log(array);
  const dispatch = createEventDispatcher();

  let isEditing = {};
  let newValue = []; // Initialize as array

  function showArrayDetails(data) {
    dispatch("showArray", { arrayData: data });
  }

  function handleEditTableDocument(item) {
    // Toggle the editing state for the clicked item
    isEditing[item.id] = !isEditing[item.id];

    // Clear newValue array when starting to edit
    newValue = [];
    // Push each value to newValue
    Object.values(item).forEach((value) => {
      newValue.push(JSON.stringify(value));
    });
  }

  function handleCancelEdit(item) {
    // Cancel edit mode for the clicked item
    isEditing[item.id] = false;
  }

  function handleUpdateDocument(item) {
    console.log("Updated item:", item);
    // Exit edit mode for the clicked item
    isEditing[item.id] = false;

    // Get the keys for the item
    const keys = Object.keys(item);

    // Loop through each key
    keys.forEach((key, index) => {
      // Check if the value is an array
      if (Array.isArray(item[key])) {
        // Skip array values
        return;
      }
      // Compare new value with the original value
      if (item[key] !== JSON.parse(newValue[index])) {
        // Change background color if values are different
        // You can adjust this to suit your styling needs
        const cell = document.getElementById(`cell-${item.id}-${key}`);
        console.log("====================================");
        console.log(cell);
        console.log("====================================");
        cell.style.backgroundColor = "lightgreen";
        // Update the value in the item
        item[key] = JSON.parse(newValue[index]);
      }
    });
  }

  function handleCopyTableDocument(item) {
    console.log("Copying item:", item);
    // Dispatch the copy event with the item data
    dispatch("copyDocument", { item });
  }

  function handleDeleteTableDocument(item) {
    console.log("Deleting item:", item);
    // Dispatch the delete event with the item data
    dispatch("deleteDocument", { item });
  }
</script>

<div class="table-responsive w-100">
  <table class="table w-100">
    <thead style="background-color:#f4f5f7">
      <tr style="font-size:11px">
        {#each Object.keys(array[0]) as key}
          <th>{key}</th>
        {/each}
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each array as item}
        <tr style="font-size:10px">
          {#each Object.entries(item) as [key, value], index}
            <td
              class="border-end"
              style="color: {key === 'id' ? '#e72b2b' : 'green'};"
              contenteditable={isEditing[item.id] && !Array.isArray(value)
                ? "true"
                : "false"}
              id={`cell-${item.id}-${key}`}
            >
              {#if typeof value === "string"}
                {#if isEditing[item.id]}
                  <input
                    type="text"
                    class="border-0 bg-light form-control py-1 px-1"
                    bind:value={newValue[index]}
                    style="color: {key === 'id'
                      ? '#e72b2b'
                      : 'green'};font-size:10px"
                  />
                {:else}
                  "{value}"
                {/if}
              {:else if Array.isArray(value)}
                [{value.length}]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <i
                  on:click={() => showArrayDetails(value)}
                  class="fa-solid fa-arrow-up-right-from-square text-secondary"
                  style="font-size:8px"
                ></i>
              {:else}
                {value}
              {/if}
            </td>
          {/each}
          <td
            class="text-secondary d-flex gap-3"
            style="font-size:11px;font-weight:500;cursor:pointer"
          >
            {#if isEditing[item.id]}
              <button
                class="btn btn-white btn-sm"
                style="font-size:11px;padding:1px 3px"
                on:click={() => handleCancelEdit(item)}>Cancel</button
              >
              <button
                class="btn btn-success mx-1 btn-sm"
                style="font-size:11px;padding:1px 3px"
                on:click={() => handleUpdateDocument(item)}>Update</button
              >
            {:else}
              <i
                class="fa-solid fa-pen"
                on:click={() => handleEditTableDocument(item)}
              ></i>
              <i
                class="fa-solid fa-copy"
                on:click={() => handleCopyTableDocument(item)}
              ></i>
              <i
                class="fa-solid fa-trash"
                on:click={() => handleDeleteTableDocument(item)}
              ></i>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

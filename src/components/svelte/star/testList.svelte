<!-- List.svelte -->
<script>
  // import apiView from ""
  let listItems = [
    {
      label: "A",
      values: [2, 4],
    },
    {
      label: "B",
      values: [4, 5],
    },
    {
      label: "C",
      values: [6, 7],
    },
  ];
  let label = "";
  let values = "";

  const addItem = () => {
    if (label && values) {
      listItems = [
        ...listItems,
        {
          label,
          values: JSON.parse(`[${values}]`),
        },
      ];
      label = "";
      values = "";
    }
  };
</script>

<div>
  <input
    bind:value={label}
    placeholder="Label"
    class="w-100 p-1"
    style="border: 0;outline:0"
  />
  <input
    bind:value={values}
    placeholder="Values (e.g., 2,4)"
    class="w-100 mt-2 p-1"
    style="border: 0;outline:0"
  />
  <div class="text-end">
    <button
      on:click={addItem}
      class="btn btn-danger mt-2"
      style="font-size: 14px;">Add Item</button
    >
  </div>
</div>

<ul style="list-style-type: none;" class="mt-3">
  {#each listItems as item (item)}
    <li
      style="background-color: rgb(63, 81, 118);"
      class="py-1 px-3 mb-2 d-flex justify-content-between"
    >
      <span>{item.label}:</span>
      <span>
        {JSON.stringify(item.values)}
      </span>
    </li>
  {/each}
</ul>

<style>
  li,
  ul {
    padding: 0;
  }
</style>

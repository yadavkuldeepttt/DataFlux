<!-- CustomNode.svelte -->
<script lang="ts">
  import { Handle, Position } from "@xyflow/svelte";

  // Define a TypeScript interface for the data prop
  export let data: {
    label: string; // Label to be displayed on the node
    fields: string[]; // Array of fields for the entity
    relationships: string[]; // Array of relationships for the entity
  };

  console.log(data);
</script>

<!-- Main container for the custom node -->
<div class="node-container">
  <Handle type="target" position={Position.Left} />
  <!-- Display the node label -->
  <div class="node-label">{data.label}</div>

  <!-- Display each field in the node -->
  <div class="node-fields">
    {#if data.fields && data.fields.length > 0}
      {#each data.fields as field}
        <div class="field">{field}</div>
      {/each}
    {/if}
  </div>

  <!-- Display each relationship in the node -->
  <div class="node-relationships">
    {#if data.relationships && data.relationships.length > 0}
      {#each data.relationships as relationship}
        <div class="relationship">{relationship}</div>
      {/each}
    {/if}
  </div>
  <Handle type="source" position={Position.Right} />
</div>

<style>
  /* Style for the main node container */
  .node-container {
    padding: 10px; /* Space inside the container */
    border-radius: 5px; /* Rounded corners */
    border: 1px solid #ccc; /* Light gray border */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow for a 3D effect */
  }

  /* Style for the node label */
  .node-label {
    font-weight: bold; /* Make the label text bold */
    margin-bottom: 5px; /* Space below the label */
  }

  /* Style for the fields and relationships sections */
  .node-fields,
  .node-relationships {
    font-size: 14px; /* Font size for fields and relationships */
  }

  /* Style for each field and relationship */
  .field,
  .relationship {
    margin-bottom: 3px; /* Space below each field and relationship */
  }
</style>

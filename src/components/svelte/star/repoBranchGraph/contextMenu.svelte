<script lang="ts">
    import { useEdges, useNodes } from '@xyflow/svelte';
  
    export let onClick: () => void;
    export let id: string;
    export let top: number | undefined;
    export let left: number | undefined;
    export let right: number | undefined;
    export let bottom: number | undefined;
  
    const nodes = useNodes();
    const edges = useEdges();

  

// dulicate node generate
    function duplicateNode() {
      const node = $nodes.find((node) => node.id === id);
      if (node) {
        $nodes.push({
          ...node,
          // You should use a better id than this in production
          id: `${id}-copy${Math.random()}`,
          position: {
            x: node.position.x,
            y: node.position.y + 50
          }
        });
      }
      $nodes = $nodes;
    }
  
    function deleteNode() {
      $nodes = $nodes.filter((node) => node.id !== id);
      $edges = $edges.filter((edge) => edge.source !== id && edge.target !== id);
    }

  

      // Check if the node id falls within the range 'horizontal-12' to 'horizontal-15'
      function isInRange(id: string): boolean {
      const match = id.match(/horizontal-(\d+)/);
      if (match) {
        const number = parseInt(match[1], 10);
        return number >= 12 && number <= 15;
      }
      return false;
    }
  </script>
  
  <div
    style="top: {top}px; left: {left}px; right: {right}px; bottom: {bottom}px;"
    class="context-menu"
    on:click={onClick}
  >
    <p style="margin: 0.5em;">
      <small>node: {id}</small>
    </p>
    {#if !isInRange(id)}
    <button on:click={duplicateNode}>duplicate</button>
  {/if}
    <button on:click={deleteNode}>delete</button>
    
  </div>
  
  <style>
    .context-menu {
      background: white;
      border-style: solid;
      box-shadow: 10px 19px 20px rgba(0, 0, 0, 10%);
      position: absolute;
      z-index: 10;
    }
  
    .context-menu button {
      border: none;
      display: block;
      padding: 0.5em;
      text-align: left;
      width: 100%;
    }
  
    .context-menu button:hover {
      background: white;
    }
  </style>
  
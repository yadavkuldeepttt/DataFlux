<script lang="ts">
    // Import necessary Svelte modules and components
    import { writable } from 'svelte/store';
    import {
      SvelteFlow,
      Controls,
      Background,
      BackgroundVariant,
      MiniMap,
      type NodeTypes,
      type Node,
      type Edge
    } from '@xyflow/svelte';
  
    // Import initial node and edge data from external file
    import { initialNodes, initialEdges } from './nodes-end-edges2';
    import CustomNode from './customNode.svelte'; // Import custom node component
    import CustomEdgeMarker from './customEdgeMarker.svelte';
  
    // Import necessary styles for SvelteFlow
    import '@xyflow/svelte/dist/style.css';
  
    // Create writable stores for nodes and edges
    const nodes = writable<Node[]>(initialNodes);
    const edges = writable<Edge[]>(initialEdges);
  
    // Define custom node types for the flowchart
    const nodeTypes: NodeTypes = {
      custom: CustomNode
    };
   
  
  </script>
  
  <main>
    <!-- SvelteFlow component renders the flowchart with provided nodes, edges, and node types -->
    <SvelteFlow {nodes} {edges} {nodeTypes}   fitView minZoom={0.1} maxZoom={2.5}>
      <!-- Controls for navigating the flowchart -->
      <Controls />
      <CustomEdgeMarker />
      <!-- Background with dotted pattern -->
      <Background variant={BackgroundVariant.Dots} />
      <!-- MiniMap to provide an overview of the flowchart -->
      <MiniMap />
      
    </SvelteFlow>
  </main>
  
  <style>
    /* Ensure the main element takes up the full viewport height */
    main {
      height: 100vh;
    }
  
    /* Apply global styles to SvelteFlow nodes */
    :global(.svelte-flow .svelte-flow__node) {
      font-family: Arial, sans-serif;
    }
  </style>
  
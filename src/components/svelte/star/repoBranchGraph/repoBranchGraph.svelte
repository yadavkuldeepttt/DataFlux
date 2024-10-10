<script lang="ts">
  import { writable } from "svelte/store";
  import { Position, type Node, type Edge } from "@xyflow/svelte";

  import {
    SvelteFlow,
    Controls,
    Background,
    BackgroundVariant,
    MiniMap,
    type NodeTypes,
    type Node,
    type Edge,
  } from "@xyflow/svelte";

  import "@xyflow/svelte/dist/style.css";
  // import { initialNodes, initialEdges } from "./gitRepo.ts";
  import ContextMenu from "./contextMenu.svelte";
  import ContextMenuEdges from "./contextMenuEdges.svelte";
  // Import and use a function from a.ts
  import { processRepoInfo } from "./gitRepo.ts";

  export let repoInfo;

  // Call the function and pass `repoInfo`
  processRepoInfo(repoInfo);

  const nodes = writable<Node[]>([]);
  const edges = writable<Edge[]>([]);

  const createLabel = (
    commitId: string,
    commitMessage: string,
    user: number,
    commitTime: number
  ) => `
commitID: ${commitId}
commitMessage: ${commitMessage}
user: ${user}
commitTime: ${commitTime}
`;

  const selectedNodes = writable<Node[]>([]);

  let menu: {
    id: string;
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  } | null;

  let menuEdge: {
    id: string;
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  } | null;

  let width: number;
  let height: number;

  const colors = [
    "#BEE3F8",
    "#FFC107",
    "#FF5722",
    "#4CAF50",
    "#2196F3",
    "#9C27B0",
  ];

  // Function to get a color based on index
  function getColor(index) {
    return colors[index % colors.length];
  }

  function generateNodesFromBranches(branches: any[]): Node[] {
    let index;
    branches.forEach((branch, branchIndex) => {
      // Create the branch node
      index = branchIndex;
      const branchNodeId = `branch-${branch.id}`;

      nodes.update((currentNodes) => {
        currentNodes.push({
          id: branchNodeId,
          sourcePosition: Position.Right,
          type: "input",
          style: `background: ${getColor(branchIndex)}; border: ${getColor(branchIndex)}; height: 6vh; width: 5vw; display: flex; align-items: center; justify-content: center`,

          data: { label: branch.objDetails.branchName },
          position: { x: -100, y: -237 + branchIndex * 50 }, // Adjust position based on branch index
        });
        return currentNodes;
      });

      // Create commit nodes for each branch
      branch.commits.forEach((commit, commitIndex) => {
        const commitNodeId = `commit-${commit.commitId}`;

        // Assuming you have defined `nodes` as a writable store
        nodes.update((currentNodes) => {
          // Add the new commit node to the currentNodes array
          currentNodes.push({
            id: commitNodeId,
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            style: `background: ${getColor(index)}; border: ${getColor(index)};height:6vh;width:5vw;display:flex;align-items:center;justify-content:center;border-radius:6%;font-size:4px`,
            data: {
              label: createLabel(
                commit.commitId,
                commit.commitMessage,
                commit.user,
                commit.commitTime
              ),
              defaultLabel: createLabel(
                commit.commitId,
                commit.commitMessage,
                commit.user,
                commit.commitTime
              ),
            },
            position: { x: 30 + commitIndex * 100, y: -237 + branchIndex * 50 }, // Adjust position based on branch and commit index
          });

          // Return the updated array to set as the new value of the nodes store
          return currentNodes;
        });
      });
    });
    return nodes;
  }

  function generateEdgesFromBranches(branches: any[]): Edge[] {
    // Helper function to add an edge to the edges store
    const addEdge = (
      sourceId: string,
      targetId: string,
      type: string = "smoothstep",
      animated: boolean = true
    ) => {
      edges.update((currentEdges) => {
        // Check if the edge already exists
        if (
          !currentEdges.some(
            (edge) =>
              (edge.source === sourceId && edge.target === targetId) ||
              (edge.source === targetId && edge.target === sourceId)
          )
        ) {
          currentEdges.push({
            id: `edge-${sourceId}-${targetId}`,
            source: sourceId,
            target: targetId,
            type: type, // Type of edge (e.g., smoothstep, straight)
            animated: animated,
            style: { stroke: "#000" }, // Customize edge style
          });
        }
        return currentEdges;
      });
    };

    branches.forEach((branch, branchIndex) => {
      const branchNodeId = `branch-${branch.id}`;

      // Create edges between consecutive commits in the same branch
      branch.commits.forEach((commit, commitIndex) => {
        const commitNodeId = `commit-${commit.commitId}`;

        // Create an edge from the branch node to the first commit node
        if (commitIndex === 0) {
          addEdge(branchNodeId, commitNodeId);
        }

        // Create edges between consecutive commits
        if (commitIndex > 0) {
          const previousCommitId = `commit-${branch.commits[commitIndex - 1].commitId}`;
          addEdge(previousCommitId, commitNodeId);
        }
      });

      // Optional: Create edges between commits across different branches (e.g., for merging or dependencies)
      branches.forEach((otherBranch) => {
        if (otherBranch.id !== branch.id) {
          // Create edges between the first commit of the current branch and the first commit of the other branch
          if (branch.commits.length > 0 && otherBranch.commits.length > 0) {
            const firstCommitId = `commit-${branch.commits[0].commitId}`;
            const otherFirstCommitId = `commit-${otherBranch.commits[0].commitId}`;
            addEdge(firstCommitId, otherFirstCommitId, "step", false); // Use a different type or style if needed
          }
        }
      });
    });

    return edges;
  }

  generateNodesFromBranches(repoInfo.branches);
  generateEdgesFromBranches(repoInfo.branches);

  let nodesData;
  let edgesData;

  nodes.subscribe((data) => {
    nodesData = data;
  });

  console.log(nodesData, "nodes");

  edges.subscribe((data) => {
    edgesData = data;
  });
  console.log(edgesData, "edges");

  function handleContextMenu({ detail: { event, node } }) {
    // Prevent native context menu from showing
    event.preventDefault();

    // Calculate position of the context menu. We want to make sure it
    // doesn't get positioned off-screen.
    menu = {
      id: node.id,
      top: event.clientY < height - 200 ? event.clientY : undefined,
      left: event.clientX < width - 200 ? event.clientX : undefined,
      right: event.clientX >= width - 200 ? width - event.clientX : undefined,
      bottom:
        event.clientY >= height - 200 ? height - event.clientY : undefined,
    };
  }

  function handleContextMenuEdges({ detail: { event, edge } }) {
    // Prevent native context menu from showing
    event.preventDefault();

    // Calculate position of the context menu. We want to make sure it
    // doesn't get positioned off-screen.
    menuEdge = {
      id: edge.id,
      top: event.clientY < height - 200 ? event.clientY : undefined,
      left: event.clientX < width - 200 ? event.clientX : undefined,
      right: event.clientX >= width - 200 ? width - event.clientX : undefined,
      bottom:
        event.clientY >= height - 200 ? height - event.clientY : undefined,
    };
  }

  // Close the context menu if it's open whenever the window is clicked.
  function handlePaneClick() {
    menu = null;
    menuEdge = null;
  }

  const items = writable([
    { id: "1", label: "commitID", checked: true },
    { id: "2", label: "commitMessage", checked: true },
    { id: "3", label: "user", checked: true },
    { id: "4", label: "commitTime", checked: true },
  ]);

  function handleCheckboxChange(id: string, checked: boolean) {
    items.update((itemsList) => {
      const updatedItems = itemsList.map((item) =>
        item.id === id ? { ...item, checked } : item
      );
      updateNodeLabels(updatedItems);
      return updatedItems;
    });
  }

  function updateNodeLabels(itemsList) {
    const selectedFields = itemsList
      .filter((item) => item.checked)
      .map((item) => item.label);
    console.log(selectedFields, "selected fields");

    nodes.update((nodesList) => {
      return nodesList.map((node) => {
        // Skip modification for specific node labels
        if (["master", "main"].includes(node.data.label)) {
          return node;
        }

        // Extract fields from the default label
        const defaultFields = node.data.defaultLabel
          ? node.data.defaultLabel.split("\n").reduce((acc, line) => {
              const [key, value] = line.split(": ");
              if (key) acc[key] = value;
              return acc;
            }, {})
          : "";

        // Create new label from selected fields
        const newLabel = Object.entries(defaultFields)
          .filter(([key]) => selectedFields.includes(key))
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n");

        return {
          ...node,
          data: { label: newLabel, defaultLabel: node.data.defaultLabel },
        };
      });
    });
  }

  let nodesValue = [];
  let selectedNode = null; // State to store details of the clicked node

  nodes.subscribe((value) => {
    nodesValue = value;
  });

  function handleNodeClick(event) {
    const nodeId = event.detail.node.id; // Get the clicked node ID

    const node = nodesValue.find((n) => n.id === nodeId); // Find the node from the list

    if (node) {
      // Display node details, you can use a modal or sidebar here
      // For demonstration, we'll use an alert
      selectedNode = node; // Update the state with the selected node details

      selectedNodes.update((currentSelection) => {
        if (event.shiftKey) {
          // Toggle selection if shift is held
          const isSelected = currentSelection.some((n) => n.id === nodeId);
          const updatedSelection = isSelected
            ? currentSelection.filter((n) => n.id !== nodeId)
            : [...currentSelection, node];

          return updatedSelection;
        } else {
          // Add node to selection if no modifier key is held
          const isSelected = currentSelection.some((n) => n.id === nodeId);
          const updatedSelection = isSelected
            ? currentSelection
            : [...currentSelection, node];

          console.log("Updated selection without shift key:", updatedSelection);
          return updatedSelection;
        }
      });

      // Use a temporary variable to capture the selected nodes
      let selectedNodesData = null;

      selectedNodes.subscribe((value) => {
        selectedNodesData = value;
      });
    } else {
      console.log("Node not found.");
    }
  }

  // Split label into lines for display
  function getLabelLines(label) {
    return label.split("\n").map((line) => line.trim());
  }

  function mergeNodes() {
    selectedNodes.update((nodes) => {
      if (nodes.length < 2) {
        alert("Please select at least two nodes to merge.");
        return nodes;
      }

      // Example merge logic
      const newNode = {
        id: `merged-${Math.random()}`,
        position: {
          x: (nodes[0].position.x + nodes[1].position.x) / 2,
          y: (nodes[0].position.y + nodes[1].position.y) / 2,
        },
        targetPosition: nodes[0].targetPosition,
        sourcePosition: nodes[0].sourcePosition,
        style: nodes[0].style,
        data: {
          label: nodes.map((node) => node.data.label).join(" & "),
        },
      };

      console.log(newNode, "newNode");

      // Create new edges connecting the new node to the selected nodes
      const newEdges = [
        {
          id: `edge-${nodes[0].id}-${newNode.id}`,
          source: nodes[0].id,
          target: newNode.id,
          type: "smoothstep",
          animated: true,
        },
        {
          id: `edge-${nodes[1].id}-${newNode.id}`,
          source: nodes[1].id,
          target: newNode.id,
          type: "smoothstep",
          animated: true,
        },
      ];

      console.log(newEdges, "newEdges");

      // Update nodes and clear selection
      nodes = nodes.filter((n) => !$selectedNodes.find((sn) => sn.id === n.id));
      nodes = [...nodes, newNode];

      edges.update((existingEdges) => [...existingEdges, ...newEdges]);

      console.log(nodes, "nodes");

      selectedNodes.set([]);

      return nodes;
    });

    let selectedNodesData = null;

    selectedNodes.subscribe((value) => {
      selectedNodesData = value;
      nodesValue.push(selectedNodesData[0]);
      nodesValue = [...nodesValue];
      console.log(nodesValue, "nodesValue");
    });
  }
</script>

<main>
  <div class="sidebar">
    <h2>Add Nodes</h2>
    <div class="flex flex-col mt-2 gap-2">
      {#each $items as { id, label, checked }}
        <label>
          <input
            type="checkbox"
            bind:checked
            on:change={() => handleCheckboxChange(id, checked)}
          />
          &nbsp;
          {label}
        </label>
      {/each}
    </div>
    {#if $selectedNodes.length > 1}
      <button
        class="border border-gray-200 bg-gray-50 rounded-md text-sm my-2 mx-2 p-2"
        on:click={mergeNodes}>Merge</button
      >
    {/if}
  </div>

  <div
    class="flow-container"
    bind:clientWidth={width}
    bind:clientHeight={height}
  >
    <SvelteFlow
      on:nodecontextmenu={handleContextMenu}
      on:edgecontextmenu={handleContextMenuEdges}
      on:paneclick={handlePaneClick}
      {nodes}
      {edges}
      fitView
      minZoom={0.1}
      maxZoom={2.5}
      on:nodeclick={handleNodeClick}
      multiSelectionKey="shift"
    >
      <Controls />
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap />
      {#if menu}
        <ContextMenu
          onClick={handlePaneClick}
          id={menu.id}
          top={menu.top}
          left={menu.left}
          right={menu.right}
          bottom={menu.bottom}
        />
      {/if}
      {#if menuEdge}
        <ContextMenuEdges
          onClick={handlePaneClick}
          id={menuEdge.id}
          top={menuEdge.top}
          left={menuEdge.left}
          right={menuEdge.right}
          bottom={menuEdge.bottom}
        />
      {/if}
    </SvelteFlow>
    {#if selectedNode}
      <div class="node-details">
        <h3>Node Details</h3>
        <p><strong>ID:</strong> {selectedNode.id}</p>
        <p><strong>Label:</strong></p>
        <ul>
          {#each getLabelLines(selectedNode.data.label) as line}
            <li>{line}</li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</main>

<style>
  main {
    display: flex;
    height: 100vh;
  }

  .sidebar {
    width: 150px;
    padding: 10px;
    background: #f4f4f4;
    overflow-y: auto;
  }

  .flow-container {
    flex: 1;
    height: 100%;
  }

  :global(.svelte-flow .svelte-flow__node.parent) {
    background-color: rgba(220, 220, 255, 0.4);
  }
  .node-details {
    position: absolute;
    z-index: 99;
    right: 0;
    top: 0;
    padding: 20px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    margin-top: 20px;
  }
</style>

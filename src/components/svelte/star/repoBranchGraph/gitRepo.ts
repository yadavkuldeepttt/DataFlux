import { Position, type Node, type Edge } from "@xyflow/svelte";
import { writable } from "svelte/store";

let branches = [];
export function processRepoInfo(repoInfo: any) {
  console.log(repoInfo, "Received repoInfo in a.ts");
  branches = repoInfo.branches;
  // Process the `repoInfo` data as needed
}

enum MarkerType {
  Arrow = "arrow",
  ArrowClosed = "arrowclosed",
}

const createLabel = (
  commitId: string,
  message: string,
  user: number,
  time: number
) => `
commitID: ${commitId}
commitMessage: ${message}
user: ${user}
commitTime: ${time}
`;

export function generateNodesFromBranches(branches: any[]): Node[] {
  
  const nodes: Node[] = [];
  console.log(branches);
  
  branches.forEach((branch, branchIndex) => {
    console.log("Hello");
    // Create the branch node
    const branchNodeId = `branch-${branch.id}`;
    nodes.push({
      id: branchNodeId,
      sourcePosition: Position.Right,
      type: "input",
      style:
        "background: #BEE3F8;border:#BEE3F8;height:5vh;width:5vw;display:flex;align-items:center;justify-content:center",
      data: { label: branch.objDetails.branchName },
      position: { x: -100, y: -237 + branchIndex * 80 }, // Adjust position based on branch index
    });

    console.log(nodes,"n");
    

    // Create commit nodes for each branch
    branch.commits.forEach((commit, commitIndex) => {
      const commitNodeId = `commit-${branch.id}-${commit.commitId}`;
      nodes.push({
        id: commitNodeId,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style:
          "background: #BEE3F8;border:#BEE3F8;height:5vh;width:4vw;display:flex;align-items:center;justify-content:center;border-radius:6%;font-size:4px",
        data: { 
          label: createLabel(commit.commitId, commit.commitMessage, commitIndex, branchIndex),
          defaultLabel: createLabel(commit.commitId, commit.commitMessage, commitIndex, branchIndex) 
        },
        position: { x: 50 + commitIndex * 80, y: -237 + branchIndex * 80 }, // Adjust position based on branch and commit index
      });
    });
  });

  return nodes;
}

// Export the generated nodes
export const initialNodes: Node[] = generateNodesFromBranches(branches);

export function generateEdgesFromBranches(branches: any[]): Edge[] {
  const edges: Edge[] = [];

  branches.forEach((branch, branchIndex) => {
    // Create the branch node
    const branchNodeId = `branch-${branch.id}`;

    // Create commit nodes for each branch
    branch.commits.forEach((commit, commitIndex) => {
      const commitNodeId = `commit-${branch.id}-${commit.commitId}`;

      // Create an edge from the branch node to the commit node (one edge per branch to first commit)
      if (commitIndex === 0) {
        edges.push({
          id: `edge-${branchNodeId}-${commitNodeId}`,
          source: branchNodeId,
          target: commitNodeId,
          type: "smoothstep", // You can use different types of edges
          animated: true,
          style: { stroke: "#000" }, // Customize edge style
        });
      }
    });
  });

  return edges;
}

// Export the generated nodes and edges
export const initialEdges: Edge[] =generateEdgesFromBranches(branches) ;

// export const initialNodes: Node[] = [
//   {
//     id: "horizontal-1",
//     sourcePosition: Position.Right,
//     type: "input",
//     style:
//       "background: #BEE3F8;border:#BEE3F8;height:5vh;width:5vw;display:flex;align-items:center;justify-content:center",
//     data: { label: "Master" },
//     position: { x: -100, y: -237 },
//   },
//   {
//     id: "horizontal-2",
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//     style:
//       "background: #BEE3F8;border:#BEE3F8;height:5vh;width:4vw;display:flex;align-items:center;justify-content:center;border-radius:6%;font-size:4px",
//       data: {
//         label: createLabel('343dd', 'Hello', 23, 34 ),
//         defaultLabel: createLabel('343dd', 'Hello', 23, 34) // Store default label
//       },
//       position: { x: 50, y: -237 },
//   },
//   {
//     id: "horizontal-3",
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//     data: {
//       label: createLabel('3443d', 'Hello', 23, 34),
//       defaultLabel: createLabel('3443d', 'Hello', 23, 34)
//     },
//     style:
//       "background: #BEE3F8;border:#BEE3F8;height:5vh;width:4vw;display:flex;align-items:center;justify-content:center;border-radius:6%;font-size:4px;",

//     position: { x: 130, y: -237 },
//   },
//   {
//     id: "horizontal-4",
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//     data: {
//       label: createLabel('3443d', 'Hello', 23, 34) ,
//       defaultLabel: createLabel('3443d', 'Hello', 23, 34)

//     },
//     style:
//       "background: #BEE3F8;border:#BEE3F8;height:5vh;width:4vw;display:flex;align-items:center;justify-content:center;border-radius:6%;font-size:4px;",

//     position: { x: 216, y: -237 },
//   },
//   {
//     id: "horizontal-5",
//     sourcePosition: Position.Right,
//     type: "input",
//     style:
//       "background: #7511e38a;border:#7511e3;height:5vh;width:5vw;display:flex;align-items:center;justify-content:center",
//     data: { label: "Hotflix" },
//     position: { x: -100, y: -200 },
//   },
//   {
//     id: "horizontal-6",
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//     style:
//       "background: #7511e38a;border:#7511e3;height:5vh;width:4vw;display:flex;align-items:center;justify-content:center;border-radius:6%;font-size:4px",
//     data: { label: "" },
//     position: { x: 100, y: -200 },
//   },

//   {
//     id: "horizontal-7",
//     sourcePosition: Position.Right,
//     type: "input",
//     style:
//       "background: #11e36f8a;border:#7511e3;height:5vh;width:5vw;display:flex;align-items:center;justify-content:center",
//     data: { label: "Release" },
//     position: { x: -100, y: -160 },
//   },
//   {
//     id: "horizontal-8",
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//     style:
//       "background: #11e36f8a;border:#7511e3;height:5vh;width:4vw;display:flex;align-items:center;justify-content:center;border-radius:6%;font-size:4px",
//     data: { label: "" },
//     position: { x: 100, y: -160 },
//   },
//   {
//     id: "horizontal-9",
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//     data: { label: "" },
//     style:
//       "background: #11e36f8a;border:#7511e3;height:5vh;width:4vw;display:flex;align-items:center;justify-content:center;border-radius:6%;font-size:4px;",

//     position: { x: 170, y: -160 },

//   },
//   {
//     id: "horizontal-10",
//     sourcePosition: Position.Right,
//     type: "input",
//     style:
//       "background: red;border:#7511e3;height:5vh;width:5vw;display:flex;align-items:center;justify-content:center",
//     data: { label: "Develop" },
//     position: { x: -100, y: -120 },
//   },
//   {
//     id: "horizontal-11",
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//     data: { label: "Hello" },
//     style:
//       "background:red;border:#7511e3;height:5vh;width:4vw;display:flex;align-items:center;justify-content:center;border-radius:6%;font-size:4px;",
//     position: { x: 10, y: -120 },
//   },
//   {
//     id: "horizontal-12",
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//     data: { label: "" },
//     style:
//       "background:red;border:#7511e3;height:5vh;width:4vw;display:flex;align-items:center;justify-content:center;border-radius:6%;font-size:4px;",
//     position: { x: 75, y: -120 },
//   },
//   {
//     id: "horizontal-13",
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//     data: { label: "" },
//     style:
//       "background:red;border:#7511e3;height:5vh;width:4vw;display:flex;align-items:center;justify-content:center;border-radius:6%;font-size:4px;",
//     position: { x: 140, y: -120 },
//   },

//   {
//     id: "horizontal-14",
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//     data: { label: "" },
//     style:
//       "background:red;border:#7511e3;height:5vh;width:4vw;display:flex;align-items:center;justify-content:center;border-radius:6%;font-size:4px;",
//     position: { x: 230, y: -120 },
//   },

//   {
//     id: "horizontal-15",
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//     data: { label: "" },
//     style:
//       "background:red;border:#7511e3;height:5vh;width:4vw;display:flex;align-items:center;justify-content:center;border-radius:6%;font-size:4px;",
//     position: { x: 295, y: -120 },
//   },

// ];

// export const initialEdges: Edge[] = [
//   {
//     id: "horizontal-e1-4",
//     source: "horizontal-1",
//     type: 'smoothstep',
//     target: "horizontal-4",
//     animated: true,

//   },
//   {
//     id: "horizontal-e2-3",
//     source: "horizontal-2",
//     type: 'step',
//     target: "horizontal-3",
//     markerEnd: {
//       type: MarkerType.Arrow,
//       color: '#b1b1b7',
//       width: 30,
//       height: 18
//     }

//   },
//   {
//     id: "horizontal-e3-4",
//     source: "horizontal-3",
//     type:'bezier',
//     target: "horizontal-4",

//     markerEnd: {
//       type: MarkerType.Arrow,
//       color: '#b1b1b7',
//       width: 30,
//       height: 18
//     }

//   },
//   {
//     id: 'horizontal-e5-6',
//     source: 'horizontal-5',
//     type: 'smoothstep',
//     target: 'horizontal-6',
//     animated: true
//   },
//   {
//     id: 'horizontal-e7-9',
//     source: 'horizontal-7',
//     type: 'smoothstep',
//     target: 'horizontal-9',
//     animated: true,
//   },
//   {
//     id: 'horizontal-e10-15',
//     source: 'horizontal-10',
//     type: 'smoothstep',
//     target: 'horizontal-15',
//     animated: true,
//   },

//   {
//     id: 'horizontal-e2-6',
//     source: 'horizontal-2',
//     type: 'bezire',
//     target: 'horizontal-6',
//     markerEnd: {
//       type: MarkerType.Arrow,
//       color: '#b1b1b7',
//       width: 30,
//       height: 18
//     }

//   },
//   {
//     id: 'horizontal-e8-9',
//     source: 'horizontal-8',
//     type: 'straight',
//     target: 'horizontal-9',
//     markerEnd: {
//       type: MarkerType.Arrow,
//       color: '#b1b1b7',
//       width: 30,
//       height: 18
//     },
//     style: 'stroke-width: 1px;'

//   },

//   {
//     id: 'horizontal-e6-3',
//     source: 'horizontal-6',
//     type: 'straight',
//     target: 'horizontal-3',
//     markerEnd: {
//       type: MarkerType.Arrow,  // Use MarkerType for arrow
//       color: '#b1b1b7',           // Arrow color
//       width: 30,               // Arrow width
//       height: 18               // Arrow height
//     },
//     style: 'stroke-width: 1px;'

//   },
//   {
//     id: 'horizontal-e11-12',
//     source: 'horizontal-11',
//     type: 'straight',
//     target: 'horizontal-12',
//     markerEnd: {
//       type: MarkerType.Arrow,
//       color: '#b1b1b7',
//       width: 30,
//       height: 18
//     }  ,
//     style: 'stroke-width: 1px;'

//   },
//   {
//     id: 'horizontal-e12-13',
//     source: 'horizontal-12',
//     type: 'straight',
//     target: 'horizontal-13',
//     markerEnd: {
//       type: MarkerType.Arrow,
//       color: '#b1b1b7',
//       width: 30,
//       height: 18
//     },
//     style: 'stroke-width: 1px;'

//   },
//   {
//     id: 'horizontal-e13-14',
//     source: 'horizontal-13',
//     type: 'straight',
//     target: 'horizontal-14',
//     markerEnd: {
//       type: MarkerType.Arrow,
//       color: '#b1b1b7',
//       width: 30,
//       height: 18
//     },
//     style: 'stroke-width: 1px;'

//   },
//   {
//     id: 'horizontal-e14-15',
//     source: 'horizontal-14',
//     type: 'straight',
//     target: 'horizontal-15',
//     markerEnd: {
//       type: MarkerType.Arrow,
//       color: '#b1b1b7',
//       width: 30,
//       height: 18
//     }
//   },
//   {
//     id: 'horizontal-e2-11',
//     source: 'horizontal-2',
//     type: 'bezire',
//     target: 'horizontal-11',
//         markerEnd: {
//       type: MarkerType.Arrow,
//       color: '#b1b1b7',
//       width: 30,
//       height: 18
//     }
//   },

// ];

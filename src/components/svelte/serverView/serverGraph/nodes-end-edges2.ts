import { Position, type Node, type Edge, MarkerType } from '@xyflow/svelte';

// Define nodes for clusters, machines, and services
export const initialNodes: Node[] = [
  // Cluster A
  {
    id: 'cluster_1',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      label: 'Cluster A',
      fields:[],
    },
    position: { x: -70, y: 0 },
        style: 'background-color: rgba(255, 0, 0, 0.2); width: 220px; height: 250px;font-weight:600;font-size:15px',
  },
    {
    id: 'cluster_a.1', // Unique identifier for the node
    data: {
      label: 'cluster A.1', // Label displayed on the node
      fields: ['id: string', 'name: string','ch:[]'],
       relationships: [''] // Relationships to other entities
    },
    style:"width:180px;height:121px;background-color:#fafafa",
    position: { x: 14, y: 50 }, // Initial position of the node in the flowchart
    type: 'custom', // Type of the node, which corresponds to a custom node component
    parentId:"cluster_1",
  },
  {
    id: 'machine_1.1',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      label: 'Machine 1.1',
      fields: ['id: string', 'name: string','services:[]'],
    },
    position: { x: 220, y: -200 },
    type: 'custom',
  },
  {
    id: 'machine_1',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      label: 'Machine 1',
      fields: ['id: string', 'name: string'],
    },
    position: { x: 240, y: 0 },
    type: 'custom',
  },
  {
    id: 'machine_2',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      label: 'Machine 2',
      fields: ['id: string', 'name: string'],
    },
    position: { x: 240, y: 100 },
    type: 'custom',
  },
  {
    id: 'service_1',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      label: 'Service 1',
      fields: ['id: string', 'name: string'],
    },
    position: { x: 400, y: 0 },
    type: 'custom',
  },
  {
    id: 'service_2',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      label: 'Service 2',
      fields: ['id: string', 'name: string'],
    },
    position: { x: 400, y: 100 },
    type: 'custom',
  },
  // Cluster B
  {
    id: 'cluster_2',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      label: 'Cluster B',
      fields:[],
    },
    position: { x: 600, y: 0 },
    type: 'custom',
  },
  {
    id: 'machine_1_b',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      label: 'Machine 1.b',
      fields: ['id: string', 'name: string'],
    },
    position: { x: 800, y: 0 },
    type: 'custom',
  },
  {
    id: 'machine_2_b',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      label: 'Machine 2.b',
      fields: ['id: string', 'name: string'],
    },
    position: { x: 800, y: 100 },
    type: 'custom',
  },
  {
    id: 'service_1_b',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      label: 'Service 1.b',
      fields: ['id: string', 'name: string'],
    },
    position: { x: 1000, y: 0 },
    type: 'custom',
  },
  {
    id: 'service_2_b',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      label: 'Service 2.b',
      fields: ['id: string', 'name: string'],
    },
    position: { x: 1000, y: 100 },
    type: 'custom',
  },
];

// Define edges connecting nodes in the hierarchical structure
export const initialEdges: Edge[] = [
  // Cluster A connections
  {
    id: 'cluster_a.1-machine_1.1',
    source: 'cluster_a.1',
    target: 'machine_1.1',
    label: 'Contains',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#FF4000'
    },
    style: 'stroke-width: 1px; stroke: #FF4000'
  },
  {
    id: 'cluster_1-machine_1',
    source: 'cluster_1',
    target: 'machine_1',
    label: 'Contains',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#FF4000'
    },
    style: 'stroke-width: 1px; stroke: #FF4000'
  },
  {
    id: 'cluster_1-machine_2',
    source: 'cluster_1',
    target: 'machine_2',
    label: 'Contains',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#FF4000'
    },
    style: 'stroke-width: 1px; stroke: #FF4000'
  },
  {
    id: 'machine_1-service_1',
    source: 'machine_1',
    target: 'service_1',
    label: 'Hosts',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#FF4000'
    },
    style: 'stroke-width: 1px; stroke: #FF4000'
  },
  {
    id: 'machine_1-service_2',
    source: 'machine_1',
    target: 'service_2',
    label: 'Hosts',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#FF4000'
    },
    style: 'stroke-width: 1px; stroke: #FF4000'
  },
  // Cluster B connections
  {
    id: 'cluster_2-machine_1_b',
    source: 'cluster_2',
    target: 'machine_1_b',
    label: 'Contains',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#FF4000'
    },
    style: 'stroke-width: 1px; stroke: #FF4000'
  },
  {
    id: 'cluster_2-machine_2_b',
    source: 'cluster_2',
    target: 'machine_2_b',
    label: 'Contains',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#FF4000'
    },
    style: 'stroke-width: 1px; stroke: #FF4000'
  },
  {
    id: 'machine_1_b-service_1_b',
    source: 'machine_1_b',
    target: 'service_1_b',
    label: 'Hosts',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#FF4000'
    },
    style: 'stroke-width: 1px; stroke: #FF4000'
  },
  {
    id: 'machine_1_b-service_2_b',
    source: 'machine_1_b',
    target: 'service_2_b',
    label: 'Hosts',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#FF4000'
    },
    style: 'stroke-width: 1px; stroke: #FF4000'
  },
];

// Define initial nodes for the school ER diagram
// export const initialNodes: Node[] = [
//   {
//     id: 'student', // Unique identifier for the node
//     sourcePosition: Position.Right, 
//     targetPosition: Position.Left, 
//     data: {
//       label: 'Student', // Label displayed on the node
//       fields: ['id: int', 'name: string', 'dob: date', 'email: string'], // Fields of the entity
//       relationships: ['Enrollment (M:N)'] // Relationships to other entities
//     },
//     position: { x: 0, y: 100 }, // Initial position of the node in the flowchart
//     type: 'custom', // Type of the node, which corresponds to a custom node component
//   },
//   {
//     id: 'teacher', // Unique identifier for the node
//     sourcePosition: Position.Right, 
//     targetPosition: Position.Left, 
//     connectable:true,
//     deletable:true,
//     data: {
//       label: 'Teacher', // Label displayed on the node
//       fields: ['id: int', 'name: string', 'department: string', 'email: string'], // Fields of the entity
//       relationships: ['Teaches (1:N)'] // Relationships to other entities
//     },
//     position: { x: 300, y: -200 }, // Initial position of the node in the flowchart
//     type: 'custom', // Type of the node, which corresponds to a custom node component
//   },
//   {
//     id: 'course', // Unique identifier for the node
//     sourcePosition: Position.Right, 
//     targetPosition: Position.Left, 
//     data: {
//       label: 'Course', 
//     },
//     position: { x: 500, y: 100 }, // Initial position of the node in the flowchart
//     style: 'background-color: rgba(255, 0, 0, 0.2); width: 300px; height: 300px;font-weight:600;font-size:15px',
//   },
//   {
//     id: 'course-a', // Unique identifier for the node
//     data: {
//       label: '', 
//       fields: ['id: int', 'title: string', 'credits: int'], 
//       relationships: [''] 
//     },
//     type:'custom',
//     style:"width:265px;background-color:#fafafa",
//     position: { x: 15, y: 55 }, // Initial position of the node in the flowchart
//     parentId:"course",
//   },
//   {
//     id: 'course-a.1', // Unique identifier for the node
//     data: {
//       label: '', // Label displayed on the node
//       fields: ['teacherId: string'], // Fields of the entity
//       relationships: [''] // Relationships to other entities
//     },
//     connectable:false,
//     style:"width:265px;background-color:#fafafa",
//     position: { x: 0, y: 98 }, // Initial position of the node in the flowchart
//     type: 'custom', // Type of the node, which corresponds to a custom node component
//     parentId:"course-a",
//   },
//   {
//     id: 'course-a.2', // Unique identifier for the node
//     data: {
//       label: '', // Label displayed on the node
//       fields: ['enrollmentId: string'], // Fields of the entity
//       relationships: [''] // Relationships to other entities
//     },
//     style:"width:265px;background-color:#fafafa",
//     position: { x: 0, y: 148 }, // Initial position of the node in the flowchart
//     type: 'custom', // Type of the node, which corresponds to a custom node component
//     parentId:"course-a",
//   },
//   {
//     id: 'classroom',
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//     data: {
//       label: 'Classroom', // Label displayed on the node
//       fields: ['id: int', 'roomNumber: string', 'capacity: int'], // Fields of the entity
//       relationships: ['Course (1:N)'] // Relationships to other entities
//     },
//     position: { x: 1000, y: 300 }, // Initial position of the node in the flowchart
//     type: 'custom', // Type of the node, which corresponds to a custom node component
//   }
// ]

// // Define initial edges connecting nodes in the school ER diagram
// export const initialEdges: Edge[] = [
//   {
//     id: 'enrollment-edge', // Unique identifier for the edge
//     source: 'student', 
//     type: 'smoothstep', 
//     target: 'course-a.2', // ID of the target node
//     label: 'Enrollment (M:N)', // Label indicating many-to-many relationship
//     markerEnd: {
//       type: MarkerType.ArrowClosed,
//       width: 20,
//       height: 20,
//       color: '#FF4000'
//     },
//     style: 'stroke-width: 1px; stroke: #FF4000'

//   },
//   {
//     id: 'teaches-edge', // Unique identifier for the edge
//     source: 'teacher', 
//     type: 'smoothstep', 
//     target: 'course-a.1', // ID of the target node
//     label: 'Teaches (1:N)', // Label indicating one-to-many relationship
//     markerEnd: 'many-to-many',
//     // markerEnd: {
//     //   type: MarkerType.ArrowClosed,
//     //   width: 20,
//     //   height: 20,
//     //   color: '#FF4000'
//     // },
//     style: 'stroke-width: 1px; stroke: #FF4000'

//   },
//   {
//     id: 'classroom-course-edge', // Unique identifier for the edge
//     source: 'course', 
//     type: 'smoothstep', 
//     target: 'classroom', // ID of the target node
//     label: 'Held In (1:N)', // Label indicating one-to-many relationship (classroom to course)
//     markerStart: 'one-to-many',
//     // markerStart: {
//     //   type: MarkerType.ArrowClosed,
//     //   orient: 'auto-start-reverse',
//     //     width: 20,
//     //   height: 20,
//     //   color: '#FF4000'
//     // },
//     style: 'stroke-width: 1px; stroke: #FF4000'
//   }
  
// ];

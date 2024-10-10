export const editorData = {
  files: [
    {
      name: "functionX",
      tabs: [
        {
          id: "tab-1",
          tabId: "Home",
          content: {
            type: "Home",
          
          },
        },
     
      ],
    },
  ],
  splitViews: [
    {
      id: "1",
      name: "l1",
      tabs: [
        {
          id: "tab-1",
          tabId: "Main",
          content: {
            type: "code",
            language: "js",
            code: 'console.log("Main")',
            tdd: [
              {
                id: "1",
                name: "tcode",
                type: "code",
                code: 'console.log("tcode")',
                showCheck: false,
              },
              {
                id: "2",
                name: "tcode2",
                type: "code",
                code: 'console.log("tcode2")',
                showCheck: false,
              },
              {
                id: "3",
                name: "tcode3",
                type: "code",
                code: 'console.log("tcode3")',
                showCheck: false,
              },
            ],
          },
        },

        // Add more tabs if needed
      ],
    },
    {
      id: "2",
      name: "l2",
      tabs: [
        {
          id: "tab-2",
          tabId: "Svelte",
          content: {
            type: "code",
            language: "js",
            code: 'console.log("svelte")',
            tdd: [
              {
                id: "1",
                name: "tcode",
                type: "code",
                code: 'console.log("tcode)',
                showCheck: false,
              },
            ],
          },
        },
        // Add more tabs if needed
      ],
    },
    // Add more split views if needed
  ],
  reviewFiles: [
    {
      name: "functionZ",
      tabs: [
        { id: "reviewTab-1", tabId: "Scorecard", content: { type: "review" } },
      ],
    },
  ],
  envFiles: [
    {
      name: "environment",
      tabs: [
        {
          id: "tab-3",
          tabId: "Globals",
          content: [
            {
              type: "environment",
            },
          ],
        },
      ],
    },
  ],
  tests: [
    {
      text: "Get an environment variable",
      tests: ["pm.environment.get('variable_key')"],
    },
    {
      text: "Status code: Code is 200",
      tests: [
        "pm.test('Status code is 200', function () \r { pm.response.to.have.status(200); \r})",
      ],
    },
  ],
  scripts: [
    {
      text: "Get an environment variable",
      script: ["pm.globals.get('variable_key', 'variable_value');"],
    },
    {
      text: "Send a request",
      script: [
        "pm.sendRequest('https://postman-echo.com/get', function (err, response) \r {console.log(response.json()); \r});",
      ],
    },
  ],
  endToEndTests: [
    {
      name: "Login Test",
      method: "POST",
      selected: false,
      url: "/login",
      headers: { "Content-Type": "application/json" },
      requestBody: { username: "example", password: "password" },
      message: [
        "Test user login with valid credentials",
        "Ensure login functionality works correctly",
        "Verify authentication process",
      ],
    },
    {
      name: "User Registration Test",
      method: "POST",
      selected: false,
      url: "/register",
      headers: { "Content-Type": "application/json" },
      requestBody: {
        username: "example",
        email: "example@example.com",
        password: "password",
      },
      message: [
        "Test user login with valid credentials",
        "Ensure login functionality works correctly",
        "Verify authentication process",
      ],
    },
    {
      name: "Password Reset Test",
      method: "POST",
      selected: false,
      url: "/reset-password",
      headers: { "Content-Type": "application/json" },
      requestBody: { email: "example@example.com" },
      message: [
        "Test user login with valid credentials",
        "Ensure login functionality works correctly",
        "Verify authentication process",
      ],
    },
    {
      name: "User Profile Update Test",
      method: "PUT",
      selected: false,
      url: "/profile",
      headers: {
        "Content-Type": "application/json",
      },
      requestBody: { title: "John Doe" },
      message: [
        "Test user login with valid credentials",
        "Ensure login functionality works correctly",
        "Verify authentication process",
      ],
    },
    {
      name: "Data Retrieval Test",
      method: "GET",
      selected: false,
      url: "https://fakestoreapi.com/products",
      headers: { "Content-Type": "application/json" },
      message: [
        "Folder level status check",
        "Should return a object",
        "get all the product data",
      ],
    },
    {
      name: "Data Creation Test",
      method: "POST",
      selected: false,
      url: "https://fakestoreapi.com/products",
      headers: { "Content-Type": "application/json" },
      requestBody: { title: "Data Item" },
      message: [
        "Folder level status check",
        "Should post a object",
        "post the selected data",
      ],
    },
    {
      name: "Data Update Test",
      method: "PUT",
      selected: false,
      url: "/data/1",
      headers: {
        "Content-Type": "application/json",
      },
      requestBody: { name: "Updated Data Item" },
      message: [
        "Folder level status check",
        "Should return a object",
        "get all the product data",
      ],
    },
    {
      name: "Data Deletion Test",
      method: "DELETE",
      selected: false,
      url: "https://fakestoreapi.com/products/2",
      headers: { "Content-Type": "application/json" },
      message: [
        "Folder level status check",
        "Should return a object",
        "delete the selected data",
      ],
    },
    {
      name: "Authorization Test",
      method: "GET",
      selected: false,
      url: "/protected",
      headers: { Authorization: "Bearer <token>" },
      message: [
        "Folder level status check",
        "Should return a object",
        "get all the product data",
      ],
    },
    {
      name: "Error Handling Test",
      method: "GET",
      selected: false,
      url: "/error",
      headers: { Authorization: "Bearer <token>" },
      message: [
        "Folder level status check",
        "Should return a object",
        "get all the product data",
      ],
    },
    {
      name: "Performance Test",
      method: "GET",
      selected: false,
      url: "/performance",
      headers: { Authorization: "Bearer <token>" },
      message: [
        "Folder level status check",
        "Should return a object",
        "get all the product data",
      ],
    },
    {
      name: "Integration Test",
      method: "GET",
      selected: false,
      url: "/integration",
      headers: { Authorization: "Bearer <token>" },
      message: [
        "Folder level status check",
        "Should return a object",
        "get all the product data",
      ],
    },
  ],
};


const docsContent = `
  <p>You are given two integer arrays <b>nums1</b> and <b>nums2</b>, sorted in non-decreasing order, and two integers <b>m</b> and <b>n</b>, representing the number of elements in nums1 and nums2 respectively.</p><br/>
  <p><b>Merge</b> <span class="border border-gray-200 p-1 bg-gray-100 rounded">nums1</span> and  <span class="border border-gray-200 p-1 bg-gray-100 rounded">nums2</span>  into a single array sorted in non-decreasing order.</p><br/>
  <p>The final sorted array should not be returned by the function, but instead be stored inside the array nums1. To accommodate this, nums1 has a length of <b>m + n</b>, where the first m elements denote the elements that should be merged, and the last n elements are set to 0 and should be ignored. nums2 has a length of n.</p>
`;


export const repo = [
  {
    id:"repo1",
    objDetails:{
      repoName:"repo1",
      repoBranch:["main","master"],
      repoCommit:"",
      access:false,  
    },
    branches : [
      {
        id:1,
        objDetails:{
          branchName: "main",
        },
        commits: [
          {
            commitId: "commit1",
            commitMessage: "Initial commit",
            user: "User1",
            commitTime: "2024-08-30 10:00 AM",
            changes: [
              { fileName: "file1", changeType: "added", code: "+console.log('Hello world');" }
            ]
          },
          {
            commitId: "commit2",
            commitMessage: "Updated README",
            user: "User2",
            commitTime: "2024-08-31 02:00 PM",
            changes: [
              { fileName: "README.md", changeType: "modified", code: "+Added project description" }
            ]
          }
        ]
      },
      {
        id:2,
        objDetails:{
          branchName: "master",
        },
        commits: [
          {
            commitId: "commit3",
            commitMessage: "Initial commit on master",
            user: "User3",
            commitTime: "2024-08-30 09:00 AM",
            changes: [
              { fileName: "index.html", changeType: "added", code: "+<html><body>Hello world</body></html>" }
            ]
          }
        ]
      }
    ],
    folders:[
      {
      id:"folder1",
      objDetails:{
        name:"repoFolder",
      },
      subFolders:[
        {
          id:"subFolder1",
          objDetails:{
            name:"subFolder1"
          },
          subFolders:[
            {
              id:"subFolder1.1",
              objDetails:{
                name:"subFolder1.1"
              },
              subFolders:[],
              ch:[]
            }
          ],
          ch:[
            {
              id:'file1',
              name:"abc",
              type:"code",
              status:"Untracked",
              docs:"",
              code:"",
              allDocs:[],
              logSchema:[],
              schema:[],
              example:[]

            }
          ]
        }
      ],
      ch : [
        {
          id:"file1",
          name: "file1",
          type: "code",
          status:"Untracked",
          docs: docsContent, 
          code: "{}",
          allDocs: [
            {
              name: "Explanation1",
              docs: "The arrays we are merging are [1,2,3] and [2,5,6]. The result of the merge is [1,2,2,3,5,6] with the underlined elements coming from nums1.",
              drawing: "",
            },
          ],
          logSchema: [
              {
                id:'1',
              timestamp: 'Jun 19, 2024 @ 10:00:00.000',
              message: '{"level":30,"time:"4pm","request":"completed","category":"abc"}',
            },
            {
              id:'2',
              timestamp: 'Jun 20, 2024 @ 10:00:00.000',
              message: '{"level":30,"time:"4pm","request":"Uncomplete","category":"sfd"}',
            },
          ],
          schema: [
            {
              id:'1',
              input: "num1:array[]",
              output: "result:String",
            },
            {
              id:'2',
              input: "num2: number[]",
              output: "result: number",
            },
          ],
          example: [
            {
              input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
              output: "[1,2,2,3,5,6]",
              explanation: "The arrays we are merging are [1,2,3] and [2,5,6]. The result of the merge is [1,2,2,3,5,6] with the underlined elements coming from nums1.",
              logs:[
                {
                  id:'1',
                timestamp: 'Jun 19, 2024 @ 10:00:00.000',
                message: '{"level":30,"time:"4pm","request":"completed","category":"abc"}',
              },
              {
                id:'2',
                timestamp: 'Jun 20, 2024 @ 10:00:00.000',
                message: '{"level":30,"time:"4pm","request":"Uncomplete","category":"sfd"}',
              },
              ]
            },
            {
              input: "nums1 = [1], m = 1, nums2 = [], n = 0",
              output: "[1]",
              explanation: "The arrays we are merging are [1] and []. The result of the merge is [1].",
              logs:[
                {
                  id:'1',
                  timestamp: 'Jun 19, 2024 @ 10:00:00.000',
                    message: '{"level":30,"time:"4pm","request":"completed","category":"abc"}',
                }
              ]
            },
        
          ],
        },
        {
          id:"file2",
          name: "file2",
          path: "",
          type: "file",
          status:"Untracked",
          docs: "The arrays we are merging are [] and [1].",
          code: "{}",
          allDocs: [
            {
              name: "",
              docs: "",
              drawing: "",
            },
          ],
          logSchema: [],
          schema: [{}],
          example: [
            {
              input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
              output: "[1,2,2,3,5,6]",
              explanation: "The arrays we are merging are [1,2,3] and [2,5,6]. The result of the merge is [1,2,2,3,5,6] with the underlined elements coming from nums1.",
              logs:[{
                id:'1',
                timestamp:"",
                message:'',
              }]
            },
          ],
        },
      ]
    }
    ]
  },
  {
    id:"repo2",
    objDetails:{
      repoName:"repo2",
      repoBranch:[""],
      repoCommit:"",
      access:false,  
    },
    branches : [
      {
        id:"1",
        objDetails:{
          branchName: "main",
        },
        commits: [
          {
            commitId: "commit1",
            commitMessage: "Initial commit",
            user: "User1",
            commitTime: "2024-08-30 10:00 AM",
            changes: [
              { fileName: "file1.js", changeType: "added", code: "+console.log('Hello world');" }
            ]
          },
          {
            commitId: "commit2",
            commitMessage: "Updated README",
            user: "User2",
            commitTime: "2024-08-31 02:00 PM",
            changes: [
              { fileName: "README.md", changeType: "modified", code: "+Added project description" }
            ]
          }
        ]
      },
    
    ],
    folders:[],
  }
]

export const ch = [
  {
    id:"1",
    name: "File1",
    type: "code",
    docs: docsContent, 
    code: "{}",
    allDocs: [
      {
        name: "Explanation1",
        docs: "The arrays we are merging are [1,2,3] and [2,5,6]. The result of the merge is [1,2,2,3,5,6] with the underlined elements coming from nums1.",
        drawing: "",
      },
    ],
    logSchema: [
        {
          id:'1',
        timestamp: 'Jun 19, 2024 @ 10:00:00.000',
        message: '{"level":30,"time:"4pm","request":"completed","category":"abc"}',
      },
      {
        id:'2',
        timestamp: 'Jun 20, 2024 @ 10:00:00.000',
        message: '{"level":30,"time:"4pm","request":"Uncomplete","category":"sfd"}',
      },
    ],
    schema: [
      {
        id:'1',
        input: "num1:array[]",
        output: "result:String",
      },
      {
        id:'2',
        input: "num2: number[]",
        output: "result: number",
      },
    ],
    example: [
      {
        input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
        output: "[1,2,2,3,5,6]",
        explanation: "The arrays we are merging are [1,2,3] and [2,5,6]. The result of the merge is [1,2,2,3,5,6] with the underlined elements coming from nums1.",
        logs:[
          {
            id:'1',
          timestamp: 'Jun 19, 2024 @ 10:00:00.000',
          message: '{"level":30,"time:"4pm","request":"completed","category":"abc"}',
        },
        {
          id:'2',
          timestamp: 'Jun 20, 2024 @ 10:00:00.000',
          message: '{"level":30,"time:"4pm","request":"Uncomplete","category":"sfd"}',
        },
        ]
      },
      {
        input: "nums1 = [1], m = 1, nums2 = [], n = 0",
        output: "[1]",
        explanation: "The arrays we are merging are [1] and []. The result of the merge is [1].",
        logs:[
          {
            id:'1',
            timestamp: 'Jun 19, 2024 @ 10:00:00.000',
              message: '{"level":30,"time:"4pm","request":"completed","category":"abc"}',
          }
        ]
      },
  
    ],
  },
  {
    id:"2",
    name: "File2",
    path: "",
    type: "file",
    docs: "The arrays we are merging are [] and [1].",
    code: "{}",
    allDocs: [
      {
        name: "",
        docs: "",
        drawing: "",
      },
    ],
    logSchema: [],
    schema: [{}],
    example: [
      {
        input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
        output: "[1,2,2,3,5,6]",
        explanation: "The arrays we are merging are [1,2,3] and [2,5,6]. The result of the merge is [1,2,2,3,5,6] with the underlined elements coming from nums1.",
        logs:[{
          id:'1',
          timestamp:"",
          message:'',
        }]
      },
    ],
  },
];

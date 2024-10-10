export const Cluster = [
  {
    id: "c1",
    objDetails: {
      name: "cluster1",
      location: "",
    },
    // nestedCluster:[{

    //  id: "c1",
    //   objDetails: {
    //     name: "cluster1",
    //     location: "",
    //   },
    // },
    // ],

    health: [],
    nodes: [
      {
        id: "n1",
        objDetails: {
          name: "All Nodes",
        },
        metrics: [
          {
            id: "1",
            objDetails: {
              name: "System Overview",
            },

            healthRadial: [
              {
                id: "1",
                text: "Total disk writes",
                value: 68.4,
                size: "4rem",
                thickness: "3px",
                displayValue: 68.94,
                unit: "MB/s",
                progressBarColorClass: "text-danger ",
              },
              {
                id: "2",
                text: "Total disk reads",
                value: 31.47,
                size: "4rem",
                thickness: "3px",
                displayValue: 31.47,
                unit: "MB/s",
                progressBarColorClass: "text-success ",
              },
              {
                id: "3",
                text: "Total Network inbound",
                value: 18.49,
                size: "4rem",
                thickness: "3px",
                displayValue: 18.49,
                unit: "Mbit/s",
                progressBarColorClass: "text-success ",
              },
              {
                id: "4   ",
                text: "Total Netwrok outbound",
                value: 59.43,
                size: "4rem",
                thickness: "3px",
                displayValue: 59.43,
                unit: "Mbit/s",
                progressBarColorClass: "text-danger ",
              },
            ],
            healthSpeedometer: [
              {
                id: "1",
                text: "Average CPU per Node",
                data: [30.4, 61.6],
                backgroundColor: ["#ff0000", "#e0e0e0"],
              },
              {
                id: "2",
                text: "Average Used RAM per Node",
                data: [30.4, 61.6],
                backgroundColor: ["green", "#e0e0e0"],
              },
            ],
            healthPressure: [
              {
                id: "1",
                text: "Average Disk I/O Pressure (10 sec, full)",
                labels: ["08:00", "12:00", "16:00", "20:00"],
                data: [1012, 1015, 1013, 1014],
                borderColor: "#FF5733",
                backgroundColor: "rgba(255, 87, 51, 0.2)",
              },
              {
                id: "2",
                text: "Average CPU Pressure (10 sec, some)",
                labels: ["08:00", "12:00", "16:00", "20:00"],
                data: [1012, 1015, 1013, 1014],
                borderColor: "green",
                backgroundColor: "yellowgreen",
              },
            ],
            healthTopNodes: [
              {
                id: "1",
                text: "Top Nodes by CPU",
                topNodes: [
                  {
                    id: "1",
                    name: "ip-1..ml",
                    value: "98.02%",
                    bgColor: "bg-blue-600",
                    textColor: "text-blue-100",
                  },
                  {
                    id: "2",
                    name: "postregeAQL",
                    value: "38.02%",
                    bgColor: "bg-red-600",
                    textColor: "text-red-100",
                  },
                  {
                    id: "3",
                    name: "redis-master",
                    value: "98.02%",
                    bgColor: "bg-green-600",
                    textColor: "text-green-100",
                  },
                ],
              },
              {
                id: "2",
                text: "Top By Used RAM",
                topNodes: [
                  {
                    id: "1",
                    name: "ip-1..ml",
                    value: "78.02%",
                    bgColor: "bg-green-600",
                    textColor: "text-green-100",
                  },
                  {
                    id: "2",
                    name: "sdkmd",
                    value: "40.02%",
                    bgColor: "bg-amber-600",
                    textColor: "text-amber-100",
                  },
                  {
                    id: "3",
                    name: "ip-1..ml",
                    value: "98.02%",
                    bgColor: "bg-red-600",
                    textColor: "text-red-100",
                  },
                ],
              },
            ],
          },
          {
            id: "2",
            objDetails: {
              name: "cpu",
            },
          },
          {
            id: "3",
            objDetails: {
              name: "load",
            },
          },
          {
            id: "4",
            objDetails: {
              name: "disk",
            },
          },
        ],
        nodes: [
          {
            id: "1",
            objDetails: {
              name: "apache-0",
            },
            healthLineChart: [
              {
                id: "1",
                text: "Total CPU",
                labels: ["", "", ""],
                data: [0, 10, 20],
                borderColor: "#FF5733",
                backgroundColor: "rgba(255, 87, 51, 0.2)",
              },
              {
                id: "2",
                text: "Load 15",
                labels: ["", "", "", ""],
                data: [2.5, 1, 2, 1.5],
                borderColor: "green",
                backgroundColor: "yellowgreen",
              },
              {
                id: "3",
                text: "Disk Reads",
                labels: ["", "", "", ""],
                data: [2.5, 1, 2, 1.5],
                borderColor: "green",
                backgroundColor: "yellowgreen",
              },
              {
                id: "4",
                text: "MEM Available",
                labels: ["", "", "", ""],
                data: [2.5, 1, 2, 1.5],
                borderColor: "green",
                backgroundColor: "yellowgreen",
              },
            ],
          },
          {
            id: "2",
            objDetails: {
              name: "bangalore",
            },
          },
        ],
        raisedAlerts: [
          {
            status: "Warning",
            alert: "Wen log unparsed",
            name: "web log 1m matched",
            context: "tc_qos_dropped",
            instance: "tc.world_in_dropped",
            node: "sanfransico",
            latestValue: "6 packets",
            updatedAt: "8 seconds ago",
            triggeredValue: "16.87 load",
            triggeredAt: "17 seconds ago",
          },
          {
            status: "Critical",
            alert: "Wen log unparsed",
            name: "web log 1m unmatched",
            context: "tc_qos_dropped",
            instance: "tc.world_in_dropped",
            node: "sanfransico",
            latestValue: "6 packets",
            updatedAt: "8 seconds ago",
            triggeredValue: "16.87 load",
            triggeredAt: "17 seconds ago",
          },
        ],
        runningAlerts: [
          {
            alert: "10_min_cpu_iowait",
            nodesRunningAlert: 20,
            alertInstances: 89,
            contexts: "system.cpu",
            critical: "",
            warning: "",
            clear: 89,
            error: "",
            configs: 1,
            classes: "Utilization",
            components: "CPU",
            types: "System",
            roles: "silent",
            silencing: "",
          },
        ],
      },
      {
        id: "n2",
        objDetails: {
          name: "Active Directory",
        },
        metrics: [
          {
            id: "1",
            objDetails: {
              name: "System Overview",
            },

            healthRadial: [
              {
                id: "1",
                text: "Total disk writes",
                value: 68.4,
                size: "4rem",
                thickness: "3px",
                displayValue: 68.94,
                unit: "MB/s",
                progressBarColorClass: "text-danger ",
              },
            ],
            healthPressure: [],
            healthTopNodes: [],
            healthSpeedometer: [
              {
                id: "1",
                text: "Average CPU per Node",
                data: [30.4, 61.6],
                backgroundColor: ["#ff0000", "#e0e0e0"],
              },
            ],
          },
        ],
        raisedAlerts: [],
        runningAlerts: [],
      },
      {
        id: "n3",
        objDetails: {
          name: "Apache",
        },
        metrics: [
          {
            id: "1",
            objDetails: {
              name: "System Overview",
            },

            healthRadial: [
              {
                id: "1",
                text: "Total disk writes",
                value: 68.4,
                size: "4rem",
                thickness: "3px",
                displayValue: 68.94,
                unit: "MB/s",
                progressBarColorClass: "text-danger ",
              },
            ],
            healthPressure: [],
            healthTopNodes: [],
            healthSpeedometer: [
              {
                id: "1",
                text: "Average CPU per Node",
                data: [30.4, 61.6],
                backgroundColor: ["#ff0000", "#e0e0e0"],
              },
            ],
          },
        ],
        raisedAlerts: [],
        runningAlerts: [],
      },
    ],
  },
];

export const cluster1 = [
  {
    id: "cluster_1",
    objDetails: {
      name: "Cluster A",
    },
    nestedCluster:[
      {
        id: "cluster_1.1",
        objDetails: {
          name: "Cluster A.1",
        },
        ch:[
          {
            clusterId: "cluster_1.1",
            machines: [
              {
                id: "machine_1.1",
                objDetails: {
                  name: "Machine 1.1",
                },
                services: [
                  { id: "service_1.1", name: "Service 1.1" },
                  { id: "service_2.1", name: "Service 2.1" },
                ],
              },
            ]
          }
        ]
      }
    ],
    ch: [
      {
        clusterId: "cluster_1",
        machines: [
          {
            id: "machine_1",
            objDetails: {
              name: "Machine 1",
            },
            services: [
              { id: "service_1", name: "Service 1" },
              { id: "service_2", name: "Service 2" },
            ],
          },
          {
            id: "machine_2",
            objDetails: {
              name: "Machine 2",
            },
            services: [
              { id: "service_3", name: "Service 3" },
              { id: "service_4", name: "Service 4" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "cluster_2",
    objDetails: {
      name: "Cluster B",
    },
    nestedCluster:[
     
    ],
    ch: [
      {
        clusterId: "cluster_2",
        machines: [
          {
            id: "machine_1.b",
            objDetails: {
              name: "Machine 1.b",
            },
            services: [
              { id: "service_1.b", name: "Service 1" },
              { id: "service_2.b", name: "Service 2" },
            ],
          },
          {
            id: "machine_2.b",
            objDetails: {
              name: "Machine 2.b",
            },
            services: [
              { id: "service_3.b", name: "Service 3.b" },
              { id: "service_4.b", name: "Service 4.b" },
            ],
          },
        ],
      },
    ],
  },
];


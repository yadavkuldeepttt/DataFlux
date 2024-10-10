<script>
    import { onDestroy, onMount } from 'svelte';
     import Chart from 'chart.js/auto';
   
     export let healthNode;

   
     let chart;
 
     const nodeData = {
       type: 'line',
      data : {
     labels:healthNode.labels || [], // Example times
     datasets: [
       {
         label: "",
         data:healthNode.data, // Example healthNode readings
         borderColor: healthNode.borderColor,
         backgroundColor: healthNode.backgroundColor,
         fill: true,
         tension: 0.1,
       }
     ]
   },
 
   options : {
     responsive: true,
     plugins: {
       legend: {
         display: true,
       },
       tooltip: {
         callbacks: {
         }
       }
     },
     scales: {
       x: {
         title: {
           display: true,
           text: '',
         }
       },
       y: {
        stacked:true,
         title: {
           display: true,
           text: 'anomaly%',
         },
         beginAtZero: true, // Ensure y-axis starts from 0
         min: 0, // Set minimum value of y-axis to 0

       }
     }
   }
 
     }
   
     // Mount the chart
     onMount(() => {
       const ctx = document.getElementById(`lineChart-${healthNode.id}`).getContext('2d');
       chart = new Chart(ctx, nodeData);
     });
   
     // Cleanup
     onDestroy(() => {
       if (chart) {
         chart.destroy();
       }
     });
 
 </script>
 
 <canvas id={`lineChart-${healthNode.id}`} ></canvas>
 
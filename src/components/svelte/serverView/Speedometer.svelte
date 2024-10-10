<script>
    import { onDestroy, onMount } from 'svelte';
    import Chart from 'chart.js/auto';
  
    export let speedometer;
  
    let chart;
  
    // Data for the speedometer
    const speedometerData = {
      type: 'doughnut',
      data: {
        datasets: [{
          data: speedometer.data, // Value and remaining part
          backgroundColor: speedometer.backgroundColor, // Background colors
          borderWidth: 0
        }],
        labels: ['', '']
      },
      options: {
        rotation: 1 * Math.PI, // Start angle (180 degrees)
        circumference: 1 * Math.PI, // End angle (180 degrees)
        cutoutPercentage: 80, // To make it look like a gauge
        tooltips: { enabled: false },
        hover: { mode: null },
        legend: { display: false },
        title: {
          display: true,
          text: '',
          fontSize: 14,
          padding: 10
        },
        plugins: {
          datalabels: {
            display: true,
            formatter: (value, ctx) => {
              return ctx.chart.data.labels[ctx.dataIndex] === '' ? '' : value + '%';
            },
            color: '#000',
            font: {
              size: '10',
              weight: 'bold'
            }
          }
        }
      }
    };
  
    // Mount the chart
    onMount(() => {
      const ctx = document.getElementById(`speedometerChart-${speedometer.id}`).getContext('2d');
      chart = new Chart(ctx, speedometerData);
    });
  
    // Cleanup
    onDestroy(() => {
      if (chart) {
        chart.destroy();
      }
    });
  </script>
  
  <style>
    .min-max-labels {
      display: flex;
      justify-content: space-between;
      width: 100%;
      position: absolute;
      bottom: 10px;
      left: 0;
      padding: 0 10px;
    }
  </style>
  
  
  <div style="position: relative; width: 100px; height: 100px;">
    <canvas id={`speedometerChart-${speedometer.id}`} style="width: 100px!important; height: 100px!important"></canvas>
    <div class="min-max-labels">
      <span>0</span>
      <span>100</span>
    </div>
  </div>
  
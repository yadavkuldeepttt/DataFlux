<script>
   import { onDestroy, onMount } from 'svelte';
    import Chart from 'chart.js/auto';
  
    export let pressure;
  
    let chart;

    const pressureData = {
      type: 'line',
     data : {
    labels:pressure.labels, // Example times
    datasets: [
      {
        label: 'Pressure Readings',
        data:pressure.data, // Example pressure readings
        borderColor: pressure.borderColor,
        backgroundColor: pressure.backgroundColor,
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
          label: function(context) {
            return `${context.dataset.label}: ${context.raw} hPa`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        }
      },
      y: {
        title: {
          display: true,
          text: 'Pressure (hPa)',
        }
      }
    }
  }

    }
  
    // Mount the chart
    onMount(() => {
      const ctx = document.getElementById(`pressureChart-${pressure.id}`).getContext('2d');
      chart = new Chart(ctx, pressureData);
    });
  
    // Cleanup
    onDestroy(() => {
      if (chart) {
        chart.destroy();
      }
    });

</script>

<canvas id={`pressureChart-${pressure.id}`} ></canvas>

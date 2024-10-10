<script>
    import { onMount, onDestroy } from "svelte";
    import Chart from "chart.js/auto";
  
    export let data1;
    export let options1;
    export let data2;
    export let options2;
    export let height = 100;
  
    let canvas1;
    let canvas2;
    let chart1;
    let chart2;
  
    onMount(() => {
      chart1 = new Chart(canvas1, {
        type: "bar",
        data: data1,
        options: options1,
      });
  
      chart2 = new Chart(canvas2, {
        type: "bar",
        data: data2,
        options: options2,
      });
    });
  
    onDestroy(() => {
      if (chart1) chart1.destroy();
      if (chart2) chart2.destroy();
    });
  
    $: {
  if (chart1 && data1 && options1) {
    chart1.data = data1;
    chart1.options = options1;
    chart1.update();
  }

  if (chart2 && data2 && options2) {
    chart2.data = data2;
    chart2.options = options2;
    chart2.update();
  }
}
  </script>
  
  {#if options1}
  <div>
    <canvas bind:this={canvas1} ></canvas>
</div>
{/if}  
{#if options2}
  <div class="h-full">
    <canvas bind:this={canvas2} ></canvas>
  </div>
  {/if}
  
  <style>
 
  </style>
  
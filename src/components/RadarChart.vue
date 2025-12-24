<template>
  <div class="chart-container">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import {
  Chart,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'

// Register Chart.js components
Chart.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

const props = defineProps({
  labels: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    default: () => []
  },
  datasets: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: ''
  },
  maxValue: {
    type: Number,
    default: 15
  },
  color: {
    type: String,
    default: 'blue'
  },
  multiCategory: {
    type: Boolean,
    default: false
  }
})

const getColorConfig = (color) => {
  const colors = {
    red: {
      background: 'rgba(239, 68, 68, 0.2)',
      border: 'rgb(239, 68, 68)',
      point: 'rgb(239, 68, 68)'
    },
    green: {
      background: 'rgba(34, 197, 94, 0.2)',
      border: 'rgb(34, 197, 94)',
      point: 'rgb(34, 197, 94)'
    },
    yellow: {
      background: 'rgba(234, 179, 8, 0.2)',
      border: 'rgb(234, 179, 8)',
      point: 'rgb(234, 179, 8)'
    },
    blue: {
      background: 'rgba(59, 130, 246, 0.2)',
      border: 'rgb(59, 130, 246)',
      point: 'rgb(59, 130, 246)'
    }
  }
  return colors[color] || colors.blue
}

const chartRef = ref(null)
let chartInstance = null

const createChart = () => {
  if (!chartRef.value) return

  const ctx = chartRef.value.getContext('2d')
  
  // Destroy existing chart if it exists
  if (chartInstance) {
    chartInstance.destroy()
  }

  // Build datasets based on mode
  let chartDatasets
  
  if (props.multiCategory && props.datasets.length > 0) {
    // Multi-category mode: create multiple datasets with different colors
    chartDatasets = props.datasets.map(dataset => {
      const colorConfig = getColorConfig(dataset.color)
      return {
        label: dataset.label,
        data: dataset.data,
        fill: true,
        backgroundColor: colorConfig.background,
        borderColor: colorConfig.border,
        pointBackgroundColor: colorConfig.point,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: colorConfig.border,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    })
  } else {
    // Single category mode: use single dataset
    const colorConfig = getColorConfig(props.color)
    chartDatasets = [{
      label: props.title || 'Character Stats',
      data: props.data,
      fill: true,
      backgroundColor: colorConfig.background,
      borderColor: colorConfig.border,
      pointBackgroundColor: colorConfig.point,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: colorConfig.border,
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  }
  
  chartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: props.labels,
      datasets: chartDatasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          min: 0,  // Start at 0 (values range from 2-10)
          max: props.maxValue,
          beginAtZero: true,
          ticks: {
            display: false,  // Hide tick labels
            stepSize: 1,
            backdropColor: 'transparent'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',  // Very subtle grid lines
            lineWidth: 1
          },
          angleLines: {
            color: 'rgba(0, 0, 0, 0.05)',  // Very subtle angle lines
            lineWidth: 1
          },
          pointLabels: {
            font: {
              size: 13,
              weight: 'bold'
            },
            color: '#374151'
          }
        }
      },
      plugins: {
        legend: {
          display: props.multiCategory || !!props.title,
          position: 'top',
          labels: {
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || ''
              if (label) {
                label += ': '
              }
              label += context.parsed.r
              return label
            }
          }
        }
      }
    }
  })
}

onMounted(() => {
  createChart()
})

// Watch for prop changes and update chart
watch(
  () => [props.data, props.datasets, props.labels, props.maxValue, props.color, props.multiCategory],
  () => {
    createChart()
  },
  { deep: true }
)

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}
</style>


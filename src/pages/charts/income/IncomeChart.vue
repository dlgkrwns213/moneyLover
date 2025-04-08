<script setup>
import { onMounted } from 'vue'
import { Chart, ArcElement, Legend, PieController } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import axios from 'axios'

Chart.register(PieController, ArcElement, Legend, ChartDataLabels)

const bgc = [
  '#1F77B4',
  '#FF7F0E',
  '#2CA02C',
  '#D62728',
  '#9467BD',
  '#8C564B',
  '#E377C2',
  '#7F7F7F',
  '#BCBD22',
  '#17BECF',
  '#AEC7E8',
  '#FFBB78',
  '#98DF8A',
  '#FF9896',
  '#C5B0D5',
  '#C49C94',
  '#F7B6D2',
  '#C7C7C7',
  '#DBDB8D',
  '#9EDAE5',
  '#393B79',
  '#637939',
  '#8C6D31',
  '#843C39',
]

onMounted(async () => {
  const url = 'http://localhost:3000/cashflows'
  const res = await axios.get(url)
  const cashflows = res.data

  const expenses = cashflows.filter((item) => item.cashflowType === true)

  const grouped = {}
  for (const item of expenses) {
    const name = item.category || '기타'
    grouped[name] = (grouped[name] || 0) + item.cashflowValue
  }

  const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1])

  const labels = sorted.map(([key]) => key)
  const data = sorted.map(([, value]) => value)
  const backgroundColor = bgc.slice(0, data.length)

  const canvas = document.getElementById('chartCanvas')
  if (!canvas) return

  const dpr = window.devicePixelRatio || 1

  const width = canvas.clientWidth
  const height = canvas.clientHeight
  canvas.width = width * dpr
  canvas.height = height * dpr

  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColor,
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      devicePixelRatio: dpr,
      layout: {
        padding: 40,
      },
      plugins: {
        tooltip: {
          enabled: false,
        },
        datalabels: {
          clip: false,
          color: 'black',
          anchor: 'end',
          align: 'end',
          offset: 0,
          font: {
            weight: 'bold',
            size: 10,
            family: 'MyFontBold',
          },
          formatter: (value, context) => {
            const dataset = context.chart.data.datasets[0].data
            const total = dataset.reduce((acc, cur) => acc + cur, 0)
            const percent = (value / total) * 100

            if (percent < 1) return ''

            return `${percent.toFixed(1)}%`
          },
        },
        legend: {
          display: false,
        },
      },
    },
  })
})
</script>

<template>
  <div class="chart-wrapper">
    <canvas id="chartCanvas" width="400" height="400"></canvas>
  </div>
</template>

<style scoped>
.chart-wrapper {
  width: 100%;
  max-width: 225px;
  aspect-ratio: 1 / 1;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
canvas {
  width: 100% !important;
  height: auto !important;
  display: block;
}
</style>

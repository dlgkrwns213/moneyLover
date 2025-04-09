<script setup>
import { onMounted } from 'vue'
import { Chart, ArcElement, Legend, PieController } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import axios from 'axios'

Chart.register(PieController, ArcElement, Legend, ChartDataLabels)

const bgc = [
  '#AEC7E8', // 연파랑
  '#ff9999', //분홍색
  '#feca57', //노란색
  '#1dd1a1', //초록색
  '#54a0ff', //짙은 하늘색
  '#d395d0', //라벤더색
  '#ff6b6b', //다홍색

  
  '#1F77B4', // 파랑
  '#FF9896', // 연분홍
  '#9EDAE5', // 하늘청록
  '#FF7F0E', // 주황
  '#2CA02C', // 초록
  '#D62728', // 빨강
  '#9467BD', // 보라
  '#8C564B', // 갈색

  '#7F7F7F', // 회색
  '#BCBD22', // 연두
  '#17BECF', // 청록


  '#FFBB78', // 연주황
  '#98DF8A', // 연초록

  '#C5B0D5', // 연보라
  '#C49C94', // 살색
  '#F7B6D2', // 연핑크
  '#C7C7C7', // 연회색

  '#393B79', // 짙은 남색
  '#637939', // 짙은 올리브
  '#8C6D31', // 짙은 황토
  '#843C39', // 진한 적갈색
]

import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

onMounted(async () => {
  const url = 'http://localhost:3000/cashflows'
  const res = await axios.get(url, {
    params: {
      userId: userStore.userId,
    },
  })
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

/**
 * 鄉林建設管理儀表板 - 圖表模組
 * Chart.js based chart rendering - Mobile-friendly
 */

const CHART_COLORS = {
  navy: '#1e3a8a',
  blue: '#2563eb',
  sky: '#0ea5e9',
  lightBlue: '#7dd3fc',
  green: '#22c55e',
  slate: '#94a3b8',
};

// Store chart instances for cleanup
const chartInstances = {};

function destroyChart(id) {
  if (chartInstances[id]) {
    chartInstances[id].destroy();
    delete chartInstances[id];
  }
}

function isMobile() {
  return window.innerWidth <= 768;
}

/**
 * Page 1: 利潤中心柱狀圖
 */
function renderProfitCenterChart() {
  destroyChart('chartProfitCenter');
  const ctx = document.getElementById('chartProfitCenter');
  if (!ctx) return;

  const mobile = isMobile();
  const labels = mobile
    ? MOCK_DATA.profitCenters.map(d => d.name.length > 4 ? d.name.slice(0, 4) + '..' : d.name)
    : MOCK_DATA.profitCenters.map(d => d.name);

  chartInstances['chartProfitCenter'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: '營收 (百萬)',
          data: MOCK_DATA.profitCenters.map(d => d.revenue),
          backgroundColor: CHART_COLORS.navy,
          borderRadius: 4,
        },
        {
          label: '毛利 (百萬)',
          data: MOCK_DATA.profitCenters.map(d => d.profit),
          backgroundColor: CHART_COLORS.green,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: mobile ? 1.2 : 1.8,
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { size: mobile ? 10 : 12 }, boxWidth: mobile ? 12 : 40 },
        },
        tooltip: {
          callbacks: {
            afterBody: function (items) {
              var idx = items[0].dataIndex;
              var pc = MOCK_DATA.profitCenters[idx];
              return '毛利率: ' + pc.margin + '%\n類型: ' + pc.type + '\n地區: ' + pc.region;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: mobile ? 9 : 12 } },
        },
        y: {
          grid: { color: '#f1f5f9' },
          beginAtZero: true,
          ticks: { font: { size: mobile ? 9 : 12 } },
        },
      },
    },
  });
}

/**
 * Page 1: 地區貢獻圓環圖
 */
function renderRegionChart() {
  destroyChart('chartRegion');
  const ctx = document.getElementById('chartRegion');
  if (!ctx) return;

  const mobile = isMobile();

  // Aggregate by region
  const regionMap = {};
  MOCK_DATA.profitCenters.forEach(function (pc) {
    regionMap[pc.region] = (regionMap[pc.region] || 0) + pc.revenue;
  });

  const regions = Object.keys(regionMap);
  const values = Object.values(regionMap);
  const colors = [CHART_COLORS.navy, CHART_COLORS.blue, CHART_COLORS.sky, CHART_COLORS.lightBlue];

  chartInstances['chartRegion'] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: regions,
      datasets: [{
        data: values,
        backgroundColor: colors.slice(0, regions.length),
        borderWidth: 2,
        borderColor: '#fff',
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: mobile ? 1.2 : 1.5,
      cutout: '50%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: mobile ? 10 : 12 }, padding: mobile ? 10 : 20 },
        },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              var total = ctx.dataset.data.reduce(function (a, b) { return a + b; }, 0);
              var pct = ((ctx.raw / total) * 100).toFixed(1);
              return ctx.label + ': NT$' + ctx.raw + 'M (' + pct + '%)';
            },
          },
        },
      },
    },
  });
}

/**
 * Page 2: 存貨庫齡水平條形圖
 */
function renderInventoryChart() {
  destroyChart('chartInventory');
  const ctx = document.getElementById('chartInventory');
  if (!ctx) return;

  const mobile = isMobile();

  chartInstances['chartInventory'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: MOCK_DATA.inventoryAging.map(function (d) { return d.range; }),
      datasets: [{
        label: '佔比 (%)',
        data: MOCK_DATA.inventoryAging.map(function (d) { return d.value; }),
        backgroundColor: MOCK_DATA.inventoryAging.map(function (d) { return d.color; }),
        borderRadius: 4,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: mobile ? 1.3 : 2,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) { return ctx.raw + '% 的存貨'; },
          },
        },
      },
      scales: {
        x: { grid: { color: '#f1f5f9' }, beginAtZero: true, max: 60, ticks: { font: { size: mobile ? 9 : 12 } } },
        y: { grid: { display: false }, ticks: { font: { size: mobile ? 10 : 12 } } },
      },
    },
  });
}

/**
 * Page 3: 散佈圖 (成交量 vs ROI)
 */
function renderScatterChart() {
  destroyChart('chartScatter');
  const ctx = document.getElementById('chartScatter');
  if (!ctx) return;

  const mobile = isMobile();

  chartInstances['chartScatter'] = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: '業務員',
        data: MOCK_DATA.salesRanks.map(function (s) { return { x: s.deals, y: s.roi }; }),
        backgroundColor: CHART_COLORS.blue,
        pointRadius: mobile ? 8 : 10,
        pointHoverRadius: mobile ? 11 : 14,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: mobile ? 1.2 : 1.5,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              var s = MOCK_DATA.salesRanks[ctx.dataIndex];
              return s.name + ': ' + s.deals + ' 件, ROI ' + s.roi + 'x';
            },
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: '成交件數', font: { size: mobile ? 10 : 13 } },
          grid: { color: '#f1f5f9' },
          ticks: { font: { size: mobile ? 9 : 12 } },
        },
        y: {
          title: { display: true, text: 'ROI (x)', font: { size: mobile ? 10 : 13 } },
          grid: { color: '#f1f5f9' },
          ticks: { font: { size: mobile ? 9 : 12 } },
        },
      },
    },
  });
}

/**
 * Page 3: 業務員銷售金額排行
 */
function renderSalesBarChart() {
  destroyChart('chartSalesBar');
  const ctx = document.getElementById('chartSalesBar');
  if (!ctx) return;

  const mobile = isMobile();

  chartInstances['chartSalesBar'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: MOCK_DATA.salesRanks.map(function (s) { return s.name; }),
      datasets: [{
        label: '總銷金額 (百萬)',
        data: MOCK_DATA.salesRanks.map(function (s) { return s.volume; }),
        backgroundColor: [CHART_COLORS.navy, CHART_COLORS.blue, CHART_COLORS.sky, CHART_COLORS.lightBlue],
        borderRadius: 4,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: mobile ? 1.2 : 1.5,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: mobile ? 10 : 12 } } },
        y: { grid: { color: '#f1f5f9' }, beginAtZero: true, ticks: { font: { size: mobile ? 9 : 12 } } },
      },
    },
  });
}

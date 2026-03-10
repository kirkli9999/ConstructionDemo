/**
 * 寰宇建設管理儀表板 - 圖表模組
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
        {
          label: 'SLA 分攤 (百萬)',
          data: MOCK_DATA.profitCenters.map(d => (d.slaBase || 0) + (d.slaValue || 0)),
          backgroundColor: '#f97316',
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
              return '毛利率: ' + pc.margin + '%\n類型: ' + pc.type + '\n地區: ' + pc.region +
                '\nSLA 維護費: $' + (pc.slaBase || 0) + 'M / 加值: $' + (pc.slaValue || 0) + 'M';
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

// ====== Page 4: Management Charts ======

/**
 * Page 4: 建案生命週期 累積成本 vs 累積收入 (折線圖)
 */
function renderLifecycleCostChart(projectId) {
  destroyChart('chartLifecycleCost');
  var ctx = document.getElementById('chartLifecycleCost');
  if (!ctx) return;

  var pid = projectId || 'zhongshan';
  var data = MOCK_DATA.projectLifecycle[pid];
  if (!data) return;

  var mobile = isMobile();
  var labels = data.map(function (d) { return d.stage; });

  chartInstances['chartLifecycleCost'] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: '累積成本 (百萬)',
          data: data.map(function (d) { return d.cost; }),
          borderColor: '#1e3a8a',
          backgroundColor: 'rgba(30,58,138,0.08)',
          fill: true,
          tension: 0.3,
          pointRadius: mobile ? 4 : 6,
          pointHoverRadius: mobile ? 6 : 8,
          borderWidth: 2,
        },
        {
          label: '累積收入 (百萬)',
          data: data.map(function (d) { return d.revenue; }),
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34,197,94,0.08)',
          fill: true,
          tension: 0.3,
          pointRadius: mobile ? 4 : 6,
          pointHoverRadius: mobile ? 6 : 8,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: mobile ? 1.2 : 2,
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { size: mobile ? 10 : 12 }, boxWidth: mobile ? 12 : 40 },
        },
        tooltip: {
          callbacks: {
            label: function (item) {
              return item.dataset.label + ': NT$' + item.raw + 'M';
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: mobile ? 8 : 12 }, maxRotation: mobile ? 45 : 0 },
        },
        y: {
          grid: { color: '#f1f5f9' },
          beginAtZero: true,
          ticks: {
            font: { size: mobile ? 9 : 12 },
            callback: function (v) { return 'NT$' + v + 'M'; },
          },
        },
      },
    },
  });
}

/**
 * Page 4: 部門成本流向桑基圖
 */
var SANKEY_COLORS = {
  '設計部': '#6366f1', '工程部': '#2563eb', '行銷部': '#0ea5e9', '管理部': '#8b5cf6',
  '北區': '#1e3a8a', '中區': '#1d4ed8', '海外': '#0369a1',
  '高端住宅': '#059669', '飯店住宅': '#10b981', '一般住宅': '#34d399', '複合式開發': '#6ee7b7', '商辦': '#a7f3d0',
  '台北中山賦': '#f59e0b', '台中雲峰': '#f97316', '成都涵碧天下': '#ef4444', '員林案': '#ec4899',
  '台北信義案(規劃中)': '#d946ef',
};

function renderCostSankeyChart() {
  destroyChart('chartCostSankey');
  var ctx = document.getElementById('chartCostSankey');
  if (!ctx) return;

  var mobile = isMobile();

  chartInstances['chartCostSankey'] = new Chart(ctx, {
    type: 'sankey',
    data: {
      datasets: [{
        data: MOCK_DATA.costSankey,
        colorFrom: function (c) { return SANKEY_COLORS[c.dataset.data[c.dataIndex].from] || '#94a3b8'; },
        colorTo: function (c) { return SANKEY_COLORS[c.dataset.data[c.dataIndex].to] || '#94a3b8'; },
        colorMode: 'gradient',
        labels: {
          '成都涵碧天下': '涵碧天下',
          '台北信義案(規劃中)': '信義案(規劃)',
        },
        borderWidth: 0,
        nodeWidth: mobile ? 8 : 12,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: mobile ? 0.9 : 1.6,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (item) {
              var d = item.dataset.data[item.dataIndex];
              return d.from + ' → ' + d.to + ': NT$' + d.flow + 'M';
            },
          },
        },
      },
      font: { size: mobile ? 9 : 11 },
    },
  });
}

/**
 * Page 4: 業助支援桑基圖
 */
var ASSISTANT_COLORS = {
  '陳美玲(業助)': '#8b5cf6', '林雅婷(業助)': '#a78bfa', '黃淑芬(業助)': '#c4b5fd',
  '張曉明': '#2563eb', '李佩嘉': '#0ea5e9', '王大同': '#06b6d4', '林小春': '#14b8a6',
  '台北中山賦': '#f59e0b', '台中雲峰': '#f97316', '成都涵碧天下': '#ef4444', '員林案': '#ec4899',
};

// ====== Page 5: Bonus Charts ======

/**
 * Page 5: 新案 vs 舊案 銷售額 (Stacked bar per salesperson)
 */
function renderBonusBreakdownChart(personId) {
  destroyChart('chartBonusBreakdown');
  var ctx = document.getElementById('chartBonusBreakdown');
  if (!ctx) return;

  var person = MOCK_DATA.bonusSales.find(function (p) { return p.id === personId; });
  if (!person) return;

  var mobile = isMobile();
  var newTotal = 0;
  var oldTotal = 0;
  var oldWeighted = 0;

  person.deals.forEach(function (d) {
    if (d.type === '新案') {
      newTotal += d.amount;
    } else {
      oldTotal += d.amount;
      var weight = d.aging >= 3 ? 1.2 : 1.0;
      oldWeighted += d.amount * weight;
    }
  });

  chartInstances['chartBonusBreakdown'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['新案', '舊案 (原始)', '舊案 (庫齡加權)'],
      datasets: [{
        label: '銷售額 (萬)',
        data: [newTotal, oldTotal, Math.round(oldWeighted)],
        backgroundColor: [CHART_COLORS.blue, CHART_COLORS.slate, '#eab308'],
        borderRadius: 4,
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
            label: function (item) { return item.raw.toLocaleString() + ' 萬'; },
          },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: mobile ? 9 : 12 } } },
        y: {
          grid: { color: '#f1f5f9' }, beginAtZero: true,
          ticks: {
            font: { size: mobile ? 9 : 12 },
            callback: function (v) { return v.toLocaleString() + '萬'; },
          },
        },
      },
    },
  });
}

/**
 * Page 5: 各建案獎金貢獻 (Doughnut)
 */
function renderBonusProjectChart(personId) {
  destroyChart('chartBonusProject');
  var ctx = document.getElementById('chartBonusProject');
  if (!ctx) return;

  var person = MOCK_DATA.bonusSales.find(function (p) { return p.id === personId; });
  if (!person) return;

  var mobile = isMobile();
  var projectMap = {};
  person.deals.forEach(function (d) {
    projectMap[d.project] = (projectMap[d.project] || 0) + d.bonus;
  });

  var labels = Object.keys(projectMap);
  var values = Object.values(projectMap);
  var colors = ['#1e3a8a', '#2563eb', '#0ea5e9', '#22c55e', '#eab308'];

  chartInstances['chartBonusProject'] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: colors.slice(0, labels.length),
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
          labels: { font: { size: mobile ? 10 : 12 }, padding: mobile ? 8 : 16 },
        },
        tooltip: {
          callbacks: {
            label: function (item) {
              var total = item.dataset.data.reduce(function (a, b) { return a + b; }, 0);
              var pct = ((item.raw / total) * 100).toFixed(1);
              return item.label + ': ' + item.raw + '萬 (' + pct + '%)';
            },
          },
        },
      },
    },
  });
}

function renderAssistantSankeyChart() {
  destroyChart('chartAssistantSankey');
  var ctx = document.getElementById('chartAssistantSankey');
  if (!ctx) return;

  var mobile = isMobile();

  chartInstances['chartAssistantSankey'] = new Chart(ctx, {
    type: 'sankey',
    data: {
      datasets: [{
        data: MOCK_DATA.assistantSankey,
        colorFrom: function (c) { return ASSISTANT_COLORS[c.dataset.data[c.dataIndex].from] || '#94a3b8'; },
        colorTo: function (c) { return ASSISTANT_COLORS[c.dataset.data[c.dataIndex].to] || '#94a3b8'; },
        colorMode: 'gradient',
        labels: {
          '陳美玲(業助)': '陳美玲',
          '林雅婷(業助)': '林雅婷',
          '黃淑芬(業助)': '黃淑芬',
          '成都涵碧天下': '涵碧天下',
        },
        borderWidth: 0,
        nodeWidth: mobile ? 8 : 12,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: mobile ? 0.9 : 1.6,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (item) {
              var d = item.dataset.data[item.dataIndex];
              return d.from + ' → ' + d.to + ': ' + d.flow + ' 工時';
            },
          },
        },
      },
      font: { size: mobile ? 9 : 11 },
    },
  });
}

/**
 * 鄉林建設管理儀表板 - 主程式
 * Navigation, page rendering, and initialization
 */

(function () {
  'use strict';

  const PAGE_TITLES = {
    summary: '集團經營儀表板',
    lifecycle: '生命週期進程管理',
    sales: '業務績效與激勵系統',
    management: '管理課題分析',
  };

  const STATUS_MAP = {
    Completed: { label: '已完成', css: 'completed' },
    'On Track': { label: '進行中', css: 'on-track' },
    Delayed: { label: '延遲', css: 'delayed' },
    Pending: { label: '待進行', css: 'pending' },
  };

  const RANK_CLASSES = ['gold', 'silver', 'bronze', 'normal'];

  // --- Page Navigation ---
  function switchPage(pageName) {
    // Update all nav buttons (sidebar + mobile tabs)
    document.querySelectorAll('[data-page]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === pageName);
    });

    // Update pages
    document.querySelectorAll('.page').forEach(page => {
      page.classList.toggle('active', page.id === `page-${pageName}`);
    });

    // Update title
    document.getElementById('pageTitle').textContent = PAGE_TITLES[pageName] || '';

    // Render charts for the active page
    renderPageCharts(pageName);

    // Scroll to top on page switch
    window.scrollTo(0, 0);
  }

  function renderPageCharts(pageName) {
    requestAnimationFrame(() => {
      switch (pageName) {
        case 'summary':
          renderProfitCenterChart();
          renderRegionChart();
          break;
        case 'lifecycle':
          renderInventoryChart();
          break;
        case 'sales':
          renderScatterChart();
          renderSalesBarChart();
          break;
        case 'management':
          var select = document.getElementById('projectSelect');
          var pid = select ? select.value : 'zhongshan';
          renderLifecycleCostChart(pid);
          renderCostSankeyChart();
          renderAssistantSankeyChart();
          break;
    });
  }

  // --- Lifecycle Progress Bars ---
  function renderLifecycleStages() {
    var container = document.getElementById('lifecycleStages');
    if (!container) return;

    container.innerHTML = MOCK_DATA.lifecycle.map(function (step) {
      var statusInfo = STATUS_MAP[step.status] || { label: step.status, css: 'pending' };
      var barClass = step.status === 'Delayed' ? 'delayed' :
                     step.status === 'Completed' ? 'completed' : 'normal';

      return '<div class="stage-item">' +
        '<div class="stage-header">' +
          '<span>' +
            '<span class="stage-name">' + step.stage + '</span>' +
            '<span class="stage-status ' + statusInfo.css + '">' + statusInfo.label + '</span>' +
          '</span>' +
          '<span class="stage-info">進度: ' + step.actual + '% / 成本: NT$' + step.cost + 'M</span>' +
        '</div>' +
        '<div class="stage-bar-track">' +
          '<div class="stage-bar-fill ' + barClass + '" style="width: ' + step.actual + '%"></div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  // --- Sales Table (Desktop) ---
  function renderSalesTable() {
    var tbody = document.getElementById('salesTableBody');
    if (!tbody) return;

    tbody.innerHTML = MOCK_DATA.salesRanks.map(function (s, idx) {
      var rankClass = RANK_CLASSES[idx] || 'normal';

      return '<tr>' +
        '<td><span class="rank-badge ' + rankClass + '">' + (idx + 1) + '</span></td>' +
        '<td class="sales-name">' + s.name + '</td>' +
        '<td class="text-right">' + s.deals + '</td>' +
        '<td class="text-right">$' + s.volume + 'M</td>' +
        '<td class="text-right"><span class="roi-badge">' + s.roi + 'x</span></td>' +
        '<td class="text-right stars">★ ' + s.satisfaction + '</td>' +
      '</tr>';
    }).join('');
  }

  // --- Sales Cards (Mobile) ---
  function renderSalesCards() {
    var container = document.getElementById('salesCards');
    if (!container) return;

    container.innerHTML = MOCK_DATA.salesRanks.map(function (s, idx) {
      var rankClass = RANK_CLASSES[idx] || 'normal';

      return '<div class="sales-card-item">' +
        '<div class="sales-card-top">' +
          '<div class="sales-card-name-row">' +
            '<span class="rank-badge ' + rankClass + '">' + (idx + 1) + '</span>' +
            '<span class="sales-card-name">' + s.name + '</span>' +
          '</div>' +
          '<span class="roi-badge">' + s.roi + 'x ROI</span>' +
        '</div>' +
        '<div class="sales-card-stats">' +
          '<div class="sales-card-stat">' +
            '<div class="sales-card-stat-label">成交</div>' +
            '<div class="sales-card-stat-value">' + s.deals + ' 件</div>' +
          '</div>' +
          '<div class="sales-card-stat">' +
            '<div class="sales-card-stat-label">總銷</div>' +
            '<div class="sales-card-stat-value">$' + s.volume + 'M</div>' +
          '</div>' +
          '<div class="sales-card-stat">' +
            '<div class="sales-card-stat-label">滿意度</div>' +
            '<div class="sales-card-stat-value stars">★ ' + s.satisfaction + '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  // --- Resize Handler: redraw charts on orientation change / resize ---
  var resizeTimer;
  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var activePage = document.querySelector('.page.active');
      if (activePage) {
        var pageName = activePage.id.replace('page-', '');
        renderPageCharts(pageName);
      }
    }, 250);
  }

  // --- Management Page: Project Dropdown ---
  function initProjectSelect() {
    var select = document.getElementById('projectSelect');
    if (!select) return;

    select.innerHTML = MOCK_DATA.projects.map(function (p) {
      return '<option value="' + p.id + '">' + p.name + '</option>';
    }).join('');

    select.addEventListener('change', function () {
      renderLifecycleCostChart(select.value);
    });
  }

  // --- Initialize ---
  function init() {
    // Setup all navigation buttons (sidebar + mobile tabs)
    document.querySelectorAll('[data-page]').forEach(function (btn) {
      btn.addEventListener('click', function () { switchPage(btn.dataset.page); });
    });

    // Render static content
    renderLifecycleStages();
    renderSalesTable();
    renderSalesCards();
    initProjectSelect();

    // Render initial page charts
    renderPageCharts('summary');

    // Listen for resize / orientation changes
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', function () {
      setTimeout(handleResize, 300);
    });
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

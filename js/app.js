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
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === pageName);
    });

    // Update pages
    document.querySelectorAll('.page').forEach(page => {
      page.classList.toggle('active', page.id === `page-${pageName}`);
    });

    // Update title
    document.getElementById('pageTitle').textContent = PAGE_TITLES[pageName] || '';

    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('open');

    // Render charts for the active page
    renderPageCharts(pageName);
  }

  function renderPageCharts(pageName) {
    // Small delay to ensure DOM is visible before rendering charts
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
      }
    });
  }

  // --- Lifecycle Progress Bars ---
  function renderLifecycleStages() {
    const container = document.getElementById('lifecycleStages');
    if (!container) return;

    container.innerHTML = MOCK_DATA.lifecycle.map(step => {
      const statusInfo = STATUS_MAP[step.status] || { label: step.status, css: 'pending' };
      const barClass = step.status === 'Delayed' ? 'delayed' :
                       step.status === 'Completed' ? 'completed' : 'normal';

      return `
        <div class="stage-item">
          <div class="stage-header">
            <span>
              <span class="stage-name">${step.stage}</span>
              <span class="stage-status ${statusInfo.css}">${statusInfo.label}</span>
            </span>
            <span class="stage-info">進度: ${step.actual}% / 成本: NT$${step.cost}M</span>
          </div>
          <div class="stage-bar-track">
            <div class="stage-bar-fill ${barClass}" style="width: ${step.actual}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- Sales Table ---
  function renderSalesTable() {
    const tbody = document.getElementById('salesTableBody');
    if (!tbody) return;

    tbody.innerHTML = MOCK_DATA.salesRanks.map((s, idx) => {
      const rankClass = RANK_CLASSES[idx] || 'normal';
      const starsHtml = '★'.repeat(Math.floor(s.satisfaction)) +
                        (s.satisfaction % 1 >= 0.5 ? '½' : '');

      return `
        <tr>
          <td><span class="rank-badge ${rankClass}">${idx + 1}</span></td>
          <td class="sales-name">${s.name}</td>
          <td class="text-right">${s.deals}</td>
          <td class="text-right">$${s.volume}M</td>
          <td class="text-right"><span class="roi-badge">${s.roi}x</span></td>
          <td class="text-right stars">${starsHtml} ${s.satisfaction}</td>
        </tr>
      `;
    }).join('');
  }

  // --- Mobile Menu ---
  function setupMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');

    btn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !btn.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  // --- Initialize ---
  function init() {
    // Setup navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => switchPage(btn.dataset.page));
    });

    // Setup mobile menu
    setupMobileMenu();

    // Render static content
    renderLifecycleStages();
    renderSalesTable();

    // Render initial page charts
    renderPageCharts('summary');
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

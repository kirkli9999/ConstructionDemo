/**
 * 寰宇建設管理儀表板 - 主程式
 * Navigation, page rendering, and initialization
 */

(function () {
  'use strict';

  const PAGE_TITLES = {
    summary: '集團經營儀表板',
    lifecycle: '生命週期進程管理',
    sales: '業務績效與激勵系統',
    management: '管理課題分析',
    bonus: '獎金制度儀表板',
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
          renderSlaGrid();
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
        case 'bonus':
          var bSelect = document.getElementById('bonusPersonSelect');
          var bPid = bSelect ? bSelect.value : 'zhang';
          renderBonusPage(bPid);
          break;
      }
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

  // --- SLA Grid Rendering ---
  function renderSlaGrid() {
    var container = document.getElementById('slaGrid');
    if (!container) return;

    var depts = MOCK_DATA.slaDepartments;
    if (!depts) return;

    // Group by department
    var grouped = {};
    depts.forEach(function (s) {
      if (!grouped[s.dept]) grouped[s.dept] = [];
      grouped[s.dept].push(s);
    });

    var html = '';
    Object.keys(grouped).forEach(function (dept) {
      var items = grouped[dept];
      var baseItem = items.find(function (i) { return i.type === '基本維護'; });
      var valueItem = items.find(function (i) { return i.type === '加值服務'; });

      html += '<div class="sla-dept-card">' +
        '<div class="sla-dept-name">' + dept + '</div>' +
        '<div class="sla-items">';

      if (baseItem) {
        html += '<div class="sla-item base">' +
          '<span class="sla-type-badge base">維護</span>' +
          '<span class="sla-desc">' + baseItem.desc + '</span>' +
          '<span class="sla-amount">$' + baseItem.amount + 'M/月</span>' +
        '</div>';
      }
      if (valueItem) {
        html += '<div class="sla-item value">' +
          '<span class="sla-type-badge value">加值</span>' +
          '<span class="sla-desc">' + valueItem.desc + '</span>' +
          '<span class="sla-amount">$' + valueItem.amount + 'M</span>' +
        '</div>';
      }

      html += '</div></div>';
    });

    container.innerHTML = html;
  }

  // --- Bonus Page: Aging Penalty helper ---
  function calcAgingPenalty(agingMonths) {
    var penalty = MOCK_DATA.agingPenalty;
    if (!penalty || !agingMonths || agingMonths <= penalty.startMonth) return 1.0;
    var monthsOver = agingMonths - penalty.startMonth;
    var multiplier = 1.0 - (monthsOver * penalty.ratePerMonth);
    return Math.max(multiplier, penalty.floor);
  }

  // --- Bonus Page: Calculation helpers ---
  function calcBonusForPerson(person) {
    var tiers = MOCK_DATA.bonusTiers;
    var totalVolume = 0;
    var weightedVolume = 0;
    var totalBaseBonus = 0;
    var totalPenaltyAdjusted = 0;
    var newVolume = 0;
    var oldVolume = 0;

    person.deals.forEach(function (d) {
      totalVolume += d.amount;
      totalBaseBonus += d.bonus;

      // Aging penalty: reduce bonus for old inventory
      var penaltyMult = calcAgingPenalty(d.agingMonths || 0);
      totalPenaltyAdjusted += Math.round(d.bonus * penaltyMult);

      if (d.type === '新案') {
        newVolume += d.amount;
      } else {
        oldVolume += d.amount;
        // 3年以上舊案，總額以1.2倍計入（獎勵去化）
        var weight = d.aging >= 3 ? 1.2 : 1.0;
        weightedVolume += d.amount * weight;
      }
    });

    // For tier calculation, use weighted volume
    var tierVolume = newVolume + weightedVolume;

    // Find current tier (全額追溯)
    var currentTier = tiers[0];
    for (var i = tiers.length - 1; i >= 0; i--) {
      if (tierVolume >= tiers[i].threshold) {
        currentTier = tiers[i];
        break;
      }
    }

    // Final bonus = penalty-adjusted base * tier multiplier
    var finalBonus = Math.round(totalPenaltyAdjusted * currentTier.multiplier);

    // Next tier gap
    var nextTier = null;
    var gap = 0;
    for (var j = 0; j < tiers.length; j++) {
      if (tiers[j].threshold > tierVolume) {
        nextTier = tiers[j];
        gap = tiers[j].threshold - tierVolume;
        break;
      }
    }

    return {
      totalVolume: totalVolume,
      tierVolume: tierVolume,
      newVolume: newVolume,
      oldVolume: oldVolume,
      totalBaseBonus: totalBaseBonus,
      totalPenaltyAdjusted: totalPenaltyAdjusted,
      currentTier: currentTier,
      finalBonus: finalBonus,
      nextTier: nextTier,
      gap: gap,
    };
  }

  function renderBonusPage(personId) {
    var person = MOCK_DATA.bonusSales.find(function (p) { return p.id === personId; });
    if (!person) return;

    var calc = calcBonusForPerson(person);

    // Update KPI cards
    document.getElementById('bonusTotalBonus').textContent = calc.finalBonus.toLocaleString() + '萬';
    document.getElementById('bonusTotalVolume').textContent = calc.totalVolume.toLocaleString() + '萬';
    document.getElementById('bonusCurrentTier').textContent = calc.currentTier.multiplier.toFixed(2) + 'x ' + calc.currentTier.label;
    document.getElementById('bonusMultiplierBadge').textContent = calc.currentTier.multiplier.toFixed(2) + 'x';

    if (calc.nextTier) {
      document.getElementById('bonusNextGap').textContent = '再 ' + calc.gap.toLocaleString() + ' 萬 → ' + calc.nextTier.multiplier.toFixed(2) + 'x';
    } else {
      document.getElementById('bonusNextGap').textContent = '已達最高階';
    }

    // Render tier progress bar
    renderTierProgress(calc);

    // Render table
    renderBonusTable(person);
    renderBonusDealCards(person);

    // Render charts
    renderBonusBreakdownChart(personId);
    renderBonusProjectChart(personId);

    // Hide simulator result when switching person
    var simResult = document.getElementById('simResult');
    if (simResult) simResult.style.display = 'none';
  }

  function renderTierProgress(calc) {
    var container = document.getElementById('bonusTierProgress');
    if (!container) return;

    var tiers = MOCK_DATA.bonusTiers;
    var maxThreshold = tiers[tiers.length - 1].threshold;
    var barMax = maxThreshold * 1.1; // give some room beyond top tier
    var pct = Math.min((calc.tierVolume / barMax) * 100, 100);

    var html = '<div class="tier-bar-wrap">' +
      '<div class="tier-bar-track">' +
        '<div class="tier-bar-fill' + (calc.currentTier.level >= 2 ? ' glow' : '') + '" style="width:' + pct + '%"></div>' +
      '</div>' +
      '<div class="tier-markers">';

    for (var i = 1; i < tiers.length; i++) {
      var pos = (tiers[i].threshold / barMax) * 100;
      var isActive = calc.tierVolume >= tiers[i].threshold;
      html += '<div class="tier-marker' + (isActive ? ' active' : '') + '" style="left:' + pos + '%">' +
        '<div class="tier-marker-dot"></div>' +
        tiers[i].multiplier.toFixed(2) + 'x<br>' + (tiers[i].threshold / 10000).toFixed(1) + '億' +
      '</div>';
    }

    html += '</div></div>';
    container.innerHTML = html;
  }

  function renderBonusTable(person) {
    var tbody = document.getElementById('bonusTableBody');
    if (!tbody) return;

    tbody.innerHTML = person.deals.map(function (d) {
      var weight = d.aging >= 3 ? '1.2x' : (d.type === '舊案' ? '1.0x' : '-');
      var penalty = calcAgingPenalty(d.agingMonths || 0);
      var penaltyStr = penalty < 1.0 ? penalty.toFixed(2) + 'x' : '-';
      var penaltyClass = penalty < 0.9 ? ' style="color:#ef4444;font-weight:700"' : (penalty < 1.0 ? ' style="color:#f97316"' : '');
      var typeClass = d.type === '新案' ? 'new-deal' : 'old-deal';
      return '<tr>' +
        '<td>' + d.project + '</td>' +
        '<td><span class="bonus-deal-type ' + typeClass + '">' + d.type + '</span></td>' +
        '<td>' + d.date + '</td>' +
        '<td class="text-right">' + d.amount.toLocaleString() + '</td>' +
        '<td class="text-right">' + d.bonus.toLocaleString() + '</td>' +
        '<td class="text-right">' + weight + '</td>' +
        '<td class="text-right"' + penaltyClass + '>' + penaltyStr + '</td>' +
      '</tr>';
    }).join('');
  }

  function renderBonusDealCards(person) {
    var container = document.getElementById('bonusDealCards');
    if (!container) return;

    container.innerHTML = person.deals.map(function (d) {
      var typeClass = d.type === '新案' ? 'new-deal' : 'old-deal';
      var weight = d.aging >= 3 ? '1.2x' : (d.type === '舊案' ? '1.0x' : '-');
      var penalty = calcAgingPenalty(d.agingMonths || 0);
      var penaltyStr = penalty < 1.0 ? penalty.toFixed(2) + 'x' : '-';
      return '<div class="bonus-deal-item">' +
        '<div class="bonus-deal-top">' +
          '<span class="bonus-deal-project">' + d.project + '</span>' +
          '<span class="bonus-deal-type ' + typeClass + '">' + d.type + '</span>' +
        '</div>' +
        '<div class="bonus-deal-stats">' +
          '<div class="bonus-deal-stat">' +
            '<div class="bonus-deal-stat-label">金額</div>' +
            '<div class="bonus-deal-stat-value">' + d.amount.toLocaleString() + '萬</div>' +
          '</div>' +
          '<div class="bonus-deal-stat">' +
            '<div class="bonus-deal-stat-label">獎金</div>' +
            '<div class="bonus-deal-stat-value">' + d.bonus + '萬</div>' +
          '</div>' +
          '<div class="bonus-deal-stat">' +
            '<div class="bonus-deal-stat-label">懲處</div>' +
            '<div class="bonus-deal-stat-value" style="' + (penalty < 1.0 ? 'color:#ef4444' : '') + '">' + penaltyStr + '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  // --- Bonus Page: Dropdown ---
  function initBonusPersonSelect() {
    var select = document.getElementById('bonusPersonSelect');
    if (!select) return;

    select.innerHTML = MOCK_DATA.bonusSales.map(function (p) {
      return '<option value="' + p.id + '">' + p.name + '</option>';
    }).join('');

    select.addEventListener('change', function () {
      renderBonusPage(select.value);
    });
  }

  // --- Bonus Page: Simulator ---
  function initBonusSimulator() {
    var btn = document.getElementById('simCalcBtn');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var personSelect = document.getElementById('bonusPersonSelect');
      var personId = personSelect ? personSelect.value : 'zhang';
      var person = MOCK_DATA.bonusSales.find(function (p) { return p.id === personId; });
      if (!person) return;

      var amountInput = document.getElementById('simAmount');
      var simAmount = parseFloat(amountInput.value) || 0;
      if (simAmount <= 0) return;

      var projectType = document.getElementById('simProject').value;
      var calc = calcBonusForPerson(person);

      // Determine aging weight for sim deal
      var simAging = 0;
      if (projectType === '舊案-1年') simAging = 1.5;
      else if (projectType === '舊案-2年') simAging = 2.5;
      else if (projectType === '舊案-3年') simAging = 3.5;

      var simWeight = simAging >= 3 ? 1.2 : 1.0;
      var simWeightedAmount = simAging > 0 ? simAmount * simWeight : simAmount;
      var newTierVolume = calc.tierVolume + simWeightedAmount;

      // Find new tier
      var tiers = MOCK_DATA.bonusTiers;
      var newTier = tiers[0];
      for (var i = tiers.length - 1; i >= 0; i--) {
        if (newTierVolume >= tiers[i].threshold) {
          newTier = tiers[i];
          break;
        }
      }

      // Sim bonus: assume 3% commission on new deal
      var simDealBonus = Math.round(simAmount * 0.03);
      var newTotalBaseBonus = calc.totalBaseBonus + simDealBonus;
      var newFinalBonus = Math.round(newTotalBaseBonus * newTier.multiplier);
      var delta = newFinalBonus - calc.finalBonus;

      // Display results
      document.getElementById('simNewVolume').textContent = Math.round(newTierVolume).toLocaleString() + ' 萬';
      document.getElementById('simNewMultiplier').textContent = newTier.multiplier.toFixed(2) + 'x ' + newTier.label;
      document.getElementById('simBonusDelta').textContent = '+' + delta.toLocaleString() + ' 萬';

      var upgraded = newTier.level > calc.currentTier.level;
      document.getElementById('simNewMultiplier').style.color = upgraded ? '#22c55e' : '';
      document.getElementById('simBonusDelta').style.color = upgraded ? '#22c55e' : '';

      document.getElementById('simResult').style.display = '';
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
    initBonusPersonSelect();
    initBonusSimulator();
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

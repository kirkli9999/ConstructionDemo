/**
 * 寰宇建設管理儀表板 - 模擬資料 (Mock Data)
 * Universe Group Construction Dashboard - 2026
 */

const MOCK_DATA = {
  // 集團 KPI 摘要
  summary: [
    { name: '集團營收', value: '32.5億', change: '+5.2%', status: 'up' },
    { name: '平均毛利率', value: '28.5%', change: '+3.2%', status: 'up' },
    { name: '資產週轉率', value: '1.2x', change: '-0.1', status: 'down' },
    { name: '品牌溢價率', value: '115%', change: '+2.0%', status: 'up' },
  ],

  // 利潤中心（按建案）- 含 SLA 內部服務定價分攤
  profitCenters: [
    { name: '北市A1案', region: '北部', revenue: 1200, profit: 360, margin: 30, type: '高端住宅', slaBase: 18, slaValue: 12 },
    { name: '中部B2案', region: '中部', revenue: 850, profit: 212, margin: 25, type: '飯店住宅', slaBase: 13, slaValue: 8 },
    { name: '海外C3案', region: '大陸', revenue: 1500, profit: 450, margin: 30, type: '複合式', slaBase: 22, slaValue: 18 },
    { name: '中部D4案', region: '中部', revenue: 400, profit: 80, margin: 20, type: '住宅', slaBase: 6, slaValue: 3 },
  ],

  // 內部服務定價 SLA 後勤部門
  slaDepartments: [
    { dept: '人資部', type: '基本維護', desc: '薪資發放、勞健保', rate: '固定月費', amount: 15 },
    { dept: '人資部', type: '加值服務', desc: '專案人才招聘', rate: '按件計價', amount: 8 },
    { dept: '財務部', type: '基本維護', desc: '帳務處理、稅務申報', rate: '固定月費', amount: 12 },
    { dept: '財務部', type: '加值服務', desc: '投資分析、資金調度', rate: '按件計價', amount: 15 },
    { dept: '法務部', type: '基本維護', desc: '合約範本維護', rate: '固定月費', amount: 8 },
    { dept: '法務部', type: '加值服務', desc: '合約審查、訴訟處理', rate: '按件計價', amount: 10 },
    { dept: '資訊部', type: '基本維護', desc: '系統維運、資安管理', rate: '固定月費', amount: 10 },
    { dept: '資訊部', type: '加值服務', desc: '客製開發、BI 報表', rate: '按件計價', amount: 6 },
  ],

  // 建案生命週期
  lifecycle: [
    { stage: '土地開發', planned: 100, actual: 95, cost: 500, status: 'Completed' },
    { stage: '建築規劃', planned: 100, actual: 100, cost: 120, status: 'Completed' },
    { stage: '預售階段', planned: 80, actual: 85, cost: 200, status: 'On Track' },
    { stage: '施工階段', planned: 60, actual: 55, cost: 850, status: 'Delayed' },
    { stage: '交屋結案', planned: 20, actual: 15, cost: 50, status: 'Pending' },
  ],

  // 存貨庫齡分佈
  inventoryAging: [
    { range: '< 1年', value: 45, color: '#22c55e' },
    { range: '1-2年', value: 30, color: '#eab308' },
    { range: '2-3年', value: 15, color: '#f97316' },
    { range: '> 3年', value: 10, color: '#ef4444' },
  ],

  // 業務戰力排行
  salesRanks: [
    { name: '張曉明', deals: 12, volume: 180, roi: 8.5, satisfaction: 4.8 },
    { name: '李佩嘉', deals: 10, volume: 155, roi: 7.9, satisfaction: 4.9 },
    { name: '王大同', deals: 9, volume: 140, roi: 7.2, satisfaction: 4.5 },
    { name: '林小春', deals: 7, volume: 95, roi: 6.8, satisfaction: 4.7 },
  ],

  // ====== 第四頁：管理課題 ======

  // 建案清單（下拉選單用）
  projects: [
    { id: 'zhongshan', name: '北市A1案' },
    { id: 'yunfeng', name: '中部B2案' },
    { id: 'chengdu', name: '海外C3案' },
    { id: 'yuanlin', name: '中部D4案' },
  ],

  // 各建案生命週期：累積成本 vs 累積收入 (百萬 NTD)
  projectLifecycle: {
    zhongshan: [
      { stage: '土地開發', cost: 800, revenue: 0 },
      { stage: '建築規劃', cost: 920, revenue: 0 },
      { stage: '預售階段', cost: 980, revenue: 650 },
      { stage: '施工階段', cost: 1350, revenue: 1280 },
      { stage: '交屋結案', cost: 1400, revenue: 1750 },
    ],
    yunfeng: [
      { stage: '土地開發', cost: 500, revenue: 0 },
      { stage: '建築規劃', cost: 580, revenue: 0 },
      { stage: '預售階段', cost: 640, revenue: 480 },
      { stage: '施工階段', cost: 900, revenue: 920 },
      { stage: '交屋結案', cost: 950, revenue: 1180 },
    ],
    chengdu: [
      { stage: '土地開發', cost: 1200, revenue: 0 },
      { stage: '建築規劃', cost: 1380, revenue: 0 },
      { stage: '預售階段', cost: 1500, revenue: 800 },
      { stage: '施工階段', cost: 1900, revenue: 1650 },
      { stage: '交屋結案', cost: 2000, revenue: 2350 },
    ],
    yuanlin: [
      { stage: '土地開發', cost: 250, revenue: 0 },
      { stage: '建築規劃', cost: 300, revenue: 0 },
      { stage: '預售階段', cost: 340, revenue: 150 },
      { stage: '施工階段', cost: 450, revenue: 280 },
      { stage: '交屋結案', cost: 480, revenue: 400 },
    ],
  },

  // 部門成本流向桑基圖：支援部門 → 地區 → 建案類型 → 建案
  costSankey: [
    // 支援部門 → 地區
    { from: '設計部', to: '北區', flow: 180 },
    { from: '設計部', to: '中區', flow: 140 },
    { from: '設計部', to: '海外', flow: 200 },
    { from: '工程部', to: '北區', flow: 300 },
    { from: '工程部', to: '中區', flow: 250 },
    { from: '工程部', to: '海外', flow: 350 },
    { from: '行銷部', to: '北區', flow: 120 },
    { from: '行銷部', to: '中區', flow: 90 },
    { from: '行銷部', to: '海外', flow: 100 },
    { from: '管理部', to: '北區', flow: 80 },
    { from: '管理部', to: '中區', flow: 70 },
    { from: '管理部', to: '海外', flow: 60 },
    // 地區 → 建案類型
    { from: '北區', to: '高端住宅', flow: 520 },
    { from: '北區', to: '商辦', flow: 160 },
    { from: '中區', to: '飯店住宅', flow: 300 },
    { from: '中區', to: '一般住宅', flow: 250 },
    { from: '海外', to: '複合式開發', flow: 710 },
    // 建案類型 → 建案
    { from: '高端住宅', to: '北市A1案', flow: 520 },
    { from: '商辦', to: '北市E5案(規劃中)', flow: 160 },
    { from: '飯店住宅', to: '中部B2案', flow: 300 },
    { from: '一般住宅', to: '中部D4案', flow: 250 },
    { from: '複合式開發', to: '海外C3案', flow: 710 },
  ],

  // 業助支援桑基圖：業助 → 業務員 → 建案
  assistantSankey: [
    // 業助 → 業務員
    { from: '陳美玲(業助)', to: '張曉明', flow: 45 },
    { from: '陳美玲(業助)', to: '李佩嘉', flow: 35 },
    { from: '林雅婷(業助)', to: '王大同', flow: 40 },
    { from: '林雅婷(業助)', to: '林小春', flow: 30 },
    { from: '林雅婷(業助)', to: '張曉明', flow: 15 },
    { from: '黃淑芬(業助)', to: '李佩嘉', flow: 25 },
    { from: '黃淑芬(業助)', to: '王大同', flow: 20 },
    // 業務員 → 建案
    { from: '張曉明', to: '北市A1案', flow: 35 },
    { from: '張曉明', to: '中部B2案', flow: 25 },
    { from: '李佩嘉', to: '北市A1案', flow: 30 },
    { from: '李佩嘉', to: '海外C3案', flow: 30 },
    { from: '王大同', to: '中部B2案', flow: 35 },
    { from: '王大同', to: '中部D4案', flow: 25 },
    { from: '林小春', to: '中部D4案', flow: 20 },
    { from: '林小春', to: '海外C3案', flow: 10 },
  ],

  // ====== 第五頁：獎金制度 ======

  // 階梯乘數門檻定義（全額追溯制）
  bonusTiers: [
    { level: 1, label: '達標', multiplier: 1.00, threshold: 0 },
    { level: 2, label: '優良', multiplier: 1.05, threshold: 10000 },
    { level: 3, label: '傑出', multiplier: 1.10, threshold: 15000 },
    { level: 4, label: '頂尖', multiplier: 1.15, threshold: 20000 },
  ],

  // 庫齡懲處乘數：成屋超過12個月後，每月 -0.01x，最低 0.85x
  agingPenalty: {
    startMonth: 12,     // 成屋後第12個月開始懲處
    ratePerMonth: 0.01, // 每月扣減
    floor: 0.85,        // 最低乘數下限
  },

  // 業務員獎金資料（含新舊案明細）
  // agingMonths: 該案成屋後已經過幾個月（0=新案或尚未成屋）
  bonusSales: [
    {
      id: 'zhang', name: '張曉明', satisfaction: 4.8,
      deals: [
        { project: '北市A1案', type: '新案', date: '2026/01/15', amount: 4800, bonus: 144, aging: 0, agingMonths: 0 },
        { project: '北市A1案', type: '新案', date: '2026/02/20', amount: 5200, bonus: 156, aging: 0, agingMonths: 0 },
        { project: '中部B2案',   type: '舊案', date: '2026/01/28', amount: 3200, bonus: 96,  aging: 2.5, agingMonths: 18 },
        { project: '海外C3案', type: '新案', date: '2026/03/05', amount: 3800, bonus: 114, aging: 0, agingMonths: 0 },
        { project: '中部D4案',     type: '舊案', date: '2026/02/10', amount: 1800, bonus: 54,  aging: 3.2, agingMonths: 26 },
      ],
    },
    {
      id: 'li', name: '李佩嘉', satisfaction: 4.9,
      deals: [
        { project: '北市A1案', type: '新案', date: '2026/01/20', amount: 5100, bonus: 153, aging: 0, agingMonths: 0 },
        { project: '海外C3案', type: '新案', date: '2026/02/15', amount: 4200, bonus: 126, aging: 0, agingMonths: 0 },
        { project: '中部B2案',   type: '舊案', date: '2026/03/01', amount: 2800, bonus: 84,  aging: 1.8, agingMonths: 10 },
        { project: '北市A1案', type: '新案', date: '2026/03/08', amount: 3600, bonus: 108, aging: 0, agingMonths: 0 },
      ],
    },
    {
      id: 'wang', name: '王大同', satisfaction: 4.5,
      deals: [
        { project: '中部B2案',   type: '新案', date: '2026/01/10', amount: 3500, bonus: 105, aging: 0, agingMonths: 0 },
        { project: '中部D4案',     type: '舊案', date: '2026/01/25', amount: 2200, bonus: 66,  aging: 3.5, agingMonths: 30 },
        { project: '中部B2案',   type: '新案', date: '2026/02/18', amount: 4100, bonus: 123, aging: 0, agingMonths: 0 },
        { project: '中部D4案',     type: '舊案', date: '2026/03/02', amount: 1600, bonus: 48,  aging: 4.1, agingMonths: 38 },
        { project: '海外C3案', type: '新案', date: '2026/03/09', amount: 2800, bonus: 84,  aging: 0, agingMonths: 0 },
      ],
    },
    {
      id: 'lin', name: '林小春', satisfaction: 4.7,
      deals: [
        { project: '中部D4案',     type: '舊案', date: '2026/01/12', amount: 1900, bonus: 57,  aging: 3.8, agingMonths: 34 },
        { project: '海外C3案', type: '新案', date: '2026/02/05', amount: 3200, bonus: 96,  aging: 0, agingMonths: 0 },
        { project: '中部D4案',     type: '舊案', date: '2026/02/22', amount: 1500, bonus: 45,  aging: 4.0, agingMonths: 36 },
        { project: '中部B2案',   type: '新案', date: '2026/03/06', amount: 2900, bonus: 87,  aging: 0, agingMonths: 0 },
      ],
    },
  ],
};

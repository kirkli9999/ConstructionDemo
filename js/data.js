/**
 * 鄉林建設管理儀表板 - 模擬資料 (Mock Data)
 * Shining Group Construction Dashboard - 2026
 */

const MOCK_DATA = {
  // 集團 KPI 摘要
  summary: [
    { name: '集團營收', value: '32.5億', change: '+5.2%', status: 'up' },
    { name: '平均毛利率', value: '28.5%', change: '+3.2%', status: 'up' },
    { name: '資產週轉率', value: '1.2x', change: '-0.1', status: 'down' },
    { name: '品牌溢價率', value: '115%', change: '+2.0%', status: 'up' },
  ],

  // 利潤中心（按建案）
  profitCenters: [
    { name: '台北中山賦', region: '北部', revenue: 1200, profit: 360, margin: 30, type: '高端住宅' },
    { name: '台中雲峰', region: '中部', revenue: 850, profit: 212, margin: 25, type: '飯店住宅' },
    { name: '成都涵碧天下', region: '大陸', revenue: 1500, profit: 450, margin: 30, type: '複合式' },
    { name: '員林案', region: '中部', revenue: 400, profit: 80, margin: 20, type: '住宅' },
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
};

//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    Lucide icons for Super Admin dashboard telemetry cards
//==================================================================================================================
import { Bookmark, Files, CircleDollarSign, Percent } from 'lucide-react';

//==================================================================================================================
//    SUPER ADMIN STAT CARDS CONSTANTS
//    Four metric cards matching Image 1 and Image 3 specifications
//==================================================================================================================
export const ADMIN_STAT_CARDS = [
  {
    id: 'total-leads',
    title: 'Total Leads',
    value: '14,820',
    subText: '12.05% from last month',
    trendType: 'positive',
    colorKey: 'secondary',
    icon: Bookmark,
  },
  {
    id: 'total-accounts',
    title: 'Total Accounts',
    value: '3,128',
    subText: '1,890 Enterprise • 590 Mid-Mkt',
    trendType: 'neutral',
    colorKey: 'success',
    icon: Files,
  },
  {
    id: 'active-deals',
    title: 'Active Deals',
    value: '864',
    subText: 'Active weighted pipeline',
    trendType: 'neutral',
    colorKey: 'alert',
    icon: CircleDollarSign,
  },
  {
    id: 'total-won-revenue',
    title: 'Total Won Revenue',
    value: '₹1,28,50,000',
    subText: '107% of QTD Target Quota',
    trendType: 'positive',
    colorKey: 'purple',
    icon: Percent,
  },
];

//==================================================================================================================
//    SUPER ADMIN LEAD VOLUME PACING CHART DATA (MONTHLY)
//    12-month telemetry values matching Image 1 and Image 2
//==================================================================================================================
export const ADMIN_LEAD_VOLUME_PACING_MONTHLY = [
  { m: 'Jan', label: 'Jan', value: 30 },
  { m: 'Feb', label: 'Feb', value: 50 },
  { m: 'Mar', label: 'March', value: 10 },
  { m: 'Apr', label: 'April', value: 70 },
  { m: 'May', label: 'May', value: 50 },
  { m: 'Jun', label: 'June', value: 60 },
  { m: 'Jul', label: 'July', value: 45 },
  { m: 'Aug', label: 'Aug', value: 50 },
  { m: 'Sep', label: 'Sep', value: 70 },
  { m: 'Oct', label: 'Oct', value: 30 },
  { m: 'Nov', label: 'Nov', value: 50 },
  { m: 'Dec', label: 'Dec', value: 60 },
];

//==================================================================================================================
//    SUPER ADMIN LEAD VOLUME PACING CHART DATA (YEARLY)
//    Multi-year comparison values for revenue/volume toggle view
//==================================================================================================================
export const ADMIN_LEAD_VOLUME_PACING_YEARLY = [
  { m: '2021', label: '2021', value: 45 },
  { m: '2022', label: '2022', value: 55 },
  { m: '2023', label: '2023', value: 65 },
  { m: '2024', label: '2024', value: 70 },
  { m: '2025', label: '2025', value: 80 },
];

//==================================================================================================================
//    SUPER ADMIN DEALS COUNT BY STAGE DISTRIBUTION
//    Pipeline stage data matching Image 1 & Image 2 specifications
//==================================================================================================================
export const ADMIN_DEAL_DISTRIBUTION_DATA = [
  {
    id: 'stage-1',
    index: 1,
    title: 'Qualification (180 Deals)',
    value: '23.7%',
    percent: 80,
    colorClass: 'bg-primary',
  },
  {
    id: 'stage-2',
    index: 2,
    title: 'Discovery (180 Deals)',
    value: '18.4%',
    percent: 65,
    colorClass: 'bg-primary',
  },
  {
    id: 'stage-3',
    index: 3,
    title: 'Demo (180 Deals)',
    value: '13.6%',
    percent: 50,
    colorClass: 'bg-primary',
  },
  {
    id: 'stage-4',
    index: 4,
    title: 'Proposal (180 Deals)',
    value: '10.3%',
    percent: 40,
    colorClass: 'bg-primary',
  },
  {
    id: 'stage-5',
    index: 5,
    title: 'Negotiation (180 Deals)',
    value: '8.1%',
    percent: 30,
    colorClass: 'bg-secondary',
  },
  {
    id: 'stage-6',
    index: 6,
    title: 'Approval (180 Deals)',
    value: '5.6%',
    percent: 22,
    colorClass: 'bg-secondary',
  },
  {
    id: 'stage-7',
    index: 7,
    title: 'PO/Contract (180 Deals)',
    value: '4.1%',
    percent: 16,
    colorClass: 'bg-secondary',
  },
  {
    id: 'stage-8',
    index: 8,
    title: 'Closed Won (180 Deals)',
    value: '16.3%',
    percent: 55,
    colorClass: 'bg-success',
  },
  {
    id: 'stage-9',
    index: 9,
    title: 'Closed Lost (180 Deals)',
    value: '6.6%',
    percent: 25,
    colorClass: 'bg-alert',
  },
];

//==================================================================================================================
//    SUPER ADMIN LEAD STATUS BREAKDOWN (DONUT CHART)
//    Funnel categorization data matching Image 2 & Image 3 specifications
//==================================================================================================================
export const ADMIN_LEAD_STATUS_BREAKDOWN_DATA = {
  totalCount: '14,820',
  totalLabel: 'Total Leads',
  items: [
    {
      id: 'new',
      label: 'New',
      count: '3,420',
      percentage: '23%',
      value: 23,
      color: 'var(--color-primary)',
      colorClass: 'bg-primary',
    },
    {
      id: 'contacted',
      label: 'Contacted',
      count: '4,150',
      percentage: '28%',
      value: 28,
      color: 'var(--color-secondary)',
      colorClass: 'bg-secondary',
    },
    {
      id: 'converted',
      label: 'Converted',
      count: '4,150',
      percentage: '28%',
      value: 25,
      color: 'var(--color-success)',
      colorClass: 'bg-success',
    },
    {
      id: 'qualified',
      label: 'Qualified',
      count: '4,150',
      percentage: '28%',
      value: 14,
      color: 'var(--color-warning)',
      colorClass: 'bg-warning',
    },
    {
      id: 'lost',
      label: 'Lost',
      count: '4,150',
      percentage: '28%',
      value: 10,
      color: 'var(--color-alert)',
      colorClass: 'bg-alert',
    },
  ],
};

//==================================================================================================================
//    SUPER ADMIN LEAD SOURCE PERFORMANCE & CONVERSION DATA (IMAGE 5)
//    Channel yield and downstream conversion efficiency data matching Image 2 & Image 5
//==================================================================================================================
export const ADMIN_LEAD_SOURCE_PERFORMANCE_DATA = [
  {
    id: 'source-1',
    source: 'Inbound Demo Requests',
    leads: '4,450 leads',
    conversionRate: '28.4% conv',
    percent: 75,
    colorClass: 'bg-primary',
  },
  {
    id: 'source-2',
    source: 'Strategic Partner Referral',
    leads: '2,850 leads',
    conversionRate: '32.4% conv',
    percent: 60,
    colorClass: 'bg-primary',
  },
  {
    id: 'source-3',
    source: 'Website Organic',
    leads: '3,200 leads',
    conversionRate: '14.2% conv',
    percent: 70,
    colorClass: 'bg-primary',
  },
  {
    id: 'source-4',
    source: 'LinkedIn Enterprise',
    leads: '2,120 leads',
    conversionRate: '16.8% conv',
    percent: 40,
    colorClass: 'bg-primary',
  },
  {
    id: 'source-5',
    source: 'Summits & Events',
    leads: '1,250 leads',
    conversionRate: '18.0% conv',
    percent: 65,
    colorClass: 'bg-primary',
  },
  {
    id: 'source-6',
    source: 'Cold Outreach',
    leads: '950 leads',
    conversionRate: '8.2% conv',
    percent: 20,
    colorClass: 'bg-primary',
  },
];

//==================================================================================================================
//    SUPER ADMIN DEALS COUNT BY STAGE DISTRIBUTION (IMAGE 4)
//    Single-line horizontal stage metrics with inline progress tracks matching Image 4
//==================================================================================================================
export const ADMIN_STAGE_DISTRIBUTION_DATA = [
  {
    id: 'stage-1',
    label: '1. Qualification (180 Deals)',
    value: '23.7%',
    percent: 75,
    barColor: 'bg-primary',
    textColor: 'text-black-90',
  },
  {
    id: 'stage-2',
    label: '2. Discovery (180 Deals)',
    value: '18.4%',
    percent: 65,
    barColor: 'bg-primary',
    textColor: 'text-black-90',
  },
  {
    id: 'stage-3',
    label: '3. Demo (180 Deals)',
    value: '13.6%',
    percent: 54,
    barColor: 'bg-primary',
    textColor: 'text-black-90',
  },
  {
    id: 'stage-4',
    label: '4. Proposal (180 Deals)',
    value: '10.3%',
    percent: 42,
    barColor: 'bg-primary',
    textColor: 'text-black-90',
  },
  {
    id: 'stage-5',
    label: '5. Negotiation (180 Deals)',
    value: '8.1%',
    percent: 32,
    barColor: 'bg-secondary',
    textColor: 'text-black-90',
  },
  {
    id: 'stage-6',
    label: '6. Approval (180 Deals)',
    value: '5.6%',
    percent: 22,
    barColor: 'bg-secondary',
    textColor: 'text-black-90',
  },
  {
    id: 'stage-7',
    label: '7. PO/Contract (180 Deals)',
    value: '4.1%',
    percent: 16,
    barColor: 'bg-secondary',
    textColor: 'text-black-90',
  },
  {
    id: 'stage-8',
    label: '8. Closed Won (180 Deals)',
    value: '16.3%',
    percent: 58,
    barColor: 'bg-success',
    textColor: 'text-success font-semibold',
    valueColor: 'text-success font-bold',
  },
  {
    id: 'stage-9',
    label: '9. Closed Lost (180 Deals)',
    value: '6.6%',
    percent: 26,
    barColor: 'bg-alert',
    textColor: 'text-alert font-semibold',
    valueColor: 'text-alert font-bold',
  },
];

//==================================================================================================================
//    SUPER ADMIN SALES EXECUTIVE & BDE ACTIVITY BREAKDOWN (IMAGE 2)
//    Activity cards data with 3 stacked performance meters (Leads, Deals, Won)
//==================================================================================================================
export const ADMIN_EXECUTIVE_ACTIVITY_DATA = [
  {
    id: 'exec-1',
    name: 'Elena Torres',
    region: 'LATAM Growth',
    leads: '1,920',
    deals: '124',
    won: '33',
    leadsPercent: 78,
    dealsPercent: 22,
    wonPercent: 6,
  },
  {
    id: 'exec-2',
    name: 'Omar Khalil',
    region: 'MENA SMB',
    leads: '2,680',
    deals: '149',
    won: '46',
    leadsPercent: 82,
    dealsPercent: 28,
    wonPercent: 9,
  },
  {
    id: 'exec-3',
    name: 'Omar Khalil',
    region: 'MENA SMB',
    leads: '2,680',
    deals: '149',
    won: '46',
    leadsPercent: 82,
    dealsPercent: 28,
    wonPercent: 9,
  },
  {
    id: 'exec-4',
    name: 'Daniel Kim',
    region: 'APAC Enterprise',
    leads: '1,780',
    deals: '114',
    won: '30',
    leadsPercent: 72,
    dealsPercent: 20,
    wonPercent: 5,
  },
  {
    id: 'exec-5',
    name: 'Sofia Rossi',
    region: 'EMEA Retail',
    leads: '2,840',
    deals: '162',
    won: '50',
    leadsPercent: 85,
    dealsPercent: 32,
    wonPercent: 10,
  },
  {
    id: 'exec-6',
    name: 'Sofia Rossi',
    region: 'EMEA Retail',
    leads: '2,840',
    deals: '162',
    won: '50',
    leadsPercent: 85,
    dealsPercent: 32,
    wonPercent: 10,
  },
];

//==================================================================================================================
//    SUPER ADMIN PLATFORM & SYSTEM HEALTH TELEMETRY (IMAGE 3)
//    Health monitoring status cards with multi-tier telemetry metrics
//==================================================================================================================
export const ADMIN_SYSTEM_HEALTH_DATA = [
  {
    id: 'health-1',
    title: 'CRM Application Core',
    status: 'Operational',
    metrics: [
      { label: 'Uptime (30d):', value: '99.98%' },
      { label: 'Latency:', value: '42ms', isSuccess: true },
      { label: 'Core Engine:', value: 'v2.4.2 Enterprise' },
      { label: 'Core Engine:', value: 'v2.4.2 Enterprise', isSuccess: true },
    ],
  },
  {
    id: 'health-2',
    title: 'Database Primary',
    status: 'Healthhy',
    metrics: [
      { label: 'Uptime (30d):', value: '99.98%' },
      { label: 'Latency:', value: '42ms' },
      { label: 'Core Engine:', value: 'v2.4.2 Enterprise' },
      { label: 'Buffer Cache: 98.6%', value: 'WAL Synced' },
    ],
  },
  {
    id: 'health-3',
    title: 'Background Workers',
    status: 'Normal',
    metrics: [
      { label: 'Uptime (30d):', value: '99.98%' },
      { label: 'Latency:', value: '42ms' },
      { label: 'Core Engine:', value: 'v2.4.2 Enterprise' },
      { label: 'Active Concurrency: 12', value: 'Hertbeat OK', isSuccess: true },
    ],
  },
  {
    id: 'health-4',
    title: 'Email Relay Pipeline',
    status: 'Connected',
    metrics: [
      { label: 'Uptime (30d):', value: '99.98%' },
      { label: 'Latency:', value: '42ms' },
      { label: 'Core Engine:', value: 'v2.4.2 Enterprise' },
      { label: 'SPF / DKIM / DMARC', value: '100% PASS', isSuccess: true },
    ],
  },
];


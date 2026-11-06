//==================================================================================================================
//    SIDEBAR NAVIGATION DEFINITIONS
//    Centralized navigation sections and menu links matching G-CRM dashboard specifications
//==================================================================================================================
import {
  LayoutDashboard,
  Sparkles,
  Users,
  Contact,
  BadgePercent,
  FileText,
  Settings,
  BarChart3,
  Building2,
  SlidersHorizontal,
  ArrowLeftRight,
  Bell,
  CircleDollarSign,
} from 'lucide-react';

export const NAV_SECTIONS = [
  {
    title: 'MAIN',
    items: [
      {
        label: 'Dashboard',
        path: '/bde/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'SALES WORKSPACE',
    items: [
      {
        label: 'My Leads',
        path: '/bde/leads',
        icon: Sparkles,
      },
      {
        label: 'My Clients',
        path: '/bde/clients',
        icon: Users,
      },
      {
        label: 'My Contacts',
        path: '/bde/contacts',
        icon: Contact,
      },
      {
        label: 'My Deals',
        path: '/bde/deals',
        icon: BadgePercent,
      },
      {
        label: 'Quotations',
        path: '/bde/quotations',
        icon: FileText,
      },
    ],
  },
  {
    title: 'CUSTOMIZE',
    items: [
      {
        label: 'Settings',
        path: '/bde/settings',
        icon: Settings,
      },
    ],
  },
];

//==================================================================================================================
//    SALES PANEL NAVIGATION SPECIFICATIONS
//==================================================================================================================
export const SALES_NAV_SECTIONS = [
  {
    title: 'MAIN',
    items: [
      {
        label: 'Dashboard',
        path: '/sales/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'SALES WORKSPACE',
    items: [
      {
        label: 'My Team',
        path: '/sales/team',
        icon: Users,
      },
      {
        label: 'Lead Management',
        path: '/sales/leads',
        icon: Sparkles,
      },
      {
        label: 'My Clients',
        path: '/sales/clients',
        icon: Building2,
      },
      {
        label: 'My Contacts',
        path: '/sales/contacts',
        icon: Contact,
      },
      {
        label: 'Deal Management',
        path: '/sales/deals',
        icon: BadgePercent,
      },
      {
        label: 'Quotations',
        path: '/sales/quotations',
        icon: FileText,
      },
    ],
  },
  {
    title: 'ANALYTICS & SYSTEM',
    items: [
      {
        label: 'Report & Analytics',
        path: '/sales/analytics',
        icon: BarChart3,
      },
      {
        label: 'Settings',
        path: '/sales/settings',
        icon: Settings,
      },
    ],
  },
];

export const CLIENT_NAV_SECTIONS = NAV_SECTIONS;
export const BDE_NAV_SECTIONS = NAV_SECTIONS;

//==================================================================================================================
//    SUPER ADMIN NAVIGATION SPECIFICATIONS (Image 2)
//==================================================================================================================
export const ADMIN_NAV_SECTIONS = [
  {
    title: 'MAIN',
    items: [
      {
        label: 'Dashboard',
        path: '/admin/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'CORE OPERATIONS',
    items: [
      {
        label: 'Lead Management',
        path: '/admin/leads',
        icon: Sparkles,
      },
      {
        label: 'Client Management',
        path: '/admin/clients',
        icon: Building2,
      },
      {
        label: 'Contact Management',
        path: '/admin/contacts',
        icon: Contact,
      },
      {
        label: 'Deal Management',
        path: '/admin/deals',
        icon: CircleDollarSign,
      },
      {
        label: 'Quotations',
        path: '/admin/quotations',
        icon: FileText,
      },
    ],
  },
  {
    title: 'GOVERNANCE',
    items: [
      {
        label: 'Staff Management',
        path: '/admin/staff',
        icon: Users,
      },
      {
        label: 'CRM Configuration',
        path: '/admin/config',
        icon: SlidersHorizontal,
      },
    ],
  },
  {
    title: 'ANALYTICS & SYSTEM',
    items: [
      {
        label: 'Integration Management...',
        path: '/admin/integrations',
        icon: ArrowLeftRight,
      },
      {
        label: 'Reports & Analytics',
        path: '/admin/analytics',
        icon: BarChart3,
      },
      {
        label: 'Notification Settings',
        path: '/admin/notifications',
        icon: Bell,
      },
      {
        label: 'Settings',
        path: '/admin/settings',
        icon: Settings,
      },
    ],
  },
];

export const SUPER_ADMIN_NAV_SECTIONS = ADMIN_NAV_SECTIONS;


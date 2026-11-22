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
        path: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'SALES WORKSPACE',
    items: [
      {
        label: 'My Leads',
        path: '/leads',
        icon: Sparkles,
      },
      {
        label: 'My Accounts',
        path: '/clients',
        icon: Users,
      },
      {
        label: 'My Contacts',
        path: '/contacts',
        icon: Contact,
      },
      {
        label: 'My Deals',
        path: '/deals',
        icon: BadgePercent,
      },
      {
        label: 'Quotations',
        path: '/quotations',
        icon: FileText,
      },
    ],
  },
  {
    title: 'CUSTOMIZE',
    items: [
      {
        label: 'Settings',
        path: '/settings',
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
        path: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'SALES WORKSPACE',
    items: [
      {
        label: 'My Team',
        path: '/team',
        icon: Users,
      },
      {
        label: 'Lead Management',
        path: '/leads',
        icon: Sparkles,
      },
      {
        label: 'My Accounts',
        path: '/clients',
        icon: Building2,
      },
      {
        label: 'My Contacts',
        path: '/contacts',
        icon: Contact,
      },
      {
        label: 'Deal Management',
        path: '/deals',
        icon: BadgePercent,
      },
      {
        label: 'Quotations',
        path: '/quotations',
        icon: FileText,
      },
    ],
  },
  {
    title: 'ANALYTICS & SYSTEM',
    items: [
      {
        label: 'Report & Analytics',
        path: '/analytics',
        icon: BarChart3,
      },
      {
        label: 'Settings',
        path: '/settings',
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
        path: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'CORE OPERATIONS',
    items: [
      {
        label: 'Lead Management',
        path: '/leads',
        icon: Sparkles,
      },
      {
        label: 'Account Management',
        path: '/clients',
        icon: Building2,
      },
      {
        label: 'Contact Management',
        path: '/contacts',
        icon: Contact,
      },
      {
        label: 'Deal Management',
        path: '/deals',
        icon: CircleDollarSign,
      },
      {
        label: 'Quotations',
        path: '/quotations',
        icon: FileText,
      },
    ],
  },
  {
    title: 'GOVERNANCE',
    items: [
      {
        label: 'Staff Management',
        path: '/staff',
        icon: Users,
      },
      {
        label: 'CRM Configuration',
        path: '/configuration',
        icon: SlidersHorizontal,
      },
    ],
  },
  {
    title: 'ANALYTICS & SYSTEM',
    items: [
      {
        label: 'Integration Management...',
        path: '/integrations',
        icon: ArrowLeftRight,
      },
      {
        label: 'Reports & Analytics',
        path: '/analytics',
        icon: BarChart3,
      },
      {
        label: 'Notification Settings',
        path: '/notifications',
        icon: Bell,
      },
      {
        label: 'Settings',
        path: '/settings',
        icon: Settings,
      },
    ],
  },
];

export const SUPER_ADMIN_NAV_SECTIONS = ADMIN_NAV_SECTIONS;


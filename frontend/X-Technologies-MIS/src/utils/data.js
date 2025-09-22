import {
  LuLayoutDashboard,
  LuUsers,
  LuClipboardCheck,
  LuSquarePlus,
  LuLogOut,
  LuBadge,
  LuBanknote,
  LuConstruction,
  LuDatabase,
} from "react-icons/lu";
export const SIDE_MENU_DATA = [
  {
    id: "001",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    id: "002",
    label: "Manage Tasks",
    icon: LuClipboardCheck,
    path: "/admin/tasks",
  },
  {
    id: "003",
    label: "Manage Users",
    icon: LuUsers,
    path: "/admin/users",
  },
  {
    id: "004",
    label: "Manage Expenses",
    icon: LuBanknote,
    path: "/admin/expenses",
  },
  {
    id: "005",
    label: "Manage Projects",
    icon: LuDatabase,
    path: "/admin/projects",
  },
  {
    id: "006",
    label: "Logout",
    icon: LuLogOut,
    path: "logout",
  },
];

export const SIDE_MENU_USER_DATA = [
  {
    id: "001",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/user/dashboard",
  },
  {
    id: "002",
    label: "Manage Tasks",
    icon: LuClipboardCheck,
    path: "/user/tasks",
  },
  {
    id: "003",
    label: "My Expenses",
    icon: LuBanknote,
    path: "/user/expenses",
  },
  {
    id: "004",
    label: "My Projects",
    icon: LuBanknote,
    path: "/user/projects",
  },
  {
    id: "005",
    label: "Logout",
    icon: LuLogOut,
    path: "logout",
  },
];

export const PRIORITY_DATA = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];
export const PROJECT_STATUS_DATA = [
  { label: "Not Started", value: "Not Started" },
  { label: "In Progress", value: "In Progress" },
  { label: "On Hold", value: "On Hold" },
  { label: "Completed", value: "Completed" },
];
export const STATUS_DATA = [
  { label: "Pending", value: "Pending" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
];
export const EXPENSE_CATEGORY_DATA = [
  { label: "Office", value: "Office", color: "blue" },
  { label: "Marketing", value: "Marketing", color: "green" },
  { label: "Transportation", value: "Transportation", color: "yellow" },
  { label: "Travel", value: "Travel", color: "purple" },
  {
    label: "Training & Development",
    value: "Training & Development",
    color: "pink",
  },
  { label: "Utilities", value: "Utilities", color: "orange" },
  { label: "Maintenance", value: "Maintenance", color: "teal" },
  { label: "Food", value: "Food", color: "red" },
  { label: "Health", value: "Health", color: "green" },
  { label: "Entertainment", value: "Entertainment", color: "indigo" },
  { label: "Rent", value: "Rent", color: "gray" },
  { label: "Bank Fees", value: "Bank Fees", color: "lime" },
  { label: "Insurance", value: "Insurance", color: "cyan" },
  { label: "Taxes", value: "Taxes", color: "rose" },
  { label: "Loans", value: "Loans", color: "violet" },
  { label: "Hardware", value: "Hardware", color: "brown" },
  { label: "Internet", value: "Internet", color: "sky" },
  { label: "Subscriptions", value: "Subscriptions", color: "amber" },
  { label: "Events", value: "Events", color: "fuchsia" },
  { label: "Other", value: "Other", color: "slate" },
];

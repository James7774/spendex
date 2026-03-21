import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  BarChart3, 
  Target, 
  Settings, 
  StickyNote, 
  LogOut, 
  Pencil, 
  Trash2, 
  Bell, 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Plus,
  Sun,
  Moon,
  AlertCircle,
  Check,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  User
} from 'lucide-react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number | string;
}

// --- Bottom Navigation Icons (Premium Style) ---

export function DashboardIcon({ size = 24, color = "currentColor", className, strokeWidth = 1.5 }: IconProps) {
  return <LayoutDashboard size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

export function TransactionsIcon({ size = 24, color = "currentColor", className, strokeWidth = 1.5 }: IconProps) {
  return <Wallet size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

export function ChartsIcon({ size = 24, color = "currentColor", className, strokeWidth = 1.5 }: IconProps) {
  return <BarChart3 size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

export function GoalsIcon({ size = 24, color = "currentColor", className, strokeWidth = 1.5 }: IconProps) {
  return <Target size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

export function SettingsIcon({ size = 24, color = "currentColor", className, strokeWidth = 1.5 }: IconProps) {
  return <Settings size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

export function NotesIcon({ size = 24, color = "currentColor", className, strokeWidth = 1.5 }: IconProps) {
  return <StickyNote size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

export function UserIcon({ size = 24, color = "currentColor", className, strokeWidth = 1.5 }: IconProps) {
  return <User size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

// --- UI / Action Icons ---

export function LogoutIcon({ size = 20, color = "currentColor", className, strokeWidth = 1.5 }: IconProps) {
  return <LogOut size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

export function EditBoxIcon({ size = 20, color = "currentColor", className, strokeWidth = 1.5 }: IconProps) {
  return <Pencil size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

export function TrashIcon({ size = 20, color = "currentColor", className, strokeWidth = 1.5 }: IconProps) {
  return <Trash2 size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

export function NotificationIcon({ size = 24, color = "currentColor", className, strokeWidth = 1.5 }: IconProps) {
  return <Bell size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

export function SearchIcon({ size = 24, color = "currentColor", className, strokeWidth = 1.5 }: IconProps) {
  return <Search size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

export function MenuIcon({ size = 24, color = "currentColor", className, strokeWidth = 1.5 }: IconProps) {
  return <Menu size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

export function CloseIcon({ size = 24, color = "currentColor", className, strokeWidth = 1.5 }: IconProps) {
  return <X size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

export function ChevronRightIcon({ size = 24, color = "currentColor", className, strokeWidth = 1.5 }: IconProps) {
  return <ChevronRight size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

export function ChevronLeftIcon({ size = 24, color = "currentColor", className, strokeWidth = 1.5 }: IconProps) {
  return <ChevronLeft size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

export function PlusIcon({ size = 24, color = "currentColor", className, strokeWidth = 1.5 }: IconProps) {
    return <Plus size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

export function SunIcon({ size = 24, color = "currentColor", className, strokeWidth = 1.5 }: IconProps) {
    return <Sun size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

export function MoonIcon({ size = 24, color = "currentColor", className, strokeWidth = 1.5 }: IconProps) {
    return <Moon size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

export function AlertIcon({ size = 24, color = "currentColor", className, strokeWidth = 1.5 }: IconProps) {
    return <AlertCircle size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

export function CheckIcon({ size = 24, color = "currentColor", className, strokeWidth = 1.5 }: IconProps) {
    return <Check size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

export function IncomeIcon({ size = 24, color = "currentColor", className, strokeWidth = 1.5 }: IconProps) {
    return <TrendingUp size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

export function ExpenseIcon({ size = 24, color = "currentColor", className, strokeWidth = 1.5 }: IconProps) {
    return <TrendingDown size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

export function ArrowRightIcon({ size = 24, color = "currentColor", className, strokeWidth = 1.5 }: IconProps) {
    return <ArrowRight size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

export function CameraIcon({ size = 24, color = "currentColor", className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
      <circle cx="12" cy="13" r="4"></circle>
    </svg>
  );
}

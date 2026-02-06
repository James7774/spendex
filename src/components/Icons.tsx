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
}

// --- Bottom Navigation Icons (Premium Style) ---

export function DashboardIcon({ size = 24, color = "currentColor", className }: IconProps) {
  return <LayoutDashboard size={size} color={color} className={className} strokeWidth={1.5} />;
}

export function TransactionsIcon({ size = 24, color = "currentColor", className }: IconProps) {
  return <Wallet size={size} color={color} className={className} strokeWidth={1.5} />;
}

export function ChartsIcon({ size = 24, color = "currentColor", className }: IconProps) {
  return <BarChart3 size={size} color={color} className={className} strokeWidth={1.5} />;
}

export function GoalsIcon({ size = 24, color = "currentColor", className }: IconProps) {
  return <Target size={size} color={color} className={className} strokeWidth={1.5} />;
}

export function SettingsIcon({ size = 24, color = "currentColor", className }: IconProps) {
  return <Settings size={size} color={color} className={className} strokeWidth={1.5} />;
}

export function NotesIcon({ size = 24, color = "currentColor", className }: IconProps) {
  return <StickyNote size={size} color={color} className={className} strokeWidth={1.5} />;
}

export function UserIcon({ size = 24, color = "currentColor", className }: IconProps) {
  return <User size={size} color={color} className={className} strokeWidth={1.5} />;
}

// --- UI / Action Icons ---

export function LogoutIcon({ size = 20, color = "currentColor", className }: IconProps) {
  return <LogOut size={size} color={color} className={className} strokeWidth={1.5} />;
}

export function EditBoxIcon({ size = 20, color = "currentColor", className }: IconProps) {
  return <Pencil size={size} color={color} className={className} strokeWidth={1.5} />;
}

export function TrashIcon({ size = 20, color = "currentColor", className }: IconProps) {
  return <Trash2 size={size} color={color} className={className} strokeWidth={1.5} />;
}

export function NotificationIcon({ size = 24, color = "currentColor", className }: IconProps) {
  return <Bell size={size} color={color} className={className} strokeWidth={1.5} />;
}

export function SearchIcon({ size = 24, color = "currentColor", className }: IconProps) {
  return <Search size={size} color={color} className={className} strokeWidth={1.5} />;
}

export function MenuIcon({ size = 24, color = "currentColor", className }: IconProps) {
  return <Menu size={size} color={color} className={className} strokeWidth={1.5} />;
}

export function CloseIcon({ size = 24, color = "currentColor", className }: IconProps) {
  return <X size={size} color={color} className={className} strokeWidth={1.5} />;
}

export function ChevronRightIcon({ size = 24, color = "currentColor", className }: IconProps) {
  return <ChevronRight size={size} color={color} className={className} strokeWidth={1.5} />;
}

export function ChevronLeftIcon({ size = 24, color = "currentColor", className }: IconProps) {
  return <ChevronLeft size={size} color={color} className={className} strokeWidth={1.5} />;
}

export function PlusIcon({ size = 24, color = "currentColor", className }: IconProps) {
    return <Plus size={size} color={color} className={className} strokeWidth={1.5} />;
}

export function SunIcon({ size = 24, color = "currentColor", className }: IconProps) {
    return <Sun size={size} color={color} className={className} strokeWidth={1.5} />;
}

export function MoonIcon({ size = 24, color = "currentColor", className }: IconProps) {
    return <Moon size={size} color={color} className={className} strokeWidth={1.5} />;
}

export function AlertIcon({ size = 24, color = "currentColor", className }: IconProps) {
    return <AlertCircle size={size} color={color} className={className} strokeWidth={1.5} />;
}

export function CheckIcon({ size = 24, color = "currentColor", className }: IconProps) {
    return <Check size={size} color={color} className={className} strokeWidth={1.5} />;
}

export function IncomeIcon({ size = 24, color = "currentColor", className }: IconProps) {
    return <TrendingUp size={size} color={color} className={className} strokeWidth={1.5} />;
}

export function ExpenseIcon({ size = 24, color = "currentColor", className }: IconProps) {
    return <TrendingDown size={size} color={color} className={className} strokeWidth={1.5} />;
}

export function ArrowRightIcon({ size = 24, color = "currentColor", className }: IconProps) {
    return <ArrowRight size={size} color={color} className={className} strokeWidth={1.5} />;
}

export function CameraIcon({ size = 24, color = "currentColor", className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
      <circle cx="12" cy="13" r="4"></circle>
    </svg>
  );
}

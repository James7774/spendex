import React from 'react';

// Kategoriya kalitlari - tildan mustaqil
export const categoryKeys = ['other', 'food', 'transport', 'home', 'entertainment', 'health', 'salary', 'shopping', 'bills', 'education', 'gift'] as const;
export type CategoryKey = typeof categoryKeys[number];

// Kategoriya ranglari va ikonlari - kalit asosida
export const categoryData: Record<CategoryKey, { icon: React.ReactNode; color: string; bgColor: string }> = {
  food: {
    color: '#F97316',
    bgColor: 'rgba(249, 115, 22, 0.15)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="rgba(249, 115, 22, 0.2)"/>
        <path d="M12 3C12 3 8 7 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7 12 3 12 3Z" fill="#F97316"/>
        <path d="M11 14V20" stroke="#F97316" strokeWidth="2" strokeLinecap="round"/>
        <path d="M9 18H13" stroke="#F97316" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="17" cy="7" r="2" fill="#FDBA74"/>
        <circle cx="7" cy="8" r="1.5" fill="#FDBA74"/>
      </svg>
    )
  },
  transport: {
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="10" width="20" height="8" rx="2" fill="rgba(59, 130, 246, 0.3)"/>
        <path d="M5 10L7 5H17L19 10" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
        <rect x="2" y="10" width="20" height="8" rx="2" stroke="#3B82F6" strokeWidth="2"/>
        <circle cx="6" cy="15" r="2" fill="#3B82F6"/>
        <circle cx="18" cy="15" r="2" fill="#3B82F6"/>
        <path d="M10 10V7" stroke="#3B82F6" strokeWidth="1.5"/>
        <path d="M14 10V7" stroke="#3B82F6" strokeWidth="1.5"/>
      </svg>
    )
  },
  home: {
    color: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.15)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 10L12 3L21 10V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V10Z" fill="rgba(139, 92, 246, 0.3)"/>
        <path d="M3 10L12 3L21 10V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V10Z" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="9" y="14" width="6" height="7" fill="#8B5CF6"/>
        <rect x="10" y="8" width="4" height="3" rx="0.5" fill="#C4B5FD"/>
      </svg>
    )
  },
  entertainment: {
    color: '#EC4899',
    bgColor: 'rgba(236, 72, 153, 0.15)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" fill="rgba(236, 72, 153, 0.2)" stroke="#EC4899" strokeWidth="2"/>
        <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="#EC4899" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="9" cy="10" r="1.5" fill="#EC4899"/>
        <circle cx="15" cy="10" r="1.5" fill="#EC4899"/>
        <path d="M12 3V5" stroke="#F9A8D4" strokeWidth="2" strokeLinecap="round"/>
        <path d="M19 5L17.5 6.5" stroke="#F9A8D4" strokeWidth="2" strokeLinecap="round"/>
        <path d="M5 5L6.5 6.5" stroke="#F9A8D4" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  health: {
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" fill="rgba(16, 185, 129, 0.2)" stroke="#10B981" strokeWidth="2"/>
        <path d="M12 8V16" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/>
        <path d="M8 12H16" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    )
  },
  salary: {
    color: '#22C55E',
    bgColor: 'rgba(34, 197, 94, 0.15)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" fill="rgba(34, 197, 94, 0.2)" stroke="#22C55E" strokeWidth="2"/>
        <path d="M12 6V18" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"/>
        <path d="M15 9C15 7.34 13.66 6 12 6C10.34 6 9 7.34 9 9C9 10.66 10.34 12 12 12C13.66 12 15 13.34 15 15C15 16.66 13.66 18 12 18C10.34 18 9 16.66 9 15" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  other: {
    color: '#6B7280',
    bgColor: 'rgba(107, 114, 128, 0.15)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" fill="rgba(107, 114, 128, 0.2)" stroke="#6B7280" strokeWidth="2"/>
        <circle cx="8" cy="12" r="1.5" fill="#6B7280"/>
        <circle cx="12" cy="12" r="1.5" fill="#6B7280"/>
        <circle cx="16" cy="12" r="1.5" fill="#6B7280"/>
      </svg>
    )
  },
  shopping: {
    color: '#F43F5E',
    bgColor: 'rgba(244, 63, 94, 0.15)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    )
  },
  bills: {
    color: '#0EA5E9',
    bgColor: 'rgba(14, 165, 233, 0.15)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
      </svg>
    )
  },
  education: {
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10L12 5L2 10L12 15L22 10Z"/><path d="M6 12.5V16L12 19L18 16V12.5"/>
      </svg>
    )
  },
  gift: {
    color: '#D946EF',
    bgColor: 'rgba(217, 70, 239, 0.15)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D946EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z"/>
      </svg>
    )
  }
};

// Kategoriya ikoni olish funksiyasi
export const getCategoryIcon = (key: CategoryKey, size = 24) => {
  const data = categoryData[key];
  if (data) {
    return (
      <div style={{ 
        width: size, 
        height: size, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        {data.icon}
      </div>
    );
  }
  return null;
};

export default categoryData;

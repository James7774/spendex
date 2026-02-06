import React from 'react';

// Ikonlarning ranglari
const iconColors = {
  target: { primary: '#EF4444', secondary: '#FCA5A5' },   // Qizil
  home: { primary: '#F59E0B', secondary: '#FCD34D' },     // Sariq
  car: { primary: '#3B82F6', secondary: '#93C5FD' },      // Ko'k
  phone: { primary: '#8B5CF6', secondary: '#C4B5FD' },    // Binafsha
  travel: { primary: '#06B6D4', secondary: '#67E8F9' },   // Cyan
  computer: { primary: '#10B981', secondary: '#6EE7B7' }, // Yashil
};

// Target/Nishon ikoni
export const TargetIcon = ({ size = 24, color }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill={color || iconColors.target.secondary} fillOpacity={color ? "0.2" : "0.3"}/>
    <circle cx="12" cy="12" r="7" stroke={color || iconColors.target.primary} strokeWidth="2" fill="none"/>
    <circle cx="12" cy="12" r="3" fill={color || iconColors.target.primary}/>
    <path d="M12 2V6" stroke={color || iconColors.target.primary} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 18V22" stroke={color || iconColors.target.primary} strokeWidth="2" strokeLinecap="round"/>
    <path d="M2 12H6" stroke={color || iconColors.target.primary} strokeWidth="2" strokeLinecap="round"/>
    <path d="M18 12H22" stroke={color || iconColors.target.primary} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Home/Uy ikoni
export const HomeIcon = ({ size = 24, color }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10.5Z" fill={color || iconColors.home.secondary} fillOpacity={color ? "0.3" : "0.4"}/>
    <path d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10.5Z" stroke={color || iconColors.home.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 21V14H15V21" stroke={color || iconColors.home.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="8" r="1.5" fill={color || iconColors.home.primary}/>
  </svg>
);

// Car/Mashina ikoni
export const CarIcon = ({ size = 24, color }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 11L6.5 6.5C6.8 5.6 7.6 5 8.5 5H15.5C16.4 5 17.2 5.6 17.5 6.5L19 11" stroke={color || iconColors.car.primary} strokeWidth="2" strokeLinecap="round"/>
    <rect x="3" y="11" width="18" height="8" rx="2" fill={color || iconColors.car.secondary} fillOpacity={color ? "0.3" : "0.4"} stroke={color || iconColors.car.primary} strokeWidth="2"/>
    <circle cx="7" cy="16" r="1.5" fill={color || iconColors.car.primary}/>
    <circle cx="17" cy="16" r="1.5" fill={color || iconColors.car.primary}/>
    <path d="M9 11V8" stroke={color || iconColors.car.primary} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M15 11V8" stroke={color || iconColors.car.primary} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Phone/Telefon ikoni
export const PhoneIcon = ({ size = 24, color }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="2" width="12" height="20" rx="2" fill={color || iconColors.phone.secondary} fillOpacity={color ? "0.2" : "0.3"} stroke={color || iconColors.phone.primary} strokeWidth="2"/>
    <rect x="8" y="5" width="8" height="10" rx="1" fill={color || iconColors.phone.primary} fillOpacity={color ? "0.1" : "0.2"}/>
    <circle cx="12" cy="18" r="1.5" fill={color || iconColors.phone.primary}/>
    <path d="M10 4H14" stroke={color || iconColors.phone.primary} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Travel/Sayohat ikoni (Samolyot)
export const TravelIcon = ({ size = 24, color }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 16L14 12L14 5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5L10 12L3 16L3 18L10 15.5L10 19L8 20.5V22L12 21L16 22V20.5L14 19L14 15.5L21 18L21 16Z" fill={color || iconColors.travel.secondary} fillOpacity={color ? "0.3" : "0.4"} stroke={color || iconColors.travel.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Computer/Kompyuter ikoni
export const ComputerIcon = ({ size = 24, color }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="20" height="12" rx="2" fill={color || iconColors.computer.secondary} fillOpacity={color ? "0.2" : "0.3"} stroke={color || iconColors.computer.primary} strokeWidth="2"/>
    <path d="M8 20H16" stroke={color || iconColors.computer.primary} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 16V20" stroke={color || iconColors.computer.primary} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="10" r="2" fill={color || iconColors.computer.primary}/>
  </svg>
);

// Icon mapper - emoji dan SVG ga
export const goalIcons: Record<string, React.ReactNode> = {
  '🎯': <TargetIcon size={22} />,
  '🏠': <HomeIcon size={22} />,
  '🚗': <CarIcon size={22} />,
  '📱': <PhoneIcon size={22} />,
  '✈️': <TravelIcon size={22} />,
  '💻': <ComputerIcon size={22} />,
};

// Helper function - emoji yoki fallback
export const getGoalIcon = (icon: string, size = 22, color?: string) => {
  const IconComponent = {
    '🎯': TargetIcon,
    '🏠': HomeIcon,
    '🚗': CarIcon,
    '📱': PhoneIcon,
    '✈️': TravelIcon,
    '💻': ComputerIcon,
  }[icon];
  
  if (IconComponent) {
    return <IconComponent size={size} color={color} />;
  }
  
  // Fallback - emoji qaytarish
  return <span style={{ fontSize: size * 0.8, color }}>{icon}</span>;
};

export default goalIcons;

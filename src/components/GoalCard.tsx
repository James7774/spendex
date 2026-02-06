import React, { useState } from 'react';
import { getGoalIcon } from './icons/GoalIcons';
import { Trash2, ChevronDown, ChevronUp, Plus, Minus, Edit3 } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';

interface GoalCardProps {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  onDelete?: () => void;
  onUpdate?: (id: string, newAmount: number) => void;
}

export default function GoalCard({ id, title, targetAmount, currentAmount, icon, onDelete, onUpdate }: GoalCardProps) {
  const { t } = useFinance();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [amountInput, setAmountInput] = useState('');
  const percentage = Math.min((currentAmount / targetAmount) * 100, 100);

  // Helper to compact huge numbers
  const formatCompactNumber = (num: number) => {
    if (num >= 1_000_000_000_000_000) return (num / 1_000_000_000_000_000).toFixed(1) + 'Q'; 
    if (num >= 1_000_000_000_000) return (num / 1_000_000_000_000).toFixed(1) + 'T';
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  // Helper to get consistent brand color
  const brandColor = '#4F46E5';

  // Format number with thousand separators (20000 -> 20 000)
  const formatInputNumber = (value: string): string => {
    // Remove non-digit characters
    const numericValue = value.replace(/\D/g, '');
    // Add space separators every 3 digits from the right
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Parse formatted input back to number
  const parseFormattedInput = (value: string): number => {
    return parseFloat(value.replace(/\s/g, '')) || 0;
  };

  // State for showing minus sign when hovering subtract
  const [isSubtracting, setIsSubtracting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\s/g, ''); // Remove spaces
    if (/^\d*$/.test(rawValue)) { // Only allow digits
      setAmountInput(rawValue);
    }
  };

  const handleAddMoney = (e: React.MouseEvent) => {
    e.stopPropagation();
    const amount = parseFormattedInput(amountInput);
    if (amount > 0 && onUpdate) {
      onUpdate(id, currentAmount + amount);
      setAmountInput('');
      setIsEditing(false);
    }
  };

  const handleSubtractMoney = (e: React.MouseEvent) => {
    e.stopPropagation();
    const amount = parseFormattedInput(amountInput);
    if (amount > 0 && onUpdate) {
      const newAmount = Math.max(0, currentAmount - amount);
      onUpdate(id, newAmount);
      setAmountInput('');
      setIsEditing(false);
      setIsSubtracting(false);
    }
  };

  return (
    <div 
      onClick={() => !isEditing && setIsExpanded(!isExpanded)}
      style={{
        width: '100%',
        padding: '18px',
        borderRadius: '24px',
        background: 'var(--surface)',
        position: 'relative',
        boxShadow: isExpanded ? '0 12px 30px -5px rgba(0,0,0,0.12)' : '0 4px 12px rgba(0,0,0,0.03)',
        border: `1px solid ${isExpanded ? brandColor : 'var(--border)'}`,
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      {/* HEADER ROW (Always visible) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* Icon Container */}
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '16px',
          background: isExpanded ? brandColor : 'rgba(79, 70, 229, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.3s ease',
          boxShadow: isExpanded ? `0 8px 16px -4px ${brandColor}40` : 'none'
        }}>
          {getGoalIcon(icon, 30, isExpanded ? 'white' : undefined)}
        </div>

        {/* Main Info */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <h4 style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 800, 
                      color: 'var(--text-main)', 
                      letterSpacing: '-0.01em',
                      margin: 0
                    }}>
                      {title}
                    </h4>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 700, 
                      padding: '2px 8px', 
                      borderRadius: '8px',
                      background: percentage >= 100 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(79, 70, 229, 0.1)',
                      color: percentage >= 100 ? '#10B981' : brandColor
                    }}>
                        {Math.round(percentage)}%
                    </span>
                </div>
                
                {!isExpanded && (
                   <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontSize: '1rem', fontWeight: 800, color: brandColor, margin: 0 }}>
                        {formatCompactNumber(currentAmount)}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, margin: 0 }}>
                        / {formatCompactNumber(targetAmount)}
                      </p>
                   </div>
                )}
             </div>
             
             {/* Progress Bar Container */}
             <div style={{
               width: '100%',
               height: '10px',
               backgroundColor: 'var(--bg-secondary)', 
               borderRadius: '10px',
               overflow: 'hidden',
               border: '1px solid var(--border)'
             }}>
               <div style={{
                 width: `${percentage}%`,
                 height: '100%',
                 background: percentage >= 100 
                   ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)' 
                   : `linear-gradient(90deg, ${brandColor} 0%, #6366F1 100%)`,
                 borderRadius: '10px',
                 transition: 'width 0.8s cubic-bezier(0.65, 0, 0.35, 1)'
               }} />
             </div>
        </div>

        {/* Arrow Indicator */}
        <div style={{ 
          color: isExpanded ? brandColor : 'var(--text-secondary)',
          transition: 'color 0.3s ease'
        }}>
           {isExpanded ? <ChevronUp size={22} strokeWidth={2.5} /> : <ChevronDown size={22} strokeWidth={2.5} />}
        </div>
      </div>

      {/* EXPANDED DETAILS */}
      <div style={{
        maxHeight: isExpanded ? '500px' : '0',
        opacity: isExpanded ? 1 : 0,
        overflow: 'hidden', 
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        marginTop: isExpanded ? '24px' : '0'
      }}>
         <div style={{ 
           paddingTop: '20px', 
           borderTop: '1px solid var(--border)', 
           display: 'flex', 
           flexDirection: 'column',
           gap: '16px'
         }}>
             {/* Progress Info */}
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                   <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                     {t.progressLabel} <span style={{ color: percentage >= 100 ? '#10B981' : brandColor }}>({Math.round(percentage)}%)</span>
                   </p>
                   <div style={{ 
                       fontSize: '1.2rem', 
                       fontWeight: 900, 
                       color: 'var(--text-main)', 
                       letterSpacing: '-0.02em',
                       display: 'flex',
                       alignItems: 'baseline',
                       flexWrap: 'wrap'
                   }}>
                      {formatCompactNumber(currentAmount)} 
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginLeft: '4px' }}> 
                       / {formatCompactNumber(targetAmount)}
                      </span>
                   </div>
                </div>
                
                {/* Remaining Amount */}
                <div style={{ textAlign: 'right' }}>
                   {percentage >= 100 ? (
                     <div style={{
                       background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.15) 100%)',
                       padding: '8px 14px',
                       borderRadius: '12px',
                       border: '1px solid rgba(16, 185, 129, 0.2)'
                     }}>
                       <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10B981', margin: 0 }}>
                         ✓ Maqsadga yetdingiz!
                       </p>
                     </div>
                   ) : (
                     <>
                       <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '2px' }}>
                         Yana kerak:
                       </p>
                       <p style={{ 
                         fontSize: '1.1rem', 
                         fontWeight: 900, 
                         color: '#f97316',
                         margin: 0,
                         letterSpacing: '-0.01em'
                       }}>
                         {formatCompactNumber(targetAmount - currentAmount)} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>so'm</span>
                       </p>
                     </>
                   )}
                </div>
             </div>

             {/* Edit Section */}
             {isEditing ? (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} onClick={e => e.stopPropagation()}>
                 <div style={{ position: 'relative' }}>
                   {isSubtracting && amountInput && (
                     <span style={{
                       position: 'absolute',
                       left: '16px',
                       top: '50%',
                       transform: 'translateY(-50%)',
                       color: '#f97316',
                       fontSize: '1.1rem',
                       fontWeight: 800,
                       pointerEvents: 'none'
                     }}>−</span>
                   )}
                   <input
                     type="text"
                     inputMode="numeric"
                     value={isSubtracting && amountInput ? `− ${formatInputNumber(amountInput)}` : formatInputNumber(amountInput)}
                     onChange={handleInputChange}
                     placeholder="Summa kiriting..."
                     style={{
                       width: '100%',
                       padding: '14px 16px',
                       paddingLeft: isSubtracting && amountInput ? '32px' : '16px',
                       borderRadius: '16px',
                       border: `2px solid ${isSubtracting ? '#f97316' : brandColor}`,
                       background: 'var(--bg-secondary)',
                       color: isSubtracting ? '#f97316' : 'var(--text-main)',
                       fontSize: '1.1rem',
                       fontWeight: 700,
                       outline: 'none',
                       transition: 'all 0.2s ease'
                     }}
                     autoFocus
                   />
                 </div>
                 <div style={{ display: 'flex', gap: '10px' }}>
                   <button
                     onClick={handleAddMoney}
                     onMouseEnter={() => setIsSubtracting(false)}
                     style={{
                       flex: 1,
                       background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                       color: '#fff',
                       border: 'none',
                       borderRadius: '14px',
                       padding: '12px',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       gap: '6px',
                       fontWeight: 700,
                       fontSize: '0.85rem',
                       cursor: 'pointer',
                       boxShadow: '0 4px 12px rgba(34, 197, 94, 0.25)'
                     }}
                   >
                     <Plus size={18} strokeWidth={3} /> {t.addMoney}
                   </button>
                   <button
                     onClick={handleSubtractMoney}
                     onMouseEnter={() => setIsSubtracting(true)}
                     onMouseLeave={() => setIsSubtracting(false)}
                     onTouchStart={() => setIsSubtracting(true)}
                     style={{
                       flex: 1,
                       background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                       color: '#fff',
                       border: 'none',
                       borderRadius: '14px',
                       padding: '12px',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       gap: '6px',
                       fontWeight: 700,
                       fontSize: '0.85rem',
                       cursor: 'pointer',
                       boxShadow: '0 4px 12px rgba(249, 115, 22, 0.25)'
                     }}
                   >
                     <Minus size={18} strokeWidth={3} /> {t.subtractMoney}
                   </button>
                 </div>
                 <button
                   onClick={(e) => { e.stopPropagation(); setIsEditing(false); setAmountInput(''); }}
                   style={{
                     background: 'transparent',
                     color: 'var(--text-secondary)',
                     border: '1.5px solid var(--border)',
                     borderRadius: '14px',
                     padding: '10px',
                     fontWeight: 600,
                     fontSize: '0.85rem',
                     cursor: 'pointer'
                   }}
                 >
                   {t.cancel}
                 </button>
               </div>
             ) : (
               /* Action Buttons */
               <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                 {onUpdate && (
                   <button 
                     onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                     style={{
                       flex: 1,
                       background: `linear-gradient(135deg, ${brandColor} 0%, #6366F1 100%)`,
                       color: '#fff',
                       border: 'none',
                       borderRadius: '16px',
                       padding: '12px 16px',
                       display: 'flex', 
                       alignItems: 'center', 
                       justifyContent: 'center',
                       gap: '8px',
                       cursor: 'pointer',
                       fontWeight: 800,
                       fontSize: '0.8rem',
                       boxShadow: `0 4px 12px ${brandColor}40`,
                       whiteSpace: 'nowrap'
                     }}
                   >
                      <Edit3 size={16} strokeWidth={3} /> {t.editBtn}
                   </button>
                 )}
                 {onDelete && (
                   <button 
                     onClick={(e) => { e.stopPropagation(); onDelete(); }}
                     className="delete-button-goal"
                     style={{
                       flex: 1,
                       background: 'rgba(239, 68, 68, 0.05)',
                       color: '#EF4444',
                       border: '1.5px solid rgba(239, 68, 68, 0.1)',
                       borderRadius: '16px',
                       padding: '12px 16px',
                       display: 'flex', 
                       alignItems: 'center', 
                       justifyContent: 'center',
                       gap: '8px',
                       cursor: 'pointer',
                       fontWeight: 800,
                       fontSize: '0.8rem',
                       transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                       boxShadow: '0 4px 12px rgba(239, 68, 68, 0.05)',
                       whiteSpace: 'nowrap'
                     }}
                   >
                      <Trash2 size={16} strokeWidth={3} /> {t.deleteBtn}
                   </button>
                 )}
               </div>
             )}
         </div>
      </div>
    </div>
  );
}

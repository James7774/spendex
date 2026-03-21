"use client";
import React, { useState } from 'react';
import { useFinance, FinanceFilters } from '@/context/FinanceContext';
import { Calendar, Filter as FilterIcon } from 'lucide-react';
import DatePicker from './DatePicker';
import BottomSheet from './BottomSheet';
import { categoryData, categoryKeys } from './icons/CategoryIcons';

export default function TransactionsFilter({ transparentMode = false }: { transparentMode?: boolean }) {
  const { filters, setFilters, t, darkMode } = useFinance();
  const [isOpen, setIsOpen] = useState(false);

  
  // Local state for the filter form
  const [localFilters, setLocalFilters] = useState<FinanceFilters>(filters);

  const handleOpen = () => {
    setLocalFilters(filters);
    setIsOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tAny = t as any;

  const handleApply = () => {
    setFilters(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const resetFilters: FinanceFilters = {
      dateType: '1M',
      dateRange: {
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999)
      },
      categories: [],
      minAmount: undefined,
      maxAmount: undefined
    };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
    setIsOpen(false);
  };

  const toggleCategory = (cat: string) => {
    setLocalFilters(prev => {
      const exists = prev.categories.includes(cat);
      if (exists) {
        return { ...prev, categories: prev.categories.filter(c => c !== cat) };
      } else {
        return { ...prev, categories: [...prev.categories, cat] };
      }
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleDateChange = (type: 'start' | 'end', dateStr: string) => {
    const date = new Date(dateStr);
    if (type === 'start') {
      date.setHours(0,0,0,0);
      setLocalFilters(prev => ({ 
        ...prev, 
        dateType: 'custom', 
        dateRange: { ...prev.dateRange, start: date } 
      }));
    } else {
      date.setHours(23,59,59,999);
      setLocalFilters(prev => ({ 
        ...prev, 
        dateType: 'custom', 
        dateRange: { ...prev.dateRange, end: date } 
      }));
    }
  };

  return (
    <div className="filter-wrapper">
      <button 
        className="main-filter-trigger" 
        onClick={handleOpen}
        style={transparentMode ? { 
          background: 'rgba(255,255,255,0.1)', 
          borderColor: 'rgba(255,255,255,0.15)', 
          color: 'white',
          backdropFilter: 'blur(8px)'
        } : {}}
      >
        <FilterIcon size={18} />
        <span>{tAny.filters || "Filters"}</span>
        {(filters.categories.length > 0 || filters.dateType !== '1M' || filters.minAmount || filters.maxAmount) && (
          <span className="filter-badge" />
        )}
      </button>

      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={tAny.filters || "Filters"}
        showCloseIcon={true}
      >
        <div className="filter-content">
          {/* Date Range Section */}
          <div className="filter-section">
            <h4 className="section-title">{tAny.dateRange || "Date Range"}</h4>
            <div className="date-cards-row">
              <div className="date-card">
                <span className="date-label">{tAny.from || "From"}</span>
                <div className="date-value-wrap">
                  <Calendar size={18} className="date-icon" />
                  <DatePicker 
                    value={localFilters.dateRange.start?.toISOString().split('T')[0] || ''} 
                    onChange={(d) => handleDateChange('start', d)}
                    customTrigger={
                      <span className="date-value">{formatDate(localFilters.dateRange.start)}</span>
                    }
                  />
                </div>
              </div>
              <div className="date-card">
                <span className="date-label">{tAny.to || "To"}</span>
                <div className="date-value-wrap">
                  <Calendar size={18} className="date-icon" />
                  <DatePicker 
                    value={localFilters.dateRange.end?.toISOString().split('T')[0] || ''} 
                    onChange={(d) => handleDateChange('end', d)}
                    customTrigger={
                      <span className="date-value">{formatDate(localFilters.dateRange.end)}</span>
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category Section - Horizontal Scrollable Chips */}
          <div className="filter-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
               <h4 className="section-title" style={{ margin: 0 }}>{tAny.category || "Category"}</h4>
            </div>
            
            <div className="category-scroll-container">
               <button
                  className={`cat-chip-item ${localFilters.categories.length === 0 ? 'active-all' : ''}`}
                  onClick={() => setLocalFilters(prev => ({ ...prev, categories: [] }))}
               >
                 <div className="cat-chip-icon all-icon">
                    <span style={{ fontSize: '1.2rem' }}>✵</span>
                 </div>
                 <span className="cat-chip-name">{tAny.all || "All"}</span>
               </button>

               {categoryKeys.map((key) => {
                 const cat = categoryData[key];
                 const isSelected = localFilters.categories.includes(key);
                 return (
                   <button
                     key={key}
                     className={`cat-chip-item ${isSelected ? 'active' : ''}`}
                     onClick={() => toggleCategory(key)}
                   >
                     <div className="cat-chip-icon">
                       {cat.icon}
                     </div>
                     <span className="cat-chip-name">{tAny.categories[key] || key}</span>
                   </button>
                 );
               })}
            </div>
          </div>

          {/* Amount Range Section */}
          <div className="filter-section">
            <h4 className="section-title">{tAny.amountRange || "Amount Range"}</h4>
            <div className="amount-inputs-row">
              <div className="amount-input-wrap">
                <input 
                  type="number" 
                  placeholder={tAny.min || "Min"} 
                  value={localFilters.minAmount || ''}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, minAmount: e.target.value ? Number(e.target.value) : undefined }))}
                  className="amount-input"
                />
              </div>
              <div className="amount-input-wrap">
                <input 
                  type="number" 
                  placeholder={tAny.max || "Max"} 
                  value={localFilters.maxAmount || ''}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, maxAmount: e.target.value ? Number(e.target.value) : undefined }))}
                  className="amount-input"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="filter-actions">
            <button className="reset-btn" onClick={handleReset}>
              {tAny.reset || "Reset"}
            </button>
            <button className="apply-btn" onClick={handleApply}>
              {tAny.applyFilters || "Apply Filters"}
            </button>
          </div>
        </div>
      </BottomSheet>

      <style jsx>{`
        .filter-wrapper {
          margin-bottom: 0;
        }

        .main-filter-trigger {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 54px;
          height: 54px;
          background: ${darkMode ? 'rgba(255,255,255,0.05)' : '#fff'};
          border: 1.5px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'var(--border)'};
          border-radius: 20px;
          color: ${darkMode ? '#fff' : '#0f172a'};
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }

        .main-filter-trigger span:not(.filter-badge) {
          display: none;
        }

        .filter-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 10px;
          height: 10px;
          background: #3b82f6;
          border: 2px solid ${darkMode ? '#1e293b' : '#fff'};
          border-radius: 50%;
        }

        .filter-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding-top: 10px;
          padding-bottom: 20px;
        }

        .section-title {
          font-size: 0.95rem;
          font-weight: 850;
          color: ${darkMode ? '#fff' : '#0f172a' };
          margin-bottom: 16px;
          letter-spacing: -0.3px;
          padding-left: 4px;
        }

        .date-cards-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        @media (max-width: 380px) {
          .date-cards-row {
            grid-template-columns: 1fr;
          }
        }

        .date-card {
           background: ${darkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc'};
           border: 1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
           padding: 12px;
           border-radius: 16px;
           display: flex;
           flex-direction: column;
           gap: 6px;
           transition: all 0.2s;
        }

        .date-card:active {
          transform: scale(0.98);
          background: ${darkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9'};
        }

        .date-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .date-value-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .date-icon {
          color: #94a3b8;
        }

        .date-value {
          font-size: 0.9rem;
          font-weight: 700;
          color: ${darkMode ? '#fff' : '#0f172a'};
        }

        /* --- HORIZONTAL SCROLL CATEGORIES --- */
        .category-scroll-container {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 4px;
          /* Hide scrollbar */
          -ms-overflow-style: none;
          scrollbar-width: none;
          padding-right: 4px;
        }

        .category-scroll-container::-webkit-scrollbar {
          display: none;
        }

        .cat-chip-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px 8px 8px;
          border-radius: 30px;
          background: ${darkMode ? 'rgba(255,255,255,0.04)' : '#f8fafc'};
          border: 1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
          color: ${darkMode ? '#94a3b8' : '#64748b'};
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
          white-space: nowrap;
        }

        .cat-chip-item:active {
          transform: scale(0.96);
        }

        .cat-chip-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%; /* Circle icon bg */
          background: ${darkMode ? 'rgba(255,255,255,0.05)' : '#fff'};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        .cat-chip-name {
          font-size: 0.85rem;
          font-weight: 700;
        }

        /* Active State (Purple) */
        .cat-chip-item.active {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-color: transparent;
          color: #fff;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
          padding-right: 20px;
        }

        .cat-chip-item.active .cat-chip-icon {
          background: rgba(255,255,255,0.2);
          color: #fff;
          box-shadow: none;
        }

        /* Active All State (Gray/Subtle) */
        .cat-chip-item.active-all {
          background: ${darkMode ? '#334155' : '#e2e8f0'};
          color: ${darkMode ? '#fff' : '#0f172a'};
          border-color: transparent;
          padding-right: 20px;
        }

        .amount-inputs-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        @media (max-width: 380px) {
          .amount-inputs-row {
            grid-template-columns: 1fr;
          }
        }

        .amount-input {
          width: 100%;
          padding: 14px;
          border-radius: 16px;
          border: 1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
          background: ${darkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc'};
          color: ${darkMode ? '#fff' : '#0f172a'};
          font-weight: 800;
          outline: none;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .amount-input:focus {
          border-color: #3b82f6;
          background: ${darkMode ? 'rgba(59, 130, 246, 0.05)' : '#fff'};
        }

        .filter-actions {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 12px;
          margin-top: 20px;
        }

        .reset-btn {
          padding: 16px;
          border-radius: 18px;
          border: none;
          background: ${darkMode ? 'rgba(255,255,255,0.05)' : '#f1f5f9'};
          color: ${darkMode ? '#94a3b8' : '#64748b'};
          font-weight: 800;
          cursor: pointer;
          font-size: 0.95rem;
        }

        .apply-btn {
          padding: 16px;
          border-radius: 18px;
          border: none;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          font-weight: 800;
          cursor: pointer;
          font-size: 0.95rem;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
          transition: all 0.2s;
        }

        .apply-btn:active {
          transform: scale(0.97);
        }
      `}</style>
    </div>
  );
}

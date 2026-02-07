"use client";
import React, { useState } from 'react';
import { useFinance, DateFilterType, DateRange } from '@/context/FinanceContext';
import { Calendar } from 'lucide-react';
import DatePicker from './DatePicker';
import BottomSheet from './BottomSheet';

export default function DateFilter() {
  const { filters, setFilters, t } = useFinance();
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [tempRange, setTempRange] = useState<DateRange>({
    start: filters.dateRange.start || new Date(),
    end: filters.dateRange.end || new Date()
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tAny = t as any;

  const dateFilterOptions: { id: DateFilterType; label: string }[] = [
    { id: '1D', label: tAny.filter1D || '1D' },
    { id: '1W', label: tAny.filter1W || '1W' },
    { id: '1M', label: tAny.filter1M || '1M' },
    { id: 'all', label: tAny.filterAll || 'All' },
  ];

  const handleFilterClick = (type: DateFilterType) => {
    if (type === 'custom') {
      setTempRange({
        start: filters.dateRange.start || new Date(),
        end: filters.dateRange.end || new Date()
      });
      setIsCustomOpen(true);
    } else {
      setFilters({ dateType: type });
    }
  };

  const applyCustomRange = () => {
    setFilters({ dateType: 'custom', dateRange: tempRange });
    setIsCustomOpen(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (type: 'start' | 'end', dateStr: string) => {
    if (!dateStr) return;
    const date = new Date(dateStr);
    if (type === 'start') {
        // Set to start of day
        date.setHours(0,0,0,0);
        setTempRange(prev => ({ ...prev, start: date }));
    } else {
        // Set to end of day
        date.setHours(23,59,59,999);
        setTempRange(prev => ({ ...prev, end: date }));
    }
  };

  return (
    <div className="date-filter-container">
      <div className="filter-scroll">
        {dateFilterOptions.map(option => (
          <button
            key={option.id}
            onClick={() => handleFilterClick(option.id)}
            className={`filter-chip ${filters.dateType === option.id ? 'active' : ''}`}
          >
            {option.label}
          </button>
        ))}
        
        <button
          onClick={() => handleFilterClick('custom')}
          className={`filter-chip ${filters.dateType === 'custom' ? 'active' : ''} custom-btn`}
        >
          <Calendar size={14} />
          <span>{tAny.custom || "Custom"}</span>
        </button>
      </div>

      <BottomSheet
        isOpen={isCustomOpen}
        onClose={() => setIsCustomOpen(false)}
        title={tAny.selectRange || "Select Date Range"}
      >
        <div className="range-picker-content">
            <div className="date-input-group">
                <label>{tAny.startDate || "Start Date"}</label>
                <DatePicker 
                    value={formatDate(tempRange.start)}
                    onChange={(d) => handleDateChange('start', d)}
                />
            </div>
            
            <div className="date-input-group">
                <label>{tAny.endDate || "End Date"}</label>
                <DatePicker 
                    value={formatDate(tempRange.end)}
                    onChange={(d) => handleDateChange('end', d)}
                />
            </div>

            <button className="apply-btn" onClick={applyCustomRange}>
                {tAny.apply || "Apply Range"}
            </button>
        </div>
      </BottomSheet>

      <style jsx>{`
        .date-filter-container {
          margin-bottom: 20px;
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .date-filter-container::-webkit-scrollbar {
          display: none;
        }

        .filter-scroll {
          display: flex;
          gap: 8px;
          padding: 4px 2px;
        }

        .filter-chip {
          padding: 8px 16px;
          border-radius: 100px;
          border: 1px solid rgba(0,0,0,0.05);
          background: rgba(255,255,255,0.5);
          color: #64748b;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
          white-space: nowrap;
          backdrop-filter: blur(10px);
        }

        :global(.dark) .filter-chip {
          background: rgba(30, 41, 59, 0.5);
          border-color: rgba(255,255,255,0.05);
          color: #94a3b8;
        }

        .filter-chip.active {
          background: #7000ff;
          color: white;
          border-color: #7000ff;
          box-shadow: 0 4px 12px rgba(112, 0, 255, 0.25);
        }

        .custom-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding-left: 14px;
          padding-right: 14px;
        }

        .range-picker-content {
          padding: 10px 0 30px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .date-input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .date-input-group label {
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--text-secondary);
            margin-left: 4px;
        }

        .apply-btn {
          background: linear-gradient(135deg, #7000ff 0%, #9033ff 100%);
          color: white;
          padding: 16px;
          border-radius: 16px;
          font-weight: 700;
          margin-top: 10px;
          box-shadow: 0 4px 15px rgba(112, 0, 255, 0.3);
          border: none;
          width: 100%;
        }

        .apply-btn:active {
            transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}

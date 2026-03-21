
"use client";

import React, { useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid
} from 'recharts';
import { useFinance, Transaction } from '@/context/FinanceContext';
import { ChartsIcon } from '@/components/Icons';

const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: { value: number; name: string }[], label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        <div className="tooltip-value-row">
           <div className="dot" />
           <p className="value">
             {payload[0].value.toLocaleString()} <span className="currency">UZS</span>
           </p>
        </div>
        <style jsx>{`
          .custom-tooltip {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(0,0,0,0.05);
            border-radius: 16px;
            padding: 12px 16px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          }
          .tooltip-label {
            margin: 0;
            font-size: 0.7rem;
            color: #64748b;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .tooltip-value-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 6px;
          }
          .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #3b82f6;
          }
          .value {
            margin: 0;
            font-size: 1.1rem;
            font-weight: 900;
            color: #0f172a;
          }
          .currency {
            font-size: 0.7rem;
            color: #94a3b8;
            font-weight: 700;
          }
          :global(.dark) .custom-tooltip {
            background: rgba(30, 41, 59, 0.95);
            border-color: rgba(255,255,255,0.1);
          }
          :global(.dark) .value { color: white; }
          :global(.dark) .tooltip-label { color: #94a3b8; }
        `}</style>
      </div>
    );
  }
  return null;
};

export default function ExpensesChart({ transactions: passedTransactions }: { transactions?: Transaction[] }) {
  const { t, transactions: contextTransactions, darkMode } = useFinance();
  const transactions = passedTransactions || contextTransactions;

  const daysMap = useMemo(() => {
     const w = t.landing?.pricing?.weekDays;
     return w ? [w.mon, w.tue, w.wed, w.thu, w.fri, w.sat, w.sun] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  }, [t]);

  const data = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monDiff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(new Date().setDate(monDiff));
    monday.setHours(0, 0, 0, 0);

    return daysMap.map((name, index) => {
      const targetDate = new Date(new Date(monday).setDate(monday.getDate() + index));
      const targetDayStr = targetDate.toLocaleDateString();
      
      const daySpending = transactions
        .filter(tx => tx.type === 'expense' && new Date(tx.date).toLocaleDateString() === targetDayStr)
        .reduce((sum, tx) => sum + tx.amount, 0);

      const isToday = new Date().toLocaleDateString() === targetDayStr;

      return {
        name,
        spending: daySpending,
        isToday
      };
    });
  }, [transactions, daysMap]);

  const maxValue = Math.max(...data.map(d => d.spending), 10000);

  if (transactions.filter(t => t.type === 'expense').length === 0) {
      return (
        <div className="empty-state">
              <div className="empty-icon-wrap">
                 <ChartsIcon size={40} color="#3b82f6" />
              </div>
              <p className="empty-msg">{t.nothingFound}</p>
              <style jsx>{`
                .empty-state {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  height: 300px;
                  background: ${darkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'};
                  border-radius: 32px;
                  border: 1px dashed ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
                }
                .empty-icon-wrap {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: ${darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(112, 0, 255, 0.05)'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .empty-msg {
                  font-weight: 700;
                  color: #94a3b8;
                  margin-top: 12px;
                }
              `}</style>
        </div>
      );
  }

  return (
    <div className="chart-container">
       <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
              data={data} 
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
               <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
               </linearGradient>
            </defs>
            <CartesianGrid 
              vertical={false} 
              stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} 
              strokeDasharray="6 6"
            />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fontWeight: 700, fill: darkMode ? '#64748b' : '#94a3b8' }}
              dy={15}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 600, fill: darkMode ? '#475569' : '#cbd5e1' }}
              tickFormatter={(val) => val >= 1000000 ? `${(val/1000000).toFixed(1)}M` : val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}
              domain={[0, maxValue * 1.2]}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(59, 130, 246, 0.2)', strokeWidth: 2, strokeDasharray: '4 4' }} 
            />
            <Area 
              type="monotone" 
              dataKey="spending" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSpending)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
       </div>

       <style jsx>{`
         .chart-container {
           width: 100%;
           height: 100%;
           display: flex;
           flex-direction: column;
         }
         .chart-wrapper {
           flex: 1;
           width: 100%;
           min-height: 300px;
         }
       `}</style>
    </div>
  );
}

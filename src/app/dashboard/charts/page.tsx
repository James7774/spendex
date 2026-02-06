"use client";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from 'framer-motion';
import { BarChart3, Activity } from 'lucide-react';
import { useFinance, Transaction } from "@/context/FinanceContext";
import AntigravityGoals from "@/components/AntigravityGoals";
import { SearchIcon, CloseIcon } from "@/components/Icons";
import DateFilter from "@/components/DateFilter";
import styles from "../dashboard.module.css";

const ExpensesChart = dynamic(() => import("@/components/ExpensesChart"), { ssr: false });

export default function ChartsPage() {
  const { t, filteredTransactions: dateFilteredTransactions, darkMode } = useFinance();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tAny = t as any;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return dateFilteredTransactions;

    const query = searchQuery.toLowerCase().trim();
    const tokens = query.split(/\s+/).filter(tok => tok.length > 0);

    return dateFilteredTransactions.filter((tx: Transaction) => {
      const categoryName = ((t.categories as Record<string, string>)[tx.category] || tx.category).toLowerCase();
      const note = (tx.note || "").toLowerCase();
      const amountRaw = tx.amount.toString();
      const amountFormatted = tx.amount.toLocaleString().toLowerCase();
      const date = new Date(tx.date).toLocaleDateString().toLowerCase();
      
      const searchableText = `${categoryName} ${note} ${amountRaw} ${amountFormatted} ${date}`.toLowerCase();

      return tokens.every(token => searchableText.includes(token));
    });
  }, [searchQuery, dateFilteredTransactions, t]);

  return (
    <motion.div 
      className="charts-page-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="page-header">
        <div className="header-left">
          <div className="icon-badge">
            <BarChart3 size={22} />
          </div>
          <h1 className={styles.pageTitle}>{t.charts}</h1>
        </div>
        
        <div className="intel-status">
          <Activity size={14} className="pulse-icon" />
          <span className="status-text">{t.intelActive}</span>
        </div>
      </div>

      <DateFilter />

      <div className={styles.searchWrapper}>
        <div className={styles.searchContainer}>
          <input 
            type="text" 
            className={styles.searchInput}
            placeholder={tAny.searchPlaceholder || "Filter charts..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className={styles.innerSearchIcon}>
             <SearchIcon size={20} />
          </div>
          {searchQuery && (
            <button 
              className={styles.searchClearBtn}
              onClick={() => setSearchQuery("")}
            >
              <CloseIcon size={14} />
            </button>
          )}
        </div>
      </div>
      
      <div className="main-chart-section">
        <div className="card-glass">
            <div className="card-top">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 className="card-heading">{t.expenseTrend}</h3>
                    {searchQuery && (
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#7000ff', fontWeight: 700 }}>
                        {tAny.resultsFound || "Results"}: {filteredTransactions.filter(tx => tx.type === 'expense').length}
                      </p>
                    )}
                </div>
                <div className="time-filter-pill">
                    <span className="active">{t.sevenDays}</span>
                </div>
            </div>
            
            <div className="chart-area">
                <ExpensesChart transactions={filteredTransactions} />
            </div>

            <div className="card-footer">
                <p className="note-text">
                   {t.chartNote}
                </p>
            </div>
        </div>
      </div>

      <AntigravityGoals />

      <style jsx>{`
        .charts-page-wrapper {
          padding: 8px 16px 100px;
          min-height: 100vh;
          position: relative;
          background: ${darkMode ? 'radial-gradient(circle at 0% 0%, rgba(112, 0, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)' : '#f8fafc'};
        }

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2.5rem;
          padding-top: 10px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .icon-badge {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #7000ff 0%, #9033ff 100%);
          color: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px rgba(112, 0, 255, 0.2);
        }

        .main-title {
          font-size: 1.5rem;
          font-weight: 850;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .intel-status {
          display: flex;
          align-items: center;
          gap: 6px;
          background: ${darkMode ? 'rgba(112, 0, 255, 0.1)' : 'rgba(112, 0, 255, 0.05)'};
          padding: 6px 12px;
          border-radius: 100px;
          border: 1px solid rgba(112, 0, 255, 0.08);
          backdrop-filter: blur(10px);
        }

        .status-text {
          font-size: 0.6rem;
          font-weight: 900;
          color: #7000ff;
          letter-spacing: 0.05em;
        }

        .pulse-icon {
          color: #7000ff;
          animation: pulse-ring 2s infinite;
        }

        .main-chart-section {
          width: 100%;
          margin-bottom: 2.5rem;
        }

        .card-glass {
          background: ${darkMode ? 'rgba(30, 41, 59, 0.5)' : 'white'};
          backdrop-filter: blur(20px);
          border-radius: 36px;
          padding: 32px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.04);
          border: 1px solid ${darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .card-heading {
          font-size: 1.4rem;
          font-weight: 900;
          color: ${darkMode ? '#f8fafc' : '#1e293b'};
          margin: 0;
          letter-spacing: -0.5px;
        }

        .time-filter-pill {
          background: ${darkMode ? 'rgba(255,255,255,0.05)' : '#f1f5f9'};
          padding: 5px;
          border-radius: 100px;
          display: flex;
          gap: 4px;
        }

        .time-filter-pill span {
          padding: 6px 14px;
          font-size: 0.7rem;
          font-weight: 900;
          border-radius: 100px;
          color: #64748b;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .time-filter-pill span.active {
          background: #7000ff;
          color: white;
          box-shadow: 0 4px 12px rgba(112, 0, 255, 0.25);
        }

        .chart-area {
          height: 450px;
          width: 100%;
        }

        .card-footer {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(0,0,0,0.03);
          text-align: center;
        }

        .note-text {
          color: #94a3b8;
          font-size: 0.8rem;
          font-weight: 600;
          margin: 0;
        }

        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }

        :global(.dark) .main-title { color: #f8fafc; }
        :global(.dark) .card-glass {
          background: #1e293b;
          border-color: rgba(255, 255, 255, 0.05);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
        }
        :global(.dark) .card-heading { color: white; }
        :global(.dark) .intel-status {
          background: rgba(112, 0, 255, 0.15);
        }
        :global(.dark) .time-filter-pill { background: #334155; }
        :global(.dark) .time-filter-pill span.active { background: #1e293b; }
        :global(.dark) .card-footer { border-color: rgba(255,255,255,0.05); }
      `}</style>
    </motion.div>
  );
}

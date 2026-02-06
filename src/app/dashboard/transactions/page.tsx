"use client";
import { useState, useMemo } from "react";
import { useFinance } from "@/context/FinanceContext";
import styles from "../dashboard.module.css";
import DateFilter from "@/components/DateFilter";
import { IncomeIcon, ExpenseIcon, TrashIcon, SearchIcon, CloseIcon } from "@/components/Icons";

export default function TransactionsPage() {
  const { t, filteredTransactions: dateFilteredTransactions, deleteTransaction } = useFinance();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tAny = t as any;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return dateFilteredTransactions;

    const query = searchQuery.toLowerCase().trim();
    const tokens = query.split(/\s+/).filter(t => t.length > 0);

    return dateFilteredTransactions.filter(tx => {
      const categoryName = ((t.categories as Record<string, string>)[tx.category] || tx.category).toLowerCase();
      const note = (tx.note || "").toLowerCase();
      const amountRaw = tx.amount.toString();
      const amountFormatted = tx.amount.toLocaleString().toLowerCase();
      const date = new Date(tx.date).toLocaleDateString().toLowerCase();
      
      const searchableText = `${categoryName} ${note} ${amountRaw} ${amountFormatted} ${date}`.toLowerCase();

      // AND logic: all tokens must be present
      return tokens.every(token => searchableText.includes(token));
    }).sort((a, b) => {
      // Ranking Logic
      const aCategory = ((t.categories as Record<string, string>)[a.category] || a.category).toLowerCase();
      const bCategory = ((t.categories as Record<string, string>)[b.category] || b.category).toLowerCase();
      
      // 1. Exact category match
      if (aCategory === query && bCategory !== query) return -1;
      if (bCategory === query && aCategory !== query) return 1;

      // 2. Prefix match in category
      const aStarts = aCategory.startsWith(query);
      const bStarts = bCategory.startsWith(query);
      if (aStarts && !bStarts) return -1;
      if (bStarts && !aStarts) return 1;

      // 3. Amount equality
      if (a.amount.toString() === query && b.amount.toString() !== query) return -1;
      if (b.amount.toString() === query && a.amount.toString() !== query) return 1;

      // Default: date descending
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [searchQuery, dateFilteredTransactions, t]);

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const tokens = query.split(/\s+/).filter(t => t.length > 0);
    // Escape special characters in tokens for Regex
    const escapedTokens = tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escapedTokens.join('|')})`, 'gi');
    
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? (
        <span key={i} className={styles.highlight}>{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div className={styles.dashboardContent}>
      <h1 className={styles.pageTitle}>{t.transactions}</h1>
      
      <DateFilter />

      <div className={styles.searchWrapper}>
        <div className={styles.searchContainer}>
          <input 
            type="text" 
            className={styles.searchInput}
            placeholder={tAny.searchPlaceholder || "Search transactions..."}
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

      {searchQuery && (
        <div className={styles.searchMeta}>
          <div className={styles.resultCount}>
             <span>{tAny.resultsFound || "Results found"}:</span>
             <span className={styles.countBadge}>{filteredTransactions.length}</span>
          </div>
        </div>
      )}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }} className={styles.transactionsContainer}>

        {filteredTransactions.map((tx) => (
          <div key={tx.id} className={styles.transactionItem}>
            <div className={styles.tIcon} style={{ 
              background: tx.type === 'income' ? 'var(--bg-success-soft)' : 'var(--bg-danger-soft)',
              color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)'
            }}>
              {tx.type === 'income' ? <IncomeIcon size={20} /> : <ExpenseIcon size={20} />}
            </div>
            
            <div className={styles.tInfo}>
              <p className={styles.tName}>
                {highlightText(((t.categories as Record<string, string>)[tx.category] || tx.category), searchQuery)}
              </p>
              <p className={styles.tDate}>
                {new Date(tx.date).toLocaleDateString()}
                {tx.note && <> • {highlightText(tx.note, searchQuery)}</>}
              </p>
            </div>

            <div className={styles.txActions}>
              <div className={styles.tAmount} style={{ color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                {tx.type === 'income' ? '+' : '-'}{highlightText(tx.amount.toLocaleString(), searchQuery)}
              </div>
              <button 
                  onClick={() => deleteTransaction(tx.id)}
                  className={styles.deleteButton}
              >
                  <TrashIcon size={18} />
              </button>
            </div>
          </div>
        ))}
        
        {filteredTransactions.length === 0 && (
          <div className={styles.emptyState}>
              {searchQuery ? tAny.nothingFound : tAny.noDataYet || "No transactions yet"}
          </div>
        )}
      </div>
    </div>
  );
}

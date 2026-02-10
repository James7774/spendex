"use client";
import { useState, useMemo } from "react";
import { useFinance } from "@/context/FinanceContext";
import styles from "../dashboard.module.css";
import TransactionsFilter from "@/components/TransactionsFilter";
import { IncomeIcon, ExpenseIcon, TrashIcon, SearchIcon, CloseIcon } from "@/components/Icons";
import { ChevronDown } from "lucide-react";

// ... (other imports)

export default function TransactionsPage() {
  const { t, filteredTransactions: dateFilteredTransactions, deleteTransaction } = useFinance();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tAny = t as any;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = useMemo(() => {
    // ... (memo logic remains same)
    if (!searchQuery.trim()) return dateFilteredTransactions;
    const query = searchQuery.toLowerCase().trim();
    const tokens = query.split(/\s+/).filter(t => t.length > 0);

    return dateFilteredTransactions.filter(tx => {
      const categoryName = ((t.categories as Record<string, string>)[tx.category] || tx.category).toLowerCase();
      const note = (tx.note || "").toLowerCase();
      const amountRaw = tx.amount.toString();
      const formatted = tx.amount.toLocaleString().toLowerCase();
      const date = new Date(tx.date).toLocaleDateString().toLowerCase();
      const searchableText = `${categoryName} ${note} ${amountRaw} ${formatted} ${date}`.toLowerCase();
      return tokens.every(token => searchableText.includes(token));
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchQuery, dateFilteredTransactions, t]);

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const tokens = query.split(/\s+/).filter(t => t.length > 0);
    const escapedTokens = tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escapedTokens.join('|')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => regex.test(part) ? <span key={i} className={styles.highlight}>{part}</span> : part);
  };

  // Refactored Transaction Item Component with Smooth Animations
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const TransactionItem = ({ tx }: { tx: any }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const formattedAmount = tx.amount.toLocaleString();
    const shouldTruncate = formattedAmount.length > 14 && !searchQuery;

    // Display value in collapsed state
    const collapsedValue = shouldTruncate 
      ? formattedAmount.slice(0, 11) + "..." 
      : formattedAmount;

    return (
      <div 
        className={styles.transactionItem} 
        style={{ 
          flexDirection: 'column', // Always column, aligning internal items
          alignItems: 'stretch',
          gap: '0', // Gap handled by internal padding/transitions
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Top Row: Icon, Info, Actions */}
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '12px' }}>
          
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

          <div className={styles.txActions} style={{ marginLeft: 'auto', gap: '8px' }}>
            
            {/* Amount Section with Chevron Trigger */}
            <div 
               onClick={(e) => {
                 e.stopPropagation();
                 if (shouldTruncate) setIsExpanded(!isExpanded);
               }}
               style={{ 
                 display: 'flex', 
                 alignItems: 'center', 
                 gap: '4px',
                 cursor: shouldTruncate ? 'pointer' : 'default',
                 padding: '4px',
                 borderRadius: '6px',
                 backgroundColor: isExpanded ? 'rgba(0,0,0,0.03)' : 'transparent',
                 transition: 'background-color 0.2s'
               }}
            >
               {/* Only show collapsed amount here if NOT expanded */}
               {!isExpanded && (
                  <div 
                    className={styles.tAmount} 
                    style={{ 
                      color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)',
                    }}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {highlightText(collapsedValue, searchQuery)}
                  </div>
               )}

               {/* Chevron Icon - Only if Truncated */}
               {shouldTruncate && (
                 <ChevronDown 
                   size={16} 
                   color="var(--text-secondary)"
                   style={{
                     transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                     transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                   }}
                 />
               )}
            </div>

            <button 
                onClick={() => deleteTransaction(tx.id)}
                className={styles.deleteButton}
            >
                <TrashIcon size={18} />
            </button>
          </div>
        </div>

        {/* Bottom Row: Full Amount (Smooth Reveal) */}
        <div style={{ 
            marginTop: isExpanded ? '8px' : '0',
            maxHeight: isExpanded ? '50px' : '0',
            opacity: isExpanded ? 1 : 0,
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transformOrigin: 'top',
            transform: isExpanded ? 'translateY(0)' : 'translateY(-5px)',
            display: 'flex',
            justifyContent: 'flex-end',
            paddingRight: '42px' // Align with Delete button visually
          }}
        >
          <span 
             onClick={() => setIsExpanded(false)}
             style={{ 
               fontSize: '1.4rem', 
               fontWeight: 800, 
               color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)',
               wordBreak: 'break-all',
               cursor: 'pointer',
               lineHeight: 1.2
            }}
          >
             {tx.type === 'income' ? '+' : '-'}{formattedAmount}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.dashboardContent}>
      <div className={styles.searchWrapper}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className={styles.searchContainer} style={{ flex: 1 }}>
            <input 
              type="text" 
              className={styles.searchInput}
              placeholder={tAny.searchPlaceholder || "Search transactions..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '3rem' }}
            />
            <div className={styles.innerSearchIcon}>
               <SearchIcon size={20} />
            </div>
            {searchQuery && (
              <button 
                className={styles.searchClearBtn}
                onClick={() => setSearchQuery("")}
                style={{ right: '12px' }}
              >
                <CloseIcon size={14} />
              </button>
            )}
          </div>
          <TransactionsFilter />
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
           <TransactionItem key={tx.id} tx={tx} />
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

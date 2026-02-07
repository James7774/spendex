
import { Transaction } from '@/context/FinanceContext';

export interface TrendInsight {
  category: string;
  changePercent: number;
  isImprovement: boolean; // For expenses, down is good. For income, up is good.
  message: string;
  amount: number;
}



export const analyzeWeeklyTrends = (
  transactions: Transaction[], 
  language: string = 'uz',
  categoryTranslations: Record<string, string> = {}
): TrendInsight[] => {
  const now = new Date();
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  
  const currentWeekStart = new Date(now.getTime() - ONE_WEEK_MS);
  const prevWeekStart = new Date(now.getTime() - 2 * ONE_WEEK_MS);

  const getWeekSum = (txs: Transaction[], start: Date, end: Date, cat: string) => {
    return txs
      .filter(t => t.category === cat && new Date(t.date) >= start && new Date(t.date) < end)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const categories = Array.from(new Set(transactions.map(t => t.category)));
  
  const insights = categories.map(cat => {
    const currentSum = getWeekSum(transactions, currentWeekStart, now, cat);
    const prevSum = getWeekSum(transactions, prevWeekStart, currentWeekStart, cat);
    
    if (prevSum === 0 && currentSum === 0) return null;

    const diff = currentSum - prevSum;
    const percent = prevSum === 0 ? 100 : Math.round((diff / prevSum) * 100);
    
    // Check if it's an expense or income (assuming logic based on category name or type if available)
    // For this simple logic, we treat everything as expense for the 'improvement' calculation
    const isImprovement = diff < 0; 

    const translatedCat = categoryTranslations[cat] || cat;
    let message = "";
    if (language === 'uz') {
      const action = isImprovement ? "kamaydi" : "oshdi";
      const emoji = isImprovement ? "Ajoyib! ✨" : "Ehtiyot bo'ling! ⚠️";
      message = `${translatedCat} xarajatlari ${Math.abs(percent)}% ga ${action}. ${emoji}`;
    } else if (language === 'ru') {
      const action = isImprovement ? "снизились" : "выросли";
      const emoji = isImprovement ? "Отлично! ✨" : "Внимание! ⚠️";
      message = `Расходы на ${translatedCat} ${action} на ${Math.abs(percent)}%. ${emoji}`;
    } else {
      const action = isImprovement ? "decreased" : "surged";
      const emoji = isImprovement ? "Excellent! ✨" : "Stay cautious! ⚠️";
      message = `${translatedCat} spending ${action} by ${Math.abs(percent)}%. ${emoji}`;
    }

    return {
      category: translatedCat,
      changePercent: percent,
      isImprovement,
      message,
      amount: currentSum
    };
  }).filter(Boolean) as TrendInsight[];

  return insights.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
};

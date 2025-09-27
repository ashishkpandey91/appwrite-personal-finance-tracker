import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/types/finance';
import { TrendingUp } from 'lucide-react';

interface SpendingChartProps {
  transactions: Transaction[];
}

export const SpendingChart = ({ transactions = [] }: SpendingChartProps) => {
  // Ensure transactions is an array
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  // Group transactions by date
  const chartData = safeTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    
    const existing = acc.find(item => item.date === date);
    if (existing) {
      if (transaction.type === 'income') {
        existing.income += Number(transaction.amount);
      } else {
        existing.expense += Number(transaction.amount);
      }
    } else {
      acc.push({
        date,
        income: transaction.type === 'income' ? Number(transaction.amount) : 0,
        expense: transaction.type === 'expense' ? Number(transaction.amount) : 0
      });
    }
    
    return acc;
  }, [] as Array<{ date: string; income: number; expense: number }>);

  // Sort by date
  chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <div>
            <CardTitle className="text-lg font-bold text-gray-800">Spending Overview</CardTitle>
            <CardDescription>Income vs Expenses over time</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#666"
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [`$${Number(value).toFixed(2)}`, name === 'income' ? 'Income' : 'Expense']}
                labelStyle={{ color: '#333' }}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="income" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
                name="income"
              />
              <Bar 
                dataKey="expense" 
                fill="#ef4444" 
                radius={[4, 4, 0, 0]}
                name="expense"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

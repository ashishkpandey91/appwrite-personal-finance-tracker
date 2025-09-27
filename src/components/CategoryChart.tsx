import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction } from '@/types/finance';
import { PieChart as PieChartIcon } from 'lucide-react';
import { useAppSelector } from '@/store/hook';

interface CategoryChartProps {
  transactions: Transaction[];
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];

export const CategoryChart = ({ transactions = [] }: CategoryChartProps) => {
  // Ensure transactions is an array
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const categoryState = useAppSelector((state) => state.category);

  // Helper function to get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categoryState.entities.find(
      cat => cat && String(cat.id) === String(categoryId)
    );
    return category?.name || categoryId;
  };

  // Group expenses by category
  const categoryData = safeTransactions
    .filter(t => t && t.type === 'expense')
    .reduce((acc, transaction) => {
      const categoryName = getCategoryName(transaction.category);
      const existing = acc.find(item => item.name === categoryName);
      if (existing) {
        existing.value += Number(transaction.amount);
      } else {
        acc.push({
          name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
          value: Number(transaction.amount)
        });
      }
      return acc;
    }, [] as Array<{ name: string; value: number }>);

  const totalExpenses = categoryData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 text-purple-600" />
          <div>
            <CardTitle className="text-lg font-bold text-gray-800">Expense Categories</CardTitle>
            <CardDescription>Breakdown by category</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {categoryData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>No expense data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Amount']}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

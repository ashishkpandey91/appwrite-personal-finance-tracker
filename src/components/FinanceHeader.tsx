
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface FinanceHeaderProps {
  onAddTransaction: () => void;
}

export const FinanceHeader = ({ onAddTransaction }: FinanceHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Personal Finance Tracker
        </h1>
        <p className="text-gray-600 mt-1">Take control of your financial future</p>
      </div>
      <Button 
        onClick={onAddTransaction}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Transaction
      </Button>
    </div>
  );
};

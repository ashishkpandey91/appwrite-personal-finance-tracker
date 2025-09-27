import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/store/hook";
import { calculateFinanceSummary } from "@/utils/finance";
import { TrendingUp, TrendingDown, IndianRupee } from "lucide-react";
import { OverviewCardSkeleton } from "@/components/skeletons/CardSkeleton";

export const OverviewCards = ({ isLoading = false }: { isLoading?: boolean }) => {
  const transactions = useAppSelector((state) => state.transaction);
  const { totalIncome, totalExpenses, balance } = calculateFinanceSummary(
    transactions?.entities || []
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <OverviewCardSkeleton />
        <OverviewCardSkeleton />
        <OverviewCardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      <Card className="mobile-card bg-white/95 backdrop-blur-sm border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Balance
          </CardTitle>
          <div className="p-2 rounded-full bg-blue-50">
            <IndianRupee className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl md:text-2xl font-bold ${
              balance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            &#8377;{balance.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {balance >= 0 ? "Positive balance" : "Negative balance"}
          </p>
        </CardContent>
      </Card>

      <Card className="mobile-card bg-white/95 backdrop-blur-sm border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Income
          </CardTitle>
          <div className="p-2 rounded-full bg-green-50">
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl md:text-2xl font-bold text-green-600">
            &#8377;{totalIncome.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-gray-500 mt-1">This period</p>
        </CardContent>
      </Card>

      <Card className="mobile-card bg-white/95 backdrop-blur-sm border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Expenses
          </CardTitle>
          <div className="p-2 rounded-full bg-red-50">
            <TrendingDown className="h-4 w-4 text-red-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl md:text-2xl font-bold text-red-600">
            &#8377;{totalExpenses.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-gray-500 mt-1">This period</p>
        </CardContent>
      </Card>
    </div>
  );
};

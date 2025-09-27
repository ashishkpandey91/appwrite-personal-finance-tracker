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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Balance
          </CardTitle>
          <IndianRupee className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              balance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            &#8377;{balance}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {balance >= 0 ? "Positive balance" : "Negative balance"}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Income
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            &#8377;{totalIncome}
          </div>
          <p className="text-xs text-gray-500 mt-1">This period</p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Expenses
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            &#8377;{totalExpenses}
          </div>
          <p className="text-xs text-gray-500 mt-1">This period</p>
        </CardContent>
      </Card>
    </div>
  );
};

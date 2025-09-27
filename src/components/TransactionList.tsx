import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Calendar,
} from "lucide-react";
import { Transaction } from "@/types/finance";
import { useAppSelector } from "@/store/hook";
import { TransactionListSkeleton } from "@/components/skeletons/TransactionSkeleton";

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export const TransactionList = ({ transactions = [], isLoading = false }: TransactionListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set());

  const categoryState = useAppSelector((state) => state.category);

  // Helper function to get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categoryState.entities.find(
      cat => cat && String(cat.id) === String(categoryId)
    );
    return category?.name || categoryId;
  };

  // Toggle description expansion
  const toggleDescription = (transactionId: number) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(transactionId)) {
      newExpanded.delete(transactionId);
    } else {
      newExpanded.add(transactionId);
    }
    setExpandedDescriptions(newExpanded);
  };

  // Check if description needs truncation
  const isLongDescription = (description: string) => {
    return description && description.length > 50;
  };

  // Ensure transactions is an array
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const filteredTransactions = safeTransactions
    .filter((transaction) => {
      const categoryName = getCategoryName(transaction.category);
      const description = transaction.description || "";
      const matchesSearch =
        description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        categoryName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterType === "all" || transaction.type === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Sort by date in descending order (most recent first)
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      // Compare dates - newer dates come first
      const timeDiff = dateB.getTime() - dateA.getTime();

      if (timeDiff !== 0) {
        return timeDiff;
      }

      // If same date, sort by timestamp if available
      if (a.timestamp && b.timestamp) {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }

      // Otherwise sort by ID (assuming higher ID = newer)
      return String(b.id).localeCompare(String(a.id));
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-0 md:shadow-lg rounded-2xl md:rounded-lg">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-gray-800">
              Recent Transactions
            </CardTitle>
            <CardDescription>
              Track all your financial activities
            </CardDescription>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 min-w-[200px]"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
              >
                All
              </Button>
              <Button
                variant={filterType === "income" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("income")}
                className={
                  filterType === "income"
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
                }
              >
                Income
              </Button>
              <Button
                variant={filterType === "expense" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("expense")}
                className={
                  filterType === "expense" ? "bg-red-600 hover:bg-red-700" : ""
                }
              >
                Expenses
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <TransactionListSkeleton />
        ) : (
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No transactions found</p>
            </div>
          ) : (
            filteredTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="mobile-card flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 animate-fade-in gap-3 mb-3"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div
                    className={`p-2.5 rounded-full flex-shrink-0 ${
                      transaction.type === "income"
                        ? "bg-gradient-to-br from-green-50 to-green-100 text-green-600"
                        : "bg-gradient-to-br from-red-50 to-red-100 text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm text-gray-800 capitalize ${
                          !expandedDescriptions.has(transaction.id) && isLongDescription(transaction.description)
                            ? "line-clamp-1"
                            : ""
                        }`}>
                          {transaction.description || "No description"}
                        </p>
                        {isLongDescription(transaction.description) && (
                          <button
                            onClick={() => toggleDescription(transaction.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 mt-1 font-medium"
                          >
                            {expandedDescriptions.has(transaction.id) ? "Show less" : "Show more"}
                          </button>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs capitalize flex-shrink-0 bg-blue-50 border-blue-200 text-blue-700">
                        {getCategoryName(transaction.category)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      {formatDate(transaction.date)}
                    </div>
                  </div>
                </div>

                <div
                  className={`text-lg font-bold flex-shrink-0 self-end sm:self-center ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}₹
                  {Number(transaction.amount).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
        )}
      </CardContent>
    </Card>
  );
};

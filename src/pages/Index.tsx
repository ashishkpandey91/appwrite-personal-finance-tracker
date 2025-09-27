import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionForm } from "@/components/TransactionForm";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { FinanceHeader } from "@/components/FinanceHeader";
import { OverviewCards } from "@/components/OverviewCards";
import { FinanceTabsContent } from "@/components/FinanceTabsContent";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchTransactions } from "@/features/transactionSlice";
import Header from "@/components/Header";
import { getUserCategories } from "@/features/categorySlice";
import { getBudgets } from "@/features/budgetSlice";

const Index = () => {
  const transactions = useAppSelector((state) => state.transaction);
  const categoryState = useAppSelector((state) => state.category);
  const budgetState = useAppSelector((state) => state.budget);
  const dispatch = useAppDispatch();

  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsInitialLoading(true);
      try {
        await dispatch(getUserCategories());
        await dispatch(fetchTransactions());
        await dispatch(getBudgets());
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadData();
  }, [dispatch]);

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20 md:pb-8 w-full mobile-scroll">
        <div className="container mx-auto px-4 md:px-4 py-6 pt-0 md:pt-8 max-w-7xl">
          {/* this section show in only desktop */}
          <div className="hidden md:block">
            <FinanceHeader
              onAddTransaction={() => setShowTransactionForm(true)}
            />
            <OverviewCards isLoading={isInitialLoading} />
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="hidden md:grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="overview">Home</TabsTrigger>
              <TabsTrigger value="transactions">History</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <FinanceTabsContent
              onAddTransaction={() => setShowTransactionForm(true)}
              transactions={transactions.entities}
              isLoading={isInitialLoading}
            />
          </Tabs>

          <MobileBottomNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAddTransaction={() => setShowTransactionForm(true)}
          />
          <Sheet
            open={showTransactionForm}
            onOpenChange={setShowTransactionForm}
          >
            <SheetContent className="w-[98vw] sm:w-[540px] max-w-full overflow-y-scroll custom-scrollbar">
              <SheetHeader>
                <SheetTitle>Add Transaction</SheetTitle>
                <SheetDescription>
                  Record your income or expense
                </SheetDescription>
              </SheetHeader>
              <TransactionForm onClose={() => setShowTransactionForm(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

export default Index;

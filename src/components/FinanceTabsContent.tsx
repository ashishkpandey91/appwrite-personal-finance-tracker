import { TabsContent } from "@/components/ui/tabs";
import { SpendingChart } from "./SpendingChart";
import { CategoryChart } from "./CategoryChart";
import { TransactionList } from "./TransactionList";
import { BudgetCard } from "./BudgetCard";
import { Transaction } from "@/types/finance";
import { FinanceHeader } from "./FinanceHeader";
import { OverviewCards } from "./OverviewCards";
import { Button } from "./ui/button";
import { BudgetListSkeleton } from "@/components/skeletons/BudgetSkeleton";
import { Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  CustomSelect,
  CustomSelectItem,
} from "./ui/custom-select";
import { Label } from "@/components/ui/label";
import { IndianRupee, Tag } from "lucide-react";
import { Input } from "./ui/input";
import { createBudget } from "@/features/budgetSlice";
import CurrencyConverter from "./CurrencyConverter";

interface FinanceTabsContentProps {
  transactions: Transaction[];
  onAddTransaction: () => void;
  isLoading?: boolean;
}

export const FinanceTabsContent = ({
  onAddTransaction,
  transactions,
  isLoading = false,
}: FinanceTabsContentProps) => {
  const budgets = useAppSelector((state) => state.budget?.entities || []);
  const [showSetBudgetForm, setShowSetBudgetForm] = useState(false);
  const [showSetBudgetEditForm, setShowSetBudgetEditForm] = useState(false);
  const [isCreatingBudget, setIsCreatingBudget] = useState(false);
  const [isUpdatingBudget, setIsUpdatingBudget] = useState(false);
  const dispatch = useAppDispatch();
  const monthAbbrs = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  const [budgetForm, setBudgetForm] = useState({
    category: "",
    budget: "",
    month: monthAbbrs[new Date().getMonth()], // default: current month
    year: String(new Date().getFullYear()), // default: current year
  });
  const categoryState = useAppSelector((state) => state.category);
  const sortedCategories = [...(categoryState?.entities || [])]
    .filter(Boolean)
    .filter(category => category && category.name) // Ensure category has a name
    .sort((a, b) => {
      const aName = a.name?.toLowerCase() || '';
      const bName = b.name?.toLowerCase() || '';
      if (aName === "others") return 1;
      if (bName === "others") return -1;
      return 0;
    });
  const handleAddNewBudget = async () => {
    if (!budgetForm.category || !budgetForm.budget) {
      alert("Please fill in all fields");
      return;
    }

    setIsCreatingBudget(true);
    try {
      await dispatch(createBudget({
        category: budgetForm.category,
        budget: Number(budgetForm.budget),
        month: budgetForm.month,
        year: budgetForm.year
      }));

      // Reset form
      setBudgetForm({
        category: "",
        budget: "",
        month: monthAbbrs[new Date().getMonth()],
        year: String(new Date().getFullYear())
      });

      setShowSetBudgetForm(false);
    } catch (error) {
      alert("Failed to create budget. Please try again.");
    } finally {
      setIsCreatingBudget(false);
    }
  };

  const handleUpdateBudget = async () => {
    if (!budgetForm.category || !budgetForm.budget) {
      alert("Please fill in all fields");
      return;
    }

    setIsUpdatingBudget(true);
    try {
      // For now, create a new budget since we're in the edit form
      // This should be replaced with updateBudget when we have the budget ID
      await dispatch(createBudget({
        category: budgetForm.category,
        budget: Number(budgetForm.budget),
        month: budgetForm.month,
        year: budgetForm.year
      }));

      // Reset form
      setBudgetForm({
        category: "",
        budget: "",
        month: monthAbbrs[new Date().getMonth()],
        year: String(new Date().getFullYear())
      });

      setShowSetBudgetForm(false);
    } finally {
      setIsUpdatingBudget(false);
    }
  };

  return (
    <>
      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="block md:hidden">
            <FinanceHeader onAddTransaction={onAddTransaction} />

            <OverviewCards isLoading={isLoading} />
          </div>
        </div>

        <div className="flex justify-end items-center">
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-40"
            onClick={() => setShowSetBudgetForm(true)}
          >
            Set Budget
          </Button>

          <Sheet open={showSetBudgetForm} onOpenChange={setShowSetBudgetForm}>
            <SheetContent
              className="w-full sm:w-[540px] p-0 overflow-y-auto mobile-sheet"
              side="bottom"
            >
              {/* Mobile Header with Back Arrow */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
                <div className="flex items-center h-14 px-4">
                  <button
                    onClick={() => setShowSetBudgetForm(false)}
                    className="mr-3 p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Go back"
                  >
                    <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Set Budget</h2>
                    <p className="text-xs text-gray-500">Select category and set monthly limit</p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="px-4 pb-24 pt-6">
                <div className="flex flex-col gap-4">
                {/* Category Select (NO add new option) */}
                <div>
                  <Label htmlFor="category">Category</Label>
                  <CustomSelect
                    value={budgetForm.category}
                    onValueChange={(value) =>
                      setBudgetForm((prev) => ({ ...prev, category: value }))
                    }
                    placeholder="Select a category"
                    className="mt-1"
                  >
                    {sortedCategories.map((category) => (
                      <CustomSelectItem
                        key={category.id}
                        value={String(category.id)}
                      >
                        {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                      </CustomSelectItem>
                    ))}
                  </CustomSelect>
                </div>

                {/* budget Input */}
                <div>
                  <Label htmlFor="budget">Budget</Label>
                  <div className="relative mt-1">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="budget"
                      type="number"
                      placeholder="Enter budget amount"
                      className="pl-10"
                      value={budgetForm.budget}
                      onChange={(e) =>
                        setBudgetForm((prev) => ({
                          ...prev,
                          budget: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Month Dropdown */}
                  <div>
                    <Label htmlFor="month">Month</Label>
                    <CustomSelect
                      value={budgetForm.month}
                      onValueChange={(value) =>
                        setBudgetForm((prev) => ({ ...prev, month: value }))
                      }
                      placeholder="Select month"
                      className="mt-1"
                    >
                      {monthAbbrs.map((num, idx) => (
                        <CustomSelectItem key={num} value={num}>
                          {new Date(0, idx).toLocaleString("default", {
                            month: "long",
                          })}
                        </CustomSelectItem>
                      ))}
                    </CustomSelect>
                  </div>

                  {/* Year Dropdown */}
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <CustomSelect
                      value={budgetForm.year}
                      onValueChange={(value) =>
                        setBudgetForm((prev) => ({ ...prev, year: value }))
                      }
                      placeholder="Select year"
                      className="mt-1"
                    >
                      {Array.from({ length: 5 }, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return (
                          <CustomSelectItem key={year} value={String(year)}>
                            {year}
                          </CustomSelectItem>
                        );
                      })}
                    </CustomSelect>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 w-full">
                  <Button
                    variant="outline"
                    onClick={() => setShowSetBudgetForm(false)}
                    className="flex-1 h-11"
                    disabled={isCreatingBudget}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 h-11"
                    onClick={handleAddNewBudget}
                    disabled={isCreatingBudget}
                  >
                    {isCreatingBudget ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </div>
              </div>
            </SheetContent>
          </Sheet>
          <Sheet open={showSetBudgetEditForm} onOpenChange={setShowSetBudgetEditForm}>
            <SheetContent
              className="w-full sm:w-[540px] p-0 overflow-y-auto mobile-sheet"
              side="bottom"
            >
              {/* Mobile Header with Back Arrow */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
                <div className="flex items-center h-14 px-4">
                  <button
                    onClick={() => setShowSetBudgetEditForm(false)}
                    className="mr-3 p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Go back"
                  >
                    <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Edit Budget</h2>
                    <p className="text-xs text-gray-500">Select category and set monthly limit</p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="px-4 pb-24 pt-6">
                <div className="flex flex-col gap-4">
                {/* Category Select (NO add new option) */}
                <div>
                  <Label htmlFor="category">Category</Label>
                  <CustomSelect
                    value={budgetForm.category}
                    onValueChange={(value) =>
                      setBudgetForm((prev) => ({ ...prev, category: value }))
                    }
                    placeholder="Select a category"
                    className="mt-1"
                  >
                    {sortedCategories.map((category) => (
                      <CustomSelectItem
                        key={category.id}
                        value={String(category.id)}
                      >
                        {category.name}
                      </CustomSelectItem>
                    ))}
                  </CustomSelect>
                </div>

                {/* budget Input */}
                <div>
                  <Label htmlFor="budget">Budget</Label>
                  <div className="relative mt-1">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="budget"
                      type="number"
                      placeholder="Enter budget amount"
                      className="pl-10"
                      value={budgetForm.budget}
                      onChange={(e) =>
                        setBudgetForm((prev) => ({
                          ...prev,
                          budget: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Month Dropdown */}
                  <div>
                    <Label htmlFor="month">Month</Label>
                    <CustomSelect
                      value={budgetForm.month}
                      onValueChange={(value) =>
                        setBudgetForm((prev) => ({ ...prev, month: value }))
                      }
                      placeholder="Select month"
                      className="mt-1"
                    >
                      {monthAbbrs.map((num, idx) => (
                        <CustomSelectItem key={num} value={num}>
                          {new Date(0, idx).toLocaleString("default", {
                            month: "long",
                          })}
                        </CustomSelectItem>
                      ))}
                    </CustomSelect>
                  </div>

                  {/* Year Dropdown */}
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <CustomSelect
                      value={budgetForm.year}
                      onValueChange={(value) =>
                        setBudgetForm((prev) => ({ ...prev, year: value }))
                      }
                      placeholder="Select year"
                      className="mt-1"
                    >
                      {Array.from({ length: 5 }, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return (
                          <CustomSelectItem key={year} value={String(year)}>
                            {year}
                          </CustomSelectItem>
                        );
                      })}
                    </CustomSelect>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 w-full">
                  <Button
                    variant="outline"
                    onClick={() => setShowSetBudgetEditForm(false)}
                    className="flex-1 h-11"
                    disabled={isUpdatingBudget}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 h-11"
                    onClick={async () => {
                      await handleUpdateBudget();
                    }}
                    disabled={isUpdatingBudget}
                  >
                    {isUpdatingBudget ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update"
                    )}
                  </Button>
                </div>
              </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <BudgetListSkeleton />
          ) : budgets.length === 0 ? (
            <div className="col-span-full flex flex-col gap-8 justify-center items-center">
              <p className="text-gray-500">
                You haven't set any budget yet.
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="647.63626"
                height="632.17383"
                viewBox="0 0 647.63626 632.17383"
                role="img"
                className="h-28 w-28"
              >
                <path
                  d="M687.3279,276.08691H512.81813a15.01828,15.01828,0,0,0-15,15v387.85l-2,.61005-42.81006,13.11a8.00676,8.00676,0,0,1-9.98974-5.31L315.678,271.39691a8.00313,8.00313,0,0,1,5.31006-9.99l65.97022-20.2,191.25-58.54,65.96972-20.2a7.98927,7.98927,0,0,1,9.99024,5.3l32.5498,106.32Z"
                  transform="translate(-276.18187 -133.91309)"
                  fill="#f2f2f2"
                />
                <path
                  d="M725.408,274.08691l-39.23-128.14a16.99368,16.99368,0,0,0-21.23-11.28l-92.75,28.39L380.95827,221.60693l-92.75,28.4a17.0152,17.0152,0,0,0-11.28028,21.23l134.08008,437.93a17.02661,17.02661,0,0,0,16.26026,12.03,16.78926,16.78926,0,0,0,4.96972-.75l63.58008-19.46,2-.62v-2.09l-2,.61-64.16992,19.65a15.01489,15.01489,0,0,1-18.73-9.95l-134.06983-437.94a14.97935,14.97935,0,0,1,9.94971-18.73l92.75-28.4,191.24024-58.54,92.75-28.4a15.15551,15.15551,0,0,1,4.40966-.66,15.01461,15.01461,0,0,1,14.32032,10.61l39.0498,127.56.62012,2h2.08008Z"
                  transform="translate(-276.18187 -133.91309)"
                  fill="#3f3d56"
                />
                <path
                  d="M398.86279,261.73389a9.0157,9.0157,0,0,1-8.61133-6.3667l-12.88037-42.07178a8.99884,8.99884,0,0,1,5.9712-11.24023l175.939-53.86377a9.00867,9.00867,0,0,1,11.24072,5.9707l12.88037,42.07227a9.01029,9.01029,0,0,1-5.9707,11.24072L401.49219,261.33887A8.976,8.976,0,0,1,398.86279,261.73389Z"
                  transform="translate(-276.18187 -133.91309)"
                  fill="#345FEB"
                />
                <circle cx="190.15351" cy="24.95465" r="20" fill="#345FEB" />
                <circle cx="190.15351" cy="24.95465" r="12.66462" fill="#fff" />
                <path
                  d="M878.81836,716.08691h-338a8.50981,8.50981,0,0,1-8.5-8.5v-405a8.50951,8.50951,0,0,1,8.5-8.5h338a8.50982,8.50982,0,0,1,8.5,8.5v405A8.51013,8.51013,0,0,1,878.81836,716.08691Z"
                  transform="translate(-276.18187 -133.91309)"
                  fill="#e6e6e6"
                />
                <path
                  d="M723.31813,274.08691h-210.5a17.02411,17.02411,0,0,0-17,17v407.8l2-.61v-407.19a15.01828,15.01828,0,0,1,15-15H723.93825Zm183.5,0h-394a17.02411,17.02411,0,0,0-17,17v458a17.0241,17.0241,0,0,0,17,17h394a17.0241,17.0241,0,0,0,17-17v-458A17.02411,17.02411,0,0,0,906.81813,274.08691Zm15,475a15.01828,15.01828,0,0,1-15,15h-394a15.01828,15.01828,0,0,1-15-15v-458a15.01828,15.01828,0,0,1,15-15h394a15.01828,15.01828,0,0,1,15,15Z"
                  transform="translate(-276.18187 -133.91309)"
                  fill="#3f3d56"
                />
                <path
                  d="M801.81836,318.08691h-184a9.01015,9.01015,0,0,1-9-9v-44a9.01016,9.01016,0,0,1,9-9h184a9.01016,9.01016,0,0,1,9,9v44A9.01015,9.01015,0,0,1,801.81836,318.08691Z"
                  transform="translate(-276.18187 -133.91309)"
                  fill="#345FEB"
                />
                <circle cx="433.63626" cy="105.17383" r="20" fill="#345FEB" />
                <circle
                  cx="433.63626"
                  cy="105.17383"
                  r="12.18187"
                  fill="#fff"
                />
              </svg>
            </div>
          ) : Array.isArray(budgets) && budgets.length > 0 ? (
            budgets.map((budget) => (
              <BudgetCard
                key={budget.category}
                budget={budget}
                // onUpdateBudget={onUpdateBudget}
                detailed={true}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">No budgets set yet. Click "Set Budget" to add your first budget.</p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="transactions">
        <TransactionList transactions={transactions} isLoading={isLoading} />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpendingChart transactions={transactions} isLoading={isLoading} />
          <CategoryChart transactions={transactions} isLoading={isLoading} />
        </div>
      </TabsContent>
    </>
  );
};

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Target, MoreVertical, AlertTriangle, Loader2 } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { IndianRupee } from "lucide-react";
import { Budget } from "@/types/finance";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { deleteBudget, updateBudget } from "@/features/budgetSlice";

interface BudgetCardProps {
  budget: Budget;
  onDeleteBudget: (id: string) => void;
  detailed?: boolean;
}

export const BudgetCard = ({
  budget,
  onDeleteBudget,
  detailed = false,
}: BudgetCardProps) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [budgetForm, setBudgetForm] = useState({
    id: budget.id,
    category: String(budget.category),
    budget: String(budget.budget),
    month:
      budget.month ||
      new Date().toLocaleString("default", { month: "short" }).toLowerCase(),
    year: budget.year || String(new Date().getFullYear()),
  });

  const expenseAmount = typeof budget.expense === 'string' ? Number(budget.expense) : budget.expense;
  const budgetAmount = typeof budget.budget === 'string' ? Number(budget.budget) : budget.budget;
  const percentage = budgetAmount > 0 ? Math.min((expenseAmount / budgetAmount) * 100, 100) : 0;
  const isOverBudget = expenseAmount > budgetAmount;
  const isNearLimit = percentage > 80 && !isOverBudget;

  const categoryState = useAppSelector((state) => state.category);
  const sortedCategories = [...categoryState.entities]
    .filter(Boolean)
    .sort((a, b) => {
      if (a.name.toLowerCase() === "others") return 1;
      if (b.name.toLowerCase() === "others") return -1;
      return 0;
    });

  // Find the category name from the category ID
  const categoryName = categoryState.entities.find(
    cat => cat && String(cat.id) === String(budget.category)
  )?.name || budget.category;

  const handleEditClick = () => {
    setIsDropdownOpen(false);
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    setIsDropdownOpen(false);
    setIsAlertDialogOpen(true); // Open the dialog
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteBudget(budgetForm.id));
      setIsAlertDialogOpen(false);
      onDeleteBudget(budgetForm.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsAlertDialogOpen(false);
  };

  const handleUpdateBudget = async () => {
    setIsUpdating(true);
    try {
      await dispatch(
        updateBudget({
          id: budgetForm.id,
          category: budgetForm.category,
          budget: parseFloat(budgetForm.budget),
          month: budgetForm.month,
          year: budgetForm.year,
          expense: String(expenseAmount)
        })
      );
      setIsEditing(false);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="mobile-card bg-white/95 backdrop-blur-sm border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-lg font-bold text-gray-800 capitalize">
              {categoryName}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {isOverBudget && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Over Budget
              </Badge>
            )}
            {isNearLimit && (
              <Badge
                variant="outline"
                className="text-xs text-orange-600 border-orange-200"
              >
                Near Limit
              </Badge>
            )}

            <DropdownMenu.Root open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenu.Trigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-90"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  side="bottom"
                  align="end"
                  className="bg-white border shadow-md rounded-md py-1 w-28 z-[9999]"
                  sideOffset={5}
                >
                  <DropdownMenu.Item
                    className="text-sm px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleEditClick}
                  >
                    Update
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="text-sm px-3 py-2 text-red-600 hover:bg-red-100 cursor-pointer"
                    onClick={handleDeleteClick}
                  >
                    Delete
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Spent</span>
            <span
              className={`font-bold ${
                isOverBudget ? "text-red-600" : "text-gray-800"
              }`}
            >
              ₹{expenseAmount.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-sm items-center">
            <span className="text-gray-600">Budget</span>
            <span className="font-bold text-gray-800">
              ₹{budgetAmount.toFixed(2)}
            </span>
          </div>

          <div className="space-y-2">
            <Progress
              value={percentage}
              className="h-2 bg-gray-100"
              style={{
                background: isOverBudget
                  ? "#fecaca"
                  : isNearLimit
                  ? "#fed7aa"
                  : "#e5e7eb",
              }}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{percentage.toFixed(0)}% used</span>
              <span>
                ₹{(budgetAmount - expenseAmount).toFixed(2)} Remaining
              </span>
            </div>
          </div>

          {detailed && (
            <div className="pt-2 border-t border-gray-100 text-xs text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Daily average:</span>
                <span>₹{(expenseAmount / 30).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Projected month:</span>
                <span
                  className={
                    expenseAmount * 30 > budgetAmount
                      ? "text-red-600"
                      : "text-green-600"
                  }
                >
                  ₹{(expenseAmount * 30).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Update Budget Sheet */}
      <Sheet open={isEditing} onOpenChange={setIsEditing}>
        <SheetContent
          className="w-full sm:w-[540px] p-0 overflow-y-auto mobile-sheet"
          side="bottom"
        >
          {/* Mobile Header with Back Arrow */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
            <div className="flex items-center h-14 px-4">
              <button
                onClick={() => setIsEditing(false)}
                className="mr-3 p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Go back"
              >
                <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Update Budget</h2>
                <p className="text-xs text-gray-500">Update the budget for {categoryName}</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-4 pb-24 pt-6">
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="budget">Budget</Label>
                <div className="relative mt-1">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="budget"
                    type="number"
                    placeholder="Enter budget amount"
                    className="pl-10 h-11"
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

              <div className="flex gap-3 pt-4 w-full">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 h-11"
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 h-11"
                  onClick={async () => {
                    await handleUpdateBudget();
                  }}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the budget
              for {categoryName} and remove its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete} disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Continue"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
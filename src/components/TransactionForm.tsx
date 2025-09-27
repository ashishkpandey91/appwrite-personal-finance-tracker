import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { transactionSchema } from "@/schema/schemas";
import {
  CustomSelect,
  CustomSelectItem,
} from "@/components/ui/custom-select";
import { Calendar, Tag, FileText, IndianRupee } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { addNewCategory} from "@/features/categorySlice";
import { addNewTransaction } from "@/features/transactionSlice";
import { getBudgets } from "@/features/budgetSlice";


interface TransactionFormProps {
  onClose: () => void;
}

export const TransactionForm = ({ onClose }: TransactionFormProps) => {
  const categoryState = useAppSelector((state) => state.category);
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    amount: "",
    description: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [showAddNew, setShowAddNew] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleAddNewCategory = async () => {
    if (!newCategory.trim()) return;

    await dispatch(addNewCategory({
      name: newCategory,
      type: formData.type
    }));
    setShowAddNew(false);
    setNewCategory("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = transactionSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof typeof formData, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof typeof formData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    const transitions = {
      ...result.data,
      amount: parseFloat(result.data.amount),
    };

    dispatch(addNewTransaction(transitions));
    dispatch(getBudgets());

    onClose();
  };

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

  return (
    <div>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col gap-4 mt-4">
          {/* Type */}
          <div>
            <Label htmlFor="type">Type</Label>
            <CustomSelect
              value={formData.type}
              onValueChange={(value: "income" | "expense") =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
              className="mt-1"
            >
              <CustomSelectItem value="income">Income</CustomSelectItem>
              <CustomSelectItem value="expense">Expense</CustomSelectItem>
            </CustomSelect>
          </div>

          {/* Amount */}
          <div>
            <Label htmlFor="amount">Amount</Label>
            <div className="relative mt-1">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
                className="pl-10"
              />
            </div>
            {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">
              Description <span className="text-gray-500 text-xs">(Optional)</span>
            </Label>
            <div className="relative mt-1">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="description"
                placeholder="What was this for? (Optional)"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                className="pl-10"
              />
            </div>
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Category</Label>
            <CustomSelect
              value={formData.category}
              onValueChange={(value) => {
                if (value === "add_new") {
                  setShowAddNew(true);
                  setFormData((prev) => ({ ...prev, category: "" }));
                } else {
                  setShowAddNew(false);
                  setFormData((prev) => ({ ...prev, category: value }));
                }
              }}
              placeholder="Select a category"
              className="mt-1"
            >
              {sortedCategories.map((category) => (
                <CustomSelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </CustomSelectItem>
              ))}
              <CustomSelectItem value="add_new">
                Add new category
              </CustomSelectItem>
            </CustomSelect>
            {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
          </div>

          {/* New Category Input */}
          {showAddNew && (
            <div className="flex gap-2 items-end">
              <Input
                placeholder="New category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button type="button" onClick={handleAddNewCategory}>
                Add
              </Button>
            </div>
          )}

          {/* Date */}
          <div>
            <Label htmlFor="date">Date</Label>
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                className="pl-10"
              />
            </div>
            {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`flex-1 ${
                formData.type === "income"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              } text-white`}
            >
              Add {formData.type === "income" ? "Income" : "Expense"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

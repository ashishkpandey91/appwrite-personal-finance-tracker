export type Transaction = {
  type: "income" | "expense";
  amount: number | string;
};

export const calculateFinanceSummary = (transactions: Transaction[] = []) => {
  // Ensure transactions is an array
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const totalIncome = safeTransactions
    .filter((t) => t && t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpenses = safeTransactions
    .filter((t) => t && t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const balance = totalIncome - totalExpenses;

  return { totalIncome, totalExpenses, balance };
};

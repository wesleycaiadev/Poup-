import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Expense, CategoryId } from '@/types/expense';

export interface ExpenseState {
  expenses: Expense[];
  userName: string;
  userAvatar: string;
  budget: number;
  addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  removeExpense: (id: string) => void;
  setBudget: (amount: number) => void;
  setProfile: (name: string, avatar: string) => void;
  getTotalExpenses: () => number;
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      expenses: [],
      userName: '',
      userAvatar: '',
      budget: 5000,
      addExpense: (expense) => {
        const newExpense: Expense = {
          ...expense,
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
        };
        set((state) => ({
          expenses: [newExpense, ...state.expenses],
        }));
      },
      removeExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        }));
      },
      setBudget: (amount) => set({ budget: amount }),
      setProfile: (name, avatar) => set({ userName: name, userAvatar: avatar }),
      getTotalExpenses: () => {
        return get().expenses.reduce((total, expense) => total + expense.amount, 0);
      },
    }),
    {
      name: 'expense-storage', // Nome da chave no localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export type CategoryId = 'food' | 'transport' | 'leisure' | 'health' | 'bills' | 'others';

export interface Category {
  id: CategoryId;
  label: string;
  icon: string; // Nome do ícone do Lucide
  color: string; // Classe do Tailwind (ex: 'bg-emerald-500')
  textColor: string; // Classe para texto
}

export interface Expense {
  id: string;
  amount: number;
  category: CategoryId;
  description: string;
  date: string; // ISO string
}

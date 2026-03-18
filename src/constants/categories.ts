import { Category } from '@/types/expense';

export const CATEGORIES: Record<string, Category> = {
  food: {
    id: 'food',
    label: 'Alimentação',
    icon: 'Utensils',
    color: 'bg-emerald-500',
    textColor: 'text-emerald-500',
  },
  transport: {
    id: 'transport',
    label: 'Transporte',
    icon: 'Car',
    color: 'bg-blue-500',
    textColor: 'text-blue-500',
  },
  leisure: {
    id: 'leisure',
    label: 'Lazer',
    icon: 'Gamepad2',
    color: 'bg-purple-500',
    textColor: 'text-purple-500',
  },
  health: {
    id: 'health',
    label: 'Saúde',
    icon: 'HeartPulse',
    color: 'bg-rose-500',
    textColor: 'text-rose-500',
  },
  bills: {
    id: 'bills',
    label: 'Contas',
    icon: 'ReceiptText',
    color: 'bg-amber-500',
    textColor: 'text-amber-500',
  },
  others: {
    id: 'others',
    label: 'Outros',
    icon: 'HelpCircle',
    color: 'bg-slate-500',
    textColor: 'text-slate-500',
  },
};

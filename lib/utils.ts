import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ClassValue } from '@/types';
import { FORMAT_CONFIG } from '@/types/constants';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat(FORMAT_CONFIG.CURRENCY.LOCALE, {
    style: 'currency',
    currency: FORMAT_CONFIG.CURRENCY.CURRENCY,
  }).format(amount);

export const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString(
    FORMAT_CONFIG.DATE.LOCALE,
    FORMAT_CONFIG.DATE.OPTIONS
  );

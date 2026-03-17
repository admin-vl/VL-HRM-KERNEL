import { TFunction } from "i18next";

export const getSalaryComponentType = (t: TFunction<'translation'>) => [
  { value: 'earning', label: t('Earning') },
  { value: 'deduction', label: t('Deduction') },
  { value: 'reimbursement', label: t('Reimbursement') },
];

export const getRecurringType = (t: TFunction<'translation'>) => [
  { value: 'recurring', label: t('Recurring') },
  { value: 'non-recurring', label: t('Non Recurring') }
];
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Slideover from '@/components/ui/slide-over';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/utils';
import { DatePicker } from '@/components/datepicker';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Expense, ExpenseType } from '@/api/types/accounting';
import { createExpense, updateExpense } from '@/api/accounting';
import ResourceInput from '../farm_activities/resource-input';
import { ResourceType } from '@/api/types/user';
import { getResources } from '@/api/members';
import { useQuery } from 'react-query';
import { Dropdown } from '@/components/dropdown';

interface Props {
  onClose: (arg?: boolean) => void;
  expense: Expense | null;
}

export const schema = z.object({
  date: z.coerce.date(),
  type: z.string(),
  supplier: z.object({ id: z.string(), name: z.string() }).nullish(),
  product: z.string().min(1),
  quantity: z.coerce.number().min(1, 'Quantity cannot be 0'),
  price: z.coerce.number().min(1, 'Price cannot be 0'),
  notes: z.string().nullish(),
});

const getSuppliers = async () => getResources(ResourceType.SUPPLIER);

function ExpenseForm({ expense, onClose }: Props) {
  const suppliers = useQuery('suppliers', getSuppliers);

  const initialValues = expense || {};

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const { t } = useTranslation();

  async function handleSubmit(values: z.infer<typeof schema>) {
    if (!expense) {
      await createExpense(values as Expense);
    } else {
      await updateExpense(expense.id, values as Expense);
    }

    onClose(true);
  }

  return (
    <FormProvider {...form}>
      <Slideover
        onClose={() => onClose()}
        onSave={form.handleSubmit(handleSubmit)}
        title={t('New Expense')}
      >
        <Form className="space-y-8">
          <div
            className={cn(
              'grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-11 mb-6',
            )}
          >
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Date')}</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      onChange={(value) => form.setValue('date', value as Date)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Expense Type')}</FormLabel>
                  <FormControl>
                    <Dropdown
                      items={Object.values(ExpenseType).map((expenseType) => ({
                        value: expenseType,
                        label: t(`expenses_${expenseType}`),
                      }))}
                      value={field.value?.toString()}
                      onChange={(value) => form.setValue('type', value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Supplier')}</FormLabel>
                  <FormControl>
                    <ResourceInput
                      onChange={(resources) => {
                        if (resources[0] === undefined) {
                          form.resetField('supplier');
                        } else {
                          form.setValue('supplier', resources[0]);
                        }
                      }}
                      options={suppliers.data || []}
                      maxTags={1}
                      selectedOptions={[field.value as any]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Description')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-11')}>
            <FormField
              control={form.control}
              name="quantity"
              defaultValue={0}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Quantity')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              defaultValue={0}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Price')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-6">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Notes')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value || undefined} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </Slideover>
    </FormProvider>
  );
}

export default ExpenseForm;

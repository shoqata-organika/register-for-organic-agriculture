import * as z from 'zod';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Dropdown } from '@/components/dropdown';

export const irrigationSchema = z.object({
  method: z.enum(['drip', 'sprinkler']),
  frequency: z.coerce.number(),
  source: z.enum(['well', 'river', 'public_systems']),
  frequency_unit: z.enum(['day', 'week', 'month']),
});

function IrrigationForm() {
  const form = useFormContext();

  const { t } = useTranslation();

  return (
    <div className={cn('grid gap-y-5 pt-3 pb-3')}>
      <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-11')}>
        <FormField
          control={form.control}
          name="details.method"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Irrigation Method')}</FormLabel>
              <FormControl>
                <Dropdown
                  items={['drip', 'sprinkler'].map((type) => ({
                    value: type.toString(),
                    label: t(type.toString()),
                  }))}
                  value={field.value?.toString()}
                  onChange={(value) => {
                    form.setValue('details.method', value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="details.source"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Source')}</FormLabel>
              <FormControl>
                <Dropdown
                  items={['well', 'river', 'public_systems'].map((type) => ({
                    value: type.toString(),
                    label: t(type.toString()),
                  }))}
                  value={field.value?.toString()}
                  onChange={(value) => {
                    form.setValue('details.source', value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="details.frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Frequency')}</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="details.frequency_unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Frequency Unit')}</FormLabel>
              <FormControl>
                <Dropdown
                  items={['day', 'week', 'month'].map((type) => ({
                    value: type.toString(),
                    label: t(type.toString()),
                  }))}
                  value={field.value?.toString()}
                  onChange={(value) => {
                    form.setValue('details.frequency_unit', value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export default IrrigationForm;

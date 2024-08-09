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
import { Input } from '@/components/ui/input';
import { InventoryLocation } from '@/api/types/inventory';
import { createLocation, updateLocation } from '@/api/inventory';

interface Props {
  onClose: (arg?: boolean) => void;
  location: InventoryLocation | null;
}

export const schema = z.object({
  name: z.string(),
  area: z.coerce.number().nullish(),
});

function InventoryLocationsForm({ location, onClose }: Props) {
  const initialValues = location || {};

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const { t } = useTranslation();

  async function handleSubmit(values: z.infer<typeof schema>) {
    if (!location) {
      createLocation(values).then(() => onClose(true));
    } else {
      updateLocation(location.id, values).then(() => onClose(true));
    }
  }

  return (
    <FormProvider {...form}>
      <Slideover
        onClose={() => onClose()}
        onSave={form.handleSubmit(handleSubmit)}
        title={t('New Storage')}
      >
        <Form className="space-y-8">
          <div className={cn('grid grid-cols-1 gap-4 gap-y-11 mb-6')}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Name')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Area (sqm)')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      value={field.value || undefined}
                    />
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

export default InventoryLocationsForm;

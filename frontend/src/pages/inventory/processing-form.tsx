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
import {
  InventoryItem,
  InventoryLocation,
  PackageType,
} from '@/api/types/inventory';
import { getInventoryItem, updateInventoryItem } from '@/api/inventory';
import { formatDate } from '@/utils/formatDate';
import { useEffect, useState } from 'react';
import { ta } from '@/utils/localized_attribute';
import { DatePicker } from '@/components/datepicker';
import ResourceInput from '../farm_activities/resource-input';
import { useQuery } from 'react-query';
import { ResourceType } from '@/api/types/user';
import { getResources } from '@/api/members';
import { Textarea } from '@/components/ui/textarea';
import { Dropdown } from '@/components/dropdown';

interface Props {
  onClose: (arg?: boolean) => void;
  item: InventoryItem | null;
  locations: InventoryLocation[];
}

export const schema = z.object({
  package_type: z.string(),
  date: z.coerce.date(),
  inventory_location_id: z.coerce.number(),
  person: z.object({ id: z.string(), name: z.string() }),
  notes: z.string().nullish(),
  quantity: z.coerce.number(),
});

const getPersons = async () => getResources(ResourceType.PERSON);

function ProcessingInventoryForm({ item, locations, onClose }: Props) {
  const initialValues = item || {};

  const [inventoryItem, setInventoryItem] = useState<InventoryItem | null>(
    null,
  );

  const persons = useQuery('persons', getPersons);

  useEffect(() => {
    if (item) {
      getInventoryItem(item.id).then((response) => {
        form.reset({
          ...(response as any),
          package_type: response.packageType,
          date: new Date(response.date),
        });

        setInventoryItem(response as InventoryItem);
      });
    }
  }, []);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const { t, i18n } = useTranslation();

  async function handleSubmit(values: z.infer<typeof schema>) {
    updateInventoryItem(item!.id, {
      ...values,
      package_type: values.package_type as PackageType,
    }).then(() => onClose(true));
  }

  return (
    <FormProvider {...form}>
      <Slideover
        onClose={() => onClose()}
        onSave={form.handleSubmit(handleSubmit)}
        title={t('New Item')}
      >
        <Form className="space-y-8">
          <div className={cn('grid grid-cols-2 gap-4 gap-y-11 mb-6')}>
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
            <FormItem>
              <FormLabel className="w-full">{t('Admission no.')}</FormLabel>
              <FormControl>
                {inventoryItem && (
                  <Input
                    type="text"
                    value={
                      inventoryItem.admissionEntry?.admission?.admission_no
                    }
                    disabled
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
          <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-11')}>
            <FormItem>
              <FormLabel className="w-full">{t('Crop')}</FormLabel>
              <FormControl>
                {inventoryItem && (
                  <Input
                    type="text"
                    value={ta(inventoryItem.crop, 'name', i18n.language)}
                    disabled
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel className="w-full">{t('Part of Crop')}</FormLabel>
              <FormControl>
                {inventoryItem && (
                  <Input
                    type="text"
                    value={ta(inventoryItem.partOfCrop, 'name', i18n.language)}
                    disabled
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormField
              control={form.control}
              name="quantity"
              defaultValue={0}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Quantity')}</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <>
              <FormItem>
                <FormLabel className="w-full">{t('Date')}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    value={formatDate(
                      inventoryItem?.admissionEntry?.admission?.date,
                    )}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
            <>
              <FormItem>
                <FormLabel className="w-full">{t('Crop State')}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    value={t(inventoryItem?.admissionEntry?.cropState || '')}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
            <>
              <FormItem>
                <FormLabel className="w-full">{t('Crop Status')}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    value={t(inventoryItem?.admissionEntry?.cropStatus || '')}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          </div>
          <div className="grid grid-cols-2 gap-4 gap-y-11">
            <FormField
              control={form.control}
              name="person"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">
                    {t('Responsible Person')}
                  </FormLabel>
                  <FormControl>
                    <ResourceInput
                      onChange={(resources) => {
                        if (resources[0] === undefined) {
                          form.resetField('person');
                        } else {
                          form.setValue('person', resources[0]);
                        }
                      }}
                      options={persons.data || []}
                      selectedOptions={[field.value as any]}
                      maxTags={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inventory_location_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Location')}</FormLabel>
                  <FormControl>
                    <Dropdown
                      items={locations.map((location) => ({
                        value: location.id.toString(),
                        label: location.name,
                      }))}
                      value={field.value?.toString()}
                      onChange={(value) =>
                        form.setValue('inventory_location_id', +value)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="package_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Package Type')}</FormLabel>
                  <FormControl>
                    <Dropdown
                      items={Object.values(PackageType).map((packageType) => ({
                        value: packageType,
                        label: t(packageType),
                      }))}
                      value={field.value?.toString()}
                      onChange={(value) => form.setValue('package_type', value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 gap-y-11">
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

export default ProcessingInventoryForm;

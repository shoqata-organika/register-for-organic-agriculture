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
  InventoryItemType,
  InventoryLocation,
  PackageType,
} from '@/api/types/inventory';
import {
  createInventoryItem,
  getInventoryItem,
  updateInventoryItem,
} from '@/api/inventory';
import { useEffect } from 'react';
import { DatePicker } from '@/components/datepicker';
import ResourceInput from '../farm_activities/resource-input';
import { useQuery } from 'react-query';
import { ResourceType } from '@/api/types/user';
import { getResources } from '@/api/members';
import { Textarea } from '@/components/ui/textarea';
import { Dropdown } from '@/components/dropdown';
import { AllowedInventoryItemType } from './inputs';

interface Props {
  onClose: (arg?: boolean) => void;
  item: InventoryItem | null;
  locations: InventoryLocation[];
  type: AllowedInventoryItemType;
}

const baseSchema = z.object({
  package_type: z.string(),
  date: z.coerce.date(),
  purchaseDate: z.coerce.date(),
  expiryDate: z.coerce.date(),
  cost: z.coerce.number().optional(),
  inventory_location_id: z.coerce.number(),
  name: z.string(),
  description: z.string().optional(),
  sku: z.string().optional(),
  person: z.object({ id: z.string(), name: z.string() }),
  producer: z.object({ id: z.string(), name: z.string() }),
  supplier: z.object({ id: z.string(), name: z.string() }),
  notes: z.string().optional(),
  quantity: z.coerce.number(),
});

const getPersons = async () => getResources(ResourceType.PERSON);
const getProducers = async () => getResources(ResourceType.PRODUCER);
const getSuppliers = async () => getResources(ResourceType.SUPPLIER);

function InputsForm({ item, locations, type, onClose }: Props) {
  const initialValues = item || {};
  const persons = useQuery('persons', getPersons);
  const producers = useQuery('producers', getProducers);
  const suppliers = useQuery('suppliers', getSuppliers);
  const schema =
    type === InventoryItemType.INPUT
      ? baseSchema
      : baseSchema.extend({
          producer: z
            .object({ id: z.string(), name: z.string() })
            .optional()
            .nullish(),
        });

  useEffect(() => {
    if (item) {
      getInventoryItem(item.id).then((response) => {
        form.reset({
          ...(response as any),
          package_type: response.packageType,
          date: new Date(response.date),
          purchaseDate: response.purchaseDate
            ? new Date(response.purchaseDate)
            : null,
          expiryDate: response.expiryDate
            ? new Date(response.expiryDate)
            : null,
        });
      });
    }
  }, []);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const { t } = useTranslation();

  async function handleSubmit(values: z.infer<typeof schema>) {
    if (item) {
      updateInventoryItem(item.id, {
        ...values,
        type: type,
        package_type: values.package_type as PackageType,
      }).then(() => onClose(true));
    } else {
      createInventoryItem({
        ...values,
        type: type,
        package_type: values.package_type as PackageType,
      }).then(() => onClose(true));
    }
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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Product Name')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {type === InventoryItemType.INPUT && (
              <FormField
                control={form.control}
                name="producer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full">{t('Producer')}</FormLabel>
                    <FormControl>
                      <ResourceInput
                        onChange={(resources) => {
                          if (resources[0] === undefined) {
                            form.resetField('producer');
                          } else {
                            form.setValue('producer', resources[0]);
                          }
                        }}
                        options={producers.data || []}
                        selectedOptions={[field.value as any]}
                        maxTags={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {type === InventoryItemType.INPUT && (
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full">
                      {t('Product Description')}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('SKU')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <>
              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full">
                      {t('Purchase Date')}
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        onChange={(value) =>
                          form.setValue('purchaseDate', value as Date)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full">{t('Expiry Date')}</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        onChange={(value) =>
                          form.setValue('expiryDate', value as Date)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
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
                    <Input type="number" min="0" {...field} />
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
              name="cost"
              defaultValue={0}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Price')}</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <Textarea {...field} />
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

export default InputsForm;

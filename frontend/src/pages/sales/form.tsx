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
import { Sale, SaleType } from '@/api/types/accounting';
import { createSale, updateSale } from '@/api/accounting';
import { getResources } from '@/api/members';
import { InventoryItemType } from '@/api/types/inventory';
import { ResourceType } from '@/api/types/user';
import { useQuery } from 'react-query';
import { getInventoryItemsForSale } from '@/api/inventory';
import ResourceInput from '../farm_activities/resource-input';
import { Dropdown } from '@/components/dropdown';
import { InventoryItem } from '@/api/types/inventory';
import { ta } from '@/utils/localized_attribute';

interface Props {
  onClose: (arg?: boolean) => void;
  sale: Sale | null;
}

const getCustomers = () => getResources(ResourceType.CUSTOMER);

export const schema = z.object({
  date: z.coerce.date(),
  customer: z.object({ id: z.string(), name: z.string() }),
  type: z.string(),
  inventory_item_id: z.coerce.number().optional(),
  product_type: z.enum(['processed', 'not processed']).optional(),
  description: z.string().optional(),
  quantity: z.coerce.number().positive('Quantity cannot be 0'),
  price: z.coerce.number().positive('Price cannot be 0'),
  notes: z.string().nullish(),
});

const getDisplayName = (
  inventoryItem: InventoryItem,
  language: string,
  t: any,
) => {
  if (inventoryItem.crop) {
    return `${inventoryItem.admissionEntry?.admission?.admission_no} - ${ta(
      inventoryItem.crop,
      'name',
      language,
    )} - ${ta(inventoryItem.partOfCrop, 'name', language)} - ${t(
      inventoryItem.type,
    )}`;
  } else {
    return `${inventoryItem.name} - ${inventoryItem.description} - ${t(
      inventoryItem.type,
    )}`;
  }
};

function SalesForm({ sale, onClose }: Props) {
  const initialValues = sale || {};

  const customers = useQuery('customers', getCustomers);
  const inventoryItems = useQuery('inventoryItems', getInventoryItemsForSale);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });
  const { t, i18n } = useTranslation();

  async function handleSubmit(values: z.infer<typeof schema>) {
    if (!sale) {
      createSale({
        ...values,
        type: values.type as SaleType,
      }).then(() => onClose(true));
    } else {
      updateSale(sale.id, {
        ...values,
        type: values.type as SaleType,
      }).then(() => onClose(true));
    }
  }

  const saleType = form.watch('type');
  const product_type = form.watch('product_type');

  const filteredInvItems =
    inventoryItems?.data &&
    inventoryItems?.data.filter((item) => {
      if (!product_type) return item;

      const type = item.type;

      if (product_type === 'processed') {
        return type === InventoryItemType.PROCESSED_PRODUCT;
      }

      return (
        type === InventoryItemType.HARVESTED_PRODUCT ||
        type === InventoryItemType.PURCHASED_PRODUCT ||
        type === InventoryItemType.DRIED_PRODUCT
      );
    });

  return (
    <FormProvider {...form}>
      <Slideover
        onClose={() => onClose()}
        onSave={form.handleSubmit(handleSubmit)}
        title={t('New Sale')}
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
                  <FormLabel className="w-full">{t('Sale Type')}</FormLabel>
                  <FormControl>
                    <Dropdown
                      items={Object.values(SaleType).map((saleType) => ({
                        value: saleType,
                        label: t(saleType),
                      }))}
                      value={field.value?.toString()}
                      onChange={(value) => form.setValue('type', value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {saleType === 'product' && (
              <FormField
                control={form.control}
                name="product_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full">
                      {t('Product Type')}
                    </FormLabel>
                    <FormControl>
                      <Dropdown
                        items={['processed', 'not processed'].map((type) => ({
                          value: type,
                          label: t(type),
                        }))}
                        value={field.value?.toString()}
                        onChange={(value) => {
                          form.setValue(
                            'product_type',
                            value as 'processed' | 'not processed',
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {saleType === 'product' && (
              <FormField
                control={form.control}
                name="inventory_item_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full">
                      {t('Inventory Item')}
                    </FormLabel>
                    <FormControl>
                      <Dropdown
                        items={(filteredInvItems || []).map(
                          (inventoryItem) => ({
                            value: inventoryItem.id.toString(),
                            label: getDisplayName(
                              inventoryItem,
                              i18n.language,
                              t,
                            ),
                          }),
                        )}
                        value={field.value?.toString()}
                        onChange={(value) => {
                          form.setValue('inventory_item_id', +value);
                          form.setValue(
                            'quantity',
                            inventoryItems.data?.find(
                              (item) => item.id === +value,
                            )?.quantity || 0,
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="description"
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
          <div className="flex">
            <FormField
              control={form.control}
              name="customer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Customer')}</FormLabel>
                  <FormControl>
                    <ResourceInput
                      onChange={(resources) => {
                        if (resources[0] === undefined) {
                          form.resetField('customer');
                        } else {
                          form.setValue('customer', resources[0]);
                        }
                      }}
                      options={customers.data || []}
                      selectedOptions={[field.value as any]}
                      maxTags={1}
                    />
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

export default SalesForm;

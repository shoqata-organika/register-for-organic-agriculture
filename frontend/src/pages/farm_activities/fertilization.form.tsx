import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/utils';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Dropdown } from '@/components/dropdown';
import { getResources } from '@/api/members';
import { ResourceType } from '@/api/types/user';
import { useQuery } from 'react-query';
import ResourceInput from './resource-input';

export const fertilizationSchema = z.object({
  product: z.object({ id: z.string(), name: z.string() }).nullish(),
  type: z.enum(['organic', 'inorganic']),
  origin: z.enum([
    'plant_origin',
    'animal_origin',
    'compost',
    'nitrogen_based',
    'phosphoric',
    'potassic',
    'micronutrients',
  ]),
  subtype: z.enum([
    'superphosphate',
    'ammonium_nitrate',
    'potassium_sulphate',
    'not_applicable',
  ]),
  producer: z.object({ id: z.string(), name: z.string() }).nullish(),
  supplier: z.object({ id: z.string(), name: z.string() }).nullish(),
  remaining_quantity: z.coerce.number(),
  n_quantity: z.coerce.number(),
  fuel_used: z.coerce.number(),
  devices: z.array(z.object({ id: z.string(), name: z.string() })).nullish(),
});

const getDevices = async () => getResources(ResourceType.FERTILIZATION_MACHINE);
const getProducts = async () =>
  getResources(ResourceType.FERTILIZATION_PRODUCT);

const getProducers = async () => getResources(ResourceType.PRODUCER);

const getSuppliers = async () => getResources(ResourceType.SUPPLIER);

function FertilizationForm() {
  const form = useFormContext();
  const devices = useQuery('devices', getDevices);
  const products = useQuery('products', getProducts);
  const producers = useQuery('producers', getProducers);
  const suppliers = useQuery('suppliers', getSuppliers);

  const { t } = useTranslation();

  return (
    <div className={cn('grid gap-y-5 pt-3 pb-3')}>
      <div className={cn('grid grid-cols-1 gap-4 gap-y-5')}>
        <FormField
          control={form.control}
          name="details.product"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Product')}</FormLabel>
              <FormControl>
                <ResourceInput
                  onChange={(resources) => {
                    form.setValue(
                      'details.product',
                      resources[0] === undefined ? null : resources[0],
                    );
                  }}
                  options={products.data || []}
                  selectedOptions={[field.value]}
                  maxTags={1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-5')}>
        <FormField
          control={form.control}
          name="details.type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Type')}</FormLabel>
              <FormControl>
                <Dropdown
                  items={['organic', 'inorganic'].map((type) => ({
                    value: type.toString(),
                    label: t(type.toString()),
                  }))}
                  value={field.value?.toString()}
                  onChange={(value) => {
                    form.setValue('details.type', value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="details.origin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Origin')}</FormLabel>
              <FormControl>
                <Dropdown
                  items={[
                    'plant_origin',
                    'animal_origin',
                    'compost',
                    'nitrogen_based',
                    'phosphoric',
                    'potassic',
                    'micronutrients',
                  ].map((type) => ({
                    value: type.toString(),
                    label: t(type.toString()),
                  }))}
                  value={field.value?.toString()}
                  onChange={(value) => {
                    form.setValue('details.origin', value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="details.subtype"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Sub type')}</FormLabel>
              <FormControl>
                <Dropdown
                  items={[
                    'superphosphate',
                    'ammonium_nitrate',
                    'potassium_sulphate',
                    'not_applicable',
                  ].map((type) => ({
                    value: type.toString(),
                    label: t(type.toString()),
                  }))}
                  value={field.value?.toString()}
                  onChange={(value) => {
                    form.setValue('details.subtype', value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className={cn('grid grid-cols-2 gap-4 gap-y-5')}>
        <FormField
          control={form.control}
          name="details.producer"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Producer')}</FormLabel>
              <FormControl>
                <ResourceInput
                  onChange={(resources) => {
                    form.setValue(
                      'details.producer',
                      resources[0] === undefined ? null : resources[0],
                    );
                  }}
                  options={producers.data || []}
                  maxTags={1}
                  selectedOptions={[field.value]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="details.supplier"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Supplier')}</FormLabel>
              <FormControl>
                <ResourceInput
                  onChange={(resources) => {
                    form.setValue(
                      'details.supplier',
                      resources[0] === undefined ? null : resources[0],
                    );
                  }}
                  options={suppliers.data || []}
                  maxTags={1}
                  selectedOptions={[field.value]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-5')}>
        <FormField
          control={form.control}
          name="quantity"
          defaultValue={0}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Applied Quantity')}</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="details.remaining_quantity"
          defaultValue={0}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">
                {t('Remaining Quantity')}
              </FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="details.n_quantity"
          defaultValue={0}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Nitrogen Quantity')}</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className={cn('grid grid-cols-1 gap-4 gap-y-5')}>
        <FormField
          control={form.control}
          name="details.devices"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Devices')}</FormLabel>
              <FormControl>
                <ResourceInput
                  onChange={(resources) => {
                    form.setValue('details.devices', resources || []);
                  }}
                  options={devices.data || []}
                  selectedOptions={field.value || []}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="details.fuel_used"
          defaultValue={0}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Fuel Used')}</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export default FertilizationForm;

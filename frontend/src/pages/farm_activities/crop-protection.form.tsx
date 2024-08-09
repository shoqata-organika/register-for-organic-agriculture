import * as z from 'zod';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
import { ta } from '@/utils/localized_attribute';
import { Code } from '@/api/types/code_category';
import ResourceInput from './resource-input';
import { getResources } from '@/api/members';
import { ResourceType } from '@/api/types/user';
import { useQuery } from 'react-query';

export const cropProtectionSchema = z.object({
  disease_id: z.coerce.number().nullish(),
  product: z.object({ id: z.string(), name: z.string() }).nullish(),
  active_ingredient: z.string().nullish(),
  supplier: z.object({ id: z.string(), name: z.string() }).nullish(),
  cu_quantity: z.coerce.number(),
  remaining_quantity: z.coerce.number(),
});

interface Props {
  crops: Code[];
  cropDiseases: Code[];
}

const getProducts = async () =>
  getResources(ResourceType.CROP_PROTECTION_PRODUCT);

const getSuppliers = async () => getResources(ResourceType.SUPPLIER);

function CropProtectionForm({ crops, cropDiseases }: Props) {
  const form = useFormContext();
  const products = useQuery('cropProtectionProducts', getProducts);
  const suppliers = useQuery('suppliers', getSuppliers);

  const { t, i18n } = useTranslation();

  return (
    <div className={cn('grid gap-y-5 pt-5 pb-3')}>
      <div className={cn('grid grid-cols-2 gap-4 gap-y-5')}>
        <FormField
          control={form.control}
          name="crop_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Crop')}</FormLabel>
              <FormControl>
                <Dropdown
                  items={crops.map((crop) => ({
                    value: crop.id.toString(),
                    label: ta(crop, 'name', i18n.language),
                  }))}
                  value={field.value?.toString()}
                  onChange={(value) => form.setValue('crop_id', +value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="details.disease_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Disease')}</FormLabel>
              <FormControl>
                <Dropdown
                  items={cropDiseases.map((disease) => ({
                    value: disease.id.toString(),
                    label: ta(disease, 'name', i18n.language),
                  }))}
                  value={field.value?.toString()}
                  onChange={(value) =>
                    form.setValue('details.disease_id', +value)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className={cn('grid grid-cols-2 gap-4 gap-y-11')}>
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
        <FormField
          control={form.control}
          name="details.active_ingredient"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Active Ingredient')}</FormLabel>
              <FormControl>
                <Input {...field} />
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
                  selectedOptions={[field.value]}
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
          name="details.cu_quantity"
          defaultValue={0}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Copper Quantity')}</FormLabel>
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
      </div>
    </div>
  );
}

export default CropProtectionForm;

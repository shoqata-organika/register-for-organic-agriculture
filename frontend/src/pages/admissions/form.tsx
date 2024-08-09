import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from '@/components/ui/form';
import { useTranslation } from 'react-i18next';
import { Dropdown } from '@/components/dropdown';
import { cn } from '@/utils';
import { Code } from '@/api/types/code_category';
import { ta } from '@/utils/localized_attribute';
import { useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusIcon } from '@heroicons/react/20/solid';
import {
  CropState,
  CropStates,
  CropStatus,
  CropStatuses,
} from '@/api/types/common';
import { AdmissionEntry, AdmissionType } from '@/api/types/admission';

interface Props {
  crops: Array<Code>;
  type: AdmissionType;
  onSubmit: (values: AdmissionEntry) => void;
  entry: AdmissionEntry | null;
}

export const schema = z
  .object({
    crop_id: z.coerce.number().min(1, 'Crop is required'),
    part_of_crop_id: z.coerce.number().min(1, 'Part of crop is required'),
    cropState: z.string(),
    cropStatus: z.string(),
    gross_quantity: z.coerce.number().positive(),
    net_quantity: z.coerce.number().positive(),
    lot_no: z.string().nullish().optional(),
    notes: z.string().nullish().optional(),
  })
  .superRefine((values, context) => {
    if (values.net_quantity > values.gross_quantity) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Net Quantity cannot be equal or higher than Gross Quantity',
        path: ['net_quantity'],
      });
    }
  });

function AdmissionEntryForm({ crops, type, entry, onSubmit }: Props) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: entry || {},
  });

  useEffect(() => {
    if (entry) {
      form.reset(entry);
    } else {
      form.reset({});
    }
  }, [entry]);

  const cropId = form.watch('crop_id');

  console.log('cropId: ', cropId);

  const partsOfCrops = useMemo(() => {
    return crops.find((crop) => crop.id === cropId)?.subCodes || [];
  }, [cropId]);

  const { t, i18n } = useTranslation();

  function handleSubmit(values: z.infer<typeof schema>) {
    onSubmit({
      id: entry ? entry.id : undefined,
      ...values,
      cropState: values.cropState as CropState,
      cropStatus: values.cropStatus as CropStatus,
      _tempId: entry ? entry._tempId : Math.random(),
    });

    form.reset({});
  }

  console.log(crops);

  const title = entry ? 'Edit Crop' : 'Add Crop';

  return (
    <Form {...form}>
      <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-3')}>
        <FormField
          control={form.control}
          name="crop_id"
          defaultValue={0}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Crop')}</FormLabel>
              <FormControl>
                <Dropdown
                  items={(crops || []).map((crop) => ({
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
          name="part_of_crop_id"
          defaultValue={0}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Part of crop')}</FormLabel>
              <FormControl>
                <Dropdown
                  items={partsOfCrops.map((crop) => ({
                    value: crop.id.toString(),
                    label: ta(crop, 'name', i18n.language),
                  }))}
                  value={field.value?.toString()}
                  onChange={(value) => form.setValue('part_of_crop_id', +value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cropState"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Crop State')}</FormLabel>
              <FormControl>
                <Dropdown
                  items={Object.values(CropStates).map((state) => ({
                    value: state,
                    label: t(state),
                  }))}
                  value={field.value?.toString()}
                  onChange={(value) => form.setValue('cropState', value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cropStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Crop Status')}</FormLabel>
              <FormControl>
                <Dropdown
                  items={Object.values(CropStatuses).map((status) => ({
                    value: status,
                    label: t(status),
                  }))}
                  value={field.value?.toString()}
                  onChange={(value) => form.setValue('cropStatus', value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gross_quantity"
          defaultValue={0}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">
                {t(type === 'collection' ? 'Weight' : 'Gross Weight')}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  value={field.value?.toString()}
                  onChange={(event) => {
                    form.setValue('gross_quantity', +event.target.value);

                    if (type === 'collection') {
                      form.setValue('net_quantity', +event.target.value);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {type !== 'collection' && (
          <FormField
            control={form.control}
            name="net_quantity"
            defaultValue={0}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-full">{t('Net Weight')}</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="lot_no"
          defaultValue={undefined}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Code')}</FormLabel>
              <FormControl>
                <Input {...field} value={field?.value || undefined} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className={cn('grid grid-cols-1 w-full')}>
        <FormField
          control={form.control}
          name="notes"
          defaultValue={undefined}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Notes')}</FormLabel>
              <FormControl>
                <Textarea {...field} value={field?.value || undefined} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <button
        type="button"
        className="inline-flex items-center gap-x-1.5 rounded-md border border-green-600 px-2.5 py-1.5 text-sm font-semibold text-green-600 shadow-sm hover:border-green-500 hover:text-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        onClick={form.handleSubmit(handleSubmit)}
      >
        <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
        {t(title)}
      </button>
    </Form>
  );
}

export default AdmissionEntryForm;

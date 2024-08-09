import { useEffect, useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/utils';
import { Form, useForm } from 'react-hook-form';
import { TabularDropdown } from '@/components/ui/tabular-dropdown';
import { AdmissionEntryView } from '@/api/types/admission';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/utils/formatDate';
import { useTranslation } from 'react-i18next';
import { PlusIcon } from '@heroicons/react/20/solid';
import { ProcessingAdmissionEntry } from './form';
import { getInventoryItem } from '@/api/inventory';
import { ta } from '@/utils/localized_attribute';
import { InventoryItem } from '@/api/types/inventory';
import {
  ProcessingActivityEntry,
  ProcessingType,
} from '@/api/types/processing_activity';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { getMemberCrop } from '@/api/members';
import {
  getAdmissionDisplayName,
  getAdmissionSubject,
  getInventoryType,
  getArea,
} from '@/utils/admission-utils';

export const entrySchema = z.object({
  admission_entry_id: z.string().nullish(),
  admission_id: z.string().min(1),
  crop_id: z.string().min(1, 'Required'),
  inventory_item_id: z.number().min(1, 'Required'),
  part_of_crop_id: z.string().min(1, 'Required'),
  cropState: z.string(),
  cropStatus: z.string(),
  gross_quantity: z.coerce.number().positive(),
  net_quantity: z.coerce.number().positive(),
  fraction: z.string().nullish(),
  firo: z.coerce.number().min(0, 'Required'),
});

const superRefinement = (
  values: z.infer<typeof entrySchema>,
  context: z.RefinementCtx,
) => {
  if (values.net_quantity > values.gross_quantity) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Net Quantity cannot be equal or higher than Gross Quantity',
      path: ['net_quantity'],
    });
  }
};

interface Props {
  inventoryItems: InventoryItem[];
  item: InventoryItem | null;
  type?: ProcessingType;
  setItem: (item: InventoryItem) => void;
  admissionEntry: AdmissionEntryView | null;
  setAdmissionEntry: (entry: ProcessingAdmissionEntry | null) => void;
  onSubmit: (values: any) => void;
  entry: ProcessingActivityEntry | null;
}

export default function ProcessingEntryForm({
  admissionEntry,
  inventoryItems,
  setItem,
  type,
  setAdmissionEntry,
  entry,
  onSubmit,
}: Props) {
  const [formSchema, setFormSchema] = useState(
    entrySchema.superRefine(superRefinement),
  );

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (entry) {
      const newSchema = entrySchema
        .extend({
          gross_quantity: z.coerce
            .number()
            .min(1, 'Required')
            .max(entry.gross_quantity),
        })
        .superRefine(superRefinement);
      setFormSchema(newSchema);
    }

    if (entry) {
      form.reset({ ...entry });
    } else {
      form.reset({});
    }
  }, [entry]);

  const form = useForm<z.infer<typeof entrySchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  function handleSubmit(values: z.infer<typeof entrySchema>) {
    onSubmit({
      ...values,
      _tempId: entry ? entry._tempId : Math.random(),
    });

    form.reset({});
  }

  async function onAdmissionChange(item_id: number) {
    getInventoryItem(item_id).then((data) => {
      setItem(data);
    });
  }

  const title = entry ? 'Edit Admission' : 'Add Admission';

  // only show fresh crops for drying page
  inventoryItems =
    type && type === ProcessingType.DRYING
      ? inventoryItems.filter((item) => item.admissionEntry.cropState !== 'dry')
      : inventoryItems;

  return (
    <Form {...form}>
      <div className={cn('grid grid-cols-1 gap-4 gap-y-11 mb-6')}>
        <FormField
          control={form.control}
          name="inventory_item_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Admission no.')}</FormLabel>
              <FormControl>
                {inventoryItems && (
                  <TabularDropdown
                    columns={[
                      { key: 'date', displayName: t('Date') },
                      {
                        key: 'admission_no',
                        displayName: t('Admission no.'),
                      },
                      {
                        key: 'type',
                        displayName: t('Type'),
                      },
                      {
                        key: 'subject',
                        displayName: t('Subject'),
                      },
                      {
                        key: 'area',
                        displayName: t('Zone / Parcel'),
                      },
                      {
                        key: 'crop',
                        displayName: t('Crop'),
                      },
                      {
                        key: 'quantity',
                        displayName: t('Quantity'),
                      },
                    ]}
                    items={inventoryItems.map((item) => ({
                      id: item.id.toString(),
                      type: getInventoryType(item.type, t),
                      date: formatDate(
                        new Date(item.admissionEntry.admission!.date),
                      ),
                      crop: `${ta(item.crop, 'name', i18n.language)} ${item.partOfCrop ? `(${ta(item.partOfCrop, 'name', i18n.language)})` : ''}`,
                      admission_no: item.admissionEntry.admission!.admission_no,
                      subject: getAdmissionSubject(
                        item.admissionEntry.admission!,
                      ),
                      area: getArea(item.admissionEntry.admission!),
                      displayName: getAdmissionDisplayName(
                        item.admissionEntry.admission!,
                        t,
                      ),
                      quantity: item.quantity.toString(),
                    }))}
                    value={field.value?.toString()}
                    onChange={async (value) => {
                      form.setValue('inventory_item_id', +value);

                      const invItem = inventoryItems.find(
                        (item) => item.id === +value,
                      );

                      if (invItem) {
                        form.setValue(
                          'admission_entry_id',
                          invItem.admission_entry_id!.toString(),
                        );

                        form.setValue(
                          'admission_id',
                          invItem.admissionEntry.admission_id!.toString(),
                        );

                        form.setValue('gross_quantity', invItem.quantity);

                        const memberCrop = await getMemberCrop(
                          invItem.admissionEntry.crop_id,
                        );

                        form.setValue(
                          'crop_id',
                          invItem.admissionEntry.crop_id.toString(),
                        );
                        form.setValue(
                          'cropState',
                          invItem.admissionEntry.cropState,
                        );
                        form.setValue(
                          'cropStatus',
                          invItem.admissionEntry.cropStatus,
                        );

                        form.setValue(
                          'part_of_crop_id',
                          invItem.admissionEntry.part_of_crop_id.toString(),
                        );

                        const entry = {
                          ...invItem.admissionEntry,
                          crop: invItem.crop,
                          customCode: memberCrop.code,
                          partOfCrop: invItem.partOfCrop,
                        };

                        setAdmissionEntry(entry as ProcessingAdmissionEntry);
                      }

                      onAdmissionChange(+value);
                    }}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className={cn('grid grid-cols-2 gap-4 gap-y-11 mb-6')}>
        {/* <FormField
          control={form.control}
          name="admission_entry_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Crop')}</FormLabel>
              <FormControl>
                {admissionEntries && (
                  <TabularDropdown
                    columns={[
                      {
                        key: 'crop',
                        displayName: t('Crop'),
                      },
                      {
                        key: 'partOfCrop',
                        displayName: t('Part of Crop'),
                      },
                      {
                        key: 'cropState',
                        displayName: t('Crop State'),
                      },
                      {
                        key: 'cropStatus',
                        displayName: t('Crop Status'),
                      },
                      {
                        key: 'quantity',
                        displayName: t('Quantity'),
                      },
                    ]}
                    items={admissionEntries.map((entry) => ({
                      id: entry.id.toString(),
                      crop: ta(entry.crop, 'name', i18n.language),
                      partOfCrop: entry.partOfCrop
                        ? ta(entry.partOfCrop, 'name', i18n.language)
                        : '',
                      cropState: t(entry.cropState),
                      cropStatus: t(entry.cropStatus),
                      quantity: entry.net_quantity?.toString(),
                      displayName: getAdmissionEntryDisplayName(
                        entry,
                        i18n.language,
                      ),
                    }))}
                    value={field.value?.toString()}
                    onChange={(value) => {
                      form.setValue('admission_entry_id', value);

                      const entry =
                        admissionEntries.find((entry) => entry.id === +value) ||
                        null;

                      if (entry) {
                        form.setValue(
                          'admission_id',
                          entry.admission_id!.toString(),
                        );

                        form.setValue(
                          'gross_quantity',
                          entry.net_quantity || entry.gross_quantity,
                        );

                        form.setValue('crop_id', entry.crop.id.toString());
                        form.setValue('cropState', entry.cropState);
                        form.setValue('cropStatus', entry.cropStatus);

                        form.setValue(
                          'part_of_crop_id',
                          entry.partOfCrop.id.toString(),
                        );
                      }

                      setAdmissionEntry(entry);
                    }}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="gross_quantity"
          defaultValue={0}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Gross Quantity')}</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="net_quantity"
          defaultValue={0}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Net Quantity')}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(evt) => {
                    const firo =
                      admissionEntry && evt.target.value
                        ? form.getValues('gross_quantity') -
                          parseFloat(evt.target.value)
                        : 0;

                    form.setValue('firo', parseFloat(firo.toFixed(4)));
                    form.setValue('net_quantity', +evt.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="firo"
          defaultValue={0}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Firo')}</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fraction"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Fraction')}</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  value={field.value || undefined}
                />
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

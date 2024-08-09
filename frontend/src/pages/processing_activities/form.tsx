import { useEffect, useContext, useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Form, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Textarea } from '@/components/ui/textarea';
import { ta } from '@/utils/localized_attribute';
import { Button } from '@/components/ui/button';
import { Dropdown } from '@/components/dropdown';
import { generateLotCode } from '@/utils/generateLotCode';
import { UserContext } from '@/layout/context';
import { PlusIcon } from '@heroicons/react/20/solid';
import Slideover from '@/components/ui/slide-over';
import { Code } from '@/api/types/code_category';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/utils';
import ProcessingActivityEntryList from './list';
import { DatePicker } from '@/components/datepicker';
import {
  DetailedProcessingActivity,
  ProcessingType,
  ProcessingActivityEntry,
} from '@/api/types/processing_activity';
import { AdmissionEntryView } from '@/api/types/admission';
import {
  createProcessingActivity,
  updateProcessingActivity,
} from '@/api/processing_activities';
import { ProcessingUnitView } from '@/api/types/processing_unit';
import ProcessingEntryForm, { entrySchema } from './entry-form';
import {
  getDriedInventoryItems,
  getInventoryItem,
  getInventoryItems,
} from '@/api/inventory';
import { InventoryItem, InventoryItemType } from '@/api/types/inventory';
import { useQuery } from 'react-query';

interface Props {
  processingMethods: Code[];
  type?: ProcessingType;
  processingTypes: Code[];
  processingUnits: ProcessingUnitView[];
  crops: Code[];
  onClose: (arg?: boolean) => void;
  processingActivity: DetailedProcessingActivity | null;
}

export const schema = z.object({
  date: z.coerce.date(),
  lot_code: z.string().min(1, 'Required'),
  processing_method_id: z.string().nullish(),
  processing_type: z.string().min(1, 'Required'),
  processing_unit_id: z.string().min(1, 'Required'),
  drier_number: z.string().nullish(),
  drier_temp: z.coerce.number().nullish(),
  drier_start_hour: z.coerce.number().nullish(),
  drier_end_hour: z.coerce.number().nullish(),
  drying_start_date: z.coerce.date().nullish(),
  drying_end_date: z.coerce.date().nullish(),
  entries: z
    .array(entrySchema, {
      required_error: 'At least one crop is required',
    })
    .min(1, 'At least one crop is required'),
  notes: z.string().nullish(),
});

export type ProcessingAdmissionEntry = AdmissionEntryView & {
  customCode?: string;
};

function ProcessingActivityForm({
  processingMethods,
  processingTypes,
  processingUnits,
  crops,
  type,
  processingActivity,
  onClose,
}: Props) {
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [processingActivityEntries, setProcessingActivityEntries] = useState<
    ProcessingActivityEntry[]
  >([]);
  const [entry, setEntry] = useState<ProcessingActivityEntry | null>(null);
  const [admissionEntry, setAdmissionEntry] =
    useState<ProcessingAdmissionEntry | null>(null);
  const currentUser = useContext(UserContext);

  const [disabled, setDisabled] = useState(false);

  const inventoryItems = useQuery({
    queryKey: 'inventoryItems',
    queryFn: async () =>
      !type
        ? await getDriedInventoryItems()
        : await getInventoryItems(InventoryItemType.COLLECTED_PRODUCT).then(
            async (collectedProds) => {
              const harvestedProds = await getInventoryItems(
                InventoryItemType.HARVESTED_PRODUCT,
              );

              return collectedProds.concat(harvestedProds);
            },
          ),
  });

  const initialValues = processingActivity
    ? {
        date: new Date(processingActivity.date),
        admission_id: processingActivity.admission_id.toString(),
        admission_entry_id: processingActivity.admission_entry_id.toString(),
        crop_id: processingActivity.crop.id.toString(),
        part_of_crop_id: processingActivity.partOfCrop.id.toString(),
        gross_quantity: processingActivity.gross_quantity,
        net_quantity: processingActivity.net_quantity,
        crop_state: processingActivity.crop_state,
        crop_status: processingActivity.crop_status,
        firo: processingActivity.firo,
        processing_method_id:
          processingActivity.processing_method.id.toString(),
        processing_type_id: processingActivity.processing_type.id.toString(),
        processing_unit_id: processingActivity.processing_unit.id.toString(),

        notes: processingActivity.notes,
        lot_code: processingActivity.lot_code,
      }
    : {
        processing_type: type ? preselectType()?.name : undefined,
      };

  useEffect(() => {
    if (processingActivity) {
      getInventoryItem(processingActivity.admission_id).then((data) => {
        setItem(data);
      });
    }
  }, []);

  function preselectType() {
    const pType = processingTypes.find((pt) => pt.name.toLowerCase() === type);

    return pType;
  }

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const { t, i18n } = useTranslation();

  const handleProcessingActivityEntry = (entry: ProcessingActivityEntry) => {
    const entries = processingActivityEntries.slice();

    const existingIndex = entries.findIndex((ca) => {
      return entry.id ? ca.id === entry.id : ca._tempId === entry._tempId;
    });

    if (existingIndex > -1) {
      entries[existingIndex] = entry;
    } else {
      entries.push(entry);
    }

    setProcessingActivityEntries(entries);
    setEntry(null);

    form.setValue('entries', entries as any);
  };

  async function handleSubmit(values: z.infer<typeof schema>) {
    const activity = {
      date: values.date.toISOString().split('T')[0],
      lot_code: values.lot_code,
      processing_method_id: values.processing_method_id,
      processing_type: values.processing_type.toLowerCase(),
      processing_unit_id: values.processing_unit_id,
      drier_number: values.drier_number,
      drier_temp: values.drier_temp,
      drier_start_hour: values.drier_start_hour,
      drier_end_hour: values.drier_end_hour,
      drying_start_date: values.drying_start_date,
      drying_end_date: values.drying_end_date,
      notes: values.notes,
      entries: values.entries.map((entry) => ({
        gross_quantity: +entry.gross_quantity,
        net_quantity: +entry.net_quantity,
        firo: +entry.firo,
        inventory_item_id: +entry.inventory_item_id,
        cropStatus: entry.cropStatus,
        cropState: entry.cropState,
        crop_id: entry.crop_id,
        part_of_crop_id: entry.part_of_crop_id,
        fraction: entry.fraction,
      })),
    };

    if (!processingActivity) {
      await createProcessingActivity(activity as any, type).then(() =>
        onClose(true),
      );
    } else {
      await updateProcessingActivity({
        ...activity,
        id: processingActivity.id,
      } as any).then(() => onClose(true));
    }
  }

  const handleGenerateLotCode = async () => {
    if (item && admissionEntry) {
      setDisabled(true);
      try {
        const lotCode = await generateLotCode(
          currentUser!.member,
          admissionEntry.crop.id,
          admissionEntry.partOfCrop,
          new Date(item.admissionEntry.admission!.date),
          item.admissionEntry.admission!.landParcel,
          item.admissionEntry.admission!.zone,
        );

        form.setValue('lot_code', lotCode);
        setDisabled(false);
      } catch (e) {
        console.error(e);

        setDisabled(false);
      }
    }
  };

  const title = entry ? 'Edit Admission' : 'Add Admission';
  const mainTitle = type ? 'New Drying Activity' : 'New Processing Activity';

  return (
    <FormProvider {...form}>
      <Slideover
        onClose={() => onClose()}
        onSave={form.handleSubmit(handleSubmit)}
        title={t(mainTitle)}
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
              name="processing_unit_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">
                    {t('Processing Unit')}
                  </FormLabel>
                  <FormControl>
                    {processingTypes && (
                      <Dropdown
                        items={processingUnits.map((unit) => ({
                          value: unit.id?.toString(),
                          label: unit.name,
                        }))}
                        value={field.value?.toString()}
                        onChange={(value) =>
                          form.setValue('processing_unit_id', value)
                        }
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="processing_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">
                    {t('Processing Type')}
                  </FormLabel>
                  <FormControl>
                    {processingTypes && (
                      <Dropdown
                        disabled={!!type}
                        items={processingTypes.map((type) => ({
                          value: type.name.toString(),
                          label: ta(type, 'name', i18n.language),
                        }))}
                        value={field.value?.toString()}
                        onChange={(value) =>
                          form.setValue('processing_type', value)
                        }
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {type !== ProcessingType.DRYING && (
              <FormField
                control={form.control}
                name="processing_method_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full">
                      {t('Processing Method')}
                    </FormLabel>
                    <FormControl>
                      {processingMethods && (
                        <Dropdown
                          items={processingMethods.map((method) => ({
                            value: method.id.toString(),
                            label: ta(method, 'name', i18n.language),
                          }))}
                          value={field.value?.toString()}
                          onChange={(value) =>
                            form.setValue('processing_method_id', value)
                          }
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {type === ProcessingType.DRYING && (
              <FormField
                control={form.control}
                name="drier_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full">
                      {t('Drier Number')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        value={field.value || undefined}
                        onChange={(event) => {
                          form.setValue('drier_number', event.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {type === ProcessingType.DRYING && (
              <FormField
                control={form.control}
                name="drying_start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full">
                      {t('Drying Start Date')}
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value || undefined}
                        onChange={(value) =>
                          form.setValue('drying_start_date', value as Date)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {type === ProcessingType.DRYING && (
              <FormField
                control={form.control}
                name="drying_end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full">
                      {t('Drying End Date')}
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value || undefined}
                        onChange={(value) =>
                          form.setValue('drying_end_date', value as Date)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {type === ProcessingType.DRYING && (
              <FormField
                control={form.control}
                name="drier_start_hour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full">
                      {t('Drier Start Time')}
                    </FormLabel>
                    <FormControl>
                      <div className={cn('flex items-center gap-x-1')}>
                        <span className={cn('font-bold text-xs')}>
                          {t('At Hour')}
                        </span>
                        <Input
                          type="number"
                          value={field.value || undefined}
                          min="0"
                          onChange={(event) => {
                            form.setValue(
                              'drier_start_hour',
                              +event.target.value,
                            );
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {type === ProcessingType.DRYING && (
              <FormField
                control={form.control}
                name="drier_end_hour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full">
                      {t('Drier End Time')}
                    </FormLabel>
                    <FormControl>
                      <div className={cn('flex items-center gap-x-1')}>
                        <span className={cn('font-bold text-xs')}>
                          {t('At Hour')}
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={field.value || undefined}
                          onChange={(event) => {
                            form.setValue(
                              'drier_end_hour',
                              +event.target.value,
                            );
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {type === ProcessingType.DRYING && (
              <FormField
                control={form.control}
                name="drier_temp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full">
                      {t('Drier Temperature')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value || undefined}
                        onChange={(event) => {
                          form.setValue('drier_temp', +event.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-start">
              <span className="flex items-center bg-white pr-3 text-base font-semibold leading-6 text-gray-900">
                <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                {t(title)}
              </span>
            </div>
          </div>

          <ProcessingEntryForm
            item={item}
            type={type}
            admissionEntry={admissionEntry}
            setItem={setItem}
            setAdmissionEntry={setAdmissionEntry}
            entry={entry}
            inventoryItems={inventoryItems.data || []}
            onSubmit={handleProcessingActivityEntry}
          />

          <div className={cn('flex gap-1')}>
            <FormField
              control={form.control}
              name="lot_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Lot Code')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-end">
              <Button
                onClick={handleGenerateLotCode}
                type="button"
                disabled={disabled}
              >
                {t('Generate')}
              </Button>
            </div>
          </div>

          <div className="my-6">
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

          <ProcessingActivityEntryList
            entries={processingActivityEntries}
            onEdit={(entry) => setEntry(entry)}
            crops={crops}
          />
        </Form>
      </Slideover>
    </FormProvider>
  );
}

export default ProcessingActivityForm;

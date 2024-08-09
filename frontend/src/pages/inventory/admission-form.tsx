/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { getInventoryItem, updateInventoryItem } from '@/api/inventory';
import { Admission, AdmissionEntryView } from '@/api/types/admission';
import { TabularDropdown } from '@/components/ui/tabular-dropdown';
import { formatDate } from '@/utils/formatDate';
import {
  getAdmissionDisplayName,
  getAdmissionEntryDisplayName,
  getAdmissionSubject,
  getArea,
} from '@/utils/admission-utils';
import { getAdmission } from '@/api/admission';
import { useEffect, useMemo, useState } from 'react';
import { ta } from '@/utils/localized_attribute';
import { DatePicker } from '@/components/datepicker';
import ResourceInput from '../farm_activities/resource-input';
import { useQuery } from 'react-query';
import { ResourceType } from '@/api/types/user';
import { getResources } from '@/api/members';
import { Textarea } from '@/components/ui/textarea';
import { Dropdown } from '@/components/dropdown';
import { AllowedInventoryItemType } from './admission';

interface Props {
  onClose: (arg?: boolean) => void;
  item: InventoryItem | null;
  admissions: Admission[];
  locations: InventoryLocation[];
  type: AllowedInventoryItemType;
}

export const schema = z.object({
  admission_id: z.coerce.number(),
  admission_entry_id: z.coerce.number(),
  package_type: z.string(),
  date: z.coerce.date(),
  inventory_location_id: z.coerce.number(),
  crop_id: z.coerce.number(),
  part_of_crop_id: z.coerce.number(),
  person: z.object({ id: z.string(), name: z.string() }),
  notes: z.string().nullish(),
  quantity: z.coerce.number(),
});

const getPersons = async () => getResources(ResourceType.PERSON);

function AdmissionInventoryForm({
  item,
  admissions,
  locations,
  type,
  onClose,
}: Props) {
  const initialValues = item || {};
  const [admission, setAdmission] = useState<Admission | null>(null);
  const [admissionEntry, setAdmissionEntry] =
    useState<AdmissionEntryView | null>(null);
  const persons = useQuery('persons', getPersons);

  useEffect(() => {
    if (item) {
      getInventoryItem(item.id).then((response) => {
        form.reset({
          ...(response as any),
          package_type: response.packageType,
          date: new Date(response.date),
        });
      });
    }
  }, []);
  const admissionEntries = useMemo(
    () => (admission?.entries || []) as AdmissionEntryView[],
    [admission],
  );

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const { t, i18n } = useTranslation();

  async function handleSubmit(values: z.infer<typeof schema>) {
    if (item) {
      updateInventoryItem(item.id, {
        ...values,
        type: type,
        package_type: values.package_type as PackageType,
      }).then(() => onClose(true));
    }
  }

  async function onAdmissionChange(admission_id: number) {
    getAdmission(admission_id).then((admission) => {
      setAdmission(admission.data);
    });
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
              name="admission_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Admission no.')}</FormLabel>
                  <FormControl>
                    {admissions && (
                      <TabularDropdown
                        columns={[
                          { key: 'date', displayName: t('Date') },
                          {
                            key: 'admission_no',
                            displayName: t('Admission no.'),
                          },
                          {
                            key: 'subject',
                            displayName: t('Subject'),
                          },
                          {
                            key: 'area',
                            displayName: t('Zone / Parcel'),
                          },
                        ]}
                        items={admissions.map((admission) => ({
                          id: admission.id.toString(),
                          date: formatDate(new Date(admission.date)),
                          admission_no: admission.admission_no,
                          subject: getAdmissionSubject(admission),
                          area: getArea(admission),
                          displayName: getAdmissionDisplayName(admission, t),
                        }))}
                        value={field.value?.toString()}
                        onChange={(value) => {
                          form.setValue('admission_id', +value);
                          onAdmissionChange(+value);
                        }}
                        disabled
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-11')}>
            <FormField
              control={form.control}
              name="admission_entry_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Crop')}</FormLabel>
                  <FormControl>
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
                          key: 'quantity',
                          displayName: t('Quantity'),
                        },
                      ]}
                      items={admissionEntries.map((entry) => ({
                        id: entry.id!.toString(),
                        crop: ta(entry.crop, 'name', i18n.language),
                        partOfCrop: entry.partOfCrop
                          ? ta(entry.partOfCrop, 'name', i18n.language)
                          : '',
                        quantity: entry.net_quantity?.toString(),
                        displayName: getAdmissionEntryDisplayName(
                          entry,
                          i18n.language,
                        ),
                      }))}
                      value={field.value?.toString()}
                      onChange={(value) => {
                        form.setValue('admission_entry_id', +value);
                        const entry =
                          admissionEntries.find(
                            (entry) => entry.id === +value,
                          ) || null;

                        if (entry) {
                          form.setValue('quantity', entry.net_quantity);
                          form.setValue('crop_id', entry.crop.id);

                          form.setValue('part_of_crop_id', entry.partOfCrop.id);
                        }

                        console.log('entry', entry);
                        setAdmissionEntry(entry);
                      }}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    value={formatDate(admission?.date)}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
            {type === InventoryItemType.HARVESTED_PRODUCT && (
              <>
                <FormItem>
                  <FormLabel className="w-full">{t('Land Parcel')}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      value={admission?.landParcel?.location || ''}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
            {type === InventoryItemType.COLLECTED_PRODUCT && (
              <>
                <FormItem>
                  <FormLabel className="w-full">{t('Zone')}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      value={admission?.zone?.name || ''}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
            <>
              <FormItem>
                <FormLabel className="w-full">{t('Crop State')}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    value={t(admissionEntry?.cropState || '')}
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
                    value={t(admissionEntry?.cropStatus || '')}
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

export default AdmissionInventoryForm;

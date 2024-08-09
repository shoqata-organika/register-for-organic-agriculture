import { useState } from 'react';
import * as z from 'zod';
import groupBy from 'lodash.groupby';
import { zodResolver } from '@hookform/resolvers/zod';
import { DownloadIcon } from 'lucide-react';
import { Form, FormProvider, useForm } from 'react-hook-form';
import { YearPicker } from '@/components/yearpicker';
import { useTranslation } from 'react-i18next';
import { Dropdown } from '@/components/dropdown';
import Slideover from '@/components/ui/slide-over';
import MapComponent from '@/components/Map';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/utils';
import { Input } from '@/components/ui/input';
import strToDate from '@/utils/strToDate';
import {
  LandParcel,
  LandParcelCrop,
  LandParcelView,
  SubParcel,
} from '@/api/types/land_parcel';
import { createLandParcel, updateLandParcel } from '@/api/land_parcel';
import { Code } from '@/api/types/code_category';
import { Geolocation } from '../../interface';
import { geoSuperRefinement } from '@/utils';
import Parcelization from './parcelization';
import CropTurnover from './crop-turnover';
import { v4 as uuid4 } from 'uuid';
import Tabs from '@/components/ui/tabs';

interface Props {
  onClose: (arg?: boolean) => void;
  landParcel: LandParcelView | null;
  crops: Array<Code>;
}

export const schema = z
  .object({
    location: z.string().min(1),
    code: z.string().min(1),
    contract_start_date: z.coerce.date().or(z.string()).nullish(),
    contract_end_date: z.coerce.date().or(z.string()).nullish(),
    cadastral_no: z.string().optional().nullish(),
    buffer_zone: z.coerce.number().nullish(),
    ownership_status: z.enum(['owned', 'rented'], {
      required_error: 'Should define ownership status',
    }),
    total_area: z.coerce.number().positive().min(0.1),
    utilised_area: z.coerce.number().positive().min(0.1),
    organic_transition_date: z.coerce.date().or(z.string()).nullish(),
    applied_standards: z.string().nullish(),
    crops: z.any(),
    latitude: z.coerce.number().superRefine(geoSuperRefinement).nullish(),
    longitude: z.coerce.number().superRefine(geoSuperRefinement).nullish(),
    file: z
      .instanceof(File)
      .or(z.string())
      .nullish()
      .superRefine((value, context) => {
        if (value instanceof File && value.size > 3145728) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Document size cannot be bigger than 3mb',
          });
        }

        const validFileTypes = ['png', 'jpg', 'jpeg', 'pdf'];

        if (
          value instanceof File &&
          !validFileTypes.includes(value.type.split('/')[1].trim())
        ) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Document should be of type jpg, png, jpeg, pdf',
          });
        }
      }),
  })
  .transform((data: any) => {
    Object.keys(data).forEach((key: any) => {
      if (data[key] === null) {
        data[key] = undefined;
      }
    });

    strToDate(data, [
      'organic_transition_date',
      'contract_end_date',
      'contract_start_date',
    ]);

    return data;
  })
  .superRefine((values, context) => {
    if (values.utilised_area > values.total_area) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Utilised Area cannot be higher than Total Area',
        path: ['utilised_area'],
      });
    }
  });

const validateParcelization = (
  landParcel: LandParcel,
  subParcels: SubParcel[],
  crops: LandParcelCrop[],
) => {
  if (crops.some((crop) => !crop.sub_parcel_id)) {
    return 'Please select a sub parcel for all crops';
  }

  if (subParcels.some((sp) => sp.area === 0)) {
    return 'Sub parcels area cannot be 0';
  }

  if (
    subParcels.map((sp) => sp.area).reduce((a, b) => a + b, 0) >
    landParcel.utilised_area
  ) {
    return 'Sub parcels area cannot be higher than Utilised Area';
  }

  const groups = groupBy(crops, (crop: LandParcelCrop) => [
    crop.year,
    crop.sub_parcel_id,
    crop.order,
  ]);

  if (Object.values(groups).find((val) => val.length > 1)) {
    return 'Crops should be unique by year, sub parcel and order';
  }

  return null;
};

function LandParcelsForm({ landParcel, onClose, crops }: Props) {
  const { t } = useTranslation();
  const initVal = landParcel ? schema.parse(landParcel) : {};
  const [validationStatus, setValidationStatus] = useState<string | null>(null);

  const [currentTab, setCurrentTab] = useState<
    'map' | 'parcelization' | 'crop_turnover'
  >('map');

  const tabs = ['map', 'parcelization', 'crop_turnover'];

  const [parcelCrops, setParcelCrops] = useState<LandParcelCrop[]>(
    landParcel ? landParcel.crops.sort((a, b) => a.order - b.order) : [],
  );

  const [subParcels, setSubParcels] = useState<SubParcel[]>(
    landParcel ? landParcel.subParcels : [{ id: uuid4(), code: '1', area: 0 }],
  );

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initVal,
  });

  async function handleSubmit(values: z.infer<typeof schema>) {
    const valStatus = validateParcelization(
      values,
      subParcels.filter((sp) => !sp._delete),
      parcelCrops.filter((sp) => !sp._delete),
    );
    setValidationStatus(valStatus);

    if (valStatus !== null) {
      return;
    }

    try {
      if (!landParcel) {
        createLandParcel({
          ...values,
          subParcels: subParcels,
          crops: parcelCrops.filter((x) => !x._delete),
        }).then(() => onClose(true));
      } else {
        if (
          form.getValues('ownership_status') === 'owned' &&
          (form.getValues('contract_start_date') ||
            form.getValues('contract_end_date'))
        ) {
          values = {
            ...values,
            contract_start_date: undefined,
            contract_end_date: undefined,
          };
        }

        updateLandParcel(landParcel.id, {
          ...values,
          id: landParcel.id,
          subParcels: subParcels,
          file: typeof values.file === 'string' ? undefined : values.file,
          crops: parcelCrops
            .map((crop) => {
              return {
                ...crop,
                land_parcel_id: landParcel.id,
              };
            })
            .filter((x) => x._delete !== true),
        }).then(() => onClose(true));
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        form.setError('code', { message: err.response?.data?.message });
      }
    }
  }

  function handleParcelMapSelection(location: Geolocation) {
    form.setValue('latitude', location.latitude);
    form.setValue('longitude', location.longitude);
  }

  const title = landParcel ? 'Edit Land Parcel' : 'New Land Parcel';

  const ownership_status = form.watch('ownership_status');

  const shouldDisable =
    !form.getValues('ownership_status') || ownership_status === 'owned';

  const handleParcelization = (sp: SubParcel[]) => {
    const deletedIds = sp.filter((x) => x._delete === true).map((sp) => sp.id);

    if (sp.some((x) => x._delete === true)) {
      setSubParcels((prev) =>
        prev.filter((subP) => !deletedIds.includes(subP.id)),
      );

      setParcelCrops(
        parcelCrops
          .filter((pc) => pc.sub_parcel_id)
          .map((pc) => ({
            ...pc,
            sub_parcel_id: deletedIds.includes(pc.sub_parcel_id!)
              ? undefined
              : pc.sub_parcel_id,
          })),
      );

      return;
    }

    setSubParcels(sp);
  };

  const hasFile = landParcel?.file && typeof landParcel.file === 'string';

  return (
    <FormProvider {...form}>
      <Slideover
        onClose={() => onClose()}
        onSave={form.handleSubmit(handleSubmit)}
        title={t(title)}
      >
        <Form className="space-y-8">
          <div
            className={cn(
              'grid grid-cols-2 md:grid-cols-3 gap-x-11 gap-y-8 mb-2',
            )}
          >
            <FormField
              control={form.control}
              name="ownership_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">
                    {t('Ownership Status')}
                  </FormLabel>
                  <Dropdown
                    items={[
                      { value: 'owned', label: t('Owned') },
                      { value: 'rented', label: t('Rented') },
                    ]}
                    value={field.value}
                    onChange={(value) =>
                      form.setValue(
                        'ownership_status',
                        value as 'owned' | 'rented',
                      )
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contract_start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`w-full ${shouldDisable ? 'disabled-clr' : ''}`}
                  >
                    {t('Contract Start Date')}
                  </FormLabel>
                  <FormControl>
                    <YearPicker
                      disabled={shouldDisable}
                      date={field.value}
                      onChange={(value) => {
                        form.setValue('contract_start_date', value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contract_end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`w-full ${shouldDisable ? 'disabled-clr' : ''}`}
                  >
                    {t('Contract End Date')}
                  </FormLabel>
                  <FormControl>
                    <YearPicker
                      disabled={shouldDisable}
                      date={field.value}
                      onChange={(value) => {
                        form.setValue('contract_end_date', value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Code')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cadastral_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">
                    {t('Cadastral Number')}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Location')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={cn('grid grid-cols-2 gap-x-11 gap-y-8 mb-2')}>
            <FormField
              control={form.control}
              name="organic_transition_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Organic Transition Date')}</FormLabel>
                  <FormControl>
                    <YearPicker
                      date={field.value}
                      onChange={(value) => {
                        form.setValue('organic_transition_date', value as Date);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="applied_standards"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">
                    {t('Applied Standards')}
                  </FormLabel>
                  <FormControl>
                    <Input type="string" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="total_area"
              defaultValue={0}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Total Area')}</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="utilised_area"
              defaultValue={0}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Utilised Area')}</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="buffer_zone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Buffer Zone')}</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {validationStatus && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {t(validationStatus)}
            </div>
          )}

          <Tabs
            tabs={tabs.map((tab) => ({ id: tab, name: t(tab) }))}
            currentTab={{ id: currentTab, name: currentTab }}
            onChange={(tab) => setCurrentTab(tab.id as any)}
          />

          {currentTab === 'map' && (
            <>
              <div className={cn('grid grid-cols-2 gap-x-11 gap-y-8 mb-2')}>
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="file"
                    defaultValue={undefined}
                    render={() => (
                      <FormItem>
                        <FormLabel className="w-full">
                          {t(
                            hasFile
                              ? 'Edit Map Document'
                              : 'Upload Map Document',
                          )}
                        </FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              type="file"
                              onChange={(event) => {
                                const file = event.target.files
                                  ? event.target.files[0]
                                  : undefined;

                                form.setValue('file', file);
                              }}
                            />

                            <a
                              className={`flex gap-2 cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${hasFile ? '' : 'disabled-btn'}`}
                              href={
                                (hasFile && landParcel.file) as
                                  | string
                                  | undefined
                              }
                              download={t('Map Document')}
                              type="application/octet-stream"
                            >
                              <span>
                                {t(
                                  hasFile
                                    ? 'Open Document'
                                    : 'No Document Available',
                                )}
                              </span>
                              <DownloadIcon className="h-5 w-5" />
                            </a>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className={cn('grid grid-cols-2 gap-x-11 gap-y-8 mb-2')}>
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="w-full">{t('Latitude')}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value || undefined}
                          onChange={(event) =>
                            form.setValue('latitude', +event.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="w-full">{t('Longitude')}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value || undefined}
                          onChange={(event) =>
                            form.setValue('longitude', +event.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <MapComponent
                callback={handleParcelMapSelection}
                item={landParcel}
                location={
                  form.getValues('latitude') && form.getValues('longitude')
                    ? [
                        +form.getValues('latitude')!,
                        +form.getValues('longitude')!,
                      ]
                    : [0, 0]
                }
              />
            </>
          )}
          {currentTab === 'parcelization' && (
            <Parcelization
              subParcels={subParcels}
              onChange={(value) => handleParcelization(value)}
            />
          )}
          {currentTab === 'crop_turnover' && (
            <CropTurnover
              subParcels={subParcels}
              crops={crops}
              parcelCrops={parcelCrops}
              onChange={(newParcelCrops) => {
                setParcelCrops(newParcelCrops);
              }}
            />
          )}
        </Form>
      </Slideover>
    </FormProvider>
  );
}

export default LandParcelsForm;

import { useMemo, useState, useEffect } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Slideover from '@/components/ui/slide-over';
import {
  FarmActivity,
  FarmActivityType,
  FarmActivityView,
} from '@/api/types/farm_activity';
import { Code } from '@/api/types/code_category';
import { LandParcelView } from '@/api/types/land_parcel';
import { farmFromViewToInitType } from '@/utils/activity-type-converter';
import { createFarmActivity, editFarmActivity } from '@/api/farm_activities';
import { FilterTypes } from './index';
import { cn } from '@/utils';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { DatePicker } from '@/components/datepicker';
import { Dropdown } from '@/components/dropdown';
import SoilAnalysisForm, { soilAnalysisSchema } from './soil-analysis.form';
import { Textarea } from '@/components/ui/textarea';
import LandPloughingForm, { landPloughingSchema } from './land-ploughing.form';
import CostForm from './cost.form';
import FertilizationForm, { fertilizationSchema } from './fertilization.form';
import SeedPlantingForm, { seedPlantingSchema } from './seed-planting.form';
import CropProtectionForm, {
  cropProtectionSchema,
} from './crop-protection.form';
import GrazingManagementForm, {
  grazingManagementSchema,
} from './grazing-management.form';
import IrrigationForm, { irrigationSchema } from './irrigation.form';
import HarvestingForm, { harvestingSchema } from './harvesting.form';
import { useQuery } from 'react-query';
import { getCrops } from '@/api/land_parcel';

interface Props {
  landParcels: Array<LandParcelView>;
  filter?: FilterTypes;
  cropDiseases: Array<Code>;
  activity: FarmActivityView | null;
  onClose: (arg?: boolean) => void;
}

const validFileTypes = ['docx', 'xlsx', 'pptx', 'pdf', 'jpeg'];

export const baseSchema = {
  date: z.coerce.date(),
  land_parcel_id: z.coerce.number().min(1, 'Parcel is required'),
  time_spent: z.coerce.number().nullish(),
  activity_type: z.string(),
  crop_id: z.coerce.number().nullish(),
  quantity: z.coerce.number().nullish(),
  cost: z.coerce.number().nullish(),
  comments: z.string().nullish(),
  details: z.object({}).nullish(),
  file: z
    .instanceof(File)
    .or(z.string())
    .nullish()
    .superRefine((value, context) => {
      if (value instanceof File && value.size > 5242880) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'File size cannot be bigger than 5mb',
        });
      }

      if (
        value instanceof File &&
        !validFileTypes.includes(value.type.split('/')[1])
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Documents are only accepted as pdf, word and jpeg files',
        });
      }
    }),
};

const getSchema = (activityType: FarmActivityType | null) => {
  if (activityType === FarmActivityType.SOIL_ANALYSIS) {
    return z.object({
      ...baseSchema,
      details: soilAnalysisSchema,
    });
  } else if (activityType === FarmActivityType.LAND_PLOUGHING) {
    return z.object({
      ...baseSchema,
      details: landPloughingSchema,
    });
  } else if (activityType === FarmActivityType.FERTILIZATION) {
    return z.object({
      ...baseSchema,
      details: fertilizationSchema,
    });
  } else if (activityType === FarmActivityType.SEED_PLANTING) {
    return z.object({
      ...baseSchema,
      crop_id: z.coerce.number().min(1, 'Crop is required'),
      details: seedPlantingSchema,
    });
  } else if (activityType === FarmActivityType.CROP_PROTECTION) {
    return z.object({
      ...baseSchema,
      crop_id: z.coerce.number().min(1, 'Crop is required'),
      details: cropProtectionSchema,
    });
  } else if (activityType === FarmActivityType.GRAZING_MANAGEMENT) {
    return z.object({
      ...baseSchema,
      details: grazingManagementSchema,
    });
  } else if (activityType === FarmActivityType.IRRIGATION) {
    return z.object({
      ...baseSchema,
      details: irrigationSchema,
    });
  } else if (activityType === FarmActivityType.HARVESTING) {
    return z.object({
      ...baseSchema,
      crop_id: z.coerce.number().min(1, 'Crop is required'),
      cropState: z.string(),
      part_of_crop_id: z.coerce.number().min(1, 'Part of crop is required'),
      details: harvestingSchema,
    });
  }

  return z.object(baseSchema);
};

function FarmActivityForm({
  landParcels,
  cropDiseases,
  activity,
  filter,
  onClose,
}: Props) {
  const [farmActivity] = useState<FarmActivity | null>(
    farmFromViewToInitType(activity),
  );
  const [activityType, setActivityType] = useState<FarmActivityType | null>(
    activity?.activity_type
      ? (activity.activity_type as FarmActivityType)
      : null,
  );

  const schema = useMemo(() => getSchema(activityType), [activityType]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: farmActivity ? farmActivity : {},
  });

  const landParcelId = form.watch('land_parcel_id');

  const crops = useQuery<Code[]>({
    queryKey: ['crops', landParcelId],
    queryFn: () => (landParcelId ? getCrops(landParcelId) : []),
  });

  useEffect(() => {
    if (
      !activity &&
      filter &&
      filter !== 'all_items' &&
      filter !== 'land_preparation'
    ) {
      form.setValue('activity_type', filter);
      setActivityType(filter);
    }
  }, []);

  const { t } = useTranslation();

  async function onSubmit(values: any) {
    const date = form.getValues('date').toISOString();

    if (!farmActivity?.id) {
      await createFarmActivity({
        ...values,
        date,
      })
        .then(() => onClose(true))
        .catch((error) => console.error(error));
    } else {
      if (!activity) return;
      editFarmActivity(activity.id, {
        ...values,
        date,
        file: typeof values.file === 'string' ? undefined : values.file,
      })
        .then(() => onClose(true))
        .catch((error: Error) => console.log(error));
    }
  }

  form.watch('details');

  const hasFile = activity?.file && typeof activity.file === 'string';

  return (
    <FormProvider {...form}>
      <Slideover
        onClose={() => onClose()}
        onSave={form.handleSubmit(onSubmit)}
        title={t('New Farm Activity')}
      >
        <form className="space-y-8">
          <Form {...form}>
            <div
              className={cn(
                'grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-11 mb-5',
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
                        onChange={(value) =>
                          form.setValue('date', value as Date)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="land_parcel_id"
                defaultValue={0}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full">{t('Land Parcel')}</FormLabel>
                    <FormControl>
                      {landParcels && (
                        <Dropdown
                          items={landParcels.map((parcel) => ({
                            value: parcel.id.toString(),
                            label: parcel.code,
                          }))}
                          value={field.value?.toString()}
                          onChange={(value) =>
                            form.setValue('land_parcel_id', +value)
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
                name="activity_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full">
                      {t('Activity Category')}
                    </FormLabel>
                    <FormControl>
                      <Dropdown
                        items={Object.values(FarmActivityType).map((type) => ({
                          value: type.toString(),
                          label: t(type.toString()),
                        }))}
                        disabled={filter !== 'all_items' || !!activity}
                        value={field.value?.toString()}
                        onChange={(value) => {
                          form.setValue('details', {});
                          form.setValue('quantity', 0);
                          form.setValue('cost', 0);
                          form.setValue('activity_type', value);
                          setActivityType(value as FarmActivityType);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {activityType === FarmActivityType.SOIL_ANALYSIS && (
              <SoilAnalysisForm hasFile={hasFile} file={activity?.file} />
            )}
            {activityType === FarmActivityType.LAND_PLOUGHING && (
              <LandPloughingForm />
            )}
            {activityType === FarmActivityType.MILLING && <CostForm />}
            {activityType === FarmActivityType.BED_PREPARATION && <CostForm />}
            {activityType === FarmActivityType.FERTILIZATION && (
              <FertilizationForm />
            )}
            {activityType === FarmActivityType.SEED_PLANTING && (
              <SeedPlantingForm
                crops={crops.data || []}
                landParcel={landParcels.find((pc) => pc.id === landParcelId)}
              />
            )}

            {activityType === FarmActivityType.CROP_PROTECTION && (
              <CropProtectionForm
                crops={crops.data || []}
                cropDiseases={cropDiseases}
              />
            )}
            {activityType === FarmActivityType.GRAZING_MANAGEMENT && (
              <GrazingManagementForm />
            )}
            {activityType === FarmActivityType.IRRIGATION && <IrrigationForm />}
            {activityType === FarmActivityType.HARVESTING && (
              <HarvestingForm
                crops={crops.data || []}
                landParcel={landParcels.find(
                  (parcel) =>
                    parcel.id === form.getValues('land_parcel_id') || null,
                )}
              />
            )}

            <div className="gap-4 gap-y-11">
              <FormField
                control={form.control}
                name="comments"
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full">{t('Comments')}</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value || undefined} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </form>
      </Slideover>
    </FormProvider>
  );
}

export default FarmActivityForm;

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
import { TabularDropdown } from '@/components/ui/tabular-dropdown';
import { Dropdown } from '@/components/dropdown';
import { ta } from '@/utils/localized_attribute';
import { Code } from '@/api/types/code_category';
import TimeSpent from './time-spent';
import { getResources } from '@/api/members';
import { ResourceType } from '@/api/types/user';
import { LandParcelView } from '@/api/types/land_parcel';
import { formatArea } from '@/utils/formatArea';
import { useQuery } from 'react-query';
import ResourceInput from './resource-input';

export const seedPlantingSchema = z.object({
  material_type: z.enum(['seed', 'seedling', 'cutting', 'root']),
  material_origin: z.enum(['own', 'purchased']),
  type: z.enum(['mechanical', 'manual']),
  status: z.enum(['organic', 'conventional', 'untreated_conventional']),
  remaining_quantity: z.coerce.number(),
  fuel_used: z.coerce.number(),
  persons: z.coerce.number(),
  distance: z.coerce.string(),
  devices: z.array(z.object({ id: z.string(), name: z.string() })).nullish(),
});

const getDevices = async () => getResources(ResourceType.SEED_PLANTING_MACHINE);
const _currentYear = new Date().getFullYear();

interface Props {
  crops: Code[];
  landParcel?: LandParcelView;
}

function SeedPlantingForm({ landParcel }: Props) {
  const form = useFormContext();
  const devices = useQuery('seedPlantingDevices', getDevices);

  const { t, i18n } = useTranslation();

  const type = form.watch('details.type');

  const subParcelCrops =
    landParcel?.crops
      .filter((cp) => cp.year === _currentYear)
      .map((cp) => ({
        ...cp,
        subParcel: landParcel?.subParcels.find(
          (sp) => sp.id === cp.sub_parcel_id,
        ),
      })) || [];

  return (
    <div className={cn('grid gap-y-5 pt-3 pb-3')}>
      <div className={cn('grid grid-cols-1 gap-4 gap-y-11')}>
        <FormField
          control={form.control}
          name="crop_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">
                {t('Sub Parcel and Crop')}
              </FormLabel>
              <FormControl>
                <TabularDropdown
                  columns={[
                    {
                      key: 'subparcel',
                      displayName: t('Sub Parcel'),
                    },
                    {
                      key: 'crop',
                      displayName: t('Crop'),
                    },
                    {
                      key: 'area',
                      displayName: t('Area'),
                    },
                  ]}
                  items={subParcelCrops.map((crop) => ({
                    id: crop.crop_id.toString(),
                    crop: ta(crop.crop, 'name', i18n.language),
                    subparcel: `${t('Code')} - ${crop.subParcel?.code}`,
                    area: formatArea(crop?.subParcel?.area || 0, 'hectare'),
                    displayName: `${t('Sub Parcel')} - ${crop.subParcel?.code} / ${t('Crop')} - ${ta(crop.crop, 'name', i18n.language)}`,
                  }))}
                  value={field.value?.toString()}
                  onChange={(value: any) => {
                    form.setValue('crop_id', +value);
                  }}
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
          name="details.material_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Material Type')}</FormLabel>
              <FormControl>
                <Dropdown
                  items={['seed', 'seedling', 'cutting', 'root'].map(
                    (type) => ({
                      value: type.toString(),
                      label: t(type.toString()),
                    }),
                  )}
                  value={field.value?.toString()}
                  onChange={(value) => {
                    form.setValue('details.material_type', value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="details.material_origin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Material Origin')}</FormLabel>
              <FormControl>
                <Dropdown
                  items={['own', 'purchased'].map((type) => ({
                    value: type.toString(),
                    label: t(type.toString()),
                  }))}
                  value={field.value?.toString()}
                  onChange={(value) => {
                    form.setValue('details.material_origin', value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="details.status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Status')}</FormLabel>
              <FormControl>
                <Dropdown
                  items={[
                    'organic',
                    'conventional',
                    'untreated_conventional',
                  ].map((type) => ({
                    value: type.toString(),
                    label: t(type.toString()),
                  }))}
                  value={field.value?.toString()}
                  onChange={(value) => {
                    form.setValue('details.status', value);
                  }}
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
          name="details.distance"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Distance')}</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
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
      </div>
      <div className={cn('grid grid-cols-1 gap-4 gap-y-11')}>
        <FormField
          control={form.control}
          name="details.type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Type')}</FormLabel>
              <FormControl>
                <Dropdown
                  items={['mechanical', 'manual'].map((type) => ({
                    value: type.toString(),
                    label: t(type.toString()),
                  }))}
                  value={field.value?.toString()}
                  onChange={(value) => {
                    form.setValue('details.type', value);
                    form.setValue('details.persons', 0);
                    form.setValue('time_spent', 0);
                    form.setValue('details.devices', []);
                    form.setValue('details.fuel_used', 0);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {type === 'manual' && (
        <div className={cn('grid grid-cols-2 gap-4 gap-y-11')}>
          <FormField
            control={form.control}
            name="time_spent"
            defaultValue={0}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-full">{t('Time Spent')}</FormLabel>
                <FormControl>
                  <TimeSpent
                    value={field.value}
                    onChange={(value) => {
                      form.setValue('time_spent', value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="persons"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-full">{t('Persons')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    {...field}
                    onChange={(val) => {
                      form.setValue('persons', +val.target.value);
                      form.setValue('details.persons', +val.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
      {type === 'mechanical' && (
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
      )}
    </div>
  );
}

export default SeedPlantingForm;

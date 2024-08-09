import * as z from 'zod';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TabularDropdown } from '@/components/ui/tabular-dropdown';
import { formatArea } from '@/utils/formatArea';
import { LandParcelView } from '@/api/types/land_parcel';
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
import TimeSpent from './time-spent';
import { getResources } from '@/api/members';
import { ResourceType } from '@/api/types/user';
import { useQuery } from 'react-query';
import ResourceInput from './resource-input';
import { useMemo } from 'react';
import { CropStates } from '@/api/types/common';

export const harvestingSchema = z.object({
  fuel_used: z.coerce.number().nullish(),
  devices: z.array(z.object({ id: z.string(), name: z.string() })).nullish(),
  persons: z.coerce.number().nullish(),
  type: z.enum(['mechanical', 'manual']),
  storage_unit: z.object({ id: z.string(), name: z.string() }).nullish(),
  packaging_type: z.coerce.string(),
});

const getStorageUnits = async () => getResources(ResourceType.STORAGE_UNIT);
const getDevices = async () => getResources(ResourceType.HARVESTING_MACHINE);

interface Props {
  crops: Code[];
  landParcel?: LandParcelView;
}

const _currentYear = new Date().getFullYear();

function HarvestingForm({ crops, landParcel }: Props) {
  const form = useFormContext();

  const cropId = form.watch('crop_id');

  const partsOfCrops = useMemo(() => {
    return crops.find((crop) => crop.id === cropId)?.subCodes || [];
  }, [cropId]);

  const storageUnits = useQuery('storageUnits', getStorageUnits);
  const devices = useQuery('harvestingDevices', getDevices);

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
    <div className={cn('grid gap-y-5 pt-5 pb-3')}>
      <div className={cn('grid grid-cols-2 gap-4 gap-y-5')}>
        <FormField
          control={form.control}
          name="crop_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Crop')}</FormLabel>
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
                    form.setValue('cropState', CropStates.Fresh);
                  }}
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
      </div>
      <div className={cn('grid grid-cols-1 gap-4 gap-y-5')}>
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
            defaultValue={0}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-full">{t('Persons')}</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
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
      <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-5')}>
        <FormField
          control={form.control}
          name="quantity"
          defaultValue={0}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">
                {t('Harvesting Quantity')}
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
          name="details.packaging_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">
                {t('Packaging Type / Transport Type')}
              </FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="details.storage_unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Storage Unit')}</FormLabel>
              <FormControl>
                <ResourceInput
                  onChange={(resources) => {
                    form.setValue(
                      'details.storage_unit',
                      resources[0] ? resources[0] : null,
                    );
                  }}
                  options={storageUnits.data || []}
                  selectedOptions={[field.value]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export default HarvestingForm;

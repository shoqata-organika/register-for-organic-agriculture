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
import TimeSpent from './time-spent';
import { getResources } from '@/api/members';
import { ResourceType } from '@/api/types/user';
import { useQuery } from 'react-query';
import ResourceInput from './resource-input';

export const grazingManagementSchema = z.object({
  fuel_used: z.coerce.number().optional(),
  devices: z.array(z.object({ id: z.string(), name: z.string() })).nullish(),
  persons: z.coerce.number().nullish(),
  type: z.enum(['mechanical', 'manual']),
});

const getDevices = async () => getResources(ResourceType.GRAZING_MACHINE);

function GrazingManagementForm() {
  const form = useFormContext();
  const devices = useQuery('grazingDevices', getDevices);

  const { t } = useTranslation();

  const type = form.watch('details.type');

  return (
    <div className={cn('grid gap-y-5 pt-3 pb-3')}>
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
            name="details.time_spent"
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
            name="details.persons"
            defaultValue={0}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-full">{t('Persons')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    {...field}
                    value={field.value || undefined}
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

export default GrazingManagementForm;

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
import { getResources } from '@/api/members';
import { ResourceType } from '@/api/types/user';
import { useQuery } from 'react-query';
import ResourceInput from './resource-input';

export const landPloughingSchema = z.object({
  depth: z.coerce.number().nullish(),
  devices: z.object({ id: z.string(), name: z.string() }).array().nullish(),
});

const getDevices = async () => getResources(ResourceType.PLOUGHING_MACHINE);

function LandPloughingForm() {
  const form = useFormContext();

  const devices = useQuery('ploughingDevices', getDevices);
  const { t } = useTranslation();

  return (
    <div className={cn('grid gap-y-5 pt-3 pb-3')}>
      <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-11')}>
        <FormField
          control={form.control}
          name="details.depth"
          defaultValue={0}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Depth')}</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className={cn('grid grid-cols-1 gap-4 gap-y-11')}>
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
      </div>
      <div className={cn('grid grid-cols-2 gap-4 gap-y-11')}>
        <FormField
          control={form.control}
          name="quantity"
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
        <FormField
          control={form.control}
          name="cost"
          defaultValue={0}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Cost')}</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export default LandPloughingForm;

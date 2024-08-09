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
import { DatePicker } from '@/components/datepicker';
import ResourceInput from '../farm_activities/resource-input';
import { useQuery } from 'react-query';
import { ResourceType } from '@/api/types/user';
import { getResources } from '@/api/members';
import { Textarea } from '@/components/ui/textarea';
import { Dropdown } from '@/components/dropdown';
import { CleaningActivity } from '@/api/types/cleaning_activity';
import { ProcessingUnitView } from '@/api/types/processing_unit';
import {
  createCleaningActivity,
  updateCleaningActivity,
} from '@/api/cleaning_activity';

interface Props {
  onClose: (arg?: boolean) => void;
  item: CleaningActivity | null;
  processingUnits: ProcessingUnitView[];
}

export const schema = z.object({
  date: z.coerce.date(),
  processing_unit_id: z.coerce.number().nullish().optional(),
  person: z.object({ id: z.string(), name: z.string() }),
  cleaned_device: z.coerce.string().nullish().optional(),
  reason_of_cleaning: z.coerce.string().nullish().optional(),
  area: z.string().nullish().optional(),
  notes: z.string().nullish().optional(),
  cleaning_tool: z.string().nullish().optional(),
});

const getPersons = async () => getResources(ResourceType.PERSON);

function CleaningActivitiesForm({ item, processingUnits, onClose }: Props) {
  const initialValues = item || {};

  const persons = useQuery('persons', getPersons);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const { t } = useTranslation();

  async function handleSubmit(values: z.infer<typeof schema>) {
    if (item) {
      updateCleaningActivity(item.id, values as any as CleaningActivity).then(
        () => onClose(true),
      );
    } else {
      createCleaningActivity(values as any as CleaningActivity).then(() =>
        onClose(true),
      );
    }
  }

  return (
    <FormProvider {...form}>
      <Slideover
        onClose={() => onClose()}
        onSave={form.handleSubmit(handleSubmit)}
        title={t('New Activity')}
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
              name="processing_unit_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">
                    {t('Processing Unit')}
                  </FormLabel>
                  <FormControl>
                    <Dropdown
                      items={processingUnits.map((location) => ({
                        value: location.id!.toString(),
                        label: location.name,
                      }))}
                      value={field.value?.toString()}
                      onChange={(value) =>
                        form.setValue('processing_unit_id', +value)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Cleaning Area')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field?.value || undefined} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cleaning_tool"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Cleaning Tool')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field?.value || undefined} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cleaned_device"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">
                    {t('Cleaned Device')}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} value={field?.value || undefined} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason_of_cleaning"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">
                    {t('Reason of Cleaning')}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} value={field?.value || undefined} />
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
                    <Textarea {...field} value={field?.value || undefined} />
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

export default CleaningActivitiesForm;

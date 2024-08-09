import { useEffect, useState, ChangeEvent } from 'react';
import { MemberView, LEGAL_STATUS } from '@/api/types/user';
import { len } from '@/utils/len';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { createMember, updateMember } from '@/api/members';
import { Button } from '@/components/ui/button';
import { Form, FormProvider, useForm } from 'react-hook-form';
import { Geolocation } from '../../interface';
import { fromMemberViewToInitType } from '@/utils/activity-type-converter';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/utils';
import { Input } from '@/components/ui/input';
import { Dropdown } from '@/components/dropdown';
import { geoSuperRefinement } from '@/utils';
import { isValidURL, isValidEmail } from '@/utils/validation';
import MapComponent from '@/components/Map';
import * as z from 'zod';

interface Props {
  onClose: (arg?: boolean) => void;
  member: MemberView | null;
}

const activities: Array<string> = [
  'Kultivimi i BMA-ve',
  'Grumbullim i PPJD-ve',
  'Perpunim',
  'Eksport',
];

const schema = z.object({
  code: z.string().nullish(),
  business_name: z.string().nullish(),
  business_no: z.string().nullish(),
  website_url: z
    .string()
    .superRefine((val, ctx) => {
      if (val && !isValidURL(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Url Link provided is not a valid one',
        });
      }
    })
    .nullish(),
  owner_first_name: z.string().nullish(),
  owner_last_name: z.string().nullish(),
  farmer_no: z.string().nullish(),
  latitude: z.number().superRefine(geoSuperRefinement).nullish(),
  longitude: z.number().superRefine(geoSuperRefinement).nullish(),
  applied_standards: z.string().nullish(),
  legal_status: z
    .enum([
      'physical_person',
      'individual_business',
      'llc',
      'agricultural_cooperative',
    ])
    .nullish(),
  activities: z.array(z.string()).nullish(),
  email: z
    .string()
    .superRefine((val, ctx) => {
      if (val && !isValidEmail(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email provided is not a valid one',
        });
      }
    })
    .nullish(),
});

function MemberForm({ member, onClose }: Props) {
  const [disabled, setDisabled] = useState<boolean>(false);
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    if (member) {
      form.reset(fromMemberViewToInitType(member));
    }
  }, [member]);

  useEffect(() => {
    if (len(form.formState.errors)) {
      setDisabled(false);
    }
  }, [form.formState.errors]);

  async function handleSubmit(values: z.infer<typeof schema>) {
    try {
      if (!member) {
        const response = await createMember(values);

        response && onClose(true);
      } else {
        const response = await updateMember(
          Object.assign(values, { id: member.id }),
        );

        if (response) {
          setDisabled(false);
          onClose(true);
        }
      }
    } catch (error: any) {
      console.error(error);
    }
  }

  function handleParcelMapSelection(location: Geolocation) {
    form.setValue('latitude', location.latitude);
    form.setValue('longitude', location.longitude);
  }

  function handleActivities(event: ChangeEvent<HTMLInputElement>) {
    const currentActivities = form.getValues('activities');

    if (currentActivities && currentActivities.includes(event.target.value)) {
      event.target.checked = false;

      form.setValue(
        'activities',
        currentActivities.filter((act) => act !== event.target.value),
      );

      return;
    }

    form.setValue('activities', [
      ...(form.getValues('activities') || []),
      event.target.value,
    ]);
  }

  return (
    <FormProvider {...form}>
      <Form>
        <div className="flex mb-8 flex-shrink-0 justify-end">
          <Button
            type="button"
            role="button"
            className={`${disabled ? 'disabled-btn' : ''} bg-primary`}
            onClick={() => {
              form.handleSubmit(handleSubmit)();

              setDisabled(true);
            }}
          >
            {t('Save Changes')}
          </Button>
        </div>

        <div className="bg-gray-200 rounded-md mb-8" style={{ height: 1 }} />

        <div
          className={cn(
            'grid grid-cols-2 gap-y-5 md:grid-cols-3 gap-x-12 mb-11',
          )}
        >
          <FormField
            control={form.control}
            name="business_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-full text-base text-gray-500">
                  {t('Business Name')}
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    value={field.value || undefined}
                    className="rounded-none border-t-0 border-l-0 border-r-0 border-gray-300"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="business_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-full text-base text-gray-500">
                  {t('Business Number')}
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    value={field.value || undefined}
                    className="rounded-none border-t-0 border-l-0 border-r-0 border-gray-300"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="legal_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-full text-base text-gray-600">
                  {t('Legal Status')}
                </FormLabel>
                <FormControl>
                  <Dropdown
                    items={[
                      {
                        value: 'individual_business',
                        label: t('Individual Business'),
                      },
                      { value: 'llc', label: t('LLC') },
                      {
                        value: 'agricultural_cooperative',
                        label: t('Agricultural Cooperative'),
                      },
                      {
                        value: 'physical_person',
                        label: t('Physical Person'),
                      },
                    ]}
                    value={field?.value || undefined}
                    onChange={(value) =>
                      form.setValue('legal_status', value as LEGAL_STATUS)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div
          className={cn(
            'grid grid-cols-2 md:grid-cols-3 gap-x-11 gap-y-8 mb-44 md:mb-28 h-40',
          )}
        >
          <div
            className={cn('flex flex-col justify-between md:col-span-2 gap-3')}
          >
            <div className={cn('grid md:grid-cols-2 gap-x-11 gap-y-5')}>
              <FormField
                control={form.control}
                name="owner_first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full text-base text-gray-500">
                      {t('Owner First Name')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        value={field.value || undefined}
                        className="rounded-none border-t-0 border-l-0 border-r-0 border-gray-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="owner_last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full text-base text-gray-500">
                      {t('Owner Last Name')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        value={field.value || undefined}
                        className="rounded-none border-t-0 border-l-0 border-r-0 border-gray-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="website_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full text-base text-gray-500">
                    {t('Website Url')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      value={field.value || undefined}
                      className="rounded-none border-t-0 border-l-0 border-r-0 border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full text-base text-gray-500">
                    {t('Email')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      value={field.value || undefined}
                      className="rounded-none border-t-0 border-l-0 border-r-0 border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="activities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full text-base text-gray-500 mb-4">
                    {t('Member Activities')}
                  </FormLabel>
                  <FormControl>
                    <div>
                      {activities.map((activity) => (
                        <div className="flex items-center gap-3 mb-3">
                          <input
                            id={activity}
                            type="checkbox"
                            checked={field.value?.includes(activity)}
                            value={activity}
                            onChange={handleActivities}
                          />
                          <label htmlFor={activity}>{t(activity)}</label>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div
          className={cn(
            'grid grid-cols-1 md:grid-cols-2 gap-x-11 gap-y-8 md:mb-4',
          )}
        >
          <FormField
            control={form.control}
            name="applied_standards"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-full text-base text-gray-500">
                  {t('Applied Standards')}
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    value={field.value || undefined}
                    className="rounded-none border-t-0 border-l-0 border-r-0 border-gray-300"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div
          className={cn(
            'grid grid-cols-1 md:grid-cols-2 gap-x-11 gap-y-8 mb-52 md:mb-4 h-80',
          )}
        >
          <div className={cn('flex gap-3 md:gap-0 flex-col justify-around')}>
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full text-base text-gray-500">
                    {t('Latitude')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value || undefined}
                      onChange={(event) =>
                        form.setValue('latitude', +event.target.value)
                      }
                      className="rounded-none border-t-0 border-l-0 border-r-0 border-gray-300"
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
                  <FormLabel className="w-full text-base text-gray-500">
                    {t('Longitude')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value || undefined}
                      onChange={(event) =>
                        form.setValue('longitude', +event.target.value)
                      }
                      className="rounded-none border-t-0 border-l-0 border-r-0 border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <MapComponent
            callback={handleParcelMapSelection}
            item={member}
            className="h-80"
            location={
              form.getValues('latitude') && form.getValues('longitude')
                ? [+form.getValues('latitude')!, +form.getValues('longitude')!]
                : [0, 0]
            }
          />
        </div>

        <div className={cn('md:w-6/12')}>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-full text-base text-gray-600">
                  {t('Code')}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || undefined}
                    className="rounded-none border-t-0 border-l-0 border-r-0 border-gray-300"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </FormProvider>
  );
}

export default MemberForm;

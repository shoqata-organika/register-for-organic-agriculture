import { useEffect, useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { LEGAL_STATUS } from '@/api/types/user';
import { len } from '@/utils/len';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Lock, ExternalLink } from 'lucide-react';
import { Form, FormProvider, useForm } from 'react-hook-form';
import { Geolocation } from '../../interface';
import { signup } from '@/api/user';
import Flags from '@/components/flags';
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

const activities: Array<string> = [
  'Kultivimi i BMA-ve',
  'Grumbullim i PPJD-ve',
  'Perpunim',
  'Eksport',
];

const schema = z
  .object({
    username: z.string().min(1, { message: 'Username is required' }),
    business_name: z.string().nullish(),
    business_no: z.string().nullish(),
    password: z.string().min(1, { message: 'Password is required' }),
    confirm_password: z
      .string()
      .min(1, { message: 'Confirmation of Password is required' }),
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
    farmer_no: z.string().nullish(),
    latitude: z.number().superRefine(geoSuperRefinement).nullish(),
    longitude: z.number().superRefine(geoSuperRefinement).nullish(),
    applied_standards: z.string().nullish(),
    policy: z.boolean({
      required_error: 'You must agree to our privacy policy',
    }),
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
  })
  .superRefine((val, ctx) => {
    if (val.confirm_password !== val.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please make sure your passwords match',
        path: ['confirm_password'],
      });
    }
  });

function Signup() {
  const [disabled, setDisabled] = useState<boolean>(false);
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    if (len(form.formState.errors)) {
      setDisabled(false);
    }
  }, [form.formState.errors]);

  async function handleSubmit(values: z.infer<typeof schema>) {
    try {
      const response = await signup(values);

      if (response) {
        setDisabled(false);
        setSubmitted(true);
      }
    } catch (error: any) {
      console.error(error);
      setDisabled(false);
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
    <>
      {submitted && (
        <div className="fixed w-full h-full bg-gray-700 z-[9999] flex flex-col justify-center items-center text-white">
          <h2 className="text-3xl">
            {t('Your request has been submitted successfully')}
          </h2>
          <p className="text-gray-300 mt-1">
            {t('Please wait until your request has been approved')}
          </p>
          <Button
            className="bg-green-600 mt-10 hover:bg-green-500"
            role="button"
            type="button"
            onClick={() => {
              navigate('/login');
            }}
          >
            {t('Sign in')}
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="w-full pt-6 pb-20">
        <div className="w-full shadow-xl md:w-4/6 mx-auto">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-20 w-auto"
              src={`${process.env.PUBLIC_URL}/logo.png`}
              alt="Your Company"
            />
          </div>

          <h1 className="text-black text-center text-3xl my-8">
            {t('Create Account')}
          </h1>

          <Flags />

          <div className="bg-gray-200 rounded-md mb-8" style={{ height: 1 }} />

          <FormProvider {...form}>
            <Form className="bg-white p-6 rounded">
              <div
                className={cn(
                  'grid grid-cols-1 gap-y-5 md:grid-cols-1 gap-x-12 mb-11',
                )}
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="w-full text-base text-gray-500">
                        {t('Username')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          value={field.value || undefined}
                          className="rounded border-gray-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          className="rounded border-gray-200"
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
                          className="rounded border-gray-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="w-full text-base text-gray-500">
                        {t('Password')}
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-3 w-full">
                          <Lock />
                          <Input
                            type="password"
                            {...field}
                            value={field.value || undefined}
                            className="rounded border-gray-200"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="w-full text-base text-gray-500">
                        {t('Confirm Password')}
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-3 w-full">
                          <Lock />
                          <Input
                            type="password"
                            {...field}
                            value={field.value || undefined}
                            className="rounded border-gray-200"
                          />
                        </div>
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
                  className={cn(
                    'flex flex-col justify-between md:col-span-2 gap-3',
                  )}
                >
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
                            className="rounded border-gray-200"
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
                            className="rounded border-gray-200"
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

              <div className={cn('grid grid-cols-1 gap-x-11 gap-y-8 mb-4')}>
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
                          className="rounded border-gray-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div
                className={cn('grid grid-cols-1 gap-x-11 gap-y-8 mb-8 md:mb-4')}
              >
                <div className={cn('flex gap-3 md:gap-0 justify-between')}>
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
                            className="rounded border-gray-200"
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
                            className="rounded border-gray-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <MapComponent
                  callback={handleParcelMapSelection}
                  item={null}
                  className="h-80"
                  location={
                    form.getValues('latitude') && form.getValues('longitude')
                      ? [
                          +form.getValues('latitude')!,
                          +form.getValues('longitude')!,
                        ]
                      : [0, 0]
                  }
                />
              </div>

              <div
                className="bg-gray-200 rounded-md mt-8"
                style={{ height: 1 }}
              />

              <div>
                <FormField
                  control={form.control}
                  name="policy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="w-full text-base text-gray-500 mt-4">
                        {t('Privacy Policy')}
                      </FormLabel>
                      <FormControl>
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <label htmlFor="policy">
                              {t('I agree with the privacy policy')}
                            </label>
                            <input
                              id="policy"
                              type="checkbox"
                              checked={!!field.value}
                              onChange={(event) => {
                                form.setValue('policy', event.target.checked);
                              }}
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <a
                  className="text-sm flex items-center gap-2 text-black text-gray-500"
                  target="_blank"
                  href="/policy"
                >
                  {t('Read Privacy Policy')}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="flex items-center justify-center mt-10">
                <Button
                  role="button"
                  type="button"
                  disabled={disabled}
                  className={cn('w-full bg-green-700 text-lg py-4')}
                  onClick={() => {
                    form.handleSubmit(handleSubmit)();
                    setDisabled(true);
                  }}
                >
                  {t('Sign up')}
                </Button>
              </div>
            </Form>
          </FormProvider>
        </div>
      </div>
    </>
  );
}

export default Signup;

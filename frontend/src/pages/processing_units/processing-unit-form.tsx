import * as z from 'zod';
import { ProcessingUnitView } from '@/api/types/processing_unit';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExternalLink } from 'lucide-react';
import { Dropdown } from '@/components/dropdown';
import { Geolocation } from '../../interface';
import { cn } from '@/utils';
import { DatePicker } from '@/components/datepicker';
import {
  createProcessingUnit,
  updateProcessingUnit,
} from '@/api/processing_units';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Form, FormProvider, useForm } from 'react-hook-form';
import Slideover from '@/components/ui/slide-over';
import { useTranslation } from 'react-i18next';
import MapComponent from '@/components/Map';
import { geoSuperRefinement } from '@/utils';
import strToDate from '@/utils/strToDate';

interface Props {
  processingUnit: ProcessingUnitView | null;
  onClose: (arg?: boolean) => void;
}

const schema = z
  .object({
    name: z.string().min(1),
    total_area: z.coerce.number().positive().min(1),
    ownership_status: z.enum(['owned', 'rented'], {
      required_error: 'Should define ownership status',
    }),
    contract_start_date: z.coerce.date().optional(),
    contract_end_date: z.coerce.date().optional(),
    latitude: z.coerce.number().superRefine(geoSuperRefinement).nullish(),
    longitude: z.coerce.number().superRefine(geoSuperRefinement).nullish(),
    address: z.coerce.string().nullish(),
    type_of_processing: z.coerce.string().min(1),
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

    strToDate(data, ['contract_end_date', 'contract_start_date']);

    return data;
  });

function ProcessingUnitForm({ processingUnit, onClose }: Props) {
  const initialValues = processingUnit ? schema.parse(processingUnit) : {};

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const { t } = useTranslation();

  function handleP_UnitMapSelection(location: Geolocation) {
    form.setValue('latitude', location.latitude);
    form.setValue('longitude', location.longitude);
  }

  async function handleSubmit(values: z.infer<typeof schema>) {
    try {
      if (!processingUnit) {
        createProcessingUnit(Object.assign(values, { id: null })).then(() =>
          onClose(true),
        );
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

        updateProcessingUnit(
          Object.assign(values, {
            id: processingUnit.id,
            file: typeof values.file === 'string' ? undefined : values.file,
          }),
        ).then(() => onClose(true));
      }
    } catch (err: any) {
      console.error(err);
    }
  }

  const ownership_status = form.watch('ownership_status');
  const hasFile =
    processingUnit?.file && typeof processingUnit.file === 'string';

  const shouldDisable =
    !form.getValues('ownership_status') || ownership_status === 'owned';

  return (
    <FormProvider {...form}>
      <Slideover
        onClose={() => onClose()}
        onSave={form.handleSubmit(handleSubmit)}
        title={t('New Processing Unit')}
      >
        <Form>
          <div
            className={cn(
              'grid grid-cols-2 md:grid-cols-3 gap-x-11 gap-y-11 mb-6',
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
                    <DatePicker
                      disabled={shouldDisable}
                      date={field.value}
                      onChange={(value) =>
                        form.setValue('contract_start_date', value as Date)
                      }
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
                    <DatePicker
                      disabled={shouldDisable}
                      date={field.value}
                      onChange={(value) =>
                        form.setValue('contract_end_date', value as Date)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Name')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="total_area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">
                    {t('Total Area (sqm)')}
                  </FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type_of_processing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">
                    {t('Type of Processing')}
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-3">
              <FormField
                control={form.control}
                name="file"
                defaultValue={undefined}
                render={() => (
                  <FormItem>
                    <FormLabel className="w-full">
                      {t(hasFile ? 'Edit Map Document' : 'Upload Map Document')}
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
                            (hasFile && processingUnit.file) as
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
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-3">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full">{t('Address')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || undefined}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className={cn('grid grid-cols-2 gap-4 gap-y-11 mb-6')}>
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
            callback={handleP_UnitMapSelection}
            item={processingUnit}
            location={
              form.getValues('latitude') && form.getValues('longitude')
                ? [+form.getValues('latitude')!, +form.getValues('longitude')!]
                : [0, 0]
            }
          />
        </Form>
      </Slideover>
    </FormProvider>
  );
}

export default ProcessingUnitForm;

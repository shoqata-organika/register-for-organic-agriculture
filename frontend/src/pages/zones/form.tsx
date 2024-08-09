import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormProvider, useForm } from 'react-hook-form';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Geolocation } from '../../interface';
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
import { Zone } from '@/api/types/zone';
import { geoSuperRefinement } from '@/utils';
import { createZone, updateZone } from '@/api/zones';

interface Props {
  onClose: (arg?: boolean) => void;
  zone: Zone | null;
}

export const schema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  latitude: z.number().superRefine(geoSuperRefinement).nullish(),
  longitude: z.number().superRefine(geoSuperRefinement).nullish(),
  total_area: z.coerce.number().positive().optional(),
  num_of_harvesters: z.coerce.number().positive().optional(),
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
});

function ZonesForm({ zone, onClose }: Props) {
  const initialValues = zone || {};
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  function handleZoneMapSelection(location: Geolocation) {
    form.setValue('latitude', location.latitude);
    form.setValue('longitude', location.longitude);
  }

  async function handleSubmit(values: z.infer<typeof schema>) {
    try {
      if (!zone) {
        createZone(values).then(() => onClose(true));
      } else {
        updateZone(zone.id, {
          ...values,
          file: typeof values.file === 'string' ? undefined : values.file,
        }).then(() => onClose(true));
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        form.setError('code', { message: err.response?.data?.message });
      }
    }
  }

  const hasFile = zone?.file && typeof zone.file === 'string';

  return (
    <FormProvider {...form}>
      <Slideover
        onClose={onClose}
        onSave={form.handleSubmit(handleSubmit)}
        title={t('New Zone')}
      >
        <Form className="space-y-8">
          <div className={cn('grid grid-cols-2 gap-4 gap-y-11 mb-6')}>
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
              name="num_of_harvesters"
              defaultValue={0}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">
                    {t('Number of Harvesters')}
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
                        href={(hasFile && zone?.file) as string | undefined}
                        download={t('Map Document')}
                        type="application/octet-stream"
                      >
                        <span>
                          {t(
                            hasFile ? 'Open Document' : 'No Document Available',
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
            callback={handleZoneMapSelection}
            item={zone}
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

export default ZonesForm;

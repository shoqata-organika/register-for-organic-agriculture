import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DownloadIcon } from 'lucide-react';
import Slideover from '@/components/ui/slide-over';
import { Dropdown } from '@/components/dropdown';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/utils';
import { Input } from '@/components/ui/input';
import { createHarvester, updateHarvester } from '@/api/harvester';
import { Zone } from '@/api/types/zone';
import { HarvesterView } from '@/api/types/harvester';

interface Props {
  onClose: (arg?: boolean) => void;
  harvester: HarvesterView | null;
  zones: Array<Zone>;
}

const validImageTypes = ['png', 'jpg', 'jpeg', 'webp'];
const validFileTypes = ['docx', 'xlsx', 'pptx', 'pdf', 'jpeg'];

export const schema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  code: z.string().min(1),
  address: z.string().nullish(),
  family_members: z.coerce.number().nullish(),
  zone_id: z.string().nullish(),
  external_id: z.string().nullish(),
  legal_status: z.enum(['physical', 'legal']).nullish(),
  image: z
    .instanceof(File)
    .or(z.string())
    .nullish()
    .superRefine((value, context) => {
      if (value instanceof File && value.size > 2097152) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Image size cannot be bigger than 2mb',
        });
      }

      if (
        value instanceof File &&
        !validImageTypes.includes(value.type.split('/')[1].trim())
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Image should be of type jpg, png, jpeg, webp',
        });
      }
    }),
  contract_file: z
    .instanceof(File)
    .or(z.string())
    .nullish()
    .superRefine((val, ctx) => {
      if (
        val instanceof File &&
        !validFileTypes.includes(val.type.split('/')[1])
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Documents are only accepted as pdf, word and jpeg files',
        });
      }
    }),
});

function HarvestersForm({ harvester, onClose, zones }: Props) {
  if (harvester && harvester.zone_id) {
    harvester.zone_id = harvester.zone_id.toString();
  }

  const initialValues = harvester || {};

  const { t } = useTranslation();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  async function handleSubmit(values: z.infer<typeof schema>) {
    try {
      if (!harvester) {
        const response = await createHarvester(values);

        response && onClose(true);
      } else {
        const response = await updateHarvester(harvester.id, {
          ...values,
          image: typeof values.image === 'string' ? undefined : values.image,
          contracted_file:
            typeof values.contract_file === 'string'
              ? undefined
              : values.contract_file,
        });

        response && onClose(true);
      }
    } catch (err: any) {
      console.log(err);
      if (err.response?.status === 400) {
        form.setError('code', { message: err.response?.data?.details });
      }
    }
  }

  const title = harvester ? 'Edit Harvester' : 'New Harvester';

  const hasImage = harvester?.image && typeof harvester.image === 'string';
  const hasContractFile =
    harvester?.contract_file && typeof harvester?.contract_file === 'string';

  return (
    <FormProvider {...form}>
      <Slideover
        onClose={() => onClose()}
        onSave={form.handleSubmit(handleSubmit)}
        title={t(title)}
      >
        <Form className="space-y-8">
          <div
            className={cn(
              'grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-11 mb-6',
            )}
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Code')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onFocus={(event) => {
                        if (!event.target.value) {
                          event.target.value = 'V-';
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('First name')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Last name')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel className="w-full">{t('Legal Status')}</FormLabel>
                  <FormControl>
                    <Dropdown
                      items={[
                        { value: 'physical', label: t('Physical') },
                        { value: 'legal', label: t('Legal') },
                      ]}
                      value={field.value || undefined}
                      onChange={(value) =>
                        form.setValue(
                          'legal_status',
                          value as 'physical' | 'legal',
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zone_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Zone')}</FormLabel>
                  <FormControl>
                    {zones && (
                      <Dropdown
                        items={zones.map((zone) => ({
                          value: zone?.id.toString(),
                          label: `${zone.code} - ${zone.name}`,
                        }))}
                        value={field.value || undefined}
                        onChange={(value) => form.setValue('zone_id', value)}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="family_members"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">
                    {t('Family Members')}
                  </FormLabel>
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
            <FormField
              control={form.control}
              name="external_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">
                    {t('Personal Number')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      value={field.value || undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full">{t('Address')}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        value={field.value || undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className={cn('grid grid-cols-2 gap-y-11 gap-x-8 mb-6')}>
            <div className="col-span-3">
              <FormField
                control={form.control}
                name="contract_file"
                defaultValue={undefined}
                render={() => (
                  <FormItem>
                    <FormLabel className="w-full">
                      {t(
                        hasContractFile
                          ? 'Edit Contract Document'
                          : 'Add Contract Document',
                      )}
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          type="file"
                          onChange={(event) => {
                            const file = event.target.files
                              ? event.target.files[0]
                              : undefined;

                            form.setValue('contract_file', file);
                          }}
                        />

                        <a
                          className={`flex gap-2 cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${hasImage ? '' : 'disabled-btn'}`}
                          href={
                            (hasContractFile && harvester.contract_file) as
                              | string
                              | undefined
                          }
                          download={t('Contract Document')}
                          type="application/octet-stream"
                        >
                          <span>
                            {t(
                              hasContractFile
                                ? 'Open Contract Document'
                                : 'No Contract Document Available',
                            )}
                          </span>
                          <DownloadIcon className="h-5 w-5" />
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
                name="image"
                defaultValue={undefined}
                render={() => (
                  <FormItem>
                    <FormLabel className="w-full">
                      {t(hasImage ? 'Edit Image' : 'Choose Image')}
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          type="file"
                          onChange={(event) => {
                            const file = event.target.files
                              ? event.target.files[0]
                              : undefined;

                            form.setValue('image', file);
                          }}
                        />

                        <a
                          className={`flex gap-2 cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${hasImage ? '' : 'disabled-btn'}`}
                          href={
                            (hasImage && harvester.image) as string | undefined
                          }
                          download={t('Map Document')}
                          type="application/octet-stream"
                        >
                          <span>
                            {t(hasImage ? 'Open Image' : 'No Image Available')}
                          </span>
                          <DownloadIcon className="h-5 w-5" />
                        </a>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Form>
      </Slideover>
    </FormProvider>
  );
}

export default HarvestersForm;

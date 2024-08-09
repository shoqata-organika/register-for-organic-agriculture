import { useState } from 'react';
import { ContractedFarmerView } from '@/api/types/contracted_farmers';
import { DownloadIcon } from 'lucide-react';
import * as z from 'zod';
import {
  addContractedFarmer,
  updateContractedFarmer,
} from '@/api/contracted_farmers';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Slideover from '@/components/ui/slide-over';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/utils';
import { Input } from '@/components/ui/input';
import LandParcelsList from './list';

interface Props {
  onClose: (arg?: boolean) => void;
  contractedFarmer: ContractedFarmerView | null;
}

const schema = z
  .object({
    name: z.string().min(1),
    code: z.string().min(1),
    personal_num: z.coerce.number().nullish(),
    address: z.string().nullish(),
    external_id: z.string().nullish(),
    landParcels: z.array(
      z.object({
        id: z.coerce.number().nullish(),
        code: z.string(),
        _delete: z.boolean().nullish(),
      }),
      {
        required_error: 'At least 1 land parcel is required',
      },
    ),
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

        const validImages = ['png', 'jpg', 'jpeg', 'webp'];

        if (
          value instanceof File &&
          !validImages.includes(value.type.split('/')[1].trim())
        ) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Image should be of type jpg, png, jpeg, webp',
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

    return data;
  });

type ParcelCode = { id?: number; code: string; _delete?: boolean };

function ContractedFarmersForm({ contractedFarmer, onClose }: Props) {
  const initVal = contractedFarmer ? schema.parse(contractedFarmer) : {};
  const existingParcelCodes = contractedFarmer
    ? contractedFarmer.landParcels
    : [];

  const [currentLandParcels, setCurrentLandParcels] = useState<ParcelCode[]>(
    existingParcelCodes || [],
  );

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initVal,
  });
  const [singleLandParcel, setSingleLandParcel] = useState<string>();

  const { t } = useTranslation();

  function handleLandParcels(value: string) {
    if (!value.trim()) return;

    const exists = currentLandParcels.find(
      (item) => item.code === value.trim(),
    );

    if (exists) {
      form.setError('landParcels', {
        message: 'This Parcel already is selected',
      });

      return;
    }

    setCurrentLandParcels((prev) => [...prev, { code: value }]);

    form.setValue('landParcels', [...currentLandParcels, { code: value }]);
    setSingleLandParcel(undefined);
  }

  async function handleSubmit(values: z.infer<typeof schema>) {
    if (!currentLandParcels.length && values.landParcels.length) {
      values.landParcels = [];
    }

    try {
      if (!contractedFarmer) {
        const response = await addContractedFarmer(values);

        response && onClose(true);
      } else {
        const response = await updateContractedFarmer(
          Object.assign(values, { id: contractedFarmer.id }),
        );

        response && onClose(true);
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        form.setError('code', { message: err.response?.data?.details });
      }
    }
  }

  const title = contractedFarmer
    ? 'Edit Contracted Farmer'
    : 'New Contracted Farmer';

  const hasImage =
    contractedFarmer?.image && typeof contractedFarmer.image === 'string';

  return (
    <FormProvider {...form}>
      <Slideover
        onClose={onClose}
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
                          event.target.value = 'F-';
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('First name')}</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="external_id"
              defaultValue={undefined}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('External Id')}</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={cn('grid grid-cols-2 gap-y-11 gap-x-6 mb-6')}>
            <FormField
              control={form.control}
              name="personal_num"
              defaultValue={undefined}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">
                    {t('Personal Number')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      value={
                        field.value === 0 ? undefined : field.value?.toString()
                      }
                      onChange={(event) =>
                        form.setValue(
                          'personal_num',
                          +event.target.value === 0
                            ? undefined
                            : +event.target.value,
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Address')}</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="landParcels"
              render={() => (
                <div className={cn('flex items-end gap-3')}>
                  <FormItem>
                    <FormLabel className="w-full">
                      {t('Land Parcels')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        value={singleLandParcel}
                        onChange={(event) =>
                          setSingleLandParcel(event.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <Button
                    onClick={() => handleLandParcels(singleLandParcel || '')}
                  >
                    {t('Add')}
                  </Button>
                </div>
              )}
            />

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
                            (hasImage && contractedFarmer.image) as
                              | string
                              | undefined
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

        <LandParcelsList
          parcelCodes={currentLandParcels.filter((parcel) => !parcel._delete)}
          onRemove={(code: string) => {
            const landParcelIndex = currentLandParcels.findIndex(
              (parcel) => parcel.code === code,
            );

            if (landParcelIndex === -1) return;

            currentLandParcels[landParcelIndex]._delete = true;

            setCurrentLandParcels([...currentLandParcels]);

            // set remove to true
            form.setValue('landParcels', currentLandParcels);
          }}
        />
      </Slideover>
    </FormProvider>
  );
}

export default ContractedFarmersForm;

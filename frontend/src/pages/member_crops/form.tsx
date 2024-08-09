import { useEffect, useState, ChangeEvent } from 'react';
import { ta } from '@/utils/localized_attribute';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Slideover from '@/components/ui/slide-over';
import { Dropdown } from '@/components/dropdown';
import { MemberCropView } from '@/api/types/user';
import { cn } from '@/utils';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Form, FormProvider, useForm } from 'react-hook-form';
import { getCodeCategory } from '@/api/code_category';
import { Code } from '@/api/types/code_category';
import { AdmissionType } from '@/api/types/admission';
import { createMemberCrop, updateMemberCrop } from '@/api/members';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface Props {
  onClose: (arg?: boolean) => void;
  crop: MemberCropView | null;
  type: AdmissionType;
}

export const schema = z.object({
  crop_id: z.string().min(1),
  code: z.string().min(1),
  years: z.array(z.number()).min(1),
});

const years = [2023, 2024, 2025, 2026, 2027];

export default function CropsForm({ crop, onClose, type }: Props) {
  const [crops, setCrops] = useState<Array<Code>>([]);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (crop) {
      form.reset({
        ...crop,
        crop_id: crop.crop_id?.toString(),
      });
    } else {
      form.reset({});
    }
  }, [crop]);

  useEffect(() => {
    getCodeCategory(type === AdmissionType.COLLECTION ? 'CROPS' : 'BMA_CROPS')
      .then((data) => setCrops(data.codes))
      .catch(console.error);
  }, []);

  async function handleSubmit(values: z.infer<typeof schema>) {
    try {
      if (!crop) {
        const data = await createMemberCrop(values);

        data && onClose(true);
      } else {
        const data = await updateMemberCrop({
          ...values,
          id: crop.id,
        });

        data && onClose(true);
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        form.setError('code', { message: err.response?.data?.message });
      }
    }
  }

  function handleYears(event: ChangeEvent<HTMLInputElement>) {
    const currentActivities = form.getValues('years');

    if (currentActivities && currentActivities.includes(+event.target.value)) {
      event.target.checked = false;

      form.setValue(
        'years',
        currentActivities.filter((act) => act !== +event.target.value),
      );

      return;
    }

    form.setValue('years', [
      ...(form.getValues('years') || []),
      +event.target.value,
    ]);
  }

  const cropType = type === AdmissionType.COLLECTION ? 'PPJD' : 'BMA';

  return (
    <FormProvider {...form}>
      <Slideover
        onClose={onClose}
        onSave={form.handleSubmit(handleSubmit)}
        title={t('New List')}
      >
        <Form className="space-y-8">
          <div className={cn('grid grid-cols-2 gap-4 gap-y-11 mb-6')}>
            <FormField
              control={form.control}
              name="crop_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">
                    {t(`Crop (${cropType})`)}
                  </FormLabel>
                  <FormControl>
                    <Dropdown
                      items={crops.map((crop) => ({
                        value: crop.id.toString(),
                        label: ta(crop, 'name', i18n.language),
                      }))}
                      value={field.value}
                      onChange={(value) => {
                        const crop = crops.find((cp) => cp.id === +value);
                        form.setValue('crop_id', value);

                        if (crop) {
                          form.setValue('code', crop.code);
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

            <div className={cn('col-span-2')}>
              <FormField
                control={form.control}
                name="years"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full text-base text-gray-500 mb-4">
                      {t('Years')}
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-6">
                        {years.map((year) => (
                          <div className="flex items-center gap-1 mb-3 text-lg">
                            <input
                              id={year.toString()}
                              type="checkbox"
                              checked={field.value?.includes(year)}
                              value={year}
                              onChange={handleYears}
                            />
                            <label htmlFor={year.toString()}>{year}</label>
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
        </Form>
      </Slideover>
    </FormProvider>
  );
}

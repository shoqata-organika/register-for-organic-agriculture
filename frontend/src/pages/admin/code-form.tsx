import { useEffect } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Slideover from '@/components/ui/slide-over';
import { cn } from '@/utils';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Form, FormProvider, useForm } from 'react-hook-form';
import { Code, API_NAMES } from '@/api/types/code_category';
import { createCode, updateCode } from '@/api/code_category';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface Props {
  onClose: (arg?: boolean) => void;
  code: Code | null;
  type: API_NAMES;
}

export const commonSchema = z.object({
  name: z.string().min(1),
  name_sq: z.string().min(1),
  name_sr: z.string().min(1),
});

export default function CodesForm({ code, onClose, type }: Props) {
  const onlyCrops = type === API_NAMES.CROPS || type === API_NAMES.BMA_CROPS;
  const { t } = useTranslation();

  const schema = onlyCrops
    ? commonSchema.extend({ code: z.string().min(1) })
    : commonSchema.extend({ code: z.string().nullish() });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    if (code) {
      form.reset(code);
    } else {
      form.reset({});
    }
  }, [code]);

  async function handleSubmit(values: z.infer<typeof schema>) {
    try {
      if (!code) {
        const response = await createCode({
          ...values,
          codeCategoryType: type,
        } as Code);

        if (response) onClose(true);
      } else {
        const response = await updateCode({
          ...values,
          id: code.id,
          codeCategoryType: type,
        } as Code);

        if (response) onClose(true);
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        // form.setError('code', { message: err.response?.data?.message });
      }
    }
  }

  return (
    <FormProvider {...form}>
      <Slideover
        onClose={onClose}
        onSave={form.handleSubmit(handleSubmit)}
        title={t('New Data')}
      >
        <Form className="space-y-8">
          <div className={cn('grid grid-cols-2 gap-4 gap-y-11 mb-6')}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('English')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name_sq"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Shqip')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name_sr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Srpski')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {onlyCrops && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full">{t('Code')}</FormLabel>
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
            )}
          </div>
        </Form>
      </Slideover>
    </FormProvider>
  );
}

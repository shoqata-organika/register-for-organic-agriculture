import * as z from 'zod';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils';
import { DownloadIcon } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const soilAnalysisSchema = z.object({
  ph_level: z.coerce.number(),
  n_level: z.coerce.number(),
  p_level: z.coerce.number(),
  k_level: z.coerce.number(),
});

function SoilAnalysisForm({
  hasFile,
  file,
}: {
  hasFile?: boolean | string | null;
  file?: string | File | null;
}) {
  const form = useFormContext();

  const { t } = useTranslation();

  return (
    <div className={cn('grid gap-y-5 pt-3 pb-3')}>
      <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-11')}>
        <FormField
          control={form.control}
          name="details.ph_level"
          defaultValue={0}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('pH Level')}</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className={cn('grid grid-cols-2 gap-4 gap-y-11')}>
        <FormField
          control={form.control}
          name="details.n_level"
          defaultValue={0}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('N Level')}</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className={cn('space-y-2 flex flex-wrap')}>
          <FormItem>
            <FormLabel className="w-full">{t('Permitted N Level')}</FormLabel>
            <FormControl>
              <Input type="number" min="0" value={100} disabled />
            </FormControl>
          </FormItem>
        </div>
      </div>
      <div className={cn('grid grid-cols-2 gap-4 gap-y-11')}>
        <FormField
          control={form.control}
          name="details.p_level"
          defaultValue={0}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('P Level')}</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className={cn('space-y-2 flex flex-wrap')}>
          <FormItem>
            <FormLabel className="w-full">{t('Permitted P Level')}</FormLabel>
            <FormControl>
              <Input type="number" min="0" value={100} disabled />
            </FormControl>
          </FormItem>
        </div>
      </div>
      <div className={cn('grid grid-cols-2 gap-4 gap-y-11')}>
        <FormField
          control={form.control}
          name="details.k_level"
          defaultValue={0}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('K Level')}</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className={cn('space-y-2 flex flex-wrap')}>
          <FormItem>
            <FormLabel className="w-full">{t('Permitted K Level')}</FormLabel>
            <FormControl>
              <Input type="number" min="0" value={100} disabled />
            </FormControl>
          </FormItem>
        </div>
      </div>

      <div className="col-span-3">
        <FormField
          control={form.control}
          name="file"
          defaultValue={undefined}
          render={() => (
            <FormItem>
              <FormLabel className="w-full">
                {t(hasFile ? 'Edit Document' : 'Choose Document')}
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
                    href={(hasFile && file) as string | undefined}
                    download={t('Map Document')}
                    type="application/octet-stream"
                  >
                    <span>
                      {t(hasFile ? 'Open Document' : 'No Document Available')}
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
  );
}

export default SoilAnalysisForm;

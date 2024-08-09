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
import { MemberResource, ResourceType } from '@/api/types/user';
import {
  createMemberResource,
  updateMemberResource,
} from '@/api/member_resource';
import { Dropdown } from '@/components/dropdown';

interface Props {
  onClose: (arg?: boolean) => void;
  resource: MemberResource | null;
  resourceTypes: ResourceType[];
}

export const schema = z.object({
  name: z.string(),
  resource_type: z.string(),
});

function ResourceForm({ resource, resourceTypes, onClose }: Props) {
  const initialValues = resource || {};

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const { t } = useTranslation();

  async function handleSubmit(values: z.infer<typeof schema>) {
    if (!resource) {
      createMemberResource(values as MemberResource).then(() => onClose(true));
    } else {
      updateMemberResource(resource.id, values as MemberResource).then(() =>
        onClose(true),
      );
    }
  }

  return (
    <FormProvider {...form}>
      <Slideover
        onClose={() => onClose()}
        onSave={form.handleSubmit(handleSubmit)}
        title={t('New Location')}
      >
        <Form className="space-y-8">
          <div className={cn('grid grid-cols-1 gap-4 gap-y-11 mb-6')}>
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
              name="resource_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Type')}</FormLabel>
                  <FormControl>
                    <Dropdown
                      items={resourceTypes.map((state) => ({
                        value: state,
                        label: t(state),
                      }))}
                      value={field.value?.toString()}
                      onChange={(value) =>
                        form.setValue('resource_type', value)
                      }
                    />
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

export default ResourceForm;

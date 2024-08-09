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
import { User, UserRole } from '@/api/types/user';
import { createUser, updateUser } from '@/api/user';
import { ChangeEvent, useMemo } from 'react';
import groupBy from 'lodash.groupby';

interface Props {
  onClose: (arg?: boolean) => void;
  user: User | null;
}

export const schema = z
  .object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    username: z.string().min(1),
    email: z.string().email().min(1),
    password: z.string().optional(),
    password_confirmation: z.string().optional(),
    roles: z.array(z.string()),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

function UsersForm({ user, onClose }: Props) {
  const initialValues = user || {};

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const { t } = useTranslation();

  async function handleSubmit(values: z.infer<typeof schema>) {
    try {
      if (!user) {
        createUser(values).then(() => onClose(true));
      } else {
        updateUser(user.id, values).then(() => onClose(true));
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        form.setError('username', { message: err.response?.data?.message });
      }
    }
  }

  function handleRoles(event: ChangeEvent<HTMLInputElement>) {
    const roles = form.getValues('roles');

    if (roles && roles.includes(event.target.value)) {
      event.target.checked = false;

      form.setValue(
        'roles',
        roles.filter((act) => act !== event.target.value),
      );

      return;
    }

    const rolesToSelect =
      event.target.value.indexOf('write_') !== -1
        ? [event.target.value, event.target.value.replace('write_', 'read_')]
        : [event.target.value];

    form.setValue('roles', [
      ...(form.getValues('roles') || []),
      ...rolesToSelect,
    ]);
  }

  const groupedRoles = useMemo(
    () =>
      groupBy(Object.values(UserRole), (role) => {
        const parts = role.split('_');
        parts.shift();

        return parts.join('_');
      }),
    [],
  );

  console.log(groupedRoles);

  return (
    <FormProvider {...form}>
      <Slideover
        onClose={() => onClose()}
        onSave={form.handleSubmit(handleSubmit)}
        title={t('New User')}
      >
        <Form className="space-y-8">
          <div className={cn('grid grid-cols-2 gap-4 gap-y-11 mb-6')}>
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Username')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel className="w-full">{t('Email')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel className="w-full">{t('Password')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">
                    {t('Password Confirmation')}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={cn('grid grid-cols-1 gap-4 gap-y-11')}>
            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">{t('Roles')}</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1">
                      {Object.keys(groupedRoles).map((key) => (
                        <div key={key} className="grid grid-cols-3 gap-3">
                          <strong>{t(`permission_${key}`)}</strong>
                          <div className="flex items-center gap-3">
                            {groupedRoles[key].map((role) => (
                              <div className="flex items-center gap-1 mb-3 text-lg">
                                <input
                                  id={role.toString()}
                                  type="checkbox"
                                  checked={field.value?.includes(role)}
                                  value={role}
                                  onChange={handleRoles}
                                />
                                <label htmlFor={role.toString()}>
                                  {t(role.split('_')[0])}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
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

export default UsersForm;

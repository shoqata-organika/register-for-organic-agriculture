import { useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExternalLink } from 'lucide-react';
import { login } from '@/api/user';
import { setRoles, setToken } from '@/api/auth';
import Flags from '@/components/flags';
import { useTranslation } from 'react-i18next';

const schema = z.object({
  username: z.string(),
  password: z.string(),
});

export default function Login() {
  const [disabled, setDisabled] = useState(false);

  const { t } = useTranslation();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const errors = form.formState.errors;

  const handleLogin = async (values: z.infer<typeof schema>) => {
    setDisabled(true);

    const token = await login(values.username, values.password);

    if (token.access_token) {
      setToken(token.access_token);
      setRoles(token.roles || []);

      if (token.roles?.includes('admin')) {
        window.location.href = '/admin';
        return;
      }

      window.location.href = '/';
    } else {
      form.setError('username', { message: token.error });
    }

    setDisabled(false);
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-20 w-auto"
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {t('Register for Organic Agriculture')}
          </h2>

          <div className="flex justify-center mb-0 mt-5">
            <Flags />
          </div>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
            {' '}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t('Username')}
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  autoComplete="username"
                  required
                  {...form.register('username')}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.username && (
                  <p className={'text-sm font-medium text-destructive'}>
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {t('Password')}
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    {t('Forgot your password?')}
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  {...form.register('password')}
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.password && (
                  <p className={'text-sm font-medium text-destructive'}>
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={disabled}
              >
                {t('Sign in')}
              </button>
            </div>
          </form>

          <p className="flex gap-1 items-center text-lg my-5">
            <div style={{ height: 2 }} className="w-full bg-gray-300" />
            {t('OR')}
            <div style={{ height: 2 }} className="w-full bg-gray-300" />
          </p>

          <p className="text-center text-sm text-gray-500">
            <a
              href="/signup"
              className="font-semibold flex items-center bg-primary text-white rounded py-2 justify-center gap-2 leading-6 text-indigo-600 hover:text-indigo-500"
            >
              {t('Register')}
              <ExternalLink className="h-4 w-4" />
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

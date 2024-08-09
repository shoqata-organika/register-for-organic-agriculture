import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import ErrorModal from './error-modal';

const resInterceptor = (response: AxiosResponse) => response;

type ApiError = {
  details: string;
  path: string;
  stackTrace: string;
  statusCode: string;
  timestamp: string;
};

const AxiosErrorInterceptor = ({ children }: { children: any }) => {
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const intercept = axios.interceptors.response.use(
      resInterceptor,
      (error: any) => {
        if (error.response.status === 500) {
          setError(error.response.data);
          return Promise.reject(error);
        } else {
          return Promise.reject(error);
        }
      },
    );

    return () => axios.interceptors.response.eject(intercept);
  });

  return (
    <>
      {error && (
        <ErrorModal
          details={error.details}
          stackTrace={error.stackTrace}
          onClose={() => setError(null)}
        />
      )}

      {children}
    </>
  );
};

export default AxiosErrorInterceptor;

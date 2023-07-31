// do not use this on SS components;

import { useToast } from '../store/toast.context';
import { useCallback, useState } from 'react';

// eslint-disable-next-line no-unused-vars
type IUseFetch<T> = [(data?: T) => Promise<any>, boolean];

export function useFetch<T>(
  url: string,
  successMsg = '',
  errorMsg = '',
  method = 'GET',
  showToasts = true
): IUseFetch<T> {
  const [loading, setLoading] = useState(false);
  const { setToast } = useToast();
  const apiCall = useCallback(async (data: any = {}) => {
    try {
      setLoading(true);
      const resp = await fetch(
        process.env.NEXT_PUBLIC_APP_URL + url,
        method === 'GET'
          ? {
              method,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          : {
              method,
              body: JSON.stringify(data),
              headers: {
                'Content-Type': 'application/json',
              },
            }
      );
      const respData = await resp.json();
      if (resp.status === 200) {
        showToasts &&
          setToast({
            summary: 'Success',
            detail: successMsg,
          });
      } else {
        throw new Error(respData?.error);
      }
      setLoading(false);
      return respData;
    } catch (e: any) {
      showToasts &&
        setToast({
          summary: 'Error',
          detail: errorMsg || e.toString(),
          type: 'Error',
        });
      setLoading(false);
    }
  }, []);

  return [apiCall, loading];
}

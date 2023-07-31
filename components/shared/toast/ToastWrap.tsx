'use client';
import { useEffect, useRef } from 'react';
import { ToastProvider, useToast } from '../../../store/toast.context';

const ToastWrap = ({ children }: { children: React.ReactNode }) => {
  const toast = useRef<any>(null); //put toast in ref

  const showSuccess = (summary: string, detail?: string) => {
    toast.current!.show({
      severity: 'success',
      summary,
      detail,
      life: 3000,
    });
  };

  const showInfo = (summary: string, detail?: string) => {
    toast.current!.show({
      severity: 'info',
      summary,
      detail,
      life: 3000,
    });
  };

  const showWarn = (summary: string, detail?: string) => {
    toast.current!.show({
      severity: 'warn',
      summary,
      detail,
      life: 3000,
    });
  };

  const showError = (summary: string, detail?: string) => {
    toast.current!.show({
      severity: 'error',
      summary,
      detail,
      life: 3000,
    });
  };

  const ToastListener = () => {
    const { toast, setToast } = useToast();
    useEffect(() => {
      if (toast?.summary) {
        switch (toast.type) {
          case 'Error':
            showError(toast?.summary, toast?.detail);
            break;
          case 'Info':
            showInfo(toast?.summary, toast?.detail);
            break;
          case 'Warn':
            showWarn(toast?.summary, toast?.detail);
            break;
          default:
            showSuccess(toast?.summary, toast?.detail);
        }
        setToast(null);
      }
    }, [toast]);

    return <div />;
  };

  return (
    <>
      <ToastProvider>
        <>
          <ToastListener />
          {children}
        </>
      </ToastProvider>
      {/* <Toast ref={toast}></Toast> */}
    </>
  );
};

export default ToastWrap;

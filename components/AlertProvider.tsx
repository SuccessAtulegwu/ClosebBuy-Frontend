import React, { useState, useEffect } from 'react';
import { CustomAlert } from './CustomAlert';
import { alertService, AlertType } from '@/utils/alertService';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertState {
  visible: boolean;
  type: AlertType;
  title: string;
  message: string;
  buttons: AlertButton[];
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alertState, setAlertState] = useState<AlertState>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
    buttons: [],
  });

  useEffect(() => {
    const showHandler = (options: any) => {
      setAlertState({
        visible: true,
        type: options.type || 'info',
        title: options.title,
        message: options.message,
        buttons: options.buttons || [{ text: 'OK', style: 'default' }],
      });
    };

    const hideHandler = () => {
      setAlertState((prev) => ({ ...prev, visible: false }));
    };

    alertService.on('show', showHandler);
    alertService.on('hide', hideHandler);

    return () => {
      alertService.off('show', showHandler);
      alertService.off('hide', hideHandler);
    };
  }, []);

  const handleClose = () => {
    setAlertState((prev) => ({ ...prev, visible: false }));
  };

  return (
    <>
      {children}
      <CustomAlert
        visible={alertState.visible}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        buttons={alertState.buttons}
        onClose={handleClose}
      />
    </>
  );
}


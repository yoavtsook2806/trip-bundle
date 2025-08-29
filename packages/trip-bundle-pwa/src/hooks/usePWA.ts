import { useState, useEffect } from 'react';

export interface PWAInfo {
  isStandalone: boolean;
  isInstallable: boolean;
  isIOS: boolean;
  canInstall: boolean;
}

export const usePWA = (): PWAInfo => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const isStandalone = 
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone ||
    document.referrer.includes('android-app://');

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  const canInstall = isInstallable && !isStandalone;

  return {
    isStandalone,
    isInstallable,
    isIOS,
    canInstall
  };
};

export const installPWA = async (deferredPrompt: any) => {
  if (!deferredPrompt) return false;

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  
  return outcome === 'accepted';
};

"use client";

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export default function AndroidOptimizer() {
  useEffect(() => {
    async function initNative() {
      if (Capacitor.isNativePlatform()) {
        try {
          // Status barni shaffof qilish (Overlays webview)
          await StatusBar.setOverlaysWebView({ overlay: true });
          
          // Status barni dark qilish (oq matnlar uchun)
          await StatusBar.setStyle({ style: Style.Dark });
          
          // Splash screen-ni bir ozdan keyin yashirish
          setTimeout(async () => {
            await SplashScreen.hide();
          }, 100);
        } catch (e) {
          console.error('Android optimization failed:', e);
        }
      }
    }

    initNative();
  }, []);

  return null; // Hech narsa render qilmaydi, faqat orqa fonda ishlaydi
}

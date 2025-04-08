import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLang = new BehaviorSubject<string>('en');
  private translations: { [key: string]: { [key: string]: string } } = {
    en: {
      LANGUAGE: 'Language',
      SETTINGS: 'Settings',
      NOTIFICATIONS: 'Notifications',
      EMAIL_NOTIFICATIONS: 'Email Notifications',
      PUSH_NOTIFICATIONS: 'Push Notifications',
      TRANSACTION_ALERTS: 'Transaction Alerts',
      DISPLAY: 'Display',
      THEME: 'Theme',
      CURRENCY: 'Currency',
      DELETE_ACCOUNT: 'Delete Account',
      LOGOUT: 'Logout',
      SAVE: 'Save',
      CANCEL: 'Cancel',
      CONFIRM: 'Confirm',
      DARK: 'Dark',
      LIGHT: 'Light',
      USD: 'USD',
      EUR: 'EUR',
      CONFIRM_DELETE: 'Are you sure you want to delete your account? This action cannot be undone.',
      YES: 'Yes',
      NO: 'No'
    },
    es: {
      LANGUAGE: 'Idioma',
      SETTINGS: 'Configuración',
      NOTIFICATIONS: 'Notificaciones',
      EMAIL_NOTIFICATIONS: 'Notificaciones por Email',
      PUSH_NOTIFICATIONS: 'Notificaciones Push',
      TRANSACTION_ALERTS: 'Alertas de Transacciones',
      DISPLAY: 'Pantalla',
      THEME: 'Tema',
      CURRENCY: 'Moneda',
      DELETE_ACCOUNT: 'Eliminar Cuenta',
      LOGOUT: 'Cerrar Sesión',
      SAVE: 'Guardar',
      CANCEL: 'Cancelar',
      CONFIRM: 'Confirmar',
      DARK: 'Oscuro',
      LIGHT: 'Claro',
      USD: 'USD',
      EUR: 'EUR',
      CONFIRM_DELETE: '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.',
      YES: 'Sí',
      NO: 'No'
    }
  };

  constructor() {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      this.setLanguage(savedLang);
    }
  }

  getCurrentLang(): Observable<string> {
    return this.currentLang.asObservable();
  }

  setLanguage(langCode: string): void {
    if (this.translations[langCode]) {
      this.currentLang.next(langCode);
      localStorage.setItem('language', langCode);
    }
  }

  translate(key: string): Observable<string> {
    return new Observable(observer => {
      this.currentLang.subscribe(lang => {
        const translation = this.translations[lang]?.[key] || key;
        observer.next(translation);
      });
    });
  }
} 
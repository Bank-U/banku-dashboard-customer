import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';

export type Language = 'en' | 'es';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private currentLanguage = new BehaviorSubject<Language>('es');
  private translations: { [key: string]: any } = {};
  private loadedLanguages: Set<Language> = new Set();

  constructor(private http: HttpClient) {
    // Load saved language preference or use browser language
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'es')) {
      this.setLanguage(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0] as Language;
      this.setLanguage(browserLang === 'es' ? 'es' : 'en');
    }
  }

  getCurrentLanguage(): Observable<Language> {
    return this.currentLanguage.asObservable();
  }

  setLanguage(lang: Language) {
    localStorage.setItem('language', lang);
    this.currentLanguage.next(lang);
    this.loadTranslations(lang);
  }

  private loadTranslations(lang: Language) {
    if (!this.loadedLanguages.has(lang)) {
      this.http.get(`/assets/i18n/${lang}.json`)
        .pipe(
          tap(translations => {
            this.translations[lang] = translations;
            this.loadedLanguages.add(lang);
          }),
          catchError(error => {
            console.error(`Error loading translations for ${lang}:`, error);
            return of({});
          })
        )
        .subscribe();
    }
  }

  translate(key: string): Observable<string> {
    return this.currentLanguage.pipe(
      map(lang => {
        if (!this.translations[lang]) {
          return key;
        }
        
        const keys = key.split('.');
        let translation = this.translations[lang];
        
        for (const k of keys) {
          if (translation && translation[k]) {
            translation = translation[k];
          } else {
            return key;
          }
        }
        
        return translation;
      })
    );
  }
} 
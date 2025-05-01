import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { StateService } from './state.service';
import { Language } from '../models/app-state.model';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private readonly currentLanguage = new BehaviorSubject<Language>(navigator.language.split('-')[0] as Language || 'en');
  private readonly translations: { [key: string]: any } = {};
  private readonly loadedLanguages: Set<Language> = new Set();

  constructor(private readonly http: HttpClient, private readonly stateService: StateService) {
    this.loadTranslations();
  }

  private loadTranslations() {
    this.stateService.getLanguage().subscribe(lang => {
      if (!this.loadedLanguages.has(lang)) {
        this.http.get(`/assets/i18n/${lang}.json`)
          .pipe(
          tap(translations => {
            this.translations[lang] = translations;
            this.loadedLanguages.add(lang);
            this.currentLanguage.next(lang);
          }),
          catchError(error => {
            console.error(`Error loading translations for ${lang}:`, error);
            return of({});
          })
        )
        .subscribe();
      } else {
        this.currentLanguage.next(lang);
      }
    });
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
          if (translation?.[k]) {
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
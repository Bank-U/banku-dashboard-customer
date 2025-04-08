import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-language-selector',
  template: `
    <mat-form-field>
      <mat-label>{{ 'LANGUAGE' | translate | async }}</mat-label>
      <mat-select [value]="currentLang$ | async" (selectionChange)="onLanguageChange($event.value)">
        <mat-option *ngFor="let lang of availableLanguages" [value]="lang.code">
          {{ lang.name }}
        </mat-option>
      </mat-select>
    </mat-form-field>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
      max-width: 200px;
    }
  `]
})
export class LanguageSelectorComponent implements OnInit {
  currentLang$: Observable<string>;
  availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];

  constructor(private translationService: TranslationService) {
    this.currentLang$ = this.translationService.getCurrentLang();
  }

  ngOnInit(): void {}

  onLanguageChange(langCode: string): void {
    this.translationService.setLanguage(langCode);
  }
} 
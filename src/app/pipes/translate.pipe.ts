import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../core/services/translate.service';
import { Observable } from 'rxjs';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform {
  constructor(private readonly translateService: TranslateService) {}

  transform(value: string): Observable<string> {
    if (!value) {
      return new Observable<string>(observer => observer.next(''));
    }
    return this.translateService.translate(value);
  }
} 
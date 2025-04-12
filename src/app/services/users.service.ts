import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly BASE_PATH = '/v1/users';

  constructor(private apiService: ApiService) {}

  deleteAccount(): Observable<void> {
    return this.apiService.delete<void>(`${this.BASE_PATH}/self`);
  }
} 
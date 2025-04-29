import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) { }

  getUserInfo(): Observable<UserInfo> {
    return this.apiService.get<UserInfo>('/v1/users/self');
  }

  deleteAccount(): Observable<void> {
    return this.apiService.delete<void>(`/v1/users/self`);
  }
} 
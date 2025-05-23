import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  preferredLanguage: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private readonly apiService: ApiService) { }

  getUserInfo(): Observable<UserInfo> {
    return this.apiService.get<UserInfo>('/v1/users/self');
  }

  deleteAccount(): Observable<void> {
    return this.apiService.delete<void>(`/v1/users/self`);
  }

  updateUser(user: Partial<UserInfo>): Observable<UserInfo> {
    return this.apiService.put<UserInfo>(`/v1/users/self`, user);
  }
} 
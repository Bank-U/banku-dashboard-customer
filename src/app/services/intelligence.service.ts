import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Alert {
  id: string;
  title: string;
  description: string;
  type: string;
  lastUpdated: Date;
  resolved: boolean;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: number;
  lastUpdated: Date;
  resolved: boolean;
}

export interface IntelligenceData {
  alerts: Alert[];
  recommendations: Recommendation[];
}

@Injectable({
  providedIn: 'root'
})
export class IntelligenceService {

  constructor(private apiService: ApiService) {}

  getIntelligenceData(): Observable<IntelligenceData> {
    return this.apiService.get<IntelligenceData>(`/v1/engine/intelligence`);
  }

  syncIntelligenceData(): Observable<any> {
    return this.apiService.post(`/v1/engine/sync`, {});
  }

  resolveAlert(alertId: string): Observable<void> {
    return this.apiService.put<void>(`/v1/engine/alerts/${alertId}/resolve`, {});
  }

  resolveRecommendation(recommendationId: string): Observable<void> {
    return this.apiService.put<void>(`/v1/engine/recommendations/${recommendationId}/resolve`, {});
  }
} 
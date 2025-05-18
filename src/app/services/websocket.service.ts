import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { CompatClient, Stomp } from '@stomp/stompjs';

export interface WebsocketBankuEvent {
  type: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient?: CompatClient;
  private eventSubject = new Subject<WebsocketBankuEvent>();
  public events$ = this.eventSubject.asObservable();

  constructor(
    private authService: AuthService
  ) {
    this.initializeEngineWebSocket();
  }

  private initializeEngineWebSocket() {
    const socket = new WebSocket(`${environment.wsUrl}/engine?token=${this.authService.getToken()}`);
    this.stompClient = Stomp.over(socket);
    const userId = this.authService.getUserId();
    
    this.stompClient.connect({}, () => {
      this.stompClient?.subscribe(`/topic/user/${userId}`, (message: any) => {
        const event: WebsocketBankuEvent = JSON.parse(message.body);
        this.eventSubject.next(event);
      });
    });
  }
} 
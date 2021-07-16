import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from 'src/app/typing';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}

  getMessages(scriptId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`api/v1/messages?scriptId=${scriptId}`);
  }

  postMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(`api/v1/messages`, message);
  }
}

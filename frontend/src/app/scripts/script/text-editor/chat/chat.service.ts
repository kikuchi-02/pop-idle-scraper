import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defer, Observable, of, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, mergeMap } from 'rxjs/operators';
import { AppService } from 'src/app/services/app.service';
import { Message } from 'src/app/typing';
import { Array } from 'yjs';

@Injectable()
export class ChatService {
  private yarray: Array<Message>;
  constructor(private http: HttpClient, private appService: AppService) {}

  createArray(label: string): Observable<Message[]> {
    this.yarray = this.appService.ydoc.getArray(label);
    const subject = new ReplaySubject<Message[]>(1);
    this.yarray.observe((event, transaction) => {
      const array = this.yarray.toArray();
      subject.next(array);
    });
    subject.next(this.yarray.toArray());

    return defer(() => {
      if (!this.appService.useWs) {
        return of(true);
      }
      return this.appService.wsSynced();
    }).pipe(
      mergeMap(() => subject.asObservable()),
      distinctUntilChanged()
    );
  }
  insertArray(index: number, ...messages: Message[]): void {
    this.yarray.insert(index, messages);
  }
  pushArray(...messages: Message[]): void {
    this.yarray.push(messages);
  }
  spliceArray(
    start: number,
    deleteCount: number,
    ...messages: Message[]
  ): void {
    this.yarray.delete(start, deleteCount);
    this.yarray.insert(start, messages);
  }

  getMessages(scriptId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`api/v1/messages?scriptId=${scriptId}`);
  }

  postMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(`api/v1/messages`, message);
  }
}

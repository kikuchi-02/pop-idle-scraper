import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WebsocketProvider } from 'y-websocket';
import { Doc } from 'yjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public ydoc = new Doc();
  private wsProvider: WebsocketProvider;

  constructor() {
    this.wsProvider = new WebsocketProvider(
      `${environment.production ? 'wss' : 'ws'}://${window.location.host}`,
      '__text',
      this.ydoc
    );
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  clientIdIdentifier = 'clientId';
  constructor() { }

  saveClientId(clientId: string): void {
    localStorage.setItem(this.clientIdIdentifier, clientId);
  }

  getClientId(): string | null {
    return localStorage.getItem(this.clientIdIdentifier);
  }
}

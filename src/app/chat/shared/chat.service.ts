import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Socket} from 'ngx-socket-io';
import {ChatClient} from './chat-client.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  chatClient: ChatClient | undefined;
  constructor(private socket: Socket) { }

  sendMessage(msg: string): void {
    this.socket.emit('message', msg);
  }

  listenForMessages(): Observable<string>{
    return this.socket
      .fromEvent<string>('newMessage');
  }

  listenForClients(): Observable<ChatClient[]>{
    return this.socket
      .fromEvent<ChatClient[]>('clients');
  }

  getAllMessages(): Observable<string[]>{
    return this.socket
      .fromEvent<string[]>('allMessages');
  }

  confirmName(nickname: string): void {
    this.socket.emit('nickname', nickname);
  }
}

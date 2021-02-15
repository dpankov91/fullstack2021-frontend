import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Socket} from 'ngx-socket-io';
import {ChatClient} from './chat-client.model';
import {ChatMessage} from './chat-message.model';
import {WelcomeDto} from './welcome.dto';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  chatClient: ChatClient | undefined;

  constructor(private socket: Socket) { }

  sendMessage(msg: string): void {
    this.socket.emit('message', msg);
  }

  listenForMessages(): Observable<ChatMessage>{
    return this.socket
      .fromEvent<ChatMessage>('newMessage');
  }

  listenForClients(): Observable<ChatClient[]>{
    return this.socket
      .fromEvent<ChatClient[]>('clients');
  }

  listenForWelcome(): Observable<WelcomeDto>{
    return this.socket
      .fromEvent<WelcomeDto>('welcome');
  }

  listenForErrors(): Observable<string>{
    return this.socket
      .fromEvent<string>('error');
  }

  listenForClientTyping(): Observable<ChatClient>{
    return this.socket
      .fromEvent<ChatClient>('clientTyping');
  }

  getAllMessages(): Observable<ChatMessage[]>{
    return this.socket
      .fromEvent<ChatMessage[]>('allMessages');
  }

  sendName(nickname: string): void {
    this.socket.emit('nickname', nickname);
  }

  sendTyping(isTyping: boolean): void {
      this.socket.emit('typing', isTyping);
  }
}

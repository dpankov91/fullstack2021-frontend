import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ChatService} from './shared/chat.service';
import {take, takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {ChatClient} from './shared/chat-client.model';
import {ChatMessage} from './shared/chat-message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  message = new FormControl('');
  messages: ChatMessage[] = [];
  unsubscriber$ = new Subject();
  nameFC = new FormControl('');
  nickname: string | undefined;
  clients$: Observable<ChatClient[]> | undefined;
  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.clients$ = this.chatService.listenForClients();
    this.chatService.listenForMessages()
      .pipe(
        takeUntil(this.unsubscriber$)
      )
      .subscribe(message => {
        console.log('Helloo Maafakaz');
        this.messages.push(message);
      });
    this.chatService.getAllMessages()
      .pipe(
        take(1)
      )
      .subscribe(messages => {
        console.log('getAll');
        this.messages = messages;
      });

  }

  sendMessage(): void {
    console.log(this.message.value);
    this.chatService.sendMessage(this.message.value);
  }

  confirmName(): void {
    if (this.nameFC.value) {
      this.nickname = this.nameFC.value;
      this.chatService.confirmName(this.nameFC.value);
    }
  }

    ngOnDestroy(): void {
    console.log('Destroyed');
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
}

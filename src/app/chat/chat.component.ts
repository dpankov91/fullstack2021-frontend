import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ChatService} from './shared/chat.service';
import {debounceTime, take, takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {ChatClient} from './shared/chat-client.model';
import {ChatMessage} from './shared/chat-message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  messageFc = new FormControl('');
  messages: ChatMessage[] = [];
  clientsTyping: ChatClient[] = [];
  unsubscribe$ = new Subject();
  nameFC = new FormControl('');
  clients$: Observable<ChatClient[]> | undefined;
  chatClient: ChatClient | undefined;
  errors$: Observable<string> | undefined;
  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.clients$ = this.chatService.listenForClients();
    this.errors$ = this.chatService.listenForErrors();
    this.messageFc.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500)
      )
      .subscribe((value) => {
        this.chatService.sendTyping(value.length > 0);
      });
    this.chatService.listenForMessages()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(message => {
        this.messages.push(message);
      });
    this.chatService.listenForWelcome().
    pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(welcome => {
        this.messages = welcome.messages;
        this.chatClient = this.chatService.chatClient = welcome.client;
      });
    this.chatService.listenForClientTyping()
      .pipe(
        takeUntil(this.unsubscribe$)
    )
      .subscribe( (chatClient) => {
        if (chatClient.isTyping && !this.clientsTyping.find((c) => chatClient.id === c.id )){
          this.clientsTyping.push(chatClient);
        } else {
          this.clientsTyping = this.clientsTyping.filter((c) => c.id !== chatClient.id);
        }});
    if (this.chatService.chatClient) {
      this.chatService.sendName(this.chatService.chatClient.nickname );
    }

  }

  ngOnDestroy(): void {
    console.log('Destroyed');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  sendMessage(): void {
    console.log(this.messageFc.value);
    this.chatService.sendMessage(this.messageFc.value);
    this.messageFc.patchValue('');
  }

  confirmName(): void {
    if (this.nameFC.value) {
      this.chatService.sendName(this.nameFC.value);
    }
  }

}

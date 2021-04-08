import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ChatService} from './shared/chat.service';
import {debounceTime, take, takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {ChatClient} from './shared/chat-client.model';
import {ChatMessage} from './shared/chat-message.model';
import {DatePipe} from '@angular/common';
import {LoginService} from '../shared/login.service';

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
  myDate = new Date();
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  socketId: string | undefined;

  constructor(private chatService: ChatService, public datepipe: DatePipe, private loginService: LoginService) { }

  ngOnInit(): void {
    this.clients$ = this.chatService.listenForClients();
    console.log('get clients frontend' + this.clients$);
    this.errors$ = this.chatService.listenForErrors();
    this.handleSendTyping();
    this.handleListenForMessages();
    this.handleListenForWelcomeDTO();
    this.handleListenForTyping();
    // this.handleSendNickname();
    this.handleListenForConnect();
    this.handleListenForDisconnect ();
  }

  handleListenForTyping(): void{
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
  }

  handleSendNickname(): void{
    if (this.chatService.chatClient) {
      this.chatService.sendName(this.chatService.chatClient.nickname );
    }
  }

  handleSendTyping(): void{
    this.messageFc.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500)
      )
      .subscribe((value) => {
        this.chatService.sendTyping(value.length > 0);
      });
  }

  handleListenForConnect(): void {
    this.chatService.listenForConnect()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((id) => {
        const cid = this.loginService.getClientId();
        if (this.loginService.getClientId()){
          this.chatService.connectClient(cid);
        }
        this.socketId = id;
        console.log('id', id);
      });
  }

  handleListenForDisconnect(): void{
    this.chatService.listenForDisconnect()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((id) => {
        this.socketId = id;
        console.log('disconnect id', id);
      });
  }

  ngOnDestroy(): void {
    console.log('Destroyed');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  sendMessage(): void {
    console.log(this.messageFc.value + 'frontend');
    this.chatService.sendMessage(this.messageFc.value);
    this.messageFc.patchValue('');
  }

  confirmName(): void {
    if (this.nameFC.value) {
      this.chatService.sendName(this.nameFC.value);
    }
  }

  getTime(): any{
    const latestDate = this.datepipe.transform(this.myDate, 'dd')
                          + ' ' + this.monthNames[this.myDate.getMonth()]
                          + ' ' + this.datepipe.transform(this.myDate, 'yyyy' );
    return latestDate;
  }

  handleListenForMessages(): void{
    this.chatService.listenForMessages()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(message => {
        this.messages.push(message);
      });
  }

  handleListenForWelcomeDTO(): void{
    this.chatService.listenForWelcome().
    pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(welcome => {
        this.messages = welcome.messages;
        this.chatClient = this.chatService.chatClient = welcome.client;
        this.loginService.saveClientId(this.chatClient.id);
      });
  }
}

import { ChatClient } from './chat-client.model';

export interface ChatMessage {
  messageText: string;
  client: ChatClient;
}

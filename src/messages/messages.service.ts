import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  messages: Message[] = [
    { name: 'John Doe', message: 'Hello World!' },
  ];
  clientToUser = {};

  indetify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;
    return Object.values(this.clientToUser);
  }

  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }

  create(createMessageDto: CreateMessageDto, clientId: string) {
    console.log(createMessageDto);

    const message = { name: this.clientToUser[clientId], message: createMessageDto.message };
    this.messages.push(message);

    return message;
  }

  findAll(): Message[] {
    return this.messages;
  }
}

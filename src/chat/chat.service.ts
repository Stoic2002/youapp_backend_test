import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from './schemas/message.schema';
import { Chat } from './schemas/chat.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Message') private messageModel: Model<Message>,
    @InjectModel('Chat') private ChatModel: Model<Chat>
  ) {}

  async getOrCreateChat(participants: string[]): Promise<Chat> {
    participants.sort();
  
    let Chat = await this.ChatModel.findOne({ participants: { $all: participants } }).exec();
  
    if (!Chat) {
      Chat = new this.ChatModel({ participants });
      await Chat.save();
    }
  
    return Chat;
  }

  // Create a message in a Chat
  async createMessage(sender: string, content: string, chatId: any): Promise<Message> {
    const newMessage = new this.messageModel({
      sender,
      content,
      chatId,
    });
    return newMessage.save();
  }

  // Retrieve messages in a Chat
  async getMessages(chatId: string){
    const message = await this.messageModel
      .find({ chatId })
      .sort({time_created : 1})
      .exec();
      return message;
  }
}
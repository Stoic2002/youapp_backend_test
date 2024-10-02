import { Controller, Get, Post, Body, Param, UseGuards, Request, Headers } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Chat')
@Controller('api')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('sendMessage')
  @ApiOperation({ summary: 'Create a new message in a chat' })
  @ApiResponse({ status: 201, description: 'The message has been successfully created.' })
  async createMessage(
    @Body() messageData: { sender: string; receiver: string; content: string }
  ) {
    const chat = await this.chatService.getOrCreateChat([messageData.sender, messageData.receiver]);

    return this.chatService.createMessage(messageData.sender, messageData.content, chat._id);
  }

  @Get('viewMessage/:chatId')
  @ApiOperation({ summary: 'Get all messages for a specific chat' })
  @ApiResponse({ status: 200, description: 'Return all messages for the chat.' })
  async getMessages(@Param('chatId') chatId: string) {
    const message = await this.chatService.getMessages(chatId);
    return message;
  }
}
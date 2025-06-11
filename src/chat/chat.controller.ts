import { Response } from '@/utils/utils';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('chat-with-ai')
  async getMessage(@Body('prompt') prompt: string) {
    try {
      const completion = await this.chatService.getChatAIResponse(prompt);

      return Response(
        'Successfully fetched AI response',
        HttpStatus.OK,
        completion,
      );
    } catch (error) {
      return Response(
        'Error fetching AI response',
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
      );
    }
  }
}

import { bedrockClient } from '@/config/aws.config';
import { InvokeAgentCommand } from '@aws-sdk/client-bedrock-agent-runtime';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaClient) {}

  // =========================================================
  // AI CHAT
  // =========================================================
  async getChatAIResponse(prompt: string) {
    const params = {
      agentId: process.env.BEDROCK_AGENT_ID,
      agentAliasId: process.env.BEDROCK_AGENT_ALIAS_ID,
      sessionId: uuidv4(),
      inputText: `Hãy trả lời bằng tiếng Việt. ${prompt}`,
      maxTokens: 512,
      temperature: 0.7,
    };

    const command = new InvokeAgentCommand(params);

    try {
      const response = await bedrockClient.send(command);

      let fullText = '';

      const decoder = new TextDecoder('utf-8');

      for await (const part of response.completion!) {
        if ('chunk' in part && part.chunk?.bytes) {
          const text = decoder.decode(part.chunk.bytes);
          fullText += text;
        }
      }

      const finalMessage = fullText.split('\n').pop()?.trim();

      if (!finalMessage) {
        throw new Error('Empty or invalid response from agent');
      }

      return finalMessage;
    } catch (error) {
      console.log('Error calling AWS Bedrock Agent:', error);
      throw new Error('Failed to get AI response');
    }
  }

  // =========================================================
  // GET OR CREATE CONVERSATION
  // =========================================================
  async getOrCreateConversation(userA: number, userB: number) {
    const low = Math.min(userA, userB);
    const high = Math.max(userA, userB);

    let conversation = await this.prisma.direct_conversations.findFirst({
      where: {
        user_low_id: low,
        user_high_id: high,
      },
    });

    if (!conversation) {
      conversation = await this.prisma.direct_conversations.create({
        data: {
          user_low_id: low,
          user_high_id: high,
          created_at: new Date(),
          unread_count: 0,
        } as any,
      });

      // init read rows
      await this.prisma.direct_conversation_reads.createMany({
        data: [
          {
            conversation_id: conversation.conversation_id,
            user_id: low,
          },
          {
            conversation_id: conversation.conversation_id,
            user_id: high,
          },
        ],
      });
    }

    return conversation;
  }

  // =========================================================
  // CREATE MESSAGE
  // =========================================================
  async createMessage(senderId: number, receiverId: number, content: string) {
    const conversation = await this.getOrCreateConversation(
      senderId,
      receiverId,
    );

    const message = await this.prisma.direct_messages.create({
      data: {
        conversation_id: conversation.conversation_id,
        sender_id: senderId,
        content,
        created_at: new Date(),
      } as any,
    });

    await this.prisma.direct_conversations.update({
      where: {
        conversation_id: conversation.conversation_id,
      },
      data: {
        last_message: content,
        last_message_at: new Date(),
        unread_count: {
          increment: 1,
        },
      },
    });

    return {
      conversation,
      message,
    };
  }

  // =========================================================
  // GET MESSAGES
  // =========================================================
  async getMessages(conversationId: number, userId: number) {
    const conversation = await this.prisma.direct_conversations.findFirst({
      where: {
        conversation_id: conversationId,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const isMember =
      conversation.user_low_id === userId ||
      conversation.user_high_id === userId;

    if (!isMember) {
      throw new ForbiddenException('You are not in this conversation');
    }

    return this.prisma.direct_messages.findMany({
      where: {
        conversation_id: conversationId,
      },
      orderBy: {
        message_id: 'asc',
      },
    });
  }

  // =========================================================
  // MARK AS SEEN
  // =========================================================
  async markAsSeen(conversationId: number, userId: number, messageId: number) {
    const conversation = await this.prisma.direct_conversations.findFirst({
      where: {
        conversation_id: conversationId,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const isMember =
      conversation.user_low_id === userId ||
      conversation.user_high_id === userId;

    if (!isMember) {
      throw new ForbiddenException('You are not in this conversation');
    }

    await this.prisma.direct_conversation_reads.upsert({
      where: {
        conversation_id_user_id: {
          conversation_id: conversationId,
          user_id: userId,
        },
      },
      create: {
        conversation_id: conversationId,
        user_id: userId,
        last_read_message_id: messageId,
      },
      update: {
        last_read_message_id: messageId,
      },
    });

    return this.prisma.direct_conversations.update({
      where: {
        conversation_id: conversationId,
      },
      data: {
        unread_count: 0,
      },
    });
  }

  // =========================================================
  // GET MY CONVERSATIONS
  // =========================================================
  async getMyConversations(userId: number) {
    return this.prisma.direct_conversations.findMany({
      where: {
        OR: [
          {
            user_low_id: userId,
          },
          {
            user_high_id: userId,
          },
        ],
      },
      orderBy: {
        last_message_at: 'desc',
      },
    });
  }

  // =========================================================
  // GET CONVERSATION BY USERS
  // =========================================================
  async getConversationByUsers(userA: number, userB: number) {
    const low = Math.min(userA, userB);
    const high = Math.max(userA, userB);

    return this.prisma.direct_conversations.findFirst({
      where: {
        user_low_id: low,
        user_high_id: high,
      },
    });
  }
}

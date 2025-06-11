import { bedrockClient } from '@/config/aws.config';
import { InvokeAgentCommand } from '@aws-sdk/client-bedrock-agent-runtime';
import { Injectable, Response } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ChatService {
  // Hàm xử lý phản hồi từ AWS Bedrock
  async getChatAIResponse(prompt: string) {
    const params = {
      agentId: process.env.BEDROCK_AGENT_ID,
      agentAliasId: process.env.BEDROCK_AGENT_ALIAS_ID,
      sessionId: uuidv4(),
      inputText: `Hãy trả lời bằng tiếng Việt. ${prompt}`,
      maxTokens: 512, // Giới hạn số token trả về
      temperature: 0.7, // Điều chỉnh độ sáng tạo của phản hồi
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

      // ⚠️ Cắt phần tiếng Việt: lấy đoạn sau cùng sau dấu xuống dòng cuối cùng
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
}

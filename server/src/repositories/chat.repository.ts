import { ChatMessage, ChatSession, PrismaClient, RoleEnum } from 'generated/prisma';

import prisma from '@app/lib/prisma';

export default class ChatRepository {
  private readonly _prisma: PrismaClient;

  constructor() {
    this._prisma = prisma;
  }

  async createChatSession(userId: string): Promise<ChatSession> {
    const chatSession = await this._prisma.chatSession.create({
      data: {
        userId,
      },
    });
    return chatSession;
  }

  async createAnonymousChatSession(anonymousId: string): Promise<ChatSession> {
    const chatSession = await this._prisma.chatSession.create({
      data: {
        anonymousId,
        isActive: true,
      },
    });
    return chatSession;
  }

  async updateChatSessionFromAnonymousToUser(anonymousId: string, loggedInUserId: string): Promise<void> {
    await this._prisma.chatSession.updateMany({
      where: {
        anonymousId,
        userId: null,
      },
      data: {
        userId: loggedInUserId,
        isActive: true,
      },
    });
  }

  async mergeChatSession(userSessionId: string, anonymousSessionId: string): Promise<void> {
    await this._prisma.chatMessage.updateMany({
      where: {
        sessionId: anonymousSessionId,
      },
      data: {
        sessionId: userSessionId,
      },
    });
  }

  async getActiveChatSessionByUserId(userId: string): Promise<ChatSession | null> {
    const chatSession = await this._prisma.chatSession.findFirst({
      where: {
        userId,
        isActive: true,
      },
    });
    return chatSession;
  }

  async getActiveChatSessionByAnonymousId(anonymousId: string): Promise<ChatSession | null> {
    const chatSession = await this._prisma.chatSession.findFirst({
      where: {
        anonymousId,
        isActive: true,
        userId: null,
      },
    });
    return chatSession;
  }

  async getChatSession(sessionId: string): Promise<ChatSession | null> {
    const chatSession = await this._prisma.chatSession.findUnique({
      where: {
        id: sessionId,
      },
    });
    return chatSession;
  }

  async endChatSession(sessionId: string): Promise<void> {
    await this._prisma.chatSession.update({
      where: { id: sessionId },
      data: { isActive: false },
    });
  }

  async endChatSessionByUserId(userId: string): Promise<void> {
    await this._prisma.chatSession.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false, endedAt: new Date() },
    });
  }

  async endChatSessionByAnonymousId(anonymousId: string): Promise<void> {
    await this._prisma.chatSession.updateMany({
      where: { anonymousId, isActive: true },
      data: { isActive: false, endedAt: new Date() },
    });
  }

  async createChatMessage(sessionId: string, content: string, role: RoleEnum): Promise<ChatMessage> {
    const chatMessage = await this._prisma.chatMessage.create({
      data: {
        sessionId,
        content,
        role,
      },
    });
    return chatMessage;
  }

  async getChatMessagesBySessionId(sessionId: string): Promise<ChatMessage[]> {
    const chatMessages = await this._prisma.chatMessage.findMany({
      where: {
        sessionId,
      },
    });
    return chatMessages;
  }
}

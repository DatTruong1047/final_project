// import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages';
// import { BaseListChatMessageHistory } from '@langchain/core/dist/chat_history';
// import ChatRepository from '@app/repositories/chat.repository';
// import { RoleEnum } from 'generated/prisma';

// export class DatabaseChatMessageHistory extends BaseListChatMessageHistory {
//   private readonly _sessionId: string;
//   private readonly _chatRepository: ChatRepository;

//   constructor(sessionId: string, chatRepository: ChatRepository) {
//     super();
//     this._sessionId = sessionId;
//     this._chatRepository = chatRepository;
//   }

//   override async getMessages(): Promise<BaseMessage[]> {
//     const messagesFromDB = await this._chatRepository.getChatMessagesBySessionId(this._sessionId, 1000, 0);

//     return messagesFromDB.map((message) => {
//       if (message.role === RoleEnum.User) {
//         return new HumanMessage(message.content);
//       } else {
//         return new AIMessage(message.content);
//       }
//     });
//   }

// }

import { FastifyRequest, FastifyReply } from 'fastify';

import { EmailTokenPayloadType, ErrorResponseType, SuccessResponseType, SuccessResWithoutDataType, TokenPayloadType } from './models';

declare module 'fastify' {
  interface FastifyInstance {
    verifyToken: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    verifyAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    verifyRefreshToken: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    verifyEmailToken: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module 'fastify' {
  interface FastifyReply {
    NotFound(err: ErrorResponseType): FastifyReply;
    BadRequest(err: ErrorResponseType): FastifyReply;
    Unauthorized(err: ErrorResponseType): FastifyReply;
    Forbidden(err: ErrorResponseType): FastifyReply;
    Conflict(err: ErrorResponseType): FastifyReply;

    OK<T>(res: T | SuccessResponseType<T> | SuccessResWithoutDataType): FastifyReply;
    Created<T>(res: SuccessResponseType<T> | SuccessResWithoutDataType): FastifyReply;

    InternalServer(err: Error): FastifyReply;
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    decodedEmailToken: EmailTokenPayloadType;
    decodeAccessToken: TokenPayloadType;
    // uploadedFile?: FileType;
  }
}

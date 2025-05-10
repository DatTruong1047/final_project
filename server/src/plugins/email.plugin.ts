import { FastifyRequest, FastifyReply, FastifyPluginAsync } from 'fastify';
import fastifuPlugin from 'fastify-plugin';

import * as config from '@config';
import { EmailTokenPayloadType, ErrorResponseType } from '@model';

import app from '@app/app';
import { VerifyEmailTokenType } from '@app/models/email.schema';

export async function verifyEmailToken(
  request: FastifyRequest<{ Body: VerifyEmailTokenType }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const { token } = request.body;

    if (!token) {
      const errorResponse: ErrorResponseType = {
        message: 'Token is not found',
        code: config.ErrorCodes.EMAIL_TOKEN_NOT_FOUND,
      };
      return reply.NotFound(errorResponse);
    }

    const decoded: EmailTokenPayloadType = app.jwt.verify(token);

    request.decodedEmailToken = decoded;
  } catch (error) {
    const errorResponse: ErrorResponseType = {
      message: error.message,
      code: config.ErrorCodes.INVALID_EMAIL_TOKEN,
    };
    return reply.BadRequest(errorResponse);
  }
}

const emailPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('verifyEmailToken', verifyEmailToken);
};

export default fastifuPlugin(emailPlugin);

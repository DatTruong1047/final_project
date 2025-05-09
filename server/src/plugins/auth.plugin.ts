import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import { ErrorCodes } from '@config';

import app from '@app/app';
import { ErrorResponseType, RefreshTokenRequestType, TokenPayloadType } from '@app/models';

export async function verifyToken(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const decoded: TokenPayloadType = await request.jwtVerify();
    request.decodedAccessToken = decoded;
    return;
  } catch (error) {
    const errorResponse: ErrorResponseType = {
      message: error.message,
      code: ErrorCodes.UNAUTHORIZED,
    };
    return reply.Unauthorized(errorResponse);
  }
}

export async function verifyRefreshToken(
  request: FastifyRequest<{ Body: RefreshTokenRequestType }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const { refreshToken } = request.body;

    if (!refreshToken) {
      const errorResponse: ErrorResponseType = {
        message: 'Refresh token is required',
        code: ErrorCodes.REFRESH_TOKEN_IS_NULL,
      };
      return reply.BadRequest(errorResponse);
    }

    app.jwt.verify(refreshToken);
    return;
  } catch (error) {
    const errorResponse: ErrorResponseType = {
      message: error.message,
      code: ErrorCodes.INVALID_REFRESH_TOKEN,
    };
    return reply.BadRequest(errorResponse);
  }
}

async function verifyAdmin(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  if (request.decodedAccessToken && !request.decodedAccessToken.isAdmin) {
    const errorResponse: ErrorResponseType = {
      message: 'You dont have permission',
      code: ErrorCodes.DONT_HAVE_PERMISSION,
    };
    return reply.Forbidden(errorResponse);
  }
}

const authPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.decorate('verifyToken', verifyToken);
  fastify.decorate('verifyRefreshToken', verifyRefreshToken);
  fastify.decorate('verifyAdmin', verifyAdmin);
};

export default fastifyPlugin(authPlugin);

import { ErrorCodes } from '@app/config';
import { ErrorResponseType } from '@app/models';
import { FastifyInstance, FastifyPluginAsync, FastifyReply } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

const errorHandlerPlugin: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  fastify.decorate('handleErrorResponse', (error: Error, reply: FastifyReply): FastifyReply => {
    console.log(`Error: ${error}`);
    const errorResponse: ErrorResponseType = {
      code: ErrorCodes.SERVER_ERROR,
      message: error.message || 'Internal server error',
    };
    return reply.InternalServer(errorResponse);
  });
};

export default fastifyPlugin(errorHandlerPlugin);

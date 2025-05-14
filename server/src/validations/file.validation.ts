import { FastifyReply, FastifyRequest } from 'fastify';

import { ErrorCodes } from '@app/config';
import { ErrorResponseType } from '@app/models';
import { getFile } from '@app/utils/file.util';

export async function uploadFile(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const part = await request.file();

    const result = await getFile(part);

    if (!result.success) {
      const errRes: ErrorResponseType = {
        message: result.message,
        code: result.code,
      };

      switch (result.code) {
        case ErrorCodes.SERVER_ERROR:
          reply.InternalServer(new Error(result.message));
          return;
        default:
          reply.BadRequest(errRes);
          return;
      }
    }

    request.uploadedFile = result.data;
  } catch (error) {
    reply.InternalServer(error);
    return;
  }
}
